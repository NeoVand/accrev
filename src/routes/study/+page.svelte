<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Flashcard from '$lib/components/Flashcard.svelte';
	import SessionPicker from '$lib/components/SessionPicker.svelte';
	import {
		addXp,
		countLapsed,
		db,
		getOrCreateProfile,
		gradeReview,
		recordEggUnlock,
		updateStreak
	} from '$lib/db';
	import { pickEggAcrossEvents, unlockKeyFor, type EggEvent } from '$lib/eggs/registry';
	import { seedIfNeeded } from '$lib/seed';
	import { t } from '$lib/state/i18n.svelte';
	import { rewards } from '$lib/state/reward.svelte';
	import type { CardDirection, CpaSection, Grade, SessionAnswer, Term } from '$lib/types';

	const VALID_CPA: readonly CpaSection[] = [
		'Foundational',
		'FAR',
		'AUD',
		'REG',
		'BAR',
		'ISC',
		'TCP'
	] as const;

	const recallMode = $derived(page.url.searchParams.get('recall') === '1');
	const runMode = $derived(page.url.searchParams.get('run') === '1' || recallMode);
	const cpaFilter = $derived(page.url.searchParams.get('cpa'));
	const sizeParam = $derived(page.url.searchParams.get('size'));
	const dirParam = $derived(page.url.searchParams.get('dir'));

	let terms = $state<Term[]>([]);
	let index = $state(0);
	let directionMode = $state<CardDirection | 'mixed'>('en→fa');
	let direction = $state<CardDirection>('en→fa');
	let done = $state(false);
	let loaded = $state(false);
	let answers = $state<SessionAnswer[]>([]);
	let sessionStartedAt = $state(Date.now());
	let cardStartedAt = $state(Date.now());
	let initialLapsedCount = $state(0);
	let summaryStreak = $state(0);
	let summaryXp = $state(0);
	let summaryLevel = $state(1);

	function pickDirection(mode: CardDirection | 'mixed'): CardDirection {
		if (mode === 'mixed') return Math.random() < 0.5 ? 'en→fa' : 'fa→en';
		return mode;
	}

	async function loadDeck() {
		await seedIfNeeded();
		const validCpa =
			cpaFilter && VALID_CPA.includes(cpaFilter as CpaSection)
				? (cpaFilter as CpaSection)
				: null;
		let source: Term[];
		if (recallMode) {
			source = await db().terms.where('lapsed').equals(1).toArray();
		} else if (validCpa) {
			source = await db().terms.where('cpaSection').equals(validCpa).toArray();
		} else {
			source = await db().terms.toArray();
		}
		const shuffled = source.sort(() => Math.random() - 0.5);
		const size = sizeParam ? Math.max(1, parseInt(sizeParam, 10)) : shuffled.length;
		terms = shuffled.slice(0, size);
		directionMode =
			dirParam === 'fa→en' || dirParam === 'mixed' || dirParam === 'en→fa'
				? (dirParam as CardDirection | 'mixed')
				: 'en→fa';
		direction = pickDirection(directionMode);
		index = 0;
		done = terms.length === 0;
		answers = [];
		sessionStartedAt = Date.now();
		cardStartedAt = Date.now();
		// Capture the lapsed count BEFORE the session so we can detect recall_cleared transitions
		// (by finalize time the lapsed count has already been mutated by individual grades).
		initialLapsedCount = await countLapsed();
		loaded = true;
	}

	$effect(() => {
		if (runMode) {
			loaded = false;
			loadDeck();
		}
	});

	const current = $derived(terms[index]);
	const total = $derived(terms.length);
	const progress = $derived(total === 0 ? 0 : (index / total) * 100);

	function xpFor(grade: Grade, hintUsed: boolean): number {
		if (grade === 1) return 0;
		if (grade === 2) return 1;
		const base = grade === 3 ? 2 : 3;
		return hintUsed ? Math.max(1, base - 1) : base;
	}

	async function handleGrade(g: Grade, hintUsed: boolean) {
		if (current?.id != null) {
			await gradeReview(current.id, direction, g);
			answers.push({
				termId: current.id,
				direction,
				grade: g,
				hintUsed,
				durationMs: Date.now() - cardStartedAt
			});
		}
		cardStartedAt = Date.now();
		if (index + 1 >= terms.length) {
			await finalizeSession();
			done = true;
		} else {
			index += 1;
			direction = pickDirection(directionMode);
		}
	}

	async function finalizeSession() {
		const score = answers.reduce((s, a) => s + (a.grade >= 3 ? 1 : 0), 0);
		const xp = answers.reduce((s, a) => s + xpFor(a.grade, a.hintUsed), 0);
		const validCpa =
			cpaFilter && VALID_CPA.includes(cpaFilter as CpaSection)
				? (cpaFilter as CpaSection)
				: null;

		// Snapshot pre-finalize state so we can detect transitions (level up, recall cleared).
		const prevProfile = await getOrCreateProfile();
		const prevLapsedCount = initialLapsedCount;

		const sessionRow = $state.snapshot({
			startedAt: sessionStartedAt,
			endedAt: Date.now(),
			size: terms.length,
			direction: directionMode,
			answers,
			score,
			xpEarned: xp,
			...(validCpa ? { deckFilter: { cpaSection: validCpa } } : {})
		});
		const sessionId = await db().sessions.add(sessionRow);
		const persistedSession = { ...sessionRow, id: sessionId as number };

		if (xp > 0) await addXp(xp);
		const streakedProfile = await updateStreak();
		const newLapsedCount = await countLapsed();

		summaryXp = xp;
		summaryStreak = streakedProfile.streakDays;
		summaryLevel = streakedProfile.level;

		const events: EggEvent[] = ['session_complete'];
		if (streakedProfile.level > prevProfile.level) events.push('level_up');
		if (prevLapsedCount > 0 && newLapsedCount === 0) events.push('recall_cleared');

		const winner = pickEggAcrossEvents(events, {
			profile: streakedProfile,
			prevProfile,
			session: persistedSession,
			prevLapsedCount,
			newLapsedCount
		});

		if (winner) {
			rewards.push(winner);
			const key = unlockKeyFor(winner);
			if (key) await recordEggUnlock(key);
		}
	}

	const correctCount = $derived(answers.filter((a) => a.grade >= 3).length);
	const forgotCount = $derived(answers.filter((a) => a.grade === 1).length);
	const hardCount = $derived(answers.filter((a) => a.grade === 2).length);
	const easyCount = $derived(answers.filter((a) => a.grade === 4).length);

	function restart() {
		loaded = false;
		loadDeck();
	}
</script>

{#if !runMode}
	<SessionPicker />
{:else}
	<section class="flex flex-col gap-4 pt-3">
		{#if !done && current}
			<div class="flex items-center gap-3">
				<a
					href={resolve('/')}
					aria-label={t('exit_session')}
					title={t('exit_session')}
					class="grid h-7 w-7 flex-none place-items-center rounded-full text-ink-muted hover:bg-bg-soft hover:text-ink"
				>
					<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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
				<a
					href={resolve('/study')}
					class="flex-none rounded-full px-2 py-1 text-[10.5px] tracking-[0.16em] text-ink-muted uppercase hover:text-ink"
				>
					{t('picker_change')}
				</a>
			</div>
		{/if}

		{#if !loaded}
			<p class="pt-12 text-center text-ink-muted">…</p>
		{:else if total === 0 && recallMode}
			<div class="mt-8 flex flex-col items-center gap-4 text-center">
				<p class="eyebrow">آفرین</p>
				<h2 class="font-display text-[26px] leading-tight font-medium text-ink">
					{t('nothing_to_recall')}
				</h2>
				<p class="max-w-prose text-[14px] text-ink-muted">{t('recall_empty_body')}</p>
				<a
					href={resolve('/study')}
					class="mt-2 rounded-full bg-ink px-6 py-3 text-[12px] tracking-[0.18em] text-bg uppercase hover:bg-accent"
				>
					{t('study_full_deck')}
				</a>
			</div>
		{:else if done}
			<div class="mt-4 flex flex-col gap-6">
				<div class="flex flex-col items-center gap-2 text-center">
					<p class="eyebrow">آفرین</p>
					<h2 class="font-display text-[28px] leading-tight font-medium text-ink">
						{t('session_complete')}
					</h2>
				</div>
				<div class="grid grid-cols-2 gap-3">
					<div
						class="flex flex-col gap-1 rounded-[var(--radius-card)] border border-hairline bg-bg-elevated p-4"
					>
						<p class="eyebrow">{t('score_label')}</p>
						<p class="font-display text-[28px] leading-none text-ink">
							{correctCount}<span class="text-ink-faint">/{terms.length}</span>
						</p>
					</div>
					<div
						class="flex flex-col gap-1 rounded-[var(--radius-card)] border border-accent/30 bg-accent-soft/30 p-4"
					>
						<p class="eyebrow text-accent">{t('xp_label')}</p>
						<p class="font-display text-[28px] leading-none text-accent">
							{t('xp_value', summaryXp)}
						</p>
					</div>
				</div>
				<div
					class="flex items-center justify-between rounded-[var(--radius-card)] border border-hairline bg-bg-elevated px-4 py-3"
				>
					<div class="flex flex-col gap-0.5">
						<p class="eyebrow">{t('study_streak')}</p>
						<p class="font-display text-[17px] leading-tight text-ink">
							{t('streak_today', summaryStreak)}
						</p>
					</div>
					<span class="eyebrow text-accent">{t('level_label', summaryLevel)}</span>
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
							<span class="font-display text-[18px] leading-none text-success">
								{correctCount - easyCount}
							</span>
							<span class="text-success">{t('got_it')}</span>
						</div>
						<div class="flex flex-col gap-1 rounded-xl border border-accent/40 py-2">
							<span class="font-display text-[18px] leading-none text-accent">{easyCount}</span>
							<span class="text-accent">{t('easy')}</span>
						</div>
					</div>
					<p class="pt-1 text-[12.5px] text-ink-muted">{t('lapses_added', forgotCount)}</p>
				</div>
				<div class="flex flex-col gap-2">
					<button
						type="button"
						onclick={restart}
						class="rounded-full bg-ink py-3.5 text-[12px] tracking-[0.18em] text-bg uppercase hover:bg-accent"
					>
						{t('study_again')}
					</button>
					<a
						href={resolve('/')}
						class="grid place-items-center rounded-full border border-hairline py-3 text-[12px] tracking-[0.18em] text-ink-muted uppercase hover:border-ink/40 hover:text-ink"
					>
						{t('back_home')}
					</a>
				</div>
			</div>
		{:else if current}
			<Flashcard term={current} {direction} onGrade={handleGrade} />
		{/if}
	</section>
{/if}
