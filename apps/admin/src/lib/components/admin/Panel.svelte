<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		description?: string;
		actions?: Snippet;
		children: Snippet;
		padded?: boolean;
	}

	let { title, description, actions, children, padded = true }: Props = $props();
</script>

<section class="border border-brand-line bg-white">
	{#if title || actions}
		<div
			class="flex flex-wrap items-start justify-between gap-3 border-b border-brand-line px-5 py-4"
		>
			<div>
				{#if title}
					<h2 class="font-bold">{title}</h2>
				{/if}
				{#if description}
					<p class="mt-1 text-xs text-brand-gray-600">{description}</p>
				{/if}
			</div>
			{#if actions}
				<div class="flex flex-wrap items-center gap-2">
					{@render actions()}
				</div>
			{/if}
		</div>
	{/if}

	<div class={padded ? 'p-5' : ''}>
		{@render children()}
	</div>
</section>
