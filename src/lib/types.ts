export type CpaSection = 'Foundational' | 'FAR' | 'AUD' | 'REG' | 'BAR' | 'ISC' | 'TCP';
export type ItemType = 'term' | 'sentence' | 'mc' | 'tf';
export type CardDirection = 'en→fa' | 'fa→en';
export type Grade = 1 | 2 | 3 | 4;
export type Theme = 'light' | 'dark' | 'system';
export type UiLang = 'en' | 'fa';

export interface Term {
	id?: number;
	slug: string;
	itemType: ItemType;
	en: {
		term: string;
		acronym?: string;
		expansion?: string;
		definition: string;
		example?: string;
	};
	fa: {
		term: string;
		acronym?: string;
		definition?: string;
		transliteration?: string;
	};
	categories: string[];
	cpaSection?: CpaSection;
	topic?: string;
	difficulty?: 1 | 2 | 3 | 4 | 5;
	tags?: string[];
	source?: string;
	/** 1 if the most recent grade was "Again"; cleared on Good/Easy. Indexed for fast deck queries. */
	lapsed: 0 | 1;
	lapseCount: number;
	createdAt: number;
	updatedAt: number;
}

export interface Review {
	id?: number;
	termId: number;
	direction: CardDirection;
	stability: number;
	difficulty: number;
	dueAt: number;
	reps: number;
	lapses: number;
	lastReviewedAt?: number;
	state: 'new' | 'learning' | 'review' | 'relearning';
}

export interface SessionAnswer {
	termId: number;
	direction: CardDirection;
	grade: Grade;
	hintUsed: boolean;
	durationMs: number;
}

export interface Session {
	id?: number;
	startedAt: number;
	endedAt?: number;
	deckFilter?: { categories?: string[]; cpaSection?: CpaSection };
	size: number;
	direction: CardDirection | 'mixed';
	answers: SessionAnswer[];
	score: number;
	xpEarned: number;
}

export interface Profile {
	id?: number;
	streakDays: number;
	lastStudyDate?: string;
	totalXp: number;
	level: number;
	unlockedEggs: string[];
	theme: Theme;
	uiLang: UiLang;
	createdAt: number;
}

/**
 * Per-question record of how the user self-rated an interview question. Keyed by
 * the question's `slug` (one row per question; re-grading overwrites). Used to
 * show per-level progress on the interview landing and to resume sessions.
 */
export interface InterviewProgress {
	slug: string;
	level: number;
	/** Last self-rating: 1 Forgot · 2 Hard · 3 Got it · 4 Easy. */
	grade: Grade;
	/** How many times this question has been graded. */
	seenCount: number;
	lastSeenAt: number;
	updatedAt: number;
}

/**
 * A completed interview session — logged so the Progress page can show effort
 * over time and a sense of improvement.
 */
export interface InterviewSession {
	id?: number;
	endedAt: number;
	/** What was practiced: 'all', 'level:1'…'level:4', or 'part:foundations' etc. */
	scope: string;
	total: number;
	/** Questions self-rated Got it or Easy (grade ≥ 3). */
	answered: number;
	forgot: number;
	hard: number;
	gotIt: number;
	easy: number;
}
