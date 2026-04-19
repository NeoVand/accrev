<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { t } from '$lib/state/i18n.svelte';

	type Props = {
		open: boolean;
		onClose: () => void;
	};

	let { open, onClose }: Props = $props();

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) onClose();
	}
</script>

<svelte:window onkeydown={onKey} />

{#if open}
	<div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
		<button
			type="button"
			aria-label="Close help"
			onclick={onClose}
			transition:fade={{ duration: 180 }}
			class="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
		></button>

		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="help-title"
			transition:fly={{ y: 24, duration: 240 }}
			class="relative flex max-h-[85dvh] w-full max-w-[440px] flex-col overflow-hidden rounded-t-[var(--radius-card)] border border-hairline border-b-0 bg-bg-elevated pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-12px_40px_-16px_rgba(42,31,45,0.35)] sm:rounded-[var(--radius-card)] sm:border-b sm:pb-5"
		>
			<div class="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
				<div class="flex flex-col gap-0.5">
					<p class="eyebrow">accrev</p>
					<h2 id="help-title" class="font-display text-[20px] leading-tight font-medium text-ink">
						{t('help_title')}
					</h2>
				</div>
				<button
					type="button"
					onclick={onClose}
					aria-label="Close"
					class="grid h-8 w-8 flex-none place-items-center rounded-full text-ink-muted hover:bg-bg-soft hover:text-ink"
				>
					<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M6 6l12 12M18 6L6 18" />
					</svg>
				</button>
			</div>

			<div class="overflow-y-auto px-5 pb-2">
				<p class="mb-3 text-[13.5px] leading-relaxed text-ink-muted">{t('help_intro')}</p>

				<ul class="space-y-2.5 text-[13px] leading-relaxed">
					<li class="flex items-start gap-3">
						<span class="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-danger/10 text-danger">
							<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>
						</span>
						<span><strong class="text-ink">{t('forgot')}</strong> — <span class="text-ink-muted">{t('help_forgot')}</span></span>
					</li>
					<li class="flex items-start gap-3">
						<span class="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-gold/15 text-gold">
							<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" stroke="none" aria-hidden="true"><path d="M13 2L3 14h7l-1 8 11-12h-7l1-8z" /></svg>
						</span>
						<span><strong class="text-ink">{t('hard')}</strong> — <span class="text-ink-muted">{t('help_hard')}</span></span>
					</li>
					<li class="flex items-start gap-3">
						<span class="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-success/15 text-success">
							<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>
						</span>
						<span><strong class="text-ink">{t('got_it')}</strong> — <span class="text-ink-muted">{t('help_got_it')}</span></span>
					</li>
					<li class="flex items-start gap-3">
						<span class="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-accent/15 text-accent">
							<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" stroke="none" aria-hidden="true"><path d="M12 2l2.6 6.4L21 9l-5 4.5L17.5 21 12 17.6 6.5 21 8 13.5 3 9l6.4-.6z" /></svg>
						</span>
						<span><strong class="text-ink">{t('easy')}</strong> — <span class="text-ink-muted">{t('help_easy')}</span></span>
					</li>
				</ul>
			</div>

			<div class="flex-none px-5 pt-3">
				<button
					type="button"
					onclick={onClose}
					class="w-full rounded-full bg-ink py-2.5 text-[11.5px] tracking-[0.18em] text-bg uppercase hover:bg-accent"
				>
					{t('help_close')}
				</button>
			</div>
		</div>
	</div>
{/if}
