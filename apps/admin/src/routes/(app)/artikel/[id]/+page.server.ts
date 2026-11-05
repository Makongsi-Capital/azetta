import { error, redirect } from '@sveltejs/kit';
import { ApiRequestError, apiRequest } from '#lib/server/api.js';
import type { ArticleItem } from '#lib/mock/admin.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, fetch, params }) => {
	const cookie = request.headers.get('cookie');
	try {
		const [article, staff] = await Promise.all([
			apiRequest<ArticleItem>(`/api/v1/admin/articles/${params.id}`, {
				cookie,
				fetcher: fetch
			}),
			apiRequest<{ id: string; name: string; email: string; role: string }[]>(
				'/api/v1/admin/users?perPage=100',
				{ cookie, fetcher: fetch }
			)
		]);
		return { article: article.data, staffUsers: staff.data };
	} catch (caught) {
		if (caught instanceof ApiRequestError && caught.status === 404) {
			throw error(404, 'Artikel tidak ditemukan.');
		}
		throw caught;
	}
};

export const actions: Actions = {
	save: async ({ request, fetch, params }) => {
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
			await apiRequest(`/api/v1/admin/articles/${params.id}`, {
				method: 'PATCH',
				cookie,
				fetcher: fetch,
				body: payload
			});
			if (publish) {
				await apiRequest(`/api/v1/admin/articles/${params.id}/publish`, {
					method: 'POST',
					cookie,
					fetcher: fetch
				});
			}
		} catch (caught) {
			if (caught instanceof ApiRequestError) {
				return { success: false, message: caught.message };
			}
			throw caught;
		}

		throw redirect(303, `/artikel/${params.id}`);
	}
};
