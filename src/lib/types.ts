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
