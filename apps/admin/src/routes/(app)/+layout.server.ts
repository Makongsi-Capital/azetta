import { apiRequest } from '#lib/server/api.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, request, fetch }) => {
	const cookie = request.headers.get('cookie');

	const [stats, deletions] = await Promise.all([
		apiRequest<{ new: number; notContacted: number; mine: number }>('/api/v1/admin/leads/stats', {
			cookie,
			fetcher: fetch
		}).catch(() => null),
		apiRequest<unknown[]>('/api/v1/admin/account-deletion-requests?status=PENDING&perPage=1', {
			cookie,
			fetcher: fetch
		}).catch(() => null)
	]);

	return {
		currentUser: locals.user,
		leadStats: stats?.data ?? { new: 0, notContacted: 0, mine: 0 },
		pendingDeletions: deletions?.meta?.total ?? 0
	};
};
