import { apiRequest } from '#lib/server/api.js';
import type { AuditLogItem } from '#lib/mock/admin.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, fetch }) => {
	const result = await apiRequest<AuditLogItem[]>('/api/v1/admin/audit-logs?perPage=100', {
		cookie: request.headers.get('cookie'),
		fetcher: fetch
	});
	return { logs: result.data, now: new Date().toISOString() };
};
