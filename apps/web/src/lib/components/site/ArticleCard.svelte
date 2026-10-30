<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- mockup: sebagian rute tujuan belum dibangun */
	import type { MockArticle } from '#lib/mock/site.js';

	interface Props {
		article: MockArticle;
	}

	let { article }: Props = $props();
</script>

<a
	class="card border border-brand-line bg-white transition-colors hover:border-brand-gray-300"
	href="/artikel/{article.slug}"
>
	<figure class="aspect-[16/9] overflow-hidden rounded-t-[1rem] bg-brand-mist">
		<img
			src={article.cover}
			alt={article.title}
			width="900"
			height="506"
			loading="lazy"
			class="h-full w-full object-cover"
		/>
	</figure>
	<div class="card-body gap-2 p-5">
		<p class="text-xs font-bold tracking-[0.18em] text-brand-gray-600 uppercase">{article.tag}</p>
		<h3 class="text-base leading-snug font-bold">{article.title}</h3>
		<p class="text-sm text-brand-gray-600">{article.excerpt}</p>
		<p class="mt-3 text-xs text-brand-gray-600">
			{article.readingMinutes} menit baca · {article.updated}
		</p>
	</div>
</a>
