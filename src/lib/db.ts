import { browser } from '$app/environment';
import Dexie, { type Table } from 'dexie';
import { cardToReview, nextCard } from './fsrs';
import type {
	CardDirection,
	CpaSection,
	Grade,
	Profile,
	Review,
	Session,
	Term
} from './types';

class AccrevDB extends Dexie {
	terms!: Table<Term, number>;
	reviews!: Table<Review, number>;
	sessions!: Table<Session, number>;
	profile!: Table<Profile, number>;

	constructor() {
		super('accrev');
		this.version(1).stores({
			terms: '++id, &slug, itemType, cpaSection, *categories, *tags, updatedAt',
			reviews: '++id, termId, direction, dueAt, state, [termId+direction]',
			sessions: '++id, startedAt, endedAt',
			profile: '++id'
		});
		this.version(2)
			.stores({
				terms: '++id, &slug, itemType, cpaSection, lapsed, *categories, *tags, updatedAt',
				reviews: '++id, termId, direction, dueAt, state, [termId+direction]',
				sessions: '++id, startedAt, endedAt',
				profile: '++id'
			})
			.upgrade((tx) =>
				tx
					.table('terms')
					.toCollection()
					.modify((t) => {
						if (typeof t.lapsed !== 'number') t.lapsed = 0;
						if (typeof t.lapseCount !== 'number') t.lapseCount = 0;
					})
			);
	}
}

let _db: AccrevDB | null = null;

export function db(): AccrevDB {
	if (!browser) {
		throw new Error('accrev db is browser-only');
	}
	if (!_db) {
		_db = new AccrevDB();
	}
	return _db;
}

export async function getOrCreateProfile(): Promise<Profile> {
	const d = db();
	const existing = await d.profile.get(1);
	if (existing) return existing;
	const profile: Profile = {
		id: 1,
		streakDays: 0,
		totalXp: 0,
		level: 1,
		unlockedEggs: [],
		theme: 'system',
		uiLang: 'en',
		createdAt: Date.now()
	};
	await d.profile.put(profile);
	return profile;
}

export async function markLapsed(termId: number): Promise<void> {
	const t = await db().terms.get(termId);
	await db().terms.update(termId, {
		lapsed: 1,
		lapseCount: (t?.lapseCount ?? 0) + 1,
		updatedAt: Date.now()
	});
}

export async function markRecovered(termId: number): Promise<void> {
	await db().terms.update(termId, { lapsed: 0, updatedAt: Date.now() });
}

export async function countLapsed(): Promise<number> {
	return db().terms.where('lapsed').equals(1).count();
}

/** Apply a grade: schedule the next review via FSRS, persist, and update the lapsed flag. */
export async function gradeReview(
	termId: number,
	direction: CardDirection,
	grade: Grade,
	now: Date = new Date()
): Promise<Review> {
	const d = db();
	const existing = await d.reviews.where('[termId+direction]').equals([termId, direction]).first();
	const card = nextCard(existing ?? null, grade, now);
	const next = cardToReview(card, termId, direction);
	let saved: Review;
	if (existing?.id != null) {
		await d.reviews.update(existing.id, next);
		saved = { ...next, id: existing.id };
	} else {
		const id = await d.reviews.add(next as Review);
		saved = { ...next, id: id as number };
	}
	if (grade === 1) await markLapsed(termId);
	else if (grade >= 3) await markRecovered(termId);
	return saved;
}

/**
 * A term counts as "due today" if it has no review yet (brand new) OR at least one direction's
 * Review.dueAt is in the past. Unique by term id.
 */
export async function countDueTerms(now: number = Date.now()): Promise<number> {
	const d = db();
	const allTermIds = (await d.terms.toCollection().primaryKeys()) as number[];
	const reviews = await d.reviews.toArray();
	const reviewedTermIds = new Set(reviews.map((r) => r.termId));
	const newCount = allTermIds.filter((id) => !reviewedTermIds.has(id)).length;
	const dueTermIds = new Set(
		reviews.filter((r) => r.dueAt <= now).map((r) => r.termId)
	);
	return newCount + dueTermIds.size;
}

export async function countByCpaSection(section: CpaSection): Promise<number> {
	return db().terms.where('cpaSection').equals(section).count();
}

/** Section mastery: how many terms have at least one review that has graduated to FSRS 'review' state. */
export async function getSectionStats(
	section: CpaSection
): Promise<{ total: number; mastered: number; lapsed: number }> {
	const d = db();
	const terms = await d.terms.where('cpaSection').equals(section).toArray();
	const total = terms.length;
	const lapsed = terms.filter((t) => t.lapsed === 1).length;
	if (total === 0) return { total: 0, mastered: 0, lapsed: 0 };
	const termIds = terms.map((t) => t.id!).filter((id): id is number => id != null);
	const reviews = await d.reviews.where('termId').anyOf(termIds).toArray();
	const masteredIds = new Set(reviews.filter((r) => r.state === 'review').map((r) => r.termId));
	return { total, mastered: masteredIds.size, lapsed };
}

export async function getRecentSessions(limit = 5): Promise<Session[]> {
	return db().sessions.orderBy('startedAt').reverse().limit(limit).toArray();
}

/** Map of YYYY-MM-DD → number of sessions started that day, for the heatmap. */
export async function getStudyDayCounts(daysBack: number): Promise<Record<string, number>> {
	const since = Date.now() - daysBack * 86400000;
	const sessions = await db().sessions.where('startedAt').above(since).toArray();
	const counts: Record<string, number> = {};
	for (const s of sessions) {
		const key = dateKey(s.startedAt);
		counts[key] = (counts[key] ?? 0) + 1;
	}
	return counts;
}

export function dateKey(ts: number): string {
	const d = new Date(ts);
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${y}-${m}-${day}`;
}

/** Update the profile streak after a completed session. Rules: same-day = no change,
 *  yesterday = +1, otherwise streak resets to 1. */
export async function updateStreak(now: number = Date.now()): Promise<Profile> {
	const d = db();
	const profile = await getOrCreateProfile();
	const today = dateKey(now);
	const yesterday = dateKey(now - 86400000);

	let streakDays = profile.streakDays;
	if (profile.lastStudyDate === today) {
		// already studied today, keep streak
	} else if (profile.lastStudyDate === yesterday) {
		streakDays = profile.streakDays + 1;
	} else {
		streakDays = 1;
	}

	const updated: Profile = { ...profile, streakDays, lastStudyDate: today };
	await d.profile.put(updated);
	return updated;
}

export async function addXp(amount: number): Promise<Profile> {
	const d = db();
	const profile = await getOrCreateProfile();
	const totalXp = profile.totalXp + amount;
	const level = 1 + Math.floor(totalXp / 100);
	const updated: Profile = { ...profile, totalXp, level };
	await d.profile.put(updated);
	return updated;
}

/**
 * Nuclear reset — closes Dexie, deletes the entire IndexedDB, and wipes every `accrev:*`
 * localStorage entry (lock, theme, lang, seed version, unlocked eggs). Caller should reload
 * the page after this so a fresh DB + locked welcome screen come up cleanly.
 */
export async function wipeEverything(): Promise<void> {
	if (!browser) return;
	if (_db) {
		_db.close();
		_db = null;
	}
	await new Promise<void>((resolve, reject) => {
		const req = indexedDB.deleteDatabase('accrev');
		req.onsuccess = () => resolve();
		req.onerror = () => reject(req.error);
		req.onblocked = () => resolve();
	});
	for (let i = localStorage.length - 1; i >= 0; i--) {
		const k = localStorage.key(i);
		if (k?.startsWith('accrev:')) localStorage.removeItem(k);
	}
}

export async function recordEggUnlock(key: string): Promise<Profile> {
	const d = db();
	const profile = await getOrCreateProfile();
	if (profile.unlockedEggs.includes(key)) return profile;
	const updated: Profile = {
		...profile,
		unlockedEggs: [...profile.unlockedEggs, key]
	};
	await d.profile.put(updated);
	return updated;
}
