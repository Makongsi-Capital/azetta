<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve */
	interface Props {
		eyebrow?: string;
		title: string;
		description?: string;
		href?: string;
		linkLabel?: string;
		tone?: 'light' | 'dark';
	}

	let {
		eyebrow,
		title,
		description,
		href,
		linkLabel = 'Lihat semua',
		tone = 'light'
	}: Props = $props();
</script>

<div class="flex flex-wrap items-end justify-between gap-4">
	<div>
		{#if eyebrow}
			<p class="eyebrow">{eyebrow}</p>
		{/if}
		<h2 class="mt-2 text-2xl md:text-3xl">{title}</h2>
		{#if description}
			<p
				class="mt-2 max-w-2xl text-sm {tone === 'dark'
					? 'text-brand-gray-300'
					: 'text-brand-gray-600'}"
			>
				{description}
			</p>
		{/if}
	</div>
	{#if href}
		<a class="btn btn-ghost btn-sm" {href}>
			{linkLabel}
			<span class="icon-[mdi--arrow-right] size-4"></span>
		</a>
	{/if}
</div>
