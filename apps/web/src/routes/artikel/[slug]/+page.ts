import { error } from '@sveltejs/kit';
import { articles, findArticle } from '#lib/mock/site.js';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const article = findArticle(params.slug);

	if (!article) error(404, 'Artikel tidak ditemukan');

	return {
		article,
		related: articles.filter((item) => item.slug !== article.slug).slice(0, 2)
	};
};
