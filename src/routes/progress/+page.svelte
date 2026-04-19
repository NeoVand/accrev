<script lang="ts">
	import { onMount } from 'svelte';
	import Heatmap from '$lib/components/Heatmap.svelte';
	import {
		getOrCreateProfile,
		getRecentSessions,
		getSectionStats,
		getStudyDayCounts
	} from '$lib/db';
	import { t } from '$lib/state/i18n.svelte';
	import type { CpaSection, Profile, Session } from '$lib/types';

	const SECTIONS: CpaSection[] = ['Foundational', 'FAR', 'AUD', 'REG', 'BAR', 'ISC', 'TCP'];

	let profile = $state<Profile | null>(null);
	let stats = $state<{ section: CpaSection; total: number; mastered: number; lapsed: number }[]>(
		[]
	);
	let dayCounts = $state<Record<string, number>>({});
	let recent = $state<Session[]>([]);

	onMount(async () => {
		profile = await getOrCreateProfile();
		stats = await Promise.all(
			SECTIONS.map(async (section) => ({ section, ...(await getSectionStats(section)) }))
		);
		dayCounts = await getStudyDayCounts(56);
		recent = await getRecentSessions(5);
	});

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
						<p class="font-display text-[14.5px] font-medium text-ink">{t(sectionKey(s.section))}</p>
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
</section>
