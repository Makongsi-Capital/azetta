import { error, redirect } from '@sveltejs/kit';
import { ApiRequestError, apiRequest } from '#lib/server/api.js';
import { mapDesign } from '#lib/server/mappers.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, fetch, params }) => {
	try {
		const result = await apiRequest<Parameters<typeof mapDesign>[0]>(
			`/api/v1/admin/units/${params.id}`,
			{ cookie: request.headers.get('cookie'), fetcher: fetch }
		);
		return { unit: mapDesign(result.data) };
	} catch (caught) {
		if (caught instanceof ApiRequestError && caught.status === 404) {
			throw error(404, 'Unit tidak ditemukan.');
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
			await apiRequest(`/api/v1/admin/units/${params.id}`, {
				method: 'PATCH',
				cookie,
				fetcher: fetch,
				body: payload
			});
			if (publish) {
				await apiRequest(`/api/v1/admin/units/${params.id}/publish`, {
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

		throw redirect(303, `/unit/${params.id}`);
	}
};
