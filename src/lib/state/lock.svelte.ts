import { browser } from '$app/environment';

const STORAGE_KEY = 'accrev:unlocked';
/**
 * The PIN is intentionally simple. This is not security — it's a soft door so casual
 * visitors who stumble onto the GitHub Pages URL don't immediately see Elham's content.
 * All real data lives in her browser's IndexedDB anyway.
 */
const PIN = '2026';

class LockState {
	unlocked = $state(false);
	hint = $state(false);

	constructor() {
		if (!browser) return;
		this.unlocked = localStorage.getItem(STORAGE_KEY) === '1';
	}

	unlock(input: string): boolean {
		const ok = input.trim() === PIN;
		if (ok) {
			this.unlocked = true;
			if (browser) localStorage.setItem(STORAGE_KEY, '1');
		} else {
			this.hint = true;
			setTimeout(() => (this.hint = false), 600);
		}
		return ok;
	}

	lock() {
		this.unlocked = false;
		if (browser) localStorage.removeItem(STORAGE_KEY);
	}
}

export const lock = new LockState();
