<script lang="ts">
	// The Great Cleansing — closing entries, Chapter 13. At year-end the
	// temporary accounts (revenues & expenses) are swept to zero through an
	// Income Summary, and the net result lands permanently in Retained Earnings.
	// Figures are Summit's REAL Year-1 close from NUMBERS.md §11:
	//   Total revenue 133,500 · Total expenses (incl. COGS) 66,250 · NI 67,250.
	const REVENUES = 133500; // §11a total revenue
	const EXPENSES = 66250; // §11a: 22,000 COGS + 18,000 + 18,000 + 3,000 + 4,000 + 1,250
	const NET_INCOME = REVENUES - EXPENSES; // 67,250 → Retained Earnings (§11e)

	// step 0 = nothing closed yet; 1,2,3 = after each closing entry.
	let step = $state(0);

	const revBal = $derived(step >= 1 ? 0 : REVENUES);
	const expBal = $derived(step >= 2 ? 0 : EXPENSES);
	// Income Summary: credited 133,500 at step 1, debited 66,250 at step 2,
	// zeroed at step 3.
	const incSummary = $derived(step === 0 || step >= 3 ? 0 : step === 1 ? REVENUES : NET_INCOME);
	const retEarnings = $derived(step >= 3 ? NET_INCOME : 0);

	const steps = [
		{
			label: 'Close Revenues',
			entry: 'Dr Revenues 133,500 · Cr Income Summary 133,500',
			caption: 'Revenues empties into Income Summary.'
		},
		{
			label: 'Close Expenses',
			entry: 'Dr Income Summary 66,250 · Cr Expenses 66,250',
			caption: 'Expenses empties out; Income Summary now shows the $67,250 profit.'
		},
		{
			label: 'Close Income Summary → Retained Earnings',
			entry: 'Dr Income Summary 67,250 · Cr Retained Earnings 67,250',
			caption: 'The profit lands permanently in Retained Earnings.'
		}
	];

	const next = $derived(step < 3 ? steps[step] : null);
	const done = $derived(step >= 3);

	const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

	function advance() {
		if (step < 3) step += 1;
	}
	function reset() {
		step = 0;
	}
</script>

<div class="cf" role="group" aria-label="Closing entries step-through">
	<div class="cf-head">
		<span class="cf-eyebrow">The Great Cleansing · closing entries</span>
		<span class="cf-step" aria-live="polite">{done ? 'closed' : `step ${step} / 3`}</span>
	</div>

	<!-- Temporary accounts -->
	<div class="cf-group" aria-label="Temporary accounts">
		<span class="cf-group-tag cf-temp-tag">Temporary — zeroed each year</span>
		<div class="cf-accts">
			<div class="acct" class:is-zero={revBal === 0}>
				<span class="acct-name">Revenues</span>
				<span class="acct-bal cr">{money(revBal)}</span>
				<span class="acct-side">credit balance</span>
			</div>
			<div class="acct" class:is-zero={expBal === 0}>
				<span class="acct-name">Expenses</span>
				<span class="acct-bal dr">{money(expBal)}</span>
				<span class="acct-side">debit balance</span>
			</div>
			<div class="acct acct-summary" class:is-zero={incSummary === 0}>
				<span class="acct-name">Income Summary</span>
				<span class="acct-bal" class:cr={step >= 1} class:profit={incSummary === NET_INCOME}
					>{money(incSummary)}</span
				>
				<span class="acct-side">
					{#if step === 0}
						clearing account
					{:else if step === 1}
						credited {money(REVENUES)}
					{:else if step === 2}
						= net income
					{:else}
						closed to zero
					{/if}
				</span>
			</div>
		</div>
	</div>

	<!-- Permanent account -->
	<div class="cf-group" aria-label="Permanent account">
		<span class="cf-group-tag cf-perm-tag">Permanent — carries forward</span>
		<div class="cf-accts">
			<div class="acct acct-perm" class:is-on={retEarnings > 0}>
				<span class="acct-name">Retained Earnings</span>
				<span class="acct-bal cr" class:profit={retEarnings > 0}>{money(retEarnings)}</span>
				<span class="acct-side">{retEarnings > 0 ? 'net income kept' : 'starts at zero'}</span>
			</div>
		</div>
	</div>

	<!-- The journal entry about to fire / just fired -->
	{#if next}
		<div class="cf-entry" aria-live="polite">
			<span class="cf-entry-tag">Next entry</span>
			<code>{next.entry}</code>
		</div>
	{/if}

	<!-- Controls -->
	<div class="cf-controls">
		{#if !done}
			<button class="cf-btn cf-go" type="button" onclick={advance}>
				{next?.label}
			</button>
		{/if}
		<button class="cf-btn cf-reset" type="button" onclick={reset} disabled={step === 0}>
			Reset
		</button>
	</div>

	<!-- Narration -->
	<p class="cf-note" class:is-done={done}>
		{#if step === 0}
			Four temporaries hold the year's story. Closing entries sweep them to
			<strong>zero</strong> so next year starts fresh — only permanents survive.
		{:else if step < 3}
			{steps[step - 1].caption}
		{:else}
			Post-closing: every temporary is <strong>{money(0)}</strong>. Only permanents carry forward —
			Summit's <strong>{money(NET_INCOME)}</strong> net income now lives in Retained Earnings.
		{/if}
	</p>
</div>

<style>
	.cf {
		border: 1px solid var(--hairline);
		border-radius: 16px;
		background: var(--bg-elevated);
		padding: 16px;
		box-shadow: var(--shadow-card);
		font-family: var(--font-sans);
	}
	.cf-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
	}
	.cf-eyebrow {
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--gold);
	}
	.cf-step {
		font-family: ui-monospace, 'JetBrains Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.04em;
		color: var(--ink-faint);
		font-variant-numeric: tabular-nums;
	}

	.cf-group {
		margin-top: 14px;
	}
	.cf-group-tag {
		display: inline-block;
		font-size: 9.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		padding: 2px 7px;
		border-radius: 999px;
		margin-bottom: 7px;
	}
	.cf-temp-tag {
		color: var(--accent);
		background: var(--accent-soft);
	}
	.cf-perm-tag {
		color: var(--success);
		background: color-mix(in oklab, var(--success) 16%, transparent);
	}

	.cf-accts {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.acct {
		display: grid;
		grid-template-columns: 1fr auto;
		grid-template-rows: auto auto;
		align-items: baseline;
		gap: 0 10px;
		padding: 9px 12px;
		border: 1px solid var(--hairline);
		border-radius: 11px;
		background: var(--bg-soft);
	}
	.acct.is-zero {
		opacity: 0.55;
		background: var(--bg);
	}
	.acct-summary {
		border-style: dashed;
	}
	.acct-perm {
		background: var(--bg-soft);
	}
	.acct-perm.is-on {
		border-color: color-mix(in oklab, var(--success) 45%, var(--hairline));
		background: color-mix(in oklab, var(--success) 9%, var(--bg-elevated));
		opacity: 1;
	}
	.acct-name {
		grid-column: 1;
		grid-row: 1;
		font-size: 13px;
		font-weight: 500;
		color: var(--ink);
	}
	.acct-bal {
		grid-column: 2;
		grid-row: 1 / span 2;
		align-self: center;
		font-family: var(--font-serif);
		font-size: 18px;
		font-weight: 500;
		color: var(--ink);
		font-variant-numeric: tabular-nums;
		transition: color 220ms ease;
	}
	.acct-bal.dr {
		color: var(--danger);
	}
	.acct-bal.cr {
		color: var(--accent);
	}
	.acct-bal.profit {
		color: var(--success);
	}
	.acct.is-zero .acct-bal {
		color: var(--ink-faint);
	}
	.acct-side {
		grid-column: 1;
		grid-row: 2;
		font-size: 10.5px;
		color: var(--ink-faint);
	}

	.cf-entry {
		margin-top: 13px;
		padding: 9px 11px;
		border: 1px dashed var(--hairline);
		border-radius: 10px;
		background: var(--bg-soft);
		display: flex;
		flex-direction: column;
		gap: 3px;
	}
	.cf-entry-tag {
		font-size: 9px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-faint);
	}
	.cf-entry code {
		font-family: ui-monospace, 'JetBrains Mono', monospace;
		font-size: 11.5px;
		line-height: 1.45;
		color: var(--ink);
		font-variant-numeric: tabular-nums;
	}

	.cf-controls {
		display: flex;
		gap: 8px;
		margin-top: 13px;
	}
	.cf-btn {
		font-family: var(--font-sans);
		font-size: 12.5px;
		font-weight: 500;
		border-radius: 10px;
		padding: 9px 12px;
		cursor: pointer;
		border: 1px solid var(--hairline);
		transition:
			background-color 180ms ease,
			border-color 180ms ease,
			opacity 180ms ease;
	}
	.cf-go {
		flex: 1;
		color: var(--bg);
		background: var(--accent);
		border-color: var(--accent);
		box-shadow: var(--cta-highlight);
	}
	.cf-go:hover {
		background: color-mix(in oklab, var(--accent) 88%, black 8%);
	}
	.cf-reset {
		color: var(--ink-muted);
		background: var(--bg-elevated);
	}
	.cf-reset:hover:not(:disabled) {
		border-color: var(--ink-faint);
		color: var(--ink);
	}
	.cf-reset:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.cf-note {
		margin: 13px 0 0;
		padding-top: 11px;
		border-top: 1px dashed var(--hairline);
		font-size: 12.5px;
		line-height: 1.5;
		color: var(--ink-muted);
	}
	.cf-note.is-done {
		color: var(--ink);
	}
</style>
