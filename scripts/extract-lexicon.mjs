// Extract unique English vocabulary from the Learn-section slides so we can
// hand-write a Persian gloss + short definition for each.
//
//   Input:  src/lib/learn/slides.generated.ts (slide.plain text)
//           src/lib/data/research-glossary.json + curated entries (already covered)
//   Output: scripts/lexicon-targets.txt — one lowercased lemma per line.
//
// Run with:  node scripts/extract-lexicon.mjs
//
// We deliberately do NOT auto-translate. The output is a list of lemmas that
// need definitions. Phase 3b adds those definitions in src/lib/data/lexicon.json.

import { readFileSync, writeFileSync } from 'fs';

const slidesSrc = readFileSync('src/lib/learn/slides.generated.ts', 'utf8');
const glossarySrc = readFileSync('src/lib/data/glossary.ts', 'utf8');
const research = JSON.parse(readFileSync('src/lib/data/research-glossary.json', 'utf8'));

// Pull every "plain": "..." string from the generated slides file.
const plainRe = /"plain":\s*"((?:[^"\\]|\\.)*)"/g;
let plainCorpus = '';
let m;
while ((m = plainRe.exec(slidesSrc)) !== null) {
	// Unescape JSON-style quotes/backslashes/newlines.
	plainCorpus += ' ' + m[1].replace(/\\"/g, '"').replace(/\\n/g, ' ').replace(/\\\\/g, '\\');
}

// Strip Persian/Arabic chars and common punctuation we don't want in tokens.
const stripped = plainCorpus
	.replace(/[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/g, ' ')
	.replace(/[‌‍‎‏]/g, ' ')
	.replace(/[\d]/g, ' ');

const tokenRe = /[A-Za-z][A-Za-z'’-]+/g;
const counts = new Map();
let tok;
while ((tok = tokenRe.exec(stripped)) !== null) {
	const w = tok[0].toLowerCase().replace(/[’]/g, "'");
	counts.set(w, (counts.get(w) ?? 0) + 1);
}

// Stopwords + ultra-trivial vocabulary. We don't want lookups for "the",
// "a", "is", function words, or extreme basics like "and", "this".
const stop = new Set(`
a an the and or but if so as at by for from in into of on onto out over per to up
upon via with without within
i me my mine you your yours he him his she her hers it its we us our ours they them their theirs
this that these those there here where when why how what who whom whose which
am is are was were be been being do does did doing have has had having can could may might
must shall should will would
not no nor only just also too still yet then than thus hence
all any both each every few more most other own same some such enough
about across after against along among around because before behind below beneath beside between
beyond down during except inside near off outside since though through throughout till until under
underneath unless toward towards underneath upon
one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen
twenty thirty forty fifty sixty seventy eighty ninety hundred thousand million billion
mr mrs ms dr sir madam
let lets etc et al
`.split(/\s+/).filter(Boolean));

// Words already covered by glossary entries (and their acronyms).
const covered = new Set();
function addCovered(s) {
	if (!s) return;
	covered.add(s.toLowerCase().trim());
}
for (const entry of research) {
	addCovered(entry.en?.term);
	addCovered(entry.en?.acronym);
}
// Also pull enTerm: '...' / enAcronym: '...' from the curated TS file via simple regex.
for (const reMatch of glossarySrc.matchAll(/enTerm:\s*'([^']+)'/g)) addCovered(reMatch[1]);
for (const reMatch of glossarySrc.matchAll(/enAcronym:\s*'([^']+)'/g)) addCovered(reMatch[1]);

// Conservative lemmatization for *deduping the target list only*: collapse
// plurals and possessives onto a base form, but leave -ing/-ed/-er/-est
// alone (they often produce nonsensical stems like "expens" or "operat").
// Runtime lookupWord() handles those forms via a separate fallback list.
function lemma(w) {
	if (w.endsWith("'s")) return w.slice(0, -2);
	if (w.endsWith('ies') && w.length > 4) return w.slice(0, -3) + 'y';
	if (w.endsWith('sses') && w.length > 5) return w.slice(0, -2);
	if (w.endsWith('es') && w.length > 3 && !w.endsWith('ses')) return w.slice(0, -1); // expenses → expense
	if (w.endsWith('s') && w.length > 2 && !w.endsWith('ss') && !w.endsWith('us')) return w.slice(0, -1);
	return w;
}

// Combine token counts onto lemmas; track the most common surface form so we
// can write the lemma in the dictionary the way the book actually uses it.
const lemmaCounts = new Map();
const lemmaSamples = new Map();
for (const [w, c] of counts) {
	if (stop.has(w)) continue;
	if (w.length <= 2) continue;
	if (covered.has(w)) continue;
	const L = lemma(w);
	if (covered.has(L)) continue;
	if (stop.has(L)) continue;
	lemmaCounts.set(L, (lemmaCounts.get(L) ?? 0) + c);
	const samp = lemmaSamples.get(L);
	if (!samp || (counts.get(samp) ?? 0) < c) lemmaSamples.set(L, w);
}

const sorted = [...lemmaCounts.entries()].sort((a, b) => b[1] - a[1]);

let out = `# Lexicon targets — ${sorted.length} unique lemmas, sorted by frequency.\n`;
out += `# Each line: <lemma> <count> [most-common-surface-form]\n`;
for (const [L, c] of sorted) {
	const samp = lemmaSamples.get(L);
	const note = samp && samp !== L ? `  # appears as: ${samp}` : '';
	out += `${L}\t${c}${note}\n`;
}

writeFileSync('scripts/lexicon-targets.txt', out);
console.log(`Wrote scripts/lexicon-targets.txt — ${sorted.length} lemmas`);
console.log(`Top 30:`);
for (const [L, c] of sorted.slice(0, 30)) {
	console.log(`  ${L.padEnd(20)} ${c}`);
}
