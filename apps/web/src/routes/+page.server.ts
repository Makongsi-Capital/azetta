import { apiRequest } from '#lib/api/client.js';
import type {
	ApiArticle,
	ApiProject,
	ApiTestimonial,
	ApiUnit,
	ApiUnitFilters
} from '#lib/api/types.js';
import { toArticle, toProject, toTestimonial, toUnit } from '#lib/api/view.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const [units, projects, articles, testimonials, filters] = await Promise.all([
		apiRequest<ApiUnit[]>('/api/v1/public/units', {
			fetcher: fetch,
			query: { perPage: 6, sort: '-publishedAt' }
		}).catch(() => null),
		apiRequest<ApiProject[]>('/api/v1/public/projects', {
			fetcher: fetch,
			query: { perPage: 3 }
		}).catch(() => null),
		apiRequest<ApiArticle[]>('/api/v1/public/articles', {
			fetcher: fetch,
			query: { perPage: 3 }
		}).catch(() => null),
		apiRequest<ApiTestimonial[]>('/api/v1/public/testimonials', { fetcher: fetch }).catch(
			() => null
		),
		apiRequest<ApiUnitFilters>('/api/v1/public/units/filters', { fetcher: fetch }).catch(() => null)
	]);

	return {
		featuredUnits: (units?.data ?? []).map(toUnit),
		totalUnits: units?.meta?.total ?? 0,
		projects: (projects?.data ?? []).map(toProject),
		articles: (articles?.data ?? []).map(toArticle),
		testimonials: (testimonials?.data ?? []).map(toTestimonial),
		filters: filters?.data ?? null
	};
};
