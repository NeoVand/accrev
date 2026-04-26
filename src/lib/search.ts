/**
 * Unified search across the two corpora that exist in the app:
 *   • flashcard `Term`s in `src/lib/data/glossary.ts`
 *   • learn-section `Slide`s in `src/lib/learn/slides.generated.ts`
 *
 * Used by the home-page autocomplete: a user typing "depreciation" should
 * see the term card AND every slide that explains it, ranked sensibly.
 */

import { glossary } from './data/glossary';
import { slides as learnSlides, type Slide } from './learn/slides.generated';
import type { Term } from './types';

export type AnyHitKind = 'term' | 'slide';

export interface TermHit {
	kind: 'term';
	score: number;
	term: Term;
	matched: string;
	snippet: string;
}

export interface SlideHit {
	kind: 'slide';
	score: number;
	slide: Slide;
	matched: string;
	snippet: string;
}

export type AnyHit = TermHit | SlideHit;

function normalize(s: string): string {
	return (s || '')
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[ً-ْٰ]/g, '')
		// Collapse Persian/Arabic letters that have multiple unicode forms
		.replace(/[يى]/g, 'ی')
		.replace(/[ك]/g, 'ک');
}

function snippet(text: string, query: string, ctx = 50): string {
	const t = text || '';
	const idx = normalize(t).indexOf(normalize(query));
	if (idx < 0) return t.slice(0, ctx * 2) + (t.length > ctx * 2 ? '…' : '');
	const start = Math.max(0, idx - ctx);
	const end = Math.min(t.length, idx + query.length + ctx);
	return (start > 0 ? '…' : '') + t.slice(start, end).trim() + (end < t.length ? '…' : '');
}

function termPlain(t: Term): string {
	return [
		t.en.term,
		t.en.acronym,
		t.en.expansion,
		t.en.definition,
		t.en.example,
		t.fa.term,
		t.fa.acronym,
		t.fa.definition,
		t.fa.transliteration
	]
		.filter(Boolean)
		.join(' ');
}

interface SearchOpts {
	max?: number;
	maxPerKind?: number;
}

/** Search both corpora, returning a categorized result set. */
export function searchEverything(
	rawQuery: string,
	opts: SearchOpts = {}
): { terms: TermHit[]; slides: SlideHit[]; total: number } {
	const q = rawQuery.trim();
	if (!q) return { terms: [], slides: [], total: 0 };

	const termsList = q.split(/\s+/).map(normalize).filter(Boolean);
	const max = opts.max ?? 24;
	const maxPerKind = opts.maxPerKind ?? 12;

	// ─── Terms ──────────────────────────────────────────────────────
	const termHits: TermHit[] = [];
	for (const term of glossary) {
		const enTerm = normalize(term.en.term);
		const faTerm = normalize(term.fa.term);
		const acronym = normalize(term.en.acronym || '');
		const expansion = normalize(term.en.expansion || '');
		const enDef = normalize(term.en.definition || '');
		const faDef = normalize(term.fa.definition || '');

		let score = 0;
		let allHit = true;
		for (const t of termsList) {
			let s = 0;
			// Exact start of term — highest
			if (enTerm.startsWith(t) || faTerm.startsWith(t)) s = Math.max(s, 30);
			else if (enTerm.includes(t) || faTerm.includes(t)) s = Math.max(s, 18);
			// Acronym
			if (acronym && acronym.includes(t)) s = Math.max(s, 22);
			// Expansion
			if (expansion.includes(t)) s = Math.max(s, 12);
			// Definition body
			if (enDef.includes(t) || faDef.includes(t)) s = Math.max(s, 5);
			if (s === 0) allHit = false;
			score += s;
		}
		if (termsList.length > 1 && allHit) score += 4;
		if (score === 0) continue;

		termHits.push({
			kind: 'term',
			score,
			term,
			matched: q,
			snippet: snippet(term.en.definition, q)
		});
	}
	termHits.sort((a, b) => b.score - a.score);

	// ─── Slides ─────────────────────────────────────────────────────
	const slideHits: SlideHit[] = [];
	for (const slide of learnSlides) {
		const title = normalize(slide.title);
		const eyebrowEn = normalize(slide.eyebrowEn);
		const eyebrowFa = normalize(slide.eyebrowFa);
		const plain = normalize(slide.plain);

		let score = 0;
		let allHit = true;
		for (const t of termsList) {
			let s = 0;
			if (title.includes(t)) s = Math.max(s, 14);
			if (eyebrowEn.includes(t) || eyebrowFa.includes(t)) s = Math.max(s, 9);
			if (plain.includes(t)) s = Math.max(s, 3);
			if (s === 0) allHit = false;
			score += s;
		}
		if (termsList.length > 1 && allHit) score += 3;
		if (score === 0) continue;

		slideHits.push({
			kind: 'slide',
			score,
			slide,
			matched: q,
			snippet: snippet(slide.plain, q)
		});
	}
	slideHits.sort((a, b) => b.score - a.score);

	const terms = termHits.slice(0, maxPerKind);
	const slides = slideHits.slice(0, maxPerKind);
	return {
		terms,
		slides,
		total: Math.min(terms.length + slides.length, max)
	};
}

/** Find slides that mention a given term (used by /word/[slug] context view). */
export function slidesMentioningTerm(term: Term, max = 8): Slide[] {
	const queries = [term.en.term, term.en.acronym, term.fa.term].filter(Boolean) as string[];
	if (queries.length === 0) return [];
	const seen = new Set<string>();
	const out: { slide: Slide; score: number }[] = [];
	for (const slide of learnSlides) {
		const plain = normalize(slide.plain);
		const title = normalize(slide.title);
		const eyebrow = normalize(slide.eyebrowEn + ' ' + slide.eyebrowFa);
		let score = 0;
		for (const q of queries) {
			const n = normalize(q);
			if (!n) continue;
			if (title.includes(n)) score += 12;
			if (eyebrow.includes(n)) score += 6;
			if (plain.includes(n)) score += 2;
		}
		if (score > 0 && !seen.has(slide.slug)) {
			seen.add(slide.slug);
			out.push({ slide, score });
		}
	}
	out.sort((a, b) => b.score - a.score);
	return out.slice(0, max).map((x) => x.slide);
}
