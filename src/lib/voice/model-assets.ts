import { SUPERTONIC_MODEL } from './catalog';

export const MODEL_ASSET_CACHE = 'accrev-supertonic-assets-v1';

export async function clearSupertonicAssets(): Promise<void> {
	if (typeof caches === 'undefined') return;
	const repositoryPath = `/${SUPERTONIC_MODEL.repository}/resolve/${SUPERTONIC_MODEL.revision}/`;
	for (const cacheName of await caches.keys()) {
		const cache = await caches.open(cacheName);
		const requests = await cache.keys();
		await Promise.all(
			requests
				.filter((request) => new URL(request.url).pathname.includes(repositoryPath))
				.map((request) => cache.delete(request))
		);
	}
}
