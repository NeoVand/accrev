<script lang="ts">
	import { resolve } from '$app/paths';
	import { i18n, t } from '$lib/state/i18n.svelte';
	import { learnRead } from '$lib/state/learn-read.svelte';
	import { slidesByPart } from '../_data';
	import type { Part } from '../slides.generated';

	interface Props {
		part: Part;
	}

	const { part }: Props = $props();
	const title = $derived(i18n.lang === 'fa' ? part.titleFa : part.title);
	const altTitle = $derived(i18n.lang === 'fa' ? part.title : part.titleFa);
	const blurb = $derived(i18n.lang === 'fa' ? part.blurbFa : part.blurb);

	// Mirrors the part page: count read across the part's lecture slides
	// (anything that isn't a divider).
	const trackableSlugs = $derived(
		(slidesByPart[part.id] ?? []).filter((s) => s.kind !== 'divider').map((s) => s.slug)
	);
	const totalReadable = $derived(trackableSlugs.length);
	const readCount = $derived(learnRead.countIn(trackableSlugs));
	const allRead = $derived(totalReadable > 0 && readCount === totalReadable);
</script>

<a
	href={resolve(`/learn/parts/${part.id}` as never)}
	class="part-card"
	aria-label={`${t('learn_part_label', part.roman)}: ${title}`}
>
	<div class="part-card-roman" aria-hidden="true">{part.roman}</div>
	<div class="part-card-body">
		<div class="part-card-eyebrow">
			<span>{t('learn_part_label', part.roman)}</span>
			{#if totalReadable > 0}
				<span class="part-card-progress" class:is-complete={allRead} aria-label={t('learn_read_progress', readCount, totalReadable)}>
					{#if allRead}
						<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M5 12.5l4 4 10-10" />
						</svg>
					{/if}
					<span dir="ltr">{readCount}/{totalReadable}</span>
				</span>
			{/if}
		</div>
		<div class="part-card-title">
			<span class="primary">{title}</span>
			<span class="alt">{altTitle}</span>
		</div>
		<p class="part-card-blurb">{blurb}</p>
	</div>
</a>

<style>
	.part-card {
		display: grid;
		grid-template-columns: 76px 1fr;
		gap: 12px;
		align-items: stretch;
		padding: 14px 14px 14px 12px;
		border-radius: var(--radius-card);
		border: 1px solid var(--hairline);
		background: var(--bg-elevated);
		text-decoration: none;
		color: inherit;
		min-height: 0;
		position: relative;
		overflow: hidden;
	}
	.part-card:hover {
		border-color: color-mix(in oklab, var(--gold) 60%, var(--hairline));
		background: color-mix(in oklab, var(--gold) 5%, var(--bg-elevated));
	}

	.part-card-roman {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding-top: 6px;
		font-family: var(--font-serif);
		font-weight: 300;
		/* Shrink for wider numerals (VIII) so they fit the column. */
		font-size: clamp(34px, 11vw, 46px);
		line-height: 0.9;
		color: var(--gold);
		letter-spacing: -0.04em;
		font-feature-settings: 'lnum';
		opacity: 0.85;
		overflow: hidden;
	}

	.part-card-body {
		display: flex;
		flex-direction: column;
		gap: 6px;
		min-width: 0;
	}

	.part-card-eyebrow {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 9.5px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--ink-muted);
	}

	.part-card-progress {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 2px 7px;
		border-radius: 999px;
		border: 1px solid var(--hairline);
		background: color-mix(in oklab, var(--ink) 4%, transparent);
		color: var(--ink-muted);
		font-size: 9.5px;
		letter-spacing: 0.06em;
		text-transform: none;
		font-variant-numeric: tabular-nums;
	}
	.part-card-progress.is-complete {
		background: color-mix(in oklab, var(--accent) 14%, transparent);
		border-color: color-mix(in oklab, var(--accent) 50%, var(--hairline));
		color: var(--accent);
	}

	.part-card-title {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.part-card-title .primary {
		font-family: var(--font-serif);
		font-weight: 500;
		font-size: 19px;
		line-height: 1.1;
		color: var(--ink);
		letter-spacing: -0.01em;
	}
	:global([lang='fa']) .part-card-title .primary {
		font-family: var(--font-persian);
		font-weight: 600;
	}
	.part-card-title .alt {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 13px;
		color: var(--ink-muted);
		opacity: 0.85;
	}
	:global([lang='fa']) .part-card-title .alt {
		/* Alt is English on FA side — keep serif italic, force LTR
		   so the period and other neutrals don't drift to the left. */
		font-family: var(--font-serif);
		direction: ltr;
		text-align: right;
		unicode-bidi: isolate;
	}
	:global(:not([lang='fa'])) .part-card-title .alt {
		/* Alt is Farsi on EN side */
		font-family: var(--font-persian);
		font-style: normal;
		direction: rtl;
		text-align: left;
		unicode-bidi: isolate;
	}
	.part-card-title .primary {
		unicode-bidi: isolate;
	}
	:global([lang='fa']) .part-card-title .primary {
		direction: rtl;
	}
	:global(:not([lang='fa'])) .part-card-title .primary {
		direction: ltr;
	}

	.part-card-blurb {
		font-size: 12.5px;
		line-height: 1.5;
		color: var(--ink-muted);
		margin: 0;
	}
</style>
