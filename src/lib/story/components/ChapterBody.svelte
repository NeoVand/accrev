<script lang="ts">
	import { mount, unmount } from 'svelte';
	import { wireWordLookup } from '$lib/learn/wire-word-lookup';
	import WordLookupPopover from '$lib/learn/components/WordLookupPopover.svelte';
	import type { LookupHit } from '$lib/data/lookup';
	import { widgetLoaders } from '../widgets';
	import type { StoryChapter } from '../chapters.generated';

	interface Props {
		chapter: StoryChapter;
	}
	const { chapter }: Props = $props();

	let activePopover = $state<{ hit: LookupHit; anchor: DOMRect } | null>(null);
	const openPopover = (hit: LookupHit, anchor: DOMRect) => (activePopover = { hit, anchor });
	const closePopover = () => (activePopover = null);

	/** Mount any registered interactive widgets sitting in `[data-widget]` slots. */
	function hydrateWidgets(node: HTMLElement) {
		const instances: ReturnType<typeof mount>[] = [];
		const slots = node.querySelectorAll<HTMLElement>('.story-widget[data-widget]');
		for (const el of slots) {
			const id = el.dataset.widget;
			const loader = id ? widgetLoaders[id] : undefined;
			if (!loader) continue;
			loader().then((mod) => {
				instances.push(mount(mod.default, { target: el }));
			});
		}
		return () => {
			for (const inst of instances) unmount(inst);
		};
	}
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted build-time HTML from story/chapters/*.md -->
<div class="story-prose" use:wireWordLookup={{ onTap: openPopover }} {@attach hydrateWidgets}>
	{@html chapter.body}
</div>

{#if activePopover}
	<WordLookupPopover hit={activePopover.hit} anchor={activePopover.anchor} onclose={closePopover} />
{/if}
