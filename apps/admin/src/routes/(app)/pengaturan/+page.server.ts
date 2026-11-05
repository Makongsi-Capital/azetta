import { fail } from '@sveltejs/kit';
import { ApiRequestError, apiRequest } from '#lib/server/api.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, fetch, locals }) => {
	const result = await apiRequest<Record<string, unknown>>('/api/v1/admin/settings', {
		cookie: request.headers.get('cookie'),
		fetcher: fetch
	});
	return { settings: result.data, currentUser: locals.user };
};

export const actions: Actions = {
	save: async ({ request, fetch }) => {
		const form = await request.formData();
		const site: Record<string, string> = {};
		for (const [key, value] of form.entries()) {
			if (typeof value === 'string') site[key] = value;
		}

		try {
			await apiRequest('/api/v1/admin/settings', {
				method: 'PATCH',
				cookie: request.headers.get('cookie'),
				fetcher: fetch,
				body: { site }
			});
		} catch (caught) {
			if (caught instanceof ApiRequestError) {
				return fail(caught.status === 401 ? 400 : caught.status, { message: caught.message });
			}
			throw caught;
		}
		return { success: true, message: 'Pengaturan disimpan.' };
	}
};
