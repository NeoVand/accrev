export const meta = {
  name: 'accrual-world-widgets-and-art',
  description: 'Author a batch of interactive story widgets + the AI image-prompt/character project, in parallel',
  phases: [
    { title: 'Widgets', detail: 'one self-contained Svelte 5 widget per concept' },
    { title: 'Art', detail: 'art-direction + character + chapter-cover image prompts' },
  ],
}

const TOKENS = `Use ONLY these CSS variables (defined in src/app.css; they auto-handle light/dark):
--bg, --bg-soft, --bg-elevated, --ink, --ink-muted, --ink-faint, --accent, --accent-soft,
--gold, --hairline, --success, --danger, --font-serif (Fraunces), --font-sans (Inter),
--shadow-card. Numbers should use tabular-nums and ui-monospace/'JetBrains Mono' where monospace helps.`

const RULES = `HARD REQUIREMENTS:
- Svelte 5 runes ONLY: $state, $derived, $props (this widget takes NO props — it is mounted
  standalone via Svelte's mount() into a <div>). It must render and fully work on its own.
- No external libraries and no imports except (optionally) from 'svelte'. No charting libs —
  build any bars/waterfalls with divs + CSS.
- Scoped <style> only, using the design tokens below. Match the visual language, spacing, and
  polish of the template SspAllocator.svelte (read it first). Keep it compact: it renders inside
  a ~440px-wide reading column on mobile. Accessible: real <input>/<button>, labels, aria where apt.
- ACCURACY IS SACRED. Every figure must match story/NUMBERS.md exactly. Where a value is flagged
  "illustrative" in NUMBERS.md, label it illustrative in the UI too.
- First read: src/lib/story/components/widgets/SspAllocator.svelte (template), src/app.css (tokens),
  and story/NUMBERS.md (figures). Then write the component to the path given. Return the manifest.
${TOKENS}`

const WIDGETS = [
  {
    id: 'balance-scale',
    file: 'src/lib/story/components/widgets/BalanceScale.svelte',
    spec: `Interactive A = L + E balance. A visual balance beam that tips based on sign(Assets − (Liabilities + Equity)); level + "balanced ✓" when equal. Three values (Assets, Liabilities, Equity) shown with the live equation. Pre-load Summit's founding: Assets 500000 = Liabilities 0 + Equity 500000 (balanced). Provide 3 preset transaction buttons that each apply a BALANCED change and keep the beam level: "Borrow $60,000" (Assets +60000, Liabilities +60000), "Owner invests $100,000" (Assets +100000, Equity +100000), "Repay $20,000 of loan" (Assets −20000, Liabilities −20000). Also let the user nudge Assets alone with +/− to SEE the beam tip into imbalance (teaching: you cannot change one side alone). A reset button. Teach: every transaction keeps the equation in balance.`,
  },
  {
    id: 'three-way-match',
    file: 'src/lib/story/components/widgets/ThreeWayMatch.svelte',
    spec: `The three-way match gate (themed around "Tri", the bouncer). Three documents as labeled cards, each with a quantity number input: Purchase Order (ordered), Receiving Report (received), Supplier Invoice (billed). Default 1000 / 1000 / 1000. Verdict panel: if all three equal → green "MATCH — payment released" (Tri waves it through). If any differ → red "HARD LOCK — payment blocked" and a plain-English reason naming the mismatch (e.g., "Invoice bills 1000 but only 800 were received"). Teach the three-way match internal control and why it stops fraud/overpayment.`,
  },
  {
    id: 'fifo-lifo',
    file: 'src/lib/story/components/widgets/FifoLifo.svelte',
    spec: `FIFO vs LIFO on carabiner inventory. Three purchase lots (rising costs / inflation): Lot 1 = 1000 units @ $10, Lot 2 = 1000 @ $12, Lot 3 = 1000 @ $14. Controls: a slider for units sold (0–3000, step 100, default 2000) and a FIFO / LIFO toggle. Selling price $30/unit. Compute & show: units sold, revenue (units×30), COGS, ending inventory value, gross profit. FIFO consumes oldest lots first; LIFO newest first; highlight which lots are consumed. At 2000 units → FIFO: COGS 22000, ending inv 14000, gross profit 38000; LIFO: COGS 26000, ending inv 10000, gross profit 34000. Make the FIFO-vs-LIFO contrast obvious. Teach cost-flow assumptions and that under inflation LIFO raises COGS, lowers profit, lowers tax.`,
  },
  {
    id: 'matching-amortization',
    file: 'src/lib/story/components/widgets/MatchingAmortization.svelte',
    spec: `ASC 340-40 commission amortization. A $15,000 sales commission capitalized as a Deferred Contract Cost and amortized straight-line over the 36-month contract = $416.67/month. A slider for months elapsed (0–36, default 3). Show: monthly amortization ($416.67), cumulative expense recognized to date, remaining asset on the balance sheet. A horizontal bar depleting from $15,000 → $0. At month 3 → expense-to-date $1,250, asset remaining $13,750. Teach matching: spread the cost over the same period the revenue is earned, not all at once.`,
  },
  {
    id: 'journal-checker',
    file: 'src/lib/story/components/widgets/JournalChecker.svelte',
    spec: `A build-your-own journal entry validator (debits left, credits right). User adds debit lines and credit lines (each line: account name text input + amount number input; "add debit"/"add credit" buttons; lines removable). Live totals Σdebits and Σcredits, shown in a small two-column ledger. Verdict: when Σdebits === Σcredits AND both > 0 → green "Balanced — post it ✓" (the world stops tilting); otherwise red "Out of balance by $X" and disable a (decorative) "Post entry" button. Pre-seed with two rows hinting Summit's founding (Dr Cash 500000 / Cr Common Stock 500000) but let the user edit freely. Teach double-entry: debits must equal credits.`,
  },
  {
    id: 'adjusting-matrix',
    file: 'src/lib/story/components/widgets/AdjustingMatrix.svelte',
    spec: `The 2×2 adjusting-entry matrix. Rows: Revenue / Expense. Columns: "Cash first" (cash before the event) / "Cash later" (event before cash). Four clickable cells: Revenue×Cash-first = Deferred (Unearned) Revenue; Revenue×Cash-later = Accrued Revenue; Expense×Cash-first = Prepaid Expense; Expense×Cash-later = Accrued Expense. Clicking a cell reveals below: the name, a one-line description, the journal pattern (e.g., Deferred Revenue → at receipt Dr Cash / Cr Unearned Revenue; when earned Dr Unearned Revenue / Cr Revenue), and a one-line Summit example. Teach the four adjustment patterns and that each pairs an income-statement account with a balance-sheet account.`,
  },
  {
    id: 'depreciation',
    file: 'src/lib/story/components/widgets/Depreciation.svelte',
    spec: `Depreciation method comparator. Asset cost $100,000, salvage $10,000, 5-year life (depreciable base $90,000). Method selector: Straight-Line, Double-Declining Balance, Sum-of-the-Years-Digits, Units of Production. Show a 5-year bar chart (CSS bars) of annual depreciation expense for the chosen method + the Year-1 number highlighted, and the net book value at each year-end. Exact schedules: Straight-Line = 18000 every year. DDB (40% of beginning book value, floored at salvage): Y1 40000, Y2 24000, Y3 14400, Y4 8640, Y5 2960 (sums to 90000; book value ends at 10000). SYD (sum of digits 15): Y1 30000, Y2 24000, Y3 18000, Y4 12000, Y5 6000. Units of Production: rate $0.10/unit (90000/900000) — show as a note that expense tracks actual output, not time. Teach how method choice reshapes early-year expense, net income, and tax.`,
  },
  {
    id: 'cashflow-bridge',
    file: 'src/lib/story/components/widgets/CashflowBridge.svelte',
    spec: `Indirect-method cash-flow waterfall (label it "illustrative" — from NUMBERS §8). Steps: Net Income 100000 → + Depreciation 18000 (non-cash add-back, green) → − Increase in Accounts Receivable 15000 (red) → + Increase in Accounts Payable 18000 (green) → Operating Cash Flow 121000. Render a waterfall: a starting bar, floating +/− step bars (green for add, red for subtract), and an ending total bar. Let the user toggle each of the three adjustments on/off and watch the ending cash recompute. Teach why net income ≠ cash and how the statement bridges them.`,
  },
  {
    id: 'dupont',
    file: 'src/lib/story/components/widgets/DuPont.svelte',
    spec: `DuPont decomposition: ROE = Net Profit Margin × Asset Turnover × Equity Multiplier. Three sliders: Net Margin % (0–100), Asset Turnover × (0–3, step 0.01), Equity Multiplier × (1–4, step 0.01). Live ROE = margin × turnover × multiplier, shown prominently as a %. Pre-load Summit's real Year-1 figures (NUMBERS §11): net margin 50.4%, asset turnover 0.20, equity multiplier 1.17 → ROE ≈ 11.9%. Add a one-line read ("gorgeous margins, idle assets — ROE is held back by sleepy asset turnover"). A reset-to-Summit button. Teach that ROE is driven by profitability × efficiency × leverage.`,
  },
  {
    id: 'goodwill',
    file: 'src/lib/story/components/widgets/Goodwill.svelte',
    spec: `Goodwill calculator for an acquisition. Two sliders/inputs: Purchase Price and Fair Value of Net Identifiable Assets acquired. Goodwill = max(0, Price − FV). Pre-load the Ranger Coffee acquisition (NUMBERS §12): price 250000, net identifiable assets 190000 → goodwill 60000. A stacked bar showing net identifiable assets + goodwill = purchase price. An "impairment" button/slider that writes goodwill down by 20000 (per NUMBERS §12) and shows the impairment loss hitting the income statement (goodwill is tested, not amortized). Teach: goodwill is the premium paid over fair value — "the price of believing" — and it's impaired, not amortized.`,
  },
  {
    id: 'closing-flow',
    file: 'src/lib/story/components/widgets/ClosingFlow.svelte',
    spec: `Closing-entries step-through (the Great Cleansing). Show temporary accounts with balances: Revenues 133500 and Expenses 66250 (net income 67250 — from NUMBERS §11), an Income Summary (starts 0), and Retained Earnings (starts 0). Step buttons in order: (1) "Close Revenues" → Revenues → 0, Income Summary credited 133500; (2) "Close Expenses" → Expenses → 0, Income Summary debited 66250 (Income Summary now = 67250); (3) "Close Income Summary → Retained Earnings" → Income Summary → 0, Retained Earnings = 67250; show "post-closing: all temporaries are 0, only permanents carry forward." A reset button. Teach permanent vs temporary accounts and the four-step closing choreography; net income lands permanently in Retained Earnings.`,
  },
  {
    id: 'ebitda-bridge',
    file: 'src/lib/story/components/widgets/EbitdaBridge.svelte',
    spec: `Non-GAAP reconciliation waterfall — "the Flattering Mirror" (label it "illustrative" — from NUMBERS §9). Steps (all green add-backs): GAAP Net Income 15000 → + Income Tax Provision 4000 → + Interest Expense 1000 → + Depreciation & Amortization 10000 → + Stock-Based Compensation 20000 → Adjusted EBITDA 50000. Waterfall bars. Include a small Regulation G note: "GAAP net income must be shown at least as prominently as the Non-GAAP figure." Optionally toggle each add-back. Teach what gets added back to reach Adjusted EBITDA and why critics call it flattering while management calls it clarifying.`,
  },
]

// ---------------------------------------------------------------------------
phase('Widgets')
const widgetManifests = await parallel(
  WIDGETS.map((w) => () =>
    agent(
      `Write ONE interactive Svelte 5 widget component for the in-app accounting story "The Accrual World".

WIDGET: ${w.id}
WRITE IT TO: ${w.file}

WHAT IT MUST DO:
${w.spec}

${RULES}

After writing the file, return the manifest.`,
      {
        label: `widget:${w.id}`,
        phase: 'Widgets',
        schema: {
          type: 'object',
          required: ['id', 'file', 'ok'],
          properties: {
            id: { type: 'string' },
            file: { type: 'string' },
            ok: { type: 'boolean' },
            summary: { type: 'string' },
            numbersUsed: { type: 'array', items: { type: 'string' } },
            notes: { type: 'string' },
          },
        },
      }
    )
  )
)

// ---------------------------------------------------------------------------
phase('Art')
const ART_CONTEXT = `Read story/01-STORY-BIBLE.md (the world + full cast + themes), story/00-OUTLINE.md
(the 16 chapters and their stations), and src/app.css (the app's color palette: warm cream
background #fbf6ee, dusty terracotta accent #b5635a, warm gold #a88a5c, dark-plum ink #2a1f2d).
The images will be generated by a modern text-to-image model and shown inside the app to bring
the book to life. Prompts must be vivid, specific, and self-contained.`

const artManifests = await parallel([
  () =>
    agent(
      `${ART_CONTEXT}

Write story/art/STYLE.md AND story/art/README.md.
- STYLE.md: the master art direction for the whole book. Define: the illustration medium & style
  (pick one cohesive, modern, warm storybook-meets-editorial look that matches the app's palette),
  the exact color palette (tie to the app tokens above), mood, line/texture quality, lighting,
  composition defaults, aspect ratios for (a) character portraits, (b) wide chapter covers,
  (c) square spot illustrations, a reusable "STYLE SUFFIX" string to append to every prompt for
  consistency, and a NEGATIVE-PROMPT list. Keep it usable as a copy-paste system.
- README.md: how the art project is organized and how to use these prompts (which files exist,
  how to combine a subject prompt + the style suffix, naming/aspect conventions).
Return a one-line summary.`,
      { label: 'art:style', phase: 'Art' }
    ),
  () =>
    agent(
      `${ART_CONTEXT}

Write story/art/characters-core.md — the principal cast. For EACH of: Sal (the hero transaction),
Lyle (the license half), Sunny (the support half), Remy (the rookie accountant), Iris Quinn (the
controller), the Friar (Luca Pacioli, the founder-sage), and Tess & Hari (Summit's founders):
give (1) a vivid prose CHARACTER DESCRIPTION (look, age/vibe, signature props, palette, personality
signifiers — and for Sal/Lyle/Sunny, how to visually personify an abstract "transaction" as a
character), and (2) a ready-to-use IMAGE PROMPT for a portrait/reference image (subject only; note
that the global STYLE SUFFIX from STYLE.md is appended separately). Keep characters visually
distinct and consistent with the bible. Return a one-line summary.`,
      { label: 'art:characters-core', phase: 'Art' }
    ),
  () =>
    agent(
      `${ART_CONTEXT}

Write story/art/characters-forces.md — the guardians, forces, and "villains." For EACH of: Tri (the
three-way-match bouncer), the 606 Sphinx, the Allocator, Tally (the trial balance, an "honest liar"),
Father Time (depreciation), Rocky (the server-rack/equipment that ages), the Oracle of Unpaid Debts
(CECL), the Ferryman of the Summary (Income Summary), the Auditor (PCAOB), the Flattering Mirror
(Non-GAAP/Adjusted EBITDA), and Lefty & Righty (the debit & credit scribes): give (1) a vivid prose
CHARACTER DESCRIPTION and (2) a ready-to-use IMAGE PROMPT (subject only; STYLE SUFFIX appended
separately). Make each visually distinct and true to the bible. Return a one-line summary.`,
      { label: 'art:characters-forces', phase: 'Art' }
    ),
  () =>
    agent(
      `${ART_CONTEXT}

Write story/art/chapter-covers.md — one wide CHAPTER-COVER image prompt for EACH of the 16 units
(Prologue + Chapters 1–15). Each prompt should capture that chapter's station/setting and key
dramatic beat (e.g., Ch 4 = the Labyrinth where the Allocator splits Sal into Lyle and Sunny; Ch 13
= the Great Cleansing where the Ferryman carries Sal to the permanent shore). Reference the right
characters per chapter (use the cast from the bible). Each entry: chapter number + title, a one-line
scene note, then the IMAGE PROMPT (subject/scene only; STYLE SUFFIX appended separately; wide 16:9
cover aspect). Return a one-line summary.`,
      { label: 'art:chapter-covers', phase: 'Art' }
    ),
])

return {
  widgets: widgetManifests.filter(Boolean),
  art: artManifests.filter(Boolean),
}
