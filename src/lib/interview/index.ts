/**
 * Interview bank loader + helpers. Importing this module pulls in the full
 * ~950 KB question bank, so import it ONLY from the /interview route — not from
 * the home page (use `$lib/interview/meta` there instead).
 */

import bankRaw from '$lib/data/interview-bank.json';
import type { InterviewBank, InterviewLevelId, InterviewQuestion } from './types';

export const bank = bankRaw as unknown as InterviewBank;

export const questions: InterviewQuestion[] = bank.questions;
export const levels = bank.levels;

export type { InterviewBank, InterviewQuestion, InterviewLevel, InterviewLevelId } from './types';

/** All questions for a level, in bank order. */
export function questionsForLevel(level: InterviewLevelId): InterviewQuestion[] {
	return questions.filter((q) => q.level === level);
}

/** Fisher–Yates shuffle (returns a new array; does not mutate the input). */
export function shuffle<T>(arr: readonly T[]): T[] {
	const out = arr.slice();
	for (let i = out.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}

/** Look up a single question by slug. */
export function questionBySlug(slug: string): InterviewQuestion | undefined {
	return questions.find((q) => q.slug === slug);
}
