export const MIN_GENERATION_STEPS = 2;
export const MAX_GENERATION_STEPS = 16;
export const DEFAULT_GENERATION_STEPS = 10;
export const GENERATION_STEP_OPTIONS = Array.from(
	{ length: MAX_GENERATION_STEPS - MIN_GENERATION_STEPS + 1 },
	(_, index) => MIN_GENERATION_STEPS + index
);

export const MIN_SYNTHESIS_SPEED = 0.7;
export const MAX_SYNTHESIS_SPEED = 1.5;
export const DEFAULT_SYNTHESIS_SPEED = 1.05;

export function normalizeGenerationSteps(value: unknown): number {
	if (value == null || value === '') return DEFAULT_GENERATION_STEPS;
	const numeric = typeof value === 'number' ? value : Number(value);
	if (!Number.isFinite(numeric)) return DEFAULT_GENERATION_STEPS;
	return Math.max(MIN_GENERATION_STEPS, Math.min(MAX_GENERATION_STEPS, Math.round(numeric)));
}

export function normalizeSynthesisSpeed(value: unknown): number {
	if (value == null || value === '') return DEFAULT_SYNTHESIS_SPEED;
	const numeric = typeof value === 'number' ? value : Number(value);
	if (!Number.isFinite(numeric)) return DEFAULT_SYNTHESIS_SPEED;
	return Math.max(
		MIN_SYNTHESIS_SPEED,
		Math.min(MAX_SYNTHESIS_SPEED, Math.round(numeric * 20) / 20)
	);
}
