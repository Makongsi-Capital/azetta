import { redirect } from '@sveltejs/kit';
import { ApiRequestError, apiRequest } from '#lib/server/api.js';
import type { Actions } from './$types';

export const actions: Actions = {
	save: async ({ request, fetch }) => {
		const form = await request.formData();
		const cookie = request.headers.get('cookie');
		const payload = {
			title: String(form.get('title') ?? ''),
			slug: String(form.get('slug') ?? ''),
			summary: String(form.get('summary') ?? ''),
			description: String(form.get('description') ?? ''),
			location: String(form.get('location') ?? ''),
			city: String(form.get('city') ?? ''),
			province: String(form.get('province') ?? ''),
			status: String(form.get('status') ?? 'ONGOING'),
			yearStarted: Number(form.get('yearStarted') ?? 0) || null,
			yearCompleted: Number(form.get('yearCompleted') ?? 0) || null,
			landAreaM2: Number(form.get('landAreaM2') ?? 0) || null,
			unitCount: Number(form.get('unitCount') ?? 0) || null,
			coverImageUrl: String(form.get('coverImageUrl') ?? ''),
			galleryUrls: form.getAll('galleryUrls').map(String),
			seoTitle: String(form.get('seoTitle') ?? ''),
			seoDescription: String(form.get('seoDescription') ?? '')
		};
		const publish = form.get('isPublished') === 'on';

		try {
			const created = await apiRequest<{ id: number }>('/api/v1/admin/projects', {
				method: 'POST',
				cookie,
				fetcher: fetch,
				body: payload
			});
			if (publish) {
				await apiRequest(`/api/v1/admin/projects/${created.data.id}/publish`, {
					method: 'POST',
					cookie,
					fetcher: fetch
				});
			}
			throw redirect(303, `/proyek/${created.data.id}`);
		} catch (caught) {
			if (caught instanceof ApiRequestError) {
				return { success: false, message: caught.message };
			}
			throw caught;
		}
	}
};
