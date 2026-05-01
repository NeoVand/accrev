<script lang="ts">
	import { resolve } from '$app/paths';
	import { learnRead } from '$lib/state/learn-read.svelte';
	import { t } from '$lib/state/i18n.svelte';
	import type { Slide } from '../slides.generated';

	interface Props {
		slide: Slide;
		highlight?: string;
	}

	const { slide, highlight = '' }: Props = $props();

	// Cover/divider/close pages aren't markable, so don't surface read-state for them.
	const trackable = $derived(
		slide.kind !== 'cover' && slide.kind !== 'divider' && slide.kind !== 'close'
	);
	const isRead = $derived(trackable && learnRead.has(slide.slug));

	function escapeRe(s: string) {
		return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	const titleHTML = $derived.by(() => {
		if (!highlight) return null;
		const re = new RegExp(`(${escapeRe(highlight)})`, 'i');
		return slide.title.replace(re, '<mark>$1</mark>');
	});

	// Lectures get a 1-based per-part lesson number; dividers/front/back
	// matter (lessonNum === 0) get a soft bullet so the row still aligns.
	const numLabel = $derived(
		slide.lessonNum > 0 ? slide.lessonNum.toString().padStart(2, '0') : '·'
	);
</script>

<a
	href={resolve(`/learn/${slide.slug}` as never)}
	class="slide-link"
	class:is-read={isRead}
	dir="ltr"
>
	<span class="slide-link-num" aria-hidden="true">{numLabel}</span>
	<span class="slide-link-title" dir="ltr">
		{#if titleHTML}{@html titleHTML}{:else}{slide.title}{/if}
	</span>
	{#if isRead}
		<span class="slide-link-read" aria-label={t('learn_marked_read')} title={t('learn_marked_read')}>
			<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M5 12.5l4 4 10-10" />
			</svg>
		</span>
	{/if}
</a>

<style>
	.slide-link {
		display: grid;
		grid-template-columns: 28px 1fr auto;
		gap: 10px;
		align-items: center;
		padding: 8px 10px;
		border-radius: 8px;
		text-decoration: none;
		color: var(--ink);
		min-width: 0;
		transition:
			background-color 180ms ease,
			color 180ms ease;
	}
	.slide-link.is-read .slide-link-title {
		color: var(--ink-muted);
	}

	.slide-link-read {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		border-radius: 999px;
		background: color-mix(in oklab, var(--accent) 90%, transparent);
		color: var(--bg);
		flex: none;
	}
	.slide-link:hover {
		background: color-mix(in oklab, var(--accent) 8%, transparent);
		color: var(--accent);
	}

	.slide-link-num {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.06em;
		color: var(--ink-faint);
		font-variant-numeric: tabular-nums;
		flex: none;
	}
	.slide-link:hover .slide-link-num {
		color: var(--accent);
	}

	.slide-link-title {
		font-size: 13.5px;
		line-height: 1.35;
		color: inherit;
		min-width: 0;
		font-weight: 400;
	}
	.slide-link:hover .slide-link-title {
		text-decoration: underline;
		text-decoration-color: color-mix(in oklab, var(--accent) 60%, transparent);
		text-underline-offset: 3px;
	}

	.slide-link-title :global(mark) {
		background: color-mix(in oklab, var(--gold) 35%, transparent);
		color: var(--ink);
		border-radius: 2px;
		padding: 0 2px;
	}
</style>
