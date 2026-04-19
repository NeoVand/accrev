/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { build, files, version } from '$service-worker';

const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE = `accrev-cache-${version}`;
// `build` = JS / CSS bundles SvelteKit emitted. `files` = static assets in static/.
const ASSETS = [...build, ...files];

sw.addEventListener('install', (event) => {
	event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
	sw.skipWaiting();
});

sw.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
			await sw.clients.claim();
		})()
	);
});

sw.addEventListener('fetch', (event) => {
	const req = event.request;
	if (req.method !== 'GET') return;
	const url = new URL(req.url);
	if (url.origin !== sw.location.origin) return;

	// Cache-first for our build assets and static files (immutable per version).
	if (ASSETS.includes(url.pathname)) {
		event.respondWith(caches.match(req).then((r) => r ?? fetch(req)));
		return;
	}

	// Network-first for navigations and everything else, falling back to cache when offline.
	event.respondWith(
		(async () => {
			try {
				const fresh = await fetch(req);
				if (fresh.ok && fresh.type === 'basic') {
					const copy = fresh.clone();
					caches.open(CACHE).then((c) => c.put(req, copy));
				}
				return fresh;
			} catch {
				const cached = await caches.match(req);
				if (cached) return cached;
				const fallback = await caches.match('/');
				if (fallback) return fallback;
				return new Response('Offline', { status: 503, statusText: 'Offline' });
			}
		})()
	);
});
