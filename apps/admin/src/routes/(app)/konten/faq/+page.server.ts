import { fail } from '@sveltejs/kit';
import { ApiRequestError, apiRequest } from '#lib/server/api.js';
import type { FaqItem } from '#lib/mock/admin.js';
import type { Actions, PageServerLoad } from './$types';

function handleError(caught: unknown) {
	if (caught instanceof ApiRequestError) {
		return fail(caught.status === 401 ? 400 : caught.status, { message: caught.message });
	}
	throw caught;
}

export const load: PageServerLoad = async ({ request, fetch }) => {
	const result = await apiRequest<FaqItem[]>('/api/v1/admin/faqs?perPage=100', {
		cookie: request.headers.get('cookie'),
		fetcher: fetch
	});
	return { faqs: result.data };
};

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const form = await request.formData();
		try {
			await apiRequest('/api/v1/admin/faqs', {
				method: 'POST',
				cookie: request.headers.get('cookie'),
				fetcher: fetch,
				body: {
					question: String(form.get('question') ?? ''),
					answer: String(form.get('answer') ?? ''),
					category: String(form.get('category') ?? 'umum'),
					sortOrder: Number(form.get('sortOrder') ?? 0),
					isActive: form.get('isActive') !== 'false'
				}
			});
		} catch (caught) {
			return handleError(caught);
		}
		return { success: true, message: 'FAQ baru ditambahkan.' };
	},
	update: async ({ request, fetch }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		try {
			await apiRequest(`/api/v1/admin/faqs/${id}`, {
				method: 'PATCH',
				cookie: request.headers.get('cookie'),
				fetcher: fetch,
				body: {
					question: String(form.get('question') ?? ''),
					answer: String(form.get('answer') ?? ''),
					category: String(form.get('category') ?? 'umum'),
					sortOrder: Number(form.get('sortOrder') ?? 0),
					isActive: form.get('isActive') !== 'false'
				}
			});
		} catch (caught) {
			return handleError(caught);
		}
		return { success: true, message: 'FAQ diperbarui.' };
	},
	delete: async ({ request, fetch }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		try {
			await apiRequest(`/api/v1/admin/faqs/${id}`, {
				method: 'DELETE',
				cookie: request.headers.get('cookie'),
				fetcher: fetch
			});
		} catch (caught) {
			return handleError(caught);
		}
		return { success: true, message: 'FAQ dihapus.' };
	},
	toggle: async ({ request, fetch }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		try {
			await apiRequest(`/api/v1/admin/faqs/${id}`, {
				method: 'PATCH',
				cookie: request.headers.get('cookie'),
				fetcher: fetch,
				body: { isActive: form.get('isActive') === 'true' }
			});
		} catch (caught) {
			return handleError(caught);
		}
		return { success: true, message: 'Status FAQ diperbarui.' };
	}
};
