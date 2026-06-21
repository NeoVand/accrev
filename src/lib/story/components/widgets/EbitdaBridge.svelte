<script lang="ts">
	// The Flattering Mirror, made live (Chapter 15 — §9 of NUMBERS.md).
	// A Non-GAAP reconciliation waterfall: start at GAAP net income, stack on the
	// four add-backs, land at Adjusted EBITDA. Toggle any add-back to watch the
	// "adjusted" number swell. Every figure here is an ILLUSTRATIVE teaching
	// number (round-numbered for tidy arithmetic), NOT Summit's real net income
	// of $67,250 — exactly as NUMBERS.md §9 flags it.

	const GAAP_NET_INCOME = 15000;

	type AddBack = {
		key: string;
		label: string;
		amount: number;
		blurb: string;
		on: boolean;
	};

	// All four add-backs are green positives (E-B-I-T-D-A literally spells them).
	let addBacks = $state<AddBack[]>([
		{
			key: 'tax',
			label: 'Income Tax Provision',
			amount: 4000,
			blurb: 'Taxes you still owe the government — added back as if they weren’t real.',
			on: true
		},
		{
			key: 'interest',
			label: 'Interest Expense',
			amount: 1000,
			blurb: 'The cost of the debt you chose to carry — set aside.',
			on: true
		},
		{
			key: 'da',
			label: 'Depreciation & Amortization',
			amount: 10000,
			blurb: 'Non-cash wear on assets you actually paid for once.',
			on: true
		},
		{
			key: 'sbc',
			label: 'Stock-Based Compensation',
			amount: 20000,
			blurb: 'Shares handed to staff — “non-cash,” yet it dilutes real owners.',
			on: true
		}
	]);

	const totalAddBacks = $derived(addBacks.reduce((sum, a) => (a.on ? sum + a.amount : sum), 0));
	const adjusted = $derived(GAAP_NET_INCOME + totalAddBacks);

	// The full bridge at the story default — all four on — is $50,000.
	const allOn = $derived(addBacks.every((a) => a.on));
	const atStory = $derived(allOn);

	const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

	// Short labels keep the compact chart rows to one line.
	const SHORT: Record<string, string> = {
		tax: 'Income Tax',
		interest: 'Interest',
		da: 'D & A',
		sbc: 'Stock Comp'
	};

	type Tone = 'start' | 'end' | 'add' | 'off';
	type Row = {
		key: string;
		label: string;
		valueLabel: string;
		leftPct: number;
		widthPct: number;
		tone: Tone;
		dim: boolean;
	};

	const maxScale = $derived(Math.max(adjusted, GAAP_NET_INCOME) || 1);

	const rows = $derived.by((): Row[] => {
		const M = maxScale;
		const out: Row[] = [
			{
				key: 'gaap',
				label: 'GAAP NI',
				valueLabel: money(GAAP_NET_INCOME),
				leftPct: 0,
				widthPct: (GAAP_NET_INCOME / M) * 100,
				tone: 'start',
				dim: false
			}
		];
		let running = GAAP_NET_INCOME;
		for (const a of addBacks) {
			const delta = a.on ? a.amount : 0;
			out.push({
				key: a.key,
				label: SHORT[a.key] ?? a.label,
				valueLabel: '+ ' + money(a.amount),
				leftPct: (running / M) * 100,
				widthPct: a.on ? Math.max((delta / M) * 100, 1.2) : 0,
				tone: a.on ? 'add' : 'off',
				dim: !a.on
			});
			running += delta;
		}
		out.push({
			key: 'adj',
			label: 'Adj. EBITDA',
			valueLabel: money(running),
			leftPct: 0,
			widthPct: (running / M) * 100,
			tone: 'end',
			dim: false
		});
		return out;
	});

	const toggle = (key: string) => {
		const a = addBacks.find((x) => x.key === key);
		if (a) a.on = !a.on;
	};
</script>

<div class="eb" role="group" aria-label="Adjusted EBITDA reconciliation">
	<div class="eb-head">
		<div class="eb-titles">
			<span class="eb-eyebrow">The Flattering Mirror</span>
			<span class="eb-illus">illustrative</span>
		</div>
		<span class="eb-figure">{money(adjusted)}</span>
	</div>
	<p class="eb-sub">
		Non-GAAP reconciliation — start at GAAP, add back the inconvenient, arrive at
		<em>Adjusted</em> EBITDA.
	</p>

	<!-- Horizontal waterfall: every bar measures from $0 at the left. -->
	<div
		class="eb-chart"
		role="img"
		aria-label={`From GAAP net income ${money(GAAP_NET_INCOME)} to adjusted EBITDA ${money(adjusted)}`}
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

	<!-- Add-back toggles -->
	<fieldset class="eb-toggles">
		<legend class="eb-legend-label">Add-backs (each one lifts the mirror)</legend>
		{#each addBacks as a (a.key)}
			<label class="eb-toggle" class:is-on={a.on}>
				<input
					type="checkbox"
					checked={a.on}
					onchange={() => toggle(a.key)}
					aria-label="{a.label}, {money(a.amount)}"
				/>
				<span class="eb-toggle-body">
					<span class="eb-toggle-top">
						<span class="eb-toggle-name">{a.label}</span>
						<span class="eb-toggle-amt">+ {money(a.amount)}</span>
					</span>
					<span class="eb-toggle-blurb">{a.blurb}</span>
				</span>
			</label>
		{/each}
	</fieldset>

	<!-- Running reconciliation line -->
	<div class="eb-recon">
		<div class="eb-recon-row eb-recon-gaap">
			<span>GAAP Net Income</span>
			<span class="eb-recon-amt">{money(GAAP_NET_INCOME)}</span>
		</div>
		<div class="eb-recon-row">
			<span>+ Add-backs ({addBacks.filter((a) => a.on).length} of {addBacks.length})</span>
			<span class="eb-recon-amt eb-pos">+ {money(totalAddBacks)}</span>
		</div>
		<div class="eb-recon-row eb-recon-total">
			<span>= Adjusted EBITDA</span>
			<span class="eb-recon-amt">{money(adjusted)}</span>
		</div>
	</div>

	<p class="eb-note" class:is-on={atStory}>
		{#if atStory}
			All four on: <strong>{money(GAAP_NET_INCOME)}</strong> of real GAAP profit becomes a
			<strong>{money(adjusted)}</strong> headline — management calls it
			<em>clarifying</em>, critics call it <em>flattering</em>. Same company, same year.
		{:else}
			Untick an add-back and the mirror tells the truth a little more. Each toggle is a judgment
			call about what counts as a “real” cost.
		{/if}
	</p>

	<!-- Regulation G -->
	<p class="eb-regg">
		<span class="eb-regg-tag">Regulation G</span>
		GAAP net income must be shown at least as prominently as the Non-GAAP figure.
	</p>
</div>

<style>
	.eb {
		border: 1px solid var(--hairline);
		border-radius: 16px;
		background: var(--bg-elevated);
		padding: 16px;
		box-shadow: var(--shadow-card);
		font-family: var(--font-sans);
	}
	.eb-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 10px;
	}
	.eb-titles {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.eb-eyebrow {
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--gold);
	}
	.eb-illus {
		align-self: flex-start;
		font-size: 9px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-faint);
		border: 1px dashed var(--hairline);
		border-radius: 999px;
		padding: 1px 7px;
	}
	.eb-figure {
		font-family: var(--font-serif);
		font-size: 26px;
		font-weight: 500;
		color: var(--success);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.eb-sub {
		margin: 8px 0 0;
		font-size: 12px;
		line-height: 1.5;
		color: var(--ink-muted);
	}
	.eb-sub em {
		font-style: italic;
		color: var(--ink);
	}

	/* Horizontal waterfall */
	.eb-chart {
		margin-top: 14px;
		border-radius: 12px;
		background: var(--bg-soft);
		border: 1px solid var(--hairline);
		padding: 12px;
		display: flex;
		flex-direction: column;
		gap: 7px;
	}
	.wf-row {
		display: grid;
		grid-template-columns: 72px 1fr 62px;
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
		background: color-mix(in oklab, var(--ink-muted) 60%, var(--bg-elevated));
	}
	.wf-bar.wf-end {
		background: color-mix(in oklab, var(--success) 80%, black 8%);
	}
	.wf-bar.wf-add {
		background: var(--success);
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
	.wf-val.wf-add {
		color: var(--success);
	}
	.wf-val.wf-start {
		color: var(--ink);
		font-weight: 600;
	}
	.wf-val.wf-end {
		color: var(--success);
		font-weight: 600;
	}

	/* Toggles */
	.eb-toggles {
		margin: 16px 0 0;
		padding: 0;
		border: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.eb-legend-label {
		padding: 0;
		font-size: 11px;
		color: var(--ink-muted);
		margin-bottom: 4px;
	}
	.eb-toggle {
		display: flex;
		align-items: flex-start;
		gap: 9px;
		padding: 8px 10px;
		border: 1px solid var(--hairline);
		border-radius: 10px;
		background: var(--bg);
		cursor: pointer;
		transition:
			border-color 200ms ease,
			background 200ms ease;
	}
	.eb-toggle.is-on {
		border-color: color-mix(in oklab, var(--success) 50%, var(--hairline));
		background: color-mix(in oklab, var(--success) 9%, var(--bg-elevated));
	}
	.eb-toggle input[type='checkbox'] {
		flex: none;
		width: 16px;
		height: 16px;
		margin-top: 1px;
		accent-color: var(--success);
		cursor: pointer;
	}
	.eb-toggle-body {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}
	.eb-toggle-top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 8px;
	}
	.eb-toggle-name {
		font-size: 12.5px;
		color: var(--ink);
		font-weight: 500;
	}
	.eb-toggle-amt {
		font-family: ui-monospace, 'JetBrains Mono', 'SF Mono', monospace;
		font-size: 12px;
		font-variant-numeric: tabular-nums;
		color: var(--ink-faint);
		white-space: nowrap;
	}
	.eb-toggle.is-on .eb-toggle-amt {
		color: var(--success);
	}
	.eb-toggle-blurb {
		font-size: 10.5px;
		line-height: 1.4;
		color: var(--ink-faint);
	}

	/* Reconciliation line */
	.eb-recon {
		margin-top: 14px;
		border: 1px solid var(--hairline);
		border-radius: 10px;
		overflow: hidden;
	}
	.eb-recon-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
		padding: 7px 12px;
		font-size: 12px;
		color: var(--ink-muted);
	}
	.eb-recon-row + .eb-recon-row {
		border-top: 1px solid var(--hairline);
	}
	.eb-recon-gaap {
		background: var(--bg-soft);
		color: var(--ink);
		font-weight: 500;
	}
	.eb-recon-amt {
		font-family: ui-monospace, 'JetBrains Mono', 'SF Mono', monospace;
		font-variant-numeric: tabular-nums;
		color: var(--ink);
	}
	.eb-pos {
		color: var(--success);
	}
	.eb-recon-total {
		background: color-mix(in oklab, var(--success) 12%, var(--bg-elevated));
		color: var(--ink);
		font-weight: 600;
	}
	.eb-recon-total .eb-recon-amt {
		color: var(--success);
		font-size: 13px;
	}

	.eb-note {
		margin: 12px 0 0;
		padding-top: 10px;
		border-top: 1px dashed var(--hairline);
		font-size: 12.5px;
		line-height: 1.55;
		color: var(--ink-muted);
	}
	.eb-note.is-on {
		color: var(--ink);
	}
	.eb-note em {
		font-style: italic;
	}

	/* Regulation G note */
	.eb-regg {
		margin: 12px 0 0;
		font-size: 11px;
		line-height: 1.5;
		color: var(--ink-muted);
		background: var(--accent-soft);
		border-radius: 9px;
		padding: 9px 11px;
	}
	.eb-regg-tag {
		display: inline-block;
		font-size: 9px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		font-weight: 700;
		color: var(--accent);
		margin-right: 6px;
	}
</style>
