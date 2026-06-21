import { browser } from '$app/environment';

/**
 * Singleton loader for the Kokoro TTS model (kokoro-js + transformers.js).
 * The model is downloaded once on first use and cached by transformers.js in
 * the browser's Cache Storage, so later sessions load instantly. Runs entirely
 * on-device — WebGPU when available, WASM otherwise.
 */

export type ModelStatus = 'idle' | 'loading' | 'ready' | 'error';

export type NarratorVoice = {
	id: string;
	label: string;
	gender: 'f' | 'm';
};

// A curated shortlist of strong narrator voices (kokoro-js ships ~28).
export const NARRATOR_VOICES: NarratorVoice[] = [
	{ id: 'af_heart', label: 'Heart — warm US', gender: 'f' },
	{ id: 'af_bella', label: 'Bella — US', gender: 'f' },
	{ id: 'af_nicole', label: 'Nicole — soft US', gender: 'f' },
	{ id: 'am_michael', label: 'Michael — US', gender: 'm' },
	{ id: 'am_fenrir', label: 'Fenrir — US', gender: 'm' },
	{ id: 'bf_emma', label: 'Emma — UK', gender: 'f' },
	{ id: 'bm_george', label: 'George — UK', gender: 'm' }
];

export const DEFAULT_VOICE = 'af_heart';

const MODEL_ID = 'onnx-community/Kokoro-82M-v1.0-ONNX';

export type RawAudio = { audio: Float32Array; sampling_rate: number };

class KokoroModel {
	status = $state<ModelStatus>('idle');
	/** Aggregate download progress 0–100 across all model files (first load only). */
	progress = $state(0);
	device = $state<'webgpu' | 'wasm' | null>(null);
	error = $state<string | null>(null);

	#tts: unknown = null;
	#loadPromise: Promise<unknown> | null = null;
	#files: Record<string, { loaded: number; total: number }> = {};

	get isReady() {
		return this.status === 'ready';
	}

	/** True once the model has been downloaded at least once this session. */
	get loaded() {
		return this.#tts !== null;
	}

	#onProgress = (p: { status?: string; file?: string; loaded?: number; total?: number }) => {
		if (!p || !p.file || typeof p.total !== 'number' || !p.total) return;
		this.#files[p.file] = { loaded: p.loaded ?? 0, total: p.total };
		let loaded = 0;
		let total = 0;
		for (const f of Object.values(this.#files)) {
			loaded += f.loaded;
			total += f.total;
		}
		if (total > 0) this.progress = Math.min(100, Math.round((loaded / total) * 100));
	};

	async load(): Promise<unknown> {
		if (this.#tts) return this.#tts;
		if (this.#loadPromise) return this.#loadPromise;
		if (!browser) throw new Error('Kokoro TTS is browser-only');
		this.#loadPromise = this.#doLoad();
		return this.#loadPromise;
	}

	async #doLoad(): Promise<unknown> {
		this.status = 'loading';
		this.error = null;
		this.progress = 0;
		try {
			const { KokoroTTS } = await import('kokoro-js');
			const hasWebGPU = typeof navigator !== 'undefined' && 'gpu' in navigator;
			const device: 'webgpu' | 'wasm' = hasWebGPU ? 'webgpu' : 'wasm';
			const dtype = device === 'webgpu' ? 'fp32' : 'q8';
			this.device = device;
			const tts = await KokoroTTS.from_pretrained(MODEL_ID, {
				dtype,
				device,
				progress_callback: this.#onProgress
			});
			this.#tts = tts;
			this.progress = 100;
			this.status = 'ready';
			return tts;
		} catch (e) {
			this.status = 'error';
			this.error = e instanceof Error ? e.message : String(e);
			this.#loadPromise = null;
			throw e;
		}
	}

	/** Synthesize one segment of text. Loads the model on first call. */
	async generate(text: string, voice: string): Promise<RawAudio> {
		const tts = (await this.load()) as {
			generate: (t: string, o: { voice: string }) => Promise<RawAudio>;
		};
		const raw = await tts.generate(text, { voice });
		return { audio: raw.audio, sampling_rate: raw.sampling_rate };
	}
}

export const kokoro = new KokoroModel();
