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

	// Tallest bar drives the scale (Adjusted EBITDA when add-backs are on).
	const peak = $derived(Math.max(adjusted, GAAP_NET_INCOME));

	// Build cumulative waterfall steps: a floating bar for each add-back that
	// sits on top of the running total, plus solid base + final bars.
	type Step = {
		key: string;
		kind: 'base' | 'add' | 'total';
		label: string;
		amount: number; // the segment's own value
		base: number; // running total it stacks upon (px-space handled in style)
		running: number; // cumulative total after this step
		on: boolean;
	};

	const steps = $derived.by<Step[]>(() => {
		const out: Step[] = [];
		let running = GAAP_NET_INCOME;
		out.push({
			key: 'gaap',
			kind: 'base',
			label: 'GAAP Net Income',
			amount: GAAP_NET_INCOME,
			base: 0,
			running,
			on: true
		});
		for (const a of addBacks) {
			const value = a.on ? a.amount : 0;
			out.push({
				key: a.key,
				kind: 'add',
				label: a.label,
				amount: value,
				base: running,
				running: running + value,
				on: a.on
			});
			running += value;
		}
		out.push({
			key: 'adj',
			kind: 'total',
			label: 'Adjusted EBITDA',
			amount: running,
			base: 0,
			running,
			on: true
		});
		return out;
	});

	const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
	const pct = (n: number) => (peak > 0 ? (n / peak) * 100 : 0);

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

	<!-- Waterfall -->
	<div class="eb-chart" aria-hidden="true">
		<div class="eb-bars">
			{#each steps as step (step.key)}
				<div class="eb-col">
					<div class="eb-track">
						{#if step.amount > 0 || step.kind !== 'add'}
							<div
								class="eb-bar eb-{step.kind}"
								class:is-off={step.kind === 'add' && !step.on}
								style:height={pct(step.amount) + '%'}
								style:bottom={pct(step.base) + '%'}
							>
								<span class="eb-bar-amt">{money(step.amount)}</span>
							</div>
						{:else}
							<div class="eb-bar-empty">off</div>
						{/if}
					</div>
					<span class="eb-col-label" class:is-anchor={step.kind !== 'add'}>{step.label}</span>
				</div>
			{/each}
		</div>
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

	/* Waterfall chart */
	.eb-chart {
		margin-top: 14px;
		border-radius: 12px;
		background: var(--bg-soft);
		padding: 12px 8px 8px;
	}
	.eb-bars {
		display: flex;
		align-items: flex-end;
		gap: 5px;
		height: 150px;
	}
	.eb-col {
		flex: 1 1 0;
		min-width: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
	}
	.eb-track {
		position: relative;
		width: 100%;
		flex: 1 1 auto;
		min-height: 0;
	}
	.eb-bar {
		position: absolute;
		left: 0;
		right: 0;
		border-radius: 5px 5px 3px 3px;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		min-height: 3px;
		transition:
			height 240ms cubic-bezier(0.22, 1, 0.36, 1),
			bottom 240ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 200ms ease;
	}
	.eb-base {
		background: color-mix(in oklab, var(--ink-muted) 55%, var(--bg-elevated));
	}
	.eb-add {
		background: var(--success);
	}
	.eb-add.is-off {
		opacity: 0.18;
	}
	.eb-total {
		background: color-mix(in oklab, var(--success) 78%, black 10%);
		box-shadow: var(--card-highlight);
	}
	.eb-bar-amt {
		font-family: ui-monospace, 'JetBrains Mono', 'SF Mono', monospace;
		font-size: 8.5px;
		font-variant-numeric: tabular-nums;
		margin-top: -14px;
		font-weight: 600;
		color: var(--ink);
		white-space: nowrap;
	}
	.eb-bar-empty {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		text-align: center;
		font-size: 8px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-faint);
	}
	.eb-col-label {
		margin-top: 7px;
		font-size: 8px;
		line-height: 1.25;
		text-align: center;
		color: var(--ink-faint);
		min-height: 22px;
	}
	.eb-col-label.is-anchor {
		color: var(--ink-muted);
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
