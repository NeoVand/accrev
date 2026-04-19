<script lang="ts">
	import { wipeEverything } from '$lib/db';
	import { t } from '$lib/state/i18n.svelte';
	import { theme } from '$lib/state/theme.svelte';

	let confirmReset = $state(false);
	let busy = $state(false);

	async function doReset() {
		if (!confirmReset) {
			confirmReset = true;
			return;
		}
		busy = true;
		await wipeEverything();
		// Hard reload so every store + Dexie connection re-initializes cold.
		window.location.href = '/';
	}

	function cancelReset() {
		confirmReset = false;
	}
</script>

<section class="flex flex-col gap-6 pt-3">
	<div class="flex flex-col gap-0.5">
		<p class="eyebrow">{t('settings_eyebrow')}</p>
		<h1 class="font-display text-[28px] leading-tight font-medium text-ink">
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

	<!-- Reset -->
	<div class="flex flex-col gap-2">
		<p class="eyebrow text-danger/80">{t('reset_eyebrow')}</p>

		{#if !confirmReset}
			<div
				class="flex flex-col gap-3 rounded-[var(--radius-card)] border border-hairline bg-bg-elevated p-4"
			>
				<div class="flex flex-col gap-1">
					<p class="font-display text-[16px] leading-tight font-medium text-ink">
						{t('reset_title')}
					</p>
					<p class="text-[12.5px] leading-relaxed text-ink-muted">{t('reset_body')}</p>
				</div>
				<button
					type="button"
					onclick={doReset}
					class="rounded-full border border-danger/40 py-2.5 text-[11.5px] tracking-[0.16em] text-danger uppercase hover:bg-danger/5"
				>
					{t('reset_button')}
				</button>
			</div>
		{:else}
			<div
				class="flex flex-col gap-3 rounded-[var(--radius-card)] border border-danger/50 bg-danger/5 p-4"
			>
				<div class="flex flex-col gap-1">
					<p class="font-display text-[16px] leading-tight font-medium text-danger">
						{t('reset_confirm_title')}
					</p>
					<p class="text-[12.5px] leading-relaxed text-ink-muted">{t('reset_confirm_body')}</p>
				</div>
				<div class="flex gap-2">
					<button
						type="button"
						onclick={doReset}
						disabled={busy}
						class="flex-1 rounded-full bg-danger py-2.5 text-[11px] tracking-[0.16em] text-bg uppercase hover:bg-danger/90 disabled:opacity-50"
					>
						{t('reset_confirm_yes')}
					</button>
					<button
						type="button"
						onclick={cancelReset}
						disabled={busy}
						class="flex-1 rounded-full border border-hairline py-2.5 text-[11px] tracking-[0.16em] text-ink-muted uppercase hover:text-ink"
					>
						{t('reset_cancel')}
					</button>
				</div>
			</div>
		{/if}
	</div>

	<p class="text-[12.5px] text-ink-faint italic">{t('settings_more')}</p>
</section>
