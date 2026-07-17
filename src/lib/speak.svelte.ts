import { browser } from '$app/environment';
import { stripNonEnglish, pronounce, stopPronounce, primeVoices } from '$lib/audio';
import { kokoro, DEFAULT_VOICE, type RawAudio } from '$lib/story/tts/kokoro.svelte';
import { voicePref } from '$lib/state/voice.svelte';

/**
 * App-wide "read this aloud" service. Prefers the on-device Kokoro voice
 * (Heart) — far nicer than the browser's built-in speech — and falls back to
 * the Web Speech API whenever Kokoro isn't available (mobile / iOS / load
 * failure) or hasn't warmed up yet.
 *
 * One shared singleton drives every speaker button in the app, so only one
 * thing speaks at a time and the heavy model is loaded/cached just once
 * (shared with the story audiobook).
 *
 * Buttons get a numeric token from `speak()` and compare it against
 * `activeId` / `loadingId` to render their own play / loading / stop state.
 */

const MAX_CHUNK = 220; // characters per synthesized chunk (sentence-ish)
const MAX_KOKORO_CHARS = 4000; // beyond this, use the browser voice (avoid huge synth)

/** Split text into short, sentence-aligned chunks so the first audio starts fast. */
function splitForTts(text: string, max = MAX_CHUNK): string[] {
	const sentences = sentenceChunks(text);
	const chunks: string[] = [];
	let cur = '';
	for (const s of sentences) {
		let piece = s.trim();
		if (!piece) continue;
		// A single sentence longer than the limit gets hard-split.
		while (piece.length > max) {
			if (cur) {
				chunks.push(cur);
				cur = '';
			}
			const splitAt = piece.lastIndexOf(' ', max);
			const end = splitAt > max * 0.6 ? splitAt : max;
			chunks.push(piece.slice(0, end).trim());
			piece = piece.slice(end).trim();
		}
		if (cur && cur.length + piece.length + 1 > max) {
			chunks.push(cur);
			cur = piece;
		} else {
			cur = cur ? `${cur} ${piece}` : piece;
		}
	}
	if (cur) chunks.push(cur);
	return chunks;
}

function sentenceChunks(text: string): string[] {
	const chunks: string[] = [];
	let start = 0;

	for (let i = 0; i < text.length; i++) {
		if (!'.!?'.includes(text[i])) continue;

		let end = i + 1;
		while (end < text.length && /['")\]}’”]/.test(text[end])) end++;

		const next = text[end];
		if (next && !/\s/.test(next)) continue;

		const chunk = text.slice(start, end).trim();
		if (chunk) chunks.push(chunk);
		start = end;
	}

	const rest = text.slice(start).trim();
	if (rest) chunks.push(rest);
	return chunks;
}

function detectMobile(): boolean {
	if (!browser) return false;
	const ua = navigator.userAgent;
	return (
		/Android|iPhone|iPad|iPod|Mobile|IEMobile|Opera Mini/i.test(ua) ||
		(navigator as unknown as { userAgentData?: { mobile?: boolean } }).userAgentData?.mobile ===
			true
	);
}

class QuickSpeak {
	/** Token of the utterance currently producing sound (0 = nothing playing). */
	activeId = $state(0);
	/** Token whose first Kokoro chunk is still synthesizing (0 = none) — shows a spinner. */
	loadingId = $state(0);

	#seq = 0;
	#ctx: AudioContext | null = null;
	#src: AudioBufferSourceNode | null = null;
	#isMobile = detectMobile();

	isActive(id: number) {
		return id !== 0 && this.activeId === id;
	}
	isLoading(id: number) {
		return id !== 0 && this.loadingId === id;
	}
	isBusy(id: number) {
		return this.isActive(id) || this.isLoading(id);
	}

	/** Prime the browser voice list (cheap; call from button onMount). */
	prime() {
		if (browser) primeVoices();
	}

	// Use the on-device Heart voice only when the user has chosen it, on desktop
	// (the model download is too heavy for a tap on mobile data, and iOS can't run
	// it at all), and as long as it hasn't already failed this session.
	get #useModel() {
		return browser && voicePref.engine === 'model' && !this.#isMobile && kokoro.status !== 'error';
	}

	#ensureCtx(): AudioContext | null {
		if (!browser) return null;
		if (!this.#ctx) {
			const AC =
				window.AudioContext ??
				(window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
			if (!AC) return null;
			this.#ctx = new AC();
		}
		if (this.#ctx.state === 'suspended') void this.#ctx.resume();
		return this.#ctx;
	}

	/**
	 * Speak `text`. Returns a token to compare against activeId/loadingId.
	 * Must be called from a user gesture (so the AudioContext may start).
	 */
	speak(text: string, onEnd?: () => void): number {
		const id = ++this.#seq;
		this.#stopAudio();
		stopPronounce();
		this.#ensureCtx(); // capture the click gesture for WebAudio playback
		void this.#run(id, text, onEnd);
		return id;
	}

	async #run(id: number, text: string, onEnd?: () => void) {
		const cleaned = stripNonEnglish(text);
		if (!cleaned) {
			this.#finish(id, onEnd);
			return;
		}

		// Heart voice when chosen: load the model if needed (spinner until the
		// first chunk is ready), then play. Fall back to the browser voice only if
		// it can't run here.
		if (this.#useModel && cleaned.length <= MAX_KOKORO_CHARS) {
			this.loadingId = id;
			try {
				await this.#playChunks(id, splitForTts(cleaned), onEnd);
				return;
			} catch {
				if (this.#seq !== id) return; // superseded — let the newer call own the UI
				this.loadingId = 0;
				this.#stopAudio();
				// fall through to the browser voice
			}
		}

		this.#webSpeech(id, cleaned, onEnd);
	}

	async #playChunks(id: number, chunks: string[], onEnd?: () => void) {
		// Synthesize the first chunk before we claim "playing" (spinner until then).
		let raw: RawAudio | null = await kokoro.generate(chunks[0], DEFAULT_VOICE);
		if (this.#seq !== id) return;
		this.loadingId = 0;
		this.activeId = id;

		for (let i = 0; i < chunks.length; i++) {
			if (this.#seq !== id || !raw) return;
			// Prefetch the next chunk while the current one plays.
			const prefetch = i + 1 < chunks.length ? kokoro.generate(chunks[i + 1], DEFAULT_VOICE) : null;
			await this.#playOne(id, raw);
			if (this.#seq !== id) return;
			raw = prefetch ? await prefetch : null;
			if (this.#seq !== id) return;
		}
		this.#finish(id, onEnd);
	}

	#playOne(id: number, raw: { audio: Float32Array; sampling_rate: number }): Promise<void> {
		return new Promise((resolve) => {
			const ctx = this.#ensureCtx();
			if (!ctx) {
				resolve();
				return;
			}
			const buf = ctx.createBuffer(1, raw.audio.length, raw.sampling_rate);
			buf.getChannelData(0).set(raw.audio);
			const src = ctx.createBufferSource();
			src.buffer = buf;
			src.connect(ctx.destination);
			src.onended = () => {
				if (this.#src === src) this.#src = null;
				resolve();
			};
			this.#src = src;
			if (this.#seq !== id) {
				resolve();
				return;
			}
			src.start();
		});
	}

	#webSpeech(id: number, text: string, onEnd?: () => void) {
		this.activeId = id;
		const ok = pronounce(text, {
			onEnd: () => {
				if (this.activeId === id) this.#finish(id, onEnd);
			}
		});
		if (!ok) this.#finish(id, onEnd);
	}

	#finish(id: number, onEnd?: () => void) {
		if (this.activeId === id) this.activeId = 0;
		if (this.loadingId === id) this.loadingId = 0;
		onEnd?.();
	}

	#stopAudio() {
		if (this.#src) {
			try {
				this.#src.onended = null;
				this.#src.stop();
				this.#src.disconnect();
			} catch {
				/* already stopped */
			}
			this.#src = null;
		}
	}

	/** Stop whatever is currently speaking. */
	stop() {
		this.#seq++; // invalidate any in-flight synthesis so it won't start playing
		this.#stopAudio();
		stopPronounce();
		this.activeId = 0;
		this.loadingId = 0;
	}
}

export const quickSpeak = new QuickSpeak();
