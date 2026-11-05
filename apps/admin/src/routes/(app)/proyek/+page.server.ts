import { apiRequest } from '#lib/server/api.js';
import type { ProjectItem } from '#lib/mock/admin.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, fetch }) => {
	const result = await apiRequest<ProjectItem[]>('/api/v1/admin/projects?perPage=100', {
		cookie: request.headers.get('cookie'),
		fetcher: fetch
	});
	return { projects: result.data };
};
