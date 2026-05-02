<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import WordCard from '$lib/components/WordCard.svelte';
	import type { LookupHit } from '$lib/data/lookup';

	type Props = {
		hit: LookupHit;
		anchor: DOMRect;
		onclose: () => void;
	};

	const { hit, anchor, onclose }: Props = $props();
	const entry = $derived(hit.entry);
	const lemmaNote = $derived(
		hit.matchedAs !== hit.original.toLowerCase() ? hit.matchedAs : null
	);

	let popoverEl: HTMLDivElement | undefined = $state();
	let style = $state('opacity: 0; pointer-events: none;');

	// Walk up the DOM from the anchor button to find the nearest scrollable
	// ancestor. The app shell scrolls `<main>` (not the window), so we close
	// the popover when that element scrolls — the popover is viewport-fixed
	// and would otherwise float free of the word.
	function findScrollParent(start: Element | null): Element | null {
		let el = start;
		while (el && el !== document.body) {
			const style = getComputedStyle(el);
			if (/(auto|scroll|overlay)/.test(style.overflowY + style.overflow)) return el;
			el = el.parentElement;
		}
		return null;
	}

	function position() {
		if (!popoverEl) return;
		const padding = 12;
		const arrowH = 8;
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const rect = popoverEl.getBoundingClientRect();
		const w = rect.width;
		const h = rect.height;

		// Anchor is in viewport coords (from getBoundingClientRect at click
		// time). The popover uses position:fixed so we write viewport coords
		// straight in — no scroll offset needed.
		let top = anchor.bottom + arrowH;
		if (top + h + padding > vh && anchor.top > h + arrowH + padding) {
			top = anchor.top - h - arrowH;
		}

		const anchorCx = anchor.left + anchor.width / 2;
		let left = anchorCx - w / 2;
		left = Math.max(padding, Math.min(left, vw - w - padding));

		style = `top: ${top}px; left: ${left}px;`;
	}

	onMount(async () => {
		await tick();
		// Two-pass position: first to put the popover in the document so its
		// bounding rect is real, then again on the next frame in case the
		// initial render produced a stale measurement.
		position();
		const raf = requestAnimationFrame(() => position());

		const onResize = () => position();
		window.addEventListener('resize', onResize);

		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onclose();
		};
		window.addEventListener('keydown', onKey);

		// Close on scroll of the actual scroll container (the app shell scrolls
		// `<main>`, not the window). Without this, scrolling would leave the
		// popover stranded at viewport coords while the word travels away.
		// The anchor is a DOMRect, so we look up the originating button via
		// the document — fall back to listening on `<main>` if we can't find it.
		const scrollParent =
			findScrollParent(document.querySelector('main')) ?? document.querySelector('main');
		const onScroll = () => onclose();
		scrollParent?.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('scroll', onScroll, { passive: true });

		// Click-outside dismissal — but only on a real pointer event that
		// originates outside the popover.
		const onPointer = (e: PointerEvent) => {
			if (popoverEl && !popoverEl.contains(e.target as Node)) onclose();
		};
		const handle = setTimeout(() => {
			window.addEventListener('pointerdown', onPointer);
		}, 0);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', onResize);
			window.removeEventListener('keydown', onKey);
			window.removeEventListener('pointerdown', onPointer);
			scrollParent?.removeEventListener('scroll', onScroll);
			window.removeEventListener('scroll', onScroll);
			clearTimeout(handle);
		};
	});
</script>

<div
	bind:this={popoverEl}
	class="word-popover"
	style={style}
	role="dialog"
	aria-label={entry.enTerm}
	dir="ltr"
	in:fly={{ y: 4, duration: 140 }}
>
	<WordCard {entry} {lemmaNote} {onclose} />
</div>

<style>
	.word-popover {
		position: fixed;
		z-index: 60;
		max-width: min(360px, calc(100vw - 24px));
		min-width: 240px;
		padding: 12px 14px 10px 14px;
		border-radius: 14px;
		border: 1px solid var(--hairline);
		background: var(--bg-elevated);
		color: var(--ink);
		box-shadow:
			0 1px 1px color-mix(in oklab, var(--ink) 6%, transparent),
			0 8px 24px color-mix(in oklab, var(--ink) 14%, transparent);
		font-family: var(--font-sans);
	}
</style>
