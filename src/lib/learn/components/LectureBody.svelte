<script lang="ts">
	import { t } from '$lib/state/i18n.svelte';
	import PronounceButton from '$lib/components/PronounceButton.svelte';
	import { injectSpeakers } from '../inject-speakers';
	import type { Slide } from '../slides.generated';

	interface Props {
		slide: Slide;
		/** Pass `true` when the body sits inside a `.learn-slide-frame` (cover,
		    divider, close). The variant tint is then applied so cream text reads
		    on the dark background. For flat lecture slides we DO NOT add the
		    variant class — text inherits page-appropriate `--ink`. */
		framed?: boolean;
	}

	const { slide, framed = false }: Props = $props();
	const variantClass = $derived(framed ? `is-${slide.variant}` : '');

	// Cover/divider/close are decorative — no spoken content there.
	const isReadable = $derived(
		slide.kind !== 'cover' && slide.kind !== 'divider' && slide.kind !== 'close'
	);

	const hearLabel = $derived(t('hear_pronunciation'));
</script>

{#if isReadable}
	<div class="slide-listen">
		<PronounceButton text={slide.plain} label={hearLabel} class="slide-listen-btn" />
		<span class="slide-listen-label">{hearLabel}</span>
	</div>
{/if}

<div
	class="learn-slide {variantClass}"
	use:injectSpeakers={{ label: hearLabel }}
>
	{@html slide.body}
</div>

<style>
	.slide-listen {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		align-self: flex-start;
		padding: 4px 10px 4px 4px;
		border-radius: 999px;
		border: 1px solid var(--hairline);
		background: var(--bg-elevated);
		color: var(--ink-muted);
		margin-bottom: 4px;
	}
	.slide-listen-label {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 9.5px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-muted);
	}
	:global(.slide-listen .slide-listen-btn) {
		width: 26px !important;
		height: 26px !important;
	}
	:global([dir='rtl']) .slide-listen {
		direction: ltr;
	}
</style>
