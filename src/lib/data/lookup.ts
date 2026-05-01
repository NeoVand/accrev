/**
 * Lightweight word → glossary lookup. Used by the Learn-section word
 * popover (double-click any English word to see its EN + FA definition).
 *
 * Two layers:
 *   1. Direct hit: exact lowercased `enTerm` or `enAcronym` match.
 *   2. Lemma fallback: simple morphology — plural→singular, possessives,
 *      common verb forms — to catch "assets" → "asset", etc.
 *
 * Phase 3a: glossary-only. Phase 3b will grow a `lexicon.json` for
 * non-glossary review-book vocabulary; the public API stays the same.
 */

import { glossary } from './glossary';
import type { Term } from '../types';

export type LookupHit = { term: Term; matchedAs: string; original: string };

const exactIndex = new Map<string, Term>();

for (const t of glossary) {
	const en = t.en.term?.toLowerCase().trim();
	if (en) exactIndex.set(en, t);
	const acro = t.en.acronym?.toLowerCase().trim();
	if (acro && !exactIndex.has(acro)) exactIndex.set(acro, t);
}

/** Strip a trailing apostrophe-s ("company's" → "company"). */
function stripPossessive(w: string): string {
	if (w.endsWith("'s") || w.endsWith('’s')) return w.slice(0, -2);
	if (w.endsWith("s'") || w.endsWith('s’')) return w.slice(0, -1);
	return w;
}

/** Generate plausible singular/base forms for a token, in priority order. */
function lemmaCandidates(w: string): string[] {
	const out: string[] = [];

	// Plural rules
	if (w.endsWith('ies') && w.length > 4) out.push(w.slice(0, -3) + 'y'); // companies → company
	if (w.endsWith('ves') && w.length > 4) out.push(w.slice(0, -3) + 'f'); // shelves → shelf
	if (w.endsWith('es') && w.length > 3) out.push(w.slice(0, -2)); // taxes → tax
	if (w.endsWith('s') && w.length > 2 && !w.endsWith('ss')) out.push(w.slice(0, -1)); // assets → asset

	// Verb forms
	if (w.endsWith('ing') && w.length > 5) {
		out.push(w.slice(0, -3)); // depreciating → depreciat
		out.push(w.slice(0, -3) + 'e'); // depreciating → depreciate
	}
	if (w.endsWith('ed') && w.length > 4) {
		out.push(w.slice(0, -2)); // capitalized → capitaliz
		out.push(w.slice(0, -1)); // capitalize
	}

	return out;
}

const TOKEN_RE = /^[a-zA-Z][a-zA-Z'’-]*$/;

export function lookupWord(raw: string): LookupHit | null {
	if (!raw) return null;
	const trimmed = raw.trim().replace(/[.,;:!?()\[\]{}"]/g, '');
	if (!trimmed) return null;
	if (!TOKEN_RE.test(trimmed)) return null;
	const original = trimmed;
	const w = stripPossessive(trimmed.toLowerCase());

	// Direct exact match
	const direct = exactIndex.get(w);
	if (direct) return { term: direct, matchedAs: w, original };

	// Lemma fallback
	for (const cand of lemmaCandidates(w)) {
		const hit = exactIndex.get(cand);
		if (hit) return { term: hit, matchedAs: cand, original };
	}

	return null;
}

/** True if the word would have any chance of resolving — used to decide
 *  whether to even attempt opening the popover for a selection. */
export function isLookupCandidate(raw: string): boolean {
	const trimmed = raw.trim().replace(/[.,;:!?()\[\]{}"]/g, '');
	if (!trimmed) return false;
	if (trimmed.length < 2) return false;
	return TOKEN_RE.test(trimmed);
}
