import { error } from '@sveltejs/kit';
import { allEntriesWithSlug, entryBySlug } from '$lib/data/lookup';
import { slidesMentioningEntry } from '$lib/search';
import type { PageLoad } from './$types';

export const prerender = true;
export const entries = () =>
	allEntriesWithSlug().map((e) => ({ slug: e.slug }));

export const load: PageLoad = ({ params }) => {
	const entry = entryBySlug(params.slug);
	if (!entry) throw error(404, 'Term not found');
	const related = slidesMentioningEntry(entry, 6);
	return { entry, related };
};
