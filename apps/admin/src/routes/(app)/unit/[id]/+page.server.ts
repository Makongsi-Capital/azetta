import { error, redirect } from '@sveltejs/kit';
import { ApiRequestError, apiRequest } from '#lib/server/api.js';
import { mapUnit } from '#lib/server/mappers.js';
import type { ProjectItem } from '#lib/mock/admin.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, fetch, params }) => {
	const projectsResult = await apiRequest<ProjectItem[]>('/api/v1/admin/projects?perPage=100', {
		cookie: request.headers.get('cookie'),
		fetcher: fetch
	});
	const projects = projectsResult.data.map((project) => ({ id: project.id, title: project.title }));
	try {
		const result = await apiRequest<Parameters<typeof mapUnit>[0]>(
			`/api/v1/admin/units/${params.id}`,
			{ cookie: request.headers.get('cookie'), fetcher: fetch }
		);
		return { unit: mapUnit(result.data), projects };
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
