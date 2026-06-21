import { browser } from '$app/environment';

/**
 * User preference for the app-wide "read aloud" buttons (glossary, flashcards,
 * interview, word cards, the review book).
 *
 * - 'model'   — the on-device Kokoro "Heart" voice: warm and natural, but loads
 *               a small model on first use and only runs on desktop.
 * - 'browser' — the operating system's built-in speech: instant, no download.
 *
 * The story audiobook always uses the on-device model and is unaffected by this.
 */

export type VoiceEngine = 'model' | 'browser';

const STORAGE_KEY = 'accrev:voice-engine';

class VoicePref {
	engine = $state<VoiceEngine>('model');

	constructor() {
		if (!browser) return;
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === 'model' || stored === 'browser') this.engine = stored;

		$effect.root(() => {
			$effect(() => {
				localStorage.setItem(STORAGE_KEY, this.engine);
			});
		});
	}

	set(engine: VoiceEngine) {
		this.engine = engine;
	}
}

export const voicePref = new VoicePref();
