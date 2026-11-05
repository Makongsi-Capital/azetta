import { error } from '@sveltejs/kit';
import { ApiRequestError, apiRequest } from '#lib/api/client.js';
import type { ApiLeadDetail } from '#lib/api/types.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, request, params }) => {
	try {
		const lead = await apiRequest<ApiLeadDetail>(
			`/api/v1/me/leads/${encodeURIComponent(params.id)}`,
			{ fetcher: fetch, cookie: request.headers.get('cookie') }
		);
		return { lead: lead.data };
	} catch (requestError) {
		if (
			requestError instanceof ApiRequestError &&
			(requestError.status === 404 || requestError.status === 403)
		) {
			error(404, 'Pengajuan tidak ditemukan');
		}
		throw requestError;
	}
};
