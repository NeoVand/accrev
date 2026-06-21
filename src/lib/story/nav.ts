import { chapters, type StoryChapter } from './chapters.generated';

export function neighbours(slug: string): { prev?: StoryChapter; next?: StoryChapter } {
	const i = chapters.findIndex((c) => c.slug === slug);
	if (i === -1) return {};
	return {
		prev: i > 0 ? chapters[i - 1] : undefined,
		next: i < chapters.length - 1 ? chapters[i + 1] : undefined
	};
}
