# 03 — PRODUCTION PLAN (Parallelize → Consolidate)

*How the 16 prose units get written by sub-agents in parallel, then stitched into
one coherent book. The plan is built so that **no drafting agent needs to see any
other agent's output** — all shared context lives in the plan files.*

---

## The shared context every drafting agent receives

Each chapter agent is told to **read these files first**, then write only its
assigned chapter:

1. `01-STORY-BIBLE.md` — voice, world, cast, themes, continuity rules.
2. `00-OUTLINE.md` — finds its own `## CHAPTER N` section = its full brief.
3. `NUMBERS.md` — the only source of figures.
4. `02-COVERAGE-MAP.md` — the interview topics it must close (its row(s)).
5. `chapters/_TEMPLATE.md` — the required output shape.

Because every cross-chapter dependency (callbacks, foreshadowing, names, numbers)
is **pre-declared in the brief**, agents stay consistent without coordination.
This is the whole point of front-loading the plan.

---

## Phase 1 — DRAFT (parallel fan-out)

- **16 agents**, one per prose unit (Prologue + Ch 1–15).
- Each runs concurrently (the workflow caps concurrency automatically).
- Each agent **writes its own file** `chapters/NN-slug.md` (distinct files → no
  write conflicts) **and returns a structured manifest** (schema below) so the
  orchestrator can later check continuity without re-reading everything.

**Drafting agent contract (returned manifest):**
```
{
  chapter: "NN",
  title: "...",
  wordCount: 0,
  charactersUsed: ["Sal","Iris",...],
  numbersUsed: ["§4 SSP allocation","§4 deferred revenue 16,500"],
  interviewTopicsClosed: ["revenue-recognition","deferred-revenue",...],
  callbacksMade: ["Ch2 price tag → Sal"],
  foreshadowsPlanted: ["Sunny 36-month arc","commission Ch6"],
  proverb: "the Friar's one-liner used",
  openingLine: "...",
  closingLine: "...",
  openIssues: ["any number it had to invent / any uncertainty for consolidation"]
}
```

The `openIssues` field is how a drafting agent flags a number it needed but
couldn't find in `NUMBERS.md` — the Numbers agent resolves these in Phase 2.

**Drafting prompt skeleton (per chapter):**
> You are writing ONE chapter of a fun, rigorous mini-book that teaches the
> accounting cycle as a story. Read `story/01-STORY-BIBLE.md`,
> `story/00-OUTLINE.md` (your brief is the `## CHAPTER N` section),
> `story/NUMBERS.md`, and `story/chapters/_TEMPLATE.md`. Match the voice in the
> bible's style guide exactly. Teach every concept in your brief accurately
> enough that a reader could answer the interview questions listed for you.
> Use only numbers from `NUMBERS.md`. Hit the required callbacks and plant the
> required foreshadowing verbatim-close to the brief. Write ~[word target] words.
> Write the chapter to `story/chapters/NN-slug.md` using the template shape, then
> return the manifest JSON.

---

## Phase 2 — CONSOLIDATE (the stitch)

Run after all drafts land. Four specialist passes; the first three can run in
parallel, then a final assembly:

1. **Numbers & Continuity agent** — reads all chapters + every manifest's
   `numbersUsed`/`openIssues`. Builds the fully tied-out three-statement model
   from `NUMBERS.md`, resolves all `openIssues`, and edits any chapter whose
   figures don't reconcile. Updates `NUMBERS.md` to the final locked model.
2. **Voice & Style harmonizer** — reads all chapters, flattens tonal drift to the
   bible's voice (catches any chapter that got too dry or too silly), standardizes
   the recurring devices (Iris's Questions, the Friar's Proverb, Iris's Margin
   Notes boxes, cliffhooks), and fixes name/term inconsistencies.
3. **Coverage Auditor** — verifies all 56 interview topics are closed to
   answer-readiness and each has exactly one teaching home (per `02-COVERAGE-MAP`).
   Emits a gap list; gaps become targeted patch tasks.
4. **Assembly & front-matter agent** — picks the final title, writes the
   table of contents, a one-page "how to read this book," the dedication/epigraph,
   and concatenates the chapters into `THE-ACCRUAL-WORLD.md` (the full manuscript),
   plus builds the final `GLOSSARY.md` from terms each chapter introduced.

**Why a barrier here:** harmonizing voice and tying out numbers genuinely need
*all* drafts at once (cross-chapter), so Phase 2 waits for Phase 1 to finish.

---

## The workflow script

A ready-to-run script lives at `story/workflow/write-chapters.workflow.js`. It is
**not run as part of producing this plan** — it is the next step, launched
explicitly when we're ready to draft. To run it later:

```
Workflow({ scriptPath: "story/workflow/write-chapters.workflow.js" })
```

It can be run in stages:
- Draft only (review chapters before consolidating), or
- Draft → consolidate end to end.

Resume support: if a run is interrupted, relaunch with
`Workflow({ scriptPath, resumeFromRunId })` — unchanged chapters return cached.

---

## Sequencing & cost notes

- **16 drafting agents** at ~3,500–4,600 words each ≈ a substantial but bounded
  run; concurrency is capped automatically (~10–16 at once).
- **Recommended:** run Phase 1, **let the user read a couple of sample chapters**
  (e.g., the Prologue, Ch 4 Labyrinth, and Ch 13 Cleansing — the emotional
  tentpoles) to confirm voice before spending the consolidation pass.
- Chapter 4 (Labyrinth) and Chapter 10 (Trinity Hall) are the densest; they are
  allowed to run longer and may warrant a higher reasoning effort.
- The two emotional tentpoles (Ch 4 split, Ch 13 closing) and the Prologue set the
  voice — consider drafting those **first as a pilot trio**, locking the voice,
  then fanning out the rest. (The script supports a `PILOT` mode flag.)

---

## Definition of done (for the whole book)

- [ ] 16 prose files in `chapters/`, each matching the template.
- [ ] All 56 interview topics closed (Coverage Auditor green).
- [ ] All numbers tie out to one locked model (Numbers agent green).
- [ ] One consistent voice (Style harmonizer green).
- [ ] `THE-ACCRUAL-WORLD.md` assembled with TOC + front matter.
- [ ] `GLOSSARY.md` complete.
- [ ] A short note on how this could become the interactive app feature (handed to
      the user for the *next* decision — out of scope for now).
