export const meta = {
  name: 'accrual-world-write-chapters',
  description: 'Draft all chapters of the Accrual World mini-book in parallel, then consolidate into one book',
  whenToUse: 'After the plan in story/ is approved, to write the actual prose. Run with args {pilot:true} first to lock voice on 3 tentpole chapters.',
  phases: [
    { title: 'Draft', detail: 'one agent per chapter, each writes its own chapters/NN-slug.md' },
    { title: 'Consolidate', detail: 'numbers tie-out, voice harmonize, coverage audit, assemble' },
  ],
}

// ---------------------------------------------------------------------------
// Chapter manifest. Full briefs live in story/00-OUTLINE.md; agents read them.
// `pilot:true` chapters set the voice and are drafted first when args.pilot.
// ---------------------------------------------------------------------------
const CHAPTERS = [
  { id: '00', slug: 'prologue',        title: 'Welcome to the Accrual World',                 words: 1500, pilot: true },
  { id: '01', slug: 'genesis',         title: 'The Genesis & the Law of Physics',             words: 3800 },
  { id: '02', slug: 'war-room',        title: 'The War Room (Behind the Price Tag)',          words: 4000 },
  { id: '03', slug: 'three-way-match', title: 'The Gate of the Three-Way Match',              words: 3600 },
  { id: '04', slug: 'revenue-labyrinth', title: 'The Labyrinth of Revenue',                   words: 4600, pilot: true, effort: 'high' },
  { id: '05', slug: 'inventory',       title: 'The Hall of Inventory (FIFO vs LIFO)',         words: 3600 },
  { id: '06', slug: 'matching-forge',  title: 'The Matching Forge (ASC 340-40)',              words: 3400 },
  { id: '07', slug: 'great-library',   title: 'The Great Library (Journals, Ledgers, Tally)', words: 4000 },
  { id: '08', slug: 'workshop',        title: 'The Workshop of Adjustments',                  words: 4200 },
  { id: '09', slug: 'aging-oracle',    title: 'The Aging Room & the Oracle of Unpaid Debts',  words: 4400 },
  { id: '10', slug: 'trinity-hall',    title: 'The Trinity Hall (The Financial Statements)',  words: 4600, effort: 'high' },
  { id: '11', slug: 'reading-room',    title: 'The Reading Room (Ratios, Frameworks, Fine Print)', words: 4400 },
  { id: '12', slug: 'mergers',         title: 'The Vault of Mergers',                         words: 4000 },
  { id: '13', slug: 'great-cleansing', title: 'The Great Cleansing (Closing & Reversing)',    words: 3800, pilot: true },
  { id: '14', slug: 'crucible',        title: 'The Crucible (The Independent Audit)',         words: 3800 },
  { id: '15', slug: 'public-stage',    title: 'The Public Stage (The 10-K & Recognition)',    words: 4400, effort: 'high' },
]

const MANIFEST_SCHEMA = {
  type: 'object',
  required: ['chapter', 'title', 'wordCount', 'interviewTopicsClosed', 'openIssues'],
  properties: {
    chapter: { type: 'string' },
    title: { type: 'string' },
    wordCount: { type: 'number' },
    charactersUsed: { type: 'array', items: { type: 'string' } },
    numbersUsed: { type: 'array', items: { type: 'string' } },
    interviewTopicsClosed: { type: 'array', items: { type: 'string' } },
    callbacksMade: { type: 'array', items: { type: 'string' } },
    foreshadowsPlanted: { type: 'array', items: { type: 'string' } },
    proverb: { type: 'string' },
    openingLine: { type: 'string' },
    closingLine: { type: 'string' },
    openIssues: { type: 'array', items: { type: 'string' } },
  },
}

function draftPrompt(ch) {
  return `You are writing ONE chapter of a fun, rigorous mini-book that teaches the entire
financial-accounting cycle as a story (working title: "The Accrual World").

FIRST, read these files in the repo:
  - story/01-STORY-BIBLE.md      (voice, world, cast, themes, continuity rules — obey exactly)
  - story/00-OUTLINE.md          (find the section "## CHAPTER ${ch.id}" / Prologue — that is YOUR full brief)
  - story/NUMBERS.md             (the ONLY source of figures — never invent a conflicting number)
  - story/02-COVERAGE-MAP.md     (the interview topics your chapter must teach to answer-readiness)
  - story/chapters/_TEMPLATE.md  (the required output shape)

THEN write Chapter ${ch.id}: "${ch.title}".
Requirements:
  - Match the bible's style guide voice EXACTLY: warm, witty, Pratchett/Adams-meets-great-teacher;
    reading level of a bright 16-year-old; define every term in plain words first, then use it proudly.
  - Teach every concept in your brief ACCURATELY. Accuracy beats whimsy, always.
  - Use the two layers: the mythic Accrual World scene + "Back at the Office" with Remy's real journal
    entries, with exact debits/credits and figures from NUMBERS.md.
  - Include the required recurring beats: Iris's Question(s) (the interview prep, answered in scene),
    the Friar's Proverb, an "Iris's Margin Notes" box listing the interview slugs you closed, and a cliffhook.
  - Hit the brief's required callbacks and plant its foreshadowing.
  - Target ~${ch.words} words. Use the names and numbers exactly as canon defines them.

Write the finished chapter to story/chapters/${ch.id}-${ch.slug}.md using the template's front-matter
block + prose. Then return the manifest JSON (your tool output IS the data, not a message).`
}

// ---------------------------------------------------------------------------
// PHASE 1 — DRAFT
// ---------------------------------------------------------------------------
const pilotOnly = args && args.pilot === true
const toDraft = pilotOnly ? CHAPTERS.filter(c => c.pilot) : CHAPTERS
log(`Drafting ${toDraft.length} chapter(s)${pilotOnly ? ' (PILOT: voice-lock trio)' : ''}.`)

phase('Draft')
const manifests = (await parallel(
  toDraft.map(ch => () =>
    agent(draftPrompt(ch), {
      label: `draft:${ch.id}-${ch.slug}`,
      phase: 'Draft',
      schema: MANIFEST_SCHEMA,
      effort: ch.effort,
    })
  )
)).filter(Boolean)

log(`Drafted ${manifests.length} chapter(s). Total words ≈ ${manifests.reduce((a, m) => a + (m.wordCount || 0), 0)}.`)

// In pilot mode, stop here so the human can read the trio and lock the voice.
if (pilotOnly || (args && args.draftOnly === true)) {
  return { mode: pilotOnly ? 'pilot' : 'draftOnly', manifests }
}

// ---------------------------------------------------------------------------
// PHASE 2 — CONSOLIDATE  (barrier: needs all drafts together)
// ---------------------------------------------------------------------------
phase('Consolidate')
const manifestBlob = JSON.stringify(manifests, null, 2)

const [numbers, style, coverage] = await parallel([
  () => agent(
    `You are the NUMBERS & CONTINUITY editor for the Accrual World book. Read story/NUMBERS.md and
ALL files in story/chapters/. Using these chapter manifests:\n${manifestBlob}\n
Build the fully tied-out three-statement model (income statement, balance sheet, cash flow) for Summit
from the NUMBERS.md anchors. Resolve every "openIssues" item. EDIT any chapter file whose figures don't
reconcile so the whole book ties to one model. Update story/NUMBERS.md to the final locked model.
Return a short report of what you changed and confirmation that all statements articulate.`,
    { label: 'consolidate:numbers', phase: 'Consolidate', effort: 'high' }
  ),
  () => agent(
    `You are the VOICE & STYLE harmonizer for the Accrual World book. Read story/01-STORY-BIBLE.md (style
guide) and ALL files in story/chapters/. Edit chapters in place to flatten tonal drift to the bible's
voice, standardize the recurring devices (Iris's Question, the Friar's Proverb, Iris's Margin Notes box,
cliffhooks), and fix any character-name or term inconsistencies against the bible's cast list.
Return a short report of the drift you corrected.`,
    { label: 'consolidate:style', phase: 'Consolidate' }
  ),
  () => agent(
    `You are the COVERAGE AUDITOR for the Accrual World book. Read story/02-COVERAGE-MAP.md and ALL files
in story/chapters/. Verify all 56 interview topics are taught to answer-readiness in their home chapter
and that Iris's Margin Notes collectively reference every topic. Return a JSON list of any GAPS
(topic slug + which chapter should cover it) so they can be patched. If complete, say so explicitly.`,
    { label: 'consolidate:coverage', phase: 'Consolidate', schema: {
      type: 'object', required: ['complete', 'gaps'],
      properties: { complete: { type: 'boolean' }, gaps: { type: 'array', items: { type: 'object' } } } } }
  ),
])

// Final assembly (after the three editors) — concatenate + front matter + glossary.
const assembly = await agent(
  `You are the ASSEMBLY editor for the Accrual World book. The chapters in story/chapters/ are now
numbers-checked, voice-harmonized, and coverage-audited. Do the following:
  1. Pick the final title (candidates in story/01-STORY-BIBLE.md §10) and write a one-page front matter
     (title, subtitle, epigraph = the Friar's Law, the dedication joke, a 'how to read this book' note).
  2. Write a table of contents listing all 16 prose units with their station names.
  3. Concatenate Prologue + Ch 1–15 (in order) into story/THE-ACCRUAL-WORLD.md with the front matter and TOC on top.
  4. Complete story/GLOSSARY.md from terms the finished chapters actually introduce.
Return a short summary: final title chosen, total word count, and anything still open.`,
  { label: 'consolidate:assembly', phase: 'Consolidate', effort: 'high' }
)

return { manifests, consolidation: { numbers, style, coverage, assembly } }
