// Types come straight from the generator…
export type {
	PartId,
	Part,
	Slide,
	SlideKind,
	SlideVariant
} from './slides.generated';

// …but slide *data* is the filtered view (the bilingual glossary slide is
// hidden in favor of the full /glossary page).
export { parts, slides, slidesByPart, slidesBySlug } from './_data';

export * from './search';
export * from './nav';
