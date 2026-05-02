<script lang="ts">
	import { resolve } from '$app/paths';
	import { fly, fade } from 'svelte/transition';
	import { i18n, t } from '$lib/state/i18n.svelte';
	import { searchEverything, type AnyHit } from '$lib/search';
	import { memorized } from '$lib/state/memorized.svelte';

	interface Props {
		/** Optional: hide the dropdown chrome and let the parent show results inline. */
		standalone?: boolean;
	}
	const { standalone = true }: Props = $props();

	let query = $state('');
	let focused = $state(false);
	let active = $state(0); // index in flat result list for keyboard nav

	const results = $derived(searchEverything(query, { maxPerKind: 6 }));
	const flatResults = $derived<AnyHit[]>([...results.terms, ...results.slides]);

	const open = $derived(focused && query.trim().length > 0);

	let inputEl: HTMLInputElement | null = $state(null);

	function escapeRe(s: string) {
		return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}
	function highlight(text: string, q: string) {
		if (!q.trim()) return text;
		try {
			const re = new RegExp(`(${escapeRe(q.trim())})`, 'i');
			return text.replace(re, '<mark>$1</mark>');
		} catch {
			return text;
		}
	}

	function hitHref(hit: AnyHit): string {
		if (hit.kind === 'slide') return resolve(`/learn/${hit.slide.slug}` as never);
		// Glossary terms have a slug → /word/[slug]; lexicon entries don't,
		// so we route them to the glossary page (which lists every entry).
		const e = hit.entry;
		if (e.source === 'glossary' && e.slug) return resolve(`/word/${e.slug}` as never);
		return resolve('/glossary');
	}


	function onKey(e: KeyboardEvent) {
		if (!open) return;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			active = Math.min(active + 1, flatResults.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			active = Math.max(active - 1, 0);
		} else if (e.key === 'Enter') {
			const hit = flatResults[active];
			if (hit) {
				e.preventDefault();
				location.href = hitHref(hit);
			}
		} else if (e.key === 'Escape') {
			query = '';
			inputEl?.blur();
		}
	}

	$effect(() => {
		// Reset active index when query changes
		query;
		active = 0;
	});
</script>

<div class="us-shell" class:us-open={open}>
	<label class="us-bar" class:us-bar-focused={focused || query.length > 0}>
		<svg
			viewBox="0 0 24 24"
			width="16"
			height="16"
			fill="none"
			stroke="currentColor"
			stroke-width="1.7"
			stroke-linecap="round"
			aria-hidden="true"
			class="us-search-icon"
		>
			<circle cx="11" cy="11" r="6" />
			<path d="M20 20l-4-4" />
		</svg>
		<input
			bind:this={inputEl}
			type="search"
			bind:value={query}
			onfocus={() => (focused = true)}
			onblur={() => setTimeout(() => (focused = false), 150)}
			onkeydown={onKey}
			placeholder={i18n.lang === 'fa'
				? 'جست‌وجوی واژه، ایده، یا قاعده…'
				: 'Search a word, idea, or rule…'}
			autocomplete="off"
			spellcheck="false"
			aria-label="Search terms and slides"
			aria-expanded={open}
			aria-controls="us-results"
		/>
		{#if query}
			<button
				type="button"
				onmousedown={(e) => e.preventDefault()}
				onclick={() => {
					query = '';
					inputEl?.focus();
				}}
				aria-label="Clear"
				class="us-clear"
			>
				<svg
					viewBox="0 0 24 24"
					width="13"
					height="13"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
					aria-hidden="true"
				>
					<path d="M6 6l12 12M18 6L6 18" />
				</svg>
			</button>
		{/if}
		<kbd class="us-kbd" aria-hidden="true">⌘K</kbd>
	</label>

	{#if open && standalone}
		<div
			id="us-results"
			class="us-pop"
			role="listbox"
			in:fly={{ y: -4, duration: 160 }}
			out:fade={{ duration: 100 }}
		>
			{#if flatResults.length === 0}
				<div class="us-empty">
					<span class="us-empty-icon">·</span>
					<span class="us-empty-text">
						{i18n.lang === 'fa' ? 'چیزی پیدا نشد.' : 'Nothing matches yet.'}
					</span>
				</div>
			{:else}
				{#if results.terms.length > 0}
					<div class="us-section">
						<div class="us-section-head">
							<span class="us-cat us-cat-term">
								<svg
									viewBox="0 0 24 24"
									width="11"
									height="11"
									fill="none"
									stroke="currentColor"
									stroke-width="1.8"
									aria-hidden="true"
								>
									<path d="M3 5a2 2 0 0 1 2-2h14v18H5a2 2 0 0 1-2-2z" />
									<path d="M7 7h10M7 11h10M7 15h6" />
								</svg>
								{i18n.lang === 'fa' ? 'واژه‌ها' : 'Terms'}
							</span>
							<span class="us-count">{results.terms.length}</span>
						</div>
						{#each results.terms as hit, i (hit.entry.key)}
							{@const idx = i}
							{@const e = hit.entry}
							{@const isMem = memorized.has(e.key)}
							<a
								href={hitHref(hit)}
								class="us-row us-row-term"
								class:active={active === idx}
								class:is-mem={isMem}
								onmouseenter={() => (active = idx)}
								role="option"
								aria-selected={active === idx}
							>
								<span class="us-row-main">
									<span class="us-row-title" dir="ltr">{@html highlight(e.enTerm, query)}</span>
									{#if e.enAcronym}
										<span class="us-row-acro" dir="ltr">{e.enAcronym}</span>
									{/if}
									{#if e.faTerm}
										<span class="us-row-fa" dir="rtl">{e.faTerm}</span>
									{/if}
									{#if isMem}
										<span
											class="us-row-mem-mark"
											aria-label={t('glossary_memorized')}
											title={t('glossary_memorized')}
										>
											<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
												<path d="M5 12.5l4 4 10-10" />
											</svg>
										</span>
									{/if}
								</span>
								<span class="us-row-sub" dir="ltr">{e.enDefinition}</span>
							</a>
						{/each}
					</div>
				{/if}

				{#if results.slides.length > 0}
					<div class="us-section">
						<div class="us-section-head">
							<span class="us-cat us-cat-slide">
								<svg
									viewBox="0 0 24 24"
									width="11"
									height="11"
									fill="none"
									stroke="currentColor"
									stroke-width="1.8"
									aria-hidden="true"
								>
									<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 1 4 17.5z" />
									<path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 0 1.5-1.5z" />
								</svg>
								{i18n.lang === 'fa' ? 'اسلایدها' : 'Slides'}
							</span>
							<span class="us-count">{results.slides.length}</span>
						</div>
						{#each results.slides as hit, i (hit.slide.slug)}
							{@const idx = results.terms.length + i}
							<a
								href={hitHref(hit)}
								class="us-row us-row-slide"
								class:active={active === idx}
								onmouseenter={() => (active = idx)}
								role="option"
								aria-selected={active === idx}
							>
								<span class="us-row-main" dir="ltr">
									<span class="us-row-title">{@html highlight(hit.slide.title, query)}</span>
								</span>
								{#if hit.slide.eyebrowEn || hit.slide.eyebrowFa}
									<span
										class="us-row-sub"
										dir={i18n.lang === 'fa' && hit.slide.eyebrowFa ? 'rtl' : 'ltr'}
									>
										{i18n.lang === 'fa'
											? hit.slide.eyebrowFa || hit.slide.eyebrowEn
											: hit.slide.eyebrowEn || hit.slide.eyebrowFa}
									</span>
								{/if}
							</a>
						{/each}
					</div>
				{/if}

				<div class="us-footer">
					<span class="us-foot-key">↑↓</span>
					<span class="us-foot-label">{i18n.lang === 'fa' ? 'گردش' : 'navigate'}</span>
					<span class="us-foot-key">↵</span>
					<span class="us-foot-label">{i18n.lang === 'fa' ? 'باز کن' : 'open'}</span>
					<span class="us-foot-key">esc</span>
					<span class="us-foot-label">{i18n.lang === 'fa' ? 'بستن' : 'close'}</span>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.us-shell {
		position: relative;
	}

	.us-bar {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 11px 12px;
		border: 1px solid var(--hairline);
		border-radius: 14px;
		background: var(--bg-elevated);
		color: var(--ink-muted);
		transition: border-color 200ms, box-shadow 200ms, background-color 200ms;
	}
	.us-bar-focused {
		border-color: color-mix(in oklab, var(--accent) 60%, var(--hairline));
		box-shadow:
			0 0 0 3px color-mix(in oklab, var(--accent) 12%, transparent),
			0 8px 30px -10px color-mix(in oklab, var(--accent) 18%, transparent);
		color: var(--ink);
	}
	.us-search-icon {
		flex: none;
	}
	.us-bar input {
		flex: 1;
		min-width: 0;
		border: 0;
		outline: 0;
		background: transparent;
		font: inherit;
		/* 16px+ prevents iOS Safari from auto-zooming on focus. */
		font-size: 16px;
		color: var(--ink);
	}
	.us-bar input::placeholder {
		color: var(--ink-faint);
	}
	.us-bar input::-webkit-search-cancel-button {
		display: none;
	}
	.us-clear {
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
	.us-clear:hover {
		color: var(--ink);
	}
	.us-kbd {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 9.5px;
		letter-spacing: 0.06em;
		padding: 2px 6px;
		border-radius: 5px;
		border: 1px solid var(--hairline);
		color: var(--ink-faint);
		background: var(--bg-soft);
	}

	.us-pop {
		position: absolute;
		top: calc(100% + 8px);
		left: 0;
		right: 0;
		z-index: 30;
		max-height: 60dvh;
		overflow-y: auto;
		background: var(--bg-elevated);
		border: 1px solid var(--hairline);
		border-radius: 16px;
		box-shadow:
			0 4px 16px -4px rgba(0, 0, 0, 0.18),
			0 24px 48px -16px rgba(0, 0, 0, 0.4);
		padding: 4px;
		background-image: radial-gradient(
			ellipse 80% 100% at 0% 0%,
			color-mix(in oklab, var(--accent-soft) 40%, transparent) 0%,
			transparent 60%
		);
		/* Hide native scrollbar — replaced by a sticky bottom fade. */
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	.us-pop::-webkit-scrollbar {
		display: none;
	}
	/* Bottom fade indicates "more content below" without a scrollbar. */
	.us-pop::after {
		content: '';
		position: sticky;
		bottom: -4px;
		display: block;
		height: 38px;
		margin: -38px -4px -4px -4px;
		background: linear-gradient(
			to bottom,
			transparent 0%,
			color-mix(in oklab, var(--bg-elevated) 70%, transparent) 55%,
			var(--bg-elevated) 100%
		);
		pointer-events: none;
		border-bottom-left-radius: 16px;
		border-bottom-right-radius: 16px;
	}

	.us-empty {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 14px 14px;
		font-size: 13px;
		color: var(--ink-muted);
	}
	.us-empty-icon {
		display: grid;
		place-items: center;
		width: 28px;
		height: 28px;
		border-radius: 999px;
		background: var(--bg-soft);
		color: var(--ink-faint);
		font-family: var(--font-serif);
		font-size: 18px;
	}

	.us-section {
		padding: 4px 0 6px 0;
	}
	.us-section + .us-section {
		border-top: 1px solid var(--hairline);
	}

	.us-section-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 12px 4px 12px;
	}
	.us-cat {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		font-weight: 600;
	}
	.us-cat-term {
		color: var(--accent);
	}
	.us-cat-slide {
		color: var(--gold);
	}
	.us-count {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 10px;
		color: var(--ink-faint);
	}

	.us-row {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 8px 12px;
		text-decoration: none;
		color: inherit;
		border-radius: 10px;
		min-width: 0;
		cursor: pointer;
	}
	.us-row.active,
	.us-row:hover {
		background: color-mix(in oklab, var(--accent) 8%, var(--bg-elevated));
	}
	.us-row-main {
		display: flex;
		align-items: baseline;
		gap: 8px;
		min-width: 0;
	}
	.us-row-title {
		font-family: var(--font-serif);
		font-weight: 500;
		font-size: 14.5px;
		line-height: 1.15;
		color: var(--ink);
		letter-spacing: -0.005em;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.us-row-title :global(mark) {
		background: color-mix(in oklab, var(--gold) 40%, transparent);
		color: var(--ink);
		border-radius: 2px;
		padding: 0 2px;
	}
	.us-row-acro {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 10.5px;
		letter-spacing: 0.06em;
		color: var(--ink-faint);
	}
	.us-row-fa {
		font-family: var(--font-persian);
		font-size: 13px;
		color: var(--gold);
		direction: rtl;
		unicode-bidi: isolate;
		/* Push Persian gloss to the trailing edge of the row */
		margin-inline-start: auto;
		text-align: end;
		flex: none;
	}
	.us-row-mem-mark {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		border-radius: 999px;
		background: color-mix(in oklab, var(--accent) 90%, transparent);
		color: var(--bg);
		flex: none;
		margin-inline-start: 4px;
	}
	.us-row-term.is-mem .us-row-title {
		color: var(--ink-muted);
	}
	.us-row-sub {
		font-size: 12px;
		line-height: 1.4;
		color: var(--ink-muted);
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}

	.us-footer {
		display: flex;
		align-items: center;
		gap: 4px 8px;
		flex-wrap: wrap;
		padding: 8px 12px;
		border-top: 1px solid var(--hairline);
		font-size: 10px;
		color: var(--ink-faint);
	}
	.us-foot-key {
		font-family: ui-monospace, 'SF Mono', monospace;
		padding: 1px 5px;
		border-radius: 4px;
		background: var(--bg-soft);
		border: 1px solid var(--hairline);
		color: var(--ink-muted);
	}
	.us-foot-label {
		letter-spacing: 0.08em;
		text-transform: uppercase;
		margin-right: 2px;
	}
	@media (max-width: 380px) {
		.us-kbd {
			display: none;
		}
	}
</style>
