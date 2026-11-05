<script lang="ts">
	import ArticleForm from '#lib/components/admin/ArticleForm.svelte';
	import PageHeader from '#lib/components/admin/PageHeader.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Artikel baru — Azetta Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PageHeader
	eyebrow="Konten"
	title="Artikel baru"
	description="Tulis draf, lengkapi ringkasan dan sampul, lalu terbitkan setelah ditinjau."
/>

<ArticleForm mode="create" staffUsers={data.staffUsers} />
