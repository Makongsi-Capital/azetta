<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- mockup: sebagian rute tujuan belum dibangun */
	interface Props {
		title: string;
		eyebrow?: string;
		description?: string;
		breadcrumb?: { label: string; href?: string }[];
	}

	let { title, eyebrow, description, breadcrumb = [] }: Props = $props();
</script>

<div class="border-b border-brand-line bg-base-100">
	<div class="mx-auto max-w-6xl px-4 py-10">
		{#if breadcrumb.length > 0}
			<nav class="text-sm text-brand-gray-600" aria-label="Breadcrumb">
				<ol class="flex flex-wrap items-center gap-2">
					{#each breadcrumb as crumb, index (crumb.label)}
						<li class="flex items-center gap-2">
							{#if crumb.href}
								<a class="link link-hover" href={crumb.href}>{crumb.label}</a>
							{:else}
								<span class="font-bold text-base-content" aria-current="page">{crumb.label}</span>
							{/if}
							{#if index < breadcrumb.length - 1}
								<span aria-hidden="true">/</span>
							{/if}
						</li>
					{/each}
				</ol>
			</nav>
		{/if}

		{#if eyebrow}
			<p class="eyebrow {breadcrumb.length > 0 ? 'mt-6' : ''}">{eyebrow}</p>
		{/if}
		<h1 class="mt-3 text-3xl md:text-4xl">{title}</h1>
		{#if description}
			<p class="mt-3 max-w-2xl text-brand-gray-600">{description}</p>
		{/if}
	</div>
</div>
