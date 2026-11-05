import { fail } from '@sveltejs/kit';
import { ApiRequestError, apiRequest } from '#lib/server/api.js';
import { mapLead } from '#lib/server/mappers.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, fetch, locals, url }) => {
	const cookie = request.headers.get('cookie');
	const query = url.searchParams.get('q');
	const search = query ? `&q=${encodeURIComponent(query)}` : '';

	const [leads, stats] = await Promise.all([
		apiRequest<Parameters<typeof mapLead>[0][]>(
			`/api/v1/admin/leads?perPage=100&sort=-createdAt${search}`,
			{ cookie, fetcher: fetch }
		),
		apiRequest<{ new: number; notContacted: number; mine: number }>('/api/v1/admin/leads/stats', {
			cookie,
			fetcher: fetch
		})
	]);

	return {
		leads: leads.data.map(mapLead),
		stats: stats.data,
		currentUser: locals.user
	};
};

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const form = await request.formData();
		try {
			await apiRequest('/api/v1/admin/leads', {
				method: 'POST',
				cookie: request.headers.get('cookie'),
				fetcher: fetch,
				body: {
					name: String(form.get('name') ?? ''),
					phone: String(form.get('phone') ?? ''),
					email: String(form.get('email') ?? ''),
					city: String(form.get('city') ?? ''),
					type: String(form.get('type') ?? 'GENERAL'),
					priority: String(form.get('priority') ?? 'NORMAL'),
					message: String(form.get('message') ?? '')
				}
			});
		} catch (caught) {
			if (caught instanceof ApiRequestError) {
				return fail(caught.status === 401 ? 400 : caught.status, { message: caught.message });
			}
			throw caught;
		}
		return { success: true, message: 'Lead baru ditambahkan.' };
	}
};
