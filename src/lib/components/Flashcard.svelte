<script lang="ts">
	import { fly } from 'svelte/transition';
	import Bilingual from './Bilingual.svelte';
	import HelpModal from './HelpModal.svelte';
	import PronounceButton from './PronounceButton.svelte';
	import { t } from '$lib/state/i18n.svelte';
	import type { CardDirection, Grade, Term } from '$lib/types';

	type Props = {
		term: Term;
		direction: CardDirection;
		onGrade?: (grade: Grade, hintUsed: boolean) => void;
	};

	let { term, direction, onGrade }: Props = $props();

	let revealed = $state(false);
	let hintShown = $state(false);
	let helpOpen = $state(false);

	const front = $derived(direction === 'en→fa' ? term.en.term : term.fa.term);
	const back = $derived(direction === 'en→fa' ? term.fa.term : term.en.term);
	const enDef = $derived(term.en.definition);
	const faDef = $derived(term.fa.definition);
	const expansion = $derived(term.en.expansion);
	const eyebrow = $derived([term.cpaSection, term.topic].filter(Boolean).join(' · '));

	/** A term is a pure acronym when its display equals its acronym (e.g. GAAP). TTS mangles those. */
	const isPureAcronym = $derived(!!term.en.acronym && term.en.acronym === term.en.term);
	/** Strip parentheticals for cleaner TTS pronunciation (e.g. "Right-of-Use (ROU) Asset" → "Right-of-Use Asset"). */
	const cleanTerm = $derived(term.en.term.replace(/\s*\(.+?\)/g, '').trim());
	/** Front-side TTS reads the full form (expansion) when present; otherwise the cleaned English term. Pure acronyms with no expansion have nothing safe to speak. */
	const frontPronounceText = $derived(expansion ?? (isPureAcronym ? '' : cleanTerm));
	/** Header pronunciation: full form on the front, English description on the back. */
	const headerPronounceText = $derived(revealed ? enDef : frontPronounceText);

	function reveal() {
		revealed = true;
	}
	function showHint() {
		hintShown = true;
	}
	function grade(g: Grade) {
		onGrade?.(g, hintShown);
		revealed = false;
		hintShown = false;
	}
</script>

<article
	class="relative flex min-h-[58dvh] flex-col gap-5 rounded-[var(--radius-card)] border border-hairline bg-bg-elevated p-6 shadow-[0_1px_0_var(--color-hairline),0_24px_48px_-28px_rgba(42,31,45,0.22)]"
>
	<header class="flex items-center justify-between gap-3">
		<span class="eyebrow">{eyebrow}</span>
		<div class="flex items-center gap-1">
			{#if headerPronounceText}
				<PronounceButton text={headerPronounceText} />
			{/if}
			{#if revealed}
				<button
					type="button"
					onclick={() => (helpOpen = true)}
					aria-label={t('help_title')}
					title={t('help_title')}
					in:fly={{ y: -4, duration: 200 }}
					class="grid h-8 w-8 place-items-center rounded-full text-ink-muted hover:text-accent"
				>
					<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<circle cx="12" cy="12" r="10" />
						<path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2-2.5 4" />
						<path d="M12 17.5h.01" />
					</svg>
				</button>
			{/if}
		</div>
	</header>

	{#if !revealed}
		<div class="flex flex-1 flex-col items-center justify-center gap-5 text-center">
			<Bilingual text={front} class="font-display text-[34px] leading-tight text-ink" />
			{#if expansion && direction === 'en→fa'}
				<p class="max-w-prose text-[14.5px] leading-relaxed text-ink-muted">{expansion}</p>
			{/if}
			{#if hintShown}
				<div class="flex max-w-prose items-start justify-center gap-1.5">
					<p class="text-[14.5px] leading-relaxed text-ink-muted">{enDef}</p>
					<PronounceButton text={enDef} class="-mt-1 shrink-0" />
				</div>
			{:else}
				<button
					type="button"
					onclick={showHint}
					class="text-[12px] tracking-[0.2em] text-accent uppercase underline decoration-accent/40 underline-offset-[6px] hover:decoration-accent"
				>
					{t('show_hint')}
				</button>
			{/if}
		</div>

		<button
			type="button"
			onclick={reveal}
			class="rounded-full border border-ink/15 px-6 py-3 text-[12.5px] tracking-[0.18em] text-ink uppercase hover:border-ink/40 hover:bg-bg-soft"
		>
			{t('reveal_answer')}
		</button>
	{:else}
		<div class="flex flex-1 flex-col items-center justify-center gap-4 text-center">
			<Bilingual text={back} class="font-display text-[30px] leading-tight text-accent" />
			<div class="space-y-2.5 text-ink-muted">
				<p class="max-w-prose text-[14px] leading-relaxed">{enDef}</p>
				{#if faDef}
					<Bilingual text={faDef} class="block max-w-prose text-[14px] leading-loose text-ink-muted" />
				{/if}
				{#if expansion}
					<p class="eyebrow pt-1">{expansion}</p>
				{/if}
			</div>
		</div>

		<div class="flex flex-col gap-2">
			<div class="grid grid-cols-4 gap-1.5">
				<button
					type="button"
					onclick={() => grade(1)}
					class="flex flex-col items-center gap-1.5 rounded-xl border border-danger/30 py-2.5 text-[10.5px] font-medium tracking-[0.14em] text-danger uppercase hover:bg-danger/5"
				>
					<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>
					<span>{t('forgot')}</span>
				</button>
				<button
					type="button"
					onclick={() => grade(2)}
					class="flex flex-col items-center gap-1.5 rounded-xl border border-gold/40 py-2.5 text-[10.5px] font-medium tracking-[0.14em] text-gold uppercase hover:bg-gold/5"
				>
					<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="none" aria-hidden="true"><path d="M13 2L3 14h7l-1 8 11-12h-7l1-8z" /></svg>
					<span>{t('hard')}</span>
				</button>
				<button
					type="button"
					onclick={() => grade(3)}
					class="flex flex-col items-center gap-1.5 rounded-xl border border-success/40 py-2.5 text-[10.5px] font-medium tracking-[0.14em] text-success uppercase hover:bg-success/5"
				>
					<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>
					<span>{t('got_it')}</span>
				</button>
				<button
					type="button"
					onclick={() => grade(4)}
					class="flex flex-col items-center gap-1.5 rounded-xl border border-accent/40 py-2.5 text-[10.5px] font-medium tracking-[0.14em] text-accent uppercase hover:bg-accent/5"
				>
					<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="none" aria-hidden="true"><path d="M12 2l2.6 6.4L21 9l-5 4.5L17.5 21 12 17.6 6.5 21 8 13.5 3 9l6.4-.6z" /></svg>
					<span>{t('easy')}</span>
				</button>
			</div>
		</div>
	{/if}
</article>

<HelpModal open={helpOpen} onClose={() => (helpOpen = false)} />
