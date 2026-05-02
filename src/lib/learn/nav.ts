import { parts, slides } from './_data';
import type { Part, Slide } from './slides.generated';

/**
 * Navigation deck — the user-facing reading order. Each section divider
 * slide is replaced by its part page (e.g. /learn/parts/foundations) so
 * Next/Prev between parts lands on the unified section opener instead of
 * a hidden "second copy" of the part hero.
 */
export type NavTarget =
	| { kind: 'slide'; slide: Slide }
	| { kind: 'part'; part: Part };

export const navDeck: NavTarget[] = slides.map((s) => {
	if (s.kind === 'divider') {
		const part = parts.find((p) => p.id === s.partId);
		if (part) return { kind: 'part', part };
	}
	return { kind: 'slide', slide: s };
});

function navIndexForSlide(slug: string): number {
	return navDeck.findIndex((t) => t.kind === 'slide' && t.slide.slug === slug);
}

function navIndexForPart(partId: string): number {
	return navDeck.findIndex((t) => t.kind === 'part' && t.part.id === partId);
}

function neighbours(idx: number): { prev?: NavTarget; next?: NavTarget } {
	if (idx < 0) return {};
	return {
		prev: idx > 0 ? navDeck[idx - 1] : undefined,
		next: idx < navDeck.length - 1 ? navDeck[idx + 1] : undefined
	};
}

export function neighboursForSlide(slug: string): { prev?: NavTarget; next?: NavTarget } {
	return neighbours(navIndexForSlide(slug));
}

export function neighboursForPart(partId: string): { prev?: NavTarget; next?: NavTarget } {
	return neighbours(navIndexForPart(partId));
}
