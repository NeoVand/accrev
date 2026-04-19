<script lang="ts">
	import { dateKey } from '$lib/db';

	type Props = {
		counts: Record<string, number>;
		weeks?: number;
	};

	let { counts, weeks = 8 }: Props = $props();

	type Cell = { date: Date; key: string; count: number };

	const cells = $derived.by<Cell[]>(() => {
		const out: Cell[] = [];
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const totalDays = weeks * 7;
		// Push columns left-to-right (oldest week first), top-to-bottom (Sun..Sat)
		for (let i = totalDays - 1; i >= 0; i--) {
			const d = new Date(today.getTime() - i * 86400000);
			const key = dateKey(d.getTime());
			out.push({ date: d, key, count: counts[key] ?? 0 });
		}
		return out;
	});

	function tone(c: number): string {
		if (c === 0) return 'bg-hairline/50';
		if (c === 1) return 'bg-accent/35';
		if (c === 2) return 'bg-accent/65';
		return 'bg-accent';
	}
</script>

<div class="grid grid-flow-col grid-rows-7 gap-[3px]">
	{#each cells as cell (cell.key)}
		<div
			class="h-[10px] w-[10px] rounded-[2px] {tone(cell.count)}"
			title="{cell.key}: {cell.count} session{cell.count === 1 ? '' : 's'}"
		></div>
	{/each}
</div>
