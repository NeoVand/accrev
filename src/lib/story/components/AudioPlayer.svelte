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

	let voice = $state(DEFAULT_VOICE);
	let narr = $state<Narration | null>(null);

	// The chapter title is spoken first, then every narration segment.
	const fullSegments = $derived([title, ...segments]);

	function listen() {
		narr?.dispose();
		const n = new Narration(fullSegments, voice);
		narr = n;
		n.start();
	}

	function close() {
		narr?.dispose();
		narr = null;
	}

	function changeVoice(v: string) {
		if (v === voice) return;
		voice = v;
		if (narr) {
			narr.dispose();
			const n = new Narration(fullSegments, voice);
			narr = n;
			n.start();
		}
	}

	onDestroy(() => narr?.dispose());

	const status = $derived(narr?.status ?? 'idle');
	const isBusy = $derived(status === 'playing' || status === 'buffering' || status === 'loadingModel');

	// Smooth-ish total estimate from the average generated segment length.
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
		if (kokoro.status === 'error') return kokoro.error ?? 'Model failed to load';
		if (status === 'error') return narr?.error ?? 'Something went wrong';
		if (status === 'loadingModel')
			return kokoro.progress > 0
				? `Downloading voice model — ${kokoro.progress}%`
				: 'Loading voice model…';
		if (status === 'buffering') return 'Synthesizing…';
		if (status === 'done') return 'Finished';
		return '';
	});
	const showProgressBar = $derived(kokoro.status === 'loading' && status === 'loadingModel');
</script>

{#if !narr}
	<button class="listen-btn" type="button" onclick={listen}>
		<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
			<path d="M8 5v14l11-7z" />
		</svg>
		<span>{t('story_listen')}</span>
		<span class="listen-sub">audiobook</span>
	</button>
{:else}
	<div class="player" transition:slide={{ duration: 220 }}>
		<div class="player-top">
			<span class="player-eyebrow">
				<span class="dot" class:live={status === 'playing'}></span>
				Audiobook
				{#if kokoro.device}<span class="player-device">· {kokoro.device}</span>{/if}
			</span>
			<button class="icon-btn close" type="button" onclick={close} aria-label="Close player">
				<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
					<path d="M6 6l12 12M18 6L6 18" />
				</svg>
			</button>
		</div>

		{#if showProgressBar}
			<div class="dl">
				<div class="dl-track"><div class="dl-fill" style:width="{kokoro.progress}%"></div></div>
			</div>
		{/if}

		<div class="controls">
			<button
				class="icon-btn"
				type="button"
				onclick={() => narr?.rewind(10)}
				aria-label="Rewind 10 seconds"
				disabled={status === 'loadingModel'}
			>
				<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M3 12a9 9 0 1 0 3-6.8" />
					<path d="M3 4.5V9h4.5" />
				</svg>
				<span class="rw-num">10</span>
			</button>

			<button
				class="play-btn"
				type="button"
				onclick={() => narr?.toggle()}
				aria-label={isBusy ? 'Pause' : 'Play'}
			>
				{#if status === 'buffering' || status === 'loadingModel'}
					<span class="spinner" aria-hidden="true"></span>
				{:else if isBusy}
					<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
						<rect x="6" y="5" width="4" height="14" rx="1" />
						<rect x="14" y="5" width="4" height="14" rx="1" />
					</svg>
				{:else}
					<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
						<path d="M8 5v14l11-7z" />
					</svg>
				{/if}
			</button>

			<div class="meta">
				{#if statusText}
					<span class="status-text">{statusText}</span>
				{:else}
					<span class="time">{fmt(narr.position)} {#if narr.generatedCount === narr.total}/ {fmt(estTotal)}{/if}</span>
					<span class="seg">¶ {Math.min(narr.index + 1, narr.total)} / {narr.total}</span>
				{/if}
			</div>
		</div>

		<div class="bar" aria-hidden="true">
			<div class="bar-fill" style:width="{progressPct}%"></div>
		</div>

		<div class="footer">
			<label class="voice">
				voice
				<select value={voice} onchange={(e) => changeVoice(e.currentTarget.value)}>
					{#each NARRATOR_VOICES as v (v.id)}
						<option value={v.id}>{v.label}</option>
					{/each}
				</select>
			</label>
			<span class="hint">on-device · cached after first use</span>
		</div>
	</div>
{/if}

<style>
	.listen-btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		align-self: flex-start;
		padding: 7px 14px 7px 12px;
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
	.listen-sub {
		font-size: 9.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-faint);
	}

	.player {
		position: sticky;
		top: 2px;
		z-index: 6;
		margin: 4px 0 8px;
		padding: 12px 14px;
		border-radius: 16px;
		border: 1px solid color-mix(in oklab, var(--accent) 28%, var(--hairline));
		background: color-mix(in oklab, var(--bg-elevated) 92%, var(--bg));
		box-shadow: var(--shadow-card);
		backdrop-filter: blur(8px);
	}
	.player-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}
	.player-eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 10px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-faint);
	}
	.player-device {
		color: color-mix(in oklab, var(--accent) 70%, var(--ink-faint));
	}
	.dot {
		width: 7px;
		height: 7px;
		border-radius: 999px;
		background: var(--ink-faint);
	}
	.dot.live {
		background: var(--accent);
		animation: pulse 1.4s ease-in-out infinite;
	}
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.35;
		}
	}

	.dl {
		margin-top: 10px;
	}
	.dl-track {
		height: 4px;
		border-radius: 999px;
		background: color-mix(in oklab, var(--hairline) 60%, transparent);
		overflow: hidden;
	}
	.dl-fill {
		height: 100%;
		background: var(--gold);
		border-radius: 999px;
		transition: width 200ms ease;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: 10px;
	}
	.icon-btn {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		border-radius: 999px;
		border: 1px solid var(--hairline);
		background: var(--bg-elevated);
		color: var(--ink);
		cursor: pointer;
		flex: none;
		transition:
			border-color 160ms ease,
			color 160ms ease;
	}
	.icon-btn:hover:not(:disabled) {
		border-color: var(--accent);
		color: var(--accent);
	}
	.icon-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
	.icon-btn.close {
		width: 28px;
		height: 28px;
		border: none;
		background: transparent;
		color: var(--ink-faint);
	}
	.rw-num {
		position: absolute;
		font-size: 8px;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		bottom: 9px;
	}
	.play-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		border-radius: 999px;
		border: none;
		background: var(--accent);
		color: var(--bg);
		cursor: pointer;
		flex: none;
		box-shadow: 0 4px 14px -6px color-mix(in oklab, var(--accent) 70%, transparent);
	}
	.play-btn:active {
		transform: scale(0.96);
	}
	.spinner {
		width: 20px;
		height: 20px;
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

	.meta {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
		flex: 1;
	}
	.status-text {
		font-size: 12px;
		color: var(--ink-muted);
	}
	.time {
		font-family: ui-monospace, 'JetBrains Mono', monospace;
		font-size: 13px;
		font-variant-numeric: tabular-nums;
		color: var(--ink);
	}
	.seg {
		font-size: 10.5px;
		color: var(--ink-faint);
		font-variant-numeric: tabular-nums;
	}

	.bar {
		margin-top: 11px;
		height: 4px;
		border-radius: 999px;
		background: color-mix(in oklab, var(--hairline) 60%, transparent);
		overflow: hidden;
	}
	.bar-fill {
		height: 100%;
		border-radius: 999px;
		background: var(--accent);
		transition: width 220ms linear;
	}

	.footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		margin-top: 11px;
	}
	.voice {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-faint);
	}
	.voice select {
		font-family: var(--font-sans);
		font-size: 12px;
		text-transform: none;
		letter-spacing: 0;
		color: var(--ink);
		background: var(--bg-elevated);
		border: 1px solid var(--hairline);
		border-radius: 8px;
		padding: 4px 8px;
		cursor: pointer;
	}
	.hint {
		font-size: 9.5px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-faint);
	}
</style>
