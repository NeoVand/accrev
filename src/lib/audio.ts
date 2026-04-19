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

export function pronounce(
	text: string,
	opts: { lang?: string; rate?: number; onEnd?: () => void } = {}
): boolean {
	if (typeof window === 'undefined' || !window.speechSynthesis) return false;
	const utter = new SpeechSynthesisUtterance(text);
	utter.lang = opts.lang ?? 'en-US';
	utter.rate = opts.rate ?? 0.95;
	utter.pitch = 1;
	utter.volume = 1;
	if (utter.lang.startsWith('en')) {
		const voice = pickEnglishVoice();
		if (voice) utter.voice = voice;
	}
	if (opts.onEnd) utter.onend = () => opts.onEnd?.();
	window.speechSynthesis.cancel();
	window.speechSynthesis.speak(utter);
	return true;
}

export function canPronounce(): boolean {
	return typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined';
}
