<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		eyebrow?: string;
		actions?: Snippet;
	}

	let { title, description, eyebrow, actions }: Props = $props();
</script>

<div
	class="flex flex-wrap items-end justify-between gap-4 border-b border-brand-line pb-6"
	data-testid="page-header"
>
	<div class="min-w-0">
		{#if eyebrow}
			<p class="eyebrow">{eyebrow}</p>
		{/if}
		<h1 class="mt-1 truncate text-2xl md:text-3xl">{title}</h1>
		{#if description}
			<p class="mt-2 max-w-2xl text-sm text-brand-gray-600">{description}</p>
		{/if}
	</div>

	{#if actions}
		<div class="flex flex-wrap items-center gap-2">
			{@render actions()}
		</div>
	{/if}
</div>
