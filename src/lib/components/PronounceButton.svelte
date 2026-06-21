<script lang="ts">
	import { onMount } from 'svelte';
	import { canPronounce } from '$lib/audio';
	import { quickSpeak } from '$lib/speak.svelte';
	import { t } from '$lib/state/i18n.svelte';

	type Props = {
		text: string;
		lang?: string;
		label?: string;
		class?: string;
	};

	let { text, label, class: className = '' }: Props = $props();

	let supported = $state(false);
	// Token from the active speak() call; compared against the shared service.
	let id = $state(0);
	const speaking = $derived(quickSpeak.isActive(id));
	const loading = $derived(quickSpeak.isLoading(id));
	const busy = $derived(speaking || loading);

	onMount(() => {
		supported = canPronounce();
		if (supported) quickSpeak.prime();
	});

	function toggle(e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		if (busy) {
			quickSpeak.stop();
			id = 0;
			return;
		}
		if (!text) return;
		id = quickSpeak.speak(text);
	}

	const playLabel = $derived(label ?? `${t('hear_pronunciation')}: ${text}`);
	const stopLabel = $derived(t('stop_pronunciation'));
	const ariaLabel = $derived(busy ? stopLabel : playLabel);
</script>

{#if supported}
	<button
		type="button"
		onclick={toggle}
		aria-label={ariaLabel}
		title={ariaLabel}
		aria-pressed={busy}
		class="grid h-8 w-8 place-items-center rounded-full text-ink-muted hover:text-accent aria-pressed:text-accent {className}"
	>
		{#if loading}
			<span class="pb-spin" aria-hidden="true"></span>
		{:else if speaking}
			<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="none" aria-hidden="true">
				<rect x="6" y="5" width="4" height="14" rx="1" />
				<rect x="14" y="5" width="4" height="14" rx="1" />
			</svg>
		{:else}
			<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M11 5L6 9H2v6h4l5 4z" fill="currentColor" stroke="none" />
				<path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
				<path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
			</svg>
		{/if}
	</button>
{/if}

<style>
	.pb-spin {
		width: 14px;
		height: 14px;
		border-radius: 999px;
		border: 2px solid color-mix(in oklab, currentColor 30%, transparent);
		border-top-color: currentColor;
		animation: pb-spin 0.7s linear infinite;
	}
	@keyframes pb-spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
