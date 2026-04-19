<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { db } from '$lib/db';
	import { t } from '$lib/state/i18n.svelte';
	import type { CardDirection, CpaSection } from '$lib/types';

	type DeckId = CpaSection | 'all';
	type SizeOpt = 10 | 20 | 50 | 'all';
	type DirectionOpt = CardDirection | 'mixed';

	let deck = $state<DeckId>('all');
	let size = $state<SizeOpt>(20);
	let direction = $state<DirectionOpt>('en→fa');

	const SECTIONS: CpaSection[] = ['Foundational', 'FAR', 'AUD', 'REG', 'BAR', 'ISC', 'TCP'];

	let counts = $state<Record<string, number>>({});
	let loaded = $state(false);

	function sectionLabelKey(s: CpaSection): string {
		return `cpa_${s.toLowerCase()}`;
	}

	onMount(async () => {
		const d = db();
		counts.all = await d.terms.count();
		for (const s of SECTIONS) {
			counts[s] = await d.terms.where('cpaSection').equals(s).count();
		}
		loaded = true;
	});

	const selectedCount = $derived(deck === 'all' ? counts.all ?? 0 : counts[deck] ?? 0);
	const effectiveSize = $derived(
		size === 'all' ? selectedCount : Math.min(size, selectedCount)
	);
	const canStart = $derived(selectedCount > 0);

	const startQuery = $derived.by(() => {
		const params = new URLSearchParams({ run: '1', dir: direction });
		if (deck !== 'all') params.set('cpa', deck);
		if (size !== 'all') params.set('size', String(size));
		return params.toString();
	});
</script>

<section class="flex flex-col gap-5 pt-3">
	<div class="flex flex-col gap-0.5">
		<p class="eyebrow">{t('picker_eyebrow')}</p>
		<h1 class="font-display text-[26px] leading-tight font-medium text-ink">
			{t('picker_title')}
		</h1>
	</div>

	<!-- Deck -->
	<div class="flex flex-col gap-2">
		<p class="eyebrow">{t('picker_deck_label')}</p>
		<div class="flex flex-wrap gap-1.5">
			<button
				type="button"
				onclick={() => (deck = 'all')}
				aria-pressed={deck === 'all'}
				class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] tracking-[0.1em] uppercase aria-pressed:border-accent aria-pressed:bg-accent-soft/40 aria-pressed:text-accent"
				class:border-hairline={deck !== 'all'}
				class:text-ink-muted={deck !== 'all'}
			>
				<bdi>{t('deck_all')}</bdi>
				<bdi class="tabular-nums opacity-60">{counts.all ?? ''}</bdi>
			</button>
			{#each SECTIONS as section (section)}
				<button
					type="button"
					onclick={() => (deck = section)}
					aria-pressed={deck === section}
					disabled={(counts[section] ?? 0) === 0}
					class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] tracking-[0.1em] uppercase aria-pressed:border-accent aria-pressed:bg-accent-soft/40 aria-pressed:text-accent disabled:opacity-40"
					class:border-hairline={deck !== section}
					class:text-ink-muted={deck !== section}
				>
					<bdi>{t(sectionLabelKey(section))}</bdi>
					<bdi class="tabular-nums opacity-60">{counts[section] ?? ''}</bdi>
				</button>
			{/each}
		</div>
	</div>

	<!-- Size -->
	<div class="flex flex-col gap-2">
		<p class="eyebrow">{t('picker_size_label')}</p>
		<div class="grid grid-cols-4 gap-1.5">
			{#each [10, 20, 50, 'all'] as const as opt (opt)}
				<button
					type="button"
					onclick={() => (size = opt as SizeOpt)}
					aria-pressed={size === opt}
					class="rounded-xl border py-2.5 text-[12px] tracking-[0.14em] uppercase aria-pressed:border-accent aria-pressed:bg-accent-soft/40 aria-pressed:text-accent"
					class:border-hairline={size !== opt}
					class:text-ink-muted={size !== opt}
				>
					{opt === 'all' ? t('picker_size_all') : opt}
				</button>
			{/each}
		</div>
	</div>

	<!-- Direction -->
	<div class="flex flex-col gap-2">
		<p class="eyebrow">{t('picker_direction_label')}</p>
		<div class="grid grid-cols-3 gap-1.5">
			{#each [{ k: 'en→fa', label: 'EN → FA' }, { k: 'fa→en', label: 'FA → EN' }, { k: 'mixed', label: t('mixed') }] as opt (opt.k)}
				<button
					type="button"
					onclick={() => (direction = opt.k as DirectionOpt)}
					aria-pressed={direction === opt.k}
					class="rounded-xl border py-2.5 text-[12px] tracking-[0.14em] uppercase aria-pressed:border-accent aria-pressed:bg-accent-soft/40 aria-pressed:text-accent"
					class:border-hairline={direction !== opt.k}
					class:text-ink-muted={direction !== opt.k}
				>
					{opt.label}
				</button>
			{/each}
		</div>
	</div>

	<a
		href={`${resolve('/study')}?${startQuery}`}
		aria-disabled={!loaded || !canStart}
		class="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-[12.5px] tracking-[0.18em] text-bg uppercase hover:bg-accent aria-disabled:pointer-events-none aria-disabled:opacity-50"
	>
		<bdi>{t('picker_start')}</bdi>
		<bdi class="tabular-nums opacity-70">{effectiveSize}</bdi>
	</a>
</section>
