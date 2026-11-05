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
			subtitle: String(form.get('subtitle') ?? ''),
			category: String(form.get('category') ?? 'RESIDENTIAL'),
			style: String(form.get('style') ?? ''),
			floors: Number(form.get('floors') ?? 0),
			bedrooms: Number(form.get('bedrooms') ?? 0),
			bathrooms: Number(form.get('bathrooms') ?? 0),
			carports: Number(form.get('carports') ?? 0),
			buildingAreaM2: Number(form.get('buildingAreaM2') ?? 0),
			landAreaMinM2: Number(form.get('landAreaMinM2') ?? 0),
			priceFrom: String(form.get('priceFrom') ?? '0'),
			estimatedBuildCostMin: String(form.get('estimatedBuildCostMin') ?? '0'),
			estimatedBuildCostMax: String(form.get('estimatedBuildCostMax') ?? '0'),
			description: String(form.get('description') ?? ''),
			cover: String(form.get('cover') ?? ''),
			gallery: form.getAll('gallery').map(String),
			tags: String(form.get('tags') ?? '')
				.split(',')
				.map((tag) => tag.trim())
				.filter(Boolean),
			seoTitle: String(form.get('seoTitle') ?? ''),
			seoDescription: String(form.get('seoDescription') ?? ''),
			featured: form.get('featured') === 'on'
		};
		const publish = form.get('status') === 'PUBLISHED';

		try {
			const created = await apiRequest<{ id: number }>('/api/v1/admin/units', {
				method: 'POST',
				cookie,
				fetcher: fetch,
				body: payload
			});
			if (publish) {
				await apiRequest(`/api/v1/admin/units/${created.data.id}/publish`, {
					method: 'POST',
					cookie,
					fetcher: fetch
				});
			}
			throw redirect(303, `/unit/${created.data.id}`);
		} catch (caught) {
			if (caught instanceof ApiRequestError) {
				return { success: false, message: caught.message };
			}
			throw caught;
		}
	}
};
