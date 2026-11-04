<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- href diterima dari prop pemanggil */
	interface Props {
		title: string;
		description?: string;
		icon?: string;
		actionLabel?: string;
		actionHref?: string;
		onaction?: () => void;
	}

	let {
		title,
		description,
		icon = 'icon-[mdi--inbox-outline]',
		actionLabel,
		actionHref,
		onaction
	}: Props = $props();
</script>

<div
	class="flex flex-col items-center justify-center border border-dashed border-brand-line px-6 py-12 text-center"
>
	<span class="{icon} size-10 text-brand-gray-300"></span>
	<p class="mt-4 font-bold">{title}</p>
	{#if description}
		<p class="mt-1 max-w-sm text-sm text-brand-gray-600">{description}</p>
	{/if}
	{#if actionLabel && actionHref}
		<a class="btn btn-primary btn-sm mt-5" href={actionHref}>{actionLabel}</a>
	{:else if actionLabel && onaction}
		<button class="btn btn-primary btn-sm mt-5" type="button" onclick={onaction}
			>{actionLabel}</button
		>
	{/if}
</div>
