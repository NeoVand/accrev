<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import LangToggle from './LangToggle.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import { i18n, t } from '$lib/state/i18n.svelte';
	import { lock } from '$lib/state/lock.svelte';

	const PIN_LENGTH = 4;

	let pin = $state('');
	let inputEl: HTMLInputElement | null = $state(null);
	let wrong = $state(false);
	let focused = $state(false);

	onMount(async () => {
		await tick();
		inputEl?.focus();
	});

	function submit(e: Event) {
		e.preventDefault();
		if (lock.unlock(pin)) return; // layout flips immediately
		wrong = true;
		pin = '';
		setTimeout(() => (wrong = false), 700);
	}

	// Auto-submit once the user types the full PIN — no need to reach for OPEN.
	$effect(() => {
		if (pin.length === PIN_LENGTH) {
			submit(new Event('submit'));
		}
	});

	const isFa = $derived(i18n.lang === 'fa');
</script>

<div
	class="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-bg px-6 text-ink"
>
	<!-- Decorative wash -->
	<div
		class="pointer-events-none absolute inset-0 -z-10"
		style="background:
			radial-gradient(ellipse 70% 50% at 50% 0%, var(--accent-soft) 0%, transparent 60%),
			radial-gradient(ellipse 60% 60% at 80% 100%, color-mix(in oklab, var(--gold) 35%, transparent) 0%, transparent 55%),
			radial-gradient(ellipse 60% 60% at 10% 90%, color-mix(in oklab, var(--accent) 20%, transparent) 0%, transparent 60%);"
	></div>

	<div class="absolute top-3 right-4 flex items-center gap-1">
		<LangToggle />
		<ThemeToggle />
	</div>

	<div class="flex w-full max-w-[400px] flex-col items-center gap-7" in:fade={{ duration: 320 }}>
		<div class="flex flex-col items-center text-center" in:fly={{ y: 12, duration: 420 }}>
			<p class="font-display text-[14px] tracking-[0.2em] text-ink-muted uppercase">
				{t('welcome_for')}
			</p>
			<h1 class="font-display text-[64px] leading-none font-medium tracking-tight text-ink">
				{t('welcome_name')}<span class="text-accent">.</span>
			</h1>
		</div>

		<form
			onsubmit={submit}
			class="flex w-full flex-col items-center gap-3"
			in:fly={{ y: 16, duration: 480, delay: 120 }}
		>
			<label for="pin" class="eyebrow">{t('welcome_pin_label')}</label>

			<!-- Centered dot slots overlay a full-size transparent password input, iOS-lock-screen style. -->
			<div
				class="relative w-44"
				class:animate-[shake_0.45s_ease-in-out]={wrong}
			>
				<div
					class="pointer-events-none flex items-center justify-center gap-4 rounded-2xl border bg-bg-elevated/80 py-4"
					class:border-hairline={!wrong && !focused}
					class:border-accent={focused && !wrong}
					class:border-danger={wrong}
				>
					{#each Array(PIN_LENGTH) as _, i (i)}
						<span
							class="h-3 w-3 rounded-full border-[1.5px] transition-all duration-150"
							class:bg-ink={i < pin.length}
							class:border-ink={i < pin.length}
							class:border-ink-muted={i >= pin.length}
							class:scale-110={i === pin.length && focused}
							class:border-accent={i === pin.length && focused}
						></span>
					{/each}
				</div>
				<input
					id="pin"
					bind:this={inputEl}
					bind:value={pin}
					onfocus={() => (focused = true)}
					onblur={() => (focused = false)}
					type="password"
					inputmode="numeric"
					pattern="[0-9]*"
					maxlength={PIN_LENGTH}
					autocomplete="off"
					autocapitalize="off"
					autocorrect="off"
					aria-label={t('welcome_pin_label')}
					class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
				/>
			</div>

			<button
				type="submit"
				class="mt-2 w-44 rounded-full bg-ink py-3 text-[12px] tracking-[0.18em] text-bg uppercase transition hover:bg-accent active:scale-[0.98]"
			>
				{t('welcome_unlock')}
			</button>

			{#if wrong}
				<p
					class="text-[12.5px] text-danger"
					in:fade={{ duration: 180 }}
					out:fade={{ duration: 180 }}
				>
					{t('welcome_wrong')}
				</p>
			{/if}
		</form>

		<p
			class="font-display max-w-[280px] text-center text-[12.5px] text-ink-faint italic"
			in:fade={{ duration: 480, delay: 320 }}
			dir={isFa ? 'rtl' : 'ltr'}
		>
			{t('welcome_footer')}
		</p>
	</div>
</div>

<style>
	@keyframes shake {
		0%, 100% { transform: translateX(0); }
		20% { transform: translateX(-8px); }
		40% { transform: translateX(7px); }
		60% { transform: translateX(-5px); }
		80% { transform: translateX(3px); }
	}
</style>
