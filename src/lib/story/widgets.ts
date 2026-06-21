import type { Component } from 'svelte';

/**
 * Registry of interactive widgets that can be mounted inside chapter prose via
 * a ` ```widget\n<id>\n``` ` marker (the build script turns it into
 * `<div class="story-widget" data-widget="<id>">`). Loaders are lazy so a
 * chapter only pays for the widgets it actually uses.
 */
export const widgetLoaders: Record<string, () => Promise<{ default: Component }>> = {
	'balance-scale': () => import('./components/widgets/BalanceScale.svelte'),
	'three-way-match': () => import('./components/widgets/ThreeWayMatch.svelte'),
	'ssp-allocator': () => import('./components/widgets/SspAllocator.svelte'),
	'fifo-lifo': () => import('./components/widgets/FifoLifo.svelte'),
	'matching-amortization': () => import('./components/widgets/MatchingAmortization.svelte'),
	'journal-checker': () => import('./components/widgets/JournalChecker.svelte'),
	'adjusting-matrix': () => import('./components/widgets/AdjustingMatrix.svelte'),
	depreciation: () => import('./components/widgets/Depreciation.svelte'),
	'cashflow-bridge': () => import('./components/widgets/CashflowBridge.svelte'),
	dupont: () => import('./components/widgets/DuPont.svelte'),
	goodwill: () => import('./components/widgets/Goodwill.svelte'),
	'closing-flow': () => import('./components/widgets/ClosingFlow.svelte'),
	'ebitda-bridge': () => import('./components/widgets/EbitdaBridge.svelte')
};

export function hasWidget(id: string): boolean {
	return id in widgetLoaders;
}
