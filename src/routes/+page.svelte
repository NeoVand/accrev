<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { resolve } from '$app/paths';
	import CpaSectionsSheet from '$lib/components/CpaSectionsSheet.svelte';
	import { countDueTerms, countLapsed, getOrCreateProfile, getSectionStats } from '$lib/db';
	import { seedIfNeeded } from '$lib/seed';
	import { i18n, t } from '$lib/state/i18n.svelte';
	import type { CpaSection } from '$lib/types';

	type DeckMeta = { key: CpaSection; titleKey: string; subKey: string };

	const CPA_DECKS: DeckMeta[] = [
		{ key: 'FAR', titleKey: 'cpa_far', subKey: 'cpa_far_sub' },
		{ key: 'AUD', titleKey: 'cpa_aud', subKey: 'cpa_aud_sub' },
		{ key: 'REG', titleKey: 'cpa_reg', subKey: 'cpa_reg_sub' },
		{ key: 'BAR', titleKey: 'cpa_bar', subKey: 'cpa_bar_sub' },
		{ key: 'ISC', titleKey: 'cpa_isc', subKey: 'cpa_isc_sub' },
		{ key: 'TCP', titleKey: 'cpa_tcp', subKey: 'cpa_tcp_sub' }
	];

	let streakDays = $state(0);
	let totalXp = $state(0);
	let level = $state(1);
	let dueToday = $state(0);
	let lapsedCount = $state(0);
	let foundational = $state({ total: 0, mastered: 0 });
	let cpaStats = $state<Record<string, { total: number; mastered: number }>>({});
	let cpaTotal = $state(0);
	let loaded = $state(false);

	let cpaSheetOpen = $state(false);

	onMount(async () => {
		await seedIfNeeded();
		const profile = await getOrCreateProfile();
		streakDays = profile.streakDays;
		totalXp = profile.totalXp;
		level = profile.level;
		dueToday = await countDueTerms();
		lapsedCount = await countLapsed();
		const f = await getSectionStats('Foundational');
		foundational = { total: f.total, mastered: f.mastered };
		let sum = 0;
		for (const d of CPA_DECKS) {
			const s = await getSectionStats(d.key);
			cpaStats[d.key] = { total: s.total, mastered: s.mastered };
			sum += s.total;
		}
		cpaTotal = sum;
		loaded = true;
	});

	function greetingKey(): string {
		const h = new Date().getHours();
		if (h < 5) return 'greeting_latenight';
		if (h < 12) return 'greeting_morning';
		if (h < 17) return 'greeting_afternoon';
		if (h < 22) return 'greeting_evening';
		return 'greeting_night';
	}
	const greeting = $derived(t(greetingKey()));

	const isFa = $derived(i18n.lang === 'fa');
	const foundationalPct = $derived(
		foundational.total === 0 ? 0 : (foundational.mastered / foundational.total) * 100
	);
	const foundationalContinuing = $derived(foundational.mastered > 0);
</script>

<section class="flex h-full flex-col gap-3 pt-3 pb-2">
	<!-- Greeting -->
	<header class="flex flex-col gap-0.5" in:fly={{ y: 8, duration: 320 }}>
		<p class="eyebrow">{greeting}</p>
		<h1 class="font-display text-[32px] leading-[1.05] font-medium tracking-tight text-ink">
			{t('ellie')} <span class="text-accent italic">{t('jooon')}</span><span class="text-accent"
				>.</span
			>
		</h1>
	</header>

	<!-- Recall: small inline banner if there's a pile -->
	{#if loaded && lapsedCount > 0}
		<a
			href={`${resolve('/study')}?recall=1`}
			in:fly={{ y: 6, duration: 280, delay: 60 }}
			class="flex items-center justify-between rounded-full border border-accent/40 bg-accent-soft/40 px-4 py-2 text-[12.5px] hover:border-accent"
		>
			<span class="flex items-center gap-2 text-ink">
				<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M3 12a9 9 0 1 0 3-6.7" />
					<path d="M3 4v5h5" />
				</svg>
				{t('recall_pill_inline', lapsedCount)}
			</span>
			<span class="text-[10.5px] tracking-[0.16em] text-accent uppercase">→</span>
		</a>
	{/if}

	<!-- Hero: Foundations -->
	<a
		href={`${resolve('/study')}?run=1&cpa=Foundational`}
		in:fly={{ y: 16, duration: 420, delay: 80 }}
		class="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-hairline bg-bg-elevated p-6 shadow-[0_24px_60px_-32px_rgba(42,31,45,0.35)] hover:shadow-[0_32px_80px_-32px_rgba(42,31,45,0.45)]"
	>
		<!-- Decorative wash + corner glyph -->
		<div
			class="pointer-events-none absolute inset-0 -z-10"
			style="background:
				radial-gradient(ellipse 65% 55% at 100% 0%, color-mix(in oklab, var(--gold) 30%, transparent) 0%, transparent 65%),
				radial-gradient(ellipse 50% 50% at 0% 100%, color-mix(in oklab, var(--accent-soft) 70%, transparent) 0%, transparent 60%);"
		></div>
		<span
			aria-hidden="true"
			class="font-display pointer-events-none absolute text-[140px] leading-none text-gold/15 select-none"
			style:bottom={isFa ? 'auto' : '-2rem'}
			style:top={isFa ? '-1.5rem' : 'auto'}
			style:right={isFa ? 'auto' : '-0.5rem'}
			style:left={isFa ? '-0.5rem' : 'auto'}
		>
			a
		</span>

		<div class="flex flex-col gap-2.5">
			<p class="eyebrow text-gold">
				{foundationalContinuing ? t('hero_eyebrow_today') : t('hero_eyebrow_foundations')}
			</p>
			<p class="font-display text-[28px] leading-[1.1] font-medium text-ink">
				{t('cpa_foundational')}<span class="text-gold">.</span>
			</p>
			<p class="text-[13px] text-ink-muted">{t('cpa_foundational_sub')}</p>

			<div class="mt-2 flex items-center gap-2">
				<div class="h-[3px] flex-1 overflow-hidden rounded-full bg-hairline/60">
					<div
						class="h-full rounded-full bg-gold transition-[width] duration-500"
						style:width="{foundationalPct}%"
					></div>
				</div>
				<span class="font-mono text-[10.5px] tracking-wider text-ink-muted tabular-nums">
					{foundational.mastered}/{foundational.total}
				</span>
			</div>
		</div>

		<div
			class="relative z-10 mt-5 grid place-items-center rounded-full bg-ink py-3 text-[12px] tracking-[0.18em] text-bg uppercase transition group-hover:bg-accent"
		>
			{foundationalContinuing ? t('hero_button_continue') : t('hero_button_foundations')}
		</div>
	</a>

	<!-- CPA Exam Sections — opens a bottom sheet so it doesn't disturb layout -->
	<button
		type="button"
		onclick={() => (cpaSheetOpen = true)}
		class="flex items-center justify-between rounded-2xl border border-hairline bg-bg-elevated/60 px-4 py-3 text-left hover:border-accent/40"
	>
		<div class="flex flex-col">
			<p class="eyebrow uppercase">CPA EXAM SECTIONS</p>
			<p class="text-[12px] text-ink-muted">
				{t('cpa_sections_subtitle', CPA_DECKS.length, cpaTotal)}
			</p>
		</div>
		<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="text-ink-muted">
			<path d="M9 6l6 6-6 6" />
		</svg>
	</button>

	<CpaSectionsSheet
		open={cpaSheetOpen}
		onClose={() => (cpaSheetOpen = false)}
		decks={CPA_DECKS}
		stats={cpaStats}
	/>

	<!-- Footer chips -->
	<div
		class="mt-auto flex flex-wrap items-center gap-2 text-[11px] tracking-[0.14em] uppercase"
		in:fade={{ duration: 320, delay: 240 }}
	>
		{#if loaded && streakDays > 0}
			<a
				href={resolve('/progress')}
				class="flex items-center gap-1.5 rounded-full border border-hairline bg-bg-elevated/60 px-3 py-1.5 text-ink-muted hover:border-accent/40 hover:text-accent"
			>
				<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor" aria-hidden="true">
					<path d="M12 2c.6 4.5 3 6.5 5 9 2 2.5 2 6.5-1 9-3 2.5-7.5 2-10-1-2.5-3-2-7 0-9 2-2 3.5-1 4-3 0 0 1.5-1 2-5z" />
				</svg>
				{t('chip_streak', streakDays)}
			</a>
		{/if}
		{#if loaded && totalXp > 0}
			<span
				class="flex items-center gap-1.5 rounded-full border border-hairline bg-bg-elevated/60 px-3 py-1.5 text-ink-muted"
			>
				<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor" aria-hidden="true">
					<path
						d="M12 2l2.39 6.95H21l-5.31 4.27L17.83 20 12 15.77 6.17 20l2.14-6.78L3 8.95h6.61z"
					/>
				</svg>
				{t('chip_level', level)}
			</span>
		{/if}
	</div>
</section>
