# NUMBERS.md — The One Source of Numeric Truth

> Every chapter pulls its figures from this file. If a chapter needs a number,
> it must use the number here — never invent a conflicting one. A dedicated
> **Numbers & Continuity** agent in the consolidation phase builds the fully
> tied-out three statements from these anchors and corrects any drift.
>
> Status: **v1.0 — LOCKED & TIED OUT.** The full three-statement model (every
> line of IS / BS / CF reconciling to the penny, all three statements
> articulating) is finalized below in **§11**. The original anchors (§1–§7) are
> unchanged; §8 and §9 are now explicitly flagged as *illustrative teaching
> examples* that intentionally use round numbers ($100,000 and $15,000 net
> income) and are **not** Summit's real net income — every chapter that uses them
> labels them illustrative. Summit's **real Year-1 net income is $67,250** (§11).
> §12 locks the illustrative Ranger acquisition figures and the statutory tax
> rate. Every chapter has been reconciled to this one model.

The company: **Summit Software & Gear, Inc.** ("Summit"). Ticker after IPO:
**SMMT**. First fiscal year: **2026** (calendar year). Currency: USD.

Summit has two product lines, which is the whole reason it can teach everything:
- **TrailHead Pro** — a software platform sold as a *bundle* (perpetual license +
  multi-year support). This is the ASC 606 engine.
- **Gear** — physical climbing hardware (carabiners, ropes). This is the
  inventory / COGS / FIFO-LIFO engine.

---

## 1. Founding (Chapter 1 — Genesis)

| Event | Entry | Effect |
|---|---|---|
| Founders Tess & Hari invest cash | **Dr Cash 500,000 · Cr Common Stock 500,000** | Assets +500,000; Equity +500,000 |

The accounting equation after founding: **Assets 500,000 = Liabilities 0 + Equity 500,000.** ✔

---

## 2. Equipment & depreciation (Chapters 3, 9 — the server racks "Rocky")

Summit buys server racks + a small manufacturing press.

- **Cost: $100,000. Salvage value: $10,000. Useful life: 5 years.**
- Paid **$40,000 cash + $60,000 note payable** (creates a liability + interest).
- **Depreciable base = 100,000 − 10,000 = $90,000.**

The books use **Straight-Line**. The other three methods are taught as
"what-ifs" Rocky could have lived, using the *same* asset:

| Method | Year 1 | Year 2 | Note |
|---|---|---|---|
| **Straight-Line** (used in books) | **$18,000** | $18,000 | 90,000 / 5 |
| Double-Declining Balance | $40,000 | $24,000 | rate = 2 × (1/5) = 40%; never below salvage |
| Sum-of-the-Years-Digits | $30,000 | $24,000 | digits 5+4+3+2+1 = 15; Y1 = 5/15 × 90,000 |
| Units of Production | variable | variable | rate $0.10/widget (90,000 / 900,000 units) |

Books, end of Year 1: **Depreciation Expense 18,000; Accumulated Depreciation 18,000;** equipment net book value **$82,000**.

> **Note on the $60,000 note payable's interest (resolves Ch 3 open issue):** the
> locked §11 core model recognizes **no Year-1 interest expense** — the note is
> treated as signed late enough that no material interest is accrued in Year 1, so
> the cash trail and A = L + E close cleanly without an interest line. Ch 3's
> "quietly ticking with interest" is *narrative foreshadow only*, not a booked
> figure. The $1,000 interest in §9's EBITDA bridge is an **illustrative**
> teaching number, not Summit's real Year-1 interest. No chapter books interest
> into the core statements; if a future year does, add the rate/amount here first.

---

## 3. Prepaid insurance (Chapters 6, 8 — a deferral)

- Paid **$12,000 on Oct 1, 2026** for 12 months of coverage ($1,000/month).
- By Dec 31: **3 months consumed.**
- Year-1 **Insurance Expense = $3,000**; **Prepaid Insurance asset = $9,000** at year-end.

```
Oct 1:  Dr Prepaid Insurance 12,000 · Cr Cash 12,000
Dec 31: Dr Insurance Expense  3,000 · Cr Prepaid Insurance 3,000
```

---

## 4. The hero deal "Sal" — the $90,000 bundle (Chapters 4, 8 — ASC 606)

Summit sells Atlas Corp a TrailHead Pro bundle, signed **Oct 1, 2026**. Atlas
pays the full **$90,000 cash up front**.

**Standalone selling prices (SSP):**
| Component | SSP | % of total |
|---|---|---|
| Software license (Lyle) | $80,000 | 80% |
| 3-year support (Sunny) | $20,000 | 20% |
| **Total unbundled** | **$100,000** | 100% |

Negotiated bundle price: **$90,000** (a $10,000 discount). The discount is
allocated by relative SSP:
- **License (Lyle): 80% × 90,000 = $72,000** — recognized **at a point in time** (delivered Day 1).
- **Support (Sunny): 20% × 90,000 = $18,000** — recognized **over time**, $18,000 / 36 = **$500/month**.

**Deferred revenue schedule (Sunny):** signed Oct 1 → by Dec 31, **3 months earned**.
- Support revenue recognized in Year 1: **3 × $500 = $1,500.**
- **Deferred Revenue (liability) at Dec 31 = $16,500.**

**Sal's Year-1 revenue contribution = 72,000 + 1,500 = $73,500.**

```
Oct 1:  Dr Cash 90,000 · Cr License Revenue 72,000 · Cr Deferred Revenue 18,000
Each mo: Dr Deferred Revenue 500 · Cr Support Revenue 500
```

**Principal vs Agent (Chapter 4):** Summit controls the software before transfer →
**principal** → reports the **gross** $72,000. If a third-party contractor ran the
support and Summit didn't control it, Summit would be an **agent** on that piece
and report only its **net** fee. (Used as a fork in the Labyrinth, not in the books.)

---

## 5. Gear sales, inventory & COGS "the Lots" (Chapter 5 — FIFO/LIFO)

Summit buys carabiners in three lots at rising prices (inflation):

| Lot | Units | Unit cost | Total |
|---|---|---|---|
| Lot 1 (oldest) | 1,000 | $10 | $10,000 |
| Lot 2 | 1,000 | $12 | $12,000 |
| Lot 3 (newest) | 1,000 | $14 | $14,000 |

Summit **sells 2,000 units** at **$30 each → Gear revenue $60,000**, all on
account (Net-30) → creates **Accounts Receivable $60,000**, of which **$45,000 is
collected** by year-end and **$15,000 remains in AR**.

| | FIFO (used in books) | LIFO (contrast) |
|---|---|---|
| COGS (2,000 units) | 1,000×10 + 1,000×12 = **$22,000** | 1,000×14 + 1,000×12 = **$26,000** |
| Ending inventory (1,000 units) | 1,000×14 = **$14,000** | 1,000×10 = **$10,000** |
| Gross profit on gear | 60,000 − 22,000 = **$38,000** | 60,000 − 26,000 = $34,000 |

Books use **FIFO**: **COGS 22,000; Ending Inventory 14,000.**

---

## 6. Sales commission "the Bonus" (Chapter 6 — ASC 340-40)

- Salesperson earns a **$15,000 commission** for landing Sal's deal.
- Capitalized as a **Deferred Contract Cost asset**, amortized over the 36-month
  contract → **$15,000 / 36 = $416.67/month**.
- Year-1 amortization (Oct–Dec, 3 months) = **$1,250**; asset remaining **$13,750**.

```
Oct 1:  Dr Deferred Contract Cost 15,000 · Cr Cash 15,000
Each mo: Dr Commission Amortization Exp 416.67 · Cr Deferred Contract Cost 416.67
```

---

## 7. Year-end adjustments (Chapters 8, 9)

| Adjustment | Entry | Notes |
|---|---|---|
| **Accrued wages** (reversing-entry demo) | Dr Wage Expense 18,000 · Cr Wages Payable 18,000 | Last days of Dec earned, paid Jan. Reversed Jan 1. |
| **Bad debt / CECL** on gear AR | Dr Bad Debt Expense 4,000 · Cr Allowance for Credit Losses 4,000 | Allowance is a contra-asset. **Net AR = 15,000 − 4,000 = $11,000.** |
| Depreciation | Dr Depreciation Expense 18,000 · Cr Accum. Depreciation 18,000 | (see §2) |
| Insurance | Dr Insurance Expense 3,000 · Cr Prepaid Insurance 3,000 | (see §3) |
| Support earned | Dr Deferred Revenue 1,500 · Cr Support Revenue 1,500 | (see §4) |
| Commission amortization | Dr Commission Amort Exp 1,250 · Cr Deferred Contract Cost 1,250 | (see §6) |

---

## 8. The cash-flow bridge (Chapter 10 — kept consistent with source PDF)

The source "fun" PDF illustrates the indirect method with this exact bridge; we
adopt it as the **teaching example** (it may be a simplified slice of the full model):

```
Net Income .......................... $100,000
+ Depreciation (non-cash add-back) .. + 18,000
− Increase in Accounts Receivable ... − 15,000
+ Increase in Accounts Payable ...... + 18,000
= Operating Cash Flow ............... $121,000
```

> **RESOLVED (v1.0):** This $100,000-net-income bridge is an **illustrative
> teaching example only.** Summit's *real* Year-1 net income is **$67,250** and
> its real operating cash flow is **$72,000** (both derived in §11). Chapter 10
> presents this $121,000 bridge clearly labeled "illustrative" to teach the
> *shape* of the indirect method, and the real Summit numbers live in §11. The
> two must never be conflated: $100,000 / $121,000 are the textbook shape;
> $67,250 / $72,000 are Summit.

---

## 9. The EBITDA bridge (Chapter 15 — kept consistent with source PDF)

The technical PDF's Non-GAAP reconciliation, adopted as the teaching example:

```
GAAP Net Income ......................... $15,000
+ Income Tax Provision .................. +  4,000
+ Interest Expense ...................... +  1,000
+ Depreciation & Amortization ........... + 10,000
+ Stock-Based Compensation .............. + 20,000
= Adjusted EBITDA ....................... $50,000
```

Same note as §8: present as an **illustrative** reconciliation (the Flattering
Mirror), with Regulation G's rule that GAAP must be shown at least as prominently.

> **RESOLVED (v1.0):** The $15,000 GAAP-net-income starting point here is an
> **illustrative teaching figure**, chosen for tidy arithmetic — it is **not**
> Summit's real net income (which is **$67,250**, §11). Chapter 15 states this
> explicitly ("a teaching number rather than Summit's own audited bottom line").
> **Important:** Chapter 11's ROE/DuPont was previously built on this $15,000
> figure and has been corrected to use Summit's real $67,250 / equity $567,250 /
> assets $661,750 (ROE 11.9%). The §9 EBITDA bridge survives only as the labeled
> Flattering-Mirror teaching example in Ch 15; no analytical chapter treats
> $15,000 as Summit's actual earnings.

---

## 10. Quick-reference: the numbers a reader should be able to "follow"

- $500,000 founding → equity.
- $90,000 deal → splits into $72,000 (now) + $18,000 (over 36 mo @ $500).
- $16,500 deferred revenue still owed at year-end.
- $100,000 equipment → $18,000/yr straight-line → $82,000 net book value.
- Carabiner lots $10 / $12 / $14 → FIFO COGS $22,000 vs LIFO $26,000.
- $15,000 commission capitalized, $1,250 amortized in Year 1.
- $15,000 AR outstanding; $4,000 allowance → $11,000 net.
- $18,000 accrued wages → reversed Jan 1.
- Cash-flow bridge ends at **$121,000** operating cash.
- EBITDA bridge ends at **$50,000** Adjusted EBITDA.

These ten lines are the spine. If the reader can trace all ten, they understand
the cycle.

---

## 11. THE LOCKED THREE-STATEMENT MODEL (v1.0 — tied to the penny)

This is Summit's **real** Year-1 model, built entirely from the anchors in
§1–§7. Every chapter that states Summit's own figures (Ch 10 statements, Ch 11
ratios, Ch 13 close) ties to this. All three statements articulate.

### 11a. Income Statement (Year ended Dec 31, 2026)

| Line | Amount | Source |
|---|---:|---|
| License revenue (Lyle) | 72,000 | §4 |
| Support revenue (Sunny, 3 mo @ $500) | 1,500 | §4 |
| Gear revenue (2,000 carabiners @ $30) | 60,000 | §5 |
| **Total revenue** | **133,500** | |
| Cost of goods sold (FIFO) | (22,000) | §5 |
| **Gross profit** | **111,500** | |
| Depreciation expense (Rocky, straight-line) | (18,000) | §2 |
| Wage expense (accrued) | (18,000) | §7 |
| Insurance expense | (3,000) | §3 |
| Bad debt expense (CECL) | (4,000) | §7 |
| Commission amortization | (1,250) | §6 |
| **Total operating expenses** | **(44,250)** | |
| **NET INCOME** | **67,250** | |

> Note: this stand-alone Year-1 income statement is pre-tax / tax-neutral in the
> core model — Summit booked no income-tax provision in Year 1 (a first-year
> simplification; the deferred-tax *concept* and the 25% rate are taught in Ch 11
> against Rocky's timing difference, see §12, but no current-tax line is run
> through the locked IS). The illustrative §9 bridge with its $4,000 tax is a
> separate teaching example.

### 11b. Balance Sheet (at Dec 31, 2026)

| Assets | Amount | | Liabilities & Equity | Amount |
|---|---:|---|---|---:|
| Cash *(plug — see trail)* | 532,000 | | Wages payable | 18,000 |
| Accounts receivable, net (15,000 − 4,000) | 11,000 | | Deferred revenue (Sunny) | 16,500 |
| Inventory (1,000 carabiners, FIFO) | 14,000 | | Note payable | 60,000 |
| Prepaid insurance | 9,000 | | **Total liabilities** | **94,500** |
| Deferred contract cost | 13,750 | | Common stock | 500,000 |
| Equipment, net (100,000 − 18,000) | 82,000 | | Retained earnings (= net income) | 67,250 |
| | | | **Total equity** | **567,250** |
| **TOTAL ASSETS** | **661,750** | | **TOTAL L + E** | **661,750** |

**A = L + E: 661,750 = 661,750.** ✔

### 11c. Cash trail (proves the $532,000 cash plug)

Cash is a *consequence*, not a guess. Beginning cash $0; only real cash
movements:

| Event | Cash | Running |
|---|---:|---:|
| Founders invest (§1) | +500,000 | 500,000 |
| Buy Rocky — cash portion (§2; $60k on note) | −40,000 | 460,000 |
| Prepaid insurance, Oct 1 (§3) | −12,000 | 448,000 |
| Atlas pays Sal bundle up front (§4) | +90,000 | 538,000 |
| Pay sales commission (§6) | −15,000 | 523,000 |
| Collect gear AR ($45k of $60k) (§5) | +45,000 | 568,000 |
| Buy 3 inventory lots ($10k+$12k+$14k) (§5) | −36,000 | **532,000** |

**Year-end cash = $532,000** — matches the balance-sheet plug exactly. (Wages
$18,000 are *accrued*, not paid in Year 1 → no cash; depreciation, bad debt,
insurance expense, commission amortization, and support-revenue recognition are
all non-cash → no separate cash line.)

> Modeling assumptions that make the trail close (locked): the three carabiner
> lots ($36,000) are **purchased for cash** in Year 1 (no inventory accounts
> payable balance at year-end), and the $18,000 of December wages are **unpaid at
> year-end** (Wages Payable). These two assumptions are what make A = L + E and
> the cash plug reconcile; chapters must not introduce a year-end inventory
> payable or a Year-1 wage cash payment.

### 11d. Cash Flow Statement (indirect — Summit's REAL bridge)

| | Amount |
|---|---:|
| **Operating** | |
| Net income | 67,250 |
| + Depreciation (non-cash) | 18,000 |
| − Increase in AR, net | (11,000) |
| − Increase in inventory | (14,000) |
| − Increase in prepaid insurance | (9,000) |
| − Increase in deferred contract cost | (13,750) |
| + Increase in wages payable | 18,000 |
| + Increase in deferred revenue | 16,500 |
| **= Operating cash flow** | **72,000** |
| **Investing** | |
| Purchase of equipment (Rocky, cash portion) | (40,000) |
| **= Investing cash flow** | **(40,000)** |
| **Financing** | |
| Founders' capital contribution | 500,000 |
| **= Financing cash flow** | **500,000** |
| **Net change in cash** | **532,000** |
| Beginning cash | 0 |
| **Ending cash** | **532,000** |

> Note on AR add-back: using the **net** AR change (+$11,000) already absorbs the
> $4,000 bad-debt allowance, so no separate bad-debt add-back is shown
> (equivalently: +$4,000 non-cash add-back − $15,000 gross AR increase = −$11,000).
> The $60,000 note that helped buy Rocky is a **non-cash** financing/investing
> item (only the $40,000 cash portion appears in Investing) and is disclosed in a
> supplemental non-cash schedule.

### 11e. Articulation check (the three threads pull tight)

1. **IS → BS:** Net income **$67,250** → Retained Earnings **$67,250**. ✔
2. **CF → BS:** CF ending cash **$532,000** → Balance-sheet Cash **$532,000**. ✔
3. **IS → CF:** CF starts at net income **$67,250**. ✔
4. **BS balances:** Assets **$661,750** = L + E **$661,750**. ✔

**All three statements articulate. Model is tied out to the penny.**

### 11f. Ratios that depend on the model (for Ch 11, locked)

- ROE = 67,250 / 567,250 = **11.9%**
- Net margin = 67,250 / 133,500 = **50.4%**
- Asset turnover = 133,500 / 661,750 = **0.20**
- Equity multiplier = 661,750 / 567,250 = **1.17**
- DuPont: 50.4% × 0.20 × 1.17 = **11.9%** ✔
- Inventory turnover = 22,000 / 7,000 (avg of 0 and 14,000) = **3.1×** (≈116 days)

> Ch 11's liquidity worked example (current assets $80,000 / current liabilities
> $40,000 → current ratio 2.0) and the interest-coverage line remain **explicitly
> labeled illustrative** clean slices for teaching; they are not Summit's real
> current section (real cash $532,000 dominates). They use the real locked
> sub-anchors (net AR $11,000, inventory $14,000, prepaid $9,000, wages payable
> $18,000) but a simplified total, and are flagged as such in-text.

---

## 12. Locked add-on anchors (tax rate; the Ranger acquisition)

**Statutory tax rate (Ch 11 deferred-tax example): 25%.**
Rocky's Year-1 timing difference = tax DDB $40,000 − book SL $18,000 = $22,000
(§2). Deferred tax liability = 25% × $22,000 = **$5,500.** (No current-tax line
runs through the §11 core IS; this is the deferred-tax *concept* taught on
Rocky's timing gap.)

**The Ranger Coffee Co. acquisition (Ch 12 — illustrative, now pinned):**

| Item | Amount |
|---|---:|
| Property & equipment (fair value) | 120,000 |
| Inventory (fair value) | 30,000 |
| Customer list, intangible (fair value) | 40,000 |
| Ranger brand name, intangible (fair value) | 25,000 |
| Less: liabilities assumed (fair value) | (25,000) |
| **Fair value of net identifiable assets (Y)** | **190,000** |
| **Purchase price, cash (X)** | **250,000** |
| **Goodwill (X − Y)** | **60,000** |
| Illustrative goodwill impairment (Ch 12, Ch 14) | 20,000 |
| Ranger goodwill after impairment | 40,000 |

> The Ranger deal is a **separately-disclosed illustrative acquisition** taught in
> Ch 12, audited as an estimate in Ch 14, and surfaced in the 10-K acquisition
> note in Ch 15. It lives in its own consolidated sub-ledger and is **disclosed
> separately**; it does **not** flow into Summit's stand-alone Year-1
> three-statement core in §11 (the $67,250 net income, $532,000 cash, $661,750
> total assets are all pre-Ranger). Any chapter referencing the Ranger purchase
> price, goodwill, or impairment must use these exact figures.
