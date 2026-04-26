<script lang="ts">
	import { resolve } from '$app/paths';
	import { i18n } from '$lib/state/i18n.svelte';
	import type { Slide } from '../slides.generated';

	interface Props {
		slide: Slide;
		highlight?: string;
	}

	const { slide, highlight = '' }: Props = $props();

	const eyebrow = $derived(
		i18n.lang === 'fa'
			? slide.eyebrowFa || slide.eyebrowEn
			: slide.eyebrowEn || slide.eyebrowFa
	);

	function escapeRe(s: string) {
		return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	const titleHTML = $derived.by(() => {
		if (!highlight) return null;
		const re = new RegExp(`(${escapeRe(highlight)})`, 'i');
		return slide.title.replace(re, '<mark>$1</mark>');
	});
</script>

<a href={resolve(`/learn/${slide.slug}` as never)} class="slide-link">
	<span class="slide-link-num" aria-hidden="true">{slide.num.toString().padStart(2, '0')}</span>
	<span class="slide-link-body">
		{#if eyebrow}
			<span class="slide-link-eyebrow">{eyebrow}</span>
		{/if}
		<span class="slide-link-title">
			{#if titleHTML}{@html titleHTML}{:else}{slide.title}{/if}
		</span>
	</span>
	<svg
		viewBox="0 0 24 24"
		width="14"
		height="14"
		fill="none"
		stroke="currentColor"
		stroke-width="1.7"
		aria-hidden="true"
		class="slide-link-chev"
	>
		<path d="M9 6l6 6-6 6" />
	</svg>
</a>

<style>
	.slide-link {
		display: grid;
		grid-template-columns: 36px 1fr 14px;
		gap: 10px;
		align-items: center;
		padding: 10px 12px;
		border-radius: 12px;
		text-decoration: none;
		color: inherit;
		min-width: 0;
	}
	.slide-link:hover {
		background: color-mix(in oklab, var(--gold) 7%, var(--bg-elevated));
	}

	.slide-link-num {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.14em;
		color: var(--gold);
		font-weight: 600;
	}

	.slide-link-body {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.slide-link-eyebrow {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 9.5px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-muted);
	}

	.slide-link-title {
		font-family: var(--font-serif);
		font-weight: 500;
		font-size: 14.5px;
		line-height: 1.25;
		color: var(--ink);
		letter-spacing: -0.005em;
	}
	:global([lang='fa']) .slide-link-title {
		font-family: var(--font-persian);
		font-weight: 600;
	}

	.slide-link-title :global(mark) {
		background: color-mix(in oklab, var(--gold) 35%, transparent);
		color: var(--ink);
		border-radius: 2px;
		padding: 0 2px;
	}

	.slide-link-chev {
		color: var(--ink-faint);
	}
	.slide-link:hover .slide-link-chev {
		color: var(--accent);
	}
	:global([dir='rtl']) .slide-link-chev {
		transform: scaleX(-1);
	}
</style>
