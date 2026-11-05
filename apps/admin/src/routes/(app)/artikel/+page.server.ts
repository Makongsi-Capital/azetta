import { apiRequest } from '#lib/server/api.js';
import type { ArticleItem } from '#lib/mock/admin.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, fetch }) => {
	const result = await apiRequest<ArticleItem[]>('/api/v1/admin/articles?perPage=100', {
		cookie: request.headers.get('cookie'),
		fetcher: fetch
	});
	return { articles: result.data };
};
