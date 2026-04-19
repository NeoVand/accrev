<script lang="ts">
	import { t } from '$lib/state/i18n.svelte';
	import { theme } from '$lib/state/theme.svelte';
</script>

<section class="flex flex-col gap-5 pt-3">
	<div class="flex flex-col gap-0.5">
		<p class="eyebrow">{t('settings_eyebrow')}</p>
		<h1 class="font-display text-[24px] leading-tight font-medium text-ink">
			{t('preferences')}
		</h1>
	</div>

	<div
		class="flex flex-col gap-3 rounded-[var(--radius-card)] border border-hairline bg-bg-elevated p-4"
	>
		<p class="eyebrow">{t('theme')}</p>
		<div class="grid grid-cols-3 gap-2">
			{#each ['light', 'dark', 'system'] as const as opt (opt)}
				<button
					type="button"
					onclick={() => (theme.pref = opt)}
					aria-pressed={theme.pref === opt}
					class="rounded-xl border px-3 py-2.5 text-[11.5px] tracking-[0.14em] uppercase aria-pressed:border-accent aria-pressed:bg-accent-soft/40 aria-pressed:text-accent"
					class:border-hairline={theme.pref !== opt}
					class:text-ink-muted={theme.pref !== opt}
				>
					{opt === 'light' ? t('light') : opt === 'dark' ? t('dark') : t('system')}
				</button>
			{/each}
		</div>
	</div>

	<p class="text-[12.5px] text-ink-faint italic">{t('settings_more')}</p>
</section>
