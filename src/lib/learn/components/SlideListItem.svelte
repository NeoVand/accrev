<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Slide } from '../slides.generated';

	interface Props {
		slide: Slide;
		highlight?: string;
	}

	const { slide, highlight = '' }: Props = $props();

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

<a href={resolve(`/learn/${slide.slug}` as never)} class="slide-link" dir="ltr">
	<span class="slide-link-num" aria-hidden="true">{numLabel}</span>
	<span class="slide-link-title" dir="ltr">
		{#if titleHTML}{@html titleHTML}{:else}{slide.title}{/if}
	</span>
	<svg
		viewBox="0 0 24 24"
		width="12"
		height="12"
		fill="none"
		stroke="currentColor"
		stroke-width="1.8"
		stroke-linecap="round"
		aria-hidden="true"
		class="slide-link-chev"
	>
		<path d="M9 6l6 6-6 6" />
	</svg>
</a>

<style>
	.slide-link {
		display: grid;
		grid-template-columns: 28px 1fr auto;
		gap: 10px;
		align-items: baseline;
		padding: 8px 10px;
		border-radius: 8px;
		text-decoration: none;
		color: var(--ink);
		min-width: 0;
		transition:
			background-color 180ms ease,
			color 180ms ease;
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

	.slide-link-chev {
		flex: none;
		color: var(--ink-faint);
		transform: translateX(0);
		transition:
			transform 180ms ease,
			color 180ms ease;
	}
	.slide-link:hover .slide-link-chev {
		color: var(--accent);
		transform: translateX(2px);
	}
	:global([dir='rtl']) .slide-link-chev {
		transform: scaleX(-1);
	}
	:global([dir='rtl']) .slide-link:hover .slide-link-chev {
		transform: scaleX(-1) translateX(2px);
	}
</style>
