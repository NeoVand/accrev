<script lang="ts">
	import { resolve } from '$app/paths';
	import { fly } from 'svelte/transition';
	import { i18n, t } from '$lib/state/i18n.svelte';
	import SlideListItem from '$lib/learn/components/SlideListItem.svelte';

	const { data } = $props();
	const { term, related } = $derived(data);

	const isFa = $derived(i18n.lang === 'fa');
</script>

<svelte:head>
	<title>{term.en.term} · accrev</title>
</svelte:head>

<section class="flex flex-col gap-4 pt-2 pb-3" in:fly={{ y: 6, duration: 220 }}>
	<a
		href={resolve('/')}
		class="back-link inline-flex items-center gap-1.5 self-start text-[11.5px] tracking-[0.14em] text-ink-muted uppercase hover:text-accent"
	>
		<svg
			viewBox="0 0 24 24"
			width="13"
			height="13"
			fill="none"
			stroke="currentColor"
			stroke-width="1.8"
			stroke-linecap="round"
			aria-hidden="true"
		>
			<path d="M15 6l-6 6 6 6" />
		</svg>
		{i18n.lang === 'fa' ? 'بازگشت' : 'back'}
	</a>

	<header class="flex flex-col gap-1">
		<p class="eyebrow">{i18n.lang === 'fa' ? 'واژه' : 'word'}</p>
		<div class="flex items-baseline flex-wrap gap-x-3 gap-y-1" dir="ltr">
			<h1
				class="font-display text-[34px] leading-[1.04] font-medium tracking-tight text-ink"
				dir="ltr"
			>
				{term.en.term}
			</h1>
			{#if term.en.acronym}
				<span class="font-mono text-[12px] tracking-[0.08em] text-ink-faint" dir="ltr">
					{term.en.acronym}
				</span>
			{/if}
		</div>
		{#if term.fa.term}
			<p class="font-persian text-[18px] leading-[1.4] text-gold" dir="rtl">
				{term.fa.term}
			</p>
		{/if}
		{#if term.en.expansion}
			<p class="mt-1 text-[12.5px] italic text-ink-muted" dir="ltr">{term.en.expansion}</p>
		{/if}
	</header>

	<!-- Definition -->
	<div class="flex flex-col gap-3">
		<div class="flex flex-col gap-1.5">
			<p class="eyebrow">{isFa ? 'تعریف' : 'definition'}</p>
			<p class="text-[14.5px] leading-[1.6] text-ink" dir="ltr">{term.en.definition}</p>
			{#if term.fa.definition}
				<p class="font-persian text-[14px] leading-[1.85] text-ink-muted" dir="rtl">
					{term.fa.definition}
				</p>
			{/if}
		</div>

		{#if term.en.example}
			<div class="example-card">
				<span class="example-label">{isFa ? 'مثال' : 'example'}</span>
				<p dir="ltr">{term.en.example}</p>
			</div>
		{/if}
	</div>

	<!-- Action: study this card -->
	<div class="flex gap-2">
		<a
			href={`${resolve('/study')}?run=1${term.cpaSection ? `&cpa=${term.cpaSection}` : ''}`}
			class="flex-1 rounded-full bg-ink py-2.5 text-center text-[11.5px] tracking-[0.18em] text-bg uppercase hover:bg-accent"
		>
			{isFa ? 'مطالعه' : 'study this set'}
		</a>
	</div>

	<!-- See in context -->
	{#if related && related.length > 0}
		<div class="flex flex-col gap-2 mt-1">
			<p class="eyebrow">{isFa ? 'در ادامهٔ مطلب' : 'see in context'}</p>
			<ul
				class="flex flex-col gap-0.5 rounded-[var(--radius-card)] border border-hairline bg-bg-elevated p-1.5"
			>
				{#each related as slide (slide.slug)}
					<li>
						<SlideListItem {slide} />
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</section>

<style>
	:global([dir='rtl']) .back-link svg {
		transform: scaleX(-1);
	}

	.font-persian {
		font-family: var(--font-persian);
	}

	.example-card {
		padding: 10px 0 10px 12px;
		border-left: 3px solid var(--accent);
		background: transparent;
		font-size: 13px;
		line-height: 1.6;
		color: var(--ink-muted);
	}
	.example-label {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 9.5px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
		font-weight: 600;
		display: block;
		margin-bottom: 3px;
	}
	.example-card p {
		margin: 0;
	}
</style>
