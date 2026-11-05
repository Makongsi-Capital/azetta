import { Elysia } from 'elysia';
import { hashIp, requireStaff } from '../../../lib/guard';
import {
	archiveProject,
	createProject,
	getProject,
	listProjects,
	presignProjectMedia,
	publishProject,
	unpublishProject,
	updateProject
} from './projects.service';

export const projectRoutes = new Elysia({ prefix: '/admin/projects' })
	.get('/', async ({ request, query }) => {
		await requireStaff(request.headers);
		return listProjects(query);
	})
	.post('/', async ({ request, body }) => {
		const actor = await requireStaff(request.headers);
		return createProject(
			actor,
			(body ?? {}) as Record<string, unknown>,
			hashIp(request.headers.get('x-forwarded-for'))
		);
	})
	.get('/:id', async ({ request, params }) => {
		await requireStaff(request.headers);
		return getProject(params.id);
	})
	.patch('/:id', async ({ request, params, body }) => {
		const actor = await requireStaff(request.headers);
		return updateProject(
			actor,
			params.id,
			(body ?? {}) as Record<string, unknown>,
			hashIp(request.headers.get('x-forwarded-for'))
		);
	})
	.delete('/:id', async ({ request, params }) => {
		const actor = await requireStaff(request.headers);
		return archiveProject(actor, params.id, hashIp(request.headers.get('x-forwarded-for')));
	})
	.post('/:id/publish', async ({ request, params }) => {
		const actor = await requireStaff(request.headers);
		return publishProject(actor, params.id, hashIp(request.headers.get('x-forwarded-for')));
	})
	.post('/:id/unpublish', async ({ request, params }) => {
		const actor = await requireStaff(request.headers);
		return unpublishProject(actor, params.id, hashIp(request.headers.get('x-forwarded-for')));
	})
	.post('/:id/media/presign', async ({ request }) => {
		await requireStaff(request.headers);
		return presignProjectMedia();
	});
