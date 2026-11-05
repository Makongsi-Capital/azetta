import { Elysia } from 'elysia';
import { requireStaff } from '../../../lib/guard';
import { getFunnel, getLeadsTimeseries, getOverview } from './stats.service';

export const statsRoutes = new Elysia({ prefix: '/admin/stats' })
	.get('/overview', async ({ request }) => {
		await requireStaff(request.headers);
		return getOverview();
	})
	.get('/leads-timeseries', async ({ request, query }) => {
		await requireStaff(request.headers);
		return getLeadsTimeseries(Number(query.days ?? 30));
	})
	.get('/funnel', async ({ request }) => {
		await requireStaff(request.headers);
		return getFunnel();
	});
