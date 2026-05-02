<script lang="ts">
	import { resolve } from '$app/paths';
	import { i18n, t } from '$lib/state/i18n.svelte';
	import type { NavTarget } from '../nav';

	interface Props {
		prev?: NavTarget;
		next?: NavTarget;
	}

	const { prev, next }: Props = $props();

	function path(target: NavTarget): string {
		return target.kind === 'slide'
			? `/learn/${target.slide.slug}`
			: `/learn/parts/${target.part.id}`;
	}

	function title(target: NavTarget): string {
		if (target.kind === 'slide') return target.slide.title;
		const part = target.part;
		const name = i18n.lang === 'fa' ? part.titleFa : part.title;
		return `${t('learn_part_label', part.roman)} · ${name}`;
	}
</script>

<nav class="slide-nav" aria-label="Slide navigation">
	{#if prev}
		<a href={resolve(path(prev) as never)} class="slide-nav-link slide-nav-prev">
			<svg
				viewBox="0 0 24 24"
				width="14"
				height="14"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				aria-hidden="true"
			>
				<path d="M15 6l-6 6 6 6" />
			</svg>
			<span class="slide-nav-meta">
				<span class="dir">{t('learn_prev')}</span>
				<span class="ttl" dir="ltr">{title(prev)}</span>
			</span>
		</a>
	{:else}
		<span class="slide-nav-spacer"></span>
	{/if}

	{#if next}
		<a href={resolve(path(next) as never)} class="slide-nav-link slide-nav-next">
			<span class="slide-nav-meta align-end">
				<span class="dir">{t('learn_next')}</span>
				<span class="ttl" dir="ltr">{title(next)}</span>
			</span>
			<svg
				viewBox="0 0 24 24"
				width="14"
				height="14"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				aria-hidden="true"
			>
				<path d="M9 6l6 6-6 6" />
			</svg>
		</a>
	{:else}
		<span class="slide-nav-spacer"></span>
	{/if}
</nav>

<style>
	:global([dir='rtl']) .slide-nav-prev svg,
	:global([dir='rtl']) .slide-nav-next svg {
		transform: scaleX(-1);
	}

	.slide-nav {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
		margin-top: 4px;
	}

	.slide-nav-spacer {
		display: block;
	}

	.slide-nav-link {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 12px;
		border: 1px solid var(--hairline);
		border-radius: 14px;
		background: var(--bg-elevated);
		text-decoration: none;
		color: var(--ink);
		min-width: 0;
	}
	.slide-nav-link:hover {
		border-color: color-mix(in oklab, var(--gold) 60%, var(--hairline));
		background: color-mix(in oklab, var(--gold) 5%, var(--bg-elevated));
	}

	.slide-nav-prev {
		justify-content: flex-start;
	}
	.slide-nav-next {
		justify-content: flex-end;
	}
	.slide-nav-next .slide-nav-meta {
		text-align: right;
		align-items: flex-end;
	}

	.slide-nav-meta {
		display: flex;
		flex-direction: column;
		gap: 1px;
		min-width: 0;
		flex: 1;
	}
	.slide-nav-meta.align-end {
		align-items: flex-end;
	}

	.slide-nav-meta .dir {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 9.5px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-muted);
	}

	.slide-nav-meta .ttl {
		display: block;
		font-family: var(--font-serif);
		font-weight: 500;
		font-size: 13.5px;
		line-height: 1.25;
		color: var(--ink);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
		max-width: 100%;
	}
	:global([lang='fa']) .slide-nav-meta .ttl {
		font-family: var(--font-persian);
		font-weight: 600;
	}
</style>
