<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { asset, base } from '$app/paths';
	import { dev } from '$app/environment';
	import '../app.css';
	import '$lib/state/theme.svelte';
	import '$lib/state/i18n.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import Header from '$lib/components/Header.svelte';
	import RewardToast from '$lib/components/RewardToast.svelte';
	import Welcome from '$lib/components/Welcome.svelte';
	import { lock } from '$lib/state/lock.svelte';

	let { children } = $props();

	// Register the PWA service worker in production only. In dev, unregister any
	// stale worker so it can't serve cached pages / return 503 "Offline" while
	// developing (auto-registration is disabled in svelte.config.js).
	onMount(async () => {
		// On-device debug console: open any page with `?debug` (e.g. on a phone) to
		// get an Eruda console overlay so you can read logs/errors without a desktop.
		// `?nodebug` turns it off. The flag persists in localStorage.
		try {
			const params = new URLSearchParams(location.search);
			if (params.has('debug')) localStorage.setItem('accrev:debug', '1');
			if (params.has('nodebug')) localStorage.removeItem('accrev:debug');
			const w = window as unknown as { eruda?: { init: () => void } };
			if (localStorage.getItem('accrev:debug') === '1' && !w.eruda) {
				const s = document.createElement('script');
				s.src = 'https://cdn.jsdelivr.net/npm/eruda@3';
				s.onload = () => w.eruda?.init();
				document.head.appendChild(s);
			}
		} catch {
			/* ignore */
		}

		if (!('serviceWorker' in navigator)) return;
		if (dev) {
			const regs = await navigator.serviceWorker.getRegistrations();
			for (const r of regs) await r.unregister();
		} else {
			try {
				await navigator.serviceWorker.register(`${base}/service-worker.js`, { type: 'module' });
			} catch {
				/* ignore */
			}
		}
	});
</script>

<svelte:head><link rel="icon" type="image/svg+xml" href={asset('/icon.svg')} /></svelte:head>

{#if !lock.unlocked}
	<div in:fade={{ duration: 240 }}>
		<Welcome />
	</div>
{:else}
	<!-- App shell: fixed viewport height, only the main column scrolls. Header + nav stay put. -->
	<div
		class="app-grain mx-auto flex h-dvh max-w-[480px] flex-col overflow-hidden bg-bg text-ink"
		in:fade={{ duration: 240 }}
	>
		<Header />
		<main class="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-1 pb-3">
			{@render children()}
		</main>
		<BottomNav />
	</div>

	<RewardToast />
{/if}
