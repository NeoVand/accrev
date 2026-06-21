// Build "The Accrual World" story chapters into a TypeScript module the app reads.
//
//   Input:  story/chapters/NN-*.md   (the committed prose — the source of truth)
//   Output: src/lib/story/chapters.generated.ts
//
// For each chapter we parse frontmatter, convert the markdown body to HTML, and
// post-process the rich accounting blocks so the reader can render them with
// proper styling:
//   • Journal entries (fenced blocks of `Dr/Cr … amount`) → a structured
//     <div class="journal"> with debit/credit columns and a tie-out row.
//   • Other fenced blocks (ledgers, schedules) → a monospace <pre class="ledger">.
//   • ```widget\n<id>\n``` → <div class="story-widget" data-widget="<id>"> mounts.
//   • "Iris's Question" / "The Friar's Proverb" blockquotes → styled callouts.
//   • "Iris's Margin Notes" + list → a study box.
//
// Re-run with: npm run build:story

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { marked } from 'marked';

const CH_DIR = 'story/chapters';
const OUT = 'src/lib/story/chapters.generated.ts';

// Three acts of the journey (see story/01-STORY-BIBLE.md §6).
const ACTS = [
	{ max: 6, act: 'I', label: 'Birth & Trials' },
	{ max: 12, act: 'II', label: 'Becoming Real' },
	{ max: 15, act: 'III', label: 'Death & Immortality' }
];
const actFor = (num) => ACTS.find((a) => num <= a.max) ?? ACTS[ACTS.length - 1];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const toNum = (s) => Number(String(s).replace(/,/g, ''));
const fmt = (n) => n.toLocaleString('en-US');

// ---- frontmatter ----------------------------------------------------------
function parseFrontmatter(raw) {
	const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
	if (!m) return { data: {}, body: raw };
	const data = {};
	for (const line of m[1].split('\n')) {
		const mm = line.match(/^(\w+):\s*(.*)$/);
		if (!mm) continue;
		const k = mm[1];
		let v = mm[2].trim();
		if (v.startsWith('[')) {
			try {
				data[k] = JSON.parse(v.replace(/'/g, '"'));
			} catch {
				data[k] = [];
			}
		} else {
			data[k] = v.replace(/^["']|["']$/g, '');
		}
	}
	return { data, body: raw.slice(m[0].length) };
}

// ---- journal entry rendering ---------------------------------------------
const looksJournal = (content) =>
	content.split('\n').some((l) => /^\s*(Dr|Cr)\b/i.test(l) && /\d/.test(l));

function renderJournal(content) {
	const lines = content
		.split('\n')
		.map((l) => l.replace(/\s+$/, ''))
		.filter((l) => l.trim() !== '');
	const rows = [];
	const captions = [];
	let dr = 0;
	let cr = 0;
	let started = false;
	for (const line of lines) {
		const t = line.trim();
		const m = t.match(/^(Dr|Cr)\s+(.*\S)$/i);
		if (m) {
			started = true;
			const side = m[1].toLowerCase() === 'dr' ? 'dr' : 'cr';
			const rest = m[2];
			const am = rest.match(/([\d][\d,]*(?:\.\d+)?)\s*$/);
			const amount = am ? am[1] : '';
			let account = am ? rest.slice(0, am.index) : rest;
			account = account.replace(/[.\s]+$/, '').trim();
			const val = amount ? toNum(amount) : 0;
			if (side === 'dr') dr += val;
			else cr += val;
			rows.push({ side, account: esc(account), amount: amount ? fmt(val) : '' });
		} else if (!started && rows.length === 0) {
			captions.push(esc(t));
		} else {
			rows.push({ label: esc(t) });
		}
	}
	const cap = captions.join(' · ');
	let html = '<div class="journal">';
	if (cap) html += `<div class="journal-cap">${cap}</div>`;
	html +=
		'<table class="journal-tbl"><thead><tr class="j-head"><td class="j-acct">Account</td><td class="j-amt">Debit</td><td class="j-amt">Credit</td></tr></thead><tbody>';
	for (const r of rows) {
		if (r.label) {
			html += `<tr class="journal-sub"><td colspan="3">${r.label}</td></tr>`;
			continue;
		}
		if (r.side === 'dr') {
			html += `<tr class="j-dr"><td class="j-acct">${r.account}</td><td class="j-amt j-amt-dr">${r.amount}</td><td class="j-amt j-amt-cr"></td></tr>`;
		} else {
			html += `<tr class="j-cr"><td class="j-acct"><span class="j-indent">${r.account}</span></td><td class="j-amt j-amt-dr"></td><td class="j-amt j-amt-cr">${r.amount}</td></tr>`;
		}
	}
	html += '</tbody>';
	const ok = Math.abs(dr - cr) < 0.005 && dr > 0;
	html += `<tfoot><tr class="j-tie ${ok ? 'j-ok' : 'j-bad'}"><td class="j-acct">${ok ? 'balanced' : 'check'}</td><td class="j-amt j-amt-dr">${fmt(dr)}</td><td class="j-amt j-amt-cr">${fmt(cr)}</td></tr></tfoot>`;
	html += '</table></div>';
	return html;
}

// A "schedule" line: a label, a run of dot/space leaders, then a (possibly
// signed / parenthesised / $-prefixed) number, then an optional trailing note.
const NUM = '[+\\-−]?\\s?\\$?\\(?[\\d,]+(?:\\.\\d+)?\\)?';
const ROW_DOTS = new RegExp(`^(.*?\\S)\\s*[.\\u2500\\u2014_-]{2,}\\s*(${NUM})(.*)$`);
const ROW_GAP = new RegExp(`^(.*?\\S)\\s{2,}(${NUM})(\\s.*)?$`);

function parseRow(rawLine) {
	const indent = (rawLine.match(/^ */) || [''])[0].length;
	const t = rawLine.trim();
	const m = t.match(ROW_DOTS) || t.match(ROW_GAP);
	if (!m) return null;
	return {
		indent,
		label: m[1].trim(),
		num: m[2].replace(/\s+/g, ' ').trim(),
		note: (m[3] || '').trim()
	};
}

const looksSchedule = (content) => {
	const lines = content.split('\n').filter((l) => l.trim());
	const rows = lines.filter((l) => parseRow(l)).length;
	return rows >= 2 && rows >= lines.length * 0.35;
};

// Render a financial schedule as responsive label/number rows (wraps cleanly on
// a phone; never overflows). Numbers right-aligned, negatives/positives tinted.
function renderSchedule(content) {
	let html = '<div class="schedule">';
	for (const raw of content.split('\n')) {
		if (!raw.trim()) {
			html += '<div class="sch-gap"></div>';
			continue;
		}
		const indent = (raw.match(/^ */) || [''])[0].length;
		const pad = ` style="padding-left:${indent * 6}px"`;
		const t = raw.trim();
		if (/^[─—_=\s-]+$/.test(t) && /[─—_=-]{3,}/.test(t)) {
			html += '<div class="sch-rule"></div>';
			continue;
		}
		const row = parseRow(raw);
		if (row) {
			const neg = /^[(−-]/.test(row.num) || /\)$/.test(row.num);
			const pos = /^\+/.test(row.num);
			const numCls = neg ? ' sch-neg' : pos ? ' sch-pos' : '';
			const total = row.label.startsWith('=');
			const note = row.note ? ` <span class="sch-note">${esc(row.note)}</span>` : '';
			html += `<div class="sch-row${total ? ' sch-total' : ''}"${pad}><span class="sch-label">${esc(row.label)}${note}</span><span class="sch-num${numCls}">${esc(row.num)}</span></div>`;
		} else {
			const head = t.endsWith(':');
			html += `<div class="sch-line${head ? ' sch-head' : ''}"${pad}>${esc(t)}</div>`;
		}
	}
	return html + '</div>';
}

// Fallback for aligned monospace that isn't a schedule (formulas, ASCII).
const renderCode = (content) =>
	`<pre class="codeblock"><code>${esc(content.replace(/\n+$/, ''))}</code></pre>`;

// ---- per-chapter build ----------------------------------------------------
function build(file) {
	const raw = readFileSync(join(CH_DIR, file), 'utf8');
	const { data, body } = parseFrontmatter(raw);

	const id = file.slice(0, 2);
	const num = Number(id);
	const slug = file.replace(/\.md$/, '');

	// Pull fenced blocks out before markdown parsing, leave placeholders.
	const blocks = [];
	const widgets = [];
	const md = body.replace(/```([^\n]*)\n([\s\S]*?)```/g, (_m, info, content) => {
		info = info.trim();
		let html;
		if (info === 'widget') {
			const wid = content.trim().split('\n')[0].trim();
			if (wid && !widgets.includes(wid)) widgets.push(wid);
			html = `<div class="story-widget" data-widget="${esc(wid)}"></div>`;
		} else if (looksJournal(content)) {
			html = renderJournal(content);
		} else if (looksSchedule(content)) {
			html = renderSchedule(content);
		} else {
			html = renderCode(content);
		}
		blocks.push(html);
		return `\n\n@@BLOCK${blocks.length - 1}@@\n\n`;
	});

	let html = marked.parse(md, { gfm: true, breaks: false });

	// Reinsert blocks (marked wraps a lone placeholder paragraph).
	html = html.replace(/<p>\s*@@BLOCK(\d+)@@\s*<\/p>/g, (_m, i) => blocks[Number(i)]);
	html = html.replace(/@@BLOCK(\d+)@@/g, (_m, i) => blocks[Number(i)]);

	// Drop the leading H1 (title lives in the chapter shell).
	html = html.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>/, '');

	// Recurring callouts. (marked escapes the apostrophe to &#39;.)
	const AP = "(?:'|’|&#39;|&#x27;)";
	html = html.replace(
		new RegExp(`<blockquote>\\s*<p>\\s*<strong>Iris${AP}s Question\\.?<\\/strong>`, 'g'),
		'<blockquote class="callout callout-iris"><p><strong class="callout-tag">Iris asks</strong> '
	);
	html = html.replace(
		new RegExp(`<blockquote>\\s*<p>\\s*<strong>The Friar${AP}s Proverb\\.?<\\/strong>`, 'g'),
		'<blockquote class="callout callout-friar"><p><strong class="callout-tag">The Friar</strong> '
	);

	// Iris's Margin Notes box (paragraph lead + the bullet list after it).
	html = html.replace(
		new RegExp(
			`<p>\\s*<strong>Iris${AP}s Margin Notes<\\/strong>([\\s\\S]*?)<\\/p>\\s*(<ul>[\\s\\S]*?<\\/ul>)`,
			'g'
		),
		(_m, lead, list) =>
			`<div class="margin-notes"><p class="mn-head"><strong>Iris&#39;s Margin Notes</strong>${lead}</p>${list}</div>`
	);

	const fullPlain = html
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
	const wordCount = fullPlain ? fullPlain.split(/\s+/).length : 0;
	const plain = fullPlain.slice(0, 6000); // search index only
	const a = actFor(num);

	return {
		slug,
		num,
		id,
		title: data.title ?? slug,
		station: data.station ?? '',
		act: a.act,
		actLabel: a.label,
		isPrologue: num === 0,
		interviewTopics: data.interview_topics_closed ?? [],
		characters: data.characters ?? [],
		numbersUsed: data.numbers_used ?? [],
		widgets,
		wordCount,
		readingMin: Math.max(1, Math.round(wordCount / 220)),
		body: html.trim(),
		plain
	};
}

// ---- main -----------------------------------------------------------------
const files = readdirSync(CH_DIR)
	.filter((f) => /^\d\d-.*\.md$/.test(f))
	.sort();
const chapters = files.map(build);

const out = `// AUTO-GENERATED from story/chapters/*.md by scripts/build-story.mjs.
// Do not edit by hand. Re-run \`npm run build:story\` to regenerate.

export type Act = 'I' | 'II' | 'III';

export interface StoryChapter {
	slug: string;
	num: number;
	id: string;
	title: string;
	station: string;
	act: Act;
	actLabel: string;
	isPrologue: boolean;
	interviewTopics: string[];
	characters: string[];
	numbersUsed: string[];
	widgets: string[];
	wordCount: number;
	readingMin: number;
	body: string;
	plain: string;
}

export const chapters: StoryChapter[] = ${JSON.stringify(chapters, null, '\t')};

export const chaptersBySlug: Record<string, StoryChapter> = Object.fromEntries(
	chapters.map((c) => [c.slug, c])
);
`;

writeFileSync(OUT, out);
console.log(
	`Wrote ${OUT} — ${chapters.length} chapters, ${chapters.reduce((a, c) => a + c.wordCount, 0).toLocaleString()} words, widgets: ${[...new Set(chapters.flatMap((c) => c.widgets))].join(', ') || 'none'}`
);
