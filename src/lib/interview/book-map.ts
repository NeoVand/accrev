/**
 * Maps the review book's parts (src/lib/learn) to interview topics, so each book
 * part can surface the interview questions that reinforce it, and the interview
 * route can run a part-scoped session (`/interview?run=1&part=<id>`).
 *
 * This module is intentionally tiny (constants only — no bank import) so it can
 * be used by the prerendered book pages and the interview route alike without
 * pulling in the ~950 KB question bank.
 */

export type BookPartId =
	| 'foundations'
	| 'cycle'
	| 'timing'
	| 'statements'
	| 'measurement'
	| 'analysis'
	| 'frameworks'
	| 'capstone';

/** Interview topic keys (from interview-bank.json) relevant to each book part. */
export const PART_TOPICS: Record<BookPartId, string[]> = {
	foundations: [
		'accounting-equation',
		'debits-credits',
		'double-entry',
		'journal-ledger',
		'contra-accounts'
	],
	cycle: [
		'journal-ledger',
		'trial-balance',
		'accounting-cycle',
		'adjusting-entries',
		'closing-entries'
	],
	timing: [
		'accrual-vs-cash',
		'revenue-recognition',
		'matching-principle',
		'accrual-vs-deferral',
		'deferred-revenue',
		'accrued-expense',
		'prepaid-expense'
	],
	statements: [
		'financial-statements',
		'income-statement',
		'balance-sheet',
		'cash-flow-statement',
		'statement-articulation',
		'three-statement-flow',
		'transaction-impact',
		'accounts-receivable',
		'accounts-payable',
		'working-capital'
	],
	measurement: [
		'depreciation',
		'amortization',
		'ppe',
		'capitalize-vs-expense',
		'inventory-valuation',
		'cogs',
		'bad-debts-allowance'
	],
	analysis: ['ratios-analysis', 'quality-of-earnings', 'performance-measurement'],
	frameworks: [
		'gaap-ifrs',
		'leases',
		'deferred-taxes',
		'goodwill-intangibles',
		'impairment',
		'business-combinations',
		'consolidation',
		'accounting-changes-errors',
		'audit'
	],
	capstone: [
		'month-end-close',
		'financial-reporting',
		'internal-controls',
		'segregation-of-duties',
		'bank-reconciliation',
		'cost-classification',
		'costing-systems',
		'activity-based-costing',
		'standard-costing-variance',
		'cvp-analysis',
		'budgeting',
		'transfer-pricing',
		'relevant-costing'
	]
};

/** Short bilingual part titles — mirrors `parts` in slides.generated.ts. Kept
    here so the interview route can label a part-scoped session without importing
    the (large) slides module. */
export const PART_TITLES: Record<BookPartId, { en: string; fa: string }> = {
	foundations: { en: 'Foundations', fa: 'پایه‌ها' },
	cycle: { en: 'The Accounting Cycle', fa: 'چرخهٔ حسابداری' },
	timing: { en: 'Timing & Recognition', fa: 'زمان‌بندی و شناسایی' },
	statements: { en: 'The Statements', fa: 'صورت‌های مالی' },
	measurement: { en: 'Measurement Choices', fa: 'انتخاب‌های اندازه‌گیری' },
	analysis: { en: 'Analysis', fa: 'تحلیل' },
	frameworks: { en: 'Frameworks', fa: 'چارچوب‌ها' },
	capstone: { en: 'Capstone', fa: 'جمع‌بندی' }
};

const PART_IDS = Object.keys(PART_TOPICS) as BookPartId[];

export function isBookPartId(id: string): id is BookPartId {
	return (PART_IDS as string[]).includes(id);
}

export function topicsForPart(id: string): string[] {
	return isBookPartId(id) ? PART_TOPICS[id] : [];
}
