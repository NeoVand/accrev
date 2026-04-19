<script lang="ts">
	type Props = {
		text: string;
		lang?: 'en' | 'fa';
		class?: string;
	};

	let { text, lang, class: className = '' }: Props = $props();

	const isPersian = $derived(
		lang === 'fa' || (lang === undefined && /[\u0600-\u06FF]/.test(text))
	);
</script>

<span lang={isPersian ? 'fa' : 'en'} dir={isPersian ? 'rtl' : 'ltr'} class={className}>
	{text}
</span>
