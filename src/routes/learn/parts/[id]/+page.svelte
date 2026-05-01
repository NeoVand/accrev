<script lang="ts">
	import { resolve } from '$app/paths';
	import { fly } from 'svelte/transition';
	import { i18n, t } from '$lib/state/i18n.svelte';
	import { learnRead } from '$lib/state/learn-read.svelte';
	import SlideListItem from '$lib/learn/components/SlideListItem.svelte';

	const { data } = $props();
	const { part, slides } = data;

	const title = $derived(i18n.lang === 'fa' ? part.titleFa : part.title);
	const altTitle = $derived(i18n.lang === 'fa' ? part.title : part.titleFa);
	const blurb = $derived(i18n.lang === 'fa' ? part.blurbFa : part.blurb);

	// The part page already serves as the section opener; the divider slide
	// would be a redundant entry, so list only the lecture slides.
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
		<div class="part-hero-eyebrow">{t('learn_part_label', part.roman)}</div>
		<h1 class="part-hero-title">{title}</h1>
		<p class="part-hero-alt">{altTitle}</p>
		<p class="part-hero-blurb">{blurb}</p>

		{#if totalReadable > 0}
			<div class="part-progress" aria-label={t('learn_progress_label')}>
				<div class="part-progress-row">
					<span class="part-progress-label">{t('learn_progress_label')}</span>
					<span class="part-progress-count">{t('learn_read_progress', readCount, totalReadable)}</span>
				</div>
				<div class="part-progress-bar" role="progressbar" aria-valuenow={readCount} aria-valuemin={0} aria-valuemax={totalReadable}>
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

	.part-progress {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-top: 12px;
		padding-top: 12px;
		border-top: 1px solid color-mix(in oklab, var(--hairline) 60%, transparent);
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
