<script lang="ts">
	// The ASC 606 allocator from Chapter 4, made live. Drag the bundle price;
	// the discount is split across the two promises by relative standalone
	// selling price (80% / 20%), exactly as the Allocator splits Sal.
	const SSP_LICENSE = 80000;
	const SSP_SUPPORT = 20000;
	const SSP_TOTAL = SSP_LICENSE + SSP_SUPPORT; // 100,000
	const MONTHS = 36;

	let price = $state(90000);

	const licenseShare = SSP_LICENSE / SSP_TOTAL; // 0.8
	const supportShare = SSP_SUPPORT / SSP_TOTAL; // 0.2

	const license = $derived(Math.round(price * licenseShare));
	const support = $derived(Math.round(price * supportShare));
	const perMonth = $derived(support / MONTHS);
	const discount = $derived(SSP_TOTAL - price);

	const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
	const money2 = (n: number) =>
		'$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

	const atStory = $derived(price === 90000);
</script>

<div class="ssp" role="group" aria-label="Revenue allocation calculator">
	<div class="ssp-head">
		<span class="ssp-eyebrow">The ASC 606 Allocator</span>
		<span class="ssp-price">{money(price)}</span>
	</div>

	<label class="ssp-slider">
		<span class="ssp-slider-label">
			Bundle price
			<span class="ssp-disc">{discount > 0 ? `${money(discount)} discount` : 'no discount'}</span>
		</span>
		<input type="range" min="80000" max="100000" step="1000" bind:value={price} />
		<span class="ssp-scale"><span>{money(80000)}</span><span>{money(100000)} (full SSP)</span></span
		>
	</label>

	<div class="ssp-bar" aria-hidden="true">
		<div class="seg seg-license" style:flex={licenseShare}>
			<span class="seg-pct">80%</span>
			<span class="seg-amt">{money(license)}</span>
		</div>
		<div class="seg seg-support" style:flex={supportShare}>
			<span class="seg-pct">20%</span>
			<span class="seg-amt">{money(support)}</span>
		</div>
	</div>

	<div class="ssp-legend">
		<div class="leg leg-license">
			<span class="leg-dot"></span>
			<div>
				<strong>License</strong> — {money(license)}
				<span class="leg-sub">recognized now · point in time</span>
			</div>
		</div>
		<div class="leg leg-support">
			<span class="leg-dot"></span>
			<div>
				<strong>Support</strong> — {money(support)}
				<span class="leg-sub">{money2(perMonth)}/mo over {MONTHS} months · over time</span>
			</div>
		</div>
	</div>

	<p class="ssp-note" class:is-on={atStory}>
		{#if atStory}
			That's Sal: <strong>{money(license)}</strong> becomes Lyle, recognized today;
			<strong>{money(support)}</strong> becomes Sunny, dripping in at
			<strong>{money2(perMonth)}</strong> a month.
		{:else}
			The discount never lands on just one promise — it splits 80/20, always.
		{/if}
	</p>
</div>

<style>
	.ssp {
		border: 1px solid var(--hairline);
		border-radius: 16px;
		background: var(--bg-elevated);
		padding: 16px;
		box-shadow: var(--shadow-card);
		font-family: var(--font-sans);
	}
	.ssp-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
	}
	.ssp-eyebrow {
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--gold);
	}
	.ssp-price {
		font-family: var(--font-serif);
		font-size: 26px;
		font-weight: 500;
		color: var(--ink);
		font-variant-numeric: tabular-nums;
	}
	.ssp-slider {
		display: block;
		margin-top: 12px;
	}
	.ssp-slider-label {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		font-size: 12px;
		color: var(--ink-muted);
		margin-bottom: 6px;
	}
	.ssp-disc {
		font-size: 11px;
		color: var(--accent);
	}
	.ssp input[type='range'] {
		width: 100%;
		accent-color: var(--accent);
		cursor: pointer;
	}
	.ssp-scale {
		display: flex;
		justify-content: space-between;
		font-size: 9.5px;
		color: var(--ink-faint);
		font-variant-numeric: tabular-nums;
		margin-top: 2px;
	}
	.ssp-bar {
		display: flex;
		gap: 4px;
		margin-top: 14px;
		height: 54px;
	}
	.seg {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		color: var(--bg);
		min-width: 0;
		transition: flex 200ms ease;
	}
	.seg-license {
		background: color-mix(in oklab, var(--accent) 82%, black 4%);
	}
	.seg-support {
		background: var(--gold);
	}
	.seg-pct {
		font-size: 10px;
		letter-spacing: 0.1em;
		opacity: 0.85;
	}
	.seg-amt {
		font-family: var(--font-serif);
		font-size: 16px;
		font-variant-numeric: tabular-nums;
	}
	.ssp-legend {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-top: 14px;
	}
	.leg {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		font-size: 12.5px;
		color: var(--ink);
	}
	.leg-dot {
		flex: none;
		width: 10px;
		height: 10px;
		border-radius: 3px;
		margin-top: 3px;
	}
	.leg-license .leg-dot {
		background: var(--accent);
	}
	.leg-support .leg-dot {
		background: var(--gold);
	}
	.leg-sub {
		display: block;
		font-size: 10.5px;
		color: var(--ink-faint);
	}
	.ssp-note {
		margin: 12px 0 0;
		padding-top: 10px;
		border-top: 1px dashed var(--hairline);
		font-size: 12.5px;
		line-height: 1.5;
		color: var(--ink-muted);
	}
	.ssp-note.is-on {
		color: var(--ink);
	}
</style>
