import { apiRequest } from '#lib/api/client.js';
import type { ApiUnit, ApiUnitFilters } from '#lib/api/types.js';
import { toUnit } from '#lib/api/view.js';
import type { PageServerLoad } from './$types';

const SORT_OPTIONS = new Set(['-publishedAt', 'priceFrom', '-priceFrom', '-landAreaM2']);

export const load: PageServerLoad = async ({ fetch, url }) => {
	const params = url.searchParams;
	const query: Record<string, string> = {};
	for (const key of [
		'q',
		'project',
		'city',
		'type',
		'bedrooms',
		'minLandArea',
		'minBuildingArea',
		'maxPrice'
	]) {
		const value = params.get(key);
		if (value) query[key] = value;
	}
	const sort = params.get('sort');
	if (sort && SORT_OPTIONS.has(sort)) query.sort = sort;
	const page = params.get('page');
	if (page) query.page = page;

	const hrefFor = (target: number) => {
		const params = new URLSearchParams(query);
		params.set('page', String(target));
		return `?${params.toString()}`;
	};

	const [units, filters] = await Promise.all([
		apiRequest<ApiUnit[]>('/api/v1/public/units', { fetcher: fetch, query }).catch(() => null),
		apiRequest<ApiUnitFilters>('/api/v1/public/units/filters', { fetcher: fetch }).catch(() => null)
	]);

	const meta = units?.meta ?? { page: 1, perPage: 12, total: 0, totalPages: 1 };

	return {
		units: (units?.data ?? []).map(toUnit),
		meta,
		filters: filters?.data ?? null,
		query,
		prevHref: hrefFor(Math.max(1, meta.page - 1)),
		nextHref: hrefFor(Math.min(meta.totalPages, meta.page + 1))
	};
};
