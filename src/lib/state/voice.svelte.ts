import { browser } from '$app/environment';
import { isSupportedLanguage, isSupportedVoice, SUPERTONIC_MODEL } from '$lib/voice/catalog';
import {
	DEFAULT_GENERATION_STEPS,
	DEFAULT_SYNTHESIS_SPEED,
	normalizeGenerationSteps,
	normalizeSynthesisSpeed
} from '$lib/voice/synthesis';
import type { BackendPreference } from '$lib/voice/types';

/**
 * User preference for the app-wide "read aloud" buttons (glossary, flashcards,
 * interview, word cards, the review book).
 *
 * - 'model'   — Supertonic 3 in a dedicated worker (WebGPU or WASM).
 * - 'browser' — the operating system's built-in speech: instant, no download.
 */

export type VoiceEngine = 'model' | 'browser';

const STORAGE_KEY = 'accrev:voice-engine';
const VOICE_KEY = 'accrev:voice-id';
const LANGUAGE_KEY = 'accrev:voice-language';
const STEPS_KEY = 'accrev:voice-generation-steps';
const SPEED_KEY = 'accrev:voice-synthesis-speed';
const BACKEND_KEY = 'accrev:voice-backend';
const LICENSE_KEY = 'accrev:supertonic-license-accepted';

class VoicePref {
	engine = $state<VoiceEngine>('model');
	voiceId = $state(SUPERTONIC_MODEL.defaultVoice);
	language = $state('en');
	generationSteps = $state(DEFAULT_GENERATION_STEPS);
	synthesisSpeed = $state(DEFAULT_SYNTHESIS_SPEED);
	backend = $state<BackendPreference>('auto');
	licenseAccepted = $state(false);

	constructor() {
		if (!browser) return;
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === 'model' || stored === 'browser') this.engine = stored;
		const voice = localStorage.getItem(VOICE_KEY);
		if (voice && isSupportedVoice(voice)) this.voiceId = voice;
		const language = localStorage.getItem(LANGUAGE_KEY);
		if (language && isSupportedLanguage(language)) this.language = language;
		this.generationSteps = normalizeGenerationSteps(localStorage.getItem(STEPS_KEY));
		this.synthesisSpeed = normalizeSynthesisSpeed(localStorage.getItem(SPEED_KEY));
		const backend = localStorage.getItem(BACKEND_KEY);
		if (backend === 'auto' || backend === 'webgpu' || backend === 'wasm') this.backend = backend;
		this.licenseAccepted = localStorage.getItem(LICENSE_KEY) === 'true';
	}

	set(engine: VoiceEngine) {
		this.engine = engine;
		if (browser) localStorage.setItem(STORAGE_KEY, engine);
	}

	setVoice(voiceId: string) {
		if (!isSupportedVoice(voiceId)) return;
		this.voiceId = voiceId;
		if (browser) localStorage.setItem(VOICE_KEY, voiceId);
	}

	setLanguage(language: string) {
		if (!isSupportedLanguage(language)) return;
		this.language = language;
		if (browser) localStorage.setItem(LANGUAGE_KEY, language);
	}

	setGenerationSteps(steps: number) {
		this.generationSteps = normalizeGenerationSteps(steps);
		if (browser) localStorage.setItem(STEPS_KEY, String(this.generationSteps));
	}

	setSynthesisSpeed(speed: number) {
		this.synthesisSpeed = normalizeSynthesisSpeed(speed);
		if (browser) localStorage.setItem(SPEED_KEY, String(this.synthesisSpeed));
	}

	setBackend(backend: BackendPreference) {
		this.backend = backend;
		if (browser) localStorage.setItem(BACKEND_KEY, backend);
	}

	acceptLicense(accepted: boolean) {
		this.licenseAccepted = accepted;
		if (browser) localStorage.setItem(LICENSE_KEY, String(accepted));
	}
}

export const voicePref = new VoicePref();
