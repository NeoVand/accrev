<script lang="ts">
	import { learnRead } from '$lib/state/learn-read.svelte';
	import { t } from '$lib/state/i18n.svelte';

	type Props = { slug: string };
	const { slug }: Props = $props();

	const isRead = $derived(learnRead.has(slug));

	function toggle() {
		learnRead.toggle(slug);
	}
</script>

<div class="mark-row">
	<button
		type="button"
		onclick={toggle}
		aria-pressed={isRead}
		class="mark-btn"
		class:is-read={isRead}
		title={isRead ? t('learn_unmark_read') : t('learn_mark_read')}
	>
		<span class="mark-check" aria-hidden="true">
			{#if isRead}
				<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
					<path d="M5 12.5l4 4 10-10" />
				</svg>
			{:else}
				<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
					<circle cx="12" cy="12" r="8" />
				</svg>
			{/if}
		</span>
		<span class="mark-label">
			{isRead ? t('learn_marked_read') : t('learn_mark_read')}
		</span>
	</button>
</div>

<style>
	.mark-row {
		display: flex;
		justify-content: center;
		margin-top: 14px;
		padding-top: 14px;
		border-top: 1px dashed var(--hairline);
	}

	.mark-btn {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		padding: 9px 16px 9px 14px;
		border-radius: 999px;
		border: 1px solid var(--hairline);
		background: var(--bg-elevated);
		color: var(--ink-muted);
		font-size: 12.5px;
		letter-spacing: 0.02em;
		line-height: 1;
		cursor: pointer;
		transition:
			background-color 180ms ease,
			border-color 180ms ease,
			color 180ms ease,
			transform 120ms ease;
	}
	.mark-btn:hover {
		border-color: color-mix(in oklab, var(--gold) 60%, var(--hairline));
		background: color-mix(in oklab, var(--gold) 6%, var(--bg-elevated));
		color: var(--ink);
	}
	.mark-btn:active {
		transform: scale(0.98);
	}

	.mark-btn.is-read {
		border-color: color-mix(in oklab, var(--accent) 55%, var(--hairline));
		background: color-mix(in oklab, var(--accent) 12%, var(--bg-elevated));
		color: var(--accent);
	}
	.mark-btn.is-read:hover {
		background: color-mix(in oklab, var(--accent) 18%, var(--bg-elevated));
	}

	.mark-check {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		border-radius: 999px;
		color: currentColor;
	}
	.mark-btn.is-read .mark-check {
		background: color-mix(in oklab, var(--accent) 90%, transparent);
		color: var(--bg);
	}

	.mark-label {
		font-family: var(--font-sans);
		font-weight: 500;
	}
	:global([lang='fa']) .mark-label {
		font-family: var(--font-persian);
		font-weight: 600;
	}
</style>
