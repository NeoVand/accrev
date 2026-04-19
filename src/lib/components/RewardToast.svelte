<script lang="ts">
	import { fly } from 'svelte/transition';
	import { i18n } from '$lib/state/i18n.svelte';
	import { rewards } from '$lib/state/reward.svelte';

	const current = $derived(rewards.current);

	$effect(() => {
		if (!current) return;
		const id = setTimeout(() => rewards.dismiss(), 5000);
		return () => clearTimeout(id);
	});

	function localized(msg: { en: string; fa: string }): string {
		return i18n.lang === 'fa' ? msg.fa : msg.en;
	}
</script>

{#if current}
	<div
		class="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+72px)] z-40 flex justify-center px-4"
	>
		<button
			type="button"
			onclick={() => rewards.dismiss()}
			transition:fly={{ y: 32, duration: 320 }}
			aria-label="Dismiss"
			class="pointer-events-auto flex max-w-[420px] items-center gap-3 rounded-full border border-accent/40 bg-bg-elevated px-5 py-3 shadow-[0_18px_40px_-20px_rgba(42,31,45,0.4)] hover:border-accent"
		>
			{#if current.emoji}
				<span class="text-[18px] leading-none">{current.emoji}</span>
			{/if}
			<span class="font-display text-[14.5px] leading-tight text-ink">
				{localized(current.message)}
			</span>
		</button>
	</div>
{/if}
