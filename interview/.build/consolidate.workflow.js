export const meta = {
  name: 'consolidate-interview-bank',
  description: 'Consolidate 4 accounting-interview research files into one bilingual (EN+FA) Q&A bank',
  phases: [
    { title: 'Extract', detail: 'one agent per source file -> normalized Q&A' },
    { title: 'Cluster', detail: 'global dedup + canonical question registry' },
    { title: 'Synthesize', detail: 'best EN answer + talking points per question (batched)' },
    { title: 'Translate', detail: 'high-quality Persian + write batch files to disk' },
    { title: 'Review', detail: 'per-group QA + completeness critic' },
  ],
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const ROOT = '/Users/neo/repos/accrev/interview'
const SRCDIR = ROOT + '/deep_research_results'
const BUILD = ROOT + '/.build'
const GLOSSARY = BUILD + '/glossary-compact.json'

const SOURCES = [
  { key: 'claude', name: 'Claude', path: SRCDIR + '/Accounting Interview - Claude Research.md' },
  { key: 'gpt', name: 'GPT-Pro', path: SRCDIR + '/Accounting Interview - GPT-Pro Research.md' },
  { key: 'gemini', name: 'Gemini', path: SRCDIR + '/gemini.txt' },
  { key: 'grok', name: 'Grok', path: SRCDIR + '/grok.txt' },
]

const TAXONOMY = [
  'CANONICAL DIFFICULTY LEVELS (assign each question to exactly one):',
  'Level 1 - Foundational (entry / staff accountant, bachelor level): accounting equation, debits & credits, double-entry, journal vs ledger, trial balance, the three financial statements and their basic articulation, cash vs accrual, matching principle, revenue-recognition basics, adjusting & closing entries, accounting cycle, AR vs AP, deferred (unearned) revenue, accrued & prepaid items, accrual vs deferral, working capital, basic depreciation, capitalize vs expense, contra accounts, what GAAP is.',
  'Level 2 - Intermediate / Applied (staff -> senior): month-end & year-end close, revenue recognition five-step model, inventory valuation (FIFO/LIFO/weighted-average, LCNRV) and COGS, bad debts & allowance methods, bank reconciliation, internal controls & segregation of duties, depreciation methods in detail & asset disposals, the classic transaction walk-throughs (e.g. how a $10 depreciation increase flows through the three statements), basic ratios, common journal entries.',
  'Level 3 - Advanced (senior accountant / accounting manager / controller-track): deferred taxes (DTA/DTL, book-tax differences), leases (ASC 842 conceptual), goodwill, intangibles & impairment, business combinations & consolidation (conceptual), deep three-statement interconnections & transaction-impact analysis, accounting changes & error corrections, quality of earnings, advanced revenue scenarios, financial-statement / ratio analysis, GAAP vs IFRS, audit concepts.',
  'Level 4 - Cost, Managerial & Master-level (critical for enterprise/manufacturing): cost classifications (fixed/variable, direct/indirect, product/period), costing systems (job order, process, activity-based costing), standard costing & variance analysis, cost-volume-profit / breakeven, budgeting, performance measurement (ROI, residual income, balanced scorecard), transfer pricing, relevant costing & decision-making.',
  '',
  'CONTROLLED TOPIC VOCABULARY (pick the single best fit; you MAY introduce a new kebab-case topic only if none fit):',
  'accounting-equation, debits-credits, double-entry, journal-ledger, trial-balance, accounting-cycle, financial-statements, income-statement, balance-sheet, cash-flow-statement, statement-articulation, accrual-vs-cash, matching-principle, revenue-recognition, adjusting-entries, closing-entries, accounts-receivable, accounts-payable, deferred-revenue, accrued-expense, prepaid-expense, accrual-vs-deferral, working-capital, bad-debts-allowance, bank-reconciliation, internal-controls, segregation-of-duties, inventory-valuation, cogs, depreciation, amortization, ppe, capitalize-vs-expense, contra-accounts, month-end-close, financial-reporting, deferred-taxes, leases, goodwill-intangibles, impairment, business-combinations, consolidation, three-statement-flow, transaction-impact, ratios-analysis, quality-of-earnings, accounting-changes-errors, gaap-ifrs, audit, cost-classification, costing-systems, activity-based-costing, standard-costing-variance, cvp-analysis, budgeting, performance-measurement, transfer-pricing, relevant-costing.',
].join('\n')

const slugify = (s) =>
  ((s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)) || 'q'

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------
const EXTRACT_SCHEMA = {
  type: 'object',
  required: ['questions'],
  additionalProperties: false,
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        required: ['question', 'answer', 'keyPoints', 'interviewerLooksFor', 'sourceLevelNum', 'topic', 'notes'],
        additionalProperties: false,
        properties: {
          question: { type: 'string', description: 'Clean, standalone English interview question.' },
          answer: { type: 'string', description: 'Faithful, complete English model answer drawn from this source.' },
          keyPoints: { type: 'array', items: { type: 'string' }, description: 'Bullet facts the answer must hit.' },
          interviewerLooksFor: { type: 'string', description: 'What a strong answer signals / what the interviewer assesses; empty string if the source gives none.' },
          sourceLevelNum: { type: 'integer', enum: [1, 2, 3, 4] },
          topic: { type: 'string' },
          notes: { type: 'string', description: 'Caveats or suspected factual errors in the source; empty string if none.' },
        },
      },
    },
  },
}

const CLUSTER_SCHEMA = {
  type: 'object',
  required: ['canonical'],
  additionalProperties: false,
  properties: {
    canonical: {
      type: 'array',
      items: {
        type: 'object',
        required: ['slug', 'question', 'level', 'topic', 'tags', 'members'],
        additionalProperties: false,
        properties: {
          slug: { type: 'string' },
          question: { type: 'string' },
          level: { type: 'integer', enum: [1, 2, 3, 4] },
          topic: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          members: { type: 'array', items: { type: 'string' }, description: 'qids of every source question that maps here.' },
        },
      },
    },
  },
}

const SYNTH_SCHEMA = {
  type: 'object',
  required: ['entries'],
  additionalProperties: false,
  properties: {
    entries: {
      type: 'array',
      items: {
        type: 'object',
        required: ['slug', 'question', 'answer', 'talkingPoints', 'interviewerLooksFor', 'difficulty', 'tags', 'factCheckNotes'],
        additionalProperties: false,
        properties: {
          slug: { type: 'string' },
          question: { type: 'string' },
          answer: { type: 'string' },
          talkingPoints: { type: 'array', items: { type: 'string' } },
          interviewerLooksFor: { type: 'string' },
          difficulty: { type: 'integer', enum: [1, 2, 3, 4, 5] },
          tags: { type: 'array', items: { type: 'string' } },
          factCheckNotes: { type: 'string', description: 'Any AI-generated factual error found across sources and how you corrected it; empty string if none.' },
        },
      },
    },
  },
}

const TRANS_SCHEMA = {
  type: 'object',
  required: ['file', 'count', 'slugs'],
  additionalProperties: false,
  properties: {
    file: { type: 'string' },
    count: { type: 'integer' },
    slugs: { type: 'array', items: { type: 'string' } },
  },
}

const REVIEW_SCHEMA = {
  type: 'object',
  required: ['issues'],
  additionalProperties: false,
  properties: {
    issues: {
      type: 'array',
      items: {
        type: 'object',
        required: ['file', 'slug', 'severity', 'issue', 'suggestedFix'],
        additionalProperties: false,
        properties: {
          file: { type: 'string' },
          slug: { type: 'string' },
          severity: { type: 'string', enum: ['low', 'medium', 'high'] },
          issue: { type: 'string' },
          suggestedFix: { type: 'string' },
        },
      },
    },
  },
}

const CRITIC_SCHEMA = {
  type: 'object',
  required: ['missing', 'wrongMerges', 'duplicates', 'summary'],
  additionalProperties: false,
  properties: {
    missing: { type: 'array', items: { type: 'string' }, description: 'Source questions/topics not covered by any canonical entry.' },
    wrongMerges: { type: 'array', items: { type: 'string' }, description: 'Canonical entries that wrongly merged distinct questions.' },
    duplicates: { type: 'array', items: { type: 'string' }, description: 'Canonical slugs that are true duplicates of each other and should be merged.' },
    summary: { type: 'string' },
  },
}

// ---------------------------------------------------------------------------
// Prompt builders
// ---------------------------------------------------------------------------
const EXTRACT_PROMPT = (s) =>
  [
    'You are extracting accounting interview questions from ONE deep-research document.',
    'Read this file in full: ' + s.path,
    '',
    'This document is AI-generated deep research. Your job is faithful, COMPLETE extraction of every distinct interview question it contains, with a model answer for each.',
    '',
    'RULES:',
    '1. Extract EVERY distinct interview question. Do not skip any. Do not merge two questions into one. One output entry per question asked.',
    '2. Keep questions that look similar but are distinct as SEPARATE entries (e.g. "walk me through the income statement" vs "walk me through the balance sheet").',
    '3. Only technical accounting questions (this document is already technical; ignore any pure "tell me about yourself" behavioral filler if present).',
    '4. For "answer": write a faithful, complete English model answer using everything this source provides for that question. If the source separates the answer into parts (e.g. a target answer plus theoretical context), MERGE them into one coherent answer. Preserve all concrete numbers, formulas, and worked examples exactly (e.g. a "$10 depreciation" flow-through, tax-rate assumptions, FIFO/LIFO effects).',
    '5. For "keyPoints": list the 3-6 essential facts the answer must contain.',
    '6. For "interviewerLooksFor": if the source explains what a strong answer signals / what is being assessed (e.g. an "Evaluative Insight" section), capture it concisely. Otherwise use an empty string.',
    '7. For "notes": if you spot a likely factual error, internal contradiction, or dubious claim in the source, note it briefly. Otherwise empty string. Do NOT silently fix errors here; just flag.',
    '8. Strip citation markers, footnote numbers, and reference cruft (e.g. "citeturn19view0", trailing superscript numbers) from questions and answers.',
    '9. Assign sourceLevelNum (1-4) by mapping this source\'s own section/difficulty for the question onto the canonical levels below.',
    '10. Assign the single best "topic" from the controlled vocabulary below.',
    '',
    TAXONOMY,
    '',
    'Return ONLY the structured output. Be exhaustive: it is far worse to miss a question than to include a borderline one.',
  ].join('\n')

const CLUSTER_PROMPT = (list, total) =>
  [
    'You are building a canonical question registry by deduplicating ' + total + ' accounting interview questions gathered from 4 independent sources.',
    'Each line is: <qid> [L<sourceLevel>|<topic>] <question text>',
    '',
    'YOUR TASK: produce a list of CANONICAL questions. For each canonical question, list the qids of ALL source questions that map to it ("members").',
    '',
    'DEDUP RULES:',
    '- Merge into ONE canonical entry only questions that are genuinely the SAME question (same meaning, possibly different wording), even across different sources.',
    '- Keep questions that are merely SIMILAR or related but distinct as SEPARATE canonical entries. When in doubt, keep them separate. Similar-but-distinct is fine and expected.',
    '- EVERY qid must appear in exactly ONE canonical entry\'s members. Do not drop any qid. Do not invent qids that are not in the list.',
    '',
    'FOR EACH CANONICAL ENTRY:',
    '- "question": the clearest, most professional phrasing (pick the best member wording or lightly polish it).',
    '- "slug": short unique kebab-case identifier derived from the question.',
    '- "level": the canonical difficulty level 1-4 (use the level guidance below and the members\' source levels; pick the most appropriate single level).',
    '- "topic": the single best topic from the controlled vocabulary.',
    '- "tags": 2-5 useful kebab-case tags (may include the topic plus related concepts).',
    '- "members": array of qids.',
    '',
    TAXONOMY,
    '',
    'QUESTIONS:',
    list,
    '',
    'Return ONLY the structured registry. Coverage is critical: every single qid must be a member of exactly one canonical entry.',
  ].join('\n')

const SYNTH_PROMPT = (b) =>
  [
    'You are writing the definitive consolidated ENGLISH model answers for a batch of accounting interview questions.',
    'For each canonical question you are given the source material from one or more of 4 independent AI research documents (Claude, GPT-Pro, Gemini, Grok).',
    '',
    'FOR EACH canonical entry (keyed by its slug), produce:',
    '- "question": the final, polished English question (you may refine the given phrasing slightly for clarity; keep meaning).',
    '- "answer": the single best, accurate, well-structured English model answer, synthesized from ALL provided source members. Merge their strengths, remove redundancy, and make it interview-ready: correct, complete, and concise (typically 60-160 words; longer only for inherently multi-part questions like a three-statement walk-through). Preserve concrete examples, numbers, formulas, and the canonical answer ordering (for flow-through questions: Income Statement -> Cash Flow Statement -> Balance Sheet, and state the tax-rate assumption).',
    '- "talkingPoints": 3-6 crisp bullets a candidate must hit (used for self-rating after a mock answer).',
    '- "interviewerLooksFor": 1-3 sentences on what a strong answer signals and what the interviewer is really assessing.',
    '- "difficulty": integer 1-5 reflecting fine-grained difficulty WITHIN the question\'s level.',
    '- "tags": refine to 2-5 good kebab-case tags.',
    '- "factCheckNotes": these documents are AI-generated and may contain rare factual errors. If any source member contains an accounting error, an internal contradiction, or an out-of-date claim, CORRECT it in your answer and briefly describe the correction here. If everything checked out, use an empty string.',
    '',
    'ACCURACY BAR: answers must be correct under US GAAP for enterprise/corporate accounting roles. Where sources disagree, choose the GAAP-correct version. Do not introduce errors. Do not pad.',
    '',
    'You MUST return exactly one entry per provided slug, echoing each slug EXACTLY. Do not add or drop slugs.',
    '',
    'BATCH (JSON):',
    JSON.stringify(b.canon, null, 1),
    '',
    'Return ONLY the structured output.',
  ].join('\n')

const TRANS_PROMPT = (synth, b, file) => {
  const meta = {}
  b.canon.forEach((c) => {
    meta[c.slug] = { level: c.level, topic: c.topic, sources: c.sources }
  })
  return [
    'You are translating consolidated accounting interview Q&A from English into high-quality, natural, professional PERSIAN (Farsi), and then writing the finished bilingual records to a file.',
    '',
    'STEP 1 - Load terminology: read this glossary file of approved English->Persian accounting terms and use it for consistency wherever a term appears: ' + GLOSSARY,
    '',
    'STEP 2 - Translate. For EACH English entry below, translate into fluent Persian: the question, the answer, every talking point, and interviewerLooksFor.',
    'TRANSLATION RULES:',
    '- Natural, idiomatic, professional Persian as written for Iranian accounting professionals. NOT word-for-word; convey meaning clearly and correctly.',
    '- Use the glossary term for any term it covers. For terms not in the glossary, use standard Iranian accounting terminology.',
    '- Keep widely-used English acronyms (GAAP, IFRS, EBIT, FIFO, LIFO, PP&E, ASC, COGS, ROI) as-is, but you may add a short Persian gloss on first use within an answer where it aids comprehension.',
    '- Preserve ALL numbers, currency amounts, formulas, and worked examples exactly (use the same digits; do not convert currencies). Equations like "Assets = Liabilities + Equity" should appear with the Persian terms.',
    '- Do not add or omit information relative to the English. Translate the talkingPoints array item-for-item (same count, same order).',
    '',
    'STEP 3 - Assemble one record per slug with this EXACT shape:',
    '{ "slug": ..., "level": <from metadata>, "topic": <from metadata>, "difficulty": <from EN entry>, "tags": <from EN entry>, "sources": <from metadata>, "en": { "question", "answer", "talkingPoints", "interviewerLooksFor" }, "fa": { "question", "answer", "talkingPoints", "interviewerLooksFor" } }',
    'The "en" block is the English content from the entry verbatim; the "fa" block is your Persian translation.',
    '',
    'STEP 4 - Use the Write tool to write a JSON ARRAY of these records to EXACTLY this path: ' + file,
    'The file MUST be valid UTF-8 JSON (a top-level array). Ensure correct escaping of quotes and that Persian text is written literally (not unicode-escaped). Double-check the JSON parses.',
    '',
    'STEP 5 - Return the structured output { file, count, slugs } where file is the path you wrote, count is the number of records, and slugs lists every slug written.',
    '',
    'METADATA (by slug):',
    JSON.stringify(meta, null, 1),
    '',
    'ENGLISH ENTRIES (by slug):',
    JSON.stringify(synth.entries, null, 1),
  ].join('\n')
}

const REVIEW_PROMPT = (files) =>
  [
    'You are a senior bilingual (English/Persian) accounting QA reviewer. Audit the consolidated interview Q&A records in these JSON files:',
    files.join('\n'),
    '',
    'Read each file. For EACH record, check:',
    '1. English accuracy: is the answer correct under US GAAP? Any factual error, contradiction, or missing critical point?',
    '2. Persian fidelity & fluency: does fa faithfully convey en? Is it natural, professional Persian (not awkward machine translation)? Are accounting terms correct and consistent? Are numbers/formulas/examples preserved?',
    '3. Completeness: are all fields present and non-empty (question, answer, talkingPoints, interviewerLooksFor in both en and fa)? Do fa.talkingPoints match en.talkingPoints count?',
    '4. Quality: are talkingPoints genuinely useful for self-rating? Is difficulty/level sane?',
    '',
    'Report ONLY genuine problems (no praise, no nitpicks about style preference). For each, give the file, slug, severity, a concrete issue, and a concrete suggestedFix. If a file is clean, report nothing for it. Return an empty issues array if everything is fine.',
  ].join('\n')

const CRITIC_PROMPT = (sourceList, canonSummary, total, canonCount) =>
  [
    'You are a completeness & dedup critic for a consolidated accounting interview question bank.',
    'There were ' + total + ' source questions extracted from 4 documents, now consolidated into ' + canonCount + ' canonical questions.',
    '',
    'BELOW A: every source question (qid + level + topic + text).',
    'BELOW B: every canonical entry (slug | level | topic | member qids | question).',
    '',
    'Check:',
    '1. missing: are there source questions whose subject matter is NOT represented by any canonical entry? List the qid(s) and a few words each. (Members coverage should be complete, but flag any canonical that merged unrelated questions such that a topic effectively got lost.)',
    '2. wrongMerges: canonical entries that merged genuinely DISTINCT questions into one (losing a question). List the slug and why.',
    '3. duplicates: pairs/sets of canonical slugs that are actually the SAME question and should have been merged. List them.',
    'Also give a one-paragraph summary judgement of overall coverage quality.',
    '',
    'Be precise and conservative; only flag real problems.',
    '',
    'A) SOURCE QUESTIONS:',
    sourceList,
    '',
    'B) CANONICAL ENTRIES:',
    canonSummary,
  ].join('\n')

// ---------------------------------------------------------------------------
// Phase 1: Extract
// ---------------------------------------------------------------------------
phase('Extract')
const extractions = await parallel(
  SOURCES.map((s) => () =>
    agent(EXTRACT_PROMPT(s), { label: 'extract:' + s.key, phase: 'Extract', schema: EXTRACT_SCHEMA, agentType: 'general-purpose' })
  )
)

const allQuestions = []
extractions.forEach((ex, si) => {
  const s = SOURCES[si]
  const qs = ex && ex.questions ? ex.questions : []
  qs.forEach((q, qi) => {
    allQuestions.push({
      qid: s.key + '-' + String(qi + 1).padStart(3, '0'),
      source: s.name,
      question: q.question,
      answer: q.answer,
      keyPoints: q.keyPoints || [],
      interviewerLooksFor: q.interviewerLooksFor || '',
      sourceLevelNum: q.sourceLevelNum || 1,
      topic: q.topic || 'financial-statements',
      notes: q.notes || '',
    })
  })
})
const qidMap = {}
allQuestions.forEach((q) => (qidMap[q.qid] = q))
log('Extracted ' + allQuestions.length + ' questions: ' + SOURCES.map((s, i) => s.name + '=' + ((extractions[i] && extractions[i].questions ? extractions[i].questions.length : 0))).join(', '))

// ---------------------------------------------------------------------------
// Phase 2: Cluster / canonical registry
// ---------------------------------------------------------------------------
phase('Cluster')
const compactList = allQuestions
  .map((q) => q.qid + ' [L' + q.sourceLevelNum + '|' + q.topic + '] ' + q.question)
  .join('\n')
const registry = await agent(CLUSTER_PROMPT(compactList, allQuestions.length), {
  label: 'cluster:dedup',
  phase: 'Cluster',
  schema: CLUSTER_SCHEMA,
  agentType: 'general-purpose',
})
const canonical = registry && registry.canonical ? registry.canonical : []

// Coverage guarantee: auto-rescue any qid the registry failed to place.
const memberSet = new Set()
canonical.forEach((c) => (c.members || []).forEach((m) => memberSet.add(m)))
const orphans = allQuestions.filter((q) => !memberSet.has(q.qid))
orphans.forEach((q) => {
  canonical.push({
    slug: slugify(q.question),
    question: q.question,
    level: q.sourceLevelNum || 1,
    topic: q.topic || 'financial-statements',
    tags: [q.topic || 'financial-statements'],
    members: [q.qid],
  })
})
log('Canonical questions: ' + canonical.length + ' (orphans auto-rescued: ' + orphans.length + ')')

// Ensure unique slugs.
const seenSlug = {}
canonical.forEach((c) => {
  let base = slugify(c.slug || c.question)
  let s = base
  let n = 2
  while (seenSlug[s]) {
    s = base + '-' + n
    n++
  }
  seenSlug[s] = true
  c.slug = s
})

// Build full canonical objects with member source material attached.
const canonFull = canonical.map((c) => {
  const members = (c.members || [])
    .map((m) => qidMap[m])
    .filter(Boolean)
    .map((q) => ({
      source: q.source,
      question: q.question,
      answer: q.answer,
      keyPoints: q.keyPoints,
      interviewerLooksFor: q.interviewerLooksFor,
      notes: q.notes,
    }))
  return {
    slug: c.slug,
    question: c.question,
    level: c.level || 1,
    topic: c.topic || 'financial-statements',
    tags: (c.tags && c.tags.length ? c.tags : [c.topic || 'financial-statements']),
    sources: [...new Set((c.members || []).map((m) => (qidMap[m] || {}).source).filter(Boolean))],
    members: members.length ? members : [{ source: 'n/a', question: c.question, answer: '', keyPoints: [], interviewerLooksFor: '', notes: '' }],
  }
})

// Sort by level then topic for coherent batches, then chunk.
canonFull.sort((a, b) => a.level - b.level || a.topic.localeCompare(b.topic) || a.slug.localeCompare(b.slug))
const BATCH = 6
const batches = []
for (let i = 0; i < canonFull.length; i += BATCH) {
  batches.push({ idx: batches.length, canon: canonFull.slice(i, i + BATCH) })
}
log('Prepared ' + batches.length + ' batches for synthesis/translation')

// ---------------------------------------------------------------------------
// Phase 3+4: Synthesize EN, then translate FA and write batch file (pipeline)
// ---------------------------------------------------------------------------
phase('Synthesize')
const factChecks = []
const pipeResults = await pipeline(
  batches,
  async (b) => {
    const synth = await agent(SYNTH_PROMPT(b), {
      label: 'synth:b' + b.idx,
      phase: 'Synthesize',
      schema: SYNTH_SCHEMA,
      agentType: 'general-purpose',
    })
    if (synth && synth.entries) {
      synth.entries.forEach((e) => {
        if (e.factCheckNotes && e.factCheckNotes.trim()) factChecks.push({ slug: e.slug, note: e.factCheckNotes.trim() })
      })
    }
    return synth
  },
  (synth, b) => {
    const file = BUILD + '/batch-' + String(b.idx).padStart(3, '0') + '.json'
    return agent(TRANS_PROMPT(synth, b, file), {
      label: 'trans:b' + b.idx,
      phase: 'Translate',
      schema: TRANS_SCHEMA,
      agentType: 'general-purpose',
    })
  }
)
const written = pipeResults.filter(Boolean)
log('Wrote ' + written.length + ' batch files, ' + written.reduce((a, w) => a + (w.count || 0), 0) + ' records')

// ---------------------------------------------------------------------------
// Phase 5: Review (per-group QA + completeness critic)
// ---------------------------------------------------------------------------
phase('Review')
const groups = [[], [], [], []]
written.forEach((w, i) => groups[i % 4].push(w.file))
const canonSummary = canonFull
  .map((c) => c.slug + ' | L' + c.level + ' | ' + c.topic + ' | ' + c.sources.join(',') + ' | ' + c.question)
  .join('\n')
const [reviews, critic] = await Promise.all([
  parallel(
    groups
      .filter((g) => g.length)
      .map((g, gi) => () =>
        agent(REVIEW_PROMPT(g), { label: 'review:g' + gi, phase: 'Review', schema: REVIEW_SCHEMA, agentType: 'general-purpose' })
      )
  ),
  agent(CRITIC_PROMPT(compactList, canonSummary, allQuestions.length, canonFull.length), {
    label: 'completeness-critic',
    phase: 'Review',
    schema: CRITIC_SCHEMA,
    agentType: 'general-purpose',
  }),
])

// ---------------------------------------------------------------------------
// Final summary (small) back to the main loop
// ---------------------------------------------------------------------------
return {
  counts: {
    perSource: SOURCES.map((s, i) => ({ source: s.name, count: extractions[i] && extractions[i].questions ? extractions[i].questions.length : 0 })),
    totalExtracted: allQuestions.length,
    canonical: canonFull.length,
    orphansAutoRescued: orphans.length,
    batches: batches.length,
    written: written.reduce((a, w) => a + (w.count || 0), 0),
    byLevel: [1, 2, 3, 4].map((lv) => ({ level: lv, count: canonFull.filter((c) => c.level === lv).length })),
  },
  files: written.map((w) => w.file),
  factChecks,
  reviewIssues: (reviews || []).filter(Boolean).flatMap((r) => r.issues || []),
  completeness: critic || {},
}
