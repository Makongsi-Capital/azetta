import { apiRequest } from '#lib/api/client.js';
import type { ApiProject } from '#lib/api/types.js';
import { toProject } from '#lib/api/view.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const projects = await apiRequest<ApiProject[]>('/api/v1/public/projects', {
		fetcher: fetch,
		query: { perPage: 50 }
	}).catch(() => null);

	return {
		projects: (projects?.data ?? []).map(toProject)
	};
};
