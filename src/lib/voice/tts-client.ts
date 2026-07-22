/** Worker client adapted from NeoVand/voicebook (MIT). */
import { SUPERTONIC_MODEL } from './catalog';
import type { TtsWorkerRequest, TtsWorkerResponse } from './messages';
import { normalizeGenerationSteps, normalizeSynthesisSpeed } from './synthesis';
import type {
	BackendPreference,
	DeviceCapabilities,
	LoadProgress,
	SpeechBackend,
	SynthesisResult
} from './types';

interface PendingRequest {
	resolve: (message: TtsWorkerResponse) => void;
	reject: (error: Error) => void;
	progress?: (update: LoadProgress) => void;
}

export class TtsClient {
	private worker?: Worker;
	private pending = new Map<string, PendingRequest>();
	private timeoutsSinceLastResult = 0;
	modelLoaded = false;
	backend: SpeechBackend = 'wasm';

	private ensureWorker(): Worker {
		if (!this.worker) {
			const speechWorker = new Worker(new URL('./tts.worker.ts', import.meta.url), {
				type: 'module',
				name: 'accrev-supertonic-tts'
			});
			this.worker = speechWorker;
			speechWorker.addEventListener('message', (event: MessageEvent<TtsWorkerResponse>) =>
				this.receive(event.data)
			);
			speechWorker.addEventListener('error', (event) => {
				for (const request of this.pending.values()) {
					request.reject(new Error(event.message || 'The speech worker stopped unexpectedly.'));
				}
				this.pending.clear();
				if (this.worker === speechWorker) {
					speechWorker.terminate();
					this.worker = undefined;
					this.modelLoaded = false;
				}
			});
		}
		return this.worker;
	}

	private receive(message: TtsWorkerResponse): void {
		const request = this.pending.get(message.requestId);
		if (!request) return;
		if (message.type === 'progress') {
			request.progress?.(message);
			return;
		}
		this.pending.delete(message.requestId);
		if (message.type === 'gpu-lost') {
			this.modelLoaded = false;
			request.reject(new Error(message.message));
		} else if (message.type === 'error') {
			request.reject(new Error(message.message));
		} else {
			request.resolve(message);
		}
	}

	private request(
		message: TtsWorkerRequest,
		progress?: (update: LoadProgress) => void
	): Promise<TtsWorkerResponse> {
		return new Promise((resolve, reject) => {
			this.pending.set(message.requestId, { resolve, reject, progress });
			this.ensureWorker().postMessage(message);
		});
	}

	async capabilities(): Promise<DeviceCapabilities> {
		const response = await this.request({ type: 'capabilities', requestId: crypto.randomUUID() });
		if (response.type !== 'capabilities') {
			throw new Error('The speech worker returned an invalid capability response.');
		}
		return response.capabilities;
	}

	async load(
		backend: BackendPreference = 'auto',
		progress?: (update: LoadProgress) => void
	): Promise<void> {
		const response = await this.request(
			{ type: 'load', requestId: crypto.randomUUID(), modelId: SUPERTONIC_MODEL.id, backend },
			progress
		);
		if (response.type !== 'loaded') {
			throw new Error('The speech worker did not finish loading.');
		}
		this.modelLoaded = true;
		this.backend = response.backend;
	}

	async synthesize(
		text: string,
		voiceId: string,
		language: string,
		totalSteps: number,
		speed: number,
		signal?: AbortSignal,
		progress?: (update: LoadProgress) => void
	): Promise<SynthesisResult> {
		if (signal?.aborted) throw new DOMException('Speech generation was canceled.', 'AbortError');
		const requestId = crypto.randomUUID();
		const abort = () => {
			this.worker?.postMessage({ type: 'cancel', requestId } satisfies TtsWorkerRequest);
			const pending = this.pending.get(requestId);
			pending?.reject(new DOMException('Speech generation was canceled.', 'AbortError'));
			this.pending.delete(requestId);
		};
		signal?.addEventListener('abort', abort, { once: true });
		const timeout = globalThis.setTimeout(() => {
			const pending = this.pending.get(requestId);
			if (!pending) return;
			this.timeoutsSinceLastResult += 1;
			this.worker?.postMessage({ type: 'cancel', requestId } satisfies TtsWorkerRequest);
			this.pending.delete(requestId);
			pending.reject(
				new Error('Speech generation did not finish within 90 seconds, so it was canceled.')
			);
			if (this.timeoutsSinceLastResult > 1) this.cancelAll();
		}, 90_000);
		try {
			const response = await this.request(
				{
					type: 'synthesize',
					requestId,
					text,
					voiceId,
					language,
					totalSteps: normalizeGenerationSteps(totalSteps),
					speed: normalizeSynthesisSpeed(speed)
				},
				progress
			);
			if (response.type !== 'result') {
				throw new Error('The speech worker returned an invalid audio result.');
			}
			this.timeoutsSinceLastResult = 0;
			return {
				audio: response.audio,
				sampleRate: response.sampleRate,
				metrics: response.metrics
			};
		} finally {
			globalThis.clearTimeout(timeout);
			signal?.removeEventListener('abort', abort);
		}
	}

	cancelAll(): void {
		this.timeoutsSinceLastResult = 0;
		const error = new DOMException('Speech generation was canceled.', 'AbortError');
		for (const request of this.pending.values()) request.reject(error);
		this.pending.clear();
		this.worker?.terminate();
		this.worker = undefined;
		this.modelLoaded = false;
	}

	async dispose(): Promise<void> {
		if (!this.worker) return;
		await this.request({ type: 'dispose', requestId: crypto.randomUUID() });
		this.worker.terminate();
		this.worker = undefined;
		this.modelLoaded = false;
	}
}

export const ttsClient = new TtsClient();
