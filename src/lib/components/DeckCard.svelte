<script lang="ts">
	import { t } from '$lib/state/i18n.svelte';

	type Props = {
		title: string;
		subtitle?: string;
		count: number;
		href: string;
	};

	let { title, subtitle, count, href }: Props = $props();
</script>

<a
	{href}
	class="group flex flex-col gap-2 rounded-2xl border border-hairline bg-bg-elevated px-4 py-3 hover:border-accent/40"
>
	<div class="eyebrow text-ink-muted">{subtitle ?? ''}</div>
	<div class="font-display text-[18px] leading-tight font-medium text-ink">{title}</div>
	<div class="mt-auto flex items-baseline justify-between pt-1.5">
		<span class="font-display text-[24px] leading-none text-accent">{count}</span>
		<span class="text-[10.5px] tracking-[0.14em] text-ink-muted uppercase">{t('cards')}</span>
	</div>
</a>
