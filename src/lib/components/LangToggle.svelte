<script lang="ts">
	import { i18n } from '$lib/state/i18n.svelte';

	const next = $derived(i18n.lang === 'en' ? 'FA' : 'EN');
	const label = $derived(
		i18n.lang === 'en' ? 'Switch to Persian (Farsi)' : 'بازگشت به انگلیسی'
	);
</script>

<button
	type="button"
	onclick={() => i18n.toggle()}
	aria-label={label}
	title={label}
	class="grid h-7 min-w-7 items-center rounded-full px-1.5 text-[10.5px] font-medium tracking-[0.18em] text-ink-muted uppercase hover:text-ink"
>
	{next}
</button>
