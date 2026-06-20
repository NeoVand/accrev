<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import Heatmap from '$lib/components/Heatmap.svelte';
	import {
		getInterviewProgress,
		getOrCreateProfile,
		getRecentInterviewSessions,
		getRecentSessions,
		getSectionStats,
		getStudyDayCounts
	} from '$lib/db';
	import { i18n, t } from '$lib/state/i18n.svelte';
	import { lightBySlug } from '$lib/interview/light';
	import { INTERVIEW_LEVELS, INTERVIEW_LEVEL_COUNTS } from '$lib/interview/meta';
	import { PART_TITLES, isBookPartId } from '$lib/interview/book-map';
	import type {
		CpaSection,
		InterviewProgress,
		InterviewSession,
		Profile,
		Session
	} from '$lib/types';

	const SECTIONS: CpaSection[] = ['Foundational', 'FAR', 'AUD', 'REG', 'BAR', 'ISC', 'TCP'];

	let profile = $state<Profile | null>(null);
	let stats = $state<
		{ section: CpaSection; total: number; studied: number; mastered: number; lapsed: number }[]
	>([]);
	let dayCounts = $state<Record<string, number>>({});
	let recent = $state<Session[]>([]);
	let ivProgress = $state<Record<string, InterviewProgress>>({});
	let ivRecent = $state<InterviewSession[]>([]);

	const isFa = $derived(i18n.lang === 'fa');
	const interviewBase = resolve('/interview');

	onMount(async () => {
		profile = await getOrCreateProfile();
		stats = await Promise.all(
			SECTIONS.map(async (section) => ({ section, ...(await getSectionStats(section)) }))
		);
		dayCounts = await getStudyDayCounts(56);
		recent = await getRecentSessions(5);
		ivProgress = await getInterviewProgress();
		ivRecent = await getRecentInterviewSessions(5);
	});

	const ivRated = $derived(Object.values(ivProgress));
	const ivTotalRated = $derived(ivRated.length);
	const ivByLevel = $derived(
		INTERVIEW_LEVELS.map((l) => {
			const total = INTERVIEW_LEVEL_COUNTS[l.level];
			const answered = ivRated.filter((p) => p.level === l.level && p.grade >= 3).length;
			return {
				level: l.level,
				name: l.name,
				total,
				answered,
				pct: total ? (answered / total) * 100 : 0
			};
		})
	);
	const ivForgot = $derived(ivRated.filter((p) => p.grade === 1).length);
	const ivHard = $derived(ivRated.filter((p) => p.grade === 2).length);
	const ivGotIt = $derived(ivRated.filter((p) => p.grade === 3).length);
	const ivEasy = $derived(ivRated.filter((p) => p.grade === 4).length);
	const ivFocus = $derived(
		ivRated
			.filter((p) => p.grade <= 2)
			.map((p) => ({ grade: p.grade, level: p.level, slug: p.slug, q: lightBySlug[p.slug] }))
			.filter((x) => x.q)
			.sort((a, b) => a.grade - b.grade || a.level - b.level)
			.slice(0, 8)
	);

	function scopeLabel(scope: string): string {
		if (scope.startsWith('part:')) {
			const id = scope.slice(5);
			return isBookPartId(id) ? PART_TITLES[id][isFa ? 'fa' : 'en'] : id;
		}
		if (scope.startsWith('level:')) {
			const lvl = Number(scope.slice(6));
			const meta = INTERVIEW_LEVELS.find((l) => l.level === lvl);
			return meta ? meta.name[isFa ? 'fa' : 'en'] : t('iv_all_levels');
		}
		return t('iv_all_levels');
	}

	function sectionKey(s: CpaSection): string {
		return `cpa_${s.toLowerCase()}`;
	}

	function formatDay(ts: number): string {
		const d = new Date(ts);
		const m = d.toLocaleDateString(undefined, { month: 'short' });
		return `${m} ${d.getDate()}`;
	}
</script>

<section class="flex flex-col gap-5 pt-3">
	<div class="flex flex-col gap-0.5">
		<p class="eyebrow">{t('progress_eyebrow')}</p>
		<h1 class="font-display text-[26px] leading-tight font-medium text-ink">
			{t('your_numbers')}
		</h1>
	</div>

	<div class="grid grid-cols-3 gap-2.5">
		<div
			class="flex flex-col gap-1 rounded-[var(--radius-card)] border border-hairline bg-bg-elevated p-3"
		>
			<p class="eyebrow">{t('progress_streak')}</p>
			<p class="font-display text-[24px] leading-none text-ink">{profile?.streakDays ?? 0}</p>
		</div>
		<div
			class="flex flex-col gap-1 rounded-[var(--radius-card)] border border-hairline bg-bg-elevated p-3"
		>
			<p class="eyebrow">{t('progress_xp')}</p>
			<p class="font-display text-[24px] leading-none text-ink">{profile?.totalXp ?? 0}</p>
		</div>
		<div
			class="flex flex-col gap-1 rounded-[var(--radius-card)] border border-accent/30 bg-accent-soft/30 p-3"
		>
			<p class="eyebrow text-accent">{t('progress_level')}</p>
			<p class="font-display text-[24px] leading-none text-accent">{profile?.level ?? 1}</p>
		</div>
	</div>

	<div
		class="flex flex-col gap-3 rounded-[var(--radius-card)] border border-hairline bg-bg-elevated p-4"
	>
		<p class="eyebrow">{t('progress_heatmap_label')}</p>
		<div class="overflow-x-auto">
			<Heatmap counts={dayCounts} weeks={8} />
		</div>
	</div>

	<div class="flex flex-col gap-2.5">
		<p class="eyebrow">{t('progress_mastery_label')}</p>
		<div class="flex flex-col gap-2">
			{#each stats as s (s.section)}
				{@const pct = s.total === 0 ? 0 : (s.mastered / s.total) * 100}
				<div
					class="flex flex-col gap-1.5 rounded-[var(--radius-card)] border border-hairline bg-bg-elevated px-4 py-3"
				>
					<div class="flex items-center justify-between">
						<p class="font-display text-[14.5px] font-medium text-ink">
							{t(sectionKey(s.section))}
						</p>
						<p class="text-[11px] tracking-[0.14em] text-ink-muted uppercase">
							{t('mastery_progress', s.mastered, s.total)}
						</p>
					</div>
					<div class="h-[3px] w-full overflow-hidden rounded-full bg-hairline/60">
						<div class="h-full bg-accent transition-[width]" style:width="{pct}%"></div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="flex flex-col gap-2.5">
		<p class="eyebrow">{t('progress_sessions_label')}</p>
		{#if recent.length === 0}
			<p class="text-[13px] text-ink-faint italic">{t('progress_no_sessions')}</p>
		{:else}
			<ul class="flex flex-col gap-1.5">
				{#each recent as s (s.id)}
					<li
						class="flex items-center justify-between rounded-xl border border-hairline bg-bg-elevated px-4 py-2.5 text-[12.5px]"
					>
						<div class="flex items-center gap-2">
							<span class="font-display text-[14px] text-ink">
								{t('session_score', s.score, s.size)}
							</span>
							<span class="text-ink-muted">·</span>
							<span class="text-ink-muted">
								{s.deckFilter?.cpaSection
									? t(sectionKey(s.deckFilter.cpaSection as CpaSection))
									: t('deck_all')}
							</span>
						</div>
						<div class="flex items-center gap-3 text-ink-muted">
							<span class="text-accent">{t('xp_value', s.xpEarned)}</span>
							<span class="text-[11px] tracking-[0.14em] uppercase">{formatDay(s.startedAt)}</span>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<!-- Interview readiness -->
	<div class="mt-1 flex flex-col gap-2.5 border-t border-hairline/60 pt-5">
		<p class="eyebrow">{t('iv_progress_title')}</p>

		{#if ivTotalRated === 0}
			<p class="text-[13px] text-ink-faint italic">{t('iv_no_progress')}</p>
		{:else}
			<!-- by level -->
			<div class="flex flex-col gap-2">
				{#each ivByLevel as lv (lv.level)}
					<div
						class="flex flex-col gap-1.5 rounded-[var(--radius-card)] border border-hairline bg-bg-elevated px-4 py-3"
					>
						<div class="flex items-center justify-between">
							<p class="font-display text-[14.5px] font-medium text-ink">
								{isFa ? lv.name.fa : lv.name.en}
							</p>
							<p class="font-mono text-[11px] tracking-wider text-ink-muted tabular-nums">
								{lv.answered}/{lv.total}
							</p>
						</div>
						<div class="h-[3px] w-full overflow-hidden rounded-full bg-hairline/60">
							<div class="h-full bg-accent transition-[width]" style:width="{lv.pct}%"></div>
						</div>
					</div>
				{/each}
			</div>

			<!-- self-rating breakdown -->
			<div class="mt-1 flex flex-col gap-1.5">
				<p class="eyebrow">{t('iv_confidence')}</p>
				<div class="grid grid-cols-4 gap-1.5 text-center text-[10.5px] tracking-[0.14em] uppercase">
					<div class="flex flex-col gap-1 rounded-xl border border-danger/30 py-2">
						<span class="font-display text-[18px] leading-none text-danger">{ivForgot}</span>
						<span class="text-danger">{t('forgot')}</span>
					</div>
					<div class="flex flex-col gap-1 rounded-xl border border-gold/40 py-2">
						<span class="font-display text-[18px] leading-none text-gold">{ivHard}</span>
						<span class="text-gold">{t('hard')}</span>
					</div>
					<div class="flex flex-col gap-1 rounded-xl border border-success/40 py-2">
						<span class="font-display text-[18px] leading-none text-success">{ivGotIt}</span>
						<span class="text-success">{t('got_it')}</span>
					</div>
					<div class="flex flex-col gap-1 rounded-xl border border-accent/40 py-2">
						<span class="font-display text-[18px] leading-none text-accent">{ivEasy}</span>
						<span class="text-accent">{t('easy')}</span>
					</div>
				</div>
			</div>

			<!-- focus next -->
			<div class="mt-1 flex flex-col gap-1.5">
				<p class="eyebrow">{t('iv_focus_next')}</p>
				{#if ivFocus.length === 0}
					<p class="text-[13px] text-ink-faint italic">{t('iv_all_caught_up')}</p>
				{:else}
					<p class="text-[12px] leading-snug text-ink-muted">{t('iv_focus_hint')}</p>
					<ul class="flex flex-col gap-1.5">
						{#each ivFocus as f (f.slug)}
							<li>
								<a
									href={`${interviewBase}?run=1&q=${f.slug}`}
									class="flex items-center gap-2.5 rounded-xl border border-hairline bg-bg-elevated px-3.5 py-2.5 hover:border-accent/40"
								>
									<span
										class="h-[7px] w-[7px] flex-none rounded-full {f.grade === 1
											? 'bg-danger'
											: 'bg-gold'}"
										aria-hidden="true"
									></span>
									<span
										class="flex-1 truncate text-[12.5px] text-ink-muted"
										dir={isFa ? 'rtl' : 'ltr'}>{isFa ? f.q.q_fa : f.q.q_en}</span
									>
									<span class="flex-none text-[10px] tracking-[0.14em] text-accent uppercase">
										{t('iv_practice')}
									</span>
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/if}

		{#if ivRecent.length > 0}
			<div class="mt-1 flex flex-col gap-1.5">
				<p class="eyebrow">{t('iv_recent_interviews')}</p>
				<ul class="flex flex-col gap-1.5">
					{#each ivRecent as s (s.id)}
						<li
							class="flex items-center justify-between rounded-xl border border-hairline bg-bg-elevated px-4 py-2.5 text-[12.5px]"
						>
							<div class="flex items-center gap-2">
								<span class="font-display text-[14px] text-ink">
									{t('session_score', s.answered, s.total)}
								</span>
								<span class="text-ink-muted">·</span>
								<span class="text-ink-muted">{scopeLabel(s.scope)}</span>
							</div>
							<span class="text-[11px] tracking-[0.14em] text-ink-muted uppercase">
								{formatDay(s.endedAt)}
							</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</section>
