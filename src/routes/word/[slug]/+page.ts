import { error } from '@sveltejs/kit';
import { glossary } from '$lib/data/glossary';
import { slidesMentioningTerm } from '$lib/search';
import type { PageLoad } from './$types';

export const prerender = true;
export const entries = () => glossary.map((t) => ({ slug: t.slug }));

export const load: PageLoad = ({ params }) => {
	const term = glossary.find((t) => t.slug === params.slug);
	if (!term) throw error(404, 'Term not found');
	const related = slidesMentioningTerm(term, 6);
	return { term, related };
};
