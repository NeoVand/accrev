<script lang="ts">
	import { resolve } from '$app/paths';
	import { t } from '$lib/state/i18n.svelte';
	import { storyRead } from '$lib/state/story-read.svelte';
	import type { StoryChapter } from '../chapters.generated';

	interface Props {
		chapter: StoryChapter;
	}
	const { chapter }: Props = $props();
	const isRead = $derived(storyRead.has(chapter.slug));
	const label = $derived(chapter.isPrologue ? t('story_prologue') : `${chapter.num}`);
</script>

<a class="ch-card" class:is-read={isRead} href={resolve(`/story/${chapter.slug}` as never)}>
	<span class="ch-num" aria-hidden="true">
		{#if isRead}
			<svg
				viewBox="0 0 24 24"
				width="13"
				height="13"
				fill="none"
				stroke="currentColor"
				stroke-width="2.4"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M5 12.5l4 4 10-10" />
			</svg>
		{:else}
			{label}
		{/if}
	</span>
	<span class="ch-text">
		<span class="ch-title">{chapter.title}</span>
		<span class="ch-meta">{chapter.station} · {t('story_min', chapter.readingMin)}</span>
	</span>
	<svg
		class="ch-arrow"
		viewBox="0 0 24 24"
		width="14"
		height="14"
		fill="none"
		stroke="currentColor"
		stroke-width="1.7"
		stroke-linecap="round"
		aria-hidden="true"
	>
		<path d="M9 6l6 6-6 6" />
	</svg>
</a>

<style>
	.ch-card {
		display: flex;
		align-items: center;
		gap: 13px;
		padding: 12px 14px;
		border-radius: 16px;
		border: 1px solid var(--hairline);
		background: var(--bg-elevated);
		text-decoration: none;
		color: inherit;
		transition:
			border-color 160ms ease,
			transform 140ms ease;
	}
	.ch-card:hover {
		border-color: color-mix(in oklab, var(--accent) 45%, var(--hairline));
		transform: translateY(-1px);
	}
	.ch-num {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		border-radius: 999px;
		border: 1px solid var(--hairline);
		font-family: var(--font-serif);
		font-size: 13px;
		color: var(--ink-muted);
		font-feature-settings: 'lnum';
	}
	.is-read .ch-num {
		background: color-mix(in oklab, var(--accent) 90%, transparent);
		border-color: transparent;
		color: var(--bg);
	}
	.ch-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
		flex: 1;
	}
	.ch-title {
		font-family: var(--font-serif);
		font-size: 15px;
		line-height: 1.2;
		color: var(--ink);
	}
	.ch-meta {
		font-size: 11px;
		color: var(--ink-faint);
		letter-spacing: 0.01em;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.ch-arrow {
		flex: none;
		color: var(--ink-faint);
	}
	.ch-card:hover .ch-arrow {
		color: var(--accent);
	}
	:global([dir='rtl']) .ch-arrow {
		transform: scaleX(-1);
	}
</style>
