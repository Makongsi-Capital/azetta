import { error } from '@sveltejs/kit';
import { ApiRequestError, apiRequest } from '#lib/api/client.js';
import type { ApiUnit } from '#lib/api/types.js';
import { toUnit } from '#lib/api/view.js';
import { submitLead } from '#lib/server/leads.js';
import type { Actions, PageServerLoad } from './$types';

const unitPath = (slug: string) => `/api/v1/public/units/${encodeURIComponent(slug)}`;

export const load: PageServerLoad = async ({ fetch, params }) => {
	try {
		const [unit, related] = await Promise.all([
			apiRequest<ApiUnit>(unitPath(params.slug), { fetcher: fetch }),
			apiRequest<ApiUnit[]>(`${unitPath(params.slug)}/related`, { fetcher: fetch }).catch(
				() => null
			)
		]);

		return {
			unit: toUnit(unit.data),
			related: (related?.data ?? []).map(toUnit)
		};
	} catch (requestError) {
		if (requestError instanceof ApiRequestError && requestError.status === 404) {
			error(404, 'Unit tidak ditemukan');
		}
		throw requestError;
	}
};

export const actions: Actions = {
	default: async ({ request, url }) => {
		const form = await request.formData();
		const unitId = Number(form.get('unitId'));
		return submitLead(form, {
			cookie: request.headers.get('cookie'),
			type: 'BUY_UNIT',
			unitId: Number.isInteger(unitId) && unitId > 0 ? unitId : undefined,
			landingPath: url.pathname
		});
	}
};
