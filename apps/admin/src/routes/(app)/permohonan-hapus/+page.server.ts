import { fail } from '@sveltejs/kit';
import { ApiRequestError, apiRequest } from '#lib/server/api.js';
import type { DeletionRequest } from '#lib/mock/admin.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, fetch, locals }) => {
	const result = await apiRequest<DeletionRequest[]>(
		'/api/v1/admin/account-deletion-requests?perPage=100',
		{ cookie: request.headers.get('cookie'), fetcher: fetch }
	);
	return { requests: result.data, currentUser: locals.user };
};

export const actions: Actions = {
	process: async ({ request, fetch }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		try {
			await apiRequest(`/api/v1/admin/account-deletion-requests/${id}`, {
				method: 'PATCH',
				cookie: request.headers.get('cookie'),
				fetcher: fetch,
				body: {
					status: String(form.get('status') ?? 'COMPLETED'),
					note: String(form.get('note') ?? '')
				}
			});
		} catch (caught) {
			if (caught instanceof ApiRequestError) {
				return fail(caught.status === 401 ? 400 : caught.status, { message: caught.message });
			}
			throw caught;
		}
		return { success: true, message: 'Permohonan diproses.' };
	}
};
