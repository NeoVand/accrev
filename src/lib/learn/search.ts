import { slides, type Slide } from './slides.generated';

export interface SearchHit {
	slide: Slide;
	score: number;
	snippet: string;
	matchedQuery: string;
}

function normalize(s: string): string {
	return s
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[ً-ْٰ]/g, ''); // strip Arabic diacritics
}

function snippetAround(text: string, query: string, ctx = 60): string {
	const idx = normalize(text).indexOf(normalize(query));
	if (idx < 0) return text.slice(0, ctx * 2) + (text.length > ctx * 2 ? '…' : '');
	const start = Math.max(0, idx - ctx);
	const end = Math.min(text.length, idx + query.length + ctx);
	const lead = start === 0 ? '' : '…';
	const tail = end === text.length ? '' : '…';
	return lead + text.slice(start, end).trim() + tail;
}

/**
 * Lightweight ranked substring search across slide title, eyebrow, body plaintext.
 * Works on both English and Farsi simultaneously since `plain` contains both.
 * Title matches outrank eyebrow matches outrank body matches; multiple-term queries
 * give a small bonus when all terms hit.
 */
export function searchSlides(query: string, max = 24): SearchHit[] {
	const q = query.trim();
	if (!q) return [];
	const terms = q.split(/\s+/).map(normalize).filter(Boolean);
	if (terms.length === 0) return [];

	const hits: SearchHit[] = [];
	for (const slide of slides) {
		const title = normalize(slide.title);
		const eyebrowEn = normalize(slide.eyebrowEn);
		const eyebrowFa = normalize(slide.eyebrowFa);
		const plain = normalize(slide.plain);

		let score = 0;
		let allTermsHit = true;
		for (const term of terms) {
			let termScore = 0;
			if (title.includes(term)) termScore = Math.max(termScore, 10);
			if (eyebrowEn.includes(term) || eyebrowFa.includes(term)) {
				termScore = Math.max(termScore, 6);
			}
			if (plain.includes(term)) termScore = Math.max(termScore, 2);
			if (termScore === 0) allTermsHit = false;
			score += termScore;
		}
		if (terms.length > 1 && allTermsHit) score += 4;
		if (score === 0) continue;

		const snippet = snippetAround(slide.plain, q);
		hits.push({ slide, score, snippet, matchedQuery: q });
	}

	hits.sort((a, b) => b.score - a.score || a.slide.num - b.slide.num);
	return hits.slice(0, max);
}
