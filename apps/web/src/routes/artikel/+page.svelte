<script lang="ts">
	import ArticleCard from '#lib/components/site/ArticleCard.svelte';
	import PageHero from '#lib/components/site/PageHero.svelte';
	import { articles } from '#lib/mock/site.js';

	const topics = ['Semua', 'Rumah', 'Lahan', 'Biaya', 'Investasi'];
</script>

<svelte:head>
	<title>Artikel — Panduan Properti Azetta</title>
	<meta
		name="description"
		content="Panduan praktis seputar membeli rumah, kerja sama lahan, biaya bangun, dan investasi properti dari tim Azetta."
	/>
</svelte:head>

<PageHero
	breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Artikel' }]}
	eyebrow="Artikel"
	title="Panduan sebelum Anda memutuskan"
	description="Tulisan pendek yang menjelaskan istilah, biaya, dan dokumen — supaya keputusan properti tidak bergantung pada penjelasan lisan."
/>

<div class="mx-auto max-w-6xl px-4 py-12">
	<div class="flex flex-wrap gap-2">
		{#each topics as topic, index (topic)}
			<span class="badge badge-lg {index === 0 ? 'badge-neutral' : 'badge-outline'}">
				{topic}
			</span>
		{/each}
	</div>

	<div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
		{#each articles as article (article.slug)}
			<ArticleCard {article} />
		{/each}
	</div>

	<p class="mt-8 text-sm text-brand-gray-600">
		Kategori dan pencarian artikel diaktifkan setelah konten bertambah. Untuk saat ini, seluruh
		tulisan ditampilkan dalam satu daftar.
	</p>
</div>
