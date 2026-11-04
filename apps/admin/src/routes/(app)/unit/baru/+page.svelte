<script lang="ts">
	import PageHeader from '#lib/components/admin/PageHeader.svelte';
	import UnitForm from '#lib/components/admin/UnitForm.svelte';
</script>

<svelte:head>
	<title>Unit baru — Azetta Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PageHeader
	eyebrow="Katalog"
	title="Unit baru"
	description="Simpan sebagai draf terlebih dahulu, lengkapi media dan SEO, lalu terbitkan."
/>

<UnitForm mode="create" />
