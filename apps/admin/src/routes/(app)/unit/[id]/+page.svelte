<script lang="ts">
	import PageHeader from '#lib/components/admin/PageHeader.svelte';
	import StatusBadge from '#lib/components/admin/StatusBadge.svelte';
	import UnitForm from '#lib/components/admin/UnitForm.svelte';
	import { designStatusLabel, designStatusTone } from '#lib/labels.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.unit.title} — Azetta Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PageHeader eyebrow="Katalog" title={data.unit.title} description="/{data.unit.slug}">
	{#snippet actions()}
		<StatusBadge
			label={designStatusLabel[data.unit.status]}
			tone={designStatusTone[data.unit.status]}
		/>
		{#if data.unit.status === 'PUBLISHED'}
			<a
				class="btn btn-ghost btn-sm"
				href="https://azetta.id/rumah/{data.unit.slug}"
				target="_blank"
				rel="noreferrer"
			>
				<span class="icon-[mdi--open-in-new] size-4"></span>
				Lihat di situs
			</a>
		{/if}
	{/snippet}
</PageHeader>

<UnitForm unit={data.unit} mode="edit" />
