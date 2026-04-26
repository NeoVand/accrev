import { error } from '@sveltejs/kit';
import { parts, slidesByPart, type PartId } from '$lib/learn';
import type { PageLoad } from './$types';

export const prerender = true;

export const entries = () => parts.map((p) => ({ id: p.id }));

export const load: PageLoad = ({ params }) => {
	const part = parts.find((p) => p.id === params.id);
	if (!part) throw error(404, 'Part not found');
	return {
		part,
		slides: slidesByPart[part.id as PartId] ?? []
	};
};
