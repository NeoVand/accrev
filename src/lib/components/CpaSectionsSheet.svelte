<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { resolve } from '$app/paths';
	import { t } from '$lib/state/i18n.svelte';
	import type { CpaSection } from '$lib/types';

	type DeckMeta = { key: CpaSection; titleKey: string; subKey: string };

	type Props = {
		open: boolean;
		onClose: () => void;
		decks: DeckMeta[];
		stats: Record<string, { total: number; mastered: number }>;
	};

	let { open, onClose, decks, stats }: Props = $props();

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) onClose();
	}
</script>

<svelte:window onkeydown={onKey} />

{#if open}
	<div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
		<button
			type="button"
			aria-label="Close"
			onclick={onClose}
			transition:fade={{ duration: 180 }}
			class="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
		></button>

		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="cpa-sheet-title"
			transition:fly={{ y: 24, duration: 240 }}
			class="relative flex max-h-[85dvh] w-full max-w-[440px] flex-col overflow-hidden rounded-t-[var(--radius-card)] border border-hairline border-b-0 bg-bg-elevated pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-12px_40px_-16px_rgba(42,31,45,0.35)] sm:rounded-[var(--radius-card)] sm:border-b sm:pb-3"
		>
			<header class="flex items-start justify-between gap-3 px-5 pt-5 pb-2">
				<div class="flex flex-col gap-0.5">
					<p class="eyebrow">accrev</p>
					<h2
						id="cpa-sheet-title"
						class="font-display text-[20px] leading-tight font-medium text-ink"
					>
						{t('cpa_sections_label')}
					</h2>
				</div>
				<button
					type="button"
					onclick={onClose}
					aria-label="Close"
					class="grid h-8 w-8 flex-none place-items-center rounded-full text-ink-muted hover:bg-bg-soft hover:text-ink"
				>
					<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M6 6l12 12M18 6L6 18" />
					</svg>
				</button>
			</header>

			<ul class="flex flex-col overflow-y-auto px-1 pb-1">
				{#each decks as deck, i (deck.key)}
					{@const s = stats[deck.key] ?? { total: 0, mastered: 0 }}
					<li>
						<a
							href={`${resolve('/study')}?run=1&cpa=${deck.key}`}
							onclick={onClose}
							class="flex items-center justify-between gap-3 rounded-xl px-4 py-3 hover:bg-bg-soft/60"
							class:mt-px={i > 0}
						>
							<div class="flex flex-col gap-0.5">
								<p class="font-display text-[16px] leading-tight font-medium text-ink">
									{t(deck.titleKey)}
								</p>
								<p class="text-[11.5px] text-ink-muted">{t(deck.subKey)}</p>
							</div>
							<div class="flex items-baseline gap-2.5 text-ink-muted">
								<span class="font-display text-[18px] leading-none tabular-nums text-ink">
									{s.total}
								</span>
								<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<path d="M9 6l6 6-6 6" />
								</svg>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}
