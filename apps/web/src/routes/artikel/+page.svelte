<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- sebagian href dibangun dari data API */
	import ArticleCard from '#lib/components/site/ArticleCard.svelte';
	import PageHero from '#lib/components/site/PageHero.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const topics = $derived([
		{ slug: null, label: 'Semua' },
		...[...new Set(data.articles.flatMap((article) => article.tags))].map((tag) => ({
			slug: tag,
			label: tag
		}))
	]);
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
		{#each topics as topic (topic.label)}
			<a
				class="badge badge-lg {data.activeTag === topic.slug ? 'badge-neutral' : 'badge-outline'}"
				href={topic.slug ? `/artikel?tag=${encodeURIComponent(topic.slug)}` : '/artikel'}
			>
				{topic.label}
			</a>
		{/each}
	</div>

	{#if data.articles.length === 0}
		<p
			class="mt-8 rounded-[1rem] border border-brand-line bg-white p-6 text-sm text-brand-gray-600"
		>
			Belum ada artikel yang dipublikasikan.
		</p>
	{:else}
		<div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.articles as article (article.slug)}
				<ArticleCard {article} />
			{/each}
		</div>
	{/if}
</div>
