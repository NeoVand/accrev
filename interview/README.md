# Interview Question Bank

A consolidated, **bilingual (English + Persian)** bank of technical accounting interview
questions with model answers, built to power a future **mock-interview** capability in the app.

The interview feature lets a user practice answering questions out loud (or in their head),
reveal the model answer + talking points, and then **self-rate** their response — the same
rating loop used for flashcards. There is **no automated grading**; the bank simply supplies
high-quality questions, model answers, and the criteria a candidate should hit.

## Files

| File | Purpose |
| --- | --- |
| `interview-bank.json` | **The deliverable.** All 192 consolidated Q&A, bilingual, with metadata. |
| `README.md` | This document — schema, provenance, and how to update. |

> **Live copy:** the running app consumes a copy at `src/lib/data/interview-bank.json`
> (imported by `src/lib/interview/`). When you change the bank, update that copy too (or
> re-copy this file over it). The interview feature lives at the `/interview` route, with the
> home-page entry card and the `InterviewCard` component; new glossary terms surfaced by the
> questions were merged into `src/lib/data/lexicon.json`.
| `deep_research_results/` | The four original AI deep-research reports (2 Markdown, 2 PDF) plus the extracted text of the PDFs (`gemini.txt`, `grok.txt`). |
| `.build/` | Reproducibility: the consolidation workflow script and the EN→FA terminology glossary used by the translators. |

## What's in the bank

- **192 questions**, technical only (no behavioral / "tell me about yourself" content).
- Aimed at U.S. enterprise / corporate accounting roles, staff accountant through
  controller-track and cost/managerial.
- Distribution by level: **L1 = 55, L2 = 43, L3 = 52, L4 = 42**.
- 56 topics; provenance spans all four research sources.

## Schema

### Top level (`interview-bank.json`)

```jsonc
{
  "schemaVersion": "1.0.0",
  "title": "Accounting Interview Question Bank",
  "description": "...",
  "generatedAt": "2026-06-20",
  "locales": ["en", "fa"],
  "sources": [ { "id": "claude", "label": "Claude Research" }, ... ],
  "levels": [ { "level": 1, "name": {"en","fa"}, "description": {"en","fa"} }, ... ],
  "topics": [ "accounting-equation", "ratios-analysis", ... ],   // sorted unique topic keys
  "counts": { "total": 192, "byLevel": { "1": 55, "2": 43, "3": 52, "4": 42 } },
  "questions": [ /* Question[] */ ]
}
```

### Question record

The record shape intentionally mirrors the app's `Term` conventions (`src/lib/types.ts`):
a stable `slug`, `topic`, `difficulty`, `tags`, and parallel `en` / `fa` blocks — so promoting
this JSON to a typed `.ts` module later is mechanical.

```jsonc
{
  "slug": "compound-journal-entry",        // stable, unique kebab-case id
  "level": 1,                               // 1–4 difficulty band (see Levels)
  "topic": "journal-ledger",                // single topic key (controlled vocabulary)
  "difficulty": 2,                          // 1–5 fine-grained difficulty within the level
  "tags": ["journal-ledger", "double-entry"],
  "sources": ["Grok"],                      // which research report(s) this Q&A came from
  "en": {
    "question": "...",
    "answer": "...",                        // interview-ready model answer
    "talkingPoints": ["...", "..."],        // key points to hit — used for self-rating
    "interviewerLooksFor": "..."            // what a strong answer signals / is assessing
  },
  "fa": {
    "question": "...",
    "answer": "...",
    "talkingPoints": ["...", "..."],        // same count & order as en.talkingPoints
    "interviewerLooksFor": "..."
  }
}
```

Invariants (validated at build time): every record has all fields non-empty; `level ∈ 1..4`;
`difficulty ∈ 1..5`; `en.talkingPoints.length === fa.talkingPoints.length`; slugs are unique.

### Levels

| Level | Name | Audience |
| --- | --- | --- |
| 1 | Foundational | Entry-level / staff accountant (bachelor's). Equation, debits/credits, the three statements & how they connect, accrual vs. cash, adjusting concepts. |
| 2 | Intermediate / Applied | Staff → senior. Close, 5-step revenue, inventory & COGS, bad-debt allowances, reconciliations, controls, depreciation methods, transaction walk-throughs. |
| 3 | Advanced | Senior / manager / controller-track. Deferred taxes, leases, goodwill & impairment, business combinations & consolidation, deep three-statement interactions, quality of earnings, GAAP vs. IFRS. |
| 4 | Cost & Managerial | Enterprise / manufacturing. Cost classifications, job/process/ABC costing, standard costing & variance analysis, CVP, budgeting, transfer pricing, performance measurement. |

## How it was built

The four reports are **AI-generated deep research**, so the consolidation pipeline was
designed to be both exhaustive and skeptical of source errors:

1. **Extract** — four agents (one per source) pulled out *every* distinct question with a
   faithful model answer, key points, and "interviewer looks for" — one entry per question,
   nothing merged or dropped. → **280 source questions** (Claude 134, GPT-Pro 72, Gemini 18, Grok 56).
2. **Cluster / dedup** — one global agent merged only *true* duplicates into canonical
   questions (keeping similar-but-distinct separate) and assigned final level/topic/tags.
   A deterministic rescue step guaranteed no question was dropped (0 orphans). → **191 canonical**.
3. **Synthesize (EN)** — per question, the best consolidated English answer + talking points +
   difficulty, with cross-source **GAAP fact-checking**. **32 factual corrections** were applied
   where a source was wrong or incomplete (e.g. COGS must include manufacturing overhead;
   a buyer's non-recoverable sales tax is capitalized, not booked as a payable; goodwill is
   impairment-tested, not amortized, for public companies; a depreciation-method change is a
   change in estimate applied prospectively; LCNRV scope under ASU 2015-11).
4. **Translate (FA)** — high-quality, natural Persian using the app's own **658-term EN→FA
   accounting glossary** (`src/lib/data/lexicon.json` + `research-glossary.json`) for
   terminology consistency; numbers, formulas, and worked examples preserved exactly.
5. **Review** — per-group bilingual QA reviewers + a completeness/dedup critic. Coverage came
   back complete (no missing questions, no duplicate slugs). A handful of flagged issues
   (4 review issues + 1 borderline over-merge) were fixed by hand, which is why the final count
   is **192** (the over-merged `variance-analysis` was split into a separate
   `revenue-variance-decomposition` entry).

The orchestration script is `.build/consolidate.workflow.js`.

### Caveats

- Answers target **U.S. GAAP** for enterprise/corporate roles; IFRS contrasts are noted where
  relevant. They are not localized to Iranian accounting standards.
- Despite the fact-checking pass, these originate from AI research — treat the bank as a strong
  study aid, not an authoritative standard. Corrections are easy to make directly in the JSON.

## Updating the bank in the future

- **Edit in place:** the JSON is the source of truth. Add/fix records directly; keep the
  invariants above (unique slug, matching talkingPoints counts, both locales filled).
- **Re-run the pipeline:** drop new/updated reports into `deep_research_results/`, re-extract any
  PDFs to text (`pdftotext -layout`), and re-run `.build/consolidate.workflow.js`.
- **Promote to TypeScript:** when the feature is built, the shape maps 1:1 to the `Term`
  conventions, so a `src/lib/interview/` module + `InterviewQuestion` type is a mechanical lift.
  The FSRS review machinery already in the app (`ts-fsrs`) can drive scheduling if desired.
