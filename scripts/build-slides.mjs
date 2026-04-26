// Parse the Accounting Review HTML deck into a structured TypeScript module.
//
//   Input:  /Users/neo/Downloads/Accounting Review - Standalone.html
//           (already extracted to /tmp/bundle/_template.html by extract-bundle.mjs)
//   Output: src/lib/learn/slides.generated.ts
//
// The deck was designed for a 1200×1200 canvas with absolute positioning
// and large pixel font sizes. Before persisting each slide's inner HTML we
// "mobilize" it so the content can flow on a 480px-wide phone column:
//
//   • Strip `position:absolute|fixed` and the top/left/right/bottom anchors
//     that go with them.
//   • Strip large fixed widths/heights — let everything be intrinsic.
//   • Scale large pixel font-sizes down (>=50px halves; 80+ scales by 0.45).
//   • Halve large pixel paddings/margins/gaps.
//   • Trim absurd `max-width` values.
//
// The remaining structural classes (.lecture-grid, .col-en, .col-fa,
// .pitfall, .example, .farsi-block, .title, .eyebrow, .corner-mark, etc.)
// are restyled by `learn-slide.css`.

import { readFileSync, writeFileSync } from 'fs';

const html = readFileSync('/tmp/bundle/_template.html', 'utf8');
const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)[1];

const slideRe = /<section data-label="([^"]+)" class="(slide--[a-z]+)"[^>]*>([\s\S]*?)<\/section>/g;
const raw = [];
let m;
while ((m = slideRe.exec(body)) !== null) {
	raw.push({ label: m[1], variant: m[2].replace('slide--', ''), inner: m[3].trim() });
}

const parts = [
	{
		id: 'foundations',
		roman: 'I',
		title: 'Foundations',
		titleFa: 'پایه‌ها',
		blurb: 'One equation, five account types, a chart of accounts, and a two-sided ledger.',
		blurbFa: 'یک معادله، پنج نوع حساب، فهرست حساب‌ها، و دفتر دوطرفه.',
		range: '§05–10',
		dividerLabel: '04 Section I'
	},
	{
		id: 'cycle',
		roman: 'II',
		title: 'The Accounting Cycle',
		titleFa: 'چرخهٔ حسابداری',
		blurb: 'Journals, ledgers, trial balance, adjusting & closing entries.',
		blurbFa: 'دفاتر روزنامه و کل، تراز آزمایشی، ثبت‌های اصلاحی و اختتامی.',
		range: '§12–19',
		dividerLabel: '11 Section II'
	},
	{
		id: 'timing',
		roman: 'III',
		title: 'Timing & Recognition',
		titleFa: 'زمان‌بندی و شناسایی',
		blurb: 'Accrual basis, five-step revenue model, matching, deferrals.',
		blurbFa: 'مبنای تعهدی، مدل پنج‌مرحله‌ای درآمد، تطابق، انتقالی‌ها.',
		range: '§21–24',
		dividerLabel: '20 Section III'
	},
	{
		id: 'statements',
		roman: 'IV',
		title: 'The Statements',
		titleFa: 'صورت‌های مالی',
		blurb: 'BS, IS, CFS (indirect), interconnection, end-to-end mini case.',
		blurbFa: 'ترازنامه، صورت سود و زیان، صورت جریان وجوه نقد و مثال یکپارچه.',
		range: '§26–32',
		dividerLabel: '25 Section IV'
	},
	{
		id: 'measurement',
		roman: 'V',
		title: 'Measurement Choices',
		titleFa: 'انتخاب‌های اندازه‌گیری',
		blurb: 'Depreciation methods, inventory methods, bad debt allowance.',
		blurbFa: 'روش‌های استهلاک، روش‌های موجودی، ذخیرهٔ مطالبات مشکوک‌الوصول.',
		range: '§34–39',
		dividerLabel: '33 Section V'
	},
	{
		id: 'analysis',
		roman: 'VI',
		title: 'Analysis',
		titleFa: 'تحلیل',
		blurb: 'Liquidity, solvency, profitability, efficiency, DuPont decomposition.',
		blurbFa: 'نقدینگی، توان پرداخت بدهی، سودآوری، کارایی، تجزیهٔ دوپون.',
		range: '§41–45',
		dividerLabel: '40 Section VI'
	},
	{
		id: 'frameworks',
		roman: 'VII',
		title: 'Frameworks',
		titleFa: 'چارچوب‌ها',
		blurb: 'GAAP vs IFRS, the revenue standard, leases on the balance sheet.',
		blurbFa: 'مقایسهٔ GAAP و IFRS، استاندارد درآمد، اجاره‌ها در ترازنامه.',
		range: '§47–49',
		dividerLabel: '46 Section VII'
	},
	{
		id: 'capstone',
		roman: 'VIII',
		title: 'Capstone',
		titleFa: 'جمع‌بندی',
		blurb: 'Annual report end-to-end, two full problem sets with solutions.',
		blurbFa: 'مرور یک گزارش سالانهٔ کامل، همراه با دو مجموعهٔ تمرین.',
		range: '§51–60',
		dividerLabel: '51 Capstone Divider'
	}
];

function partForNum(num) {
	if (num <= 3) return 'frontmatter';
	if (num <= 10) return 'foundations';
	if (num <= 19) return 'cycle';
	if (num <= 24) return 'timing';
	if (num <= 32) return 'statements';
	if (num <= 39) return 'measurement';
	if (num <= 45) return 'analysis';
	if (num <= 49) return 'frameworks';
	return 'capstone';
}

function slugify(label) {
	return label
		.replace(/\s+/g, '-')
		.replace(/[^a-zA-Z0-9-]/g, '')
		.toLowerCase();
}

function classifyKind(num, label) {
	if (num === 1) return 'cover';
	if (num === 2) return 'contents';
	if (num === 3) return 'how-to';
	if (
		label.startsWith('04 ') ||
		label.startsWith('11 ') ||
		label.startsWith('20 ') ||
		label.startsWith('25 ') ||
		label.startsWith('33 ') ||
		label.startsWith('40 ') ||
		label.startsWith('46 ') ||
		label.startsWith('51 ')
	)
		return 'divider';
	if (num === 50) return 'glossary';
	if (num === 60) return 'close';
	return 'lecture';
}

function extractField(html, regex) {
	const r = html.match(regex);
	return r ? r[1].trim() : '';
}

function plainText(html) {
	return html
		.replace(/<script[\s\S]*?<\/script>/g, '')
		.replace(/<style[\s\S]*?<\/style>/g, '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&#?\w+;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function scaleFontSize(px) {
	// Goal: pixel sizes 11–18 (captions, labels, italic margin notes) stay
	// nearly intact so they remain legible. Body sizes 19–34 scale down to
	// 13–18. Hero/display sizes scale aggressively but are clamped so a 1200px
	// canvas heading still fits a 343px phone column.
	if (px <= 18) return px;
	if (px <= 28) return Math.round(px * 0.78); // 19→15, 22→17, 24→19, 28→22
	if (px <= 49) return Math.max(16, Math.round(px * 0.6)); // 30→18, 44→26
	if (px <= 79) return Math.max(20, Math.round(px * 0.42)); // 54→23, 72→30
	if (px <= 119) return Math.max(26, Math.round(px * 0.34)); // 88→30, 100→34
	return Math.max(30, Math.round(px * 0.26)); // 160→42, 200→52
}

function scalePadding(parts) {
	return parts
		.map((v) => {
			if (v >= 60) return Math.round(v * 0.32);
			if (v >= 30) return Math.round(v * 0.5);
			return v;
		})
		.join(' ');
}

/**
 * Tag-aware walk that converts inline `grid-template-columns` to `1fr`
 * for any element NOT nested inside a JetBrains-Mono container.
 * Tables (mono-font wrappers) keep their pixel columns intact.
 */
function stackDecorativeGrids(html) {
	const tagRe = /<\/?([a-z][a-z0-9-]*)\b[^>]*?>/gi;
	const stack = []; // entries: { tag, isMono }
	let result = '';
	let last = 0;
	let monoDepth = 0;
	let m;
	while ((m = tagRe.exec(html)) !== null) {
		result += html.slice(last, m.index);
		let tag = m[0];
		const tagName = m[1].toLowerCase();
		const selfClosing = tag.endsWith('/>') || /^(?:br|hr|img|input|meta|link)$/.test(tagName);

		if (tag.startsWith('</')) {
			// Close tag — pop matching open
			for (let i = stack.length - 1; i >= 0; i--) {
				if (stack[i].tag === tagName) {
					if (stack[i].isMono) monoDepth--;
					stack.splice(i, 1);
					break;
				}
			}
		} else {
			const styleM = tag.match(/style="([^"]*)"/i);
			const style = styleM ? styleM[1] : '';
			const isMono = /font-family\s*:\s*['"]?JetBrains Mono/i.test(style);
			const hasGridCols = /grid-template-columns\s*:/i.test(style);

			if (!selfClosing) {
				stack.push({ tag: tagName, isMono });
				if (isMono) monoDepth++;
			}

			// If we're outside any mono context AND this element opens a
			// grid-template-columns, replace its columns with `1fr`.
			const wouldBeOutsideMono = isMono ? false : monoDepth === 0;
			if (hasGridCols && wouldBeOutsideMono) {
				tag = tag.replace(
					/grid-template-columns\s*:\s*[^;"']+;?/i,
					'grid-template-columns: 1fr;'
				);
			} else if (hasGridCols && !wouldBeOutsideMono) {
				tag = tag.replace(
					/grid-template-columns\s*:\s*([^;"']+)/i,
					(_m, cols) => {
						const parts = cols.trim().split(/\s+/);
						// Symmetric 2-col mono grids (e.g. T-account
						// `110px 110px` or `1fr 1fr`) are side-by-side
						// dual sections — stack on phone.
						if (parts.length === 2 && parts[0].toLowerCase() === parts[1].toLowerCase()) {
							return 'grid-template-columns: 1fr';
						}
						// Other 2-col grids (e.g. `110px auto` for
						// date+amount pairs, asymmetric ledger lines)
						// keep their structure.
						// 3+ column grids are row-tables — convert fr units
						// to fixed px so they can't collapse in a narrow
						// scroll container.
						const fixed = parts
							.map((c) => {
								const m2 = c.match(/^(\d+(?:\.\d+)?)fr$/i);
								if (m2) return `${Math.round(parseFloat(m2[1]) * 110)}px`;
								return c;
							})
							.join(' ');
						return `grid-template-columns: ${fixed}`;
					}
				);
			}
		}

		result += tag;
		last = m.index + m[0].length;
	}
	result += html.slice(last);
	return result;
}

function mobilize(html) {
	let out = html;

	out = out.replace(/position\s*:\s*(?:absolute|fixed)\s*;?/gi, '');
	// Negative lookbehind to avoid eating `top` inside `margin-top:`,
	// or `left` inside `border-left:`, etc.
	out = out.replace(
		/(?<![a-z-])(?:top|left|right|bottom)\s*:\s*-?\d+(?:px|rem|em|%)?\s*;?/gi,
		''
	);
	out = out.replace(/(?<![a-z-])inset\s*:\s*[^;"']+;?/gi, '');

	out = out.replace(/(?<![a-z-])width\s*:\s*\d+(?:px|%)\s*;?/gi, '');
	out = out.replace(/(?<![a-z-])height\s*:\s*\d+(?:px|%)\s*;?/gi, '');
	out = out.replace(/min-height\s*:\s*[^;"']+;?/gi, '');
	out = out.replace(/max-height\s*:\s*[^;"']+;?/gi, '');
	out = out.replace(/min-width\s*:\s*\d{3,}px\s*;?/gi, '');
	out = out.replace(/max-width\s*:\s*\d+px\s*;?/gi, 'max-width:none;');

	// Editorial reset — strip every authored background, border, and
	// padding from inline styles. The deck designed these for a 1200px
	// canvas where colored cards added visual variety. On a 343px phone
	// column they create cluttered frames; we want one clean reading
	// stream with structure carried by class-based callouts only
	// (.example, .pitfall, .farsi-block — styled by learn-slide.css).
	out = out.replace(/(?<![a-z-])background[a-z-]*\s*:\s*[^;"']+;?/gi, '');
	out = out.replace(/(?<![a-z-])border[a-z-]*\s*:\s*[^;"']+;?/gi, '');
	out = out.replace(/(?<![a-z-])padding[a-z-]*\s*:\s*[^;"']+;?/gi, '');
	out = out.replace(/(?<![a-z-])box-shadow\s*:\s*[^;"']+;?/gi, '');

	// Drop `color:var(--paper|cream|cream-2)` — those were authored against
	// dark backgrounds we just removed. Let text inherit from page.
	out = out.replace(
		/(?<![a-z-])color\s*:\s*var\(--(?:paper|cream(?:-2)?)\)\s*;?/gi,
		''
	);
	// Drop opacity overrides authored against colored bg cards.
	out = out.replace(/(?<![a-z-])opacity\s*:\s*0?\.\d+\s*;?/gi, '');

	out = out.replace(/font-size\s*:\s*(\d+)px/gi, (_m, n) => `font-size:${scaleFontSize(+n)}px`);

	out = out.replace(/padding\s*:\s*([\d\s]+)px/gi, (_m, vals) => {
		const ps = vals.trim().split(/\s+/).map(Number).filter((n) => Number.isFinite(n));
		if (ps.length === 0) return _m;
		return `padding:${scalePadding(ps)}px`;
	});
	out = out.replace(/padding-(top|right|bottom|left)\s*:\s*(\d+)px/gi, (_m, side, n) => {
		const v = +n;
		const scaled = v >= 30 ? Math.round(v * 0.4) : v;
		return `padding-${side}:${scaled}px`;
	});

	out = out.replace(/margin-top\s*:\s*(\d+)px/gi, (_m, n) => {
		const v = +n;
		const scaled = v >= 24 ? Math.round(v * 0.4) : v;
		return `margin-top:${scaled}px`;
	});
	out = out.replace(/margin-bottom\s*:\s*(\d+)px/gi, (_m, n) => {
		const v = +n;
		const scaled = v >= 24 ? Math.round(v * 0.4) : v;
		return `margin-bottom:${scaled}px`;
	});
	out = out.replace(/margin\s*:\s*([\d\s]+)px/gi, (_m, vals) => {
		const ps = vals.trim().split(/\s+/).map(Number).filter((n) => Number.isFinite(n));
		if (ps.length === 0) return _m;
		return `margin:${scalePadding(ps)}px`;
	});

	out = out.replace(/gap\s*:\s*([\d\s]+)px/gi, (_m, vals) => {
		const ps = vals.trim().split(/\s+/).map(Number).filter((n) => Number.isFinite(n));
		if (ps.length === 0) return _m;
		const scaled = ps.map((v) => (v >= 30 ? Math.round(v * 0.45) : v)).join(' ');
		return `gap:${scaled}px`;
	});

	// Stack decorative grid layouts that aren't part of a monospace
	// "accountant table" (the deck's tabular journal/transaction blocks
	// keep their pixel columns intact for tabular reading). We walk tag
	// by tag, tracking whether we're inside a JetBrains-Mono context;
	// outside that context, any inline `grid-template-columns` becomes
	// a single column.
	out = stackDecorativeGrids(out);

	out = out.replace(/style="\s*;*\s*"/g, '');
	out = out.replace(/;{2,}/g, ';');

	return out;
}

const slides = raw.map((s, i) => {
	const num = i + 1;
	const inner = s.inner;

	let bodyHtml = inner.replace(/<div class="slide-num"[^>]*>[\s\S]*?<\/div>/g, '');
	bodyHtml = bodyHtml.replace(/<div class="corner-mark"[^>]*>[\s\S]*?<\/div>/g, '');

	const eyebrow = extractField(bodyHtml, /<p class="eyebrow"[^>]*>([\s\S]*?)<\/p>/);
	let title = extractField(bodyHtml, /<h2 class="title[^"]*"[^>]*>([\s\S]*?)<\/h2>/);
	if (!title) title = extractField(bodyHtml, /<h1[^>]*>([\s\S]*?)<\/h1>/);

	const titleText = plainText(title) || s.label.replace(/^\d+\s*/, '');

	const eyebrowParts = plainText(eyebrow).split('·').map((t) => t.trim());
	const eyebrowEn = eyebrowParts[0] || '';
	const eyebrowFa = eyebrowParts[1] || '';

	bodyHtml = bodyHtml
		.replace(/<p class="eyebrow"[^>]*>[\s\S]*?<\/p>/, '')
		.replace(/<h2 class="title[^"]*"[^>]*>[\s\S]*?<\/h2>/, '')
		.replace(/<h1[^>]*>[\s\S]*?<\/h1>/, '');

	const outerWrap = bodyHtml.match(/^\s*<div class="slide"[^>]*>([\s\S]*)<\/div>\s*$/);
	if (outerWrap) bodyHtml = outerWrap[1].trim();

	const mobile = mobilize(bodyHtml);

	return {
		slug: slugify(s.label),
		num,
		label: s.label,
		variant: s.variant,
		kind: classifyKind(num, s.label),
		partId: partForNum(num),
		eyebrowEn,
		eyebrowFa,
		title: titleText,
		body: mobile,
		plain: plainText(mobile).slice(0, 4000)
	};
});

const out = `// AUTO-GENERATED from "Accounting Review — Standalone.html" by scripts/build-slides.mjs.
// Do not edit by hand. Re-run the script to regenerate.

export type SlideVariant = 'paper' | 'navy' | 'tan' | 'sage' | 'ink';
export type SlideKind =
\t| 'cover'
\t| 'contents'
\t| 'how-to'
\t| 'divider'
\t| 'lecture'
\t| 'glossary'
\t| 'close';
export type PartId =
\t| 'frontmatter'
\t| 'foundations'
\t| 'cycle'
\t| 'timing'
\t| 'statements'
\t| 'measurement'
\t| 'analysis'
\t| 'frameworks'
\t| 'capstone';

export interface Slide {
\tslug: string;
\tnum: number;
\tlabel: string;
\tvariant: SlideVariant;
\tkind: SlideKind;
\tpartId: PartId;
\teyebrowEn: string;
\teyebrowFa: string;
\ttitle: string;
\tbody: string;
\tplain: string;
}

export interface Part {
\tid: Exclude<PartId, 'frontmatter'>;
\troman: string;
\ttitle: string;
\ttitleFa: string;
\tblurb: string;
\tblurbFa: string;
\trange: string;
\tdividerSlug: string;
}

export const parts: Part[] = ${JSON.stringify(
	parts.map((p) => ({
		id: p.id,
		roman: p.roman,
		title: p.title,
		titleFa: p.titleFa,
		blurb: p.blurb,
		blurbFa: p.blurbFa,
		range: p.range,
		dividerSlug: slugify(p.dividerLabel)
	})),
	null,
	'\t'
)};

export const slides: Slide[] = ${JSON.stringify(slides, null, '\t')};

export const slidesBySlug: Record<string, Slide> = Object.fromEntries(
\tslides.map((s) => [s.slug, s])
);

export const slidesByPart: Record<PartId, Slide[]> = slides.reduce(
\t(acc, s) => {
\t\t(acc[s.partId] ??= []).push(s);
\t\treturn acc;
\t},
\t{} as Record<PartId, Slide[]>
);
`;

writeFileSync('/Users/neo/repos/accrev/src/lib/learn/slides.generated.ts', out);
console.log('Wrote slides.generated.ts');
console.log('Slides:', slides.length);
console.log('Sample slugs:', slides.slice(0, 5).map((s) => s.slug));
console.log('Kinds:', [...new Set(slides.map((s) => s.kind))]);
console.log('Variants:', [...new Set(slides.map((s) => s.variant))]);
