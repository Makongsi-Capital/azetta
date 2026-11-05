import { fail } from '@sveltejs/kit';
import { ApiRequestError, apiRequest } from '#lib/server/api.js';
import type { StaffUser } from '#lib/mock/admin.js';
import type { Actions, PageServerLoad } from './$types';

function handleError(caught: unknown) {
	if (caught instanceof ApiRequestError) {
		return fail(caught.status === 401 ? 400 : caught.status, { message: caught.message });
	}
	throw caught;
}

export const load: PageServerLoad = async ({ request, fetch, locals }) => {
	const result = await apiRequest<StaffUser[]>('/api/v1/admin/users?perPage=100', {
		cookie: request.headers.get('cookie'),
		fetcher: fetch
	});
	return { users: result.data, currentUser: locals.user };
};

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const form = await request.formData();
		try {
			const result = await apiRequest<{ email: string }>('/api/v1/admin/users', {
				method: 'POST',
				cookie: request.headers.get('cookie'),
				fetcher: fetch,
				body: {
					name: String(form.get('name') ?? ''),
					email: String(form.get('email') ?? ''),
					role: String(form.get('role') ?? 'admin'),
					password: String(form.get('password') ?? 'Sementara123!')
				}
			});
			return {
				success: true,
				message: `Pengguna internal dibuat. Kata sandi sementara: ${
					String(form.get('password') ?? '') || 'Sementara123!'
				}`,
				email: result.data.email
			};
		} catch (caught) {
			return handleError(caught);
		}
	},
	updateRole: async ({ request, fetch }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		try {
			await apiRequest(`/api/v1/admin/users/${id}/role`, {
				method: 'PATCH',
				cookie: request.headers.get('cookie'),
				fetcher: fetch,
				body: { role: String(form.get('role') ?? '') }
			});
		} catch (caught) {
			return handleError(caught);
		}
		return { success: true, message: 'Peran pengguna diperbarui.' };
	},
	setDisabled: async ({ request, fetch }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		try {
			await apiRequest(`/api/v1/admin/users/${id}/disable`, {
				method: 'POST',
				cookie: request.headers.get('cookie'),
				fetcher: fetch,
				body: { banned: form.get('banned') === 'true' }
			});
		} catch (caught) {
			return handleError(caught);
		}
		return { success: true, message: 'Status akun diperbarui.' };
	}
};
