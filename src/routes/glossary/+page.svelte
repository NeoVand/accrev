<script lang="ts">
	import { resolve } from '$app/paths';
	import { fly } from 'svelte/transition';
	import { i18n, t } from '$lib/state/i18n.svelte';
	import { memorized } from '$lib/state/memorized.svelte';
	import WordCard from '$lib/components/WordCard.svelte';
	import type { LookupEntry } from '$lib/data/lookup';

	const { data } = $props();
	const entries = $derived<LookupEntry[]>(data.entries);
	const total = $derived(entries.length);

	let query = $state('');
	let openKey = $state<string | null>(null);

	function normalize(s: string) {
		return (s || '').toLowerCase().normalize('NFKD');
	}

	const filtered = $derived.by(() => {
		const q = normalize(query.trim());
		if (!q) return entries;
		return entries.filter((e) => {
			return (
				normalize(e.enTerm).includes(q) ||
				normalize(e.faTerm).includes(q) ||
				normalize(e.enAcronym ?? '').includes(q)
			);
		});
	});

	const toMemorize = $derived(filtered.filter((e) => !memorized.has(e.key)));
	const memorizedList = $derived(filtered.filter((e) => memorized.has(e.key)));
	const memorizedCount = $derived(
		entries.reduce((n, e) => n + (memorized.has(e.key) ? 1 : 0), 0)
	);

	function toggleOpen(key: string) {
		openKey = openKey === key ? null : key;
	}

	const isFa = $derived(i18n.lang === 'fa');
</script>

<svelte:head>
	<title>{t('glossary_title')} · accrev</title>
</svelte:head>

<section class="flex flex-col gap-4 pt-2 pb-3" in:fly={{ y: 6, duration: 220 }}>
	<a
		href={resolve('/')}
		class="back-link inline-flex items-center gap-1.5 self-start text-[11.5px] tracking-[0.14em] text-ink-muted uppercase hover:text-accent"
	>
		<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
			<path d="M15 6l-6 6 6 6" />
		</svg>
		{t('glossary_back')}
	</a>

	<header class="flex flex-col gap-1">
		<p class="eyebrow">{t('glossary')}</p>
		<h1 class="font-display text-[28px] leading-[1.05] font-medium tracking-tight text-ink">
			{t('glossary_title')}<span class="text-gold">.</span>
		</h1>
		<p class="text-[12.5px] leading-[1.55] text-ink-muted">
			{t('glossary_count', memorizedCount, total)}
		</p>
	</header>

	<label class="g-search">
		<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true" class="g-search-icon">
			<circle cx="11" cy="11" r="6" />
			<path d="M20 20l-4-4" />
		</svg>
		<input
			type="search"
			bind:value={query}
			placeholder={t('glossary_search_placeholder')}
			autocomplete="off"
			spellcheck="false"
			aria-label={t('glossary_search_placeholder')}
		/>
		{#if query}
			<button
				type="button"
				onclick={() => (query = '')}
				class="g-search-clear"
				aria-label="clear"
			>
				<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
					<path d="M6 6l12 12M18 6L6 18" />
				</svg>
			</button>
		{/if}
	</label>

	<!-- To memorize -->
	<section class="g-section">
		<div class="g-section-head">
			<span class="g-section-eyebrow">{t('glossary_to_memorize')}</span>
			<span class="g-section-count">{toMemorize.length}</span>
		</div>

		{#if toMemorize.length === 0}
			<p class="g-empty">
				{query
					? t('glossary_no_results')
					: t('glossary_empty_to_memorize')}
			</p>
		{:else}
			<ul class="g-list">
				{#each toMemorize as entry (entry.key)}
					{@const open = openKey === entry.key}
					<li class="g-row" class:is-open={open}>
						<button
							type="button"
							class="g-row-head"
							aria-expanded={open}
							onclick={() => toggleOpen(entry.key)}
						>
							<span class="g-row-en" dir="ltr">{entry.enTerm}</span>
							{#if entry.enAcronym && entry.enAcronym !== entry.enTerm}
								<span class="g-row-acro" dir="ltr">{entry.enAcronym}</span>
							{/if}
							<span class="g-row-caret" aria-hidden="true">
								<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
									<path d="M6 9l6 6 6-6" />
								</svg>
							</span>
						</button>
						{#if open}
							<div class="g-row-body" in:fly={{ y: -2, duration: 160 }}>
								<WordCard {entry} hideEnTitle />
							</div>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<!-- Memorized -->
	<section class="g-section">
		<div class="g-section-head">
			<span class="g-section-eyebrow">{t('glossary_memorized')}</span>
			<span class="g-section-count">{memorizedList.length}</span>
		</div>

		{#if memorizedList.length === 0}
			<p class="g-empty">
				{query
					? t('glossary_no_results')
					: t('glossary_empty_memorized')}
			</p>
		{:else}
			<ul class="g-list">
				{#each memorizedList as entry (entry.key)}
					{@const open = openKey === entry.key}
					<li class="g-row is-mem" class:is-open={open}>
						<button
							type="button"
							class="g-row-head"
							aria-expanded={open}
							onclick={() => toggleOpen(entry.key)}
						>
							<span class="g-row-mem-mark" aria-hidden="true">
								<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
									<path d="M5 12.5l4 4 10-10" />
								</svg>
							</span>
							<span class="g-row-en" dir="ltr">{entry.enTerm}</span>
							{#if entry.enAcronym && entry.enAcronym !== entry.enTerm}
								<span class="g-row-acro" dir="ltr">{entry.enAcronym}</span>
							{/if}
							<span class="g-row-caret" aria-hidden="true">
								<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
									<path d="M6 9l6 6 6-6" />
								</svg>
							</span>
						</button>
						{#if open}
							<div class="g-row-body" in:fly={{ y: -2, duration: 160 }}>
								<WordCard {entry} hideEnTitle />
							</div>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</section>
</section>

<style>
	:global([dir='rtl']) .back-link svg {
		transform: scaleX(-1);
	}

	.g-search {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 10px 12px;
		border: 1px solid var(--hairline);
		border-radius: 14px;
		background: var(--bg-elevated);
		color: var(--ink-muted);
	}
	.g-search-icon {
		flex: none;
	}
	.g-search input {
		flex: 1;
		min-width: 0;
		border: 0;
		outline: 0;
		background: transparent;
		font: inherit;
		font-size: 16px;
		color: var(--ink);
	}
	.g-search input::placeholder {
		color: var(--ink-faint);
	}
	.g-search input::-webkit-search-cancel-button {
		display: none;
	}
	.g-search-clear {
		display: grid;
		place-items: center;
		width: 22px;
		height: 22px;
		border-radius: 999px;
		background: var(--bg-soft);
		border: 0;
		cursor: pointer;
		color: var(--ink-muted);
	}

	.g-section {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.g-section-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		padding: 4px 4px 2px 4px;
	}
	.g-section-eyebrow {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-muted);
		font-weight: 600;
	}
	.g-section-count {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 10px;
		color: var(--ink-faint);
	}

	.g-empty {
		padding: 12px 14px;
		font-size: 12.5px;
		color: var(--ink-muted);
		border: 1px dashed var(--hairline);
		border-radius: 12px;
		text-align: center;
	}
	:global([lang='fa']) .g-empty {
		font-family: var(--font-persian);
		font-size: 13.5px;
	}

	.g-list {
		display: flex;
		flex-direction: column;
		gap: 4px;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.g-row {
		border: 1px solid var(--hairline);
		border-radius: 12px;
		background: var(--bg-elevated);
		overflow: hidden;
		transition: border-color 180ms ease, background-color 180ms ease;
	}
	.g-row:hover {
		border-color: color-mix(in oklab, var(--accent) 40%, var(--hairline));
	}
	.g-row.is-open {
		border-color: color-mix(in oklab, var(--accent) 55%, var(--hairline));
		background: color-mix(in oklab, var(--accent) 4%, var(--bg-elevated));
	}
	.g-row.is-mem {
		background: color-mix(in oklab, var(--accent) 5%, var(--bg-elevated));
	}
	.g-row.is-mem.is-open {
		background: color-mix(in oklab, var(--accent) 10%, var(--bg-elevated));
	}

	.g-row-head {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		padding: 10px 12px;
		border: 0;
		background: transparent;
		color: inherit;
		text-align: left;
		cursor: pointer;
		font: inherit;
		min-width: 0;
	}

	.g-row-mem-mark {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		border-radius: 999px;
		background: color-mix(in oklab, var(--accent) 90%, transparent);
		color: var(--bg);
		flex: none;
	}

	.g-row-en {
		font-family: var(--font-serif);
		font-weight: 500;
		font-size: 15px;
		line-height: 1.25;
		color: var(--ink);
		flex: 1;
		min-width: 0;
		/* Long terms wrap onto a second line instead of being clipped — the
		   glossary's whole point is making the word legible. */
		overflow-wrap: anywhere;
	}
	.g-row-acro {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.08em;
		color: var(--ink-faint);
		text-transform: uppercase;
		flex: none;
	}
	.g-row-caret {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 22px;
		height: 22px;
		border-radius: 999px;
		color: var(--ink-faint);
		flex: none;
		transition: transform 180ms ease, color 180ms ease;
		margin-inline-start: 4px;
	}
	.g-row.is-open .g-row-caret {
		transform: rotate(-180deg);
		color: var(--accent);
	}

	.g-row-body {
		padding: 4px 12px 14px 12px;
		border-top: 1px solid color-mix(in oklab, var(--hairline) 70%, transparent);
		background: transparent;
	}
</style>
