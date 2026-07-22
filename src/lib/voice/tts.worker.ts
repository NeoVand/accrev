/// <reference lib="webworker" />

/** Dedicated Supertonic worker adapted from NeoVand/voicebook (MIT). */
import { SUPERTONIC_MODEL } from './catalog';
import { createHuggingFaceFetch } from './huggingface-fetch';
import type { TtsWorkerRequest, TtsWorkerResponse } from './messages';
import { currentSpeechRuntimePolicy } from './runtime-policy';
import { SupertonicAdapter } from './supertonic-adapter';
import type { DeviceCapabilities, SpeechBackend } from './types';

const worker = self as unknown as DedicatedWorkerGlobalScope;
const hubFetch = createHuggingFaceFetch(globalThis.fetch.bind(globalThis));

interface ProgressEvent {
	status?: string;
	file?: string;
	progress?: number;
	loaded?: number;
	total?: number;
}

let supertonic: SupertonicAdapter | undefined;
let activeBackend: SpeechBackend = 'wasm';
let modelLoaded = false;
const canceled = new Set<string>();
let operationChain: Promise<void> = Promise.resolve();

function send(message: TtsWorkerResponse, transfer: Transferable[] = []): void {
	worker.postMessage(message, transfer);
}

async function capabilities(): Promise<DeviceCapabilities> {
	const policy = currentSpeechRuntimePolicy();
	let webgpu = false;
	try {
		if (policy.allowWebGpu && navigator.gpu) {
			webgpu = Boolean(await navigator.gpu.requestAdapter());
		}
	} catch {
		webgpu = false;
	}
	return { webgpu, backend: webgpu ? 'webgpu' : 'wasm' };
}

async function disposeCurrent(): Promise<void> {
	await supertonic?.dispose();
	supertonic = undefined;
	modelLoaded = false;
}

async function loadModel(message: Extract<TtsWorkerRequest, { type: 'load' }>): Promise<void> {
	if (message.modelId !== SUPERTONIC_MODEL.id) throw new Error(`Unknown model: ${message.modelId}`);
	const device = await capabilities();
	const backend = message.backend === 'auto' ? device.backend : message.backend;
	if (backend === 'webgpu' && !device.webgpu) {
		throw new Error('WebGPU is not available on this device. Choose the WASM fallback.');
	}
	if (modelLoaded && activeBackend === backend) {
		send({ type: 'loaded', requestId: message.requestId, modelId: message.modelId, backend });
		return;
	}
	await disposeCurrent();
	activeBackend = backend;
	const progress = (event: unknown) => {
		const info = event as ProgressEvent;
		send({
			type: 'progress',
			requestId: message.requestId,
			status: info.status ?? 'loading',
			file: info.file,
			progress: Math.max(0, Math.min(100, info.progress ?? 0)),
			loaded: info.loaded,
			total: info.total
		});
	};
	supertonic = new SupertonicAdapter(SUPERTONIC_MODEL, hubFetch, currentSpeechRuntimePolicy());
	await supertonic.load(backend, progress);
	modelLoaded = true;
	send({ type: 'loaded', requestId: message.requestId, modelId: message.modelId, backend });
}

async function synthesize(
	message: Extract<TtsWorkerRequest, { type: 'synthesize' }>
): Promise<void> {
	const startedAt = performance.now();
	if (canceled.delete(message.requestId)) return;
	if (!modelLoaded || !supertonic) throw new Error('Load the voice model before playing.');
	send({ type: 'progress', requestId: message.requestId, status: 'Preparing text…', progress: 2 });
	let result: Awaited<ReturnType<SupertonicAdapter['synthesize']>>;
	try {
		result = await supertonic.synthesize(
			message.text,
			message.voiceId,
			message.language,
			(step, total) =>
				send({
					type: 'progress',
					requestId: message.requestId,
					status: `Generating speech · ${step} of ${total}`,
					progress: (step / total) * 100
				}),
			message.totalSteps,
			message.speed,
			() => canceled.has(message.requestId)
		);
	} catch (error) {
		if (error instanceof DOMException && error.name === 'AbortError') {
			canceled.delete(message.requestId);
			return;
		}
		throw error;
	}
	if (canceled.delete(message.requestId)) return;
	const audio = result.audio;
	const audioDuration = audio.length / result.sampleRate;
	send(
		{
			type: 'result',
			requestId: message.requestId,
			audio,
			sampleRate: result.sampleRate,
			metrics: { elapsedMs: performance.now() - startedAt, audioDuration, backend: activeBackend }
		},
		[audio.buffer]
	);
}

worker.addEventListener('message', (event: MessageEvent<TtsWorkerRequest>) => {
	const message = event.data;
	void (async () => {
		try {
			switch (message.type) {
				case 'capabilities':
					send({
						type: 'capabilities',
						requestId: message.requestId,
						capabilities: await capabilities()
					});
					break;
				case 'load':
					operationChain = operationChain.catch(() => undefined).then(() => loadModel(message));
					await operationChain;
					break;
				case 'synthesize':
					operationChain = operationChain.catch(() => undefined).then(() => synthesize(message));
					await operationChain;
					break;
				case 'cancel':
					canceled.add(message.requestId);
					break;
				case 'dispose':
					operationChain = operationChain.catch(() => undefined).then(disposeCurrent);
					await operationChain;
					send({ type: 'disposed', requestId: message.requestId });
					break;
			}
		} catch (error) {
			const detail = error instanceof Error ? error.message : 'Unknown speech engine error';
			if (/device lost|gpu.*lost|webgpu.*lost/i.test(detail)) {
				await disposeCurrent();
				send({ type: 'gpu-lost', requestId: message.requestId, message: detail });
				return;
			}
			send({ type: 'error', requestId: message.requestId, message: detail, recoverable: true });
		}
	})();
});
