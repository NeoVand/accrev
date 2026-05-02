<script lang="ts">
	import { resolve } from '$app/paths';
	import { fly } from 'svelte/transition';
	import { t } from '$lib/state/i18n.svelte';
	import SlideShell from '$lib/learn/components/SlideShell.svelte';
	import LectureBody from '$lib/learn/components/LectureBody.svelte';
	import MarkAsRead from '$lib/learn/components/MarkAsRead.svelte';
	import SlideNav from '$lib/learn/components/SlideNav.svelte';
	import '$lib/learn/learn-slide.css';

	const { data } = $props();
	const { slide, prev, next, part } = $derived(data);

	const backHref = $derived(part ? `/learn/parts/${part.id}` : '/learn');
	const backLabel = $derived(part ? t('learn_back_to_part') : t('learn_back_to_index'));

	// Cover / close keep the variant tint card. Dividers redirect to the
	// part page now, so they never reach this view.
	const framed = $derived(slide.kind === 'cover' || slide.kind === 'close');

	// Cover / close are decorative full-bleed pages without "content" to
	// read — skip the mark-as-read affordance there.
	const showMarkAsRead = $derived(slide.kind !== 'cover' && slide.kind !== 'close');
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

		{#if showMarkAsRead}
			<MarkAsRead slug={slide.slug} />
		{/if}

		<SlideNav {prev} {next} />
	</section>
{/key}

<style>
	:global([dir='rtl']) .back-link svg {
		transform: scaleX(-1);
	}
</style>
