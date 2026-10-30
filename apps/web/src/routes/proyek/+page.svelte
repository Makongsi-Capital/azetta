<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- mockup: sebagian rute tujuan belum dibangun */
	import ProjectCard from '#lib/components/site/ProjectCard.svelte';
	import SectionHeading from '#lib/components/site/SectionHeading.svelte';
	import { projects } from '#lib/mock/site.js';

	const ongoing = projects.filter((project) => project.status === 'SEDANG BERJALAN');
	const completed = projects.filter((project) => project.status === 'SELESAI');
</script>

<svelte:head>
	<title>Proyek Azetta — Portofolio Pengembangan Lahan</title>
	<meta
		name="description"
		content="Lihat proyek yang sedang berjalan dan telah selesai dikembangkan Azetta, lengkap dengan lokasi, tahun, dan jumlah unitnya."
	/>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10">
	<nav class="text-sm text-brand-gray-600" aria-label="Breadcrumb">
		<ol class="flex items-center gap-2">
			<li><a class="link link-hover" href="/">Beranda</a></li>
			<li aria-hidden="true">/</li>
			<li><span class="font-bold text-base-content" aria-current="page">Proyek</span></li>
		</ol>
	</nav>

	<div class="mt-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-3xl md:text-4xl">Proyek Azetta</h1>
			<p class="mt-3 max-w-2xl text-sm text-brand-gray-600">
				Setiap proyek dipublikasikan setelah ada persetujuan tertulis dari pemilik lahan. Yang belum
				lengkap dokumennya tidak kami tampilkan.
			</p>
		</div>
		<span class="badge badge-outline badge-lg border-brand-line bg-white">
			{ongoing.length} berjalan · {completed.length} selesai
		</span>
	</div>
</div>

<section class="mx-auto max-w-6xl px-4 pb-16">
	<SectionHeading title="Proyek yang sedang dikerjakan" />
	<div class="mt-8 grid gap-5 md:grid-cols-2">
		{#each ongoing as project (project.slug)}
			<ProjectCard {project} />
		{/each}
	</div>
</section>

<section class="border-y border-brand-line bg-brand-mist">
	<div class="mx-auto max-w-6xl px-4 py-16">
		<SectionHeading title="Proyek yang sudah diserahterimakan" />
		<div class="mt-8 grid gap-5 md:grid-cols-2">
			{#each completed as project (project.slug)}
				<ProjectCard {project} />
			{/each}
		</div>
	</div>
</section>
