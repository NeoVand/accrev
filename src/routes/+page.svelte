<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { resolve } from '$app/paths';
	import CpaSectionsSheet from '$lib/components/CpaSectionsSheet.svelte';
	import UnifiedSearch from '$lib/components/UnifiedSearch.svelte';
	import { countDueTerms, countLapsed, getOrCreateProfile, getSectionStats } from '$lib/db';
	import { seedIfNeeded } from '$lib/seed';
	import { i18n, t } from '$lib/state/i18n.svelte';
	import { slides as learnSlides } from '$lib/learn';
	import { allLookupEntries } from '$lib/data/lookup';
	import { memorized } from '$lib/state/memorized.svelte';
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
	let foundational = $state({ total: 0, studied: 0 });
	let cpaStats = $state<Record<string, { total: number; studied: number }>>({});
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
		foundational = { total: f.total, studied: f.studied };
		let sum = 0;
		for (const d of CPA_DECKS) {
			const s = await getSectionStats(d.key);
			cpaStats[d.key] = { total: s.total, studied: s.studied };
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
		foundational.total === 0 ? 0 : (foundational.studied / foundational.total) * 100
	);
	const foundationalContinuing = $derived(foundational.studied > 0);

	const learnSlideCount = learnSlides.length;
	const glossaryTotal = allLookupEntries().length;
	const glossaryMemorized = $derived(
		allLookupEntries().reduce((n, e) => n + (memorized.has(e.key) ? 1 : 0), 0)
	);
</script>

<section class="flex flex-col gap-3 pt-3 pb-6">
	<!-- Greeting -->
	<header class="flex flex-col gap-0.5" in:fly={{ y: 8, duration: 320 }}>
		<p class="eyebrow">{greeting}</p>
		<h1 class="font-display text-[30px] leading-[1.05] font-medium tracking-tight text-ink">
			{t('ellie')} <span class="text-accent italic">{t('jooon')}</span><span class="text-accent">.</span>
		</h1>
	</header>

	<!-- Unified search: terms + slides, fancy autocomplete -->
	<div in:fly={{ y: 6, duration: 320, delay: 40 }}>
		<UnifiedSearch />
	</div>

	<!-- GLOSSARY — bilingual word reference -->
	<a
		href={resolve('/glossary')}
		in:fly={{ y: 16, duration: 420, delay: 80 }}
		class="hero hero-glossary group"
	>
		<div class="hero-wash hero-wash-glossary"></div>
		<span
			aria-hidden="true"
			class="hero-glyph hero-glyph-glossary"
			style:top="14px"
			style:right={isFa ? 'auto' : '14px'}
			style:left={isFa ? '14px' : 'auto'}
		>Aa</span>

		<div class="flex flex-col gap-2">
			<p class="eyebrow text-accent">{t('hero_glossary_eyebrow')}</p>
			<p class="font-display text-[24px] leading-[1.1] font-medium text-ink">
				{t('hero_glossary_title')}<span class="text-accent">.</span>
			</p>
			<p class="text-[12.5px] leading-[1.55] text-ink-muted">
				{t('glossary_sub', glossaryTotal)}
			</p>

			<div class="mt-1.5 flex items-center gap-2">
				<div class="h-[3px] flex-1 overflow-hidden rounded-full bg-hairline/60">
					<div
						class="h-full rounded-full bg-accent transition-[width] duration-500"
						style:width="{glossaryTotal === 0 ? 0 : (glossaryMemorized / glossaryTotal) * 100}%"
					></div>
				</div>
				<span class="font-mono text-[10.5px] tracking-wider text-ink-muted tabular-nums">
					{glossaryMemorized}/{glossaryTotal}
				</span>
			</div>
		</div>

		<div class="hero-cta hero-cta-glossary">
			<svg
				viewBox="0 0 24 24"
				width="16"
				height="16"
				fill="none"
				stroke="currentColor"
				stroke-width="1.7"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M4 5h12a3 3 0 0 1 3 3v11a1 1 0 0 1-1 1H7a3 3 0 0 1-3-3z" />
				<path d="M4 17a3 3 0 0 1 3-3h12" />
			</svg>
			<span>{t('glossary_open')}</span>
		</div>
	</a>

	<!-- Recall pill (only if there's a pile) -->
	{#if loaded && lapsedCount > 0}
		<a
			href={`${resolve('/study')}?recall=1`}
			in:fly={{ y: 6, duration: 280, delay: 80 }}
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

	<!-- LEARN — read the deck end-to-end -->
	<a
		href={resolve('/learn')}
		in:fly={{ y: 16, duration: 420, delay: 120 }}
		class="hero hero-learn group"
	>
		<div class="hero-wash hero-wash-learn"></div>
		<span
			aria-hidden="true"
			class="hero-glyph hero-glyph-learn"
			style:top="14px"
			style:right={isFa ? 'auto' : '14px'}
			style:left={isFa ? '14px' : 'auto'}
		>A·R</span>

		<div class="flex flex-col gap-2">
			<p class="eyebrow text-gold">{isFa ? 'یادگیری' : 'read · learn'}</p>
			<p class="font-display text-[24px] leading-[1.1] font-medium text-ink">
				{isFa ? 'حسابداری، مرور شد' : 'Accounting, Reviewed'}<span class="text-gold">.</span>
			</p>
			<p class="text-[12.5px] leading-[1.55] text-ink-muted">
				{isFa
					? `${learnSlideCount} اسلاید — از پایه تا تحلیل صورت‌های مالی، با مثال‌های دوزبانه.`
					: `${learnSlideCount} slides — from the equation up to financial-statement analysis, in English & Farsi.`}
			</p>
		</div>

		<div class="hero-cta hero-cta-learn">
			<svg
				viewBox="0 0 24 24"
				width="16"
				height="16"
				fill="none"
				stroke="currentColor"
				stroke-width="1.7"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<circle cx="7" cy="13.5" r="3.5" />
				<circle cx="17" cy="13.5" r="3.5" />
				<path d="M10.5 13.5h3" />
				<path d="M3.5 12.2c.2-1.8 1-4 2-5.5" />
				<path d="M20.5 12.2c-.2-1.8-1-4-2-5.5" />
			</svg>
			<span>{isFa ? 'باز کردن کتاب' : 'open the book'}</span>
		</div>
	</a>

	<!-- PRACTICE — flashcard study -->
	<a
		href={`${resolve('/study')}?run=1&cpa=Foundational`}
		in:fly={{ y: 16, duration: 420, delay: 160 }}
		class="hero hero-practice group"
	>
		<div class="hero-wash hero-wash-practice"></div>
		<span
			aria-hidden="true"
			class="hero-glyph hero-glyph-practice"
			style:top="14px"
			style:right={isFa ? 'auto' : '14px'}
			style:left={isFa ? '14px' : 'auto'}
		>a</span>

		<div class="flex flex-col gap-2">
			<p class="eyebrow text-accent">
				{foundationalContinuing ? t('hero_eyebrow_today') : t('hero_eyebrow_foundations')}
			</p>
			<p class="font-display text-[24px] leading-[1.1] font-medium text-ink">
				{isFa ? 'تمرین با فلش‌کارت' : 'Practice flashcards'}<span class="text-accent">.</span>
			</p>
			<p class="text-[12.5px] leading-[1.55] text-ink-muted">
				{isFa ? 'پایه‌ها، با تکرار فاصله‌دار و دو جهتی.' : t('cpa_foundational_sub')}
			</p>

			<div class="mt-1.5 flex items-center gap-2">
				<div class="h-[3px] flex-1 overflow-hidden rounded-full bg-hairline/60">
					<div
						class="h-full rounded-full bg-accent transition-[width] duration-500"
						style:width="{foundationalPct}%"
					></div>
				</div>
				<span class="font-mono text-[10.5px] tracking-wider text-ink-muted tabular-nums">
					{foundational.studied}/{foundational.total}
				</span>
			</div>
		</div>

		<div class="hero-cta hero-cta-practice">
			<svg
				viewBox="0 0 24 24"
				width="16"
				height="16"
				fill="none"
				stroke="currentColor"
				stroke-width="1.7"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="9" />
				<circle cx="12" cy="12" r="5" />
				<circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
			</svg>
			<span>
				{foundationalContinuing ? t('hero_button_continue') : t('hero_button_foundations')}
			</span>
		</div>
	</a>

	<!-- CPA Exam Sections — bottom sheet -->
	<button
		type="button"
		onclick={() => (cpaSheetOpen = true)}
		class="flex items-center justify-between rounded-2xl border border-hairline bg-bg-elevated/60 px-4 py-3 text-left hover:border-accent/40"
	>
		<div class="flex flex-col">
			<p class="eyebrow uppercase">{isFa ? 'بخش‌های آزمون CPA' : 'CPA Exam Sections'}</p>
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
		class="mt-1 flex flex-wrap items-center gap-2 text-[11px] tracking-[0.14em] uppercase"
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
					<path d="M12 2l2.39 6.95H21l-5.31 4.27L17.83 20 12 15.77 6.17 20l2.14-6.78L3 8.95h6.61z" />
				</svg>
				{t('chip_level', level)}
			</span>
		{/if}
	</div>
</section>

<style>
	.hero {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 18px;
		border-radius: 24px;
		border: 1px solid var(--hairline);
		background: var(--bg-elevated);
		text-decoration: none;
		color: inherit;
		overflow: hidden;
		box-shadow: var(--card-highlight), var(--shadow-card);
		transition:
			box-shadow 280ms cubic-bezier(0.22, 1, 0.36, 1),
			transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.hero:hover {
		transform: translateY(-2px);
		box-shadow: var(--card-highlight), var(--shadow-card-hover);
	}
	/* Tinted hover halo: each hero gets a wash of its own accent on hover, so
	   the lift feels like a warm light glowing through, not a generic shadow. */
	.hero-learn:hover {
		box-shadow:
			var(--card-highlight),
			var(--shadow-card-hover),
			0 24px 60px -28px color-mix(in oklab, var(--gold) 55%, transparent);
	}
	.hero-practice:hover {
		box-shadow:
			var(--card-highlight),
			var(--shadow-card-hover),
			0 24px 60px -28px color-mix(in oklab, var(--accent) 50%, transparent);
	}
	.hero-glossary:hover {
		box-shadow:
			var(--card-highlight),
			var(--shadow-card-hover),
			0 24px 60px -28px color-mix(in oklab, var(--accent) 50%, transparent);
	}

	.hero-wash {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 0;
	}
	.hero-wash-learn {
		background:
			radial-gradient(
				ellipse 70% 60% at 100% 0%,
				color-mix(in oklab, var(--gold) 38%, transparent) 0%,
				transparent 65%
			),
			radial-gradient(
				ellipse 50% 50% at 0% 100%,
				color-mix(in oklab, var(--gold) 14%, transparent) 0%,
				transparent 60%
			);
	}
	.hero-wash-practice {
		background:
			radial-gradient(
				ellipse 70% 60% at 100% 0%,
				color-mix(in oklab, var(--accent-soft) 70%, transparent) 0%,
				transparent 60%
			),
			radial-gradient(
				ellipse 60% 60% at 0% 100%,
				color-mix(in oklab, var(--accent) 16%, transparent) 0%,
				transparent 60%
			);
	}
	.hero-wash-glossary {
		background:
			radial-gradient(
				ellipse 65% 55% at 100% 0%,
				color-mix(in oklab, var(--accent) 22%, transparent) 0%,
				transparent 60%
			),
			radial-gradient(
				ellipse 55% 55% at 0% 100%,
				color-mix(in oklab, var(--gold) 18%, transparent) 0%,
				transparent 60%
			);
	}

	.hero-glyph {
		position: absolute;
		font-family: var(--font-serif);
		line-height: 1;
		pointer-events: none;
		user-select: none;
		font-feature-settings: 'lnum';
		z-index: 0;
	}
	.hero-glyph-learn {
		font-size: 44px;
		font-weight: 300;
		font-style: italic;
		letter-spacing: 0.08em;
		color: color-mix(in oklab, var(--gold) 35%, transparent);
	}
	.hero-glyph-practice {
		font-size: 64px;
		font-weight: 400;
		color: color-mix(in oklab, var(--accent) 22%, transparent);
	}
	.hero-glyph-glossary {
		font-size: 52px;
		font-weight: 300;
		font-style: italic;
		letter-spacing: -0.02em;
		color: color-mix(in oklab, var(--accent) 26%, transparent);
	}

	.hero > div,
	.hero > .hero-cta {
		position: relative;
		z-index: 1;
	}

	.hero-cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 9px;
		padding: 11px 16px;
		border-radius: 999px;
		font-size: 11.5px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		font-weight: 500;
		/* Inset top-edge sheen + soft ambient drop: makes pills feel injection-molded. */
		box-shadow:
			var(--cta-highlight),
			0 1px 1px rgba(42, 31, 45, 0.06),
			0 6px 14px -8px rgba(42, 31, 45, 0.35);
		transition:
			background 280ms cubic-bezier(0.22, 1, 0.36, 1),
			color 280ms cubic-bezier(0.22, 1, 0.36, 1),
			box-shadow 280ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.hero-cta svg {
		flex: none;
		opacity: 0.85;
	}
	.hero-cta-learn {
		/* Subtle vertical gradient: top is a hair lighter than base gold,
		   bottom is a hair darker — gives the pill a sculpted, lit feel. */
		background:
			linear-gradient(
				180deg,
				color-mix(in oklab, var(--gold) 88%, white) 0%,
				var(--gold) 55%,
				color-mix(in oklab, var(--gold) 92%, black) 100%
			);
		color: #1a1414;
	}
	.hero:hover .hero-cta-learn,
	.hero:focus-visible .hero-cta-learn {
		background:
			linear-gradient(
				180deg,
				color-mix(in oklab, var(--ink) 92%, white) 0%,
				var(--ink) 100%
			);
		color: var(--bg);
	}
	.hero-cta-practice {
		background:
			linear-gradient(
				180deg,
				color-mix(in oklab, var(--ink) 92%, white) 0%,
				var(--ink) 100%
			);
		color: var(--bg);
	}
	.hero:hover .hero-cta-practice,
	.hero:focus-visible .hero-cta-practice {
		background:
			linear-gradient(
				180deg,
				color-mix(in oklab, var(--accent) 88%, white) 0%,
				var(--accent) 60%,
				color-mix(in oklab, var(--accent) 92%, black) 100%
			);
		color: var(--bg);
	}
	.hero-cta-glossary {
		background:
			linear-gradient(
				180deg,
				color-mix(in oklab, var(--accent) 88%, white) 0%,
				var(--accent) 60%,
				color-mix(in oklab, var(--accent) 92%, black) 100%
			);
		color: var(--bg);
	}
	.hero:hover .hero-cta-glossary,
	.hero:focus-visible .hero-cta-glossary {
		background:
			linear-gradient(
				180deg,
				color-mix(in oklab, var(--ink) 92%, white) 0%,
				var(--ink) 100%
			);
		color: var(--bg);
	}
</style>
