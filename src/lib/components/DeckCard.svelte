<script lang="ts">
	import { t } from '$lib/state/i18n.svelte';

	type Props = {
		title: string;
		subtitle?: string;
		count: number;
		href: string;
	};

	let { title, subtitle, count, href }: Props = $props();
</script>

<a
	{href}
	class="deck-card group flex flex-col gap-2 rounded-2xl border border-hairline bg-bg-elevated px-4 py-3 hover:border-accent/40"
>
	<span aria-hidden="true" class="deck-wash"></span>
	<div class="relative z-[1] eyebrow text-ink-muted">{subtitle ?? ''}</div>
	<div class="relative z-[1] font-display text-[18px] leading-tight font-medium text-ink">{title}</div>
	<div class="relative z-[1] mt-auto flex items-baseline justify-between pt-1.5">
		<span class="font-display text-[24px] leading-none text-accent">{count}</span>
		<span class="text-[10.5px] tracking-[0.14em] text-ink-muted uppercase">{t('cards')}</span>
	</div>
</a>

<style>
	.deck-card {
		position: relative;
		overflow: hidden;
		box-shadow: var(--card-highlight), var(--shadow-card);
		transition:
			box-shadow 260ms cubic-bezier(0.22, 1, 0.36, 1),
			transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
			border-color 200ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.deck-card:hover {
		transform: translateY(-1px);
		box-shadow:
			var(--card-highlight),
			var(--shadow-card-hover),
			0 18px 40px -24px color-mix(in oklab, var(--accent) 45%, transparent);
	}

	/* Subtle accent wash that fades in on hover. Behind content, above bg. */
	.deck-wash {
		position: absolute;
		inset: 0;
		z-index: 0;
		opacity: 0;
		pointer-events: none;
		background:
			radial-gradient(
				ellipse 80% 70% at 100% 0%,
				color-mix(in oklab, var(--accent-soft) 55%, transparent) 0%,
				transparent 65%
			),
			radial-gradient(
				ellipse 60% 70% at 0% 100%,
				color-mix(in oklab, var(--gold) 18%, transparent) 0%,
				transparent 60%
			);
		transition: opacity 320ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.deck-card:hover .deck-wash {
		opacity: 1;
	}
</style>
