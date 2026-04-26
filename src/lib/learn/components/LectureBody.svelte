<script lang="ts">
	import type { Slide } from '../slides.generated';

	interface Props {
		slide: Slide;
	}

	const { slide }: Props = $props();
	const variantClass = $derived(`is-${slide.variant}`);
</script>

<!-- Raw slide HTML, rendered inside `.learn-slide` so all class rules in
     learn-slide.css apply. The HTML is already pre-processed for mobile
     by scripts/build-slides.mjs. -->
<div class="learn-slide {variantClass}">
	{@html slide.body}
</div>
