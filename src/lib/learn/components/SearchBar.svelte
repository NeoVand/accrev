<script lang="ts">
	import { t } from '$lib/state/i18n.svelte';

	interface Props {
		value: string;
		oninput: (next: string) => void;
		autofocus?: boolean;
	}

	const { value, oninput, autofocus = false }: Props = $props();
</script>

<label class="search-bar">
	<svg
		viewBox="0 0 24 24"
		width="16"
		height="16"
		fill="none"
		stroke="currentColor"
		stroke-width="1.7"
		stroke-linecap="round"
		aria-hidden="true"
	>
		<circle cx="11" cy="11" r="6" />
		<path d="M20 20l-4-4" />
	</svg>
	<input
		type="search"
		{value}
		oninput={(e) => oninput((e.currentTarget as HTMLInputElement).value)}
		placeholder={t('learn_search_placeholder')}
		autocomplete="off"
		spellcheck="false"
		{autofocus}
	/>
	{#if value}
		<button
			type="button"
			onclick={() => oninput('')}
			aria-label="Clear search"
			class="search-clear"
		>
			<svg
				viewBox="0 0 24 24"
				width="14"
				height="14"
				fill="none"
				stroke="currentColor"
				stroke-width="1.7"
				stroke-linecap="round"
				aria-hidden="true"
			>
				<path d="M6 6l12 12M18 6L6 18" />
			</svg>
		</button>
	{/if}
</label>

<style>
	.search-bar {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 12px;
		border: 1px solid var(--hairline);
		border-radius: 12px;
		background: var(--bg-elevated);
		color: var(--ink-muted);
	}
	.search-bar:focus-within {
		border-color: var(--accent);
		color: var(--ink);
	}
	.search-bar input {
		flex: 1;
		min-width: 0;
		border: 0;
		outline: 0;
		background: transparent;
		font: inherit;
		font-size: 14px;
		color: var(--ink);
	}
	.search-bar input::placeholder {
		color: var(--ink-faint);
	}
	.search-clear {
		display: grid;
		place-items: center;
		width: 22px;
		height: 22px;
		border-radius: 999px;
		background: var(--bg-soft);
		border: 0;
		cursor: pointer;
		color: var(--ink-muted);
	}
	.search-clear:hover {
		color: var(--ink);
		background: color-mix(in oklab, var(--accent) 10%, var(--bg-soft));
	}
</style>
