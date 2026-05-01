<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { resolve } from '$app/paths';
	import { fly } from 'svelte/transition';
	import { i18n, t } from '$lib/state/i18n.svelte';
	import PronounceButton from '$lib/components/PronounceButton.svelte';
	import type { LookupHit } from '$lib/data/lookup';

	type Props = {
		hit: LookupHit;
		anchor: DOMRect;
		onclose: () => void;
	};

	const { hit, anchor, onclose }: Props = $props();
	const entry = $derived(hit.entry);
	const lemmaNote = $derived(
		hit.matchedAs !== hit.original.toLowerCase() ? hit.matchedAs : null
	);

	let popoverEl: HTMLDivElement | undefined = $state();
	let style = $state('opacity: 0; pointer-events: none;');

	function position() {
		if (!popoverEl) return;
		const padding = 12;
		const arrowH = 8;
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const rect = popoverEl.getBoundingClientRect();
		const w = rect.width;
		const h = rect.height;

		let top = anchor.bottom + arrowH;
		if (top + h + padding > vh && anchor.top > h + arrowH + padding) {
			top = anchor.top - h - arrowH;
		}

		const anchorCx = anchor.left + anchor.width / 2;
		let left = anchorCx - w / 2;
		left = Math.max(padding, Math.min(left, vw - w - padding));

		style = `top: ${top + window.scrollY}px; left: ${left + window.scrollX}px;`;
	}

	onMount(async () => {
		await tick();
		// Two-pass position: first to put the popover in the document so its
		// bounding rect is real, then again on the next frame in case the
		// initial render produced a stale measurement.
		position();
		const raf = requestAnimationFrame(() => position());

		const onResize = () => position();
		window.addEventListener('resize', onResize);

		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onclose();
		};
		window.addEventListener('keydown', onKey);

		// Click-outside dismissal — but only on a real pointer event that
		// originates outside the popover. Scrolling does NOT close: the
		// popover is positioned in document coordinates so it travels with
		// the page, and the user's only reliable way to dismiss is the
		// × button (or Esc).
		const onPointer = (e: PointerEvent) => {
			if (popoverEl && !popoverEl.contains(e.target as Node)) onclose();
		};
		const handle = setTimeout(() => {
			window.addEventListener('pointerdown', onPointer);
		}, 0);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', onResize);
			window.removeEventListener('keydown', onKey);
			window.removeEventListener('pointerdown', onPointer);
			clearTimeout(handle);
		};
	});
</script>

<div
	bind:this={popoverEl}
	class="word-popover"
	style={style}
	role="dialog"
	aria-label={entry.enTerm}
	dir="ltr"
	in:fly={{ y: 4, duration: 140 }}
>
	<div class="word-pop-head">
		<div class="word-pop-term">
			<span class="word-pop-en" dir="ltr">{entry.enTerm}</span>
			{#if entry.enAcronym && entry.enAcronym !== entry.enTerm}
				<span class="word-pop-acro" dir="ltr">{entry.enAcronym}</span>
			{/if}
		</div>
		<div class="word-pop-actions">
			<PronounceButton text={entry.enTerm} class="word-pop-speaker" />
			<button type="button" class="word-pop-close" onclick={onclose} aria-label={t('close')} title={t('close')}>
				<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
					<path d="M6 6l12 12M6 18L18 6" />
				</svg>
			</button>
		</div>
	</div>

	{#if lemmaNote}
		<p class="word-pop-lemma" dir="ltr">{t('lookup_root_form', lemmaNote)}</p>
	{/if}

	{#if entry.enExpansion}
		<p class="word-pop-expansion" dir="ltr">{entry.enExpansion}</p>
	{/if}

	<p class="word-pop-en-def" dir="ltr">{entry.enDefinition}</p>

	{#if entry.faTerm || entry.faDefinition}
		<div class="word-pop-fa">
			{#if entry.faTerm}
				<p class="word-pop-fa-term" dir="rtl">{entry.faTerm}</p>
			{/if}
			{#if entry.faDefinition}
				<p class="word-pop-fa-def" dir="rtl">{entry.faDefinition}</p>
			{/if}
		</div>
	{/if}

	{#if entry.source === 'glossary' && entry.slug}
		<a
			class="word-pop-link"
			href={resolve(`/word/${entry.slug}` as never)}
			dir={i18n.lang === 'fa' ? 'rtl' : 'ltr'}
		>
			{t('lookup_open_card')}
			<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
				<path d="M9 6l6 6-6 6" />
			</svg>
		</a>
	{/if}
</div>

<style>
	.word-popover {
		position: absolute;
		z-index: 60;
		max-width: min(360px, calc(100vw - 24px));
		min-width: 240px;
		padding: 12px 14px 10px 14px;
		border-radius: 14px;
		border: 1px solid var(--hairline);
		background: var(--bg-elevated);
		color: var(--ink);
		box-shadow:
			0 1px 1px color-mix(in oklab, var(--ink) 6%, transparent),
			0 8px 24px color-mix(in oklab, var(--ink) 14%, transparent);
		font-family: var(--font-sans);
	}

	.word-pop-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 10px;
		margin-bottom: 4px;
	}
	.word-pop-term {
		display: flex;
		align-items: baseline;
		gap: 8px;
		flex-wrap: wrap;
		min-width: 0;
	}
	.word-pop-en {
		font-family: var(--font-serif);
		font-weight: 500;
		font-size: 17px;
		line-height: 1.18;
		letter-spacing: -0.01em;
		color: var(--ink);
	}
	.word-pop-acro {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 10.5px;
		letter-spacing: 0.1em;
		color: var(--ink-faint);
		text-transform: uppercase;
	}

	.word-pop-actions {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		flex: none;
	}
	:global(.word-pop-speaker) {
		width: 26px !important;
		height: 26px !important;
	}
	.word-pop-close {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 26px;
		border-radius: 999px;
		border: 0;
		background: transparent;
		color: var(--ink-muted);
		cursor: pointer;
	}
	.word-pop-close:hover {
		background: color-mix(in oklab, var(--ink) 6%, transparent);
		color: var(--ink);
	}

	.word-pop-lemma {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 9.5px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-faint);
		margin: 0 0 6px 0;
	}

	.word-pop-expansion {
		font-style: italic;
		color: var(--ink-muted);
		font-size: 12.5px;
		margin: 0 0 6px 0;
	}

	.word-pop-en-def {
		font-size: 13px;
		line-height: 1.55;
		color: var(--ink);
		margin: 0 0 8px 0;
	}

	.word-pop-fa {
		padding-top: 8px;
		border-top: 1px solid color-mix(in oklab, var(--hairline) 70%, transparent);
		margin-bottom: 6px;
	}
	.word-pop-fa-term {
		font-family: var(--font-persian);
		font-size: 14px;
		color: var(--gold);
		margin: 0 0 3px 0;
		direction: rtl;
		text-align: right;
	}
	.word-pop-fa-def {
		font-family: var(--font-persian);
		font-size: 13px;
		line-height: 1.85;
		color: var(--ink);
		margin: 0;
		direction: rtl;
		text-align: right;
	}

	.word-pop-link {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		margin-top: 4px;
		padding: 6px 0 0 0;
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--accent);
		text-decoration: none;
	}
	.word-pop-link:hover {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.word-pop-link[dir='rtl'] {
		font-family: var(--font-persian);
		text-transform: none;
		letter-spacing: 0;
		font-size: 12px;
	}
	.word-pop-link[dir='rtl'] svg {
		transform: scaleX(-1);
	}
</style>
