<script lang="ts">
	import { resolve } from '$app/paths';
	import { t } from '$lib/state/i18n.svelte';
	import type { StoryChapter } from '../chapters.generated';

	interface Props {
		prev?: StoryChapter;
		next?: StoryChapter;
	}
	const { prev, next }: Props = $props();
</script>

<nav class="chapter-nav" aria-label="chapter navigation">
	{#if prev}
		<a class="nav-cell" href={resolve(`/story/${prev.slug}` as never)}>
			<span class="nav-dir">
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
				{t('story_prev')}
			</span>
			<span class="nav-title">{prev.title}</span>
		</a>
	{:else}
		<span class="nav-cell is-empty"></span>
	{/if}

	{#if next}
		<a class="nav-cell nav-next" href={resolve(`/story/${next.slug}` as never)}>
			<span class="nav-dir">
				{t('story_next')}
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
					<path d="M9 6l6 6-6 6" />
				</svg>
			</span>
			<span class="nav-title">{next.title}</span>
		</a>
	{:else}
		<span class="nav-cell is-empty"></span>
	{/if}
</nav>

<style>
	.chapter-nav {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		margin-top: 18px;
	}
	.nav-cell {
		display: flex;
		flex-direction: column;
		gap: 5px;
		padding: 13px 15px;
		border-radius: 16px;
		border: 1px solid var(--hairline);
		background: var(--bg-elevated);
		text-decoration: none;
		color: inherit;
		min-height: 64px;
		transition:
			border-color 180ms ease,
			transform 160ms ease;
	}
	.nav-cell:hover {
		border-color: color-mix(in oklab, var(--accent) 50%, var(--hairline));
		transform: translateY(-1px);
	}
	.nav-cell.is-empty {
		border-style: dashed;
		opacity: 0.4;
		pointer-events: none;
	}
	.nav-next {
		text-align: right;
		align-items: flex-end;
	}
	.nav-dir {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--accent);
	}
	.nav-title {
		font-family: var(--font-serif);
		font-size: 14px;
		line-height: 1.25;
		color: var(--ink);
	}
	:global([dir='rtl']) .nav-dir svg {
		transform: scaleX(-1);
	}
</style>
