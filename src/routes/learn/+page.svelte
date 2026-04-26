<script lang="ts">
	import { resolve } from '$app/paths';
	import { fly } from 'svelte/transition';
	import { i18n, t } from '$lib/state/i18n.svelte';
	import { parts, slidesByPart } from '$lib/learn';
	import PartCard from '$lib/learn/components/PartCard.svelte';
	import UnifiedSearch from '$lib/components/UnifiedSearch.svelte';

	// Cover slide (with the dedication) is reachable via the footer
	// dedication line — no dedicated nav block needed.
	const coverSlide = $derived(slidesByPart.frontmatter?.find((s) => s.kind === 'cover'));
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

	<!-- Same unified search as the home page: terms + slides with autocomplete -->
	<UnifiedSearch />

	<div class="flex flex-col gap-5" in:fly={{ y: 6, duration: 240 }}>
		<!-- Eight parts -->
		<div class="flex flex-col gap-2">
			<p class="eyebrow">{t('learn_eight_parts')}</p>
			<div class="flex flex-col gap-2.5">
				{#each parts as part (part.id)}
					<PartCard {part} />
				{/each}
			</div>
		</div>

		<!-- Footer dedication doubles as a discreet entry point to the cover -->
		{#if coverSlide}
			<a class="dedication-link" href={resolve(`/learn/${coverSlide.slug}` as never)}>
				{t('learn_for_you')}
			</a>
		{:else}
			<p class="dedication-text">{t('learn_for_you')}</p>
		{/if}
	</div>
</section>

<style>
	.dedication-link,
	.dedication-text {
		display: block;
		padding: 0.5rem;
		text-align: center;
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 12px;
		line-height: 1.6;
		color: var(--ink-faint);
		text-decoration: none;
		transition: color 180ms ease;
	}
	.dedication-link:hover {
		color: var(--accent);
	}
</style>
