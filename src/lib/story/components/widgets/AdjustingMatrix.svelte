<script lang="ts">
	// The 2×2 adjusting-entry matrix. Two axes:
	//   Rows    — is the line a Revenue or an Expense?
	//   Columns — did Cash move FIRST (a deferral) or does it come LATER (an accrual)?
	// The four cells are the four adjusting patterns. Each one pairs an
	// income-statement account with a balance-sheet account — that pairing is
	// the whole lesson, so it's surfaced in every detail card.
	//
	// Every figure is drawn from story/NUMBERS.md. Accrued Revenue has no Summit
	// anchor in NUMBERS.md, so its example is explicitly labelled illustrative.

	type Side = 'rev' | 'exp';
	type Timing = 'first' | 'later';

	interface Cell {
		id: string;
		side: Side;
		timing: Timing;
		name: string;
		kind: string; // the balance-sheet account it creates
		bsTag: string; // Asset / Liability tag
		desc: string;
		atEvent: { label: string; dr: string; cr: string };
		atAdjust: { label: string; dr: string; cr: string };
		isAccount: string; // income-statement account touched
		bsAccount: string; // balance-sheet account touched
		summit: string;
		illustrative?: boolean;
	}

	const cells: Cell[] = [
		{
			id: 'deferred-rev',
			side: 'rev',
			timing: 'first',
			name: 'Deferred Revenue',
			kind: 'Unearned Revenue',
			bsTag: 'Liability',
			desc: 'Cash arrives before you earn it. You owe the work, so the receipt parks as a liability and is released to revenue as it’s earned.',
			atEvent: { label: 'At receipt', dr: 'Cash', cr: 'Unearned Revenue' },
			atAdjust: { label: 'When earned', dr: 'Unearned Revenue', cr: 'Revenue' },
			isAccount: 'Support Revenue',
			bsAccount: 'Deferred Revenue',
			summit:
				'Atlas pays Sunny’s $18,000 support up front (Oct 1). Only 3 months (3 × $500 = $1,500) is earned by Dec 31, so $16,500 stays in Deferred Revenue.'
		},
		{
			id: 'accrued-rev',
			side: 'rev',
			timing: 'later',
			name: 'Accrued Revenue',
			kind: 'Accrued Receivable',
			bsTag: 'Asset',
			desc: 'You earn it before the cash arrives. Revenue is recognized now and a receivable is booked; cash settles it later.',
			atEvent: { label: 'When earned', dr: 'Accrued Receivable', cr: 'Revenue' },
			atAdjust: { label: 'At collection', dr: 'Cash', cr: 'Accrued Receivable' },
			isAccount: 'Revenue',
			bsAccount: 'Accrued Receivable',
			summit:
				'Illustrative: if Summit had delivered a week of support not yet billed at Dec 31, it would accrue the earned fee as revenue with a matching receivable.',
			illustrative: true
		},
		{
			id: 'prepaid-exp',
			side: 'exp',
			timing: 'first',
			name: 'Prepaid Expense',
			kind: 'Prepaid Asset',
			bsTag: 'Asset',
			desc: 'Cash leaves before you consume the benefit. The payment parks as an asset and is expensed as it’s used up.',
			atEvent: { label: 'At payment', dr: 'Prepaid Insurance', cr: 'Cash' },
			atAdjust: { label: 'When consumed', dr: 'Insurance Expense', cr: 'Prepaid Insurance' },
			isAccount: 'Insurance Expense',
			bsAccount: 'Prepaid Insurance',
			summit:
				'Summit pays $12,000 for 12 months of insurance (Oct 1). By Dec 31, 3 months ($3,000) is expensed, leaving a $9,000 Prepaid Insurance asset.'
		},
		{
			id: 'accrued-exp',
			side: 'exp',
			timing: 'later',
			name: 'Accrued Expense',
			kind: 'Accrued Liability',
			bsTag: 'Liability',
			desc: 'You incur the cost before the cash leaves. Expense is recognized now and a payable is booked; cash settles it later.',
			atEvent: { label: 'When incurred', dr: 'Wage Expense', cr: 'Wages Payable' },
			atAdjust: { label: 'At payment', dr: 'Wages Payable', cr: 'Cash' },
			isAccount: 'Wage Expense',
			bsAccount: 'Wages Payable',
			summit:
				'December’s last days are worked but unpaid. Summit accrues $18,000 of Wage Expense against Wages Payable; the cash goes out in January.'
		}
	];

	let selectedId = $state<string | null>(null);
	const selected = $derived(cells.find((c) => c.id === selectedId) ?? null);

	function cellAt(side: Side, timing: Timing): Cell {
		return cells.find((c) => c.side === side && c.timing === timing)!;
	}

	function pick(id: string) {
		selectedId = selectedId === id ? null : id;
	}
</script>

<div class="adj" role="group" aria-label="Adjusting-entry matrix">
	<div class="adj-head">
		<span class="adj-eyebrow">The Adjusting Matrix</span>
		<span class="adj-sub">Cash vs. the event — four ways they fall out of step</span>
	</div>

	<div class="grid" aria-label="Adjusting entries by side and cash timing">
		<!-- top-left spacer + column headers -->
		<div class="corner" aria-hidden="true"></div>
		<div class="col-head">
			Cash <em>first</em>
			<span class="col-sub">deferral</span>
		</div>
		<div class="col-head">
			Cash <em>later</em>
			<span class="col-sub">accrual</span>
		</div>

		<!-- Revenue row -->
		<div class="row-head row-rev">Revenue</div>
		{#each ['first', 'later'] as const as timing (timing)}
			{@const c = cellAt('rev', timing)}
			<button
				class="cell is-rev"
				class:is-on={selectedId === c.id}
				aria-pressed={selectedId === c.id}
				aria-label="{c.name}: revenue, cash {timing === 'first' ? 'first' : 'later'}"
				onclick={() => pick(c.id)}
			>
				<span class="cell-name">{c.name}</span>
				<span class="cell-kind">{c.kind} · {c.bsTag}</span>
			</button>
		{/each}

		<!-- Expense row -->
		<div class="row-head row-exp">Expense</div>
		{#each ['first', 'later'] as const as timing (timing)}
			{@const c = cellAt('exp', timing)}
			<button
				class="cell is-exp"
				class:is-on={selectedId === c.id}
				aria-pressed={selectedId === c.id}
				aria-label="{c.name}: expense, cash {timing === 'first' ? 'first' : 'later'}"
				onclick={() => pick(c.id)}
			>
				<span class="cell-name">{c.name}</span>
				<span class="cell-kind">{c.kind} · {c.bsTag}</span>
			</button>
		{/each}
	</div>

	{#if selected}
		<div class="detail" class:rev={selected.side === 'rev'} class:exp={selected.side === 'exp'}>
			<div class="detail-head">
				<span class="detail-name">{selected.name}</span>
				<span class="detail-pill">{selected.bsTag}</span>
				{#if selected.illustrative}
					<span class="detail-illus">illustrative</span>
				{/if}
			</div>
			<p class="detail-desc">{selected.desc}</p>

			<div class="entries">
				<div class="entry">
					<span class="entry-when">{selected.atEvent.label}</span>
					<span class="entry-line">
						<span class="dr">Dr</span>
						{selected.atEvent.dr}
					</span>
					<span class="entry-line">
						<span class="cr">Cr</span>
						{selected.atEvent.cr}
					</span>
				</div>
				<span class="entry-arrow" aria-hidden="true">→</span>
				<div class="entry">
					<span class="entry-when">{selected.atAdjust.label}</span>
					<span class="entry-line">
						<span class="dr">Dr</span>
						{selected.atAdjust.dr}
					</span>
					<span class="entry-line">
						<span class="cr">Cr</span>
						{selected.atAdjust.cr}
					</span>
				</div>
			</div>

			<div class="pairing">
				<span class="pair-chip is-is">{selected.isAccount}<em>income statement</em></span>
				<span class="pair-x" aria-hidden="true">+</span>
				<span class="pair-chip is-bs">{selected.bsAccount}<em>balance sheet</em></span>
			</div>

			<p class="summit" class:is-illus={selected.illustrative}>
				<span class="summit-tag">Summit</span>
				{selected.summit}
			</p>
		</div>
	{:else}
		<p class="hint">
			Tap a cell. Every adjustment pairs one <strong>income-statement</strong> account with one
			<strong>balance-sheet</strong> account — that’s what an adjusting entry always does.
		</p>
	{/if}
</div>

<style>
	.adj {
		border: 1px solid var(--hairline);
		border-radius: 16px;
		background: var(--bg-elevated);
		padding: 16px;
		box-shadow: var(--shadow-card);
		font-family: var(--font-sans);
	}
	.adj-head {
		display: flex;
		flex-direction: column;
		gap: 2px;
		margin-bottom: 14px;
	}
	.adj-eyebrow {
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--gold);
	}
	.adj-sub {
		font-family: var(--font-serif);
		font-size: 15px;
		font-weight: 500;
		color: var(--ink);
		line-height: 1.3;
	}

	.grid {
		display: grid;
		grid-template-columns: auto 1fr 1fr;
		gap: 6px;
		align-items: stretch;
	}
	.corner {
		grid-column: 1;
	}
	.col-head {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		text-align: center;
		font-size: 12px;
		color: var(--ink-muted);
		padding-bottom: 4px;
	}
	.col-head em {
		font-style: normal;
		font-weight: 600;
		color: var(--ink);
	}
	.col-sub {
		font-size: 9.5px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-faint);
	}
	.row-head {
		display: flex;
		align-items: center;
		justify-content: center;
		writing-mode: vertical-rl;
		transform: rotate(180deg);
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		font-weight: 600;
		padding: 0 1px;
		color: var(--bg);
		border-radius: 8px;
	}
	.row-rev {
		background: color-mix(in oklab, var(--accent) 82%, black 4%);
	}
	.row-exp {
		background: var(--gold);
	}

	.cell {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		gap: 3px;
		min-height: 62px;
		padding: 10px;
		text-align: left;
		border-radius: 10px;
		border: 1px solid var(--hairline);
		background: var(--bg-soft);
		color: var(--ink);
		cursor: pointer;
		font-family: inherit;
		transition:
			background-color 180ms ease,
			border-color 180ms ease,
			box-shadow 180ms ease;
	}
	.cell:hover {
		border-color: var(--accent);
		box-shadow: var(--shadow-card);
	}
	.cell.is-on {
		border-color: var(--accent);
		background: var(--accent-soft);
		box-shadow: var(--shadow-card);
	}
	.cell-name {
		font-family: var(--font-serif);
		font-size: 14px;
		font-weight: 500;
		line-height: 1.2;
	}
	.cell-kind {
		font-size: 10px;
		color: var(--ink-faint);
		font-variant-numeric: tabular-nums;
	}
	.cell.is-on .cell-kind {
		color: var(--ink-muted);
	}

	.detail {
		margin-top: 14px;
		padding-top: 12px;
		border-top: 1px dashed var(--hairline);
	}
	.detail-head {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}
	.detail-name {
		font-family: var(--font-serif);
		font-size: 18px;
		font-weight: 500;
		color: var(--ink);
	}
	.detail-pill {
		font-size: 9.5px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 2px 7px;
		border-radius: 999px;
		border: 1px solid var(--hairline);
		color: var(--ink-muted);
	}
	.detail.rev .detail-pill {
		color: var(--accent);
		border-color: color-mix(in oklab, var(--accent) 40%, transparent);
	}
	.detail.exp .detail-pill {
		color: var(--gold);
		border-color: color-mix(in oklab, var(--gold) 45%, transparent);
	}
	.detail-illus {
		font-size: 9.5px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 2px 7px;
		border-radius: 999px;
		background: var(--bg-soft);
		color: var(--ink-faint);
	}
	.detail-desc {
		margin: 8px 0 0;
		font-size: 12.5px;
		line-height: 1.5;
		color: var(--ink-muted);
	}

	.entries {
		display: flex;
		align-items: stretch;
		gap: 8px;
		margin-top: 12px;
	}
	.entry {
		flex: 1 1 0;
		display: flex;
		flex-direction: column;
		gap: 3px;
		padding: 9px 10px;
		border-radius: 10px;
		background: var(--bg-soft);
		border: 1px solid var(--hairline);
	}
	.entry-when {
		font-size: 9.5px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-faint);
		margin-bottom: 1px;
	}
	.entry-line {
		font-family: ui-monospace, 'JetBrains Mono', 'SFMono-Regular', monospace;
		font-size: 11.5px;
		color: var(--ink);
		font-variant-numeric: tabular-nums;
	}
	.entry-line .dr,
	.entry-line .cr {
		display: inline-block;
		width: 16px;
		font-weight: 600;
	}
	.entry-line .dr {
		color: var(--accent);
	}
	.entry-line .cr {
		color: var(--gold);
	}
	.entry-arrow {
		align-self: center;
		color: var(--ink-faint);
		font-size: 14px;
	}

	.pairing {
		display: flex;
		align-items: stretch;
		gap: 6px;
		margin-top: 12px;
	}
	.pair-chip {
		flex: 1 1 0;
		display: flex;
		flex-direction: column;
		gap: 1px;
		padding: 8px 9px;
		border-radius: 10px;
		font-size: 12px;
		font-weight: 600;
		color: var(--ink);
		border: 1px solid var(--hairline);
	}
	.pair-chip em {
		font-style: normal;
		font-size: 9px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		font-weight: 500;
		color: var(--ink-faint);
	}
	.pair-chip.is-is {
		background: color-mix(in oklab, var(--accent) 12%, var(--bg-elevated));
		border-color: color-mix(in oklab, var(--accent) 30%, transparent);
	}
	.pair-chip.is-bs {
		background: color-mix(in oklab, var(--gold) 14%, var(--bg-elevated));
		border-color: color-mix(in oklab, var(--gold) 32%, transparent);
	}
	.pair-x {
		align-self: center;
		color: var(--ink-faint);
		font-size: 13px;
		font-weight: 600;
	}

	.summit {
		margin: 12px 0 0;
		font-size: 12.5px;
		line-height: 1.5;
		color: var(--ink);
	}
	.summit-tag {
		display: inline-block;
		font-size: 9px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		font-weight: 600;
		color: var(--accent);
		margin-right: 5px;
		vertical-align: 1px;
	}
	.summit.is-illus .summit-tag {
		color: var(--ink-faint);
	}

	.hint {
		margin: 14px 0 0;
		padding-top: 12px;
		border-top: 1px dashed var(--hairline);
		font-size: 12.5px;
		line-height: 1.5;
		color: var(--ink-muted);
	}
	.hint strong {
		color: var(--ink);
		font-weight: 600;
	}
</style>
