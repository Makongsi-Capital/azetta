<script lang="ts">
	import ArticleForm from '#lib/components/admin/ArticleForm.svelte';
	import PageHeader from '#lib/components/admin/PageHeader.svelte';
	import StatusBadge from '#lib/components/admin/StatusBadge.svelte';
	import { articleStatusLabel, articleStatusTone } from '#lib/labels.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.article.title} — Azetta Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PageHeader eyebrow="Konten" title={data.article.title} description="/{data.article.slug}">
	{#snippet actions()}
		<StatusBadge
			label={articleStatusLabel[data.article.status]}
			tone={articleStatusTone[data.article.status]}
		/>
		{#if data.article.status === 'PUBLISHED'}
			<a
				class="btn btn-ghost btn-sm"
				href="https://azetta.id/artikel/{data.article.slug}"
				target="_blank"
				rel="noreferrer"
			>
				<span class="icon-[mdi--open-in-new] size-4"></span>
				Lihat di situs
			</a>
		{/if}
	{/snippet}
</PageHeader>

<ArticleForm article={data.article} mode="edit" />
