import { browser } from '$app/environment';

const STORAGE_KEY = 'accrev:glossary:memorized';

type StoredShape = { keys: string[] };

function loadInitial(): Set<string> {
	if (!browser) return new Set();
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return new Set();
		const parsed = JSON.parse(raw) as StoredShape;
		if (!parsed || !Array.isArray(parsed.keys)) return new Set();
		return new Set(parsed.keys.filter((s) => typeof s === 'string'));
	} catch {
		return new Set();
	}
}

class MemorizedState {
	#keys = $state<Set<string>>(loadInitial());

	constructor() {
		if (!browser) return;
		$effect.root(() => {
			$effect(() => {
				const payload: StoredShape = { keys: [...this.#keys] };
				localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
			});
		});
		window.addEventListener('storage', (e) => {
			if (e.key !== STORAGE_KEY) return;
			this.#keys = loadInitial();
		});
	}

	has(key: string): boolean {
		return this.#keys.has(key);
	}

	mark(key: string) {
		if (this.#keys.has(key)) return;
		const next = new Set(this.#keys);
		next.add(key);
		this.#keys = next;
	}

	unmark(key: string) {
		if (!this.#keys.has(key)) return;
		const next = new Set(this.#keys);
		next.delete(key);
		this.#keys = next;
	}

	toggle(key: string) {
		if (this.has(key)) this.unmark(key);
		else this.mark(key);
	}

	get size(): number {
		return this.#keys.size;
	}
}

export const memorized = new MemorizedState();
