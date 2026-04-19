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
</script>

<div class="relative grid place-items-center" style:width="{size}px" style:height="{size}px">
	<svg width={size} height={size} viewBox="0 0 {size} {size}" aria-hidden="true">
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
			stroke="var(--accent)"
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
