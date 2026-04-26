<script lang="ts">
	import { resolve } from '$app/paths';
	import { fade, fly } from 'svelte/transition';
	import { i18n, t } from '$lib/state/i18n.svelte';
	import { parts, slidesByPart, searchSlides } from '$lib/learn';
	import PartCard from '$lib/learn/components/PartCard.svelte';
	import SearchBar from '$lib/learn/components/SearchBar.svelte';
	import SlideListItem from '$lib/learn/components/SlideListItem.svelte';

	let query = $state('');
	const hits = $derived(searchSlides(query));

	const totalSlides = $derived(
		parts.reduce((acc, p) => acc + (slidesByPart[p.id]?.length ?? 0), 0) +
			(slidesByPart.frontmatter?.length ?? 0)
	);

	const howToSlide = $derived(slidesByPart.frontmatter?.find((s) => s.kind === 'how-to'));
</script>

<svelte:head>
	<title>Learn · accrev</title>
</svelte:head>

<section class="flex flex-col gap-5 pt-3">
	<!-- Editorial-cover header — keeps the deck's "Accounting, Reviewed" feel -->
	<header class="flex flex-col gap-1.5">
		<p class="eyebrow">{t('learn_eyebrow')}</p>
		<h1 class="font-display text-[32px] leading-[1.02] font-medium tracking-tight text-ink">
			{i18n.lang === 'fa' ? 'حسابداری،' : 'Accounting,'}
			<span class="italic text-accent">{i18n.lang === 'fa' ? 'مرور شد.' : 'Reviewed.'}</span>
		</h1>
		<p class="mt-1.5 text-[13px] leading-[1.55] text-ink-muted">{t('learn_subtitle')}</p>
	</header>

	<!-- Search -->
	<SearchBar value={query} oninput={(v) => (query = v)} />

	{#if query}
		<!-- Search results view -->
		<div in:fade={{ duration: 160 }} class="flex flex-col gap-2">
			<div class="flex items-center justify-between">
				<p class="eyebrow">{t('learn_search_results_count', hits.length)}</p>
				{#if hits.length > 0}
					<span class="font-mono text-[10px] tracking-[0.16em] text-ink-faint uppercase">
						"{query}"
					</span>
				{/if}
			</div>

			{#if hits.length === 0}
				<div
					class="flex flex-col gap-1 rounded-[var(--radius-card)] border border-hairline bg-bg-elevated p-4"
				>
					<p class="text-[13px] text-ink-muted">{t('learn_search_no_results')}</p>
				</div>
			{:else}
				<ul class="flex flex-col gap-0.5 rounded-[var(--radius-card)] border border-hairline bg-bg-elevated p-1.5">
					{#each hits as hit (hit.slide.slug)}
						<li>
							<SlideListItem slide={hit.slide} highlight={query} />
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{:else}
		<!-- Default landing view: contents -->
		<div class="flex flex-col gap-5" in:fly={{ y: 6, duration: 240 }}>
			<!-- Eight parts -->
			<div class="flex flex-col gap-2">
				<div class="flex items-baseline justify-between">
					<p class="eyebrow">{t('learn_eight_parts')}</p>
					<span class="font-mono text-[10px] tracking-[0.16em] text-ink-faint uppercase">
						{totalSlides}
						{i18n.lang === 'fa' ? 'اسلاید' : 'slides'}
					</span>
				</div>
				<div class="flex flex-col gap-2.5">
					{#each parts as part (part.id)}
						<PartCard {part} />
					{/each}
				</div>
			</div>

			<!-- "How to use" card linking to the original slide -->
			{#if howToSlide}
				<a
					href={resolve(`/learn/${howToSlide.slug}` as never)}
					class="how-to flex items-center justify-between gap-3 rounded-[var(--radius-card)] border border-hairline bg-bg-soft/50 p-4"
				>
					<div class="flex flex-col gap-1 min-w-0">
						<p class="eyebrow">{t('learn_how_to_use')}</p>
						<p class="text-[12.5px] leading-[1.55] text-ink-muted">{t('learn_how_to_body')}</p>
					</div>
					<svg
						viewBox="0 0 24 24"
						width="16"
						height="16"
						fill="none"
						stroke="currentColor"
						stroke-width="1.7"
						stroke-linecap="round"
						class="shrink-0 text-ink-faint"
						aria-hidden="true"
					>
						<path d="M9 6l6 6-6 6" />
					</svg>
				</a>
			{/if}

			<!-- Footer dedication -->
			<p class="px-2 pb-2 text-center text-[12px] italic leading-[1.6] text-ink-faint">
				{t('learn_for_you')}
			</p>
		</div>
	{/if}
</section>

<style>
	:global([dir='rtl']) .how-to svg {
		transform: scaleX(-1);
	}
</style>
