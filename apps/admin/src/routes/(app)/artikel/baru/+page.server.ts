import { redirect } from '@sveltejs/kit';
import { ApiRequestError, apiRequest } from '#lib/server/api.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, fetch }) => {
	const result = await apiRequest<{ id: string; name: string; email: string; role: string }[]>(
		'/api/v1/admin/users?perPage=100',
		{ cookie: request.headers.get('cookie'), fetcher: fetch }
	);
	return { staffUsers: result.data };
};

export const actions: Actions = {
	save: async ({ request, fetch }) => {
		const form = await request.formData();
		const cookie = request.headers.get('cookie');
		const payload = {
			title: String(form.get('title') ?? ''),
			slug: String(form.get('slug') ?? ''),
			excerpt: String(form.get('excerpt') ?? ''),
			content: String(form.get('content') ?? ''),
			coverImageUrl: String(form.get('coverImageUrl') ?? ''),
			tags: String(form.get('tags') ?? ''),
			readingMinutes: Number(form.get('readingMinutes') ?? 0) || null,
			authorId: String(form.get('authorId') ?? ''),
			seoTitle: String(form.get('seoTitle') ?? ''),
			seoDescription: String(form.get('seoDescription') ?? '')
		};
		const publish = form.get('status') === 'PUBLISHED';

		try {
			const created = await apiRequest<{ id: number }>('/api/v1/admin/articles', {
				method: 'POST',
				cookie,
				fetcher: fetch,
				body: payload
			});
			if (publish) {
				await apiRequest(`/api/v1/admin/articles/${created.data.id}/publish`, {
					method: 'POST',
					cookie,
					fetcher: fetch
				});
			}
			throw redirect(303, `/artikel/${created.data.id}`);
		} catch (caught) {
			if (caught instanceof ApiRequestError) {
				return { success: false, message: caught.message };
			}
			throw caught;
		}
	}
};
