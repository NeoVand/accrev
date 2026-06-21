<script lang="ts">
	import { resolve } from '$app/paths';
	import { fly } from 'svelte/transition';
	import { t } from '$lib/state/i18n.svelte';
	import { chapters, totalReadingMin } from '$lib/story';
	import type { Act } from '$lib/story';
	import { storyRead } from '$lib/state/story-read.svelte';
	import ChapterCard from '$lib/story/components/ChapterCard.svelte';

	const acts: { id: Act; label: string }[] = [
		{ id: 'I', label: chapters.find((c) => c.act === 'I')?.actLabel ?? '' },
		{ id: 'II', label: chapters.find((c) => c.act === 'II')?.actLabel ?? '' },
		{ id: 'III', label: chapters.find((c) => c.act === 'III')?.actLabel ?? '' }
	];

	const allSlugs = chapters.map((c) => c.slug);
	const readCount = $derived(storyRead.countIn(allSlugs));
	const pct = $derived((readCount / chapters.length) * 100);
</script>

<svelte:head>
	<title>The Accrual World · accrev</title>
</svelte:head>

<section class="flex flex-col gap-4 pt-3 pb-8">
	<header class="hero" in:fly={{ y: 10, duration: 360 }}>
		<p class="eyebrow text-accent">{t('hero_story_eyebrow')}</p>
		<h1 class="hero-title">{t('story_index_title')}<span class="text-accent">.</span></h1>
		<p class="hero-sub">{t('story_index_sub')}</p>

		<div class="hero-meta">
			<span>{t('story_chapters', chapters.length)}</span>
			<span class="dot">·</span>
			<span>{t('story_min', totalReadingMin)}</span>
		</div>

		<div class="prog">
			<div class="prog-track"><div class="prog-fill" style:width="{pct}%"></div></div>
			<span class="prog-num">{readCount}/{chapters.length}</span>
		</div>
	</header>

	{#each acts as act, i (act.id)}
		<div class="act" in:fly={{ y: 12, duration: 360, delay: 80 + i * 60 }}>
			<p class="act-head">
				<span class="act-roman">{t('story_act', act.id)}</span>
				<span class="act-label">{act.label}</span>
			</p>
			<div class="act-list">
				{#each chapters.filter((c) => c.act === act.id) as ch (ch.slug)}
					<ChapterCard chapter={ch} />
				{/each}
			</div>
		</div>
	{/each}

	<a class="cta" href={resolve(`/story/${chapters[0].slug}` as never)}>
		{t('hero_story_cta')}
		<svg
			viewBox="0 0 24 24"
			width="15"
			height="15"
			fill="none"
			stroke="currentColor"
			stroke-width="1.8"
			stroke-linecap="round"
			aria-hidden="true"
		>
			<path d="M9 6l6 6-6 6" />
		</svg>
	</a>
</section>

<style>
	.hero {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 20px;
		border-radius: 24px;
		border: 1px solid var(--hairline);
		background: var(--bg-elevated);
		box-shadow: var(--card-highlight), var(--shadow-card);
		position: relative;
		overflow: hidden;
	}
	.hero-title {
		font-family: var(--font-serif);
		font-size: 30px;
		line-height: 1.05;
		font-weight: 500;
		letter-spacing: -0.02em;
		color: var(--ink);
	}
	:global([lang='fa']) .hero-title {
		font-family: var(--font-persian);
	}
	.hero-sub {
		font-size: 13px;
		line-height: 1.55;
		color: var(--ink-muted);
		max-width: 38ch;
	}
	.hero-meta {
		display: flex;
		align-items: center;
		gap: 7px;
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-faint);
		margin-top: 2px;
	}
	.hero-meta .dot {
		opacity: 0.5;
	}
	.prog {
		display: flex;
		align-items: center;
		gap: 9px;
		margin-top: 8px;
	}
	.prog-track {
		flex: 1;
		height: 4px;
		border-radius: 999px;
		background: color-mix(in oklab, var(--hairline) 70%, transparent);
		overflow: hidden;
	}
	.prog-fill {
		height: 100%;
		border-radius: 999px;
		background: var(--accent);
		transition: width 400ms ease;
	}
	.prog-num {
		font-family: ui-monospace, monospace;
		font-size: 10.5px;
		color: var(--ink-muted);
		font-variant-numeric: tabular-nums;
	}
	.act {
		display: flex;
		flex-direction: column;
		gap: 9px;
	}
	.act-head {
		display: flex;
		align-items: baseline;
		gap: 9px;
		padding: 0 2px;
	}
	.act-roman {
		font-size: 10.5px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--accent);
	}
	.act-label {
		font-family: var(--font-serif);
		font-size: 15px;
		font-style: italic;
		color: var(--ink-muted);
	}
	.act-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		align-self: center;
		margin-top: 4px;
		padding: 12px 22px;
		border-radius: 999px;
		background: var(--accent);
		color: var(--bg);
		font-size: 12px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		font-weight: 500;
		text-decoration: none;
	}
	:global([dir='rtl']) .cta svg {
		transform: scaleX(-1);
	}
</style>
