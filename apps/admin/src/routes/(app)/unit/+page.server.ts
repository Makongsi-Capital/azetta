import { apiRequest } from '#lib/server/api.js';
import { mapUnit } from '#lib/server/mappers.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, fetch }) => {
	const result = await apiRequest<Parameters<typeof mapUnit>[0][]>(
		'/api/v1/admin/units?perPage=100',
		{ cookie: request.headers.get('cookie'), fetcher: fetch }
	);

	return { units: result.data.map(mapUnit) };
};
