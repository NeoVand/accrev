<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { fade, fly } from 'svelte/transition';
	import InterviewCard from '$lib/components/InterviewCard.svelte';
	import { i18n, t } from '$lib/state/i18n.svelte';
	import { questions as allQuestions, questionsForLevel, shuffle } from '$lib/interview';
	import { INTERVIEW_LEVELS, INTERVIEW_LEVEL_COUNTS, INTERVIEW_TOTAL } from '$lib/interview/meta';
	import { getInterviewLevelStats, gradeInterview } from '$lib/db';
	import type { InterviewLevelId, InterviewQuestion } from '$lib/interview/types';
	import type { Grade } from '$lib/types';

	const runMode = $derived(page.url.searchParams.get('run') === '1');
	const levelParam = $derived(page.url.searchParams.get('level'));

	const isFa = $derived(i18n.lang === 'fa');

	type LevelStat = { seen: number; answered: number };
	let stats = $state<Record<number, LevelStat>>({
		1: { seen: 0, answered: 0 },
		2: { seen: 0, answered: 0 },
		3: { seen: 0, answered: 0 },
		4: { seen: 0, answered: 0 }
	});

	let deck = $state<InterviewQuestion[]>([]);
	let deckReady = $state(false);
	let index = $state(0);
	let done = $state(false);
	let results = $state<Grade[]>([]);

	async function refreshStats() {
		stats = await getInterviewLevelStats();
	}

	function loadDeck() {
		const lp = levelParam;
		const source =
			lp && lp !== 'all' ? questionsForLevel(Number(lp) as InterviewLevelId) : allQuestions;
		// Use a local, not the `deck` state, for the emptiness check — reading the
		// just-written `deck` inside the $effect would make the effect depend on it
		// and re-fire forever (each run reshuffles into a new array).
		const shuffled = shuffle(source);
		deck = shuffled;
		index = 0;
		results = [];
		done = shuffled.length === 0;
		deckReady = true;
	}

	$effect(() => {
		if (runMode) {
			loadDeck();
		} else {
			deckReady = false;
			void refreshStats();
		}
	});

	const current = $derived(deck[index]);
	const total = $derived(deck.length);
	const progress = $derived(total === 0 ? 0 : (index / total) * 100);

	const activeLevelName = $derived.by(() => {
		if (!levelParam || levelParam === 'all') return t('iv_all_levels');
		const meta = INTERVIEW_LEVELS.find((l) => l.level === Number(levelParam));
		return meta ? meta.name[isFa ? 'fa' : 'en'] : t('iv_all_levels');
	});

	async function handleGrade(g: Grade) {
		const q = current;
		if (!q) return;
		results = [...results, g];
		await gradeInterview(q.slug, q.level, g);
		if (index + 1 >= deck.length) {
			done = true;
		} else {
			index += 1;
		}
		document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function restart() {
		loadDeck();
		document.querySelector('main')?.scrollTo({ top: 0 });
	}

	const answeredCount = $derived(results.filter((g) => g >= 3).length);
	const forgotCount = $derived(results.filter((g) => g === 1).length);
	const hardCount = $derived(results.filter((g) => g === 2).length);
	const gotItCount = $derived(results.filter((g) => g === 3).length);
	const easyCount = $derived(results.filter((g) => g === 4).length);

	const overallAnswered = $derived(Object.values(stats).reduce((n, s) => n + s.answered, 0));
</script>

{#if !runMode}
	<!-- ───────────────────────── Landing: choose a level ───────────────────────── -->
	<section class="flex flex-col gap-5 pt-3 pb-6">
		<header class="flex flex-col gap-1.5" in:fly={{ y: 8, duration: 320 }}>
			<p class="eyebrow text-accent">{t('iv_landing_eyebrow')}</p>
			<h1 class="font-display text-[27px] leading-[1.08] font-medium text-ink">
				{t('iv_landing_title')}<span class="text-accent">.</span>
			</h1>
			<p class="text-[13px] leading-[1.6] text-ink-muted">{t('iv_landing_sub')}</p>
		</header>

		<div class="flex items-center justify-between">
			<p class="eyebrow">{t('iv_choose_level')}</p>
			<span class="font-mono text-[10.5px] tracking-wider text-ink-faint tabular-nums">
				{overallAnswered}/{INTERVIEW_TOTAL}
			</span>
		</div>

		<div class="flex flex-col gap-2.5">
			{#each INTERVIEW_LEVELS as lvl, i (lvl.level)}
				{@const count = INTERVIEW_LEVEL_COUNTS[lvl.level]}
				{@const answered = stats[lvl.level]?.answered ?? 0}
				{@const pct = count === 0 ? 0 : (answered / count) * 100}
				<a
					href={`${resolve('/interview')}?run=1&level=${lvl.level}`}
					in:fly={{ y: 14, duration: 360, delay: 60 + i * 50 }}
					class="iv-level-card group flex flex-col gap-2.5 rounded-[var(--radius-card)] border border-hairline bg-bg-elevated p-4"
				>
					<div class="flex items-start gap-3.5">
						<span class="iv-level-badge font-display">{lvl.level}</span>
						<div class="flex flex-1 flex-col gap-0.5">
							<div class="flex items-center justify-between gap-2">
								<p class="font-display text-[16.5px] leading-tight font-medium text-ink">
									{lvl.name[isFa ? 'fa' : 'en']}
								</p>
								<span class="font-mono text-[10.5px] tracking-wider text-ink-muted tabular-nums">
									{t('iv_questions_count', count)}
								</span>
							</div>
							<p class="text-[12px] leading-[1.55] text-ink-muted line-clamp-3">
								{lvl.description[isFa ? 'fa' : 'en']}
							</p>
						</div>
					</div>
					<div class="flex items-center gap-2 pl-[46px]">
						<div class="h-[3px] flex-1 overflow-hidden rounded-full bg-hairline/60">
							<div
								class="h-full rounded-full bg-accent transition-[width] duration-500"
								style:width="{pct}%"
							></div>
						</div>
						<span class="font-mono text-[10px] tracking-wider text-ink-faint tabular-nums">
							{t('iv_level_progress', answered, count)}
						</span>
					</div>
				</a>
			{/each}

			<!-- All levels -->
			<a
				href={`${resolve('/interview')}?run=1&level=all`}
				in:fly={{ y: 14, duration: 360, delay: 60 + 4 * 50 }}
				class="iv-all-card flex items-center justify-between gap-3 rounded-[var(--radius-card)] border border-accent/30 bg-accent-soft/25 px-4 py-3.5"
			>
				<div class="flex flex-col gap-0.5">
					<p class="font-display text-[15.5px] leading-tight font-medium text-ink">
						{t('iv_all_levels')}
					</p>
					<p class="text-[11.5px] text-ink-muted">{t('iv_all_levels_sub')}</p>
				</div>
				<div class="flex items-center gap-2.5 text-accent">
					<span class="font-mono text-[11px] tracking-wider tabular-nums">{INTERVIEW_TOTAL}</span>
					<svg
						viewBox="0 0 24 24"
						width="14"
						height="14"
						fill="none"
						stroke="currentColor"
						stroke-width="1.7"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d={isFa ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
					</svg>
				</div>
			</a>
		</div>
	</section>
{:else}
	<!-- ───────────────────────── Running session ───────────────────────── -->
	<section class="flex flex-col gap-4 pt-3 pb-6">
		{#if !done && current}
			<div class="flex items-center gap-3">
				<a
					href={resolve('/interview')}
					aria-label={t('iv_exit')}
					title={t('iv_exit')}
					class="grid h-7 w-7 flex-none place-items-center rounded-full text-ink-muted hover:bg-bg-soft hover:text-ink"
				>
					<svg
						viewBox="0 0 24 24"
						width="16"
						height="16"
						fill="none"
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M6 6l12 12M18 6L6 18" />
					</svg>
				</a>
				<div class="flex flex-1 items-center gap-2">
					<div class="h-[3px] flex-1 overflow-hidden rounded-full bg-hairline/60">
						<div
							class="h-full rounded-full bg-accent transition-[width] duration-300"
							style:width="{progress}%"
						></div>
					</div>
					<span class="font-mono text-[10.5px] tracking-wider text-ink-faint tabular-nums">
						{index + 1}/{total}
					</span>
				</div>
				<span class="flex-none text-[10.5px] tracking-[0.14em] text-ink-muted uppercase">
					{activeLevelName}
				</span>
			</div>
		{/if}

		{#if !deckReady}
			<p class="pt-12 text-center text-ink-muted">…</p>
		{:else if done}
			<div class="mt-4 flex flex-col gap-6" in:fade={{ duration: 240 }}>
				<div class="flex flex-col items-center gap-2 text-center">
					<p class="eyebrow text-accent">{t('iv_done_eyebrow')}</p>
					<h2 class="font-display text-[28px] leading-tight font-medium text-ink">
						{t('iv_complete_title')}
					</h2>
				</div>
				<div
					class="flex flex-col gap-1 rounded-[var(--radius-card)] border border-accent/30 bg-accent-soft/25 p-5 text-center"
				>
					<p class="eyebrow text-accent">{t('iv_answered_label')}</p>
					<p class="font-display text-[34px] leading-none text-ink">
						{answeredCount}<span class="text-ink-faint">/{results.length}</span>
					</p>
				</div>
				<div class="flex flex-col gap-2">
					<p class="eyebrow">{t('breakdown_label')}</p>
					<div
						class="grid grid-cols-4 gap-1.5 text-center text-[10.5px] tracking-[0.14em] uppercase"
					>
						<div class="flex flex-col gap-1 rounded-xl border border-danger/30 py-2">
							<span class="font-display text-[18px] leading-none text-danger">{forgotCount}</span>
							<span class="text-danger">{t('forgot')}</span>
						</div>
						<div class="flex flex-col gap-1 rounded-xl border border-gold/40 py-2">
							<span class="font-display text-[18px] leading-none text-gold">{hardCount}</span>
							<span class="text-gold">{t('hard')}</span>
						</div>
						<div class="flex flex-col gap-1 rounded-xl border border-success/40 py-2">
							<span class="font-display text-[18px] leading-none text-success">{gotItCount}</span>
							<span class="text-success">{t('got_it')}</span>
						</div>
						<div class="flex flex-col gap-1 rounded-xl border border-accent/40 py-2">
							<span class="font-display text-[18px] leading-none text-accent">{easyCount}</span>
							<span class="text-accent">{t('easy')}</span>
						</div>
					</div>
				</div>
				<div class="flex flex-col gap-2">
					<button
						type="button"
						onclick={restart}
						class="rounded-full bg-ink py-3.5 text-[12px] tracking-[0.18em] text-bg uppercase hover:bg-accent"
					>
						{t('iv_again')}
					</button>
					<a
						href={resolve('/interview')}
						class="grid place-items-center rounded-full border border-hairline py-3 text-[12px] tracking-[0.18em] text-ink-muted uppercase hover:border-ink/40 hover:text-ink"
					>
						{t('iv_choose_level')}
					</a>
					<a
						href={resolve('/')}
						class="grid place-items-center py-1 text-[11px] tracking-[0.16em] text-ink-faint uppercase hover:text-ink-muted"
					>
						{t('back_home')}
					</a>
				</div>
			</div>
		{:else if total === 0}
			<div class="mt-8 flex flex-col items-center gap-4 text-center">
				<h2 class="font-display text-[24px] leading-tight font-medium text-ink">{t('iv_empty')}</h2>
				<a
					href={resolve('/interview')}
					class="mt-2 rounded-full bg-ink px-6 py-3 text-[12px] tracking-[0.18em] text-bg uppercase hover:bg-accent"
				>
					{t('iv_choose_level')}
				</a>
			</div>
		{:else if current}
			{#key current.slug}
				<div in:fly={{ y: 8, duration: 240 }}>
					<InterviewCard question={current} onGrade={handleGrade} />
				</div>
			{/key}
		{/if}
	</section>
{/if}

<style>
	.iv-level-card {
		box-shadow: var(--card-highlight), var(--shadow-card);
		transition:
			box-shadow 280ms cubic-bezier(0.22, 1, 0.36, 1),
			transform 280ms cubic-bezier(0.22, 1, 0.36, 1),
			border-color 280ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.iv-level-card:hover {
		transform: translateY(-2px);
		border-color: color-mix(in oklab, var(--accent) 40%, var(--hairline));
		box-shadow:
			var(--card-highlight),
			var(--shadow-card-hover),
			0 22px 50px -28px color-mix(in oklab, var(--accent) 45%, transparent);
	}

	.iv-level-badge {
		display: grid;
		place-items: center;
		flex: none;
		width: 34px;
		height: 34px;
		border-radius: 12px;
		font-size: 17px;
		font-weight: 500;
		color: var(--accent);
		background: color-mix(in oklab, var(--accent-soft) 55%, transparent);
		border: 1px solid color-mix(in oklab, var(--accent) 25%, transparent);
	}

	.iv-all-card {
		transition:
			border-color 220ms cubic-bezier(0.22, 1, 0.36, 1),
			background-color 220ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.iv-all-card:hover {
		border-color: var(--accent);
	}

	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
