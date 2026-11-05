import { Elysia } from 'elysia';
import { requireVerifiedCustomer } from '../../lib/guard';
import {
	createDeletionRequest,
	getDeletionRequest,
	getMyLead,
	getProfile,
	listMyLeads,
	updateProfile
} from './account.service';

export const meRoutes = new Elysia({ prefix: '/me' })
	.get('/', async ({ request }) => {
		const actor = await requireVerifiedCustomer(request.headers);
		return getProfile(actor.id);
	})
	.patch('/', async ({ request, body }) => {
		const actor = await requireVerifiedCustomer(request.headers);
		return updateProfile(actor.id, (body ?? {}) as Record<string, unknown>);
	})
	.get('/leads', async ({ request }) => {
		const actor = await requireVerifiedCustomer(request.headers);
		return listMyLeads(actor.id);
	})
	.get('/leads/:id', async ({ request, params }) => {
		const actor = await requireVerifiedCustomer(request.headers);
		return getMyLead(actor.id, params.id);
	})
	.get('/deletion-request', async ({ request }) => {
		const actor = await requireVerifiedCustomer(request.headers);
		return getDeletionRequest(actor.id);
	})
	.post('/deletion-request', async ({ request, body }) => {
		const actor = await requireVerifiedCustomer(request.headers);
		return createDeletionRequest(actor.id, (body ?? {}) as Record<string, unknown>);
	});
