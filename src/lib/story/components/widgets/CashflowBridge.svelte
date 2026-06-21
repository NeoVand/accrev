<script lang="ts">
	// The indirect-method cash-flow bridge from Chapter 10, made live. This is the
	// *illustrative* textbook shape (NUMBERS §8) — round numbers chosen to teach why
	// net income ≠ cash, NOT Summit's real figures ($67,250 NI / $72,000 OCF, §11).
	// Toggle each non-cash / working-capital adjustment and watch operating cash recompute.
	const NET_INCOME = 100000;

	type Adj = {
		id: string;
		label: string;
		short: string;
		amount: number; // signed: + adds cash, − uses cash
		why: string;
	};

	const adjustments: Adj[] = [
		{
			id: 'dep',
			label: 'Depreciation',
			short: 'Depreciation',
			amount: 18000,
			why: 'A non-cash expense that lowered net income but never cost cash — add it back.'
		},
		{
			id: 'ar',
			label: 'Increase in Accounts Receivable',
			short: '↑ Receivables',
			amount: -15000,
			why: 'Sales booked as income, but the cash is still owed by customers — subtract it.'
		},
		{
			id: 'ap',
			label: 'Increase in Accounts Payable',
			short: '↑ Payables',
			amount: 18000,
			why: 'Expenses recorded but not yet paid — the cash is still in the bank, so add it back.'
		}
	];

	let on = $state<Record<string, boolean>>({ dep: true, ar: true, ap: true });

	const operatingCash = $derived(
		NET_INCOME + adjustments.reduce((sum, a) => sum + (on[a.id] ? a.amount : 0), 0)
	);

	// Waterfall geometry. Scale bar heights to the largest cumulative value so the
	// tallest column fills the plot; floating steps are positioned by their span.
	const PLOT = 132; // px height of the bars area

	type Step = {
		kind: 'start' | 'step' | 'end';
		label: string;
		display: number; // value shown on the bar
		amount?: number; // signed step delta
		base: number; // cumulative value at the bottom of a floating step
		on?: boolean;
		id?: string;
	};

	const steps = $derived.by((): Step[] => {
		const out: Step[] = [{ kind: 'start', label: 'Net Income', display: NET_INCOME, base: 0 }];
		let running = NET_INCOME;
		for (const a of adjustments) {
			const active = on[a.id];
			const delta = active ? a.amount : 0;
			out.push({
				kind: 'step',
				id: a.id,
				label: a.short,
				display: a.amount,
				amount: a.amount,
				base: delta >= 0 ? running : running + delta,
				on: active
			});
			running += delta;
		}
		out.push({ kind: 'end', label: 'Operating Cash', display: running, base: 0 });
		return out;
	});

	const scaleMax = $derived(
		Math.max(NET_INCOME, operatingCash, ...steps.map((s) => s.base + Math.abs(s.display)))
	);

	const px = (v: number) => (Math.abs(v) / scaleMax) * PLOT;

	const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
	const signed = (n: number) => (n >= 0 ? '+' : '−') + money(Math.abs(n));

	const allOn = $derived(adjustments.every((a) => on[a.id]));
	const gap = $derived(operatingCash - NET_INCOME);
</script>

<div class="cfb" role="group" aria-label="Indirect-method cash-flow bridge">
	<div class="cfb-head">
		<div>
			<span class="cfb-eyebrow">The Cash-Flow Bridge</span>
			<span class="cfb-illus">illustrative · §8</span>
		</div>
		<span class="cfb-total" aria-live="polite">{money(operatingCash)}</span>
	</div>

	<p class="cfb-sub">
		Net income isn't cash. The indirect method starts at the bottom line and un-does every entry
		that moved profit but not money.
	</p>

	<!-- Waterfall -->
	<div
		class="cfb-chart"
		role="img"
		aria-label={`Waterfall from net income ${money(NET_INCOME)} to operating cash ${money(operatingCash)}`}
	>
		<div class="cfb-plot" style:height={PLOT + 'px'}>
			{#each steps as s (s.kind + (s.id ?? s.label))}
				<div class="col" class:is-off={s.kind === 'step' && !s.on}>
					<span class="col-val">
						{s.kind === 'step' ? signed(s.display) : money(s.display)}
					</span>
					<div class="col-track" style:height={PLOT + 'px'}>
						{#if s.kind === 'step'}
							<div
								class="bar bar-step"
								class:up={s.display >= 0}
								class:down={s.display < 0}
								class:off={!s.on}
								style:height={(s.on ? px(s.display) : 2) + 'px'}
								style:bottom={(s.on ? px(s.base) : px(s.base)) + 'px'}
							></div>
						{:else}
							<div
								class="bar"
								class:bar-start={s.kind === 'start'}
								class:bar-end={s.kind === 'end'}
								style:height={px(s.display) + 'px'}
							></div>
						{/if}
					</div>
					<span class="col-label">{s.label}</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Toggles -->
	<fieldset class="cfb-toggles">
		<legend class="cfb-legend">Adjustments to net income</legend>
		{#each adjustments as a (a.id)}
			<label class="tgl" class:is-on={on[a.id]}>
				<input type="checkbox" bind:checked={on[a.id]} />
				<span
					class="tgl-mark"
					class:up={a.amount >= 0}
					class:down={a.amount < 0}
					aria-hidden="true"
				>
					{a.amount >= 0 ? '+' : '−'}
				</span>
				<span class="tgl-body">
					<span class="tgl-row">
						<strong>{a.label}</strong>
						<span class="tgl-amt" class:up={a.amount >= 0} class:down={a.amount < 0}>
							{signed(a.amount)}
						</span>
					</span>
					<span class="tgl-why">{a.why}</span>
				</span>
			</label>
		{/each}
	</fieldset>

	<p class="cfb-note" class:is-on={allOn}>
		{#if allOn}
			All three on: net income <strong>{money(NET_INCOME)}</strong> bridges to
			<strong>{money(operatingCash)}</strong> of operating cash — a
			<strong>{signed(gap)}</strong> gap that lived entirely in non-cash and working-capital lines.
		{:else if gap === 0}
			With every adjustment off, cash equals net income exactly — but real businesses never look
			like this. Turn the lines back on.
		{:else}
			The bridge now ends at <strong>{money(operatingCash)}</strong>. Each toggle is one reason the
			bottom line and the bank balance disagree.
		{/if}
	</p>
</div>

<style>
	.cfb {
		border: 1px solid var(--hairline);
		border-radius: 16px;
		background: var(--bg-elevated);
		padding: 16px;
		box-shadow: var(--shadow-card);
		font-family: var(--font-sans);
		color: var(--ink);
	}
	.cfb-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 10px;
	}
	.cfb-eyebrow {
		display: block;
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--gold);
	}
	.cfb-illus {
		display: block;
		margin-top: 2px;
		font-size: 9.5px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-faint);
	}
	.cfb-total {
		font-family: var(--font-serif);
		font-size: 26px;
		font-weight: 500;
		color: var(--ink);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.cfb-sub {
		margin: 10px 0 0;
		font-size: 12px;
		line-height: 1.5;
		color: var(--ink-muted);
	}

	/* Waterfall chart */
	.cfb-chart {
		margin-top: 16px;
		padding: 10px 4px 0;
		border-radius: 12px;
		background: var(--bg-soft);
		border: 1px solid var(--hairline);
	}
	.cfb-plot {
		display: flex;
		align-items: flex-end;
		gap: 4px;
	}
	.col {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.col-val {
		font-family: ui-monospace, 'JetBrains Mono', monospace;
		font-size: 9.5px;
		font-variant-numeric: tabular-nums;
		color: var(--ink-muted);
		white-space: nowrap;
		transition: opacity 200ms ease;
	}
	.col.is-off .col-val {
		opacity: 0.4;
	}
	.col-track {
		position: relative;
		width: 100%;
	}
	.bar {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 0;
		width: 78%;
		border-radius: 4px;
		transition:
			height 260ms cubic-bezier(0.22, 1, 0.36, 1),
			bottom 260ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 200ms ease;
	}
	.bar-start {
		background: color-mix(in oklab, var(--accent) 82%, black 4%);
	}
	.bar-end {
		background: var(--gold);
	}
	.bar-step.up {
		background: var(--success);
	}
	.bar-step.down {
		background: var(--danger);
	}
	.bar-step.off {
		background: var(--ink-faint);
		opacity: 0.5;
		border-radius: 2px;
	}
	.col-label {
		font-size: 9px;
		line-height: 1.2;
		text-align: center;
		color: var(--ink-muted);
		max-width: 100%;
		overflow-wrap: break-word;
	}
	.col.is-off .col-label {
		color: var(--ink-faint);
	}

	/* Toggles */
	.cfb-toggles {
		margin: 16px 0 0;
		padding: 0;
		border: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.cfb-legend {
		padding: 0;
		font-size: 11px;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--ink-faint);
		margin-bottom: 2px;
	}
	.tgl {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		padding: 9px 10px;
		border: 1px solid var(--hairline);
		border-radius: 10px;
		background: var(--bg);
		cursor: pointer;
		transition:
			border-color 200ms ease,
			background 200ms ease;
	}
	.tgl.is-on {
		border-color: color-mix(in oklab, var(--accent) 40%, var(--hairline));
		background: var(--bg-elevated);
	}
	.tgl input[type='checkbox'] {
		flex: none;
		margin: 1px 0 0;
		width: 15px;
		height: 15px;
		accent-color: var(--accent);
		cursor: pointer;
	}
	.tgl-mark {
		flex: none;
		display: grid;
		place-items: center;
		width: 18px;
		height: 18px;
		border-radius: 5px;
		font-size: 12px;
		font-weight: 700;
		line-height: 1;
		color: var(--bg);
	}
	.tgl-mark.up {
		background: var(--success);
	}
	.tgl-mark.down {
		background: var(--danger);
	}
	.tgl:not(.is-on) .tgl-mark {
		background: var(--ink-faint);
	}
	.tgl-body {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.tgl-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 8px;
	}
	.tgl-row strong {
		font-size: 12.5px;
		font-weight: 600;
		color: var(--ink);
	}
	.tgl-amt {
		font-family: ui-monospace, 'JetBrains Mono', monospace;
		font-size: 12px;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.tgl-amt.up {
		color: var(--success);
	}
	.tgl-amt.down {
		color: var(--danger);
	}
	.tgl-why {
		font-size: 10.5px;
		line-height: 1.45;
		color: var(--ink-muted);
	}

	.cfb-note {
		margin: 14px 0 0;
		padding-top: 10px;
		border-top: 1px dashed var(--hairline);
		font-size: 12.5px;
		line-height: 1.55;
		color: var(--ink-muted);
	}
	.cfb-note.is-on {
		color: var(--ink);
	}
	.cfb-note strong {
		font-variant-numeric: tabular-nums;
	}
</style>
