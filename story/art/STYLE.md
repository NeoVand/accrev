# ART — STYLE.md

> **The master art direction for *The Accrual World*.** One cohesive look across
> every image in the book: character portraits, wide chapter covers, and square
> spot illustrations. Read this once, then never improvise the look — combine a
> *subject prompt* with the **STYLE SUFFIX** below and you will get art that feels
> of-a-piece with the app and with itself.
>
> This file is a **copy-paste system**. The blocks in `code fences` are meant to
> be pasted directly into a modern text-to-image model. See `README.md` for the
> mechanics (file layout, naming, how to assemble a full prompt).

---

## 0. The one-sentence look

**Warm storybook-meets-editorial: hand-finished gouache-and-ink illustration on
cream paper, lit like late-afternoon sun, in a tight palette of dusty terracotta,
warm gold, and dark-plum ink — whimsical but grown-up, the way a beautifully
illustrated *New Yorker* feature would draw a fairy tale about accounting.**

It must read as *one illustrator's hand* drew the whole book. When in doubt:
**warmer, calmer, more paper, fewer colors.**

---

## 1. Medium & rendering style

- **Primary medium:** modern digital illustration that *convincingly imitates
  gouache and ink on textured paper* — opaque, matte paint with visible brush
  and a fine ink linework drawn over it. Think contemporary picture-book art
  crossed with editorial spot illustration.
- **Linework:** a confident, slightly imperfect **ink line** — varying weight,
  occasionally broken, never a uniform vector stroke. Lines are **plum-brown/ink
  (#2a1f2d)**, not pure black. Linework defines characters and key forms; soft
  shapes (skies, floors, light) are paint with little or no line.
- **Texture:** every image sits on a **warm cream paper grain** (matching the
  app's `#fbf6ee` and its paper-grain overlay). A gentle risograph/screen-print
  quality is welcome — slight ink misregistration, soft grain, a hint of paper
  tooth. Never glossy, never plasticky, never airbrushed-smooth.
- **Fill quality:** flat-to-softly-modeled gouache shapes with **subtle paper
  texture showing through** the lighter washes. Shadows are *painted color*, not
  gradients of grey. Limited, deliberate highlights.
- **What it is NOT:** not 3D render, not Pixar/CGI, not photorealism, not anime/
  manga, not vector-flat corporate illustration, not glossy vector gradients, not
  AI-glossy "concept art." If it looks like a render or a stock vector, it's wrong.

---

## 2. The palette (tied to the app tokens)

The book's palette **is** the app's palette. Use these and very little else. Every
image should feel like it was painted from this one box of paints.

| Role | Name | Hex | Use |
|---|---|---|---|
| **Ground** | Warm cream paper | `#fbf6ee` | The paper itself; default background; negative space |
| **Ground, deeper** | Soft sand | `#f4ece0` | Secondary background, distant planes, paper in shadow |
| **Primary accent** | Dusty terracotta | `#b5635a` | The hero color: Sal, key focal points, warm light, emotional beats |
| **Accent, pale** | Faded rose | `#ecd0c9` | Tints, soft skies, blush, distant terracotta, fills behind subjects |
| **Secondary accent** | Warm gold | `#a88a5c` | Gilding, lamplight, brass, ledgers, "value," sacred/official objects |
| **Ink** | Dark plum | `#2a1f2d` | All linework, deepest shadows, text-in-image, the "ink" of the ledger world |
| **Ink, muted** | Dusty mauve | `#6b5a6e` | Mid shadows, distant figures, secondary line, atmosphere |
| **Hairline** | Aged tan | `#e6d8c6` | Fine rules, gridlines, paper edges, ledger lines |
| **Sparing cool** | Sage green | `#6b8e62` | Used **rarely** — growth, "balance achieved," Pacioli's robes, foliage |
| **Sparing alarm** | Deep brick | `#a6453f` | Used **rarely** — danger, the GAAP chasm, an entry that won't balance, audit red |

**Palette rules:**
1. **Terracotta and gold do the heavy lifting.** Plum-ink for line and shadow.
   Cream is the air everything breathes in.
2. **Sage and deep-brick are spices, not staples** — a few percent of the frame
   at most, reserved for the meanings above. A whole green or blue scene is wrong.
3. **No pure black, no pure white, no pure saturated primaries.** Everything is
   warmed and slightly desaturated, as if printed with these inks on cream stock.
4. **The dark mode of the app is NOT the art palette.** Always paint on cream/
   light, even for night scenes (use plum-ink and deep terracotta for "dark,"
   never a black background). The app inverts its own UI; the art stays warm.

---

## 3. Mood & emotional register

- **Overall:** inviting, witty, a little mischievous, quietly grand. Accounting
  reframed as a living mythic world — *cozy epic*. The reader should feel
  *welcomed in on a joke* and *taken somewhere wondrous*, never lectured or scared.
- **The villain is confusion, not evil.** Even the strict guardians (Tri the
  bouncer, the 606 Sphinx, the Auditor) are dignified and a touch comic — stern,
  not menacing. No gore, no true horror, no cruelty.
- **Emotional tentpoles get the most light and the warmest terracotta:** Sal's
  birth (Ch 1), the split (Ch 4), the financial-statement reveal (Ch 10), the
  "death"/rebirth at the Cleansing (Ch 13), recognition on the Public Stage
  (Ch 15). These can carry a lump-in-the-throat tenderness.
- **Humor lives in the details, not the rendering:** a put-upon ledger, Lefty &
  Righty mid-bicker, Tally beaming with misplaced pride. Keep faces expressive
  and gestures readable; let the personification carry the comedy.

---

## 4. Light & atmosphere

- **Signature light:** **warm, low, late-afternoon sun** — long soft shadows,
  golden rim-light on edges, a single dominant warm key light. Like honey through
  a tall window.
- **Shadows** are colored (plum-mauve, soft terracotta), never neutral grey, and
  never harsh-edged. Keep them soft and translucent — paper shows through.
- **Glow for meaning:** recognition, value, and "truth" can carry a soft gold
  glow (a recognized number, a balanced equation, the 10-K). Deferral/limbo
  (Sunny's dungeon, unearned revenue) is cooler and dimmer but still warm-toned.
- **Atmosphere:** a faint dustiness in the air (motes in sunbeams) suits the
  ledger/library/archive feel. Keep it subtle.

---

## 5. Composition defaults

- **Generous negative space.** Let the cream paper breathe. Editorial restraint —
  one clear subject, one clear idea per image. Don't fill every corner.
- **Clear focal hierarchy:** the emotional/teaching subject is unmistakable;
  everything else supports it. Terracotta marks the focal point.
- **Staging:** characters are readable in **silhouette**; gestures and expressions
  do the storytelling. Slightly flattened, illustrative space (gentle depth, not
  aggressive perspective) keeps the picture-book feel.
- **Grounding motifs to reuse** (so the world feels continuous): the **one-way
  road** with named station gates; **ledger lines / faint grid** as floors,
  skies, or paper; **gold leaf** on anything sacred or official; the **Balance**
  (a great scale or a literally tilting horizon when an entry is wrong); **paper
  texture and torn edges** as framing.
- **Text in image:** avoid rendered words/letters unless explicitly requested
  (models garble them). If a sign/ledger must appear, keep it to a single short,
  clearly-specified word, or leave it as suggestive marks. Never rely on the model
  to spell.
- **Safe margins:** keep key subjects away from the extreme edges (the app may
  crop or round corners). Leave a calm zone where a caption or UI could overlay.

---

## 6. Aspect ratios & the three image types

The book uses exactly **three** formats. Pick the right one; each has its own
composition logic.

### (a) Character portraits — **3:4 (portrait)**
- A single character (or an inseparable pair like Lefty & Righty), waist-up or
  full-figure, against a **simple tinted paper ground** (a soft terracotta or
  gold wash, lightly textured — not a detailed scene).
- The character is the whole point: maximal personality, clear silhouette,
  expressive face/posture, one or two signature props. Soft vignette of warm
  light around them.
- Think *a character sheet that's also a keepsake.* Consistent framing across all
  portraits so the cast feels like one ensemble.

### (b) Wide chapter covers — **16:9 (landscape)**
- The cinematic establishing image for a chapter's **station** (the Genesis dock,
  the Revenue Labyrinth, the Great Library, Trinity Hall, the Public Stage…).
- Wide world, atmospheric depth, the late-afternoon light doing its work.
  Characters optional and small — the **place and mood** lead. Room along one
  side for a title to overlay (keep that zone calmer).
- This is the establishing "you have arrived at the next station" image.

### (c) Square spot illustrations — **1:1 (square)**
- The in-chapter teaching/emotion beat: one concept or one moment, isolated and
  clean (the Allocator splitting Sal; the three-way match; FIFO vs LIFO on the
  conveyor; the Ferryman; the tilting Balance).
- Maximal clarity, minimal clutter — a *diagram with a soul*. Lots of cream
  around a single strong idea. These are the workhorses; most images are spots.

> **Resolution:** request the largest the model offers at the chosen ratio.
> **Bleed/frame:** default to a soft, slightly irregular painted edge (paper
> vignette) rather than a hard rectangle, unless a clean crop is needed for the UI.

---

## 7. Character look-bible (keep these consistent)

Append the relevant line to a character's subject prompt so they're recognizable
across the book. Keep wardrobe, color-coding, and silhouette stable.

- **Sal** *(the Sale)* — a small, warm, glowing being made of soft **terracotta
  light**, the shape of a folded receipt or a little paper figure with an eager,
  open face; large hopeful eyes; a faint gold seam down the middle (foreshadowing
  the split). Embodies *terracotta = the hero color.*
- **Lyle** *(the License, $72k)* — Sal's confident "instant" half: a brighter,
  crisper terracotta-and-gold figure, sharp-edged, a little strutting; carries a
  glowing **download key**. Already-Somebody posture.
- **Sunny** *(the Support, $18k)* — Sal's patient half: a softer, dimmer figure in
  **deferred blue-mauve** at first (she begins as a liability), slowly warming
  toward gold across the book; gentle, steady, quietly the most heroic.
- **The Friar (Luca Pacioli)** — an ancient, kind friar-mathematician in simple
  **sage-and-cream** robes; warm wry face, ink-stained fingers, carries a great
  ledger and a quill; soft gold halo of lamplight. Gandalf-by-way-of-a-monastery.
- **Remy (the Rookie)** — a young, earnest first-week accountant in modern-ish
  business-casual (warm tones), satchel and notebook, perpetually taking notes;
  bewildered-but-game expression. The reader's avatar; keep relatable and human.
- **Iris Quinn (the Controller)** — Remy's sharp, kind boss: composed, well-dressed
  in terracotta/plum, reading glasses, an arched eyebrow and a knowing half-smile;
  always mid-question. Authority that's generous, not cold.
- **Lefty & Righty** *(Debit & Credit)* — inseparable twin scribes, mirror images,
  one always on the **left** (Debit) and one on the **right** (Credit), bickering;
  matched but opposite-tinted (warm/cool), joined by a ledger between them.
- **Tally (the Trial Balance)** — a charming, slightly pompous citizen, perfectly
  symmetrical and very proud, balancing two pans that are always level; an
  "honest liar" — beaming even when wrong.
- **Tri** — the three-fold bouncer at the Gate: a dignified, broad triple-figure
  (or a guard with three matching documents/faces), checking papers; stern but
  fair, never a brute.
- **The 606 Sphinx ("the Beast")** — a grand, riddling sphinx of warm stone and
  gold, five-stepped/five-fold motif, guarding the Labyrinth; awe more than dread.
- **Rocky** *(the equipment, $100k)* — a sturdy, loyal server-rack workhorse with a
  kind blocky face; visibly *ages* (weathers, patinas) as Father Time/depreciation
  acts on him across chapters.
- **The Ferryman (Income Summary)** — a tall, calm, cloaked Charon-figure poling a
  boat across a soft gold strait from the "temporary" shore to the permanent one;
  solemn and gentle, not frightening.
- **The Auditor (PCAOB)** — a stern, incorruptible inquisitor with a magnifier and
  a checklist; skeptical, dignified, a touch comic in their thoroughness.
- **The Flattering Mirror (Non-GAAP)** — an ornate gilded mirror that shows a
  prettier reflection; vain, glamorous, *just slightly* untrustworthy.

> New characters: derive their color/silhouette from these rules. Heroes and
> "value" lean terracotta/gold; liabilities and limbo lean cool mauve; guardians
> are dignified and stone/gold; comedy lives in expression, never in ugliness.

---

## 8. THE STYLE SUFFIX (paste at the end of every prompt)

This single string carries the whole look. **Append it verbatim** to every subject
prompt so all images match. (Tune the bracketed ratio per image type.)

```text
— Illustrated in a warm modern storybook-meets-editorial style: hand-finished
gouache and ink on textured cream paper, confident slightly-imperfect plum-ink
linework over matte opaque paint, gentle risograph/screen-print grain with a hint
of ink misregistration and visible paper tooth. Tight palette tied to the book:
warm cream ground (#fbf6ee), dusty terracotta accent (#b5635a), warm gold
(#a88a5c), dark-plum ink (#2a1f2d), faded rose (#ecd0c9), with sage green
(#6b8e62) and deep brick (#a6453f) used only sparingly for meaning. Lit by warm
low late-afternoon sun: soft colored shadows (plum/terracotta, never grey), golden
rim-light, dust motes in the light. Generous cream negative space, clear single
focal subject, editorial restraint, readable silhouettes, expressive faces. Cozy
epic mood — whimsical but grown-up, never childish. Cohesive single-illustrator
hand. Matte, tactile, printed-on-paper feel. No text unless specified.
[aspect ratio: 3:4 portrait | 16:9 wide | 1:1 square]
```

---

## 9. NEGATIVE PROMPT (paste into the negative field every time)

```text
3D render, CGI, Pixar style, Octane, photorealistic, photograph, glossy, plastic,
airbrushed, smooth gradient shading, vector flat corporate clip-art, stock
illustration, infographic style, anime, manga, chibi, cel shading, neon, saturated
primary colors, pure black, pure white, cold blue color scheme, grey neutral
shadows, harsh hard shadows, lens flare, bokeh, HDR, busy cluttered composition,
cramped framing, no negative space, ugly distorted faces, extra fingers, deformed
hands, mutated limbs, watermark, signature, logo, gibberish text, misspelled words,
random letters, garbled typography, frame border ui, modern UI chrome, low-quality,
blurry, jpeg artifacts, oversharpened, grimdark, horror, gore, scary, menacing.
```

---

## 10. Quick consistency checklist (before you accept an image)

- [ ] Painted on **warm cream paper**, with visible grain/tooth?
- [ ] **Plum-ink line**, varying weight — not pure black, not uniform vector?
- [ ] Palette is **terracotta + gold + plum-ink on cream**, with sage/brick only
      as spice?
- [ ] **Warm low light** with soft *colored* shadows (no neutral grey)?
- [ ] **One** clear focal subject and real **cream negative space**?
- [ ] Correct **aspect ratio** for the image type (3:4 / 16:9 / 1:1)?
- [ ] Characters match the **look-bible** (color-coding, silhouette, props)?
- [ ] Mood is **cozy-epic and warm** — witty, dignified, never childish/scary?
- [ ] **No garbled text**, no render-y gloss, no extra fingers?
- [ ] Feels like the **same hand** as the rest of the book and the app's palette?
