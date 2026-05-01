import { canPronounce, primeVoices, pronounce, stopPronounce } from '$lib/audio';

const PLAY_ICON = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H2v6h4l5 4z" fill="currentColor" stroke="none" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>`;

const STOP_ICON = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" stroke="none" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>`;

/**
 * Selectors for English-text containers that should get an inline speaker
 * button. Matched relative to a slide-body root. We deliberately exclude
 * `.col-fa`, `.farsi-block`, `.farsi`, `.term-fa` — those are Persian.
 */
const ENGLISH_HEADING_SELECTOR = '.col-en h3';
const TOP_LEVEL_PARAGRAPH_SELECTOR = ':scope > p.body, :scope > p.body-lg, :scope > p.subtitle';

/** Strip Persian-bearing nodes from a clone, then return the trimmed text. */
function extractEnglishText(el: HTMLElement): string {
	const clone = el.cloneNode(true) as HTMLElement;
	clone.querySelectorAll('.col-fa, .farsi-block, .farsi, .term-fa, .inline-speaker').forEach((n) => n.remove());
	return (clone.textContent ?? '').replace(/\s+/g, ' ').trim();
}

/**
 * For an `<h3>` inside `.col-en`, gather text starting at the heading and
 * including all sibling content up to the next `<h3>` (so each section's
 * speaker reads its full passage, not just the heading line).
 */
function extractSectionText(heading: HTMLElement): string {
	const parts: string[] = [];
	let cursor: Element | null = heading;
	while (cursor) {
		parts.push(extractEnglishText(cursor as HTMLElement));
		const nextSib: Element | null = cursor.nextElementSibling;
		if (!nextSib) break;
		if (nextSib.tagName === 'H3') break;
		cursor = nextSib;
	}
	return parts.join(' ').replace(/\s+/g, ' ').trim();
}

function makeSpeakerButton(label: string): HTMLButtonElement {
	const btn = document.createElement('button');
	btn.type = 'button';
	btn.className = 'inline-speaker';
	btn.dataset.speaking = '0';
	btn.setAttribute('aria-label', label);
	btn.setAttribute('title', label);
	btn.innerHTML = PLAY_ICON;
	return btn;
}

type Options = { label: string };

export function injectSpeakers(node: HTMLElement, options: Options) {
	if (typeof window === 'undefined') return;
	if (!canPronounce()) return;
	primeVoices();

	let opts = options;
	let activeButton: HTMLButtonElement | null = null;

	function setButtonState(btn: HTMLButtonElement, speaking: boolean) {
		btn.dataset.speaking = speaking ? '1' : '0';
		btn.innerHTML = speaking ? STOP_ICON : PLAY_ICON;
		btn.setAttribute('aria-pressed', speaking ? 'true' : 'false');
	}

	function reset() {
		if (activeButton) {
			setButtonState(activeButton, false);
			activeButton = null;
		}
	}

	function inject() {
		// Top-level intro paragraphs (.body, .body-lg, .subtitle).
		for (const p of node.querySelectorAll<HTMLElement>(TOP_LEVEL_PARAGRAPH_SELECTOR)) {
			if (p.querySelector(':scope > .inline-speaker')) continue;
			const text = extractEnglishText(p);
			if (!text) continue;
			const btn = makeSpeakerButton(opts.label);
			btn.dataset.kind = 'paragraph';
			p.insertBefore(btn, p.firstChild);
		}

		// English-column section headings (.col-en h3).
		for (const h of node.querySelectorAll<HTMLElement>(ENGLISH_HEADING_SELECTOR)) {
			if (h.querySelector(':scope > .inline-speaker')) continue;
			const text = extractSectionText(h);
			if (!text) continue;
			const btn = makeSpeakerButton(opts.label);
			btn.dataset.kind = 'section';
			h.appendChild(btn);
		}
	}

	function onClick(e: Event) {
		const target = e.target as HTMLElement | null;
		if (!target) return;
		const btn = target.closest<HTMLButtonElement>('.inline-speaker');
		if (!btn || !node.contains(btn)) return;
		e.preventDefault();
		e.stopPropagation();

		if (btn.dataset.speaking === '1') {
			stopPronounce();
			setButtonState(btn, false);
			activeButton = null;
			return;
		}

		const parent = btn.parentElement;
		if (!parent) return;
		const text =
			btn.dataset.kind === 'section' ? extractSectionText(parent) : extractEnglishText(parent);
		if (!text) return;

		// Stop any previously-speaking button.
		if (activeButton && activeButton !== btn) setButtonState(activeButton, false);
		activeButton = btn;
		setButtonState(btn, true);

		pronounce(text, {
			onEnd: () => {
				if (activeButton === btn) {
					setButtonState(btn, false);
					activeButton = null;
				}
			}
		});
	}

	inject();
	node.addEventListener('click', onClick);

	return {
		update(next: Options) {
			opts = next;
			for (const btn of node.querySelectorAll<HTMLButtonElement>('.inline-speaker')) {
				btn.setAttribute('aria-label', opts.label);
				btn.setAttribute('title', opts.label);
			}
		},
		destroy() {
			node.removeEventListener('click', onClick);
			reset();
			stopPronounce();
		}
	};
}
