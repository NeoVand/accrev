/**
 * Combined word → entry lookup. Two corpora:
 *   1. The full glossary (curated + researched, ~480 entries) — these are the
 *      formal CPA terms that also have a /word/[slug] page.
 *   2. The review-book lexicon (lexicon.json, ~250 entries) — common
 *      accounting vocabulary that appears in slides but isn't a full
 *      glossary entry. No /word page.
 *
 * Both are normalized to a single `LookupEntry` shape so the popover and
 * the underline-injector can treat them uniformly.
 */

import { glossary } from './glossary';
import lexiconRaw from './lexicon.json';
import type { Term } from '../types';

export interface LookupEntry {
	/** Source corpus. `glossary` entries get a /word/[slug] link; `lexicon` entries don't. */
	source: 'glossary' | 'lexicon';
	/** Slug for routing (glossary only — empty for lexicon). */
	slug: string;
	/** Stable lowercase key — same one used as the index lookup. Used as the
	    persistence key for the "memorized" set so glossary and lexicon entries
	    can share a single namespace. */
	key: string;
	/** Canonical English term (display headword). */
	enTerm: string;
	enAcronym?: string;
	enExpansion?: string;
	enDefinition: string;
	enExample?: string;
	faTerm: string;
	faDefinition: string;
}

export type LookupHit = { entry: LookupEntry; matchedAs: string; original: string };

type LexiconRecord = Record<
	string,
	{
		term: string;
		definition: string;
		fa: { term: string; definition: string };
	}
>;

function fromGlossary(t: Term): LookupEntry {
	return {
		source: 'glossary',
		slug: t.slug,
		key: (t.en.term || t.slug).toLowerCase().trim(),
		enTerm: t.en.term,
		enAcronym: t.en.acronym,
		enExpansion: t.en.expansion,
		enDefinition: t.en.definition,
		enExample: t.en.example,
		faTerm: t.fa.term,
		faDefinition: t.fa.definition ?? ''
	};
}

function fromLexicon(key: string, entry: LexiconRecord[string]): LookupEntry {
	return {
		source: 'lexicon',
		slug: '',
		key: (entry.term || key).toLowerCase().trim(),
		enTerm: entry.term,
		enDefinition: entry.definition,
		faTerm: entry.fa.term,
		faDefinition: entry.fa.definition
	};
}

const exactIndex = new Map<string, LookupEntry>();

// Glossary first (so its slugged entries take precedence over lexicon).
for (const t of glossary) {
	const en = t.en.term?.toLowerCase().trim();
	if (en) exactIndex.set(en, fromGlossary(t));
	const acro = t.en.acronym?.toLowerCase().trim();
	if (acro && !exactIndex.has(acro)) exactIndex.set(acro, fromGlossary(t));
}

// Lexicon fills in the gaps.
const lexicon = lexiconRaw as LexiconRecord;
for (const [key, value] of Object.entries(lexicon)) {
	const k = key.toLowerCase().trim();
	if (!k || exactIndex.has(k)) continue;
	exactIndex.set(k, fromLexicon(key, value));
}

function stripPossessive(w: string): string {
	if (w.endsWith("'s") || w.endsWith('’s')) return w.slice(0, -2);
	if (w.endsWith("s'") || w.endsWith('s’')) return w.slice(0, -1);
	return w;
}

/** Generate plausible base forms for a token, in priority order. */
function lemmaCandidates(w: string): string[] {
	const out: string[] = [];

	if (w.endsWith('ies') && w.length > 4) out.push(w.slice(0, -3) + 'y');
	if (w.endsWith('ves') && w.length > 4) out.push(w.slice(0, -3) + 'f');
	if (w.endsWith('es') && w.length > 3) out.push(w.slice(0, -2));
	if (w.endsWith('s') && w.length > 2 && !w.endsWith('ss') && !w.endsWith('us'))
		out.push(w.slice(0, -1));

	if (w.endsWith('ing') && w.length > 5) {
		out.push(w.slice(0, -3));
		out.push(w.slice(0, -3) + 'e');
	}
	if (w.endsWith('ed') && w.length > 4) {
		out.push(w.slice(0, -2));
		out.push(w.slice(0, -1));
		// "tied" → "tie"
		if (w.endsWith('ied') && w.length > 4) out.push(w.slice(0, -3) + 'y');
	}
	if (w.endsWith('er') && w.length > 4) out.push(w.slice(0, -2));
	if (w.endsWith('est') && w.length > 5) out.push(w.slice(0, -3));

	return out;
}

const TOKEN_RE = /^[a-zA-Z][a-zA-Z'’-]*$/;

/** Common English function words / contractions that collide with short
 *  accounting acronyms ("IS" = income statement, "OR" / "BE" / "AR"…). We
 *  refuse to look these up so the underline never decorates them. */
const ENGLISH_STOPLIST = new Set([
	'a', 'an', 'and', 'as', 'at', 'be', 'by', 'do', 'go', 'he', 'i', 'if', 'in',
	'is', 'it', 'me', 'my', 'no', 'of', 'oh', 'on', 'or', 'so', 'to', 'up',
	'us', 'we', 'am', 'are', 'was', 'were', 'been', 'being', 'has', 'had',
	'have', 'his', 'her', 'its', 'our', 'their', 'them', 'they', 'you',
	'your', 'this', 'that', 'these', 'those', 'there', 'here', 'when',
	'where', 'why', 'how', 'who', 'what', 'which', 'whose', 'whom',
	'but', 'not', 'nor', 'yet', 'too', 'just', 'than', 'then', 'thus',
	'still', 'only', 'also', 'now', 'one', 'two', 'all', 'any', 'few',
	'own', 'same', 'such', 'some', 'most', 'more', 'each', 'every', 'both',
	'can', 'will', 'shall', 'may', 'must', 'might', 'could', 'would',
	'should', 'does', 'did', 'doing', 'don', "don't", 'doesn', "doesn't",
	"it's", "i'm", "you're", "they're", "we're", "we'll", "you'll",
	"i'll", "he's", "she's", "won't", "isn't", "wasn't", "weren't",
	'with', 'from', 'into', 'onto', 'over', 'under', 'about', 'after',
	'before', 'between', 'against', 'around', 'across', 'along', 'among'
]);

export function lookupWord(raw: string): LookupHit | null {
	if (!raw) return null;
	const trimmed = raw.trim().replace(/[.,;:!?()\[\]{}"]/g, '');
	if (!trimmed) return null;
	if (!TOKEN_RE.test(trimmed)) return null;
	const original = trimmed;
	const lower = trimmed.toLowerCase();
	if (ENGLISH_STOPLIST.has(lower)) return null;
	const w = stripPossessive(lower);
	if (ENGLISH_STOPLIST.has(w)) return null;

	const direct = exactIndex.get(w);
	if (direct) return { entry: direct, matchedAs: w, original };

	for (const cand of lemmaCandidates(w)) {
		const hit = exactIndex.get(cand);
		if (hit) return { entry: hit, matchedAs: cand, original };
	}

	return null;
}

/** Fast check used by the underline-injector to decide whether to wrap. */
export function isLookupCandidate(raw: string): boolean {
	if (!raw) return false;
	if (raw.length < 2) return false;
	if (!TOKEN_RE.test(raw)) return false;
	return lookupWord(raw) !== null;
}

/** All entries (glossary + lexicon), de-duplicated by `key`, sorted by enTerm. */
let _allEntries: LookupEntry[] | null = null;
export function allLookupEntries(): LookupEntry[] {
	if (_allEntries) return _allEntries;
	const seen = new Set<string>();
	const out: LookupEntry[] = [];
	for (const e of exactIndex.values()) {
		if (seen.has(e.key)) continue;
		seen.add(e.key);
		out.push(e);
	}
	out.sort((a, b) => a.enTerm.localeCompare(b.enTerm, 'en', { sensitivity: 'base' }));
	_allEntries = out;
	return out;
}

/** Look up an entry by its persistence key (lowercase term). */
export function entryByKey(key: string): LookupEntry | null {
	const k = key.toLowerCase().trim();
	return exactIndex.get(k) ?? null;
}
