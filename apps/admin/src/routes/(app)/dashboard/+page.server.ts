import { apiRequest } from '#lib/server/api.js';
import { mapLead } from '#lib/server/mappers.js';
import type { PageServerLoad } from './$types';

const STATUSES = [
	'NEW',
	'CONTACTED',
	'QUALIFIED',
	'PROPOSAL',
	'NEGOTIATION',
	'WON',
	'LOST',
	'SPAM'
] as const;
const TYPES = ['BUY_DESIGN', 'LAND_OFFER', 'INVEST', 'GENERAL'] as const;

export const load: PageServerLoad = async ({ request, fetch }) => {
	const cookie = request.headers.get('cookie');
	const [overview, series, leads] = await Promise.all([
		apiRequest<{
			newToday: number;
			notContacted: number;
			staleOver24h: number;
			byType: Record<string, number>;
			byStatus: Record<string, number>;
			medianFirstResponseMinutes: number | null;
		}>('/api/v1/admin/stats/overview', { cookie, fetcher: fetch }),
		apiRequest<{ date: string; count: number }[]>('/api/v1/admin/stats/leads-timeseries?days=30', {
			cookie,
			fetcher: fetch
		}),
		apiRequest<Parameters<typeof mapLead>[0][]>('/api/v1/admin/leads?perPage=100&sort=-createdAt', {
			cookie,
			fetcher: fetch
		})
	]);

	const mapped = leads.data.map(mapLead);
	const leadsByStatus = STATUSES.map((status) => ({
		status,
		count: overview.data.byStatus[status] ?? 0
	}));
	const leadsByType = TYPES.map((type) => ({ type, count: overview.data.byType[type] ?? 0 }));
	const upcomingFollowUps = mapped
		.filter((lead) => lead.nextFollowUpAt && lead.status !== 'WON' && lead.status !== 'LOST')
		.sort((a, b) => (a.nextFollowUpAt ?? '').localeCompare(b.nextFollowUpAt ?? ''));

	return {
		leadStats: overview.data,
		leadSeries: series.data.map((point) => ({ date: point.date, count: point.count })),
		leadsByStatus,
		leadsByType,
		leads: mapped,
		upcomingFollowUps,
		now: new Date().toISOString()
	};
};
