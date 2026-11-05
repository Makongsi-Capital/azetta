import { Elysia } from 'elysia';
import { hashIp, requireStaff, requireSuperAdmin } from '../../../lib/guard';
import {
	addLeadActivity,
	changeLeadStatus,
	createLead,
	deleteLeadActivity,
	exportLeadsCsv,
	getLead,
	getLeadAttachmentUrl,
	getLeadStats,
	listLeads,
	updateLead
} from './leads.service';

export const leadRoutes = new Elysia({ prefix: '/admin/leads' })
	.get('/', async ({ request, query }) => {
		const actor = await requireStaff(request.headers);
		return listLeads(actor, query);
	})
	.get('/stats', async ({ request }) => {
		const actor = await requireStaff(request.headers);
		return getLeadStats(actor);
	})
	.get('/export', async ({ request, query, set }) => {
		const actor = await requireStaff(request.headers);
		const csv = await exportLeadsCsv(actor, query);

		set.headers['content-type'] = 'text/csv; charset=utf-8';
		set.headers['content-disposition'] =
			`attachment; filename="azetta-lead-${new Date().toISOString().slice(0, 10)}.csv"`;
		return csv;
	})
	.get('/:id', async ({ request, params }) => {
		await requireStaff(request.headers);
		return getLead(params.id);
	})
	.post('/', async ({ request, body }) => {
		const actor = await requireStaff(request.headers);
		return createLead(
			actor,
			(body ?? {}) as Record<string, unknown>,
			hashIp(request.headers.get('x-forwarded-for'))
		);
	})
	.patch('/:id', async ({ request, params, body }) => {
		const actor = await requireStaff(request.headers);
		return updateLead(
			actor,
			params.id,
			(body ?? {}) as Record<string, unknown>,
			hashIp(request.headers.get('x-forwarded-for'))
		);
	})
	.post('/:id/status', async ({ request, params, body }) => {
		const actor = await requireStaff(request.headers);
		return changeLeadStatus(
			actor,
			params.id,
			(body ?? {}) as Record<string, unknown>,
			hashIp(request.headers.get('x-forwarded-for'))
		);
	})
	.post('/:id/activities', async ({ request, params, body }) => {
		const actor = await requireStaff(request.headers);
		return addLeadActivity(actor, params.id, (body ?? {}) as Record<string, unknown>);
	})
	.delete('/:id/activities/:activityId', async ({ request, params }) => {
		const actor = await requireSuperAdmin(request.headers);
		return deleteLeadActivity(
			actor,
			params.id,
			params.activityId,
			hashIp(request.headers.get('x-forwarded-for'))
		);
	})
	.get('/:id/attachments/:attachmentId/url', async ({ request, params }) => {
		await requireStaff(request.headers);
		return getLeadAttachmentUrl(params.id, params.attachmentId);
	});
