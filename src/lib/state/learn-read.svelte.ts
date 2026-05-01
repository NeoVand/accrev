import { browser } from '$app/environment';

const STORAGE_KEY = 'accrev:learn:read';

type StoredShape = { slugs: string[] };

function loadInitial(): Set<string> {
	if (!browser) return new Set();
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return new Set();
		const parsed = JSON.parse(raw) as StoredShape;
		if (!parsed || !Array.isArray(parsed.slugs)) return new Set();
		return new Set(parsed.slugs.filter((s) => typeof s === 'string'));
	} catch {
		return new Set();
	}
}

class LearnReadState {
	#slugs = $state<Set<string>>(loadInitial());

	constructor() {
		if (!browser) return;
		$effect.root(() => {
			$effect(() => {
				const payload: StoredShape = { slugs: [...this.#slugs] };
				localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
			});
		});

		// Cross-tab sync: if another tab marks/unmarks, mirror it here.
		window.addEventListener('storage', (e) => {
			if (e.key !== STORAGE_KEY) return;
			this.#slugs = loadInitial();
		});
	}

	has(slug: string): boolean {
		return this.#slugs.has(slug);
	}

	mark(slug: string) {
		if (this.#slugs.has(slug)) return;
		const next = new Set(this.#slugs);
		next.add(slug);
		this.#slugs = next;
	}

	unmark(slug: string) {
		if (!this.#slugs.has(slug)) return;
		const next = new Set(this.#slugs);
		next.delete(slug);
		this.#slugs = next;
	}

	toggle(slug: string) {
		if (this.has(slug)) this.unmark(slug);
		else this.mark(slug);
	}

	countIn(slugs: readonly string[]): number {
		let n = 0;
		for (const s of slugs) if (this.#slugs.has(s)) n++;
		return n;
	}
}

export const learnRead = new LearnReadState();
