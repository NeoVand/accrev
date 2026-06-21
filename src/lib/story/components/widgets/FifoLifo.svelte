<script lang="ts">
	// FIFO vs LIFO on Summit's carabiner lots (Chapter 5 — NUMBERS.md §5).
	// Three lots bought at rising prices (inflation): $10 / $12 / $14.
	// Drag units sold; toggle the cost-flow assumption. Under inflation,
	// LIFO consumes the newest (pricier) lots first → higher COGS, lower
	// gross profit, lower taxable income. FIFO leaves the cheap layer in COGS
	// and the pricey layer in ending inventory.
	const LOTS = [
		{ name: 'Lot 1', age: 'oldest', units: 1000, cost: 10 },
		{ name: 'Lot 2', age: 'middle', units: 1000, cost: 12 },
		{ name: 'Lot 3', age: 'newest', units: 1000, cost: 14 }
	];
	const TOTAL_UNITS = 3000;
	const PRICE = 30; // selling price per unit

	let unitsSold = $state(2000);
	let method = $state<'FIFO' | 'LIFO'>('FIFO');

	// Walk the lots in consumption order, peeling off `unitsSold` units.
	// Returns per-lot consumed/remaining + rolled-up COGS and ending inventory.
	const result = $derived.by(() => {
		const order =
			method === 'FIFO'
				? LOTS.map((_, i) => i) // oldest → newest
				: LOTS.map((_, i) => LOTS.length - 1 - i); // newest → oldest

		const consumed = LOTS.map(() => 0);
		let toSell = unitsSold;
		for (const i of order) {
			if (toSell <= 0) break;
			const take = Math.min(LOTS[i].units, toSell);
			consumed[i] = take;
			toSell -= take;
		}

		let cogs = 0;
		let endingValue = 0;
		const lots = LOTS.map((lot, i) => {
			const used = consumed[i];
			const left = lot.units - used;
			cogs += used * lot.cost;
			endingValue += left * lot.cost;
			return { ...lot, used, left };
		});

		const revenue = unitsSold * PRICE;
		return { lots, cogs, endingValue, revenue, grossProfit: revenue - cogs };
	});

	const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
	const num = (n: number) => n.toLocaleString('en-US');

	// At the story's canonical point (2,000 units), FIFO and LIFO diverge by
	// exactly $4,000 of COGS — the inflation premium on 1,000 carabiners.
	const atStory = $derived(unitsSold === 2000);
</script>

<div class="fl" role="group" aria-label="FIFO versus LIFO inventory calculator">
	<div class="fl-head">
		<span class="fl-eyebrow">FIFO vs LIFO · The Lots</span>
		<div class="fl-toggle" role="radiogroup" aria-label="Cost-flow assumption">
			<button
				type="button"
				role="radio"
				aria-checked={method === 'FIFO'}
				class:is-on={method === 'FIFO'}
				onclick={() => (method = 'FIFO')}
			>
				FIFO
			</button>
			<button
				type="button"
				role="radio"
				aria-checked={method === 'LIFO'}
				class:is-on={method === 'LIFO'}
				onclick={() => (method = 'LIFO')}
			>
				LIFO
			</button>
		</div>
	</div>

	<label class="fl-slider">
		<span class="fl-slider-label">
			Carabiners sold
			<span class="fl-units">{num(unitsSold)} units</span>
		</span>
		<input
			type="range"
			min="0"
			max={TOTAL_UNITS}
			step="100"
			bind:value={unitsSold}
			aria-label="Units sold"
		/>
		<span class="fl-scale"><span>0</span><span>{num(TOTAL_UNITS)} (all lots)</span></span>
	</label>

	<!-- The three lots, consumed in method order. Cheaper layers sit at the
	     left (oldest) so the inflation gradient reads left→right. -->
	<div class="fl-lots" aria-hidden="true">
		{#each result.lots as lot, i (lot.name)}
			<div class="lot" class:is-spent={lot.used > 0} class:is-full={lot.used === lot.units}>
				<div class="lot-top">
					<span class="lot-name">{lot.name}</span>
					<span class="lot-cost">${lot.cost}/u</span>
				</div>
				<div class="lot-bar">
					<div class="lot-fill" style:height={`${(lot.used / lot.units) * 100}%`}></div>
				</div>
				<div class="lot-foot">
					{#if lot.used > 0}
						<span class="lot-tag tag-cogs">{num(lot.used)} sold</span>
					{/if}
					{#if lot.left > 0}
						<span class="lot-tag tag-inv">{num(lot.left)} left</span>
					{/if}
					{#if lot.used === 0 && lot.left === lot.units}
						<span class="lot-tag tag-untouched">untouched</span>
					{/if}
				</div>
				<span class="lot-age">{lot.age}</span>
			</div>
		{/each}
	</div>

	<div class="fl-flow" aria-hidden="true">
		<span class="flow-dot dot-cogs"></span> consumed → COGS
		<span class="flow-spacer"></span>
		<span class="flow-dot dot-inv"></span> remaining → ending inventory
	</div>

	<!-- The P&L roll-up. Revenue is method-independent; COGS, ending inventory
	     and gross profit move with the cost-flow assumption. -->
	<dl class="fl-pl">
		<div class="pl-row">
			<dt>Revenue <span class="pl-sub">{num(unitsSold)} × ${PRICE}</span></dt>
			<dd>{money(result.revenue)}</dd>
		</div>
		<div class="pl-row pl-cogs">
			<dt>− COGS <span class="pl-sub">{method}</span></dt>
			<dd>({money(result.cogs)})</dd>
		</div>
		<div class="pl-row pl-gp">
			<dt>= Gross profit</dt>
			<dd>{money(result.grossProfit)}</dd>
		</div>
		<div class="pl-row pl-inv">
			<dt>Ending inventory</dt>
			<dd>{money(result.endingValue)}</dd>
		</div>
	</dl>

	<p class="fl-note" class:is-on={atStory}>
		{#if atStory}
			At <strong>2,000 units</strong>, the books use <strong>FIFO</strong>: COGS
			<strong>$22,000</strong>, ending inventory <strong>$14,000</strong>. Switch to LIFO and the
			same sale costs <strong>$4,000</strong> more — that premium is inflation, moved out of the shelf
			and onto the income statement.
		{:else}
			Under rising costs, <strong>LIFO</strong> sells the newest, priciest layers first → higher
			COGS, lower gross profit, lower taxable income. <strong>FIFO</strong> leaves the cheap layer in
			COGS and strands the pricey one in ending inventory.
		{/if}
	</p>
</div>

<style>
	.fl {
		border: 1px solid var(--hairline);
		border-radius: 16px;
		background: var(--bg-elevated);
		padding: 16px;
		box-shadow: var(--shadow-card);
		font-family: var(--font-sans);
	}
	.fl-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
	}
	.fl-eyebrow {
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--gold);
	}
	.fl-toggle {
		display: inline-flex;
		gap: 2px;
		padding: 2px;
		border-radius: 9px;
		background: var(--bg-soft);
		border: 1px solid var(--hairline);
	}
	.fl-toggle button {
		appearance: none;
		border: none;
		background: transparent;
		color: var(--ink-muted);
		font-family: var(--font-sans);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.04em;
		padding: 5px 12px;
		border-radius: 7px;
		cursor: pointer;
		font-variant-numeric: tabular-nums;
	}
	.fl-toggle button.is-on {
		background: var(--accent);
		color: var(--bg);
		box-shadow: var(--shadow-card);
	}
	.fl-slider {
		display: block;
		margin-top: 14px;
	}
	.fl-slider-label {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		font-size: 12px;
		color: var(--ink-muted);
		margin-bottom: 6px;
	}
	.fl-units {
		font-size: 11px;
		color: var(--accent);
		font-variant-numeric: tabular-nums;
		font-family: ui-monospace, 'JetBrains Mono', monospace;
	}
	.fl input[type='range'] {
		width: 100%;
		accent-color: var(--accent);
		cursor: pointer;
	}
	.fl-scale {
		display: flex;
		justify-content: space-between;
		font-size: 9.5px;
		color: var(--ink-faint);
		font-variant-numeric: tabular-nums;
		margin-top: 2px;
	}

	.fl-lots {
		display: flex;
		gap: 8px;
		margin-top: 14px;
	}
	.lot {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		border: 1px solid var(--hairline);
		border-radius: 10px;
		padding: 8px 8px 6px;
		background: var(--bg-soft);
	}
	.lot.is-spent {
		border-color: color-mix(in oklab, var(--accent) 45%, var(--hairline));
	}
	.lot-top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 4px;
	}
	.lot-name {
		font-size: 11px;
		font-weight: 600;
		color: var(--ink);
	}
	.lot-cost {
		font-size: 10.5px;
		color: var(--ink-muted);
		font-variant-numeric: tabular-nums;
		font-family: ui-monospace, 'JetBrains Mono', monospace;
	}
	.lot-bar {
		position: relative;
		height: 46px;
		margin: 6px 0 5px;
		border-radius: 6px;
		background: color-mix(in oklab, var(--gold) 22%, transparent);
		overflow: hidden;
	}
	.lot-fill {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		background: var(--accent);
		transition:
			height 220ms cubic-bezier(0.22, 1, 0.36, 1),
			background-color 200ms;
	}
	.lot-foot {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.lot-tag {
		font-size: 9.5px;
		font-variant-numeric: tabular-nums;
		font-family: ui-monospace, 'JetBrains Mono', monospace;
		line-height: 1.35;
	}
	.tag-cogs {
		color: var(--accent);
		font-weight: 600;
	}
	.tag-inv {
		color: var(--gold);
	}
	.tag-untouched {
		color: var(--ink-faint);
	}
	.lot-age {
		margin-top: 4px;
		font-size: 8.5px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-faint);
	}

	.fl-flow {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 5px;
		margin-top: 10px;
		font-size: 10px;
		color: var(--ink-faint);
	}
	.flow-dot {
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 2px;
	}
	.dot-cogs {
		background: var(--accent);
	}
	.dot-inv {
		background: color-mix(in oklab, var(--gold) 60%, transparent);
	}
	.flow-spacer {
		flex: 1;
	}

	.fl-pl {
		margin: 14px 0 0;
		padding: 10px 12px;
		border: 1px solid var(--hairline);
		border-radius: 12px;
		background: var(--bg-soft);
	}
	.pl-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
		padding: 3px 0;
		font-size: 13px;
		color: var(--ink);
	}
	.pl-row dt {
		color: var(--ink-muted);
	}
	.pl-sub {
		font-size: 10px;
		color: var(--ink-faint);
		font-family: ui-monospace, 'JetBrains Mono', monospace;
		font-variant-numeric: tabular-nums;
	}
	.pl-row dd {
		margin: 0;
		font-variant-numeric: tabular-nums;
		font-family: ui-monospace, 'JetBrains Mono', monospace;
		color: var(--ink);
	}
	.pl-cogs dd {
		color: var(--danger);
	}
	.pl-gp {
		margin-top: 2px;
		padding-top: 7px;
		border-top: 1px solid var(--hairline);
	}
	.pl-gp dt {
		color: var(--ink);
		font-weight: 600;
	}
	.pl-gp dd {
		font-family: var(--font-serif);
		font-size: 17px;
		font-weight: 500;
		color: var(--success);
	}
	.pl-inv {
		margin-top: 4px;
		padding-top: 6px;
		border-top: 1px dashed var(--hairline);
		font-size: 12px;
	}
	.pl-inv dd {
		color: var(--gold);
	}

	.fl-note {
		margin: 12px 0 0;
		padding-top: 10px;
		border-top: 1px dashed var(--hairline);
		font-size: 12.5px;
		line-height: 1.5;
		color: var(--ink-muted);
	}
	.fl-note.is-on {
		color: var(--ink);
	}
	.fl-note strong {
		color: var(--ink);
		font-weight: 600;
	}
</style>
