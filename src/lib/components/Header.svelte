<script lang="ts">
	import { resolve } from '$app/paths';
	import LangToggle from './LangToggle.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
</script>

<header
	class="z-30 flex flex-none items-center justify-between border-b border-hairline/60 bg-bg/85 px-4 pt-[max(0.4rem,env(safe-area-inset-top))] pb-1.5 backdrop-blur-md"
>
	<a
		href={resolve('/')}
		class="font-display text-[16px] leading-none font-medium tracking-tight text-ink"
	>
		accrev<span class="text-accent">.</span>
	</a>
	<div class="flex items-center gap-1">
		<LangToggle />
		<ThemeToggle />
	</div>
</header>
