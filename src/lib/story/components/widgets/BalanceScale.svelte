<script lang="ts">
	// The accounting equation made physical: A = L + E.
	// Summit's founding (NUMBERS.md §1): Assets 500,000 = Liabilities 0 + Equity 500,000.
	// The beam tips on sign(Assets − (Liabilities + Equity)); level when they're equal.
	// Preset transactions each change BOTH sides equally, so the beam stays level —
	// that's the whole lesson. The +/− on Assets alone deliberately tips it, to show
	// you can't move one side without the other and stay in balance.
	const START = { assets: 500000, liabilities: 0, equity: 500000 };

	let assets = $state(START.assets);
	let liabilities = $state(START.liabilities);
	let equity = $state(START.equity);

	const rhs = $derived(liabilities + equity); // L + E
	const gap = $derived(assets - rhs); // >0 assets heavy, <0 claims heavy
	const balanced = $derived(gap === 0);

	// Beam tilt: clamp the tilt angle so a small imbalance is visible but never absurd.
	// Scale relative to the running total so the feel is consistent at any size.
	const TILT_MAX = 11; // degrees
	const tilt = $derived(
		(() => {
			if (gap === 0) return 0;
			const denom = Math.max(Math.abs(assets), Math.abs(rhs), 1);
			const frac = Math.max(-1, Math.min(1, gap / denom));
			// gentle curve so tiny nudges still read; assets-heavy → assets pan dips (positive)
			return Math.sign(frac) * Math.min(TILT_MAX, Math.sqrt(Math.abs(frac)) * TILT_MAX);
		})()
	);

	const NUDGE = 25000;
	const money = (n: number) =>
		(n < 0 ? '−$' : '$') + Math.abs(Math.round(n)).toLocaleString('en-US');

	type Preset = {
		id: string;
		label: string;
		detail: string;
		dA: number;
		dL: number;
		dE: number;
	};

	const presets: Preset[] = [
		{
			id: 'borrow',
			label: 'Borrow $60,000',
			detail: 'Assets +60,000 · Liabilities +60,000',
			dA: 60000,
			dL: 60000,
			dE: 0
		},
		{
			id: 'invest',
			label: 'Owner invests $100,000',
			detail: 'Assets +100,000 · Equity +100,000',
			dA: 100000,
			dL: 0,
			dE: 100000
		},
		{
			id: 'repay',
			label: 'Repay $20,000 of loan',
			detail: 'Assets −20,000 · Liabilities −20,000',
			dA: -20000,
			dL: -20000,
			dE: 0
		}
	];

	let lastAction = $state('founding');

	function applyPreset(p: Preset) {
		assets += p.dA;
		liabilities += p.dL;
		equity += p.dE;
		lastAction = p.id;
	}

	function nudgeAssets(delta: number) {
		assets += delta;
		lastAction = 'nudge';
	}

	function reset() {
		assets = START.assets;
		liabilities = START.liabilities;
		equity = START.equity;
		lastAction = 'founding';
	}
</script>

<div class="scale" role="group" aria-label="Accounting equation balance: A = L + E">
	<div class="scale-head">
		<span class="scale-eyebrow">The Accounting Equation</span>
		<span class="scale-badge" class:is-balanced={balanced} class:is-tipped={!balanced}>
			{#if balanced}Balanced ✓{:else}Out of balance{/if}
		</span>
	</div>

	<!-- The beam. role=img with a live label so screen readers hear the state. -->
	<div
		class="beam-stage"
		role="img"
		aria-label={balanced
			? 'The balance is level. Assets equal Liabilities plus Equity.'
			: gap > 0
				? 'The balance tips toward Assets. Assets exceed Liabilities plus Equity.'
				: 'The balance tips toward Liabilities and Equity, which exceed Assets.'}
	>
		<div class="beam" style:transform="rotate({tilt}deg)">
			<div class="pan pan-left" style:transform="rotate({-tilt}deg)">
				<span class="pan-tag">Assets</span>
				<span class="pan-val">{money(assets)}</span>
			</div>
			<div class="beam-bar"></div>
			<div class="pan pan-right" style:transform="rotate({-tilt}deg)">
				<span class="pan-tag">Liabilities + Equity</span>
				<span class="pan-val">{money(rhs)}</span>
			</div>
		</div>
		<div class="fulcrum" aria-hidden="true">
			<div class="fulcrum-tri"></div>
			<div class="fulcrum-base"></div>
		</div>
	</div>

	<!-- Live equation -->
	<div class="equation" aria-hidden="true">
		<span class="eq-term eq-assets">{money(assets)}</span>
		<span class="eq-op">=</span>
		<span class="eq-term eq-liab">{money(liabilities)}</span>
		<span class="eq-op">+</span>
		<span class="eq-term eq-eq">{money(equity)}</span>
	</div>
	<div class="eq-labels" aria-hidden="true">
		<span>Assets</span>
		<span></span>
		<span>Liabilities</span>
		<span></span>
		<span>Equity</span>
	</div>

	<!-- Balanced transactions: each touches two accounts, beam stays level -->
	<div class="presets">
		<span class="presets-label">Balanced transactions</span>
		<div class="preset-grid">
			{#each presets as p (p.id)}
				<button class="preset" type="button" onclick={() => applyPreset(p)}>
					<span class="preset-label">{p.label}</span>
					<span class="preset-detail">{p.detail}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- The teaching trap: move ONE side and watch it tip -->
	<div class="nudge">
		<span class="nudge-label">
			Nudge Assets alone
			<span class="nudge-hint">±{money(NUDGE).slice(1)}</span>
		</span>
		<div class="nudge-controls">
			<button
				class="nudge-btn"
				type="button"
				onclick={() => nudgeAssets(-NUDGE)}
				aria-label="Decrease assets only by {money(NUDGE).slice(1)}"
			>
				−
			</button>
			<span class="nudge-readout" class:is-off={!balanced}>
				{#if balanced}in balance{:else}{money(gap)} off{/if}
			</span>
			<button
				class="nudge-btn"
				type="button"
				onclick={() => nudgeAssets(NUDGE)}
				aria-label="Increase assets only by {money(NUDGE).slice(1)}"
			>
				+
			</button>
		</div>
	</div>

	<div class="foot">
		<button class="reset" type="button" onclick={reset} disabled={lastAction === 'founding'}>
			Reset to founding
		</button>
	</div>

	<p class="note" class:is-on={balanced}>
		{#if lastAction === 'founding'}
			Summit's day one: founders invest <strong>{money(START.equity)}</strong> in cash. Assets = Equity,
			and nothing is owed yet. The beam sits level.
		{:else if balanced}
			Still level. Every real transaction touches the equation in <strong>two places at once</strong
			>, so both sides move together — that's double-entry.
		{:else}
			You changed Assets without changing anything owners or lenders have a claim to. The equation
			<strong>must</strong> balance, so this can't be a real transaction — the missing side has to land
			somewhere.
		{/if}
	</p>

	<p class="illus">Preset transaction amounts are illustrative.</p>
</div>

<style>
	.scale {
		border: 1px solid var(--hairline);
		border-radius: 16px;
		background: var(--bg-elevated);
		padding: 16px;
		box-shadow: var(--shadow-card);
		font-family: var(--font-sans);
		color: var(--ink);
	}

	.scale-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
	}
	.scale-eyebrow {
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--gold);
	}
	.scale-badge {
		font-size: 11px;
		font-weight: 600;
		padding: 3px 9px;
		border-radius: 999px;
		font-variant-numeric: tabular-nums;
		border: 1px solid transparent;
	}
	.scale-badge.is-balanced {
		color: var(--success);
		background: color-mix(in oklab, var(--success) 14%, transparent);
		border-color: color-mix(in oklab, var(--success) 32%, transparent);
	}
	.scale-badge.is-tipped {
		color: var(--danger);
		background: color-mix(in oklab, var(--danger) 12%, transparent);
		border-color: color-mix(in oklab, var(--danger) 30%, transparent);
	}

	/* --- The balance beam --- */
	.beam-stage {
		position: relative;
		height: 132px;
		margin: 16px 0 6px;
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}
	.beam {
		position: absolute;
		top: 14px;
		left: 50%;
		width: 86%;
		margin-left: -43%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		transform-origin: 50% 50%;
		transition: transform 480ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.beam-bar {
		flex: 1;
		height: 5px;
		border-radius: 999px;
		background: linear-gradient(
			90deg,
			color-mix(in oklab, var(--accent) 72%, transparent),
			var(--gold)
		);
	}
	.pan {
		flex: none;
		width: 116px;
		min-height: 52px;
		padding: 8px 6px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2px;
		border-radius: 12px;
		background: var(--bg-soft);
		border: 1px solid var(--hairline);
		box-shadow: var(--shadow-card);
		transform-origin: 50% 50%;
		transition: transform 480ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	/* The hanger strings from beam to pan */
	.pan::before {
		content: '';
		position: absolute;
		top: -16px;
		width: 1px;
		height: 16px;
		background: var(--ink-faint);
		opacity: 0.6;
	}
	.pan-left {
		position: relative;
	}
	.pan-right {
		position: relative;
	}
	.pan-tag {
		font-size: 9.5px;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--ink-muted);
		text-align: center;
		line-height: 1.2;
	}
	.pan-val {
		font-family: var(--font-serif);
		font-size: 16px;
		font-weight: 500;
		font-variant-numeric: tabular-nums;
		color: var(--ink);
	}
	.pan-left {
		background: color-mix(in oklab, var(--accent) 9%, var(--bg-elevated));
	}
	.pan-right {
		background: color-mix(in oklab, var(--gold) 10%, var(--bg-elevated));
	}

	.fulcrum {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: -1;
	}
	.fulcrum-tri {
		width: 0;
		height: 0;
		border-left: 13px solid transparent;
		border-right: 13px solid transparent;
		border-bottom: 56px solid color-mix(in oklab, var(--ink) 24%, var(--bg-soft));
	}
	.fulcrum-base {
		width: 70px;
		height: 7px;
		border-radius: 3px;
		margin-top: -1px;
		background: color-mix(in oklab, var(--ink) 30%, var(--bg-soft));
	}

	/* --- Live equation --- */
	.equation {
		display: grid;
		grid-template-columns: 1fr auto 1fr auto 1fr;
		align-items: center;
		gap: 6px;
		margin-top: 12px;
		padding: 10px 8px;
		border-radius: 12px;
		background: var(--bg-soft);
		border: 1px solid var(--hairline);
	}
	.eq-term {
		font-family: ui-monospace, 'JetBrains Mono', 'SFMono-Regular', monospace;
		font-size: 14px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		text-align: center;
		color: var(--ink);
	}
	.eq-assets {
		color: var(--accent);
	}
	.eq-eq {
		color: var(--gold);
	}
	.eq-liab {
		color: var(--ink-muted);
	}
	.eq-op {
		font-family: var(--font-serif);
		font-size: 15px;
		color: var(--ink-faint);
		text-align: center;
	}
	.eq-labels {
		display: grid;
		grid-template-columns: 1fr auto 1fr auto 1fr;
		gap: 6px;
		margin-top: 4px;
		padding: 0 8px;
	}
	.eq-labels span {
		font-size: 9px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-faint);
		text-align: center;
	}

	/* --- Preset transactions --- */
	.presets {
		margin-top: 14px;
	}
	.presets-label,
	.nudge-label {
		display: block;
		font-size: 10px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-muted);
		margin-bottom: 7px;
	}
	.preset-grid {
		display: flex;
		flex-direction: column;
		gap: 7px;
	}
	.preset {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1px;
		text-align: left;
		padding: 9px 12px;
		border-radius: 11px;
		border: 1px solid var(--hairline);
		background: var(--bg-soft);
		cursor: pointer;
		font-family: var(--font-sans);
	}
	.preset:hover {
		border-color: color-mix(in oklab, var(--accent) 45%, var(--hairline));
		background: color-mix(in oklab, var(--accent) 6%, var(--bg-soft));
	}
	.preset-label {
		font-size: 13px;
		font-weight: 600;
		color: var(--ink);
	}
	.preset-detail {
		font-size: 10.5px;
		font-variant-numeric: tabular-nums;
		color: var(--ink-muted);
	}

	/* --- Nudge assets alone --- */
	.nudge {
		margin-top: 14px;
		padding: 11px 12px;
		border-radius: 12px;
		border: 1px dashed color-mix(in oklab, var(--danger) 40%, var(--hairline));
		background: color-mix(in oklab, var(--danger) 5%, var(--bg-soft));
	}
	.nudge-label {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 0;
	}
	.nudge-hint {
		font-size: 10px;
		letter-spacing: 0;
		text-transform: none;
		color: var(--ink-faint);
		font-variant-numeric: tabular-nums;
	}
	.nudge-controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		margin-top: 8px;
	}
	.nudge-btn {
		flex: none;
		width: 40px;
		height: 36px;
		border-radius: 10px;
		border: 1px solid var(--hairline);
		background: var(--bg-elevated);
		color: var(--ink);
		font-size: 20px;
		line-height: 1;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.nudge-btn:hover {
		border-color: color-mix(in oklab, var(--danger) 50%, var(--hairline));
		color: var(--danger);
	}
	.nudge-readout {
		flex: 1;
		text-align: center;
		font-size: 12.5px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--success);
	}
	.nudge-readout.is-off {
		color: var(--danger);
	}

	/* --- Footer / reset --- */
	.foot {
		margin-top: 12px;
		display: flex;
		justify-content: center;
	}
	.reset {
		font-family: var(--font-sans);
		font-size: 12px;
		font-weight: 500;
		color: var(--ink-muted);
		background: transparent;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		padding: 5px 14px;
		cursor: pointer;
	}
	.reset:hover:not(:disabled) {
		color: var(--ink);
		border-color: var(--ink-faint);
	}
	.reset:disabled {
		opacity: 0.45;
		cursor: default;
	}

	/* --- Notes --- */
	.note {
		margin: 12px 0 0;
		padding-top: 11px;
		border-top: 1px dashed var(--hairline);
		font-size: 12.5px;
		line-height: 1.5;
		color: var(--ink-muted);
	}
	.note.is-on {
		color: var(--ink);
	}
	.illus {
		margin: 8px 0 0;
		font-size: 10px;
		font-style: italic;
		color: var(--ink-faint);
	}
</style>
