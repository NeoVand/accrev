<script lang="ts">
	import { resolve } from '$app/paths';
	import { fly } from 'svelte/transition';
	import { i18n, t } from '$lib/state/i18n.svelte';
	import SlideListItem from '$lib/learn/components/SlideListItem.svelte';

	const { data } = $props();
	const { part, slides } = data;

	const title = $derived(i18n.lang === 'fa' ? part.titleFa : part.title);
	const altTitle = $derived(i18n.lang === 'fa' ? part.title : part.titleFa);
	const blurb = $derived(i18n.lang === 'fa' ? part.blurbFa : part.blurb);

	// Group: section divider first, then concept slides, then back-link to next part.
	const dividerSlide = $derived(slides.find((s) => s.kind === 'divider'));
	const contentSlides = $derived(slides.filter((s) => s.kind !== 'divider'));
</script>

<svelte:head>
	<title>{title} · Learn · accrev</title>
</svelte:head>

<section class="flex flex-col gap-5 pt-2" in:fly={{ y: 6, duration: 220 }}>
	<a
		href={resolve('/learn')}
		class="back-link inline-flex items-center gap-1.5 self-start text-[11.5px] tracking-[0.14em] text-ink-muted uppercase hover:text-accent"
	>
		<svg
			viewBox="0 0 24 24"
			width="13"
			height="13"
			fill="none"
			stroke="currentColor"
			stroke-width="1.8"
			stroke-linecap="round"
			aria-hidden="true"
		>
			<path d="M15 6l-6 6 6 6" />
		</svg>
		{t('learn_back_to_index')}
	</a>

	<header class="part-hero">
		<div class="part-hero-roman" aria-hidden="true">{part.roman}</div>
		<div class="part-hero-eyebrow">{t('learn_part_label', part.roman)}</div>
		<h1 class="part-hero-title">{title}</h1>
		<p class="part-hero-alt">{altTitle}</p>
		<p class="part-hero-blurb">{blurb}</p>
		<div class="part-hero-meta">
			<span>{part.range}</span>
			<span class="dot">·</span>
			<span>{t('learn_slides_in_part', slides.length)}</span>
		</div>
	</header>

	<div class="flex flex-col gap-2">
		<p class="eyebrow">{t('learn_part_intro')}</p>
		<ul
			class="flex flex-col gap-0.5 rounded-[var(--radius-card)] border border-hairline bg-bg-elevated p-1.5"
		>
			{#if dividerSlide}
				<li>
					<SlideListItem slide={dividerSlide} />
				</li>
			{/if}
			{#each contentSlides as s (s.slug)}
				<li>
					<SlideListItem slide={s} />
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	:global([dir='rtl']) .back-link svg {
		transform: scaleX(-1);
	}

	.part-hero {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 22px 18px 24px 18px;
		border-radius: var(--radius-card);
		background:
			linear-gradient(160deg, color-mix(in oklab, var(--gold) 16%, var(--bg-elevated)) 0%, var(--bg-elevated) 60%),
			var(--bg-elevated);
		border: 1px solid var(--hairline);
		position: relative;
		overflow: hidden;
	}

	.part-hero-roman {
		font-family: var(--font-serif);
		font-weight: 300;
		font-size: 96px;
		line-height: 0.85;
		color: var(--gold);
		letter-spacing: -0.04em;
		font-feature-settings: 'lnum';
		opacity: 0.92;
		margin-bottom: 4px;
	}

	.part-hero-eyebrow {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 10.5px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--ink-muted);
	}

	.part-hero-title {
		font-family: var(--font-serif);
		font-weight: 500;
		font-size: clamp(28px, 8vw, 36px);
		line-height: 1.04;
		letter-spacing: -0.02em;
		color: var(--ink);
		margin: 0;
	}
	:global([lang='fa']) .part-hero-title {
		font-family: var(--font-persian);
		font-weight: 600;
		letter-spacing: 0;
	}

	.part-hero-alt {
		font-family: var(--font-persian);
		font-size: 14px;
		color: var(--ink-muted);
		direction: rtl;
		text-align: left;
		unicode-bidi: isolate;
		margin: 2px 0 4px 0;
	}
	:global([lang='fa']) .part-hero-alt {
		font-family: var(--font-serif);
		font-style: italic;
		direction: ltr;
		text-align: right;
	}

	.part-hero-blurb {
		font-size: 13.5px;
		line-height: 1.6;
		color: var(--ink-muted);
		margin: 6px 0 0 0;
	}

	.part-hero-meta {
		display: flex;
		gap: 8px;
		align-items: center;
		margin-top: 10px;
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-faint);
	}
	.part-hero-meta .dot {
		opacity: 0.5;
	}
</style>
