import { supertonic } from '$lib/voice/supertonic.svelte';
import type { BackendPreference } from '$lib/voice/types';

/**
 * Plays a chapter's narration segments as a continuous audiobook: generates
 * each segment with Supertonic 3 in a worker, schedules them back to
 * back on a single Web Audio timeline, and supports play / pause / rewind.
 */

export type NarrationStatus =
	| 'idle'
	| 'loadingModel'
	| 'buffering'
	| 'playing'
	| 'paused'
	| 'done'
	| 'error';

const PREFETCH_AHEAD = 8; // generate at most this many segments past the playhead
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class Narration {
	status = $state<NarrationStatus>('idle');
	index = $state(0);
	generatedCount = $state(0);
	durations = $state<number[]>([]);
	/** Seconds elapsed within the current segment (live while playing). */
	displayPos = $state(0);
	error = $state<string | null>(null);
	/** Playback rate (1 = normal). Applied to the audio nodes, so changing it is instant. */
	speed = $state(1);

	readonly total: number;
	#segments: string[];
	#voice: string;
	#language: string;
	#generationSteps: number;
	#synthesisSpeed: number;
	#backend: BackendPreference;
	#buffers: (AudioBuffer | null)[];
	#ctx: AudioContext | null = null;
	#source: AudioBufferSourceNode | null = null;
	#startedAt = 0;
	#startedOffset = 0;
	#playing = false;
	#genRunning = false;
	#destroyed = false;
	#manualStop = false;
	#tickId = 0;
	#abort = new AbortController();

	constructor(
		segments: string[],
		options: {
			voice: string;
			language: string;
			generationSteps: number;
			synthesisSpeed: number;
			backend: BackendPreference;
			playbackSpeed?: number;
		}
	) {
		this.#segments = segments;
		this.#voice = options.voice;
		this.#language = options.language;
		this.#generationSteps = options.generationSteps;
		this.#synthesisSpeed = options.synthesisSpeed;
		this.#backend = options.backend;
		this.speed = options.playbackSpeed ?? 1;
		this.total = segments.length;
		this.#buffers = new Array(segments.length).fill(null);
		this.durations = new Array(segments.length).fill(0);
	}

	get isPlaying() {
		return this.#playing;
	}
	get knownDuration() {
		let s = 0;
		for (let i = 0; i < this.generatedCount; i++) s += this.durations[i] || 0;
		return s;
	}
	get position() {
		let s = 0;
		for (let i = 0; i < this.index; i++) s += this.durations[i] || 0;
		return s + this.displayPos;
	}

	#curOffset() {
		if (this.#playing && this.#source && this.#ctx)
			return this.#startedOffset + (this.#ctx.currentTime - this.#startedAt) * this.speed;
		return this.displayPos;
	}

	#ensureCtx() {
		if (!this.#ctx) {
			const AC =
				window.AudioContext ??
				(window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
			this.#ctx = new AC();
		}
		if (this.#ctx.state === 'suspended') void this.#ctx.resume();
		return this.#ctx;
	}

	/** Begin (called from a user gesture so the AudioContext is allowed to start). */
	start() {
		if (this.#destroyed) return;
		this.#ensureCtx();
		this.#startGen();
		this.#play();
	}

	#startGen() {
		if (this.#genRunning) return;
		this.#genRunning = true;
		void this.#genLoop();
	}

	async #genLoop() {
		while (!this.#destroyed && this.generatedCount < this.total) {
			while (!this.#destroyed && this.generatedCount - this.index > PREFETCH_AHEAD) {
				await sleep(150);
			}
			if (this.#destroyed) break;
			const i = this.generatedCount;
			try {
				const raw = await supertonic.generate(this.#segments[i], {
					voice: this.#voice,
					language: this.#language,
					steps: this.#generationSteps,
					speed: this.#synthesisSpeed,
					backend: this.#backend,
					signal: this.#abort.signal
				});
				if (this.#destroyed) break;
				const ctx = this.#ensureCtx();
				const buf = ctx.createBuffer(1, raw.audio.length, raw.sampleRate);
				buf.copyToChannel(Float32Array.from(raw.audio), 0);
				this.#buffers[i] = buf;
				const next = this.durations.slice();
				next[i] = raw.audio.length / raw.sampleRate;
				this.durations = next;
				this.generatedCount = i + 1;
				// If playback is waiting on exactly this segment, start it now.
				if (this.#playing && this.#source === null && this.index === i) {
					this.#playSeg(i, this.displayPos);
				}
			} catch (e) {
				if (this.#destroyed) break;
				this.error = e instanceof Error ? e.message : String(e);
				this.status = 'error';
				this.#playing = false;
				break;
			}
		}
		this.#genRunning = false;
	}

	#play() {
		if (this.#destroyed) return;
		this.#playing = true;
		this.#ensureCtx();
		if (this.#buffers[this.index]) {
			this.#playSeg(this.index, this.displayPos);
		} else {
			this.status = supertonic.isReady ? 'buffering' : 'loadingModel';
		}
	}

	#playSeg(i: number, offset: number) {
		const ctx = this.#ensureCtx();
		const buf = this.#buffers[i];
		if (!buf) {
			this.status = 'buffering';
			return;
		}
		this.#stopSource();
		const src = ctx.createBufferSource();
		src.buffer = buf;
		src.connect(ctx.destination);
		src.playbackRate.value = this.speed;
		this.#manualStop = false;
		src.onended = () => {
			if (this.#manualStop || this.#destroyed) return;
			this.index = i + 1;
			this.displayPos = 0;
			if (this.index >= this.total) {
				this.#playing = false;
				this.status = 'done';
				this.#stopTick();
				return;
			}
			if (this.#buffers[this.index]) this.#playSeg(this.index, 0);
			else this.status = 'buffering';
		};
		src.start(0, offset);
		this.#source = src;
		this.#startedAt = ctx.currentTime;
		this.#startedOffset = offset;
		this.index = i;
		this.#playing = true;
		this.status = 'playing';
		this.#startTick();
	}

	#stopSource() {
		if (this.#source) {
			this.#manualStop = true;
			try {
				this.#source.onended = null;
				this.#source.stop();
			} catch {
				/* already stopped */
			}
			try {
				this.#source.disconnect();
			} catch {
				/* noop */
			}
			this.#source = null;
		}
	}

	pause() {
		if (!this.#playing && this.status !== 'buffering' && this.status !== 'loadingModel') return;
		this.displayPos = this.#curOffset();
		this.#stopSource();
		this.#playing = false;
		this.status = 'paused';
		this.#stopTick();
	}

	resume() {
		if (this.#destroyed || this.status === 'done' || this.status === 'error') return;
		this.#startGen();
		this.#play();
	}

	toggle() {
		if (this.#playing || this.status === 'buffering' || this.status === 'loadingModel')
			this.pause();
		else this.resume();
	}

	/** Live speed change — applies to the current and future audio, no re-synth. */
	setSpeed(s: number) {
		this.speed = s;
		if (this.#playing && this.#source) {
			const off = this.#curOffset();
			this.displayPos = off;
			this.#playSeg(this.index, off); // rebase the timeline at the new rate
		}
	}

	/** Seek by a signed number of seconds along the audio timeline. */
	seek(deltaSeconds: number) {
		const target = Math.max(0, this.position + deltaSeconds);
		let acc = 0;
		let ti = 0;
		let toff = 0;
		for (let i = 0; i < this.total; i++) {
			// Generated segments are contiguous from 0; the first null is the edge.
			if (this.#buffers[i] == null) {
				ti = i;
				toff = 0;
				break;
			}
			const d = this.durations[i] || 0;
			if (target < acc + d || i === this.total - 1) {
				ti = i;
				toff = Math.max(0, Math.min(d, target - acc));
				break;
			}
			acc += d;
		}
		this.index = ti;
		this.displayPos = toff;
		if (this.#playing) {
			if (this.#buffers[ti]) this.#playSeg(ti, toff);
			else {
				this.#stopSource();
				this.status = 'buffering';
			}
		}
	}

	rewind(seconds = 10) {
		this.seek(-seconds);
	}
	forward(seconds = 10) {
		this.seek(seconds);
	}

	#startTick() {
		this.#stopTick();
		// A 200ms interval (not rAF) keeps the clock advancing even when the tab
		// isn't focused; audio plays on the audio thread regardless.
		this.#tickId = window.setInterval(() => {
			if (this.#destroyed || !this.#playing) {
				this.#stopTick();
				return;
			}
			this.displayPos = this.#curOffset();
		}, 200);
	}
	#stopTick() {
		if (this.#tickId) {
			clearInterval(this.#tickId);
			this.#tickId = 0;
		}
	}

	dispose() {
		this.#destroyed = true;
		this.#abort.abort();
		this.#stopSource();
		this.#stopTick();
		if (this.#ctx) {
			try {
				void this.#ctx.close();
			} catch {
				/* noop */
			}
			this.#ctx = null;
		}
	}
}
