import { browser } from '$app/environment';
import { clearSupertonicAssets } from './model-assets';
import { ttsClient } from './tts-client';
import type {
	BackendPreference,
	DeviceCapabilities,
	LoadProgress,
	SpeechBackend,
	SynthesisResult
} from './types';

export type SupertonicStatus = 'idle' | 'loading' | 'ready' | 'error';

const INSTALLED_KEY = 'accrev:supertonic-installed';

class SupertonicEngine {
	status = $state<SupertonicStatus>('idle');
	progress = $state(0);
	note = $state<string | null>(null);
	error = $state<string | null>(null);
	errorDetail = $state<string | null>(null);
	backend = $state<SpeechBackend | null>(null);
	installed = $state(false);
	capabilities = $state<DeviceCapabilities | null>(null);
	generationProgress = $state(0);

	#loadPromise: Promise<void> | null = null;

	constructor() {
		if (browser) this.installed = localStorage.getItem(INSTALLED_KEY) === 'true';
	}

	get available(): boolean {
		return browser && typeof Worker !== 'undefined' && typeof AudioContext !== 'undefined';
	}

	get isReady(): boolean {
		return this.status === 'ready' && ttsClient.modelLoaded;
	}

	async probeCapabilities(): Promise<DeviceCapabilities> {
		if (this.capabilities) return this.capabilities;
		this.capabilities = await ttsClient.capabilities();
		return this.capabilities;
	}

	async load(
		preference: BackendPreference = 'auto',
		onProgress?: (update: LoadProgress) => void
	): Promise<void> {
		if (!browser) throw new Error('Supertonic speech is browser-only.');
		if (!this.available) throw new Error('This browser cannot run the local speech engine.');
		if (
			ttsClient.modelLoaded &&
			this.status === 'ready' &&
			(preference === 'auto' || preference === ttsClient.backend)
		) {
			return;
		}
		if (this.#loadPromise) return this.#loadPromise;
		this.#loadPromise = this.#doLoad(preference, onProgress);
		try {
			await this.#loadPromise;
		} finally {
			this.#loadPromise = null;
		}
	}

	async #doLoad(
		preference: BackendPreference,
		onProgress?: (update: LoadProgress) => void
	): Promise<void> {
		this.status = 'loading';
		this.progress = 0;
		this.note = 'Preparing Supertonic 3…';
		this.error = null;
		this.errorDetail = null;
		try {
			try {
				if (!(await navigator.storage.persisted())) await navigator.storage.persist();
			} catch {
				// Persistent storage is an optimization; Cache Storage still works.
			}
			await ttsClient.load(preference, (update) => {
				this.progress = update.progress;
				this.note = update.file ?? update.status;
				onProgress?.(update);
			});
			this.backend = ttsClient.backend;
			this.progress = 100;
			this.note = `Ready on ${ttsClient.backend.toUpperCase()}`;
			this.status = 'ready';
			this.installed = true;
			localStorage.setItem(INSTALLED_KEY, 'true');
		} catch (error) {
			if (error instanceof DOMException && error.name === 'AbortError') {
				this.status = 'idle';
				this.progress = 0;
				this.note = null;
				throw error;
			}
			this.status = 'error';
			this.note = null;
			this.error =
				error instanceof Error ? error.message : 'The local voice engine could not be installed.';
			this.errorDetail = this.error;
			throw error;
		}
	}

	async generate(
		text: string,
		options: {
			voice: string;
			language: string;
			steps: number;
			speed: number;
			backend?: BackendPreference;
			signal?: AbortSignal;
		}
	): Promise<SynthesisResult> {
		await this.load(options.backend ?? 'auto');
		this.generationProgress = 0;
		try {
			return await ttsClient.synthesize(
				text,
				options.voice,
				options.language,
				options.steps,
				options.speed,
				options.signal,
				(update) => {
					this.generationProgress = update.progress;
				}
			);
		} finally {
			this.generationProgress = 0;
		}
	}

	cancelLoad(): void {
		ttsClient.cancelAll();
		this.#loadPromise = null;
		this.status = 'idle';
		this.progress = 0;
		this.note = null;
	}

	async remove(): Promise<void> {
		await ttsClient.dispose();
		await clearSupertonicAssets();
		this.status = 'idle';
		this.progress = 0;
		this.note = null;
		this.error = null;
		this.backend = null;
		this.installed = false;
		localStorage.removeItem(INSTALLED_KEY);
	}
}

export const supertonic = new SupertonicEngine();
