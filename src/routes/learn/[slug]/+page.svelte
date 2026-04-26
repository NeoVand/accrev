<script lang="ts">
	import { resolve } from '$app/paths';
	import { fly } from 'svelte/transition';
	import { i18n, t } from '$lib/state/i18n.svelte';
	import SlideShell from '$lib/learn/components/SlideShell.svelte';
	import LectureBody from '$lib/learn/components/LectureBody.svelte';
	import SlideListItem from '$lib/learn/components/SlideListItem.svelte';
	import '$lib/learn/learn-slide.css';

	const { data } = $props();
	const { slide, prev, next, part, partSlides } = $derived(data);

	const backHref = $derived(part ? `/learn/parts/${part.id}` : '/learn');
	const backLabel = $derived(part ? t('learn_back_to_part') : t('learn_back_to_index'));

	// Full-bleed cover / dividers / close keep the variant tint card.
	const framed = $derived(
		slide.kind === 'cover' || slide.kind === 'divider' || slide.kind === 'close'
	);
</script>

<svelte:head>
	<title>{slide.title} · Learn · accrev</title>
</svelte:head>

{#key slide.slug}
	<section class="flex flex-col gap-3 pt-1" in:fly={{ y: 6, duration: 220 }}>
		<a
			href={resolve(backHref as never)}
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
			{backLabel}
		</a>

		<SlideShell {slide} {part}>
			<LectureBody {slide} {framed} />
		</SlideShell>

		{#if slide.kind === 'divider' && partSlides && partSlides.length > 0}
			<div class="part-toc">
				<p class="eyebrow">{t('learn_part_intro')}</p>
				<ul class="part-toc-list">
					{#each partSlides as s (s.slug)}
						<li>
							<SlideListItem slide={s} />
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Prev / Next -->
		<nav class="slide-nav" aria-label="Slide navigation">
			{#if prev}
				<a href={resolve(`/learn/${prev.slug}` as never)} class="slide-nav-link slide-nav-prev">
					<svg
						viewBox="0 0 24 24"
						width="14"
						height="14"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						aria-hidden="true"
					>
						<path d="M15 6l-6 6 6 6" />
					</svg>
					<span class="slide-nav-meta">
						<span class="dir">{t('learn_prev')}</span>
						<span class="title-line" dir="ltr">
							<span class="num">§{prev.num.toString().padStart(2, '0')}</span>
							<span class="ttl">{prev.title}</span>
						</span>
					</span>
				</a>
			{:else}
				<span class="slide-nav-spacer"></span>
			{/if}

			{#if next}
				<a href={resolve(`/learn/${next.slug}` as never)} class="slide-nav-link slide-nav-next">
					<span class="slide-nav-meta align-end">
						<span class="dir">{t('learn_next')}</span>
						<span class="title-line" dir="ltr">
							<span class="num">§{next.num.toString().padStart(2, '0')}</span>
							<span class="ttl">{next.title}</span>
						</span>
					</span>
					<svg
						viewBox="0 0 24 24"
						width="14"
						height="14"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						aria-hidden="true"
					>
						<path d="M9 6l6 6-6 6" />
					</svg>
				</a>
			{:else}
				<span class="slide-nav-spacer"></span>
			{/if}
		</nav>
	</section>
{/key}

<style>
	.part-toc {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-top: 4px;
	}
	.part-toc-list {
		display: flex;
		flex-direction: column;
		gap: 1px;
		padding: 4px;
		border-radius: var(--radius-card);
		border: 1px solid var(--hairline);
		background: var(--bg-elevated);
		list-style: none;
		margin: 0;
	}

	:global([dir='rtl']) .back-link svg,
	:global([dir='rtl']) .slide-nav-prev svg,
	:global([dir='rtl']) .slide-nav-next svg {
		transform: scaleX(-1);
	}

	.slide-nav {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
		margin-top: 4px;
	}

	.slide-nav-spacer {
		display: block;
	}

	.slide-nav-link {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 12px;
		border: 1px solid var(--hairline);
		border-radius: 14px;
		background: var(--bg-elevated);
		text-decoration: none;
		color: var(--ink);
		min-width: 0;
	}
	.slide-nav-link:hover {
		border-color: color-mix(in oklab, var(--gold) 60%, var(--hairline));
		background: color-mix(in oklab, var(--gold) 5%, var(--bg-elevated));
	}

	.slide-nav-prev {
		justify-content: flex-start;
	}
	.slide-nav-next {
		justify-content: flex-end;
	}
	.slide-nav-next .slide-nav-meta {
		text-align: right;
		align-items: flex-end;
	}

	.slide-nav-meta {
		display: flex;
		flex-direction: column;
		gap: 1px;
		min-width: 0;
		flex: 1;
	}
	.slide-nav-meta.align-end {
		align-items: flex-end;
	}

	.slide-nav-meta .dir {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 9.5px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-muted);
	}

	.slide-nav-meta .title-line {
		display: flex;
		align-items: baseline;
		gap: 6px;
		min-width: 0;
		max-width: 100%;
	}

	.slide-nav-meta .num {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 10.5px;
		letter-spacing: 0.1em;
		color: var(--gold);
		font-weight: 600;
		flex: none;
	}

	.slide-nav-meta .ttl {
		font-family: var(--font-serif);
		font-weight: 500;
		font-size: 12.5px;
		line-height: 1.2;
		color: var(--ink);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
	}
	:global([lang='fa']) .slide-nav-meta .ttl {
		font-family: var(--font-persian);
		font-weight: 600;
	}
</style>
