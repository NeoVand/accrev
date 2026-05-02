/**
 * The deck's divider slides each carry a long bilingual blurb that's richer
 * than the short `part.blurb` shown on the index card. We surface that
 * blurb on the unified part page so users see the same "section opener"
 * regardless of whether they arrive from the index or by clicking Next on
 * the previous slide.
 *
 * The divider body is a flat sequence of inline-styled elements:
 *   1. A monospace label ("PART ONE")  — duplicated by the part hero.
 *   2. A serif Roman numeral ("I.")    — duplicated by the part hero.
 *   3. A `<p class="subtitle">` paragraph — the English blurb.
 *   4. A `direction:rtl` div            — the Persian blurb.
 *
 * The capstone divider follows a slightly different shape (everything is
 * wrapped in a single positioning div) but still exposes a `.subtitle`
 * paragraph. We extract just the subtitle + the optional rtl block — the
 * duplicated label/Roman are dropped so the part hero owns those.
 */
export function extractDividerBlurbs(body: string): { en: string; fa: string } {
	if (!body) return { en: '', fa: '' };

	const enMatch = body.match(/<p class="subtitle"[^>]*>([\s\S]*?)<\/p>/i);
	const en = enMatch ? enMatch[1].trim() : '';

	// First div whose inline style includes `direction:rtl` (the Persian
	// blurb on every Section divider). Inner text only — no nested HTML.
	const faMatch = body.match(
		/<div[^>]*style="[^"]*direction\s*:\s*rtl[^"]*"[^>]*>([\s\S]*?)<\/div>/i
	);
	const fa = faMatch ? faMatch[1].trim() : '';

	return { en, fa };
}
