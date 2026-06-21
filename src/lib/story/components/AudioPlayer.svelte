<script lang="ts">
	import { onDestroy } from 'svelte';
	import { slide } from 'svelte/transition';
	import { t } from '$lib/state/i18n.svelte';
	import { kokoro, NARRATOR_VOICES, DEFAULT_VOICE } from '$lib/story/tts/kokoro.svelte';
	import { Narration } from '$lib/story/tts/narration.svelte';

	interface Props {
		title: string;
		segments: string[];
	}
	const { title, segments }: Props = $props();

	const SPEEDS = [1, 1.25, 1.5, 0.75];

	let voice = $state(DEFAULT_VOICE);
	let speed = $state(1);
	let narr = $state<Narration | null>(null);

	// The chapter title is spoken first, then every narration segment.
	const fullSegments = $derived([title, ...segments]);

	function makeNarration() {
		narr?.dispose();
		clearHighlight();
		const n = new Narration(fullSegments, voice, speed);
		narr = n;
		n.start();
	}
	function close() {
		narr?.dispose();
		narr = null;
		clearHighlight();
	}
	function changeVoice(v: string) {
		if (v === voice) return;
		voice = v;
		if (narr) makeNarration();
	}
	function cycleSpeed() {
		const i = SPEEDS.indexOf(speed);
		speed = SPEEDS[(i + 1) % SPEEDS.length];
		narr?.setSpeed(speed);
	}

	onDestroy(() => {
		narr?.dispose();
		clearHighlight();
	});

	const status = $derived(narr?.status ?? 'idle');
	const isBusy = $derived(
		status === 'playing' || status === 'buffering' || status === 'loadingModel'
	);
	const isSpinning = $derived(status === 'buffering' || status === 'loadingModel');

	const estTotal = $derived.by(() => {
		if (!narr || narr.generatedCount === 0) return 0;
		return (narr.knownDuration / narr.generatedCount) * narr.total;
	});
	const progressPct = $derived(
		narr && estTotal > 0 ? Math.min(100, (narr.position / estTotal) * 100) : 0
	);

	function fmt(sec: number) {
		if (!isFinite(sec) || sec < 0) sec = 0;
		const m = Math.floor(sec / 60);
		const s = Math.floor(sec % 60);
		return `${m}:${s.toString().padStart(2, '0')}`;
	}

	const statusText = $derived.by(() => {
		if (kokoro.status === 'error' || status === 'error')
			return 'Audio unavailable — tap ✕ and retry';
		if (status === 'loadingModel')
			return kokoro.progress > 0 ? `Loading voice — ${kokoro.progress}%` : 'Loading voice…';
		if (status === 'buffering') return 'Synthesizing…';
		if (status === 'done') return 'Finished';
		return '';
	});
	const showDownloadBar = $derived(kokoro.status === 'loading' && status === 'loadingModel');

	// ---- reading highlight: map the playing segment to a DOM element ----
	let cachedEls: HTMLElement[] | null = null;
	let highlighted: HTMLElement | null = null;

	function narratedEls(): HTMLElement[] {
		if (cachedEls) return cachedEls;
		const container = document.querySelector('.story-prose');
		if (!container) return [];
		const out: HTMLElement[] = [];
		for (const el of Array.from(container.children)) {
			if (!(el instanceof HTMLElement)) continue;
			const c = el.classList;
			if (c.contains('margin-notes') || c.contains('story-widget') || c.contains('codeblock'))
				continue;
			const tag = el.tagName.toLowerCase();
			if (tag === 'hr' || tag === 'h1') continue;
			if (
				tag === 'p' ||
				tag === 'h2' ||
				tag === 'h3' ||
				tag === 'ul' ||
				tag === 'ol' ||
				tag === 'blockquote' ||
				c.contains('journal') ||
				c.contains('schedule')
			) {
				out.push(el);
			}
		}
		cachedEls = out;
		return out;
	}

	function clearHighlight() {
		if (highlighted) highlighted.classList.remove('is-reading');
		highlighted = null;
	}

	function scrollIntoViewIfNeeded(el: HTMLElement) {
		const main = document.querySelector('main');
		if (!main) return;
		const r = el.getBoundingClientRect();
		const m = main.getBoundingClientRect();
		if (r.top < m.top + 100 || r.bottom > m.bottom - 24) {
			el.scrollIntoView({ block: 'center', behavior: 'smooth' });
		}
	}

	function highlight(fullIdx: number) {
		let el: HTMLElement | null = null;
		if (fullIdx <= 0) el = document.querySelector('.ch-title');
		else el = narratedEls()[fullIdx - 1] ?? null;
		if (el === highlighted) {
			if (el && status === 'playing') scrollIntoViewIfNeeded(el);
			return;
		}
		clearHighlight();
		if (el) {
			el.classList.add('is-reading');
			highlighted = el;
			if (status === 'playing') scrollIntoViewIfNeeded(el);
		}
	}

	$effect(() => {
		const i = narr?.index;
		void narr?.status; // re-run when playback starts so we scroll to the first line
		if (narr && i != null) highlight(i);
		else clearHighlight();
	});
</script>

{#if !narr}
	<button class="listen-btn" type="button" onclick={makeNarration}>
		<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
			<path d="M8 5v14l11-7z" />
		</svg>
		<span>{t('story_listen')}</span>
	</button>
{:else}
	<div class="player" transition:slide={{ duration: 200 }}>
		<div class="row">
			<button
				class="rw"
				type="button"
				onclick={() => narr?.rewind(10)}
				aria-label="Rewind 10 seconds"
				disabled={status === 'loadingModel'}
			>
				<svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
					<g
						fill="none"
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
						<path d="M3 3v5h5" />
					</g>
					<text x="12.5" y="15.3" text-anchor="middle" class="rw-10">10</text>
				</svg>
			</button>

			<button
				class="play"
				type="button"
				onclick={() => narr?.toggle()}
				aria-label={isBusy ? 'Pause' : 'Play'}
			>
				{#if isSpinning}
					<span class="spinner" aria-hidden="true"></span>
				{:else if isBusy}
					<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
						<rect x="6" y="5" width="4" height="14" rx="1" />
						<rect x="14" y="5" width="4" height="14" rx="1" />
					</svg>
				{:else}
					<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
						<path d="M8 5v14l11-7z" />
					</svg>
				{/if}
			</button>

			<button
				class="rw"
				type="button"
				onclick={() => narr?.forward(10)}
				aria-label="Forward 10 seconds"
				disabled={status === 'loadingModel'}
			>
				<svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
					<g
						transform="translate(24,0) scale(-1,1)"
						fill="none"
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
						<path d="M3 3v5h5" />
					</g>
					<text x="12.5" y="15.3" text-anchor="middle" class="rw-10">10</text>
				</svg>
			</button>

			<div class="readout">
				{#if statusText}
					<span class="status" class:err={status === 'error' || kokoro.status === 'error'}
						>{statusText}</span
					>
				{:else}
					<span class="time">{fmt(narr.position)}</span>
					<span class="seg">¶ {Math.min(narr.index + 1, narr.total)}/{narr.total}</span>
				{/if}
			</div>

			<button
				class="speed"
				type="button"
				onclick={cycleSpeed}
				aria-label="Playback speed"
				title="Playback speed"
			>
				{speed}×
			</button>

			<select
				class="voice"
				value={voice}
				onchange={(e) => changeVoice(e.currentTarget.value)}
				aria-label="Narrator voice"
				title={kokoro.device ? `on-device · ${kokoro.device}` : 'on-device'}
			>
				{#each NARRATOR_VOICES as v (v.id)}
					<option value={v.id}>{v.label}</option>
				{/each}
			</select>

			<button class="x" type="button" onclick={close} aria-label="Close player">
				<svg
					viewBox="0 0 24 24"
					width="14"
					height="14"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
					aria-hidden="true"
				>
					<path d="M6 6l12 12M18 6L6 18" />
				</svg>
			</button>
		</div>

		<div class="bar" aria-hidden="true">
			<div
				class="bar-fill"
				class:dl={showDownloadBar}
				style:width="{showDownloadBar ? kokoro.progress : progressPct}%"
			></div>
		</div>
	</div>
{/if}

<style>
	.listen-btn {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		align-self: flex-start;
		padding: 6px 14px 6px 11px;
		border-radius: 999px;
		border: 1px solid color-mix(in oklab, var(--accent) 35%, var(--hairline));
		background: var(--bg-elevated);
		color: var(--accent);
		font-size: 12.5px;
		font-weight: 500;
		cursor: pointer;
		transition:
			border-color 160ms ease,
			background 160ms ease;
	}
	.listen-btn:hover {
		border-color: var(--accent);
		background: color-mix(in oklab, var(--accent) 7%, var(--bg-elevated));
	}

	.player {
		position: sticky;
		top: 2px;
		z-index: 6;
		margin: 2px 0 6px;
		padding: 7px 9px 9px;
		border-radius: 14px;
		border: 1px solid color-mix(in oklab, var(--accent) 26%, var(--hairline));
		background: color-mix(in oklab, var(--bg-elevated) 86%, transparent);
		box-shadow: var(--shadow-card);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}
	.row {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.rw,
	.x {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: transparent;
		color: var(--ink-muted);
		cursor: pointer;
		flex: none;
		padding: 0;
	}
	.rw {
		width: 34px;
		height: 34px;
		border-radius: 999px;
	}
	.rw:hover:not(:disabled) {
		color: var(--accent);
	}
	.rw:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
	.rw-10 {
		font-family: var(--font-sans);
		font-size: 8px;
		font-weight: 700;
		fill: currentColor;
		stroke: none;
	}
	.x {
		width: 26px;
		height: 26px;
		color: var(--ink-faint);
	}
	.x:hover {
		color: var(--ink);
	}

	.play {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 999px;
		border: none;
		background: var(--accent);
		color: var(--bg);
		cursor: pointer;
		flex: none;
		box-shadow: 0 3px 12px -6px color-mix(in oklab, var(--accent) 75%, transparent);
	}
	.play:active {
		transform: scale(0.95);
	}
	.spinner {
		width: 18px;
		height: 18px;
		border-radius: 999px;
		border: 2.5px solid color-mix(in oklab, var(--bg) 45%, transparent);
		border-top-color: var(--bg);
		animation: spin 0.7s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.readout {
		display: flex;
		align-items: baseline;
		gap: 7px;
		min-width: 0;
		flex: 1;
		overflow: hidden;
	}
	.time {
		font-family: ui-monospace, 'JetBrains Mono', monospace;
		font-size: 13px;
		font-variant-numeric: tabular-nums;
		color: var(--ink);
	}
	.seg {
		font-size: 10px;
		color: var(--ink-faint);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.status {
		font-size: 11.5px;
		color: var(--ink-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.status.err {
		color: var(--danger);
	}

	.speed {
		flex: none;
		min-width: 40px;
		font-family: ui-monospace, 'JetBrains Mono', monospace;
		font-size: 11.5px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--ink-muted);
		background: var(--bg-elevated);
		border: 1px solid var(--hairline);
		border-radius: 8px;
		padding: 5px 6px;
		cursor: pointer;
	}
	.speed:hover {
		border-color: color-mix(in oklab, var(--accent) 40%, var(--hairline));
		color: var(--accent);
	}

	.voice {
		/* Custom caret (native one crowds the right edge); appearance:none + padding. */
		appearance: none;
		-webkit-appearance: none;
		flex: none;
		max-width: 116px;
		font-family: var(--font-sans);
		font-size: 12px;
		color: var(--ink);
		background-color: var(--bg-elevated);
		background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23998a99' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>");
		background-repeat: no-repeat;
		background-position: right 8px center;
		background-size: 11px;
		border: 1px solid var(--hairline);
		border-radius: 8px;
		padding: 5px 25px 5px 9px;
		cursor: pointer;
	}
	.voice:hover {
		border-color: color-mix(in oklab, var(--accent) 40%, var(--hairline));
	}
	/* No ugly default focus ring after clicking; a clean accent ring on keyboard focus. */
	.voice:focus {
		outline: none;
	}
	.voice:focus-visible {
		outline: none;
		border-color: var(--accent);
		box-shadow: 0 0 0 2px color-mix(in oklab, var(--accent) 22%, transparent);
	}

	.bar {
		margin-top: 8px;
		height: 3px;
		border-radius: 999px;
		background: color-mix(in oklab, var(--hairline) 55%, transparent);
		overflow: hidden;
	}
	.bar-fill {
		height: 100%;
		border-radius: 999px;
		background: var(--accent);
		transition: width 220ms linear;
	}
	.bar-fill.dl {
		background: var(--gold);
	}
</style>
