<script lang="ts">
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
</script>

<!-- Raw slide HTML, rendered inside `.learn-slide` so all class rules in
     learn-slide.css apply. The HTML is already pre-processed for mobile
     by scripts/build-slides.mjs. -->
<div class="learn-slide {variantClass}">
	{@html slide.body}
</div>
