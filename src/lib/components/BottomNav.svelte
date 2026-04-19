<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { RouteId } from '$app/types';
	import { t } from '$lib/state/i18n.svelte';

	type NavItem = {
		route: RouteId;
		key: 'home' | 'study' | 'progress' | 'settings';
	};

	const items: NavItem[] = [
		{ route: '/', key: 'home' },
		{ route: '/study', key: 'study' },
		{ route: '/progress', key: 'progress' },
		{ route: '/settings', key: 'settings' }
	];

	/**
	 * Use `page.route.id` (logical route id like `/study`) instead of
	 * `page.url.pathname`, which is base-prefixed on sub-path deploys (e.g. GitHub
	 * Pages serving the app under `/<repo>/`) and won't match our bare routes.
	 */
	const routeId = $derived(page.route.id ?? '');

	function isActive(item: NavItem): boolean {
		if (!routeId) return false;
		if (item.route === '/') return routeId === '/';
		return routeId === item.route || routeId.startsWith(item.route + '/');
	}

	function labelFor(key: NavItem['key']): string {
		return key === 'home'
			? t('nav_home')
			: key === 'study'
				? t('nav_study')
				: key === 'progress'
					? t('nav_progress')
					: t('nav_settings');
	}
</script>

<nav
	class="z-30 grid flex-none grid-cols-4 border-t border-hairline/60 bg-bg/90 pb-[max(0.25rem,env(safe-area-inset-bottom))] backdrop-blur-md"
	aria-label="Primary"
>
	{#each items as item (item.route)}
		{@const active = isActive(item)}
		<a
			href={resolve(item.route)}
			aria-current={active ? 'page' : undefined}
			class="flex flex-col items-center gap-0.5 py-1.5 text-ink-muted aria-[current=page]:text-accent"
		>
			<span class="grid h-5 w-5 place-items-center">
				{#if item.key === 'home'}
					<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M3 11.5L12 4l9 7.5" />
						<path d="M5 10v10h14V10" />
					</svg>
				{:else if item.key === 'study'}
					<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<rect x="4" y="4" width="14" height="16" rx="1.5" />
						<path d="M8 4v16M20 6v14a2 2 0 0 1-2 2" />
					</svg>
				{:else if item.key === 'progress'}
					<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M4 18l5-5 4 4 7-8" />
						<path d="M14 9h6v6" />
					</svg>
				{:else}
					<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<circle cx="12" cy="12" r="3" />
						<path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
					</svg>
				{/if}
			</span>
			<span class="text-[9px] tracking-[0.12em] uppercase">{labelFor(item.key)}</span>
		</a>
	{/each}
</nav>
