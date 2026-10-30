<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve, svelte/no-at-html-tags -- mockup: sebagian rute belum dibangun; JSON-LD berasal dari konstanta yang di-escape. */
	import ArticleCard from '#lib/components/site/ArticleCard.svelte';
	import SectionHeading from '#lib/components/site/SectionHeading.svelte';
	import { jsonLdScript } from '#lib/seo.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const article = $derived(data.article);

	const jsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: article.title,
		description: article.excerpt,
		image: article.cover,
		datePublished: article.updated,
		author: { '@type': 'Organization', name: 'Azetta' },
		publisher: { '@type': 'Organization', name: 'Azetta' }
	});
</script>

<svelte:head>
	<title>{article.title} | Azetta</title>
	<meta name="description" content={article.excerpt} />
	{@html jsonLdScript(jsonLd)}
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-10">
	<nav class="text-sm text-brand-gray-600" aria-label="Breadcrumb">
		<ol class="flex flex-wrap items-center gap-2">
			<li><a class="link link-hover" href="/">Beranda</a></li>
			<li aria-hidden="true">/</li>
			<li><a class="link link-hover" href="/artikel">Artikel</a></li>
			<li aria-hidden="true">/</li>
			<li><span class="font-bold text-base-content" aria-current="page">{article.tag}</span></li>
		</ol>
	</nav>

	<p class="eyebrow mt-6">{article.tag}</p>
	<h1 class="mt-3 text-3xl md:text-4xl">{article.title}</h1>
	<p class="mt-4 text-brand-gray-600">{article.excerpt}</p>
	<p class="mt-4 text-xs text-brand-gray-600">
		{article.updated} · {article.readingMinutes} menit baca
	</p>
</div>

<figure class="mx-auto max-w-5xl px-4">
	<img
		src={article.cover}
		alt={article.title}
		width="1200"
		height="675"
		fetchpriority="high"
		class="aspect-[16/9] w-full rounded-[1rem] border border-brand-line object-cover"
	/>
</figure>

<article class="mx-auto max-w-3xl px-4 py-10">
	{#each article.sections as section (section.heading)}
		<section class="mt-10 first:mt-0">
			<h2 class="text-xl">{section.heading}</h2>
			{#each section.paragraphs as paragraph (paragraph)}
				<p class="mt-3 text-brand-gray-600">{paragraph}</p>
			{/each}
		</section>
	{/each}

	<div class="mt-12 rounded-[1rem] border border-brand-line bg-white p-6">
		<p class="font-bold">Butuh angka atau dokumen yang lebih spesifik?</p>
		<p class="mt-2 text-sm text-brand-gray-600">
			Tim kami bisa mengirim daftar unit atau skema kerja sama lahan yang sesuai dengan kondisi
			Anda.
		</p>
		<div class="mt-4 flex flex-wrap gap-2">
			<a class="btn btn-primary btn-sm" href="/kontak">Hubungi kami</a>
			<a class="btn btn-ghost btn-sm" href="/rumah">Lihat unit</a>
		</div>
	</div>
</article>

<section class="border-t border-brand-line bg-brand-mist">
	<div class="mx-auto max-w-6xl px-4 py-16">
		<SectionHeading title="Artikel lain" href="/artikel" linkLabel="Lihat semua artikel" />
		<div class="mt-6 grid gap-5 sm:grid-cols-2">
			{#each data.related as item (item.slug)}
				<ArticleCard article={item} />
			{/each}
		</div>
	</div>
</section>
