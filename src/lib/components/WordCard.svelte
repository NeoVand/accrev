<script lang="ts">
	import { resolve } from '$app/paths';
	import { i18n, t } from '$lib/state/i18n.svelte';
	import PronounceButton from './PronounceButton.svelte';
	import { memorized } from '$lib/state/memorized.svelte';
	import type { LookupEntry } from '$lib/data/lookup';

	type Props = {
		entry: LookupEntry;
		/** When provided, displayed as a small "root form: …" hint above the
		    definition (used by the popover when a stemmed word matched). */
		lemmaNote?: string | null;
		/** Show the link out to the full /word/[slug] page (glossary entries only). */
		showOpenLink?: boolean;
		/** Show the "I memorized this / forget" toggle. */
		showMemorize?: boolean;
		/** Hide the English title row (the parent — e.g. the glossary row —
		    already shows it; we don't want to repeat it inside the expanded
		    body). The pronounce button moves into the body instead. */
		hideEnTitle?: boolean;
		/** Optional close button rendered in the header (popover only). */
		onclose?: () => void;
	};

	const {
		entry,
		lemmaNote = null,
		showOpenLink = true,
		showMemorize = true,
		hideEnTitle = false,
		onclose
	}: Props = $props();

	const isMemorized = $derived(memorized.has(entry.key));
	const isFa = $derived(i18n.lang === 'fa');

	function toggle() {
		memorized.toggle(entry.key);
	}
</script>

<div class="wc-root" dir="ltr">
	{#if !hideEnTitle}
		<div class="wc-head">
			<div class="wc-term">
				<span class="wc-en" dir="ltr">{entry.enTerm}</span>
				{#if entry.enAcronym && entry.enAcronym !== entry.enTerm}
					<span class="wc-acro" dir="ltr">{entry.enAcronym}</span>
				{/if}
			</div>
			<div class="wc-actions">
				<PronounceButton text={entry.enTerm} class="wc-speaker" />
				{#if onclose}
					<button
						type="button"
						class="wc-close"
						onclick={onclose}
						aria-label={t('close')}
						title={t('close')}
					>
						<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
							<path d="M6 6l12 12M6 18L18 6" />
						</svg>
					</button>
				{/if}
			</div>
		</div>
	{:else}
		<!-- Pronounce button still visible when the parent owns the title.
		     Slides into the body, aligned to the trailing edge so it doesn't
		     compete with the row header above. -->
		<div class="wc-inline-speaker">
			<PronounceButton text={entry.enTerm} class="wc-speaker" />
			<span class="wc-inline-speaker-label">{t('hear_pronunciation')}</span>
		</div>
	{/if}

	{#if lemmaNote}
		<p class="wc-lemma" dir="ltr">{t('lookup_root_form', lemmaNote)}</p>
	{/if}

	{#if entry.enExpansion}
		<p class="wc-expansion" dir="ltr">{entry.enExpansion}</p>
	{/if}

	<p class="wc-en-def" dir="ltr">{entry.enDefinition}</p>

	{#if entry.faTerm || entry.faDefinition}
		<div class="wc-fa">
			{#if entry.faTerm}
				<p class="wc-fa-term" dir="rtl">{entry.faTerm}</p>
			{/if}
			{#if entry.faDefinition}
				<p class="wc-fa-def" dir="rtl">{entry.faDefinition}</p>
			{/if}
		</div>
	{/if}

	{#if entry.enExample}
		<div class="wc-example">
			<span class="wc-example-label">{t('glossary_example')}</span>
			<p dir="ltr">{entry.enExample}</p>
		</div>
	{/if}

	<div class="wc-foot">
		{#if showMemorize}
			<button
				type="button"
				class="wc-mem-btn"
				class:is-on={isMemorized}
				onclick={toggle}
				aria-pressed={isMemorized}
			>
				<span class="wc-mem-check" aria-hidden="true">
					{#if isMemorized}
						<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
							<path d="M5 12.5l4 4 10-10" />
						</svg>
					{:else}
						<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
							<circle cx="12" cy="12" r="8" />
						</svg>
					{/if}
				</span>
				<span class="wc-mem-label">
					{isMemorized ? t('glossary_forget_btn') : t('glossary_memorize_btn')}
				</span>
			</button>
		{/if}

		{#if showOpenLink && entry.source === 'glossary' && entry.slug}
			<a
				class="wc-link"
				href={resolve(`/word/${entry.slug}` as never)}
				dir={isFa ? 'rtl' : 'ltr'}
			>
				{t('lookup_open_card')}
				<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
					<path d="M9 6l6 6-6 6" />
				</svg>
			</a>
		{/if}
	</div>
</div>

<style>
	.wc-root {
		font-family: var(--font-sans);
		color: var(--ink);
		min-width: 0;
	}

	.wc-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 10px;
		margin-bottom: 4px;
	}
	.wc-term {
		display: flex;
		align-items: baseline;
		gap: 8px;
		flex-wrap: wrap;
		min-width: 0;
	}
	.wc-en {
		font-family: var(--font-serif);
		font-weight: 500;
		font-size: 17px;
		line-height: 1.18;
		letter-spacing: -0.01em;
		color: var(--ink);
	}
	.wc-acro {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 10.5px;
		letter-spacing: 0.1em;
		color: var(--ink-faint);
		text-transform: uppercase;
	}

	.wc-actions {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		flex: none;
	}
	:global(.wc-speaker) {
		width: 26px !important;
		height: 26px !important;
	}

	.wc-inline-speaker {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 10px 4px 4px;
		border-radius: 999px;
		border: 1px solid var(--hairline);
		background: var(--bg-elevated);
		color: var(--ink-muted);
		margin: 0 0 8px 0;
	}
	.wc-inline-speaker-label {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 9.5px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-muted);
	}
	.wc-close {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 26px;
		border-radius: 999px;
		border: 0;
		background: transparent;
		color: var(--ink-muted);
		cursor: pointer;
	}
	.wc-close:hover {
		background: color-mix(in oklab, var(--ink) 6%, transparent);
		color: var(--ink);
	}

	.wc-lemma {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 9.5px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-faint);
		margin: 0 0 6px 0;
	}

	.wc-expansion {
		font-style: italic;
		color: var(--ink-muted);
		font-size: 12.5px;
		margin: 0 0 6px 0;
	}

	.wc-en-def {
		font-size: 13px;
		line-height: 1.55;
		color: var(--ink);
		margin: 0 0 8px 0;
	}

	.wc-fa {
		padding-top: 8px;
		border-top: 1px solid color-mix(in oklab, var(--hairline) 70%, transparent);
		margin-bottom: 6px;
	}
	.wc-fa-term {
		font-family: var(--font-persian);
		font-size: 14px;
		color: var(--gold);
		margin: 0 0 3px 0;
		direction: rtl;
		text-align: right;
	}
	.wc-fa-def {
		font-family: var(--font-persian);
		font-size: 13px;
		line-height: 1.85;
		color: var(--ink);
		margin: 0;
		direction: rtl;
		text-align: right;
	}

	.wc-example {
		margin-top: 10px;
		padding: 8px 0 8px 12px;
		border-left: 3px solid var(--accent);
		font-size: 12.5px;
		line-height: 1.55;
		color: var(--ink-muted);
	}
	.wc-example-label {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 9.5px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
		font-weight: 600;
		display: block;
		margin-bottom: 3px;
	}
	.wc-example p {
		margin: 0;
	}

	.wc-foot {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 14px;
		margin-top: 8px;
	}

	.wc-mem-btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 6px 12px 6px 8px;
		border-radius: 999px;
		border: 1px solid var(--hairline);
		background: var(--bg-elevated);
		color: var(--ink-muted);
		font-size: 11.5px;
		letter-spacing: 0.02em;
		line-height: 1;
		cursor: pointer;
		font-family: inherit;
		transition:
			background-color 180ms ease,
			border-color 180ms ease,
			color 180ms ease,
			transform 120ms ease;
	}
	.wc-mem-btn:hover {
		border-color: color-mix(in oklab, var(--gold) 60%, var(--hairline));
		background: color-mix(in oklab, var(--gold) 6%, var(--bg-elevated));
		color: var(--ink);
	}
	.wc-mem-btn:active {
		transform: scale(0.98);
	}
	.wc-mem-btn.is-on {
		border-color: color-mix(in oklab, var(--accent) 55%, var(--hairline));
		background: color-mix(in oklab, var(--accent) 12%, var(--bg-elevated));
		color: var(--accent);
	}
	.wc-mem-check {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		border-radius: 999px;
		color: currentColor;
	}
	.wc-mem-btn.is-on .wc-mem-check {
		background: color-mix(in oklab, var(--accent) 90%, transparent);
		color: var(--bg);
	}
	.wc-mem-label {
		font-family: var(--font-sans);
		font-weight: 500;
	}
	:global([lang='fa']) .wc-mem-label {
		font-family: var(--font-persian);
		font-weight: 600;
	}

	.wc-link {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		margin-left: auto;
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--accent);
		text-decoration: none;
	}
	.wc-link:hover {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.wc-link[dir='rtl'] {
		font-family: var(--font-persian);
		text-transform: none;
		letter-spacing: 0;
		font-size: 12px;
		margin-left: 0;
		margin-right: auto;
	}
	.wc-link[dir='rtl'] svg {
		transform: scaleX(-1);
	}
</style>
