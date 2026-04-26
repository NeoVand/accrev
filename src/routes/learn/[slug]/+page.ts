import { error } from '@sveltejs/kit';
import { parts, slides, slidesBySlug } from '$lib/learn';
import type { PageLoad } from './$types';

export const prerender = true;

export const entries = () => slides.map((s) => ({ slug: s.slug }));

export const load: PageLoad = ({ params }) => {
	const slide = slidesBySlug[params.slug];
	if (!slide) throw error(404, 'Slide not found');

	const idx = slides.findIndex((s) => s.slug === slide.slug);
	const prev = idx > 0 ? slides[idx - 1] : undefined;
	const next = idx < slides.length - 1 ? slides[idx + 1] : undefined;
	const part = parts.find((p) => p.id === slide.partId);

	return { slide, prev, next, part };
};
