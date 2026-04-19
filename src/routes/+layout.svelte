<script lang="ts">
	import { fade } from 'svelte/transition';
	import '../app.css';
	import '$lib/state/theme.svelte';
	import '$lib/state/i18n.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import Header from '$lib/components/Header.svelte';
	import RewardToast from '$lib/components/RewardToast.svelte';
	import Welcome from '$lib/components/Welcome.svelte';
	import { lock } from '$lib/state/lock.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" type="image/svg+xml" href="/icon.svg" /></svelte:head>

{#if !lock.unlocked}
	<div in:fade={{ duration: 240 }}>
		<Welcome />
	</div>
{:else}
	<!-- App shell: fixed viewport height, only the main column scrolls. Header + nav stay put. -->
	<div
		class="mx-auto flex h-dvh max-w-[480px] flex-col overflow-hidden bg-bg text-ink"
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
