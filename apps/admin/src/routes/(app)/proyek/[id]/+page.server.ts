import { error, redirect } from '@sveltejs/kit';
import { ApiRequestError, apiRequest } from '#lib/server/api.js';
import type { ProjectItem } from '#lib/mock/admin.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, fetch, params }) => {
	try {
		const result = await apiRequest<ProjectItem>(`/api/v1/admin/projects/${params.id}`, {
			cookie: request.headers.get('cookie'),
			fetcher: fetch
		});
		return { project: result.data };
	} catch (caught) {
		if (caught instanceof ApiRequestError && caught.status === 404) {
			throw error(404, 'Proyek tidak ditemukan.');
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
			await apiRequest(`/api/v1/admin/projects/${params.id}`, {
				method: 'PATCH',
				cookie,
				fetcher: fetch,
				body: payload
			});
			if (publish) {
				await apiRequest(`/api/v1/admin/projects/${params.id}/publish`, {
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

		throw redirect(303, `/proyek/${params.id}`);
	}
};
