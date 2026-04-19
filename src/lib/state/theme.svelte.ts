import { browser } from '$app/environment';
import type { Theme } from '$lib/types';

const STORAGE_KEY = 'accrev:theme';

class ThemeState {
	pref = $state<Theme>('system');
	resolved = $state<'light' | 'dark'>('light');

	constructor() {
		if (!browser) return;

		const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
		if (stored === 'light' || stored === 'dark' || stored === 'system') {
			this.pref = stored;
		}

		const mql = window.matchMedia('(prefers-color-scheme: dark)');

		const apply = () => {
			const dark = this.pref === 'dark' || (this.pref === 'system' && mql.matches);
			this.resolved = dark ? 'dark' : 'light';
			document.documentElement.setAttribute('data-theme', this.resolved);
		};

		apply();
		mql.addEventListener('change', apply);

		$effect.root(() => {
			$effect(() => {
				localStorage.setItem(STORAGE_KEY, this.pref);
				apply();
			});
		});
	}

	cycle() {
		this.pref = this.pref === 'light' ? 'dark' : this.pref === 'dark' ? 'system' : 'light';
	}
}

export const theme = new ThemeState();
