<script lang="ts">
	// The indirect-method cash-flow bridge from Chapter 10, made live. This is the
	// *illustrative* textbook shape (NUMBERS §8) — round numbers chosen to teach why
	// net income ≠ cash, NOT Summit's real figures ($67,250 NI / $72,000 OCF, §11).
	// Toggle each adjustment and watch operating cash recompute. Rendered as a clean
	// horizontal waterfall: every bar measures from the same left origin (= $0).
	const NET_INCOME = 100000;

	type Adj = { id: string; label: string; short: string; amount: number; why: string };

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
		NET_INCOME + adjustments.reduce((s, a) => s + (on[a.id] ? a.amount : 0), 0)
	);

	const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
	const signed = (n: number) => (n >= 0 ? '+' : '−') + money(Math.abs(n));

	type Tone = 'start' | 'end' | 'up' | 'down' | 'off';
	type Row = {
		key: string;
		label: string;
		valueLabel: string;
		leftPct: number;
		widthPct: number;
		tone: Tone;
		dim: boolean;
	};

	// Scale to the largest extent the bridge ever reaches, so nothing clips.
	const maxScale = $derived.by(() => {
		let running = NET_INCOME;
		let peak = NET_INCOME;
		for (const a of adjustments) {
			if (on[a.id]) running += a.amount;
			peak = Math.max(peak, running);
		}
		return Math.max(NET_INCOME, operatingCash, peak) || 1;
	});

	const rows = $derived.by((): Row[] => {
		const M = maxScale;
		const out: Row[] = [
			{
				key: 'start',
				label: 'Net Income',
				valueLabel: money(NET_INCOME),
				leftPct: 0,
				widthPct: (NET_INCOME / M) * 100,
				tone: 'start',
				dim: false
			}
		];
		let running = NET_INCOME;
		for (const a of adjustments) {
			const active = on[a.id];
			const delta = active ? a.amount : 0;
			const lo = Math.min(running, running + delta);
			const hi = Math.max(running, running + delta);
			out.push({
				key: a.id,
				label: a.short,
				valueLabel: signed(a.amount),
				leftPct: (lo / M) * 100,
				widthPct: active ? Math.max(((hi - lo) / M) * 100, 1.2) : 0,
				tone: !active ? 'off' : a.amount >= 0 ? 'up' : 'down',
				dim: !active
			});
			running += delta;
		}
		out.push({
			key: 'end',
			label: 'Operating Cash',
			valueLabel: money(running),
			leftPct: 0,
			widthPct: (running / M) * 100,
			tone: 'end',
			dim: false
		});
		return out;
	});

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

	<!-- Horizontal waterfall: every bar measures from $0 at the left. -->
	<div
		class="cfb-chart"
		role="img"
		aria-label={`Waterfall from net income ${money(NET_INCOME)} to operating cash ${money(operatingCash)}`}
	>
		{#each rows as r (r.key)}
			<div class="wf-row" class:dim={r.dim} class:rule={r.tone === 'end'}>
				<span class="wf-label">{r.label}</span>
				<div class="wf-track">
					<div
						class="wf-bar wf-{r.tone}"
						style:left="{r.leftPct}%"
						style:width="{r.widthPct}%"
					></div>
				</div>
				<span class="wf-val wf-{r.tone}">{r.valueLabel}</span>
			</div>
		{/each}
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
			<strong>{money(operatingCash)}</strong> of operating cash — a <strong>{signed(gap)}</strong>
			gap that lived entirely in non-cash and working-capital lines.
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

	/* Horizontal waterfall */
	.cfb-chart {
		margin-top: 14px;
		padding: 12px;
		border-radius: 12px;
		background: var(--bg-soft);
		border: 1px solid var(--hairline);
		display: flex;
		flex-direction: column;
		gap: 7px;
	}
	.wf-row {
		display: grid;
		grid-template-columns: 78px 1fr 64px;
		gap: 8px;
		align-items: center;
		transition: opacity 200ms ease;
	}
	.wf-row.dim {
		opacity: 0.5;
	}
	.wf-row.rule {
		margin-top: 3px;
		padding-top: 8px;
		border-top: 1px dashed var(--hairline);
	}
	.wf-label {
		font-size: 10.5px;
		line-height: 1.15;
		color: var(--ink-muted);
	}
	.wf-track {
		position: relative;
		height: 18px;
		border-radius: 5px;
		background: color-mix(in oklab, var(--hairline) 45%, transparent);
		overflow: hidden;
	}
	.wf-bar {
		position: absolute;
		top: 0;
		bottom: 0;
		border-radius: 4px;
		transition:
			left 280ms cubic-bezier(0.22, 1, 0.36, 1),
			width 280ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.wf-bar.wf-start {
		background: color-mix(in oklab, var(--accent) 82%, black 4%);
	}
	.wf-bar.wf-end {
		background: var(--gold);
	}
	.wf-bar.wf-up {
		background: var(--success);
	}
	.wf-bar.wf-down {
		background: var(--danger);
	}
	.wf-bar.wf-off {
		background: var(--ink-faint);
	}
	.wf-val {
		font-family: ui-monospace, 'JetBrains Mono', monospace;
		font-size: 11px;
		font-variant-numeric: tabular-nums;
		text-align: right;
		white-space: nowrap;
		color: var(--ink);
	}
	.wf-val.wf-up {
		color: var(--success);
	}
	.wf-val.wf-down {
		color: var(--danger);
	}
	.wf-val.wf-start,
	.wf-val.wf-end {
		color: var(--ink);
		font-weight: 600;
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
