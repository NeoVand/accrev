/**
 * Web Speech API pronunciation helper. Free, on-device, works on iOS Safari,
 * Chrome (mobile + desktop), Edge, Firefox. Voice quality varies by device but
 * iOS / macOS ship excellent en-US voices (Samantha, Ava, Allison).
 */

let cachedEnglishVoice: SpeechSynthesisVoice | null = null;

const PREFERRED_VOICE_NAMES = ['Samantha', 'Ava (Premium)', 'Ava', 'Allison', 'Karen', 'Joanna'];

function pickEnglishVoice(): SpeechSynthesisVoice | null {
	if (cachedEnglishVoice) return cachedEnglishVoice;
	const voices = window.speechSynthesis.getVoices();
	if (voices.length === 0) return null;

	for (const name of PREFERRED_VOICE_NAMES) {
		const v = voices.find((voice) => voice.name === name || voice.name.startsWith(name));
		if (v) {
			cachedEnglishVoice = v;
			return v;
		}
	}

	const enUs = voices.find((v) => v.lang === 'en-US');
	if (enUs) {
		cachedEnglishVoice = enUs;
		return enUs;
	}

	const enAny = voices.find((v) => v.lang.startsWith('en'));
	cachedEnglishVoice = enAny ?? null;
	return cachedEnglishVoice;
}

let voicesPrimed = false;

export function primeVoices(): void {
	if (voicesPrimed || typeof window === 'undefined' || !window.speechSynthesis) return;
	voicesPrimed = true;
	window.speechSynthesis.getVoices();
	window.speechSynthesis.addEventListener?.('voiceschanged', () => {
		cachedEnglishVoice = null;
		pickEnglishVoice();
	});
}

/** Strip Persian/Arabic letters and any RTL formatting marks before TTS — this app only ever speaks English. */
function stripNonEnglish(text: string): string {
	return text
		.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, '')
		.replace(/[\u200C\u200D\u200E\u200F\u202A-\u202E]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

export function pronounce(
	text: string,
	opts: { lang?: string; rate?: number; onEnd?: () => void } = {}
): boolean {
	if (typeof window === 'undefined' || !window.speechSynthesis) return false;
	const synth = window.speechSynthesis;
	const cleaned = stripNonEnglish(text);
	if (!cleaned) return false;
	const utter = new SpeechSynthesisUtterance(cleaned);
	utter.lang = opts.lang ?? 'en-US';
	utter.rate = opts.rate ?? 0.95;
	utter.pitch = 1;
	utter.volume = 1;
	if (utter.lang.startsWith('en')) {
		const voice = pickEnglishVoice();
		if (voice) utter.voice = voice;
	}
	if (opts.onEnd) {
		utter.onend = () => opts.onEnd?.();
		utter.onerror = () => opts.onEnd?.();
	}
	// Chrome bug: cancel() immediately followed by speak() can leave the engine in a
	// "paused" state where the new utterance silently fires onend. Only cancel when there
	// is actually something to interrupt, and yield a tick before speaking afterwards.
	const needsCancel = synth.speaking || synth.pending;
	if (needsCancel) {
		synth.cancel();
		setTimeout(() => synth.speak(utter), 0);
	} else {
		synth.speak(utter);
	}
	return true;
}

export function stopPronounce(): void {
	if (typeof window === 'undefined' || !window.speechSynthesis) return;
	const synth = window.speechSynthesis;
	if (synth.speaking || synth.pending) synth.cancel();
}

export function canPronounce(): boolean {
	return typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined';
}
