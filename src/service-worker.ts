/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { build, files, version } from '$service-worker';

const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE = `accrev-cache-${version}`;
// `build` = JS / CSS bundles SvelteKit emitted. `files` = static assets in static/.
const ASSETS = [...build, ...files];
// ONNX Runtime contributes large worker/WASM files that most sessions never
// need. Fetch and cache them on first voice use instead of delaying service
// worker installation for every visitor.
const isHeavyRuntimeAsset = (asset: string) =>
	asset.endsWith('.wasm') || asset.includes('/workers/');
const PRECACHE = ASSETS.filter((asset) => !isHeavyRuntimeAsset(asset));
const RUNTIME_CACHEABLE = new Set(ASSETS.filter(isHeavyRuntimeAsset));

sw.addEventListener('install', (event) => {
	event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)));
	sw.skipWaiting();
});

sw.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			// Only retire old app-shell caches. The Supertonic model is hundreds
			// of megabytes and lives in its own resumable cache, so an app update
			// must not force users to download it again.
			await Promise.all(
				keys
					.filter((key) => key.startsWith('accrev-cache-') && key !== CACHE)
					.map((key) => caches.delete(key))
			);
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
		event.respondWith(
			(async () => {
				const cached = await caches.match(req);
				if (cached) return cached;
				const response = await fetch(req);
				if (response.ok && RUNTIME_CACHEABLE.has(url.pathname)) {
					void caches.open(CACHE).then((cache) => cache.put(req, response.clone()));
				}
				return response;
			})()
		);
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
