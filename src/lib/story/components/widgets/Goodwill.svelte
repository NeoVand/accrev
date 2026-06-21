<script lang="ts">
	// Goodwill on an acquisition, made live (Ch 12 — the Ranger Coffee deal).
	// Goodwill = max(0, Purchase Price − Fair Value of net identifiable assets).
	// It is the premium paid over the fair value of what you can name and touch —
	// "the price of believing." Goodwill is TESTED for impairment, not amortized:
	// when belief sours, it's written down and that write-down hits the income
	// statement as an impairment loss.
	//
	// All figures are the LOCKED illustrative Ranger anchors (NUMBERS §12):
	//   Purchase price (X) ............ 250,000
	//   Net identifiable assets (Y) ... 190,000
	//   Goodwill (X − Y) .............. 60,000
	//   Illustrative impairment ....... 20,000  → goodwill after = 40,000

	const STORY_PRICE = 250000; // §12 cash purchase price (X)
	const STORY_NIA = 190000; // §12 fair value of net identifiable assets (Y)
	const STORY_GOODWILL = STORY_PRICE - STORY_NIA; // 60,000
	const IMPAIRMENT = 20000; // §12 illustrative goodwill impairment

	let price = $state(STORY_PRICE);
	let nia = $state(STORY_NIA);
	let impaired = $state(false);

	const grossGoodwill = $derived(Math.max(0, price - nia));
	const writedown = $derived(impaired ? Math.min(IMPAIRMENT, grossGoodwill) : 0);
	const goodwill = $derived(grossGoodwill - writedown);

	// Bargain purchase: price below the fair value of net assets → no goodwill.
	const bargain = $derived(price - nia < 0);

	// Carrying value of the deal after any impairment (assets stay at fair value;
	// only the goodwill premium is written down).
	const carrying = $derived(nia + goodwill);

	// Bar geometry: net identifiable assets + goodwill stack up to the purchase
	// price. After impairment the carrying total shrinks; we scale every segment
	// against the original price so the lost slice reads as a real shortfall.
	const niaPct = $derived(price > 0 ? (nia / price) * 100 : 0);
	const goodwillPct = $derived(price > 0 ? (goodwill / price) * 100 : 0);
	const lostPct = $derived(price > 0 ? (writedown / price) * 100 : 0);

	const atStory = $derived(price === STORY_PRICE && nia === STORY_NIA);

	const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
</script>

<div class="gw" role="group" aria-label="Goodwill calculator for an acquisition">
	<div class="gw-head">
		<span class="gw-eyebrow">Goodwill — the price of believing</span>
		<span class="gw-tag" aria-label="illustrative figures">illustrative</span>
	</div>

	<label class="gw-slider">
		<span class="gw-slider-label">
			Purchase price <span class="gw-x">X</span>
			<span class="gw-val">{money(price)}</span>
		</span>
		<input
			type="range"
			min="150000"
			max="350000"
			step="5000"
			bind:value={price}
			aria-label="Purchase price"
		/>
		<span class="gw-scale"><span>{money(150000)}</span><span>{money(350000)}</span></span>
	</label>

	<label class="gw-slider">
		<span class="gw-slider-label">
			Fair value of net identifiable assets <span class="gw-y">Y</span>
			<span class="gw-val">{money(nia)}</span>
		</span>
		<input
			type="range"
			min="100000"
			max="300000"
			step="5000"
			bind:value={nia}
			aria-label="Fair value of net identifiable assets acquired"
		/>
		<span class="gw-scale"><span>{money(100000)}</span><span>{money(300000)}</span></span>
	</label>

	<div class="gw-result" class:is-bargain={bargain}>
		<span class="gw-result-label">Goodwill = max(0, X − Y)</span>
		<span class="gw-result-amt">{money(goodwill)}</span>
	</div>

	<div class="gw-bar" aria-hidden="true">
		<div class="seg seg-nia" style:width="{niaPct}%">
			<span class="seg-tag">Net identifiable assets</span>
			<span class="seg-amt">{money(nia)}</span>
		</div>
		{#if goodwillPct > 0}
			<div class="seg seg-goodwill" style:width="{goodwillPct}%">
				<span class="seg-tag">Goodwill</span>
				<span class="seg-amt">{money(goodwill)}</span>
			</div>
		{/if}
		{#if lostPct > 0}
			<div class="seg seg-lost" style:width="{lostPct}%">
				<span class="seg-tag">impaired</span>
				<span class="seg-amt">−{money(writedown)}</span>
			</div>
		{/if}
	</div>
	<div class="gw-bracket" aria-hidden="true">
		<span>stacks up to the purchase price — {money(price)}</span>
	</div>

	<div class="gw-impair">
		<button
			type="button"
			class="gw-btn"
			class:is-on={impaired}
			aria-pressed={impaired}
			disabled={grossGoodwill <= 0}
			onclick={() => (impaired = !impaired)}
		>
			{impaired ? 'Reverse impairment' : `Test & impair goodwill (−${money(IMPAIRMENT)})`}
		</button>
		<span class="gw-impair-note">tested, not amortized</span>
	</div>

	{#if writedown > 0}
		<div class="gw-is" role="note">
			<span class="gw-is-eyebrow">Hits the income statement</span>
			<div class="gw-is-line">
				<span>Goodwill impairment loss</span>
				<span class="gw-is-amt">({money(writedown)})</span>
			</div>
			<p class="gw-is-sub">
				Goodwill on the balance sheet falls to <strong>{money(goodwill)}</strong>; carrying value of
				the deal is now <strong>{money(carrying)}</strong>. Net identifiable assets aren't touched —
				only the premium is.
			</p>
		</div>
	{/if}

	<p class="gw-note" class:is-on={atStory}>
		{#if bargain}
			A <strong>bargain purchase</strong>: you paid less than fair value, so there's no goodwill —
			the gain is recognized in income instead.
		{:else if atStory && !impaired}
			That's Ranger Coffee: Summit paid <strong>{money(STORY_PRICE)}</strong> for net assets worth
			<strong>{money(STORY_NIA)}</strong>. The extra <strong>{money(STORY_GOODWILL)}</strong> is goodwill
			— the premium for brand, people, and momentum you can't itemize.
		{:else if atStory && impaired}
			Belief soured. Ranger's goodwill is written down <strong>{money(writedown)}</strong> to
			<strong>{money(goodwill)}</strong> — a real loss in earnings, with no cash leaving the door.
		{:else}
			Goodwill is the gap between what you <em>paid</em> and what you can <em>name</em>. It isn't
			amortized on a schedule — it sits until an impairment test says belief has faded.
		{/if}
	</p>
</div>

<style>
	.gw {
		border: 1px solid var(--hairline);
		border-radius: 16px;
		background: var(--bg-elevated);
		padding: 16px;
		box-shadow: var(--shadow-card);
		font-family: var(--font-sans);
	}
	.gw-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
	}
	.gw-eyebrow {
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--gold);
	}
	.gw-tag {
		flex: none;
		font-size: 9px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-faint);
		border: 1px solid var(--hairline);
		border-radius: 999px;
		padding: 2px 7px;
	}
	.gw-slider {
		display: block;
		margin-top: 14px;
	}
	.gw-slider-label {
		display: flex;
		align-items: baseline;
		gap: 6px;
		font-size: 12px;
		color: var(--ink-muted);
		margin-bottom: 6px;
	}
	.gw-x,
	.gw-y {
		font-family: ui-monospace, 'JetBrains Mono', monospace;
		font-size: 10px;
		font-weight: 600;
		color: var(--bg);
		background: var(--ink-faint);
		border-radius: 4px;
		padding: 0 4px;
		line-height: 1.4;
	}
	.gw-x {
		background: color-mix(in oklab, var(--accent) 82%, black 4%);
	}
	.gw-y {
		background: var(--gold);
	}
	.gw-val {
		margin-left: auto;
		font-variant-numeric: tabular-nums;
		font-feature-settings: 'tnum';
		font-family: ui-monospace, 'JetBrains Mono', monospace;
		font-size: 12px;
		color: var(--ink);
	}
	.gw input[type='range'] {
		width: 100%;
		accent-color: var(--accent);
		cursor: pointer;
	}
	.gw-scale {
		display: flex;
		justify-content: space-between;
		font-size: 9.5px;
		color: var(--ink-faint);
		font-variant-numeric: tabular-nums;
		margin-top: 2px;
	}
	.gw-result {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
		margin-top: 16px;
		padding: 10px 12px;
		border-radius: 12px;
		background: var(--bg-soft);
		border: 1px solid var(--hairline);
	}
	.gw-result-label {
		font-size: 11px;
		color: var(--ink-muted);
		font-family: ui-monospace, 'JetBrains Mono', monospace;
		letter-spacing: 0.02em;
	}
	.gw-result-amt {
		font-family: var(--font-serif);
		font-size: 26px;
		font-weight: 500;
		color: var(--accent);
		font-variant-numeric: tabular-nums;
	}
	.gw-result.is-bargain .gw-result-amt {
		color: var(--ink-faint);
	}
	.gw-bar {
		display: flex;
		gap: 3px;
		margin-top: 14px;
		height: 56px;
	}
	.seg {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2px;
		border-radius: 9px;
		color: var(--bg);
		min-width: 0;
		overflow: hidden;
		text-align: center;
		transition:
			width 220ms cubic-bezier(0.22, 1, 0.36, 1),
			background-color 200ms ease;
	}
	.seg-nia {
		background: var(--gold);
	}
	.seg-goodwill {
		background: color-mix(in oklab, var(--accent) 82%, black 4%);
	}
	.seg-lost {
		background: repeating-linear-gradient(
			45deg,
			var(--danger),
			var(--danger) 5px,
			color-mix(in oklab, var(--danger) 70%, black) 5px,
			color-mix(in oklab, var(--danger) 70%, black) 10px
		);
		color: #fff;
	}
	.seg-tag {
		font-size: 9px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		opacity: 0.9;
		padding: 0 2px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
	}
	.seg-amt {
		font-family: var(--font-serif);
		font-size: 15px;
		font-variant-numeric: tabular-nums;
	}
	.gw-bracket {
		display: flex;
		justify-content: center;
		margin-top: 6px;
		font-size: 10.5px;
		color: var(--ink-faint);
		font-variant-numeric: tabular-nums;
	}
	.gw-impair {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 16px;
	}
	.gw-btn {
		flex: 1;
		font-family: var(--font-sans);
		font-size: 12.5px;
		font-weight: 500;
		color: var(--ink);
		background: var(--bg-soft);
		border: 1px solid var(--hairline);
		border-radius: 10px;
		padding: 9px 12px;
		cursor: pointer;
	}
	.gw-btn:hover:not(:disabled) {
		border-color: var(--accent);
		color: var(--accent);
	}
	.gw-btn.is-on {
		background: var(--accent-soft);
		border-color: var(--accent);
		color: var(--accent);
	}
	.gw-btn:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}
	.gw-impair-note {
		flex: none;
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-faint);
	}
	.gw-is {
		margin-top: 14px;
		padding: 12px;
		border-radius: 12px;
		border: 1px solid color-mix(in oklab, var(--danger) 40%, var(--hairline));
		background: color-mix(in oklab, var(--danger) 7%, var(--bg-elevated));
	}
	.gw-is-eyebrow {
		font-size: 9.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--danger);
	}
	.gw-is-line {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 10px;
		margin-top: 6px;
		font-size: 13px;
		color: var(--ink);
	}
	.gw-is-amt {
		font-family: var(--font-serif);
		font-size: 18px;
		color: var(--danger);
		font-variant-numeric: tabular-nums;
	}
	.gw-is-sub {
		margin: 8px 0 0;
		font-size: 11.5px;
		line-height: 1.5;
		color: var(--ink-muted);
	}
	.gw-note {
		margin: 14px 0 0;
		padding-top: 10px;
		border-top: 1px dashed var(--hairline);
		font-size: 12.5px;
		line-height: 1.55;
		color: var(--ink-muted);
	}
	.gw-note.is-on {
		color: var(--ink);
	}
</style>
