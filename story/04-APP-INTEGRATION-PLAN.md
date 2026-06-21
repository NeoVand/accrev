# 04 — APP INTEGRATION PLAN

*How "The Accrual World" becomes the fifth part of the app — a joyful,
chapter-by-chapter reader with densified glossary terms, beautiful journal
entries, follow-the-number styling, and interactive pieces. Mirrors the existing
**learn** book's proven data-pipeline architecture so it feels native.*

The app's home page already offers four parts: **Flashcards** (Practice), the
**Foundation Review book** (Learn), the **Interview**, and the **Glossary**. We add
a fifth: **Story**.

---

## Architecture decision: data pipeline (mirror `learn`), not per-route mdsvex

The `learn` book works by a build script (`scripts/build-slides.mjs`) compiling
content into `slides.generated.ts`, which routes render with `{@html body}` plus a
`use:wireWordLookup` action for glossary tap-to-define. We copy that exact shape.

**Why this over mdsvex `.svx` routes:**
- The 16 chapters are already authored as markdown in `story/chapters/` (the
  committed source of truth). Keep them there; generate a TS module from them.
- We get **glossary densification for free** — `use:wireWordLookup` scans rendered
  HTML and wraps ~730 known terms in tap-to-define buttons. No per-chapter markup.
- One reader route, not 16 hand-edited component files.
- Search, progress, and nav all reuse the learn patterns.

Long-form difference: a story chapter is ~4,000 words, so the reader is a
**comfortable single-scroll page per chapter** (a book), not one-idea-per-slide.

---

## The content pipeline

`scripts/build-story.mjs` (new) reads `story/chapters/*.md` and emits
`src/lib/story/chapters.generated.ts`. For each chapter it:

1. Parses YAML frontmatter (chapter, title, station, interview_topics_closed,
   numbers_used, characters, …).
2. Converts the markdown body to HTML (via `marked`, added as a dev dependency —
   build-time only; only the generated HTML ships).
3. **Post-processes for rich blocks:**
   - **Journal entries.** Fenced code blocks whose lines match `Dr/Cr … amount`
     become structured `<table class="journal">` with a debit column, a credit
     column, aligned tabular-nums amounts, an optional date caption, and a
     **tie-out row** (Σ debits = Σ credits, with a ✓/✗). Non-journal code blocks
     (ledgers, T-accounts) get the monospace `.ledger` treatment.
   - **Iris's Question** blockquotes → `.callout-iris` (a "controller asks" card).
   - **The Friar's Proverb** blockquotes → `.callout-friar` (a quotable seal).
   - **Iris's Margin Notes** paragraph + list → `.margin-notes` study box, with
     each interview slug linked to its glossary/interview home where possible.
   - **Widget mounts.** A fenced block ` ```widget\n<id>\n``` ` becomes
     `<div class="story-widget" data-widget="<id>"></div>`, hydrated client-side
     by the reader from a widget registry.
4. Computes `plain` (for search) + word count + reading-time estimate.
5. Drops the leading `# H1` (title comes from frontmatter / the shell).

Add `"build:story": "node scripts/build-story.mjs"` and wire it into `build`.

---

## Library (`src/lib/story/`)

- `chapters.generated.ts` — generated: `StoryChapter[]`, `chaptersBySlug`, types.
- `_data.ts` — public API (ordered chapters, the Prologue first).
- `nav.ts` — `neighbours(slug) → {prev, next}` over the 16 units.
- `widgets.ts` — registry: `widgetId → () => import(Component)` (lazy).
- `index.ts` — barrel re-exports.

## State (`src/lib/state/story-read.svelte.ts`)

Mirror `learn-read.svelte.ts`: a `$state` Set persisted to `localStorage`
(`accrev:story:read`), with `has/mark/unmark/toggle/countIn`. Powers the index
progress bar and "Mark as read."

## Routes (`src/routes/story/`)

- `/story` — **the journey index.** A short hero ("follow one transaction from a
  handshake to the 10-K"), then the 16 chapters as a vertical itinerary with
  station names, reading time, and read-checkmarks. Grouped by the three Acts.
- `/story/[slug]` (+ `+page.ts` loader) — **the reader.** `ChapterShell` (title +
  station + act + progress) → `ChapterBody` (the `{@html}` + densification +
  widget hydration) → `ChapterNav` (prev/next) → `MarkAsRead`.

## Components (`src/lib/story/components/`)

- `ChapterBody.svelte` — renders `{@html chapter.body}`; applies
  `use:wireWordLookup` (reused from learn) with `WordLookupPopover`; finds
  `[data-widget]` mounts and hydrates the registered Svelte widget into each.
- `ChapterNav.svelte` — prev/next chapter cards (reuses learn nav styling).
- `ChapterCard.svelte` — index itinerary row (station, time, read state).
- `widgets/` — the interactive pieces (see below).
- `story.css` — typography for long-form prose + journal/ledger/callout/widget
  styling, all built on the existing CSS variables and `learn-slide.css` idioms.

## Main page + i18n

- Add a **Story hero card** to `src/routes/+page.svelte` (between Glossary and
  Learn, or top — it's the new flagship), titled *The Accrual World* with a
  follow-the-number subtitle.
- Add EN/FA message keys to `src/lib/state/i18n.svelte.ts`.

---

## Interactive pieces (the "potentially interactive" part)

Each is a small Svelte component mounted at a ` ```widget ` marker in the prose,
echoing a concept the chapter just taught. They are the heart of "follow every
number." Priority order:

| Widget id | Chapter | What it does |
|---|---|---|
| `balance-scale` | 1 | Drag/change an asset; watch the A = L + E scale tip until the other side matches. The Law, felt. |
| `ssp-allocator` | 4 | Slider for the bundle price; live-splits it into License (point-in-time) + Support (over-time @ $/mo) by relative SSP. *(The source research shipped exactly this — it's the emotional centerpiece.)* |
| `fifo-lifo` | 5 | Toggle FIFO/LIFO on the carabiner lots; watch COGS, ending inventory, gross profit, and tax flip. |
| `depreciation` | 9 | Pick a method (SL/DDB/SYD/units); see the year-by-year expense curve and net book value. |
| `journal-checker` | 7 | The reader posts a Dr/Cr entry; it validates that debits = credits before accepting. |
| `cashflow-bridge` | 10 | Animated waterfall: net income → operating cash, adding back depreciation, subtracting ΔAR. |
| `three-statement` | 10 | Enter one transaction; watch it ripple across IS / BS / CF live (articulation). |

**This commit implements the pipeline end-to-end + `ssp-allocator` as the first
widget**, proving the pattern. The rest are added the same way, one component each.

---

## Build order (and what this commit does)

1. ✅ Plan (this file).
2. **Pipeline:** `build-story.mjs` + `chapters.generated.ts` + `marked` dep.
3. **Library + state:** `_data.ts`, `nav.ts`, `widgets.ts`, `story-read`.
4. **Routes + components:** `/story`, `/story/[slug]`, `ChapterBody`, `ChapterNav`,
   `ChapterCard`, `story.css`.
5. **Densification + journal/callout styling** wired and verified.
6. **First widget:** `ssp-allocator` in Ch 4.
7. **Main page card + i18n.**
8. **Verify** in the browser preview; screenshot.

Future passes (separate): the remaining widgets; a optional content-enhancement
pass to convert every ad-hoc journal block into the canonical structured form and
place widget markers; the Farsi layer (glossary already bilingual; prose later);
and an optional sticky "running ledger / follow-the-number" side panel.

---

## Accuracy & continuity guarantees carried in

- The reader renders the *exact committed prose* — no paraphrase, no drift.
- Numbers come from the locked model in `NUMBERS.md` (§11); widgets compute from
  the same anchors, so the interactive pieces and the prose always agree.
- Densified terms resolve against the existing ~730-entry glossary; the story
  inherits the app's bilingual definitions with zero new curation.
