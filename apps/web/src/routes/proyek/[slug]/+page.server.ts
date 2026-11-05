import { error } from '@sveltejs/kit';
import { ApiRequestError, apiRequest } from '#lib/api/client.js';
import type { ApiProject, ApiUnit } from '#lib/api/types.js';
import { toProject, toUnit } from '#lib/api/view.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const path = `/api/v1/public/projects/${encodeURIComponent(params.slug)}`;

	try {
		const [project, units] = await Promise.all([
			apiRequest<ApiProject>(path, { fetcher: fetch }),
			apiRequest<ApiUnit[]>('/api/v1/public/units', {
				fetcher: fetch,
				query: { project: params.slug, perPage: 50 }
			}).catch(() => null)
		]);

		return {
			project: toProject(project.data),
			units: (units?.data ?? []).map(toUnit)
		};
	} catch (requestError) {
		if (requestError instanceof ApiRequestError && requestError.status === 404) {
			error(404, 'Proyek tidak ditemukan');
		}
		throw requestError;
	}
};
