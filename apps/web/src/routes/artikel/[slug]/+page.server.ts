import { error } from '@sveltejs/kit';
import { ApiRequestError, apiRequest } from '#lib/api/client.js';
import type { ApiArticle } from '#lib/api/types.js';
import { toArticle } from '#lib/api/view.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const path = `/api/v1/public/articles/${encodeURIComponent(params.slug)}`;

	try {
		const [article, list] = await Promise.all([
			apiRequest<ApiArticle>(path, { fetcher: fetch }),
			apiRequest<ApiArticle[]>('/api/v1/public/articles', {
				fetcher: fetch,
				query: { perPage: 10 }
			}).catch(() => null)
		]);

		return {
			article: toArticle(article.data),
			related: (list?.data ?? [])
				.filter((item) => item.slug !== params.slug)
				.slice(0, 2)
				.map(toArticle)
		};
	} catch (requestError) {
		if (requestError instanceof ApiRequestError && requestError.status === 404) {
			error(404, 'Artikel tidak ditemukan');
		}
		throw requestError;
	}
};
