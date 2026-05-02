import { error } from '@sveltejs/kit';
import { parts, slidesByPart, slidesBySlug, type PartId } from '$lib/learn';
import { neighboursForPart } from '$lib/learn/nav';
import { extractDividerBlurbs } from '$lib/learn/divider-content';
import type { PageLoad } from './$types';

export const prerender = true;

export const entries = () => parts.map((p) => ({ id: p.id }));

export const load: PageLoad = ({ params }) => {
	const part = parts.find((p) => p.id === params.id);
	if (!part) throw error(404, 'Part not found');

	const divider = slidesBySlug[part.dividerSlug];
	const { prev, next } = neighboursForPart(part.id);
	const blurbs = divider ? extractDividerBlurbs(divider.body) : { en: '', fa: '' };

	return {
		part,
		slides: slidesByPart[part.id as PartId] ?? [],
		blurbEn: blurbs.en,
		blurbFa: blurbs.fa,
		prev,
		next
	};
};
