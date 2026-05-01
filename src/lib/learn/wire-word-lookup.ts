import { lookupWord, type LookupHit } from '$lib/data/lookup';

const SKIP_ANCESTOR_SELECTOR =
	'.col-fa, .farsi-block, .farsi, .term-fa, .label, button, a, .word-lookup, .inline-speaker';

const TOKEN_RE = /[A-Za-z][A-Za-z'’-]+/g;

type Options = {
	onTap: (hit: LookupHit, anchor: DOMRect) => void;
};

/**
 * Walks the slide DOM and wraps every English word that has a glossary or
 * lexicon entry in a `<button class="word-lookup">` so the user can tap to
 * see the definition. Persian text and existing interactive elements are
 * skipped.
 */
export function wireWordLookup(node: HTMLElement, options: Options) {
	if (typeof window === 'undefined') return;
	let opts = options;

	function shouldWrap(textNode: Text): boolean {
		const parent = textNode.parentElement;
		if (!parent) return false;
		if (parent.closest(SKIP_ANCESTOR_SELECTOR)) return false;
		return true;
	}

	function processTextNode(textNode: Text) {
		if (!shouldWrap(textNode)) return;
		const text = textNode.nodeValue ?? '';
		if (!text || !text.trim()) return;

		type Match = { start: number; end: number; original: string };
		const matches: Match[] = [];
		TOKEN_RE.lastIndex = 0;
		let m: RegExpExecArray | null;
		while ((m = TOKEN_RE.exec(text)) !== null) {
			const word = m[0];
			const hit = lookupWord(word);
			if (hit) matches.push({ start: m.index, end: m.index + word.length, original: word });
		}
		if (matches.length === 0) return;

		const frag = document.createDocumentFragment();
		let cursor = 0;
		for (const M of matches) {
			if (M.start > cursor) {
				frag.appendChild(document.createTextNode(text.slice(cursor, M.start)));
			}
			const btn = document.createElement('button');
			btn.type = 'button';
			btn.className = 'word-lookup';
			btn.dataset.word = M.original;
			btn.textContent = M.original;
			frag.appendChild(btn);
			cursor = M.end;
		}
		if (cursor < text.length) {
			frag.appendChild(document.createTextNode(text.slice(cursor)));
		}

		textNode.parentNode?.replaceChild(frag, textNode);
	}

	function inject() {
		// Collect all text nodes first, then mutate (so we don't break the walker).
		const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
		const nodes: Text[] = [];
		while (walker.nextNode()) nodes.push(walker.currentNode as Text);
		for (const n of nodes) processTextNode(n);
	}

	function onClick(e: Event) {
		const target = e.target as HTMLElement | null;
		if (!target) return;
		const btn = target.closest<HTMLButtonElement>('.word-lookup');
		if (!btn || !node.contains(btn)) return;
		e.preventDefault();
		e.stopPropagation();
		const word = btn.dataset.word ?? btn.textContent ?? '';
		const hit = lookupWord(word);
		if (!hit) return;
		opts.onTap(hit, btn.getBoundingClientRect());
	}

	inject();
	node.addEventListener('click', onClick);

	return {
		update(next: Options) {
			opts = next;
		},
		destroy() {
			node.removeEventListener('click', onClick);
		}
	};
}
