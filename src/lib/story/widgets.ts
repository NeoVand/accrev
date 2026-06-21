import type { Component } from 'svelte';

/**
 * Registry of interactive widgets that can be mounted inside chapter prose via
 * a ` ```widget\n<id>\n``` ` marker (the build script turns it into
 * `<div class="story-widget" data-widget="<id>">`). Loaders are lazy so a
 * chapter only pays for the widgets it actually uses.
 */
export const widgetLoaders: Record<string, () => Promise<{ default: Component }>> = {
	'ssp-allocator': () => import('./components/widgets/SspAllocator.svelte')
};

export function hasWidget(id: string): boolean {
	return id in widgetLoaders;
}
