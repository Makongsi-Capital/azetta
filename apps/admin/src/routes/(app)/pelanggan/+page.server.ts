import { apiRequest } from '#lib/server/api.js';
import type { Customer } from '#lib/mock/admin.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, fetch, locals }) => {
	const result = await apiRequest<Customer[]>('/api/v1/admin/customers?perPage=100', {
		cookie: request.headers.get('cookie'),
		fetcher: fetch
	});
	return { customers: result.data, currentUser: locals.user };
};
