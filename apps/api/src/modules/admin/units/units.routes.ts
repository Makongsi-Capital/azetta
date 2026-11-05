import { Elysia } from 'elysia';
import { hashIp, requireStaff } from '../../../lib/guard';
import {
	addUnitMedia,
	archiveUnit,
	createUnit,
	deleteUnitMedia,
	duplicateUnit,
	getUnit,
	listUnits,
	publishUnit,
	setUnitArchived,
	updateUnit
} from './units.service';

export const unitRoutes = new Elysia({ prefix: '/admin/units' })
	.get('/', async ({ request, query }) => {
		await requireStaff(request.headers);
		return listUnits(query);
	})
	.post('/', async ({ request, body }) => {
		const actor = await requireStaff(request.headers);
		return createUnit(
			actor,
			(body ?? {}) as Record<string, unknown>,
			hashIp(request.headers.get('x-forwarded-for'))
		);
	})
	.get('/:id', async ({ request, params }) => {
		await requireStaff(request.headers);
		return getUnit(params.id);
	})
	.patch('/:id', async ({ request, params, body }) => {
		const actor = await requireStaff(request.headers);
		return updateUnit(
			actor,
			params.id,
			(body ?? {}) as Record<string, unknown>,
			hashIp(request.headers.get('x-forwarded-for'))
		);
	})
	.delete('/:id', async ({ request, params }) => {
		const actor = await requireStaff(request.headers);
		return archiveUnit(actor, params.id, hashIp(request.headers.get('x-forwarded-for')));
	})
	.post('/:id/publish', async ({ request, params }) => {
		const actor = await requireStaff(request.headers);
		return publishUnit(actor, params.id, hashIp(request.headers.get('x-forwarded-for')));
	})
	.post('/:id/archive', async ({ request, params }) => {
		const actor = await requireStaff(request.headers);
		return setUnitArchived(actor, params.id, hashIp(request.headers.get('x-forwarded-for')));
	})
	.post('/:id/duplicate', async ({ request, params, body }) => {
		const actor = await requireStaff(request.headers);
		return duplicateUnit(
			actor,
			params.id,
			(body ?? {}) as Record<string, unknown>,
			hashIp(request.headers.get('x-forwarded-for'))
		);
	})
	.post('/:id/media', async ({ request, params, body }) => {
		await requireStaff(request.headers);
		return addUnitMedia(params.id, (body ?? {}) as Record<string, unknown>);
	})
	.delete('/:id/media/:mediaId', async ({ request, params }) => {
		await requireStaff(request.headers);
		return deleteUnitMedia(params.id, params.mediaId);
	});
