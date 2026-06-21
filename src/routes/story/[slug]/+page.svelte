<script lang="ts">
	import { resolve } from '$app/paths';
	import { afterNavigate } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { t } from '$lib/state/i18n.svelte';
	import ChapterBody from '$lib/story/components/ChapterBody.svelte';
	import ChapterNav from '$lib/story/components/ChapterNav.svelte';
	import StoryMarkAsRead from '$lib/story/components/StoryMarkAsRead.svelte';
	import '$lib/story/story.css';

	const { data } = $props();
	const { chapter, prev, next } = $derived(data);

	// The app shell scrolls `<main>`, not the window, so SvelteKit's window-based
	// scroll reset leaves the next chapter stranded mid-page. Reset it ourselves.
	afterNavigate(() => {
		document.querySelector('main')?.scrollTo({ top: 0 });
	});
</script>

<svelte:head>
	<title>{chapter.title} · The Accrual World · accrev</title>
</svelte:head>

{#key chapter.slug}
	<section class="flex flex-col gap-3 pt-1" in:fly={{ y: 6, duration: 220 }}>
		<a
			href={resolve('/story')}
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
			{t('story_back_to_index')}
		</a>

		<header class="ch-head">
			<p class="ch-eyebrow">
				<span class="ch-act">{t('story_act', chapter.act)} · {chapter.actLabel}</span>
				<span class="ch-time">{t('story_min', chapter.readingMin)}</span>
			</p>
			<h1 class="ch-title">{chapter.title}</h1>
			{#if chapter.station}
				<p class="ch-station">{chapter.station}</p>
			{/if}
		</header>

		<ChapterBody {chapter} />

		<StoryMarkAsRead slug={chapter.slug} />

		<ChapterNav {prev} {next} />
	</section>
{/key}

<style>
	:global([dir='rtl']) .back-link svg {
		transform: scaleX(-1);
	}
	.ch-head {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: 4px;
	}
	.ch-eyebrow {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
		font-size: 10.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	.ch-act {
		color: var(--accent);
	}
	.ch-time {
		color: var(--ink-faint);
		font-variant-numeric: tabular-nums;
	}
	.ch-title {
		font-family: var(--font-serif);
		font-size: 28px;
		line-height: 1.08;
		font-weight: 500;
		letter-spacing: -0.015em;
		color: var(--ink);
	}
	:global([lang='fa']) .ch-title {
		font-family: var(--font-persian);
	}
	.ch-station {
		font-size: 12.5px;
		font-style: italic;
		color: var(--ink-muted);
	}
</style>
