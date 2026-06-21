export { chapters, chaptersBySlug } from './chapters.generated';
export type { StoryChapter, Act } from './chapters.generated';

import { chapters } from './chapters.generated';

/** Total reading time across the whole book, in minutes. */
export const totalReadingMin = chapters.reduce((a, c) => a + c.readingMin, 0);

/** Total word count across the whole book. */
export const totalWords = chapters.reduce((a, c) => a + c.wordCount, 0);
