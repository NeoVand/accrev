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
	{ id: 'af_heart', label: 'Heart (US)', gender: 'f' },
	{ id: 'af_bella', label: 'Bella (US)', gender: 'f' },
	{ id: 'af_nicole', label: 'Nicole (US)', gender: 'f' },
	{ id: 'am_michael', label: 'Michael (US)', gender: 'm' },
	{ id: 'am_fenrir', label: 'Fenrir (US)', gender: 'm' },
	{ id: 'bf_emma', label: 'Emma (UK)', gender: 'f' },
	{ id: 'bm_george', label: 'George (UK)', gender: 'm' }
];

export const DEFAULT_VOICE = 'af_heart';

const MODEL_ID = 'onnx-community/Kokoro-82M-v1.0-ONNX';

export type RawAudio = { audio: Float32Array; sampling_rate: number };

type TtsLike = { generate: (t: string, o: { voice: string }) => Promise<RawAudio> };

class KokoroModel {
	status = $state<ModelStatus>('idle');
	/** Aggregate download progress 0–100 across all model files (first load only). */
	progress = $state(0);
	device = $state<'webgpu' | 'wasm' | null>(null);
	error = $state<string | null>(null);
	/** Technical detail of the failure (for logs / debug). */
	errorDetail = $state<string | null>(null);
	/** Human-readable phase note shown while loading (download / init / fallback). */
	note = $state<string | null>(null);

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
		const { KokoroTTS } = await import('kokoro-js');

		const ua = navigator.userAgent;
		const isMobile =
			/Android|iPhone|iPad|iPod|Mobile|IEMobile|Opera Mini/i.test(ua) ||
			(navigator as unknown as { userAgentData?: { mobile?: boolean } }).userAgentData?.mobile ===
				true;
		const hasWebGPU = typeof navigator !== 'undefined' && 'gpu' in navigator;

		// iOS Safari exposes WebGPU, but onnxruntime's WebGPU backend currently
		// LOADS then hangs on inference there — so on iOS we use WASM first
		// (reliable) and keep WebGPU only as a last resort. Elsewhere, WebGPU first
		// (fp32 desktop / q8 mobile), with a warm-up guard that falls back if a
		// device loads but can't actually generate.
		const isIOS =
			/iP(ad|hone|od)/.test(ua) || (/Macintosh/.test(ua) && (navigator.maxTouchPoints ?? 0) > 1);

		type Attempt = { device: 'webgpu' | 'wasm'; dtype: 'fp32' | 'q8' };
		const attempts: Attempt[] = [];
		if (hasWebGPU && !isIOS) attempts.push({ device: 'webgpu', dtype: isMobile ? 'q8' : 'fp32' });
		attempts.push({ device: 'wasm', dtype: 'q8' });
		if (hasWebGPU && isIOS) attempts.push({ device: 'webgpu', dtype: 'q8' });

		console.info('[kokoro] loading', { isMobile, isIOS, hasWebGPU, attempts });

		let lastErr: unknown = null;
		for (const a of attempts) {
			try {
				this.device = a.device;
				this.#files = {};
				this.progress = 0;
				this.note = `Loading (${a.device})…`;
				console.info('[kokoro] attempt', a.device, a.dtype);
				const loadP = KokoroTTS.from_pretrained(MODEL_ID, {
					dtype: a.dtype,
					device: a.device,
					progress_callback: this.#onProgress
				});
				const tts = await this.#withInitTimeout(loadP, a.device);
				// Validate the pipeline can actually GENERATE on this device. iOS
				// WebGPU commonly loads fine but then hangs/throws on inference — so
				// "ready" isn't enough; we run a tiny warm-up (which also primes the
				// phonemizer) and only accept the device if it produces audio.
				this.note = `Warming up (${a.device})…`;
				console.info('[kokoro] warmup', a.device, a.dtype);
				await this.#withTimeout(
					(tts as TtsLike).generate('The accrual world.', { voice: DEFAULT_VOICE }),
					15000,
					`${a.device} generate`
				);
				this.#tts = tts;
				this.progress = 100;
				this.note = null;
				this.status = 'ready';
				console.info('[kokoro] ready', a.device, a.dtype);
				return tts;
			} catch (e) {
				lastErr = e;
				console.warn('[kokoro] attempt failed', a.device, a.dtype, e);
			}
		}
		this.status = 'error';
		this.note = null;
		this.error =
			'The on-device voice engine couldn’t start here. This is a known iOS Safari limitation — the audiobook works on a desktop browser for now.';
		this.errorDetail = lastErr instanceof Error ? lastErr.message : String(lastErr);
		this.#loadPromise = null;
		console.error('[kokoro] all attempts failed', lastErr);
		throw lastErr;
	}

	// Reject if a device session hangs (download hit 100% but init never finishes)
	// so the loop can fall back to the next device. The hung promise is abandoned;
	// the `settled` guard prevents a late double-settle.
	#withInitTimeout<T>(loadP: Promise<T>, device: string): Promise<T> {
		const INIT_TIMEOUT_MS = 20000;
		return new Promise<T>((resolve, reject) => {
			let settled = false;
			let reached100At = 0;
			const iv = setInterval(() => {
				if (this.progress >= 100) {
					if (!reached100At) {
						reached100At = Date.now();
						this.note = `Preparing model (${device})…`;
					} else if (Date.now() - reached100At > INIT_TIMEOUT_MS) {
						settled = true;
						clearInterval(iv);
						console.warn('[kokoro] init timed out after download on', device);
						reject(new Error(`${device} init timed out`));
					}
				}
			}, 1000);
			loadP.then(
				(v) => {
					if (settled) return;
					settled = true;
					clearInterval(iv);
					resolve(v);
				},
				(e) => {
					if (settled) return;
					settled = true;
					clearInterval(iv);
					reject(e);
				}
			);
		});
	}

	// Reject if a promise (the warm-up generate) doesn't settle in time, so a
	// device that loads but can't run inference is rejected and falls back.
	#withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			let settled = false;
			const to = setTimeout(() => {
				if (settled) return;
				settled = true;
				console.warn('[kokoro] timed out:', label);
				reject(new Error(`${label} timed out`));
			}, ms);
			p.then(
				(v) => {
					if (settled) return;
					settled = true;
					clearTimeout(to);
					resolve(v);
				},
				(e) => {
					if (settled) return;
					settled = true;
					clearTimeout(to);
					reject(e);
				}
			);
		});
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
