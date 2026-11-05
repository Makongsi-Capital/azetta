import { error, fail } from '@sveltejs/kit';
import { ApiRequestError, apiRequest } from '#lib/server/api.js';
import { mapLead } from '#lib/server/mappers.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, fetch, params, locals }) => {
	const cookie = request.headers.get('cookie');

	try {
		const [lead, staff] = await Promise.all([
			apiRequest<Parameters<typeof mapLead>[0]>(`/api/v1/admin/leads/${params.id}`, {
				cookie,
				fetcher: fetch
			}),
			apiRequest<{ id: string; name: string; email: string; role: string }[]>(
				'/api/v1/admin/users?perPage=100',
				{ cookie, fetcher: fetch }
			)
		]);

		return {
			lead: mapLead(lead.data),
			staffUsers: staff.data,
			currentUser: locals.user
		};
	} catch (caught) {
		if (caught instanceof ApiRequestError && caught.status === 404) {
			throw error(404, 'Lead tidak ditemukan.');
		}
		throw caught;
	}
};

export const actions: Actions = {
	saveHandling: async ({ request, fetch, params }) => {
		const form = await request.formData();
		const status = String(form.get('status') ?? '');
		const priority = String(form.get('priority') ?? '');
		const assignee = String(form.get('assignee') ?? '');
		const estimatedValue = String(form.get('estimatedValue') ?? '');
		const followUp = String(form.get('followUp') ?? '');
		const lostReason = String(form.get('lostReason') ?? '');
		const customerNote = String(form.get('customerNote') ?? '');
		const persistedStatus = String(form.get('persistedStatus') ?? '');
		const cookie = request.headers.get('cookie');

		try {
			await apiRequest(`/api/v1/admin/leads/${params.id}`, {
				method: 'PATCH',
				cookie,
				fetcher: fetch,
				body: {
					priority,
					assignedToId: assignee || null,
					estimatedValue: estimatedValue || null,
					nextFollowUpAt: followUp ? `${followUp}T09:00:00.000Z` : null,
					customerNote
				}
			});

			if (status !== persistedStatus) {
				await apiRequest(`/api/v1/admin/leads/${params.id}/status`, {
					method: 'POST',
					cookie,
					fetcher: fetch,
					body: { status, lostReason: lostReason || undefined }
				});
			}
		} catch (caught) {
			if (caught instanceof ApiRequestError) {
				return fail(caught.status === 401 ? 400 : caught.status, { message: caught.message });
			}
			throw caught;
		}

		return { success: true, message: 'Perubahan penanganan disimpan.' };
	},
	addActivity: async ({ request, fetch, params }) => {
		const form = await request.formData();
		const type = String(form.get('type') ?? 'NOTE');
		const body = String(form.get('body') ?? '').trim();
		if (!body) return fail(400, { message: 'Catatan aktivitas wajib diisi.' });

		try {
			await apiRequest(`/api/v1/admin/leads/${params.id}/activities`, {
				method: 'POST',
				cookie: request.headers.get('cookie'),
				fetcher: fetch,
				body: { type, body }
			});
		} catch (caught) {
			if (caught instanceof ApiRequestError) {
				return fail(caught.status === 401 ? 400 : caught.status, { message: caught.message });
			}
			throw caught;
		}

		return { success: true, message: 'Aktivitas baru dicatat.' };
	},
	deleteActivity: async ({ request, fetch, params }) => {
		const form = await request.formData();
		const activityId = String(form.get('activityId') ?? '');
		try {
			await apiRequest(`/api/v1/admin/leads/${params.id}/activities/${activityId}`, {
				method: 'DELETE',
				cookie: request.headers.get('cookie'),
				fetcher: fetch
			});
		} catch (caught) {
			if (caught instanceof ApiRequestError) {
				return fail(caught.status === 401 ? 400 : caught.status, { message: caught.message });
			}
			throw caught;
		}
		return { success: true, message: 'Aktivitas dihapus.' };
	}
};
