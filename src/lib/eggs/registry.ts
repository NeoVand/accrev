import { dateKey } from '$lib/db';
import type { Profile, Session } from '$lib/types';

export type EggTier = 'gentle' | 'affectionate' | 'strong' | 'inside';

export type EggEvent =
	| 'session_complete'
	| 'level_up'
	| 'recall_cleared'
	| 'streak_milestone';

export type EggContext = {
	event: EggEvent;
	profile: Profile;
	prevProfile: Profile;
	session?: Session;
	prevLapsedCount?: number;
	newLapsedCount?: number;
};

export type EggMessage = { en: string; fa: string };

export type Egg = {
	id: string;
	trigger: (ctx: EggContext) => boolean;
	message: EggMessage;
	emoji?: string;
	tier: EggTier;
	/** Fires once ever, then never again. Tracked in profile.unlockedEggs. */
	oneTime?: boolean;
	/** Fires at most once per calendar day. Tracked as `${id}:${YYYY-MM-DD}`. */
	oncePerDay?: boolean;
	/** Higher wins when multiple eggs match the same evaluation. */
	priority?: number;
};

/**
 * Editorial note on tone tiers (see project_elham_personal memory):
 *   gentle      — bravo / well done; safe daily.
 *   affectionate— mild endearment, earned moments.
 *   strong      — qorbanat beram / ashegetam, milestone-only.
 *   inside      — reserved (e.g. کسکش); never appears here, gated for future deliberate triggers.
 */
export const eggs: Egg[] = [
	// Quiet default. Fires on every completed session if nothing better wins.
	{
		id: 'praise_default',
		trigger: (ctx) => ctx.event === 'session_complete',
		message: { en: 'آفرین.', fa: 'آفرین.' },
		tier: 'gentle',
		priority: 0
	},
	// Heavier session = warmer praise.
	{
		id: 'big_xp_session',
		trigger: (ctx) =>
			ctx.event === 'session_complete' && (ctx.session?.xpEarned ?? 0) >= 25,
		message: { en: 'Strong session. عزیزم.', fa: 'جلسۀ قوی. عزیزم.' },
		emoji: '⭐',
		tier: 'affectionate',
		oncePerDay: true,
		priority: 50
	},
	// Perfect score (5+ cards, all correct).
	{
		id: 'perfect_session',
		trigger: (ctx) =>
			ctx.event === 'session_complete' &&
			ctx.session != null &&
			ctx.session.score === ctx.session.size &&
			ctx.session.size >= 5,
		message: { en: 'Perfect run. خوشگلم.', fa: 'بدون اشتباه. خوشگلم.' },
		emoji: '✨',
		tier: 'affectionate',
		oncePerDay: true,
		priority: 80
	},
	// First session ever.
	{
		id: 'first_session_ever',
		trigger: (ctx) =>
			ctx.event === 'session_complete' &&
			ctx.profile.streakDays === 1 &&
			ctx.prevProfile.streakDays === 0,
		message: {
			en: 'Your first session — افتخار می‌کنم بهت.',
			fa: 'اولین جلسه‌ت — افتخار می‌کنم بهت.'
		},
		emoji: '🌱',
		tier: 'affectionate',
		oneTime: true,
		priority: 100
	},
	// Streak milestones — gentle to strong.
	{
		id: 'streak_3',
		trigger: (ctx) =>
			ctx.event === 'session_complete' &&
			ctx.profile.streakDays === 3 &&
			ctx.prevProfile.streakDays !== 3,
		message: { en: 'Three days running.', fa: 'سه روز پشت سر هم.' },
		emoji: '🔥',
		tier: 'gentle',
		oneTime: true,
		priority: 70
	},
	{
		id: 'streak_7_birjand',
		trigger: (ctx) =>
			ctx.event === 'session_complete' &&
			ctx.profile.streakDays === 7 &&
			ctx.prevProfile.streakDays !== 7,
		message: {
			en: 'A whole week. مثل دختر بیرجندی، محکم.',
			fa: 'یه هفتۀ کامل. مثل دختر بیرجندی، محکم.'
		},
		emoji: '🌸',
		tier: 'strong',
		oneTime: true,
		priority: 90
	},
	{
		id: 'streak_14',
		trigger: (ctx) =>
			ctx.event === 'session_complete' &&
			ctx.profile.streakDays === 14 &&
			ctx.prevProfile.streakDays !== 14,
		message: {
			en: 'Two weeks straight. قربونت برم.',
			fa: 'دو هفتۀ کامل. قربونت برم.'
		},
		emoji: '💗',
		tier: 'strong',
		oneTime: true,
		priority: 92
	},
	{
		id: 'streak_30',
		trigger: (ctx) =>
			ctx.event === 'session_complete' &&
			ctx.profile.streakDays === 30 &&
			ctx.prevProfile.streakDays !== 30,
		message: { en: 'Thirty days. عاشقتم.', fa: 'سی روز. عاشقتم.' },
		emoji: '✨',
		tier: 'strong',
		oneTime: true,
		priority: 95
	},
	// Cleared the recall deck (graded the last lapsed card to Got it / Easy).
	{
		id: 'recall_cleared',
		trigger: (ctx) => ctx.event === 'recall_cleared',
		message: {
			en: 'Recall deck empty. شیطون!',
			fa: 'دستۀ مرور خالی شد. شیطون!'
		},
		emoji: '🎯',
		tier: 'affectionate',
		oncePerDay: true,
		priority: 60
	},
	// Level up — playful Persian high-praise phrase.
	{
		id: 'level_up',
		trigger: (ctx) => ctx.event === 'level_up',
		message: {
			en: 'Level up. یوس به کله‌ی آریاییت.',
			fa: 'سطحت رفت بالا. یوس به کله‌ی آریاییت.'
		},
		emoji: '⬆️',
		tier: 'strong',
		priority: 85
	}
];

function isUnlocked(egg: Egg, profile: Profile, now: number): boolean {
	if (egg.oneTime) return profile.unlockedEggs.includes(egg.id);
	if (egg.oncePerDay) return profile.unlockedEggs.includes(`${egg.id}:${dateKey(now)}`);
	return false;
}

export function unlockKeyFor(egg: Egg, now: number = Date.now()): string | null {
	if (egg.oneTime) return egg.id;
	if (egg.oncePerDay) return `${egg.id}:${dateKey(now)}`;
	return null;
}

/** Pick the single highest-priority egg matching across the given events. */
export function pickEggAcrossEvents(
	events: EggEvent[],
	baseCtx: Omit<EggContext, 'event'>,
	now: number = Date.now()
): Egg | null {
	const matches: Egg[] = [];
	for (const event of events) {
		const ctx = { ...baseCtx, event } as EggContext;
		for (const egg of eggs) {
			if (isUnlocked(egg, ctx.profile, now)) continue;
			if (egg.trigger(ctx)) matches.push(egg);
		}
	}
	if (matches.length === 0) return null;
	matches.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
	return matches[0];
}
