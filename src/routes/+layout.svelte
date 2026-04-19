<script lang="ts">
	import '../app.css';
	import '$lib/state/theme.svelte';
	import '$lib/state/i18n.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import Header from '$lib/components/Header.svelte';
	import RewardToast from '$lib/components/RewardToast.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" type="image/svg+xml" href="/icon.svg" /></svelte:head>

<div class="mx-auto flex min-h-dvh max-w-[480px] flex-col bg-bg text-ink">
	<Header />
	<main class="flex-1 px-4 pt-1 pb-3">
		{@render children()}
	</main>
	<BottomNav />
</div>

<RewardToast />
