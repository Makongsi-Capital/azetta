<script lang="ts">
	import PageHeader from '#lib/components/admin/PageHeader.svelte';
	import ProjectForm from '#lib/components/admin/ProjectForm.svelte';
	import StatusBadge from '#lib/components/admin/StatusBadge.svelte';
	import { projectStatusLabel, projectStatusTone } from '#lib/labels.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.project.title} — Azetta Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PageHeader eyebrow="Portofolio" title={data.project.title} description="/{data.project.slug}">
	{#snippet actions()}
		<StatusBadge
			label={projectStatusLabel[data.project.status]}
			tone={projectStatusTone[data.project.status]}
		/>
		{#if data.project.isPublished}
			<a
				class="btn btn-ghost btn-sm"
				href="https://azetta.id/proyek/{data.project.slug}"
				target="_blank"
				rel="noreferrer"
			>
				<span class="icon-[mdi--open-in-new] size-4"></span>
				Lihat di situs
			</a>
		{/if}
	{/snippet}
</PageHeader>

<ProjectForm project={data.project} mode="edit" />
