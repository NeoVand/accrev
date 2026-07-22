<script lang="ts">
	import { base } from '$app/paths';
	import { wipeEverything } from '$lib/db';
	import { t } from '$lib/state/i18n.svelte';
	import { theme } from '$lib/state/theme.svelte';
	import { voicePref, type VoiceEngine } from '$lib/state/voice.svelte';
	import { SUPERTONIC_MODEL } from '$lib/voice/catalog';
	import {
		MAX_GENERATION_STEPS,
		MAX_SYNTHESIS_SPEED,
		MIN_GENERATION_STEPS,
		MIN_SYNTHESIS_SPEED
	} from '$lib/voice/synthesis';
	import { supertonic } from '$lib/voice/supertonic.svelte';
	import type { BackendPreference } from '$lib/voice/types';

	const VOICE_OPTS: { id: VoiceEngine; key: 'voice_model' | 'voice_browser' }[] = [
		{ id: 'model', key: 'voice_model' },
		{ id: 'browser', key: 'voice_browser' }
	];

	let confirmReset = $state(false);
	let busy = $state(false);
	let modelBusy = $state(false);

	const selectedVoice = $derived(
		SUPERTONIC_MODEL.voices.find((voice) => voice.id === voicePref.voiceId)
	);

	async function installModel() {
		if (!voicePref.licenseAccepted || modelBusy) return;
		modelBusy = true;
		try {
			await supertonic.load(voicePref.backend);
		} catch {
			// The engine exposes the actionable error inline.
		} finally {
			modelBusy = false;
		}
	}

	function cancelModelInstall() {
		supertonic.cancelLoad();
		modelBusy = false;
	}

	async function removeModel() {
		if (modelBusy) return;
		modelBusy = true;
		try {
			await supertonic.remove();
		} finally {
			modelBusy = false;
		}
	}

	function selectBackend(backend: BackendPreference) {
		voicePref.setBackend(backend);
	}

	async function doReset() {
		if (!confirmReset) {
			confirmReset = true;
			return;
		}
		busy = true;
		await supertonic.remove();
		await wipeEverything();
		// Hard reload so every store + Dexie connection re-initializes cold.
		window.location.href = `${base}/`;
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

	<!-- Read-aloud voice -->
	<div
		class="flex flex-col gap-3 rounded-[var(--radius-card)] border border-hairline bg-bg-elevated p-4"
	>
		<p class="eyebrow">{t('read_aloud_voice')}</p>
		<div class="grid grid-cols-2 gap-2">
			{#each VOICE_OPTS as opt (opt.id)}
				<button
					type="button"
					onclick={() => voicePref.set(opt.id)}
					aria-pressed={voicePref.engine === opt.id}
					class="rounded-xl border px-3 py-2.5 text-[11.5px] tracking-[0.14em] uppercase aria-pressed:border-accent aria-pressed:bg-accent-soft/40 aria-pressed:text-accent"
					class:border-hairline={voicePref.engine !== opt.id}
					class:text-ink-muted={voicePref.engine !== opt.id}
				>
					{t(opt.key)}
				</button>
			{/each}
		</div>

		{#if voicePref.engine === 'model'}
			<div class="mt-1 flex flex-col gap-4 border-t border-hairline pt-4">
				<div class="flex items-start justify-between gap-3">
					<div>
						<p class="font-display text-[17px] leading-tight font-medium text-ink">
							{SUPERTONIC_MODEL.name}
						</p>
						<p class="mt-1 text-[11.5px] leading-relaxed text-ink-muted">
							Fast, private ONNX speech in a dedicated worker. Generates locally after a one-time
							download.
						</p>
					</div>
					<span
						class="shrink-0 rounded-full border border-hairline px-2 py-1 text-[9px] tracking-[0.1em] text-ink-faint uppercase"
					>
						{supertonic.isReady
							? `${supertonic.backend?.toUpperCase()} ready`
							: supertonic.installed
								? 'cached'
								: `${SUPERTONIC_MODEL.sizeMb} MB`}
					</span>
				</div>

				<div class="grid grid-cols-3 gap-2 text-center">
					<div class="rounded-xl border border-hairline px-2 py-2">
						<strong class="block text-[13px] text-ink">{SUPERTONIC_MODEL.voices.length}</strong>
						<span class="text-[9px] tracking-[0.1em] text-ink-faint uppercase">voices</span>
					</div>
					<div class="rounded-xl border border-hairline px-2 py-2">
						<strong class="block text-[13px] text-ink"
							>{SUPERTONIC_MODEL.languages.length - 1}</strong
						>
						<span class="text-[9px] tracking-[0.1em] text-ink-faint uppercase">languages</span>
					</div>
					<div class="rounded-xl border border-hairline px-2 py-2">
						<strong class="block text-[13px] text-ink">44.1</strong>
						<span class="text-[9px] tracking-[0.1em] text-ink-faint uppercase">kHz</span>
					</div>
				</div>

				<label
					class="flex cursor-pointer items-start gap-2.5 rounded-xl border border-hairline bg-bg px-3 py-2.5"
				>
					<input
						class="mt-0.5 accent-accent"
						type="checkbox"
						checked={voicePref.licenseAccepted}
						onchange={(event) => voicePref.acceptLicense(event.currentTarget.checked)}
					/>
					<span class="text-[11px] leading-relaxed text-ink-muted">
						I have reviewed and accept the
						<a
							class="text-accent underline underline-offset-2"
							href={SUPERTONIC_MODEL.licenseUrl}
							target="_blank"
							rel="external noreferrer"
						>
							OpenRAIL-M model terms
						</a>
					</span>
				</label>

				{#if supertonic.status === 'loading'}
					<div class="flex flex-col gap-1.5" aria-live="polite">
						<div class="flex justify-between text-[10px] text-ink-muted">
							<span class="truncate">{supertonic.note ?? 'Preparing model files'}</span>
							<span>{Math.round(supertonic.progress)}%</span>
						</div>
						<progress class="h-1.5 w-full accent-accent" max="100" value={supertonic.progress}
						></progress>
					</div>
				{:else if supertonic.error}
					<p
						class="rounded-xl border border-danger/35 bg-danger/5 px-3 py-2 text-[11px] text-danger"
						role="alert"
					>
						{supertonic.error}
					</p>
				{/if}

				<div class="flex gap-2">
					{#if supertonic.status === 'loading'}
						<button
							type="button"
							class="flex-1 rounded-full border border-hairline py-2.5 text-[10px] tracking-[0.12em] text-ink-muted uppercase"
							onclick={cancelModelInstall}
						>
							Stop download
						</button>
					{:else}
						<button
							type="button"
							disabled={!voicePref.licenseAccepted || modelBusy}
							class="flex-1 rounded-full bg-accent py-2.5 text-[10px] tracking-[0.12em] text-bg uppercase disabled:opacity-40"
							onclick={installModel}
						>
							{supertonic.isReady
								? 'Model ready'
								: supertonic.installed
									? 'Load cached model'
									: 'Download & warm up'}
						</button>
						{#if supertonic.installed}
							<button
								type="button"
								disabled={modelBusy}
								class="rounded-full border border-danger/35 px-3 py-2.5 text-[10px] tracking-[0.12em] text-danger uppercase disabled:opacity-40"
								onclick={removeModel}
							>
								Remove
							</button>
						{/if}
					{/if}
				</div>

				<div class="grid gap-3 sm:grid-cols-2">
					<label class="flex flex-col gap-1.5">
						<span class="text-[10px] tracking-[0.12em] text-ink-faint uppercase">Voice</span>
						<select
							class="rounded-xl border border-hairline bg-bg px-3 py-2.5 text-[12px] text-ink"
							aria-label="Voice"
							value={voicePref.voiceId}
							onchange={(event) => voicePref.setVoice(event.currentTarget.value)}
						>
							{#each SUPERTONIC_MODEL.voices as voice (voice.id)}
								<option value={voice.id}>{voice.name} · {voice.gender}</option>
							{/each}
						</select>
					</label>
					<label class="flex flex-col gap-1.5">
						<span class="text-[10px] tracking-[0.12em] text-ink-faint uppercase">Language</span>
						<select
							class="rounded-xl border border-hairline bg-bg px-3 py-2.5 text-[12px] text-ink"
							aria-label="Language"
							value={voicePref.language}
							onchange={(event) => voicePref.setLanguage(event.currentTarget.value)}
						>
							{#each SUPERTONIC_MODEL.languages as language (language.code)}
								<option value={language.code}>{language.name}</option>
							{/each}
						</select>
					</label>
				</div>

				<label class="flex flex-col gap-2">
					<span class="flex items-center justify-between text-[10px] tracking-[0.12em] uppercase">
						<span class="text-ink-faint">Generation quality</span>
						<strong class="text-ink">{voicePref.generationSteps} steps</strong>
					</span>
					<input
						class="w-full accent-accent"
						type="range"
						min={MIN_GENERATION_STEPS}
						max={MAX_GENERATION_STEPS}
						step="1"
						value={voicePref.generationSteps}
						oninput={(event) => voicePref.setGenerationSteps(event.currentTarget.valueAsNumber)}
					/>
					<span class="text-[10px] leading-relaxed text-ink-faint">
						Lower is faster; higher spends more denoising steps on voice detail. Ten is the balanced
						default.
					</span>
				</label>

				<label class="flex flex-col gap-2">
					<span class="flex items-center justify-between text-[10px] tracking-[0.12em] uppercase">
						<span class="text-ink-faint">Voice pace</span>
						<strong class="text-ink">{voicePref.synthesisSpeed.toFixed(2)}×</strong>
					</span>
					<input
						class="w-full accent-accent"
						type="range"
						min={MIN_SYNTHESIS_SPEED}
						max={MAX_SYNTHESIS_SPEED}
						step="0.05"
						value={voicePref.synthesisSpeed}
						oninput={(event) => voicePref.setSynthesisSpeed(event.currentTarget.valueAsNumber)}
					/>
					<span class="text-[10px] leading-relaxed text-ink-faint">
						Controls delivery inside the model without shifting pitch. {selectedVoice?.name} is currently
						selected.
					</span>
				</label>

				<div class="flex flex-col gap-2">
					<span class="text-[10px] tracking-[0.12em] text-ink-faint uppercase">Runtime</span>
					<div class="grid grid-cols-3 gap-2">
						{#each ['auto', 'webgpu', 'wasm'] as const as backend (backend)}
							<button
								type="button"
								aria-pressed={voicePref.backend === backend}
								class="rounded-xl border px-2 py-2 text-[10px] tracking-[0.08em] uppercase aria-pressed:border-accent aria-pressed:bg-accent-soft/40 aria-pressed:text-accent"
								class:border-hairline={voicePref.backend !== backend}
								class:text-ink-muted={voicePref.backend !== backend}
								onclick={() => selectBackend(backend)}
							>
								{backend === 'auto' ? 'Auto' : backend.toUpperCase()}
							</button>
						{/each}
					</div>
					<span class="text-[10px] leading-relaxed text-ink-faint">
						Auto prefers WebGPU and falls back to WASM. A runtime change takes effect on the next
						model load.
					</span>
				</div>
			</div>
		{:else}
			<p class="text-[12px] leading-relaxed text-ink-faint">
				Uses the operating system voice instantly with no model download.
			</p>
		{/if}
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
