<script lang="ts">
	// DuPont decomposition, made live. ROE = Net Profit Margin × Asset Turnover ×
	// Equity Multiplier — profitability × efficiency × leverage. Pre-loaded with
	// Summit's REAL Year-1 figures from NUMBERS.md §11f:
	//   net margin  67,250 / 133,500 = 50.4%
	//   asset turn  133,500 / 661,750 = 0.20
	//   equity mult 661,750 / 567,250 = 1.17
	//   → ROE 50.4% × 0.20 × 1.17 = 11.9%
	// SUMMIT.roe is the LOCKED figure NUMBERS.md §11f publishes (67,250 / 567,250 =
	// 11.9%). Note the three rounded factors multiply to 11.79% — the familiar DuPont
	// rounding artifact — so on the exact preset we surface the locked 11.9% rather
	// than a value that conflicts with the source of truth. The moment any slider
	// moves, ROE becomes the pure live product (margin × turnover × multiplier).
	const SUMMIT = { margin: 50.4, turnover: 0.2, multiplier: 1.17, roe: 11.9 } as const;

	let margin = $state(SUMMIT.margin); // Net profit margin, %
	let turnover = $state(SUMMIT.turnover); // Asset turnover, ×
	let multiplier = $state(SUMMIT.multiplier); // Equity multiplier, ×

	const atSummit = $derived(
		margin === SUMMIT.margin && turnover === SUMMIT.turnover && multiplier === SUMMIT.multiplier
	);

	// ROE as a percentage: (margin/100) × turnover × multiplier × 100 = margin × turnover × multiplier.
	const roe = $derived(atSummit ? SUMMIT.roe : margin * turnover * multiplier);

	const pct1 = (n: number) =>
		n.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
	const mult2 = (n: number) =>
		n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '×';

	function reset() {
		margin = SUMMIT.margin;
		turnover = SUMMIT.turnover;
		multiplier = SUMMIT.multiplier;
	}
</script>

<div class="dp" role="group" aria-label="DuPont return-on-equity decomposition">
	<div class="dp-head">
		<span class="dp-eyebrow">The DuPont Decomposition</span>
		<span class="dp-roe" aria-live="polite">
			<span class="dp-roe-val">{pct1(roe)}</span>
			<span class="dp-roe-cap">ROE</span>
		</span>
	</div>

	<p class="dp-formula" aria-hidden="true">
		ROE = <em>margin</em> × <em>turnover</em> × <em>multiplier</em>
	</p>

	<!-- Net profit margin -->
	<label class="dp-slider">
		<span class="dp-slider-label">
			<span>Net profit margin <span class="dp-tag">profitability</span></span>
			<span class="dp-num">{pct1(margin)}</span>
		</span>
		<input
			type="range"
			min="0"
			max="100"
			step="0.1"
			bind:value={margin}
			aria-label="Net profit margin, percent"
		/>
		<span class="dp-scale"><span>0%</span><span>100%</span></span>
	</label>

	<!-- Asset turnover -->
	<label class="dp-slider">
		<span class="dp-slider-label">
			<span>Asset turnover <span class="dp-tag">efficiency</span></span>
			<span class="dp-num">{mult2(turnover)}</span>
		</span>
		<input
			type="range"
			min="0"
			max="3"
			step="0.01"
			bind:value={turnover}
			aria-label="Asset turnover, times"
		/>
		<span class="dp-scale"><span>0×</span><span>3×</span></span>
	</label>

	<!-- Equity multiplier -->
	<label class="dp-slider">
		<span class="dp-slider-label">
			<span>Equity multiplier <span class="dp-tag">leverage</span></span>
			<span class="dp-num">{mult2(multiplier)}</span>
		</span>
		<input
			type="range"
			min="1"
			max="4"
			step="0.01"
			bind:value={multiplier}
			aria-label="Equity multiplier, times"
		/>
		<span class="dp-scale"><span>1×</span><span>4×</span></span>
	</label>

	<div class="dp-chain" aria-hidden="true">
		<span class="dp-chip">{pct1(margin)}</span>
		<span class="dp-op">×</span>
		<span class="dp-chip">{mult2(turnover)}</span>
		<span class="dp-op">×</span>
		<span class="dp-chip">{mult2(multiplier)}</span>
		<span class="dp-op">=</span>
		<span class="dp-chip dp-chip-roe">{pct1(roe)}</span>
	</div>

	<p class="dp-note" class:is-on={atSummit}>
		{#if atSummit}
			That's Summit, Year&nbsp;1: gorgeous margins, idle assets — ROE is held back by sleepy asset
			turnover.
		{:else}
			ROE is profitability × efficiency × leverage. Push any one lever and the bottom line moves.
		{/if}
	</p>

	<button class="dp-reset" type="button" onclick={reset} disabled={atSummit}>
		Reset to Summit's Year 1
	</button>
</div>

<style>
	.dp {
		border: 1px solid var(--hairline);
		border-radius: 16px;
		background: var(--bg-elevated);
		padding: 16px;
		box-shadow: var(--shadow-card);
		font-family: var(--font-sans);
	}
	.dp-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
	}
	.dp-eyebrow {
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--gold);
	}
	.dp-roe {
		display: flex;
		align-items: baseline;
		gap: 6px;
	}
	.dp-roe-val {
		font-family: var(--font-serif);
		font-size: 30px;
		font-weight: 600;
		color: var(--accent);
		font-variant-numeric: tabular-nums;
		line-height: 1;
	}
	.dp-roe-cap {
		font-size: 10px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-faint);
	}
	.dp-formula {
		margin: 8px 0 4px;
		font-size: 11.5px;
		color: var(--ink-faint);
		font-variant-numeric: tabular-nums;
	}
	.dp-formula em {
		font-style: normal;
		color: var(--ink-muted);
	}
	.dp-slider {
		display: block;
		margin-top: 14px;
	}
	.dp-slider-label {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 8px;
		font-size: 12.5px;
		color: var(--ink);
		margin-bottom: 6px;
	}
	.dp-tag {
		font-size: 9.5px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-faint);
		margin-left: 4px;
	}
	.dp-num {
		font-family: ui-monospace, 'JetBrains Mono', monospace;
		font-size: 13px;
		font-variant-numeric: tabular-nums;
		color: var(--ink);
	}
	.dp input[type='range'] {
		width: 100%;
		accent-color: var(--accent);
		cursor: pointer;
		margin: 0;
	}
	.dp-scale {
		display: flex;
		justify-content: space-between;
		font-size: 9.5px;
		color: var(--ink-faint);
		font-variant-numeric: tabular-nums;
		margin-top: 5px;
	}
	.dp-chain {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 5px;
		margin-top: 16px;
		padding: 10px;
		border-radius: 10px;
		background: var(--bg-soft);
	}
	.dp-chip {
		font-family: ui-monospace, 'JetBrains Mono', monospace;
		font-size: 12px;
		font-variant-numeric: tabular-nums;
		color: var(--ink-muted);
		background: var(--bg-elevated);
		border: 1px solid var(--hairline);
		border-radius: 6px;
		padding: 3px 7px;
	}
	.dp-chip-roe {
		color: var(--bg);
		background: var(--accent);
		border-color: transparent;
		font-weight: 600;
	}
	.dp-op {
		font-size: 12px;
		color: var(--ink-faint);
	}
	.dp-note {
		margin: 14px 0 0;
		padding-top: 11px;
		border-top: 1px dashed var(--hairline);
		font-size: 12.5px;
		line-height: 1.5;
		color: var(--ink-muted);
	}
	.dp-note.is-on {
		color: var(--ink);
	}
	.dp-reset {
		margin-top: 12px;
		width: 100%;
		font-family: var(--font-sans);
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.02em;
		color: var(--ink);
		background: var(--bg-soft);
		border: 1px solid var(--hairline);
		border-radius: 9px;
		padding: 9px 12px;
		cursor: pointer;
	}
	.dp-reset:hover:not(:disabled) {
		background: var(--accent-soft);
		border-color: var(--accent);
	}
	.dp-reset:disabled {
		opacity: 0.45;
		cursor: default;
	}
</style>
