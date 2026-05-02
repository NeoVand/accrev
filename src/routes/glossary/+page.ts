import { allLookupEntries } from '$lib/data/lookup';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = () => ({
	entries: allLookupEntries()
});
