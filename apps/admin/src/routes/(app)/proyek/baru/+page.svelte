<script lang="ts">
	import PageHeader from '#lib/components/admin/PageHeader.svelte';
	import ProjectForm from '#lib/components/admin/ProjectForm.svelte';
</script>

<svelte:head>
	<title>Proyek baru — Azetta Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PageHeader
	eyebrow="Portofolio"
	title="Proyek baru"
	description="Lengkapi informasi proyek, lalu tampilkan di situs setelah gambar utama siap."
/>

<ProjectForm mode="create" />
