<script lang="ts">
	// Build-your-own journal entry. Double-entry's one law: debits must equal
	// credits. Pre-seeded with Summit's founding entry (§1 of NUMBERS.md):
	// Dr Cash 500,000 · Cr Common Stock 500,000 — but every line is editable.
	let nextId = 4;
	const uid = () => nextId++;

	type Line = { id: number; account: string; amount: number | null };

	let debits = $state<Line[]>([{ id: 1, account: 'Cash', amount: 500000 }]);
	let credits = $state<Line[]>([{ id: 2, account: 'Common Stock', amount: 500000 }]);

	const sum = (lines: Line[]) => lines.reduce((t, l) => t + (Number(l.amount) || 0), 0);

	const totalDebit = $derived(sum(debits));
	const totalCredit = $derived(sum(credits));
	const diff = $derived(totalDebit - totalCredit);
	const balanced = $derived(diff === 0 && totalDebit > 0);

	const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

	function addDebit() {
		debits.push({ id: uid(), account: '', amount: null });
	}
	function addCredit() {
		credits.push({ id: uid(), account: '', amount: null });
	}
	function removeDebit(id: number) {
		debits = debits.filter((l) => l.id !== id);
	}
	function removeCredit(id: number) {
		credits = credits.filter((l) => l.id !== id);
	}
</script>

<div class="jc" class:is-balanced={balanced} role="group" aria-label="Journal entry validator">
	<div class="jc-head">
		<span class="jc-eyebrow">The Journal Checker</span>
		<span class="jc-rule">debits = credits</span>
	</div>

	<div class="jc-ledger">
		<!-- Debit column -->
		<section class="col col-debit" aria-label="Debits">
			<header class="col-head">
				<span class="col-title">Debits <span class="col-side">Dr · left</span></span>
				<span class="col-sum">{money(totalDebit)}</span>
			</header>
			<ul class="lines">
				{#each debits as line (line.id)}
					<li class="line">
						<input
							class="acct"
							type="text"
							placeholder="account"
							aria-label="Debit account name"
							bind:value={line.account}
						/>
						<input
							class="amt"
							type="number"
							inputmode="decimal"
							min="0"
							step="any"
							placeholder="0"
							aria-label="Debit amount"
							bind:value={line.amount}
						/>
						<button
							class="rm"
							type="button"
							aria-label="Remove debit line"
							onclick={() => removeDebit(line.id)}>×</button
						>
					</li>
				{/each}
			</ul>
			<button class="add" type="button" onclick={addDebit}>+ add debit</button>
		</section>

		<!-- Credit column -->
		<section class="col col-credit" aria-label="Credits">
			<header class="col-head">
				<span class="col-title">Credits <span class="col-side">Cr · right</span></span>
				<span class="col-sum">{money(totalCredit)}</span>
			</header>
			<ul class="lines">
				{#each credits as line (line.id)}
					<li class="line">
						<input
							class="acct"
							type="text"
							placeholder="account"
							aria-label="Credit account name"
							bind:value={line.account}
						/>
						<input
							class="amt"
							type="number"
							inputmode="decimal"
							min="0"
							step="any"
							placeholder="0"
							aria-label="Credit amount"
							bind:value={line.amount}
						/>
						<button
							class="rm"
							type="button"
							aria-label="Remove credit line"
							onclick={() => removeCredit(line.id)}>×</button
						>
					</li>
				{/each}
			</ul>
			<button class="add" type="button" onclick={addCredit}>+ add credit</button>
		</section>
	</div>

	<div class="jc-totals" aria-hidden="true">
		<span class="tot"><span class="tot-k">Σ debits</span>{money(totalDebit)}</span>
		<span class="tot-eq" class:on={balanced}>{balanced ? '=' : '≠'}</span>
		<span class="tot"><span class="tot-k">Σ credits</span>{money(totalCredit)}</span>
	</div>

	<div
		class="jc-verdict"
		class:ok={balanced}
		class:bad={!balanced}
		role="status"
		aria-live="polite"
	>
		{#if balanced}
			Balanced — post it ✓
		{:else}
			Out of balance by {money(Math.abs(diff))}
		{/if}
	</div>

	<button class="jc-post" type="button" disabled={!balanced} aria-disabled={!balanced}>
		Post entry
	</button>

	<p class="jc-note" class:is-on={balanced}>
		{#if balanced}
			The world stops tilting. Every debit has its equal-and-opposite credit — that's the one law of
			double-entry.
		{:else}
			Double-entry's single rule: total debits must equal total credits. Tune the amounts until both
			sides agree.
		{/if}
	</p>
</div>

<style>
	.jc {
		border: 1px solid var(--hairline);
		border-radius: 16px;
		background: var(--bg-elevated);
		padding: 16px;
		box-shadow: var(--shadow-card);
		font-family: var(--font-sans);
	}
	.jc-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
	}
	.jc-eyebrow {
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--gold);
	}
	.jc-rule {
		font-family: ui-monospace, 'JetBrains Mono', monospace;
		font-size: 11px;
		color: var(--ink-faint);
		letter-spacing: 0.02em;
	}

	.jc-ledger {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
		margin-top: 14px;
	}
	.col {
		display: flex;
		flex-direction: column;
		gap: 8px;
		border: 1px solid var(--hairline);
		border-radius: 12px;
		padding: 10px;
		background: var(--bg-soft);
		min-width: 0;
	}
	.col-head {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.col-title {
		font-size: 12px;
		font-weight: 600;
		color: var(--ink);
	}
	.col-side {
		display: block;
		font-size: 9.5px;
		font-weight: 400;
		letter-spacing: 0.04em;
		color: var(--ink-faint);
		font-family: ui-monospace, 'JetBrains Mono', monospace;
	}
	.col-sum {
		font-family: var(--font-serif);
		font-size: 18px;
		font-variant-numeric: tabular-nums;
		color: var(--ink);
	}
	.col-debit .col-sum {
		color: var(--accent);
	}
	.col-credit .col-sum {
		color: var(--gold);
	}

	.lines {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.line {
		display: grid;
		grid-template-columns: 1fr 56px 18px;
		gap: 4px;
		align-items: center;
	}
	.acct,
	.amt {
		border: 1px solid var(--hairline);
		border-radius: 7px;
		background: var(--bg-elevated);
		color: var(--ink);
		padding: 5px 6px;
		font-size: 16px;
		min-width: 0;
		width: 100%;
		font-family: var(--font-sans);
	}
	.acct {
		font-size: 12px;
	}
	.amt {
		font-family: ui-monospace, 'JetBrains Mono', monospace;
		font-variant-numeric: tabular-nums;
		font-size: 12px;
		text-align: right;
	}
	.acct::placeholder,
	.amt::placeholder {
		color: var(--ink-faint);
	}
	.acct:focus,
	.amt:focus {
		outline: none;
		border-color: var(--accent);
	}
	/* trim spinner clutter on number inputs */
	.amt::-webkit-outer-spin-button,
	.amt::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	.amt {
		-moz-appearance: textfield;
		appearance: textfield;
	}
	.rm {
		border: none;
		background: transparent;
		color: var(--ink-faint);
		font-size: 16px;
		line-height: 1;
		padding: 0;
		cursor: pointer;
		border-radius: 5px;
	}
	.rm:hover {
		color: var(--danger);
	}

	.add {
		align-self: flex-start;
		border: 1px dashed var(--hairline);
		background: transparent;
		color: var(--ink-muted);
		font-size: 11px;
		font-weight: 500;
		padding: 4px 8px;
		border-radius: 7px;
		cursor: pointer;
		font-family: var(--font-sans);
	}
	.add:hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	.jc-totals {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		margin-top: 14px;
		padding: 8px 0;
		border-top: 1px dashed var(--hairline);
		border-bottom: 1px dashed var(--hairline);
	}
	.tot {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		font-family: var(--font-serif);
		font-size: 16px;
		font-variant-numeric: tabular-nums;
		color: var(--ink);
	}
	.tot-k {
		font-family: ui-monospace, 'JetBrains Mono', monospace;
		font-size: 9.5px;
		letter-spacing: 0.04em;
		color: var(--ink-faint);
	}
	.tot-eq {
		font-family: var(--font-serif);
		font-size: 22px;
		color: var(--danger);
		font-weight: 500;
	}
	.tot-eq.on {
		color: var(--success);
	}

	.jc-verdict {
		margin-top: 12px;
		text-align: center;
		font-size: 13px;
		font-weight: 600;
		padding: 9px 12px;
		border-radius: 10px;
		font-variant-numeric: tabular-nums;
	}
	.jc-verdict.ok {
		color: var(--success);
		background: color-mix(in oklab, var(--success) 14%, transparent);
		border: 1px solid color-mix(in oklab, var(--success) 40%, transparent);
	}
	.jc-verdict.bad {
		color: var(--danger);
		background: color-mix(in oklab, var(--danger) 12%, transparent);
		border: 1px solid color-mix(in oklab, var(--danger) 36%, transparent);
	}

	.jc-post {
		display: block;
		width: 100%;
		margin-top: 10px;
		padding: 10px;
		border-radius: 10px;
		border: 1px solid transparent;
		background: var(--accent);
		color: var(--bg);
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 600;
		cursor: pointer;
		box-shadow: var(--cta-highlight);
	}
	.jc-post:disabled {
		background: var(--bg-soft);
		color: var(--ink-faint);
		border-color: var(--hairline);
		cursor: not-allowed;
		box-shadow: none;
	}

	.jc-note {
		margin: 12px 0 0;
		padding-top: 10px;
		border-top: 1px dashed var(--hairline);
		font-size: 12.5px;
		line-height: 1.5;
		color: var(--ink-muted);
	}
	.jc-note.is-on {
		color: var(--ink);
	}
</style>
