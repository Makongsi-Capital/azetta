import { apiRequest } from '#lib/api/client.js';
import type { ApiArticle } from '#lib/api/types.js';
import { toArticle } from '#lib/api/view.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const tag = url.searchParams.get('tag') ?? undefined;

	const articles = await apiRequest<ApiArticle[]>('/api/v1/public/articles', {
		fetcher: fetch,
		query: { perPage: 50, tag }
	}).catch(() => null);

	return {
		articles: (articles?.data ?? []).map(toArticle),
		activeTag: tag ?? null
	};
};
