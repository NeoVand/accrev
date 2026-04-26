import { glossary } from './data/glossary';
import { db } from './db';

const SEED_VERSION_KEY = 'accrev:seed-version';
/** Bump this number when the glossary content changes to replay the upsert. */
const SEED_VERSION = 4;

export async function seedIfNeeded(): Promise<void> {
	const stored = Number(localStorage.getItem(SEED_VERSION_KEY) ?? '0');
	if (stored >= SEED_VERSION) return;

	const d = db();
	const now = Date.now();
	await d.transaction('rw', d.terms, async () => {
		for (const t of glossary) {
			const existing = await d.terms.where('slug').equals(t.slug).first();
			if (existing) {
				await d.terms.update(existing.id!, {
					...t,
					id: existing.id,
					// preserve learning state across re-seeds
					lapsed: existing.lapsed,
					lapseCount: existing.lapseCount,
					createdAt: existing.createdAt || now,
					updatedAt: now
				});
			} else {
				await d.terms.add({ ...t, createdAt: now, updatedAt: now });
			}
		}
	});
	localStorage.setItem(SEED_VERSION_KEY, String(SEED_VERSION));
}
