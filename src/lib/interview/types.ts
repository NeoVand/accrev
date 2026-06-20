/**
 * Types for the consolidated interview question bank
 * (src/lib/data/interview-bank.json). The bank is bilingual: every question
 * carries parallel English and Persian content. See interview/README.md for
 * provenance and the build pipeline.
 */

export type InterviewLevelId = 1 | 2 | 3 | 4;

/** Per-language content for one question. */
export interface InterviewSide {
	question: string;
	answer: string;
	talkingPoints: string[];
	interviewerLooksFor: string;
}

export interface InterviewQuestion {
	/** Stable, unique kebab-case id. */
	slug: string;
	level: InterviewLevelId;
	/** Single topic key (controlled vocabulary). */
	topic: string;
	/** Fine-grained difficulty within the level, 1–5. */
	difficulty: 1 | 2 | 3 | 4 | 5;
	tags: string[];
	/** Which research source(s) this Q&A was consolidated from. */
	sources: string[];
	en: InterviewSide;
	fa: InterviewSide;
}

export interface InterviewLevel {
	level: InterviewLevelId;
	name: { en: string; fa: string };
	description: { en: string; fa: string };
}

export interface InterviewBank {
	schemaVersion: string;
	title: string;
	description: string;
	generatedAt: string;
	locales: string[];
	sources: { id: string; label: string }[];
	levels: InterviewLevel[];
	topics: string[];
	counts: { total: number; byLevel: Record<string, number> };
	questions: InterviewQuestion[];
}
