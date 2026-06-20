/**
 * Lightweight interview question index — slug + level + topic + the question
 * text (EN/FA) only, NO answers. ~60 KB vs the ~950 KB full bank, so the book
 * pages and the Progress page can list/aggregate questions without pulling the
 * whole bank into their route chunks. The full bank (with answers) is loaded
 * only on the /interview route via `$lib/interview`.
 *
 * Generated from src/lib/data/interview-bank.json — regenerate when the bank
 * changes (see interview/README.md).
 */

import indexRaw from '$lib/data/interview-index.json';
import { topicsForPart } from './book-map';
import type { InterviewLevelId } from './types';

export interface LightQuestion {
	slug: string;
	level: InterviewLevelId;
	topic: string;
	q_en: string;
	q_fa: string;
}

export const lightQuestions = indexRaw as unknown as LightQuestion[];

export const lightBySlug: Record<string, LightQuestion> = Object.fromEntries(
	lightQuestions.map((q) => [q.slug, q])
);

/** Questions reinforcing a given book part, ordered by level then bank order. */
export function questionsForPart(partId: string): LightQuestion[] {
	const topics = new Set(topicsForPart(partId));
	if (topics.size === 0) return [];
	return lightQuestions.filter((q) => topics.has(q.topic)).sort((a, b) => a.level - b.level);
}

/** Humanize a topic key ("bad-debts-allowance" → "Bad debts allowance"). */
export function topicLabel(topic: string): string {
	const s = topic.replace(/-/g, ' ');
	return s.charAt(0).toUpperCase() + s.slice(1);
}
