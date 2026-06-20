<script lang="ts">
	import { fly } from 'svelte/transition';
	import PronounceButton from './PronounceButton.svelte';
	import WordLookupPopover from '$lib/learn/components/WordLookupPopover.svelte';
	import { wireWordLookup } from '$lib/learn/wire-word-lookup';
	import type { LookupHit } from '$lib/data/lookup';
	import { i18n, t } from '$lib/state/i18n.svelte';
	import { INTERVIEW_LEVELS } from '$lib/interview/meta';
	import type { InterviewQuestion } from '$lib/interview/types';
	import type { Grade } from '$lib/types';

	type Props = {
		question: InterviewQuestion;
		onGrade?: (grade: Grade) => void;
	};

	let { question, onGrade }: Props = $props();

	let revealed = $state(false);
	let showFaQuestion = $state(false);
	let showFaAnswer = $state(false);
	let activePopover = $state<{ hit: LookupHit; anchor: DOMRect } | null>(null);

	function openPopover(hit: LookupHit, anchor: DOMRect) {
		activePopover = { hit, anchor };
	}
	function closePopover() {
		activePopover = null;
	}

	const isFa = $derived(i18n.lang === 'fa');
	const levelName = $derived(
		INTERVIEW_LEVELS.find((l) => l.level === question.level)?.name[isFa ? 'fa' : 'en'] ?? ''
	);
	const topicLabel = $derived(question.topic.replace(/-/g, ' '));
	const pointsSpeech = $derived(question.en.talkingPoints.join('. '));

	function grade(g: Grade) {
		onGrade?.(g);
	}
</script>

<article
	class="iv-card relative flex flex-col gap-4 overflow-hidden rounded-[var(--radius-card)] border border-hairline bg-bg-elevated p-5 sm:p-6"
>
	<!-- Question -->
	<header class="flex items-start justify-between gap-3">
		<span class="eyebrow">{levelName} · {topicLabel}</span>
		<PronounceButton text={question.en.question} class="-mt-1.5 -mr-1.5" />
	</header>

	<h2
		dir="ltr"
		class="iv-prose font-display text-[21px] leading-snug text-ink"
		use:wireWordLookup={{ onTap: openPopover }}
	>
		{question.en.question}
	</h2>

	<div class="-mt-1">
		<button type="button" class="iv-fa-toggle" onclick={() => (showFaQuestion = !showFaQuestion)}>
			<svg
				viewBox="0 0 24 24"
				width="12"
				height="12"
				fill="none"
				stroke="currentColor"
				stroke-width="1.6"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="9" />
				<path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
			</svg>
			<span>{showFaQuestion ? t('iv_hide_persian') : t('iv_show_persian')}</span>
		</button>
	</div>

	{#if showFaQuestion}
		<p lang="fa" dir="rtl" class="iv-fa" in:fly={{ y: -4, duration: 200 }}>
			{question.fa.question}
		</p>
	{/if}

	{#if !revealed}
		<button
			type="button"
			onclick={() => (revealed = true)}
			class="mt-1 rounded-full border border-ink/15 px-6 py-3 text-[12.5px] tracking-[0.18em] text-ink uppercase hover:border-ink/40 hover:bg-bg-soft"
		>
			{t('iv_reveal_answer')}
		</button>
	{:else}
		<div
			class="flex flex-col gap-4 border-t border-hairline/70 pt-4"
			in:fly={{ y: 6, duration: 240 }}
		>
			<!-- Model answer -->
			<section class="flex flex-col gap-1.5">
				<div class="iv-block-head">
					<span class="eyebrow text-accent">{t('iv_model_answer')}</span>
					<PronounceButton text={question.en.answer} />
				</div>
				<p
					dir="ltr"
					class="iv-prose text-[14px] leading-relaxed text-ink"
					use:wireWordLookup={{ onTap: openPopover }}
				>
					{question.en.answer}
				</p>
			</section>

			<!-- Talking points -->
			{#if question.en.talkingPoints.length}
				<section class="flex flex-col gap-1.5">
					<div class="iv-block-head">
						<span class="eyebrow">{t('iv_talking_points')}</span>
						<PronounceButton text={pointsSpeech} />
					</div>
					<ul
						dir="ltr"
						class="iv-prose iv-points flex flex-col gap-1.5 text-[13.5px] leading-relaxed text-ink-muted"
						use:wireWordLookup={{ onTap: openPopover }}
					>
						{#each question.en.talkingPoints as point (point)}
							<li>{point}</li>
						{/each}
					</ul>
				</section>
			{/if}

			<!-- What the interviewer looks for -->
			<section
				class="iv-looks flex flex-col gap-1.5 rounded-2xl border border-hairline/70 bg-bg-soft/40 p-3.5"
			>
				<div class="iv-block-head">
					<span class="eyebrow">{t('iv_looks_for')}</span>
					<PronounceButton text={question.en.interviewerLooksFor} />
				</div>
				<p
					dir="ltr"
					class="iv-prose text-[13px] leading-relaxed text-ink-muted"
					use:wireWordLookup={{ onTap: openPopover }}
				>
					{question.en.interviewerLooksFor}
				</p>
			</section>

			<!-- Persian translation of the solution -->
			<div>
				<button type="button" class="iv-fa-toggle" onclick={() => (showFaAnswer = !showFaAnswer)}>
					<svg
						viewBox="0 0 24 24"
						width="12"
						height="12"
						fill="none"
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<circle cx="12" cy="12" r="9" />
						<path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
					</svg>
					<span>{showFaAnswer ? t('iv_hide_persian') : t('iv_show_persian')}</span>
				</button>
			</div>

			{#if showFaAnswer}
				<div
					lang="fa"
					dir="rtl"
					class="iv-fa flex flex-col gap-3"
					in:fly={{ y: -4, duration: 200 }}
				>
					<p>{question.fa.answer}</p>
					{#if question.fa.talkingPoints.length}
						<div class="flex flex-col gap-1.5">
							<span class="eyebrow">{t('iv_talking_points')}</span>
							<ul class="iv-points flex flex-col gap-1.5 text-[13.5px] leading-relaxed">
								{#each question.fa.talkingPoints as point (point)}
									<li>{point}</li>
								{/each}
							</ul>
						</div>
					{/if}
					<div class="flex flex-col gap-1">
						<span class="eyebrow">{t('iv_looks_for')}</span>
						<p class="text-[13px] leading-relaxed opacity-90">{question.fa.interviewerLooksFor}</p>
					</div>
				</div>
			{/if}

			<!-- Self-rating -->
			<div class="flex flex-col gap-2 border-t border-hairline/70 pt-4">
				<p class="eyebrow text-center">{t('iv_rate_prompt')}</p>
				<div class="grid grid-cols-4 gap-1.5">
					<button
						type="button"
						onclick={() => grade(1)}
						class="flex flex-col items-center gap-1.5 rounded-xl border border-danger/30 py-2.5 text-[10.5px] font-medium tracking-[0.14em] text-danger uppercase hover:bg-danger/5"
					>
						<svg
							viewBox="0 0 24 24"
							width="16"
							height="16"
							fill="none"
							stroke="currentColor"
							stroke-width="1.7"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg
						>
						<span>{t('forgot')}</span>
					</button>
					<button
						type="button"
						onclick={() => grade(2)}
						class="flex flex-col items-center gap-1.5 rounded-xl border border-gold/40 py-2.5 text-[10.5px] font-medium tracking-[0.14em] text-gold uppercase hover:bg-gold/5"
					>
						<svg
							viewBox="0 0 24 24"
							width="16"
							height="16"
							fill="currentColor"
							stroke="none"
							aria-hidden="true"><path d="M13 2L3 14h7l-1 8 11-12h-7l1-8z" /></svg
						>
						<span>{t('hard')}</span>
					</button>
					<button
						type="button"
						onclick={() => grade(3)}
						class="flex flex-col items-center gap-1.5 rounded-xl border border-success/40 py-2.5 text-[10.5px] font-medium tracking-[0.14em] text-success uppercase hover:bg-success/5"
					>
						<svg
							viewBox="0 0 24 24"
							width="16"
							height="16"
							fill="none"
							stroke="currentColor"
							stroke-width="1.9"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg
						>
						<span>{t('got_it')}</span>
					</button>
					<button
						type="button"
						onclick={() => grade(4)}
						class="flex flex-col items-center gap-1.5 rounded-xl border border-accent/40 py-2.5 text-[10.5px] font-medium tracking-[0.14em] text-accent uppercase hover:bg-accent/5"
					>
						<svg
							viewBox="0 0 24 24"
							width="16"
							height="16"
							fill="currentColor"
							stroke="none"
							aria-hidden="true"
							><path d="M12 2l2.6 6.4L21 9l-5 4.5L17.5 21 12 17.6 6.5 21 8 13.5 3 9l6.4-.6z" /></svg
						>
						<span>{t('easy')}</span>
					</button>
				</div>
				<p class="pt-0.5 text-center text-[10.5px] tracking-[0.12em] text-ink-faint uppercase">
					{t('iv_sources_label')}: {question.sources.join(' · ')}
				</p>
			</div>
		</div>
	{/if}
</article>

{#if activePopover}
	<WordLookupPopover hit={activePopover.hit} anchor={activePopover.anchor} onclose={closePopover} />
{/if}

<style>
	.iv-card {
		box-shadow: var(--card-highlight), var(--shadow-card);
	}
	/* Whisper of warmth from the top — same treatment as the flashcard. */
	.iv-card::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 0;
		background: radial-gradient(
			ellipse 70% 30% at 50% 0%,
			color-mix(in oklab, var(--accent-soft) 30%, transparent) 0%,
			transparent 70%
		);
	}
	.iv-card > :global(*) {
		position: relative;
		z-index: 1;
	}

	.iv-block-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}

	.iv-points {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.iv-points > :global(li) {
		position: relative;
		padding-inline-start: 16px;
	}
	.iv-points > :global(li)::before {
		content: '';
		position: absolute;
		inset-inline-start: 3px;
		top: 0.62em;
		width: 5px;
		height: 5px;
		border-radius: 9999px;
		background: color-mix(in oklab, var(--accent) 70%, transparent);
	}

	/* Persian reveal blocks */
	.iv-fa {
		font-family: var(--font-persian);
		font-size: 13.5px;
		line-height: 1.95;
		color: var(--ink-muted);
		border-inline-start: 2px solid color-mix(in oklab, var(--accent) 40%, transparent);
		padding-inline-start: 12px;
	}

	/* Persian-to-English language toggle pill */
	.iv-fa-toggle {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 10px;
		border-radius: 999px;
		border: 1px solid var(--hairline);
		background: var(--bg-elevated);
		color: var(--ink-muted);
		font-size: 10.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	.iv-fa-toggle:hover {
		border-color: color-mix(in oklab, var(--accent) 45%, transparent);
		color: var(--accent);
	}

	/* Glossary word underline — scoped to interview prose so we don't depend on
	   the learn-slide stylesheet being loaded on this route. */
	:global(.iv-prose .word-lookup) {
		display: inline;
		padding: 0;
		margin: 0;
		border: 0;
		background: transparent;
		color: inherit;
		font: inherit;
		letter-spacing: inherit;
		cursor: pointer;
		text-decoration: underline;
		text-decoration-style: dotted;
		text-decoration-color: color-mix(in oklab, var(--accent) 45%, transparent);
		text-decoration-thickness: 1px;
		text-underline-offset: 2px;
	}
	:global(.iv-prose .word-lookup:hover) {
		color: var(--accent);
		text-decoration-color: var(--accent);
		text-decoration-style: solid;
	}
	:global(.iv-prose .word-lookup:focus-visible) {
		outline: 2px solid color-mix(in oklab, var(--accent) 60%, transparent);
		outline-offset: 2px;
		border-radius: 3px;
	}
</style>
