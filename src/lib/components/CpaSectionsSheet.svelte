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
		stats: Record<string, { total: number; studied: number }>;
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
			class="cpa-sheet relative flex max-h-[85dvh] w-full max-w-[440px] flex-col overflow-hidden rounded-t-[var(--radius-card)] border border-hairline border-b-0 bg-bg-elevated pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:rounded-[var(--radius-card)] sm:border-b sm:pb-3"
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
					{@const s = stats[deck.key] ?? { total: 0, studied: 0 }}
					<li>
						<a
							href={`${resolve('/study')}?run=1&cpa=${deck.key}`}
							onclick={onClose}
							class="deck-row flex items-center justify-between gap-3 rounded-xl px-4 py-3"
							class:mt-px={i > 0}
						>
							<div class="flex flex-col gap-0.5">
								<p class="font-display text-[16px] leading-tight font-medium text-ink">
									{t(deck.titleKey)}
								</p>
								<p class="text-[11.5px] text-ink-muted">{t(deck.subKey)}</p>
							</div>
							<div class="flex items-baseline gap-2.5 text-ink-muted">
								<span class="font-mono text-[11px] tracking-wider tabular-nums">
									{s.studied}/{s.total}
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

<style>
	/* Layered shadow that reads as 'lifted from the page' rather than a flat drop. */
	.cpa-sheet {
		box-shadow:
			var(--card-highlight),
			0 -2px 6px rgba(42, 31, 45, 0.06),
			0 -12px 40px -16px rgba(42, 31, 45, 0.35),
			0 -28px 70px -28px rgba(42, 31, 45, 0.45);
	}

	/* Deck rows: hover paints a soft accent wash from the right (where the chevron
	   lives) — a tiny invitation to tap. */
	.deck-row {
		position: relative;
		isolation: isolate;
	}
	.deck-row::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		opacity: 0;
		z-index: -1;
		background: linear-gradient(
			90deg,
			transparent 0%,
			color-mix(in oklab, var(--accent-soft) 35%, transparent) 100%
		);
		transition: opacity 220ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.deck-row:hover::before {
		opacity: 1;
	}
</style>
