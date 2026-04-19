<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import DeckCard from '$lib/components/DeckCard.svelte';
	import StreakRing from '$lib/components/StreakRing.svelte';
	import { countByCpaSection, countDueTerms, countLapsed, getOrCreateProfile } from '$lib/db';
	import { seedIfNeeded } from '$lib/seed';
	import { t } from '$lib/state/i18n.svelte';

	let streakDays = $state(0);
	let totalXp = $state(0);
	let level = $state(1);
	let dueToday = $state(0);
	let lapsedCount = $state(0);
	let foundationalCount = $state(0);
	let farCount = $state(0);

	onMount(async () => {
		await seedIfNeeded();
		const profile = await getOrCreateProfile();
		streakDays = profile.streakDays;
		totalXp = profile.totalXp;
		level = profile.level;
		dueToday = await countDueTerms();
		lapsedCount = await countLapsed();
		foundationalCount = await countByCpaSection('Foundational');
		farCount = await countByCpaSection('FAR');
	});
</script>

<section class="flex flex-col gap-4 pt-3">
	<div class="flex flex-col gap-0.5">
		<p class="eyebrow">{t('welcome_back')}</p>
		<h1 class="font-display text-[34px] leading-[1.05] font-medium tracking-tight text-ink">
			{t('ellie')} <span class="text-accent italic">{t('jooon')}</span><span class="text-accent">.</span>
		</h1>
	</div>

	<div
		class="flex items-center gap-4 rounded-[var(--radius-card)] border border-hairline bg-bg-elevated p-4"
	>
		<StreakRing days={streakDays} goal={7} size={72} />
		<div class="flex flex-1 flex-col gap-0.5">
			<div class="flex items-center justify-between gap-2">
				<p class="eyebrow">{t('study_streak')}</p>
				{#if totalXp > 0}
					<span class="eyebrow text-accent">{t('level_label', level)}</span>
				{/if}
			</div>
			<p class="font-display text-[20px] leading-tight font-medium text-ink">
				{streakDays === 0 ? t('begin_today') : t('days', streakDays)}
			</p>
			<p class="text-[12.5px] text-ink-muted">
				{t('cards_waiting', dueToday)}
			</p>
		</div>
	</div>

	{#if lapsedCount > 0}
		<a
			href={`${resolve('/study')}?recall=1`}
			class="flex items-center justify-between gap-4 rounded-[var(--radius-card)] border border-accent/40 bg-accent-soft/40 px-4 py-3.5 hover:border-accent"
		>
			<div class="flex flex-col gap-0.5">
				<p class="eyebrow text-accent">{t('couldnt_recall')}</p>
				<p class="font-display text-[17px] leading-tight font-medium text-ink">
					{t('review_tripped')}
				</p>
				<p class="text-[12px] text-ink-muted">{t('cards_in_recall', lapsedCount)}</p>
			</div>
			<span class="font-display text-[28px] leading-none text-accent">{lapsedCount}</span>
		</a>
	{/if}

	<div class="flex flex-col gap-2.5">
		<p class="eyebrow">{t('decks')}</p>
		<div class="grid grid-cols-2 gap-2.5">
			<DeckCard
				title={t('cpa_foundational')}
				subtitle={t('cpa_foundational_sub')}
				count={foundationalCount}
				href={`${resolve('/study')}?run=1&cpa=Foundational`}
			/>
			<DeckCard
				title={t('cpa_far')}
				subtitle={t('cpa_far_sub')}
				count={farCount}
				href={`${resolve('/study')}?run=1&cpa=FAR`}
			/>
		</div>
	</div>

	<a
		href={resolve('/study')}
		class="mt-1 grid place-items-center rounded-full bg-ink py-3.5 text-[12.5px] tracking-[0.18em] text-bg uppercase hover:bg-accent"
	>
		{t('begin_session')}
	</a>
</section>
