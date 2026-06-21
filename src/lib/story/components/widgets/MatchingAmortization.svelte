<script lang="ts">
	// The ASC 340-40 commission cost from Chapter 6, made live. A $15,000 sales
	// commission for landing Sal's deal is capitalized as a Deferred Contract
	// Cost asset and amortized straight-line over the 36-month contract:
	// $15,000 / 36 = $416.67/month. Drag months elapsed; watch the asset deplete
	// as the matched expense piles up. The story sits at month 3 → $1,250
	// recognized, $13,750 still on the balance sheet. (All §6 of NUMBERS.md.)
	const COMMISSION = 15000;
	const MONTHS = 36;
	const PER_MONTH = COMMISSION / MONTHS; // 416.666… → $416.67/month

	let elapsed = $state(3);

	const expenseToDate = $derived((COMMISSION * elapsed) / MONTHS);
	const remaining = $derived(COMMISSION - expenseToDate);
	const remainingPct = $derived(remaining / COMMISSION); // 1 → 0

	const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
	const money2 = (n: number) =>
		'$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

	const atStory = $derived(elapsed === 3);
	const done = $derived(elapsed === MONTHS);
</script>

<div class="amort" role="group" aria-label="Commission amortization calculator">
	<div class="amort-head">
		<span class="amort-eyebrow">ASC 340-40 · The Bonus</span>
		<span class="amort-rate" title="$15,000 ÷ 36 months">{money2(PER_MONTH)}<small>/mo</small></span
		>
	</div>

	<p class="amort-intro">
		A <strong>{money(COMMISSION)}</strong> sales commission, capitalized as a
		<em>Deferred Contract Cost</em> and amortized straight-line across the
		{MONTHS}-month contract.
	</p>

	<label class="amort-slider">
		<span class="amort-slider-label">
			Months elapsed
			<span class="amort-count">{elapsed} of {MONTHS}</span>
		</span>
		<input
			type="range"
			min="0"
			max={MONTHS}
			step="1"
			bind:value={elapsed}
			aria-valuetext="{elapsed} of {MONTHS} months elapsed"
		/>
		<span class="amort-scale"><span>month 0</span><span>month {MONTHS}</span></span>
	</label>

	<div class="amort-bar-wrap">
		<span class="amort-bar-cap">Deferred Contract Cost · asset remaining</span>
		<div class="amort-bar" aria-hidden="true">
			<div class="amort-fill" style:width="{remainingPct * 100}%">
				<span class="amort-fill-amt" class:tucked={remainingPct < 0.28}>{money(remaining)}</span>
			</div>
			{#if remainingPct < 0.28}
				<span class="amort-fill-amt outside">{money(remaining)}</span>
			{/if}
		</div>
		<span class="amort-bar-scale"><span>{money(0)}</span><span>{money(COMMISSION)}</span></span>
	</div>

	<div class="amort-stats">
		<div class="stat">
			<span class="stat-label">Monthly amortization</span>
			<span class="stat-val">{money2(PER_MONTH)}</span>
			<span class="stat-sub">expense each month</span>
		</div>
		<div class="stat">
			<span class="stat-label">Expense to date</span>
			<span class="stat-val stat-expense">{money(expenseToDate)}</span>
			<span class="stat-sub">recognized on the P&amp;L</span>
		</div>
		<div class="stat">
			<span class="stat-label">Asset remaining</span>
			<span class="stat-val stat-asset">{money(remaining)}</span>
			<span class="stat-sub">on the balance sheet</span>
		</div>
	</div>

	<p class="amort-note" class:is-on={atStory}>
		{#if atStory}
			That's Summit at year-end: 3 months in, <strong>{money(expenseToDate)}</strong> has hit the
			P&amp;L and <strong>{money(remaining)}</strong> still sits as an asset — the cost spread over the
			same months the revenue is earned, not expensed all at once.
		{:else if done}
			Fully amortized. All <strong>{money(COMMISSION)}</strong> has been matched to the revenue it
			helped earn; the asset is <strong>{money(0)}</strong>.
		{:else if elapsed === 0}
			Day one: the whole <strong>{money(COMMISSION)}</strong> sits as a
			<em>Deferred Contract Cost</em> asset — nothing expensed yet, because no contract revenue has been
			earned to match it against.
		{:else}
			Matching at work: each month moves <strong>{money2(PER_MONTH)}</strong> from asset to expense, in
			step with the revenue being earned.
		{/if}
	</p>
</div>

<style>
	.amort {
		border: 1px solid var(--hairline);
		border-radius: 16px;
		background: var(--bg-elevated);
		padding: 16px;
		box-shadow: var(--shadow-card);
		font-family: var(--font-sans);
	}
	.amort-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
	}
	.amort-eyebrow {
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--gold);
	}
	.amort-rate {
		font-family: var(--font-serif);
		font-size: 24px;
		font-weight: 500;
		color: var(--ink);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.amort-rate small {
		font-family: var(--font-sans);
		font-size: 12px;
		color: var(--ink-faint);
		font-weight: 400;
	}
	.amort-intro {
		margin: 8px 0 0;
		font-size: 12.5px;
		line-height: 1.5;
		color: var(--ink-muted);
	}
	.amort-intro em {
		font-style: normal;
		color: var(--gold);
	}
	.amort-slider {
		display: block;
		margin-top: 14px;
	}
	.amort-slider-label {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		font-size: 12px;
		color: var(--ink-muted);
		margin-bottom: 6px;
	}
	.amort-count {
		font-size: 11px;
		color: var(--accent);
		font-variant-numeric: tabular-nums;
	}
	.amort input[type='range'] {
		width: 100%;
		accent-color: var(--accent);
		cursor: pointer;
	}
	.amort-scale {
		display: flex;
		justify-content: space-between;
		font-size: 9.5px;
		color: var(--ink-faint);
		font-variant-numeric: tabular-nums;
		margin-top: 2px;
	}
	.amort-bar-wrap {
		margin-top: 16px;
	}
	.amort-bar-cap {
		display: block;
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-faint);
		margin-bottom: 6px;
	}
	.amort-bar {
		position: relative;
		display: flex;
		align-items: center;
		height: 40px;
		border-radius: 10px;
		background: var(--bg-soft);
		border: 1px solid var(--hairline);
		overflow: hidden;
	}
	.amort-fill {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		height: 100%;
		min-width: 0;
		padding-right: 10px;
		background: var(--gold);
		border-radius: 9px 0 0 9px;
		transition: width 200ms cubic-bezier(0.22, 1, 0.36, 1);
		box-sizing: border-box;
	}
	.amort-fill-amt {
		font-family: var(--font-serif);
		font-size: 15px;
		font-variant-numeric: tabular-nums;
		color: var(--bg);
		white-space: nowrap;
	}
	.amort-fill-amt.tucked {
		display: none;
	}
	.amort-fill-amt.outside {
		position: absolute;
		left: 10px;
		color: var(--ink-muted);
	}
	.amort-bar-scale {
		display: flex;
		justify-content: space-between;
		font-size: 9.5px;
		color: var(--ink-faint);
		font-variant-numeric: tabular-nums;
		margin-top: 3px;
	}
	.amort-stats {
		display: flex;
		gap: 8px;
		margin-top: 16px;
	}
	.stat {
		flex: 1 1 0;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 10px;
		border-radius: 10px;
		background: var(--bg-soft);
		border: 1px solid var(--hairline);
	}
	.stat-label {
		font-size: 9.5px;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--ink-faint);
		line-height: 1.25;
	}
	.stat-val {
		font-family: var(--font-serif);
		font-size: 17px;
		font-weight: 500;
		color: var(--ink);
		font-variant-numeric: tabular-nums;
	}
	.stat-expense {
		color: var(--accent);
	}
	.stat-asset {
		color: var(--gold);
	}
	.stat-sub {
		font-size: 9.5px;
		color: var(--ink-faint);
		line-height: 1.25;
	}
	.amort-note {
		margin: 14px 0 0;
		padding-top: 10px;
		border-top: 1px dashed var(--hairline);
		font-size: 12.5px;
		line-height: 1.5;
		color: var(--ink-muted);
	}
	.amort-note em {
		font-style: normal;
		color: var(--gold);
	}
	.amort-note.is-on {
		color: var(--ink);
	}
</style>
