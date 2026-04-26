<script lang="ts">
	import { i18n, t } from '$lib/state/i18n.svelte';
	import type { Slide, Part } from '../slides.generated';

	interface Props {
		slide: Slide;
		part?: Part;
		children: () => unknown;
	}

	const { slide, part, children }: Props = $props();

	// Lecture / glossary / contents / how-to slides are read on the page
	// itself (no frame). The cover, section dividers, and close slide have
	// purposeful full-bleed art — keep them inside a tinted card.
	const isFullBleed = $derived(
		slide.kind === 'cover' || slide.kind === 'divider' || slide.kind === 'close'
	);
	const variantClass = $derived(`is-${slide.variant}`);
</script>

{#if isFullBleed}
	<article class="learn-slide-frame {variantClass}">
		<header class="learn-slide-head">
			<div class="learn-slide-meta">
				<span class="learn-slide-num">§ {slide.num.toString().padStart(2, '0')}</span>
				{#if part}
					<span class="learn-slide-sep">·</span>
					<span class="learn-slide-section">{part.title}</span>
				{/if}
			</div>

			{#if slide.eyebrowEn || slide.eyebrowFa}
				<p class="learn-eyebrow">
					{#if i18n.lang === 'fa'}
						{slide.eyebrowFa || slide.eyebrowEn}
					{:else}
						{slide.eyebrowEn || slide.eyebrowFa}
					{/if}
				</p>
			{/if}

			<h1 class="learn-slide-title" dir="ltr">{slide.title}</h1>
		</header>

		<div class="learn-slide-body">{@render children()}</div>
	</article>
{:else}
	<article class="learn-slide-flat">
		<header class="flat-head">
			<div class="flat-meta">
				<span class="flat-num">§ {slide.num.toString().padStart(2, '0')}</span>
				{#if part}
					<span class="flat-sep">·</span>
					<span class="flat-section">{part.title}</span>
				{/if}
			</div>

			{#if slide.eyebrowEn || slide.eyebrowFa}
				<p class="flat-eyebrow">
					{#if i18n.lang === 'fa'}
						{slide.eyebrowFa || slide.eyebrowEn}
					{:else}
						{slide.eyebrowEn || slide.eyebrowFa}
					{/if}
					{#if slide.eyebrowEn && slide.eyebrowFa}
						<span class="flat-eyebrow-alt">
							· {i18n.lang === 'fa' ? slide.eyebrowEn : slide.eyebrowFa}
						</span>
					{/if}
				</p>
			{/if}

			<h1 class="flat-title" dir="ltr">{slide.title}</h1>
		</header>

		<div class="flat-body">{@render children()}</div>

		<p class="flat-foot" aria-hidden="true">{t('learn_slide_of', slide.num, 60)}</p>
	</article>
{/if}

<style>
	/* ─── Flat (no frame) — for the bulk of lecture/glossary/etc. ─── */
	.learn-slide-flat {
		display: flex;
		flex-direction: column;
		gap: 10px;
		min-width: 0;
	}

	.flat-meta {
		display: flex;
		align-items: center;
		gap: 6px;
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-muted);
	}
	.flat-num {
		font-weight: 600;
		color: var(--gold);
	}
	.flat-sep {
		opacity: 0.5;
	}

	.flat-eyebrow {
		font-size: 0.6875rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--gold);
		font-weight: 600;
		margin: 4px 0 0 0;
	}
	.flat-eyebrow-alt {
		opacity: 0.55;
	}

	.flat-title {
		font-family: var(--font-serif);
		font-weight: 500;
		font-size: clamp(24px, 7.2vw, 30px);
		line-height: 1.05;
		letter-spacing: -0.02em;
		color: var(--ink);
		margin: 2px 0 4px 0;
	}
	:global([dir='rtl']) .flat-title {
		font-family: var(--font-persian);
		letter-spacing: 0;
		font-weight: 500;
	}

	.flat-body {
		display: flex;
		flex-direction: column;
		gap: 6px;
		min-width: 0;
	}

	.flat-foot {
		margin: 6px 0 0 0;
		text-align: right;
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-faint);
	}

	/* ─── Full-bleed card — cover / dividers / close ───────────────── */
	.learn-slide-frame {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 22px 18px 24px 18px;
		border-radius: var(--radius-card);
		border: 1px solid var(--hairline);
		background: var(--bg-elevated);
		overflow: hidden;
	}
	.learn-slide-frame.is-navy {
		background: linear-gradient(160deg, #2d4a6b 0%, #1f2f4a 60%, #182238 100%);
		border-color: rgba(245, 242, 236, 0.12);
		color: #f5f2ec;
	}
	.learn-slide-frame.is-tan {
		background: linear-gradient(160deg, #c19c70 0%, #a98660 100%);
		border-color: rgba(251, 246, 238, 0.2);
		color: #fbf6ee;
	}
	.learn-slide-frame.is-sage {
		background: linear-gradient(160deg, #5d6f54 0%, #4a5a44 100%);
		border-color: rgba(245, 242, 236, 0.16);
		color: #f5f2ec;
	}
	.learn-slide-frame.is-ink {
		background: linear-gradient(160deg, #2a2228 0%, #18121a 100%);
		border-color: rgba(241, 230, 217, 0.14);
		color: var(--bg);
	}

	.learn-slide-head {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.learn-slide-meta {
		display: flex;
		align-items: center;
		gap: 6px;
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 10.5px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-muted);
	}
	.is-navy .learn-slide-meta,
	.is-tan .learn-slide-meta,
	.is-sage .learn-slide-meta,
	.is-ink .learn-slide-meta {
		color: rgba(245, 242, 236, 0.7);
	}
	.learn-slide-num {
		font-weight: 600;
	}

	.learn-eyebrow {
		font-size: 0.6875rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--gold);
		font-weight: 600;
		margin: 4px 0 0 0;
	}
	.is-navy .learn-eyebrow,
	.is-ink .learn-eyebrow {
		color: #d2b07e;
	}
	.is-tan .learn-eyebrow {
		color: #1f2f4a;
	}
	.is-sage .learn-eyebrow {
		color: #e0c189;
	}

	.learn-slide-title {
		font-family: var(--font-serif);
		font-weight: 500;
		font-size: clamp(26px, 8vw, 36px);
		line-height: 1.05;
		letter-spacing: -0.02em;
		color: var(--ink);
		margin: 2px 0 0 0;
	}
	.is-navy .learn-slide-title,
	.is-tan .learn-slide-title,
	.is-sage .learn-slide-title,
	.is-ink .learn-slide-title {
		color: #faf4e8;
	}
	:global([dir='rtl']) .learn-slide-title {
		font-family: var(--font-persian);
		letter-spacing: 0;
		font-weight: 500;
	}

	.learn-slide-body {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
	}
</style>
