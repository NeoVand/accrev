<script lang="ts">
	// Rocky, the $100,000 server rack, lived four different lives. Same cost,
	// same salvage, same 5 years — but each method front-loads expense
	// differently, which reshapes early net income and the tax bill.
	// Figures are LOCKED in story/NUMBERS.md §2.
	const COST = 100000;
	const SALVAGE = 10000;
	const LIFE = 5;
	const BASE = COST - SALVAGE; // 90,000 depreciable base

	type Method = 'sl' | 'ddb' | 'syd' | 'uop';

	// Exact schedules from NUMBERS.md §2 (each column sums to 90,000).
	const schedules: Record<Method, number[]> = {
		sl: [18000, 18000, 18000, 18000, 18000],
		ddb: [40000, 24000, 14400, 8640, 2960],
		syd: [30000, 24000, 18000, 12000, 6000],
		// Units of Production is output-driven, not time-driven. The per-year
		// split below is ONLY an illustrative even-output scenario (180k
		// units/yr × $0.10) so the chart has something to draw; real expense
		// tracks actual widgets made. Flagged illustrative in the UI.
		uop: [18000, 18000, 18000, 18000, 18000]
	};

	const meta: Record<Method, { label: string; short: string; sub: string }> = {
		sl: { label: 'Straight-Line', short: 'SL', sub: '90,000 ÷ 5 — equal every year (the books)' },
		ddb: {
			label: 'Double-Declining',
			short: 'DDB',
			sub: '40% of book value, floored at salvage — front-loaded'
		},
		syd: {
			label: "Sum-of-Years'-Digits",
			short: 'SYD',
			sub: 'digits 5+4+3+2+1 = 15 — front-loaded, gentler than DDB'
		},
		uop: {
			label: 'Units of Production',
			short: 'UoP',
			sub: '$0.10/unit (90,000 ÷ 900,000) — tracks output, not time'
		}
	};

	let method = $state<Method>('sl');

	const expenses = $derived(schedules[method]);
	const isUop = $derived(method === 'uop');

	// Net book value at each year-end: cost minus accumulated depreciation.
	const nbv = $derived.by(() => {
		let acc = 0;
		return expenses.map((e) => {
			acc += e;
			return COST - acc;
		});
	});

	const maxExpense = $derived(Math.max(...expenses));

	const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
</script>

<div class="dep" role="group" aria-label="Depreciation method comparator">
	<div class="dep-head">
		<span class="dep-eyebrow">Depreciation · Rocky</span>
		<span class="dep-asset">{money(COST)}</span>
	</div>

	<div class="dep-facts" aria-hidden="true">
		<span>Cost {money(COST)}</span>
		<span class="sep">·</span>
		<span>Salvage {money(SALVAGE)}</span>
		<span class="sep">·</span>
		<span>5-yr life</span>
		<span class="sep">·</span>
		<span>Base <strong>{money(BASE)}</strong></span>
	</div>

	<div class="dep-methods" role="radiogroup" aria-label="Depreciation method">
		{#each Object.keys(meta) as Method[] as m (m)}
			<button
				type="button"
				role="radio"
				aria-checked={method === m}
				class="dep-pill"
				class:is-active={method === m}
				onclick={() => (method = m)}
			>
				{meta[m].short}
			</button>
		{/each}
	</div>

	<p class="dep-sub">{meta[method].label} — {meta[method].sub}</p>

	<div class="dep-chart" aria-hidden="true">
		{#each expenses as e, i (i)}
			<div class="dep-col">
				<div class="dep-bar-wrap">
					<span class="dep-bar-val" class:is-y1={i === 0}>{money(e)}</span>
					<div
						class="dep-bar"
						class:is-y1={i === 0}
						style:height="{maxExpense > 0 ? (e / maxExpense) * 100 : 0}%"
					></div>
				</div>
				<span class="dep-col-yr">Y{i + 1}</span>
				<span class="dep-col-nbv">{money(nbv[i])}</span>
			</div>
		{/each}
	</div>

	<div class="dep-axis" aria-hidden="true">
		<span>annual expense (bar)</span>
		<span>net book value at year-end</span>
	</div>

	<!-- Accessible table mirror of the chart for screen readers. -->
	<table class="sr-only">
		<caption>{meta[method].label} depreciation schedule for Rocky</caption>
		<thead>
			<tr
				><th scope="col">Year</th><th scope="col">Expense</th><th scope="col">Net book value</th
				></tr
			>
		</thead>
		<tbody>
			{#each expenses as e, i (i)}
				<tr><th scope="row">Year {i + 1}</th><td>{money(e)}</td><td>{money(nbv[i])}</td></tr>
			{/each}
		</tbody>
	</table>

	<div class="dep-y1">
		<span class="dep-y1-lab">Year-1 expense</span>
		<span class="dep-y1-val">{money(expenses[0])}</span>
	</div>

	<p class="dep-note">
		{#if method === 'sl'}
			Equal slices, every year. Smooth net income, smooth tax — the method Summit actually books for
			Rocky.
		{:else if method === 'ddb'}
			The most front-loaded: <strong>{money(expenses[0])}</strong> in Year 1 vs straight-line's $18,000.
			Bigger early expense → lower early net income → lower early tax (cash kept longer), then it reverses.
		{:else if method === 'syd'}
			Front-loaded too, but gentler than DDB: <strong>{money(expenses[0])}</strong>
			in Year 1. The accelerated total still equals $90,000 — only the
			<em>timing</em> of expense, income, and tax moves.
		{:else}
			Expense tracks <strong>actual output</strong>, not the calendar: $0.10 per widget. A busy year
			is a big-expense year. The five bars shown are an
			<em>illustrative</em> even-output scenario — real years rise and fall with production.
		{/if}
	</p>

	<p class="dep-foot" class:is-on={isUop}>
		{#if isUop}
			Illustrative split — actual expense depends on units produced.
		{:else}
			Every method totals {money(BASE)} over 5 years. Book value ends at the
			{money(SALVAGE)} salvage floor.
		{/if}
	</p>
</div>

<style>
	.dep {
		border: 1px solid var(--hairline);
		border-radius: 16px;
		background: var(--bg-elevated);
		padding: 16px;
		box-shadow: var(--shadow-card);
		font-family: var(--font-sans);
	}
	.dep-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
	}
	.dep-eyebrow {
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--gold);
	}
	.dep-asset {
		font-family: var(--font-serif);
		font-size: 26px;
		font-weight: 500;
		color: var(--ink);
		font-variant-numeric: tabular-nums;
	}
	.dep-facts {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 5px;
		margin-top: 6px;
		font-size: 11px;
		color: var(--ink-muted);
		font-variant-numeric: tabular-nums;
	}
	.dep-facts strong {
		color: var(--ink);
		font-weight: 600;
	}
	.dep-facts .sep {
		color: var(--ink-faint);
	}
	.dep-methods {
		display: flex;
		gap: 6px;
		margin-top: 14px;
	}
	.dep-pill {
		flex: 1;
		padding: 7px 4px;
		border: 1px solid var(--hairline);
		border-radius: 9px;
		background: var(--bg-soft);
		color: var(--ink-muted);
		font-family: var(--font-sans);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.02em;
		cursor: pointer;
	}
	.dep-pill:hover {
		color: var(--ink);
		border-color: var(--accent-soft);
	}
	.dep-pill.is-active {
		background: var(--accent);
		border-color: var(--accent);
		color: var(--bg);
		box-shadow: var(--cta-highlight);
	}
	.dep-sub {
		margin: 10px 0 0;
		font-size: 11.5px;
		line-height: 1.4;
		color: var(--ink-muted);
	}
	.dep-chart {
		display: flex;
		align-items: flex-end;
		gap: 6px;
		margin-top: 14px;
		height: 150px;
	}
	.dep-col {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 0;
		height: 100%;
	}
	.dep-bar-wrap {
		flex: 1;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		gap: 4px;
		min-height: 0;
	}
	.dep-bar-val {
		font-size: 9.5px;
		color: var(--ink-muted);
		font-variant-numeric: tabular-nums;
		font-family: ui-monospace, 'JetBrains Mono', monospace;
		white-space: nowrap;
	}
	.dep-bar-val.is-y1 {
		color: var(--accent);
		font-weight: 600;
	}
	.dep-bar {
		width: 78%;
		max-width: 30px;
		border-radius: 5px 5px 2px 2px;
		background: color-mix(in oklab, var(--gold) 70%, var(--bg-elevated));
		transition:
			height 260ms cubic-bezier(0.22, 1, 0.36, 1),
			background-color 200ms ease;
	}
	.dep-bar.is-y1 {
		background: var(--accent);
	}
	.dep-col-yr {
		margin-top: 6px;
		font-size: 10px;
		color: var(--ink-faint);
		font-weight: 600;
	}
	.dep-col-nbv {
		margin-top: 2px;
		font-size: 9px;
		color: var(--ink-faint);
		font-variant-numeric: tabular-nums;
		font-family: ui-monospace, 'JetBrains Mono', monospace;
		white-space: nowrap;
	}
	.dep-axis {
		display: flex;
		justify-content: space-between;
		margin-top: 8px;
		font-size: 9px;
		color: var(--ink-faint);
		letter-spacing: 0.02em;
	}
	.dep-y1 {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
		margin-top: 14px;
		padding: 9px 12px;
		border: 1px solid var(--accent-soft);
		border-radius: 10px;
		background: color-mix(in oklab, var(--accent-soft) 32%, var(--bg-elevated));
	}
	.dep-y1-lab {
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent);
		font-weight: 600;
	}
	.dep-y1-val {
		font-family: var(--font-serif);
		font-size: 20px;
		font-weight: 500;
		color: var(--ink);
		font-variant-numeric: tabular-nums;
	}
	.dep-note {
		margin: 12px 0 0;
		font-size: 12.5px;
		line-height: 1.5;
		color: var(--ink);
	}
	.dep-note strong {
		font-variant-numeric: tabular-nums;
	}
	.dep-foot {
		margin: 10px 0 0;
		padding-top: 9px;
		border-top: 1px dashed var(--hairline);
		font-size: 11px;
		line-height: 1.45;
		color: var(--ink-muted);
		font-variant-numeric: tabular-nums;
	}
	.dep-foot.is-on {
		color: var(--accent);
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
