# The Accrual World — Story Project

> A fun, story-driven mini-book that follows a single transaction from the moment
> it is born (a signed deal on a loading dock) all the way to where it lands as a
> number inside a public company's SEC Form 10-K. The goal: make the entire
> financial-accounting cycle *visible, followable, and genuinely fun* — for a
> gifted teenager or a college student who has bounced off accounting before.

This folder holds **all the planning and (eventually) all the prose** for that
mini-book. Nothing here is wired into the app yet. It is text first. Later it can
become an interactive book/game inside the app, where the reader follows every
number with animations and live inputs.

---

## Why this exists (the brief, in one breath)

Accounting is usually taught as a pile of dry rules. But an account is, at its
core, a *story* — the story of how a business breathes, fights, and survives.
This project tells that story as an actual narrative: characters, a world, a
hero's journey, jokes, stakes, and a payoff — while secretly teaching the full
accounting cycle and quietly preparing the reader for accounting interviews.

## Locked decisions (from the kickoff)

| Decision | Choice |
|---|---|
| **Language** | English prose for this pass. Structured so a Farsi layer can be added later (the app is bilingual), but no Farsi in v1. |
| **Scale** | Substantial mini-book: **15 chapters + Prologue**, ~3,500–4,500 words each, ~55–65k words total. |
| **Cast / company** | A new flagship enterprise, **Summit Software & Gear, Inc.**, rich enough to show the *whole* cycle (buys equipment, sells software bundles AND physical gear, carries debt, IPOs, files a 10-K). **Ranger Coffee Co.** (the learn deck's example company) appears as a recurring cameo and is acquired in the Merger chapter. |

## What's in this folder

```
story/
├── README.md              ← you are here (project overview + how to run it)
├── 00-OUTLINE.md          ← chapter-by-chapter outline; each chapter section
│                            doubles as a self-contained writing BRIEF
├── 01-STORY-BIBLE.md      ← the "screenplay bible": world, cast, relationship
│                            map, themes, running gags, places, style guide,
│                            continuity rules. The single creative source of truth.
├── 02-COVERAGE-MAP.md     ← chapter ↔ 56 interview topics ↔ learn-deck parts.
│                            Guarantees we touch all app content + interview prep.
├── 03-PRODUCTION-PLAN.md  ← how chapters get written in parallel by sub-agents,
│                            then consolidated. Includes the ready-to-run workflow.
├── NUMBERS.md             ← the canonical figures for Summit's first year. ONE
│                            source of numeric truth so every chapter ties out.
├── GLOSSARY.md            ← seed glossary of terms the story personifies/teaches.
├── chapters/              ← where the 16 prose files will land (1 per chapter).
│   └── _TEMPLATE.md       ← the shape every chapter file must follow.
├── workflow/
│   └── write-chapters.workflow.js  ← the fan-out + consolidation script.
└── deep_research/         ← the two source PDFs this is all built from.
    ├── Accounting Cycle_ A Transaction's Journey.pdf   (technical)
    └── Accounting Journey_ A Fun Story.pdf             (the "fun" draft)
```

## The three-phase pipeline

1. **PLAN** *(this commit)* — outline, bible, coverage map, numbers, production
   plan. Everything a sub-agent needs to write one chapter without seeing the
   others.
2. **DRAFT** *(next)* — a Workflow fans out ~16 sub-agents, each writing one
   prose unit from the shared bible + its brief, into `chapters/`.
3. **CONSOLIDATE** — a second pass harmonizes voice, verifies every callback and
   number ties out, builds the final glossary, and stitches the book together.

## How to read the plan (recommended order)

1. `01-STORY-BIBLE.md` — meet the world and cast.
2. `00-OUTLINE.md` — see the 15-chapter journey.
3. `02-COVERAGE-MAP.md` — see how it secretly covers the curriculum + interviews.
4. `NUMBERS.md` — the figures we follow end to end.
5. `03-PRODUCTION-PLAN.md` — how it gets built.

## Source material

Built from two deep-research documents (in `deep_research/`). Both share a
13-part backbone of the financial reporting cycle. The "fun" draft adds FIFO/LIFO
and Principal-vs-Agent. This project absorbs **both**, then goes much further:
adds a managerial-accounting prequel, a merger/consolidation arc, ratios &
frameworks, and a genuine emotional through-line — so the book also covers the
app's managerial and advanced interview topics that the source PDFs skip.
