import { Elysia, t } from 'elysia';
import { requireStaff } from '../../../lib/guard';
import { deleteMedia, listMedia, uploadMedia } from './media.service';

export const mediaRoutes = new Elysia({ prefix: '/admin/media' })
	.get('/', async ({ request, query }) => {
		await requireStaff(request.headers);
		return listMedia(query);
	})
	.post(
		'/',
		async ({ request, body }) => {
			const actor = await requireStaff(request.headers);
			return uploadMedia(actor, body.file, body.folder);
		},
		{ body: t.Object({ file: t.File(), folder: t.Optional(t.String()) }) }
	)
	.delete('/:id', async ({ request, params }) => {
		await requireStaff(request.headers);
		return deleteMedia(params.id);
	});
