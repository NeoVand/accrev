<script lang="ts">
	import { resolve } from '$app/paths';
	import { fly } from 'svelte/transition';
	import { i18n, t } from '$lib/state/i18n.svelte';
	import { learnRead } from '$lib/state/learn-read.svelte';
	import SlideListItem from '$lib/learn/components/SlideListItem.svelte';
	import SlideNav from '$lib/learn/components/SlideNav.svelte';

	const { data } = $props();
	const { part, slides, blurbEn, blurbFa, prev, next } = $derived(data);

	const title = $derived(i18n.lang === 'fa' ? part.titleFa : part.title);
	const altTitle = $derived(i18n.lang === 'fa' ? part.title : part.titleFa);
	const blurb = $derived(i18n.lang === 'fa' ? part.blurbFa : part.blurb);

	const contentSlides = $derived(slides.filter((s) => s.kind !== 'divider'));

	const trackableSlugs = $derived(contentSlides.map((s) => s.slug));
	const totalReadable = $derived(trackableSlugs.length);
	const readCount = $derived(learnRead.countIn(trackableSlugs));
	const readPct = $derived(totalReadable === 0 ? 0 : (readCount / totalReadable) * 100);
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
		<h1 class="part-hero-title">{title}</h1>
		<p class="part-hero-alt">{altTitle}</p>

		{#if blurbEn}
			<p class="part-hero-blurb" dir="ltr">{@html blurbEn}</p>
		{:else}
			<p class="part-hero-blurb">{blurb}</p>
		{/if}
		{#if blurbFa}
			<p class="part-hero-blurb is-fa" dir="rtl">{@html blurbFa}</p>
		{/if}

		{#if totalReadable > 0}
			<div class="part-progress" aria-label={t('learn_progress_label')}>
				<div class="part-progress-row">
					<span class="part-progress-label">{t('learn_progress_label')}</span>
					<span class="part-progress-count"
						>{t('learn_read_progress', readCount, totalReadable)}</span
					>
				</div>
				<div
					class="part-progress-bar"
					role="progressbar"
					aria-valuenow={readCount}
					aria-valuemin={0}
					aria-valuemax={totalReadable}
				>
					<div class="part-progress-fill" style="width: {readPct}%"></div>
				</div>
			</div>
		{/if}
	</header>

	<div class="flex flex-col gap-2">
		<p class="eyebrow">{t('learn_part_intro')}</p>
		<ul
			class="flex flex-col gap-0.5 rounded-[var(--radius-card)] border border-hairline bg-bg-elevated p-1.5"
		>
			{#each contentSlides as s (s.slug)}
				<li>
					<SlideListItem slide={s} />
				</li>
			{/each}
		</ul>
	</div>

	<SlideNav {prev} {next} />
</section>

<style>
	:global([dir='rtl']) .back-link svg {
		transform: scaleX(-1);
	}

	/* Match the index part-card surface — flat bg-elevated, hairline border —
	   so navigating from the index to a part feels like the same family of
	   surfaces. The previous variant-tint treatment (navy / tan) is what made
	   parts look like two different pages; this keeps everything one. */
	.part-hero {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 22px 18px 24px 18px;
		border-radius: var(--radius-card);
		border: 1px solid var(--hairline);
		background: var(--bg-elevated);
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
	.part-hero-blurb.is-fa {
		font-family: var(--font-persian);
		line-height: 1.85;
	}

	.part-progress {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-top: 16px;
	}
	.part-progress-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 8px;
	}
	.part-progress-label {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 9.5px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--ink-muted);
	}
	.part-progress-count {
		font-size: 12px;
		color: var(--ink-muted);
	}
	:global([lang='fa']) .part-progress-count {
		font-family: var(--font-persian);
	}
	.part-progress-bar {
		height: 4px;
		border-radius: 999px;
		background: color-mix(in oklab, var(--ink) 6%, transparent);
		overflow: hidden;
	}
	.part-progress-fill {
		height: 100%;
		border-radius: 999px;
		background: var(--accent);
		transition: width 280ms ease;
	}
</style>
