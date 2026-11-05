import { Elysia } from 'elysia';
import { hashIp, requireStaff, requireSuperAdmin } from '../../../lib/guard';
import {
	createStaffUser,
	listCustomers,
	listDeletionRequests,
	listUsers,
	processDeletionRequest,
	setUserDisabled,
	updateUserRole
} from './users.service';

export const userRoutes = new Elysia({ prefix: '/admin' })
	.get('/users', async ({ request, query }) => {
		await requireStaff(request.headers);
		return listUsers(query);
	})
	.post('/users', async ({ request, body }) => {
		const actor = await requireSuperAdmin(request.headers);
		return createStaffUser(
			actor,
			(body ?? {}) as Record<string, unknown>,
			hashIp(request.headers.get('x-forwarded-for'))
		);
	})
	.patch('/users/:id/role', async ({ request, params, body }) => {
		const actor = await requireSuperAdmin(request.headers);
		return updateUserRole(
			actor,
			params.id,
			(body ?? {}) as Record<string, unknown>,
			hashIp(request.headers.get('x-forwarded-for'))
		);
	})
	.post('/users/:id/disable', async ({ request, params, body }) => {
		const actor = await requireSuperAdmin(request.headers);
		return setUserDisabled(
			actor,
			params.id,
			(body ?? {}) as Record<string, unknown>,
			hashIp(request.headers.get('x-forwarded-for'))
		);
	})
	.get('/customers', async ({ request, query }) => {
		await requireStaff(request.headers);
		return listCustomers(query);
	})
	.get('/account-deletion-requests', async ({ request, query }) => {
		await requireStaff(request.headers);
		return listDeletionRequests(query);
	})
	.patch('/account-deletion-requests/:id', async ({ request, params, body }) => {
		const actor = await requireStaff(request.headers);
		return processDeletionRequest(
			actor,
			params.id,
			(body ?? {}) as Record<string, unknown>,
			hashIp(request.headers.get('x-forwarded-for'))
		);
	});
