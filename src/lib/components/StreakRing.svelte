<script lang="ts">
	type Props = {
		days: number;
		goal?: number;
		size?: number;
	};

	let { days, goal = 7, size = 96 }: Props = $props();

	const stroke = 4;
	const radius = $derived((size - stroke) / 2);
	const circumference = $derived(2 * Math.PI * radius);
	const progress = $derived(Math.min(days / goal, 1));
	const dashOffset = $derived(circumference * (1 - progress));
	/* Unique gradient id per instance so multiple rings on a page don't collide. */
	const gradId = $props.id();
</script>

<div class="ring-wrap relative grid place-items-center" style:width="{size}px" style:height="{size}px">
	<svg width={size} height={size} viewBox="0 0 {size} {size}" aria-hidden="true">
		<defs>
			<linearGradient id="ring-{gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="0%" stop-color="var(--accent)" />
				<stop offset="100%" stop-color="var(--gold)" />
			</linearGradient>
		</defs>
		<circle
			cx={size / 2}
			cy={size / 2}
			r={radius}
			fill="none"
			stroke="var(--hairline)"
			stroke-width={stroke}
		/>
		<circle
			cx={size / 2}
			cy={size / 2}
			r={radius}
			fill="none"
			stroke="url(#ring-{gradId})"
			stroke-width={stroke}
			stroke-linecap="round"
			stroke-dasharray={circumference}
			stroke-dashoffset={dashOffset}
			transform="rotate(-90 {size / 2} {size / 2})"
		/>
	</svg>
	<div class="absolute inset-0 grid place-items-center">
		<span class="font-display text-[26px] leading-none font-medium text-ink">{days}</span>
	</div>
</div>

<style>
	/* Soft accent halo behind the ring — the streak feels alive, not a chart. */
	.ring-wrap::before {
		content: '';
		position: absolute;
		inset: 8%;
		border-radius: 9999px;
		background: radial-gradient(
			circle,
			color-mix(in oklab, var(--accent) 18%, transparent) 0%,
			transparent 70%
		);
		z-index: -1;
		pointer-events: none;
	}
</style>
