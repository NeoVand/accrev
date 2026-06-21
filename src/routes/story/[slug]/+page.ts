import { error } from '@sveltejs/kit';
import { chapters, chaptersBySlug } from '$lib/story';
import { neighbours } from '$lib/story/nav';
import type { PageLoad } from './$types';

export const prerender = true;

export const entries = () => chapters.map((c) => ({ slug: c.slug }));

export const load: PageLoad = ({ params }) => {
	const chapter = chaptersBySlug[params.slug];
	if (!chapter) throw error(404, 'Chapter not found');
	const { prev, next } = neighbours(chapter.slug);
	return { chapter, prev, next };
};
