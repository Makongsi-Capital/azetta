import { redirect } from '@sveltejs/kit';
import { ApiRequestError, apiRequest } from '#lib/server/api.js';
import type { ProjectItem } from '#lib/mock/admin.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, fetch }) => {
	const result = await apiRequest<ProjectItem[]>('/api/v1/admin/projects?perPage=100', {
		cookie: request.headers.get('cookie'),
		fetcher: fetch
	});
	return { projects: result.data.map((project) => ({ id: project.id, title: project.title })) };
};

export const actions: Actions = {
	save: async ({ request, fetch }) => {
		const form = await request.formData();
		const cookie = request.headers.get('cookie');
		const payload = {
			title: String(form.get('title') ?? ''),
			slug: String(form.get('slug') ?? ''),
			subtitle: String(form.get('subtitle') ?? ''),
			unitCode: String(form.get('unitCode') ?? ''),
			typeName: String(form.get('typeName') ?? ''),
			projectId: Number(form.get('projectId') ?? 0),
			salesStatus: String(form.get('salesStatus') ?? 'AVAILABLE'),
			publishStatus: String(form.get('publishStatus') ?? 'DRAFT'),
			floors: Number(form.get('floors') ?? 0),
			bedrooms: Number(form.get('bedrooms') ?? 0),
			bathrooms: Number(form.get('bathrooms') ?? 0),
			carports: Number(form.get('carports') ?? 0),
			buildingAreaM2: Number(form.get('buildingAreaM2') ?? 0),
			landAreaM2: Number(form.get('landAreaM2') ?? 0),
			priceFrom: String(form.get('priceFrom') ?? '0'),
			estimatedBuildCostMin: String(form.get('estimatedBuildCostMin') ?? '0'),
			estimatedBuildCostMax: String(form.get('estimatedBuildCostMax') ?? '0'),
			description: String(form.get('description') ?? ''),
			cover: String(form.get('cover') ?? ''),
			gallery: form.getAll('gallery').map(String),
			seoTitle: String(form.get('seoTitle') ?? ''),
			seoDescription: String(form.get('seoDescription') ?? ''),
			featured: form.get('featured') === 'on'
		};
		const publish = form.get('publishStatus') === 'PUBLISHED';

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
