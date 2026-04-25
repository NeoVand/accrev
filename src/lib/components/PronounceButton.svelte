<script lang="ts">
	import { onMount } from 'svelte';
	import { canPronounce, primeVoices, pronounce, stopPronounce } from '$lib/audio';
	import { t } from '$lib/state/i18n.svelte';

	type Props = {
		text: string;
		lang?: string;
		label?: string;
		class?: string;
	};

	let { text, lang = 'en-US', label, class: className = '' }: Props = $props();

	let supported = $state(false);
	let speaking = $state(false);
	let safetyTimer: ReturnType<typeof setTimeout> | undefined;

	onMount(() => {
		supported = canPronounce();
		if (supported) primeVoices();
		return () => clearTimeout(safetyTimer);
	});

	function stop() {
		clearTimeout(safetyTimer);
		stopPronounce();
		speaking = false;
	}

	function toggle(e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		if (speaking) {
			stop();
			return;
		}
		if (!text) return;
		speaking = true;
		pronounce(text, {
			lang,
			onEnd: () => {
				speaking = false;
				clearTimeout(safetyTimer);
			}
		});
		clearTimeout(safetyTimer);
		safetyTimer = setTimeout(() => (speaking = false), Math.max(1500, text.length * 90));
	}

	const playLabel = $derived(label ?? `${t('hear_pronunciation')}: ${text}`);
	const stopLabel = $derived(t('stop_pronunciation'));
	const ariaLabel = $derived(speaking ? stopLabel : playLabel);
</script>

{#if supported}
	<button
		type="button"
		onclick={toggle}
		aria-label={ariaLabel}
		title={ariaLabel}
		aria-pressed={speaking}
		class="grid h-8 w-8 place-items-center rounded-full text-ink-muted hover:text-accent aria-pressed:text-accent {className}"
	>
		{#if speaking}
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
