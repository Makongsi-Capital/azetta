import { fail } from '@sveltejs/kit';
import { ApiRequestError, apiRequest } from '#lib/server/api.js';
import type { TestimonialItem } from '#lib/mock/admin.js';
import type { Actions, PageServerLoad } from './$types';

function handleError(caught: unknown) {
	if (caught instanceof ApiRequestError) {
		return fail(caught.status === 401 ? 400 : caught.status, { message: caught.message });
	}
	throw caught;
}

export const load: PageServerLoad = async ({ request, fetch }) => {
	const result = await apiRequest<TestimonialItem[]>('/api/v1/admin/testimonials?perPage=100', {
		cookie: request.headers.get('cookie'),
		fetcher: fetch
	});
	return { testimonials: result.data };
};

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const form = await request.formData();
		try {
			await apiRequest('/api/v1/admin/testimonials', {
				method: 'POST',
				cookie: request.headers.get('cookie'),
				fetcher: fetch,
				body: {
					name: String(form.get('name') ?? ''),
					role: String(form.get('role') ?? ''),
					projectName: String(form.get('projectName') ?? ''),
					quote: String(form.get('quote') ?? ''),
					avatarUrl: String(form.get('avatarUrl') ?? ''),
					isPublished: form.get('isPublished') === 'true',
					sortOrder: Number(form.get('sortOrder') ?? 0)
				}
			});
		} catch (caught) {
			return handleError(caught);
		}
		return { success: true, message: 'Testimoni baru ditambahkan.' };
	},
	update: async ({ request, fetch }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		try {
			await apiRequest(`/api/v1/admin/testimonials/${id}`, {
				method: 'PATCH',
				cookie: request.headers.get('cookie'),
				fetcher: fetch,
				body: {
					name: String(form.get('name') ?? ''),
					role: String(form.get('role') ?? ''),
					projectName: String(form.get('projectName') ?? ''),
					quote: String(form.get('quote') ?? ''),
					avatarUrl: String(form.get('avatarUrl') ?? ''),
					isPublished: form.get('isPublished') === 'true',
					sortOrder: Number(form.get('sortOrder') ?? 0)
				}
			});
		} catch (caught) {
			return handleError(caught);
		}
		return { success: true, message: 'Testimoni diperbarui.' };
	},
	delete: async ({ request, fetch }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		try {
			await apiRequest(`/api/v1/admin/testimonials/${id}`, {
				method: 'DELETE',
				cookie: request.headers.get('cookie'),
				fetcher: fetch
			});
		} catch (caught) {
			return handleError(caught);
		}
		return { success: true, message: 'Testimoni dihapus.' };
	},
	toggle: async ({ request, fetch }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		try {
			await apiRequest(`/api/v1/admin/testimonials/${id}`, {
				method: 'PATCH',
				cookie: request.headers.get('cookie'),
				fetcher: fetch,
				body: { isPublished: form.get('isPublished') === 'true' }
			});
		} catch (caught) {
			return handleError(caught);
		}
		return { success: true, message: 'Status testimoni diperbarui.' };
	}
};
