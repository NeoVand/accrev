import { error, redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { parts, slides, slidesBySlug } from '$lib/learn';
import { neighboursForSlide } from '$lib/learn/nav';
import type { PageLoad } from './$types';

export const prerender = true;

export const entries = () => slides.map((s) => ({ slug: s.slug }));

export const load: PageLoad = ({ params }) => {
	const slide = slidesBySlug[params.slug];
	if (!slide) throw error(404, 'Slide not found');

	// Section-divider slugs are aliases for their part page now — the part
	// page absorbed the divider's hero treatment so there's a single
	// "section opener" per part. Redirect old/bookmarked divider URLs.
	if (slide.kind === 'divider') {
		throw redirect(307, resolve(`/learn/parts/${slide.partId}` as never));
	}

	const { prev, next } = neighboursForSlide(slide.slug);
	const part = parts.find((p) => p.id === slide.partId);

	return { slide, prev, next, part };
};
