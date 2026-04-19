<script lang="ts">
	import { theme } from '$lib/state/theme.svelte';

	const label = $derived(
		theme.pref === 'light'
			? 'Switch to dark theme'
			: theme.pref === 'dark'
				? 'Switch to system theme'
				: 'Switch to light theme'
	);
</script>

<button
	type="button"
	onclick={() => theme.cycle()}
	aria-label={label}
	title={label}
	class="grid h-7 w-7 place-items-center rounded-full text-ink-muted hover:text-ink"
>
	{#if theme.pref === 'light'}
		<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
		</svg>
	{:else if theme.pref === 'dark'}
		<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
		</svg>
	{:else}
		<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<circle cx="12" cy="12" r="9" />
			<path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none" />
		</svg>
	{/if}
</button>
