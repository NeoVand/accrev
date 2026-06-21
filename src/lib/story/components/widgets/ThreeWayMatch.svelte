<script lang="ts">
	// The Gate of the Three-Way Match from Chapter 3, made live. Tri the bouncer
	// lays three documents side by side — Purchase Order (wanted), Receiving
	// Report (got), Supplier Invoice (owe) — and lifts the bar only when all
	// three quantities agree. Story defaults: 1,000 ordered / 1,000 billed but
	// only 800 received (200 short). Price per rack is $100 ($100,000 ÷ 1,000),
	// canonical from NUMBERS.md §2.
	const PRICE_PER_UNIT = 100; // $100,000 / 1,000 racks (NUMBERS.md §2)

	// Story scenario: PO 1,000, Invoice 1,000, Receiving 800.
	let ordered = $state(1000); // Purchase Order — what we wanted
	let received = $state(800); // Receiving Report — what we got
	let billed = $state(1000); // Supplier Invoice — what we're asked to pay

	const clamp = (n: number) => {
		if (!Number.isFinite(n) || n < 0) return 0;
		return Math.min(Math.round(n), 99999);
	};

	const matches = $derived(ordered === received && received === billed);

	// The most expensive single problem to name in the verdict.
	const reason = $derived.by(() => {
		if (matches) return '';
		if (billed > received) {
			const gap = billed - received;
			return `The invoice bills ${fmt(billed)} but only ${fmt(received)} were received — you'd be paying for ${fmt(gap)} racks (${money(gap * PRICE_PER_UNIT)}) that never arrived.`;
		}
		if (received > ordered) {
			const gap = received - ordered;
			return `You received ${fmt(received)} but only ordered ${fmt(ordered)} — ${fmt(gap)} extra arrived that no one authorized.`;
		}
		if (billed > ordered) {
			const gap = billed - ordered;
			return `The invoice bills ${fmt(billed)} but you only ordered ${fmt(ordered)} — the bill overshoots the order by ${fmt(gap)} racks.`;
		}
		if (ordered > received) {
			const gap = ordered - received;
			return `You ordered ${fmt(ordered)} but only ${fmt(received)} have arrived — ${fmt(gap)} racks are still short.`;
		}
		if (billed < received) {
			return `The bill is lower than what arrived — pause and confirm before anyone records it.`;
		}
		return `The three documents disagree — Tri cannot lift the bar until they tell the same story.`;
	});

	const atStory = $derived(ordered === 1000 && received === 800 && billed === 1000);

	const fmt = (n: number) => n.toLocaleString('en-US');
	const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
</script>

<div class="twm" role="group" aria-label="Three-way match gate">
	<div class="twm-head">
		<span class="twm-eyebrow">The Gate of the Three-Way Match</span>
		<span class="twm-tri" aria-hidden="true">Tri</span>
	</div>

	<p class="twm-intro">
		Three documents, three authors. Tri lifts the bar only when the quantities agree.
	</p>

	<div class="twm-docs">
		<label class="doc doc-po" class:doc-bad={ordered !== received || ordered !== billed}>
			<span class="doc-tag">Purchase Order</span>
			<span class="doc-role">we wanted</span>
			<input
				type="number"
				min="0"
				max="99999"
				inputmode="numeric"
				aria-label="Purchase order quantity ordered"
				value={ordered}
				oninput={(e) => (ordered = clamp(e.currentTarget.valueAsNumber))}
			/>
			<span class="doc-unit">racks</span>
		</label>

		<label class="doc doc-rr" class:doc-bad={received !== ordered || received !== billed}>
			<span class="doc-tag">Receiving Report</span>
			<span class="doc-role">we got</span>
			<input
				type="number"
				min="0"
				max="99999"
				inputmode="numeric"
				aria-label="Receiving report quantity received"
				value={received}
				oninput={(e) => (received = clamp(e.currentTarget.valueAsNumber))}
			/>
			<span class="doc-unit">racks</span>
		</label>

		<label class="doc doc-inv" class:doc-bad={billed !== ordered || billed !== received}>
			<span class="doc-tag">Supplier Invoice</span>
			<span class="doc-role">we owe</span>
			<input
				type="number"
				min="0"
				max="99999"
				inputmode="numeric"
				aria-label="Supplier invoice quantity billed"
				value={billed}
				oninput={(e) => (billed = clamp(e.currentTarget.valueAsNumber))}
			/>
			<span class="doc-unit">racks</span>
		</label>
	</div>

	<div
		class="verdict"
		class:is-match={matches}
		class:is-lock={!matches}
		role="status"
		aria-live="polite"
	>
		<div class="verdict-head">
			<span class="verdict-icon" aria-hidden="true">{matches ? '✓' : '✕'}</span>
			<span class="verdict-title">
				{matches ? 'MATCH — payment released' : 'HARD LOCK — payment blocked'}
			</span>
		</div>
		<p class="verdict-body">
			{#if matches}
				All three agree at <strong>{fmt(ordered)} racks</strong>. Tri waves it through — the bill of
				<strong>{money(billed * PRICE_PER_UNIT)}</strong> is real, and the transaction may pass into the
				books.
			{:else}
				{reason}
			{/if}
		</p>
	</div>

	<p class="twm-note" class:is-on={atStory}>
		{#if atStory}
			That's Rocky's gate: the invoice asks for <strong>{money(100000)}</strong>, but the warehouse
			counted <strong>800</strong>. One click on
			<em>Approve</em> would have sent <strong>{money(20000)}</strong> for racks that never arrived. Tri
			refuses — and that closed door is the cheapest fraud control there is.
		{:else}
			A two-way match checks only the order and the bill; the three-way match adds <em
				>did the goods actually show up?</em
			> — the question that stops overpayment and inside fraud.
		{/if}
	</p>
</div>

<style>
	.twm {
		border: 1px solid var(--hairline);
		border-radius: 16px;
		background: var(--bg-elevated);
		padding: 16px;
		box-shadow: var(--shadow-card);
		font-family: var(--font-sans);
	}
	.twm-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
	}
	.twm-eyebrow {
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--gold);
	}
	.twm-tri {
		font-family: var(--font-serif);
		font-size: 22px;
		font-weight: 500;
		color: var(--ink);
		letter-spacing: 0.02em;
	}
	.twm-intro {
		margin: 8px 0 0;
		font-size: 12px;
		line-height: 1.5;
		color: var(--ink-muted);
	}
	.twm-docs {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-top: 14px;
	}
	.doc {
		display: grid;
		grid-template-columns: 1fr auto auto;
		grid-template-rows: auto auto;
		align-items: center;
		gap: 0 8px;
		padding: 10px 12px;
		border: 1px solid var(--hairline);
		border-left: 3px solid var(--accent);
		border-radius: 10px;
		background: var(--bg-soft);
		transition:
			border-color 200ms ease,
			background-color 200ms ease;
	}
	.doc-bad {
		border-left-color: var(--danger);
	}
	.doc-tag {
		grid-column: 1;
		grid-row: 1;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--ink);
	}
	.doc-role {
		grid-column: 1;
		grid-row: 2;
		font-size: 10.5px;
		font-style: italic;
		color: var(--ink-faint);
	}
	.doc input[type='number'] {
		grid-column: 2;
		grid-row: 1 / span 2;
		width: 5.2em;
		padding: 4px 6px;
		text-align: right;
		border: 1px solid var(--hairline);
		border-radius: 7px;
		background: var(--bg-elevated);
		color: var(--ink);
		font-family: ui-monospace, 'JetBrains Mono', monospace;
		font-variant-numeric: tabular-nums;
		font-weight: 600;
	}
	.doc input[type='number']:focus {
		border-color: var(--accent);
		outline: none;
	}
	.doc-unit {
		grid-column: 3;
		grid-row: 1 / span 2;
		font-size: 10.5px;
		color: var(--ink-faint);
	}
	.verdict {
		margin-top: 14px;
		padding: 12px 14px;
		border-radius: 12px;
		border: 1px solid var(--hairline);
	}
	.verdict.is-match {
		background: color-mix(in oklab, var(--success) 14%, var(--bg-elevated));
		border-color: color-mix(in oklab, var(--success) 45%, transparent);
	}
	.verdict.is-lock {
		background: color-mix(in oklab, var(--danger) 12%, var(--bg-elevated));
		border-color: color-mix(in oklab, var(--danger) 45%, transparent);
	}
	.verdict-head {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.verdict-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		font-size: 12px;
		font-weight: 700;
		color: var(--bg-elevated);
		flex: none;
	}
	.is-match .verdict-icon {
		background: var(--success);
	}
	.is-lock .verdict-icon {
		background: var(--danger);
	}
	.verdict-title {
		font-family: var(--font-serif);
		font-size: 14.5px;
		font-weight: 600;
		letter-spacing: 0.01em;
	}
	.is-match .verdict-title {
		color: color-mix(in oklab, var(--success) 78%, var(--ink));
	}
	.is-lock .verdict-title {
		color: color-mix(in oklab, var(--danger) 80%, var(--ink));
	}
	.verdict-body {
		margin: 6px 0 0;
		font-size: 12.5px;
		line-height: 1.5;
		color: var(--ink);
	}
	.verdict-body strong {
		font-variant-numeric: tabular-nums;
	}
	.twm-note {
		margin: 12px 0 0;
		padding-top: 10px;
		border-top: 1px dashed var(--hairline);
		font-size: 12.5px;
		line-height: 1.5;
		color: var(--ink-muted);
	}
	.twm-note.is-on {
		color: var(--ink);
	}
	.twm-note strong {
		font-variant-numeric: tabular-nums;
	}
</style>
