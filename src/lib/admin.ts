import { db } from './db';
import type { CpaSection, ItemType, Profile, Review, Session, Term } from './types';

const VALID_CPA: readonly CpaSection[] = [
	'Foundational',
	'FAR',
	'AUD',
	'REG',
	'BAR',
	'ISC',
	'TCP'
] as const;

const VALID_ITEM_TYPE: readonly ItemType[] = ['term', 'sentence', 'mc', 'tf'] as const;

export type TermInput = {
	slug: string;
	itemType?: ItemType;
	en: {
		term: string;
		acronym?: string;
		expansion?: string;
		definition: string;
		example?: string;
	};
	fa: {
		term: string;
		acronym?: string;
		definition?: string;
		transliteration?: string;
	};
	categories?: string[];
	cpaSection?: CpaSection;
	topic?: string;
	difficulty?: 1 | 2 | 3 | 4 | 5;
	tags?: string[];
	source?: string;
};

export type ValidationError = {
	/** -1 for root-level errors (e.g. invalid JSON, not an array). */
	index: number;
	field: string;
	message: string;
};

type RawEntry = Record<string, unknown> | null | undefined;

function isObj(x: unknown): x is Record<string, unknown> {
	return typeof x === 'object' && x !== null;
}

function nonEmptyString(x: unknown): x is string {
	return typeof x === 'string' && x.trim().length > 0;
}

export function parseTermsJson(
	text: string
): { terms: TermInput[]; errors: ValidationError[] } {
	const errors: ValidationError[] = [];
	const out: TermInput[] = [];

	let parsed: unknown;
	try {
		parsed = JSON.parse(text);
	} catch (e) {
		errors.push({
			index: -1,
			field: 'root',
			message: 'Invalid JSON: ' + (e as Error).message
		});
		return { terms: [], errors };
	}

	if (!Array.isArray(parsed)) {
		errors.push({ index: -1, field: 'root', message: 'Expected a JSON array of term objects' });
		return { terms: [], errors };
	}

	parsed.forEach((raw: RawEntry, i: number) => {
		const add = (field: string, message: string) => errors.push({ index: i, field, message });
		if (!isObj(raw)) {
			add('root', 'Entry must be an object');
			return;
		}
		const en = isObj(raw.en) ? raw.en : undefined;
		const fa = isObj(raw.fa) ? raw.fa : undefined;

		if (!nonEmptyString(raw.slug)) add('slug', 'Required non-empty string');
		if (!en) add('en', 'Required object with term + definition');
		else {
			if (!nonEmptyString(en.term)) add('en.term', 'Required non-empty string');
			if (!nonEmptyString(en.definition)) add('en.definition', 'Required non-empty string');
		}
		if (!fa) add('fa', 'Required object with term');
		else {
			if (!nonEmptyString(fa.term)) add('fa.term', 'Required non-empty string');
		}
		if (raw.cpaSection != null && !VALID_CPA.includes(raw.cpaSection as CpaSection)) {
			add('cpaSection', `Must be one of: ${VALID_CPA.join(', ')}`);
		}
		if (raw.itemType != null && !VALID_ITEM_TYPE.includes(raw.itemType as ItemType)) {
			add('itemType', `Must be one of: ${VALID_ITEM_TYPE.join(', ')}`);
		}
		if (raw.difficulty != null) {
			const d = raw.difficulty;
			if (typeof d !== 'number' || d < 1 || d > 5) add('difficulty', 'Must be an integer 1–5');
		}
		if (raw.categories != null && !Array.isArray(raw.categories)) {
			add('categories', 'Must be an array of strings');
		}
		if (raw.tags != null && !Array.isArray(raw.tags)) {
			add('tags', 'Must be an array of strings');
		}

		if (errors.some((e) => e.index === i)) return;

		// All required fields present and valid — coerce into TermInput
		out.push({
			slug: (raw.slug as string).trim(),
			itemType: (raw.itemType as ItemType | undefined) ?? 'term',
			en: {
				term: (en!.term as string).trim(),
				definition: (en!.definition as string).trim(),
				...(nonEmptyString(en!.acronym) ? { acronym: (en!.acronym as string).trim() } : {}),
				...(nonEmptyString(en!.expansion) ? { expansion: (en!.expansion as string).trim() } : {}),
				...(nonEmptyString(en!.example) ? { example: (en!.example as string).trim() } : {})
			},
			fa: {
				term: (fa!.term as string).trim(),
				...(nonEmptyString(fa!.definition) ? { definition: (fa!.definition as string).trim() } : {}),
				...(nonEmptyString(fa!.acronym) ? { acronym: (fa!.acronym as string).trim() } : {}),
				...(nonEmptyString(fa!.transliteration)
					? { transliteration: (fa!.transliteration as string).trim() }
					: {})
			},
			...(Array.isArray(raw.categories) ? { categories: raw.categories as string[] } : {}),
			...(raw.cpaSection ? { cpaSection: raw.cpaSection as CpaSection } : {}),
			...(nonEmptyString(raw.topic) ? { topic: (raw.topic as string).trim() } : {}),
			...(typeof raw.difficulty === 'number'
				? { difficulty: raw.difficulty as 1 | 2 | 3 | 4 | 5 }
				: {}),
			...(Array.isArray(raw.tags) ? { tags: raw.tags as string[] } : {}),
			...(nonEmptyString(raw.source) ? { source: (raw.source as string).trim() } : {})
		});
	});

	return { terms: out, errors };
}

export async function previewTerms(
	terms: TermInput[]
): Promise<{ newCount: number; updateCount: number }> {
	const d = db();
	let newCount = 0;
	let updateCount = 0;
	for (const t of terms) {
		const existing = await d.terms.where('slug').equals(t.slug).first();
		if (existing) updateCount++;
		else newCount++;
	}
	return { newCount, updateCount };
}

export async function applyTerms(
	terms: TermInput[]
): Promise<{ inserted: number; updated: number }> {
	const d = db();
	const now = Date.now();
	let inserted = 0;
	let updated = 0;
	await d.transaction('rw', d.terms, async () => {
		for (const t of terms) {
			const existing = await d.terms.where('slug').equals(t.slug).first();
			const fields = {
				slug: t.slug,
				itemType: t.itemType ?? 'term',
				en: t.en,
				fa: t.fa,
				categories: t.categories ?? [],
				cpaSection: t.cpaSection,
				topic: t.topic,
				difficulty: t.difficulty,
				tags: t.tags,
				source: t.source ?? 'admin-paste'
			};
			if (existing?.id != null) {
				await d.terms.update(existing.id, {
					...fields,
					lapsed: existing.lapsed,
					lapseCount: existing.lapseCount,
					updatedAt: now
				});
				updated++;
			} else {
				await d.terms.add({
					...fields,
					lapsed: 0,
					lapseCount: 0,
					createdAt: now,
					updatedAt: now
				} as Term);
				inserted++;
			}
		}
	});
	return { inserted, updated };
}

/** Full-state backup format. Versioned so we can migrate safely if the schema evolves. */
export type Backup = {
	version: 1;
	exportedAt: number;
	terms: Term[];
	reviews: Review[];
	sessions: Session[];
	profile: Profile | null;
};

export async function exportBackup(): Promise<Backup> {
	const d = db();
	return {
		version: 1,
		exportedAt: Date.now(),
		terms: await d.terms.toArray(),
		reviews: await d.reviews.toArray(),
		sessions: await d.sessions.toArray(),
		profile: (await d.profile.get(1)) ?? null
	};
}

export function triggerBackupDownload(backup: Backup): void {
	const json = JSON.stringify(backup, null, 2);
	const blob = new Blob([json], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	const ymd = new Date().toISOString().slice(0, 10);
	a.download = `accrev-backup-${ymd}.json`;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}

export async function importBackup(
	text: string
): Promise<{ ok: true; summary: string } | { ok: false; error: string }> {
	let parsed: unknown;
	try {
		parsed = JSON.parse(text);
	} catch (e) {
		return { ok: false, error: 'Invalid JSON: ' + (e as Error).message };
	}
	if (!isObj(parsed)) return { ok: false, error: 'Backup must be an object' };
	if (parsed.version !== 1) return { ok: false, error: 'Unsupported backup version' };
	const terms = Array.isArray(parsed.terms) ? (parsed.terms as Term[]) : [];
	const reviews = Array.isArray(parsed.reviews) ? (parsed.reviews as Review[]) : [];
	const sessions = Array.isArray(parsed.sessions) ? (parsed.sessions as Session[]) : [];
	const profile = isObj(parsed.profile) ? (parsed.profile as Profile) : null;

	const d = db();
	await d.transaction('rw', d.terms, d.reviews, d.sessions, d.profile, async () => {
		await d.terms.clear();
		await d.reviews.clear();
		await d.sessions.clear();
		await d.profile.clear();
		if (terms.length) await d.terms.bulkAdd(terms);
		if (reviews.length) await d.reviews.bulkAdd(reviews);
		if (sessions.length) await d.sessions.bulkAdd(sessions);
		if (profile) await d.profile.put(profile);
	});
	return {
		ok: true,
		summary: `Restored ${terms.length} terms, ${reviews.length} reviews, ${sessions.length} sessions.`
	};
}

export const ADMIN_EXAMPLE_JSON = JSON.stringify(
	[
		{
			slug: 'example-term',
			en: {
				term: 'Example Term',
				acronym: 'EX',
				expansion: 'Example Term Expansion',
				definition: 'A clear, one-paragraph description of the concept in English.'
			},
			fa: {
				term: 'اصطلاح نمونه',
				definition: 'توضیح فارسی مفهوم.'
			},
			cpaSection: 'FAR',
			topic: 'Example',
			difficulty: 3,
			tags: ['example']
		}
	],
	null,
	2
);
