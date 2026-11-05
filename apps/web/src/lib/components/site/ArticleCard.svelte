<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- href dibangun dari slug data API */
	import type { ArticleView } from '#lib/api/view.js';

	interface Props {
		article: ArticleView;
	}

	let { article }: Props = $props();
</script>

<a
	class="card border border-brand-line bg-white transition-colors hover:border-brand-gray-300"
	href="/artikel/{article.slug}"
>
	<figure class="aspect-[16/9] overflow-hidden rounded-t-[1rem] bg-brand-mist">
		{#if article.cover}
			<img
				src={article.cover}
				alt={article.title}
				width="900"
				height="506"
				loading="lazy"
				class="h-full w-full object-cover"
			/>
		{:else}
			<span class="grid h-full w-full place-items-center text-sm text-brand-gray-600">
				Foto belum tersedia
			</span>
		{/if}
	</figure>
	<div class="card-body gap-2 p-5">
		<p class="text-xs font-bold tracking-[0.18em] text-brand-gray-600 uppercase">{article.tag}</p>
		<h3 class="text-base leading-snug font-bold">{article.title}</h3>
		<p class="text-sm text-brand-gray-600">{article.excerpt}</p>
		<p class="mt-3 text-xs text-brand-gray-600">
			{article.readingMinutes ?? '—'} menit baca{article.updated ? ` · ${article.updated}` : ''}
		</p>
	</div>
</a>
