<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { resolve } from '$app/paths';
	import { i18n, t } from '$lib/state/i18n.svelte';
	import { questionsForPart } from '$lib/interview/light';
	import { getInterviewProgress } from '$lib/db';
	import type { Grade } from '$lib/types';

	type Props = { partId: string };
	let { partId }: Props = $props();

	const questions = $derived(questionsForPart(partId));
	const isFa = $derived(i18n.lang === 'fa');

	let open = $state(false);
	let grades = $state<Record<string, Grade>>({});

	const answeredCount = $derived(questions.filter((q) => (grades[q.slug] ?? 0) >= 3).length);

	onMount(async () => {
		const progress = await getInterviewProgress();
		const map: Record<string, Grade> = {};
		for (const q of questions) {
			const p = progress[q.slug];
			if (p) map[q.slug] = p.grade;
		}
		grades = map;
	});

	function statusClass(slug: string): string {
		const g = grades[slug];
		if (g === undefined) return 'iv-dot-new';
		if (g >= 3) return 'iv-dot-good';
		return 'iv-dot-weak';
	}

	const interviewBase = resolve('/interview');
</script>

{#if questions.length > 0}
	<div class="iv-panel rounded-[var(--radius-card)] border border-hairline bg-bg-elevated">
		<button type="button" class="iv-panel-head" aria-expanded={open} onclick={() => (open = !open)}>
			<span class="iv-panel-glyph" aria-hidden="true">Q·A</span>
			<span class="iv-panel-titles">
				<span class="iv-panel-title">{t('iv_part_panel_title')}</span>
				<span class="iv-panel-sub">
					{t('iv_questions_count', questions.length)}{#if answeredCount > 0}
						<span class="iv-panel-done"> · {answeredCount} ✓</span>
					{/if}
				</span>
			</span>
			<svg
				class="iv-panel-chevron"
				class:open
				viewBox="0 0 24 24"
				width="16"
				height="16"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M6 9l6 6 6-6" />
			</svg>
		</button>

		{#if open}
			<div class="iv-panel-body" transition:slide={{ duration: 220 }}>
				<ul class="iv-panel-list">
					{#each questions as q (q.slug)}
						<li>
							<a class="iv-q-row" href={`${interviewBase}?run=1&part=${partId}&q=${q.slug}`}>
								<span class="iv-dot {statusClass(q.slug)}" aria-hidden="true"></span>
								<span class="iv-q-text" dir={isFa ? 'rtl' : 'ltr'}>{isFa ? q.q_fa : q.q_en}</span>
								<svg
									class="iv-q-chevron"
									viewBox="0 0 24 24"
									width="13"
									height="13"
									fill="none"
									stroke="currentColor"
									stroke-width="1.7"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<path d={isFa ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
								</svg>
							</a>
						</li>
					{/each}
				</ul>

				<a class="iv-practice-all" href={`${interviewBase}?run=1&part=${partId}`}>
					{t('iv_practice_all')}
					<span class="iv-practice-all-count">{questions.length}</span>
				</a>
			</div>
		{/if}
	</div>
{/if}

<style>
	.iv-panel {
		overflow: hidden;
	}

	.iv-panel-head {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		padding: 12px 14px;
		text-align: start;
		color: var(--ink);
	}
	.iv-panel-head:hover {
		background: color-mix(in oklab, var(--accent-soft) 18%, transparent);
	}

	.iv-panel-glyph {
		flex: none;
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		border-radius: 9px;
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 12px;
		letter-spacing: 0.02em;
		color: var(--accent);
		background: color-mix(in oklab, var(--accent-soft) 55%, transparent);
		border: 1px solid color-mix(in oklab, var(--accent) 22%, transparent);
	}

	.iv-panel-titles {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 1px;
		min-width: 0;
	}
	.iv-panel-title {
		font-size: 13px;
		font-weight: 500;
		color: var(--ink);
	}
	:global([lang='fa']) .iv-panel-title {
		font-family: var(--font-persian);
	}
	.iv-panel-sub {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-muted);
	}
	.iv-panel-done {
		color: var(--success);
	}

	.iv-panel-chevron {
		flex: none;
		color: var(--ink-muted);
		transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.iv-panel-chevron.open {
		transform: rotate(180deg);
	}

	.iv-panel-body {
		border-top: 1px solid var(--hairline);
		padding: 6px;
	}
	.iv-panel-list {
		display: flex;
		flex-direction: column;
		gap: 1px;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.iv-q-row {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 9px 8px;
		border-radius: 10px;
		color: var(--ink);
		text-decoration: none;
	}
	.iv-q-row:hover {
		background: color-mix(in oklab, var(--accent-soft) 22%, transparent);
	}

	.iv-dot {
		flex: none;
		width: 7px;
		height: 7px;
		border-radius: 999px;
	}
	.iv-dot-new {
		background: transparent;
		border: 1.5px solid var(--ink-faint);
	}
	.iv-dot-good {
		background: var(--success);
	}
	.iv-dot-weak {
		background: var(--gold);
	}

	.iv-q-text {
		flex: 1;
		min-width: 0;
		font-size: 12.5px;
		line-height: 1.4;
		color: var(--ink-muted);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.iv-q-row:hover .iv-q-text {
		color: var(--ink);
	}
	:global([lang='fa']) .iv-q-text {
		font-family: var(--font-persian);
	}

	.iv-q-chevron {
		flex: none;
		color: var(--ink-faint);
	}

	.iv-practice-all {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		margin-top: 4px;
		padding: 9px;
		border-radius: 10px;
		font-size: 11px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--accent);
		background: color-mix(in oklab, var(--accent-soft) 28%, transparent);
		text-decoration: none;
	}
	.iv-practice-all:hover {
		background: color-mix(in oklab, var(--accent-soft) 50%, transparent);
	}
	.iv-practice-all-count {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 10px;
		opacity: 0.8;
	}
</style>
