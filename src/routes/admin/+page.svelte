<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ADMIN_EXAMPLE_JSON,
		applyTerms,
		exportBackup,
		importBackup,
		parseTermsJson,
		previewTerms,
		triggerBackupDownload,
		type TermInput,
		type ValidationError
	} from '$lib/admin';
	import { db } from '$lib/db';

	let stats = $state({ terms: 0, reviews: 0, sessions: 0 });
	let pasteText = $state('');
	let commitMessage = $state<string | null>(null);
	let busy = $state(false);

	let importText = $state('');
	let importMessage = $state<string | null>(null);
	let showExample = $state(false);
	let confirmRestore = $state(false);
	let fileInput: HTMLInputElement | null = $state(null);

	// Sync parse is $derived so it stays perfectly in lockstep with pasteText.
	const parseResult = $derived(
		pasteText.trim() ? parseTermsJson(pasteText) : { terms: [] as TermInput[], errors: [] as ValidationError[] }
	);
	const parsedTerms = $derived<TermInput[] | null>(
		parseResult.errors.length > 0 ? null : parseResult.terms
	);
	const parseErrors = $derived<ValidationError[]>(parseResult.errors);

	// Preview is async (hits IndexedDB) — run as a real effect with token cancellation.
	let previewCounts = $state<{ newCount: number; updateCount: number } | null>(null);
	let previewToken = 0;

	onMount(refreshStats);

	async function refreshStats() {
		stats.terms = await db().terms.count();
		stats.reviews = await db().reviews.count();
		stats.sessions = await db().sessions.count();
	}

	$effect(() => {
		const token = ++previewToken;
		commitMessage = null;
		if (!parsedTerms || parsedTerms.length === 0) {
			previewCounts = null;
			return;
		}
		previewTerms(parsedTerms).then((counts) => {
			if (token === previewToken) previewCounts = counts;
		});
	});

	async function commit() {
		if (!parsedTerms || parsedTerms.length === 0) return;
		busy = true;
		try {
			const { inserted, updated } = await applyTerms(parsedTerms);
			commitMessage = `+${inserted} new · ${updated} updated`;
			pasteText = '';
			await refreshStats();
		} finally {
			busy = false;
		}
	}

	async function doExport() {
		busy = true;
		try {
			const backup = await exportBackup();
			triggerBackupDownload(backup);
		} finally {
			busy = false;
		}
	}

	async function onImportFile(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		importText = await file.text();
		input.value = '';
	}

	async function doImport() {
		if (!importText.trim()) return;
		if (!confirmRestore) {
			confirmRestore = true;
			return;
		}
		busy = true;
		try {
			const result = await importBackup(importText);
			importMessage = result.ok ? result.summary : 'Error: ' + result.error;
			if (result.ok) {
				importText = '';
				confirmRestore = false;
				await refreshStats();
			}
		} finally {
			busy = false;
		}
	}

	function cancelRestore() {
		confirmRestore = false;
	}

	function pasteExample() {
		pasteText = ADMIN_EXAMPLE_JSON;
	}
</script>

<section class="flex flex-col gap-5 pt-3">
	<div class="flex flex-col gap-0.5">
		<p class="eyebrow">admin · hidden route</p>
		<h1 class="font-display text-[24px] leading-tight font-medium text-ink">
			Content &amp; backup
		</h1>
		<p class="text-[12.5px] text-ink-muted">
			Paste JSON to add/update terms, or export / restore your entire IndexedDB.
		</p>
	</div>

	<div class="grid grid-cols-3 gap-2.5">
		<div
			class="flex flex-col gap-1 rounded-[var(--radius-card)] border border-hairline bg-bg-elevated p-3"
		>
			<p class="eyebrow">terms</p>
			<p class="font-display text-[22px] leading-none text-ink">{stats.terms}</p>
		</div>
		<div
			class="flex flex-col gap-1 rounded-[var(--radius-card)] border border-hairline bg-bg-elevated p-3"
		>
			<p class="eyebrow">reviews</p>
			<p class="font-display text-[22px] leading-none text-ink">{stats.reviews}</p>
		</div>
		<div
			class="flex flex-col gap-1 rounded-[var(--radius-card)] border border-hairline bg-bg-elevated p-3"
		>
			<p class="eyebrow">sessions</p>
			<p class="font-display text-[22px] leading-none text-ink">{stats.sessions}</p>
		</div>
	</div>

	<!-- Paste JSON -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p class="eyebrow">add &amp; update terms</p>
			<button
				type="button"
				onclick={() => (showExample = !showExample)}
				class="text-[10.5px] tracking-[0.14em] text-ink-muted uppercase hover:text-ink"
			>
				{showExample ? 'hide' : 'show'} example
			</button>
		</div>
		{#if showExample}
			<div class="rounded-[var(--radius-card)] border border-hairline bg-bg-soft/60 p-3">
				<pre
					class="max-h-[220px] overflow-auto text-[11px] leading-relaxed whitespace-pre-wrap text-ink-muted"
					dir="ltr">{ADMIN_EXAMPLE_JSON}</pre>
				<button
					type="button"
					onclick={pasteExample}
					class="mt-2 text-[10.5px] tracking-[0.14em] text-accent uppercase hover:text-ink"
				>
					paste into editor →
				</button>
			</div>
		{/if}

		<textarea
			bind:value={pasteText}
			placeholder={"[{ slug: '...', en: { term, definition }, fa: { term }, cpaSection: 'FAR', ... }]"}
			rows="10"
			dir="ltr"
			spellcheck="false"
			class="rounded-[var(--radius-card)] border border-hairline bg-bg-elevated p-3 font-mono text-[12px] leading-relaxed text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
		></textarea>

		{#if parseErrors.length > 0}
			<div
				class="flex flex-col gap-1 rounded-[var(--radius-card)] border border-danger/40 bg-danger/5 p-3"
			>
				<p class="eyebrow text-danger">
					{parseErrors.length} validation {parseErrors.length === 1 ? 'error' : 'errors'}
				</p>
				<ul class="list-disc space-y-0.5 pl-5 text-[12px] text-ink-muted">
					{#each parseErrors as err, i (i)}
						<li>
							{err.index === -1 ? 'root' : `#${err.index + 1}`} · <code>{err.field}</code>: {err.message}
						</li>
					{/each}
				</ul>
			</div>
		{:else if parsedTerms && previewCounts}
			<div
				class="flex items-center justify-between rounded-[var(--radius-card)] border border-accent/30 bg-accent-soft/30 px-4 py-3"
			>
				<div class="flex flex-col gap-0.5">
					<p class="eyebrow text-accent">preview</p>
					<p class="font-display text-[14.5px] leading-tight text-ink">
						{parsedTerms.length}
						{parsedTerms.length === 1 ? 'entry' : 'entries'}
					</p>
					<p class="text-[12px] text-ink-muted">
						{previewCounts.newCount} new · {previewCounts.updateCount} updated
					</p>
				</div>
				<button
					type="button"
					onclick={commit}
					disabled={busy}
					class="rounded-full bg-ink px-5 py-2.5 text-[11.5px] tracking-[0.16em] text-bg uppercase hover:bg-accent disabled:opacity-50"
				>
					commit
				</button>
			</div>
		{/if}

		{#if commitMessage}
			<p class="text-[12px] text-success">{commitMessage}</p>
		{/if}
	</div>

	<!-- Export -->
	<div class="flex flex-col gap-2">
		<p class="eyebrow">backup</p>
		<button
			type="button"
			onclick={doExport}
			disabled={busy}
			class="grid place-items-center rounded-full border border-hairline bg-bg-elevated py-3 text-[12px] tracking-[0.16em] text-ink uppercase hover:border-accent hover:text-accent disabled:opacity-50"
		>
			download backup (.json)
		</button>
	</div>

	<!-- Import / Restore -->
	<div class="flex flex-col gap-2">
		<p class="eyebrow">restore</p>
		<button
			type="button"
			onclick={() => fileInput?.click()}
			class="grid cursor-pointer place-items-center rounded-full border border-hairline bg-bg-elevated py-3 text-[12px] tracking-[0.16em] text-ink uppercase hover:border-accent hover:text-accent"
		>
			{importText.trim() ? 'pick a different file' : 'choose backup file'}
		</button>
		<input
			bind:this={fileInput}
			type="file"
			accept="application/json,.json"
			onchange={onImportFile}
			style="position:absolute;width:0;height:0;opacity:0;pointer-events:none"
			tabindex="-1"
			aria-hidden="true"
		/>

		{#if importText.trim()}
			{#if !confirmRestore}
				<button
					type="button"
					onclick={doImport}
					disabled={busy}
					class="grid place-items-center rounded-full bg-ink py-3 text-[12px] tracking-[0.16em] text-bg uppercase hover:bg-accent disabled:opacity-50"
				>
					preview restore
				</button>
			{:else}
				<div
					class="flex flex-col gap-2 rounded-[var(--radius-card)] border border-danger/40 bg-danger/5 p-3"
				>
					<p class="font-display text-[14px] leading-tight text-danger">
						This will overwrite your current data.
					</p>
					<p class="text-[12px] text-ink-muted">
						All terms, reviews, sessions, and profile will be replaced by the contents of this file.
					</p>
					<div class="flex gap-2 pt-1">
						<button
							type="button"
							onclick={doImport}
							disabled={busy}
							class="flex-1 rounded-full bg-danger py-2.5 text-[11px] tracking-[0.16em] text-bg uppercase hover:bg-danger/90 disabled:opacity-50"
						>
							confirm restore
						</button>
						<button
							type="button"
							onclick={cancelRestore}
							class="flex-1 rounded-full border border-hairline py-2.5 text-[11px] tracking-[0.16em] text-ink-muted uppercase hover:text-ink"
						>
							cancel
						</button>
					</div>
				</div>
			{/if}
		{/if}

		{#if importMessage}
			<p
				class="text-[12px]"
				class:text-success={importMessage.startsWith('Restored')}
				class:text-danger={importMessage.startsWith('Error')}
			>
				{importMessage}
			</p>
		{/if}
	</div>
</section>
