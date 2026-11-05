import { ApiRequestError, apiRequest } from '#lib/api/client.js';
import type { ApiLead, ApiProfile } from '#lib/api/types.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, request }) => {
	const cookie = request.headers.get('cookie');

	try {
		const [profile, leads] = await Promise.all([
			apiRequest<ApiProfile>('/api/v1/me', { fetcher: fetch, cookie }),
			apiRequest<ApiLead[]>('/api/v1/me/leads', { fetcher: fetch, cookie })
		]);

		return {
			verified: true,
			profile: profile.data,
			leads: leads.data ?? []
		};
	} catch (error) {
		if (error instanceof ApiRequestError && error.status === 403) {
			return { verified: false, profile: null, leads: [] as ApiLead[] };
		}
		throw error;
	}
};
