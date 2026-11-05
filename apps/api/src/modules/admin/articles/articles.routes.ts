import { Elysia } from 'elysia';
import { hashIp, requireStaff } from '../../../lib/guard';
import {
	archiveArticle,
	createArticle,
	getArticle,
	listArticles,
	publishArticle,
	updateArticle
} from './articles.service';

export const articleRoutes = new Elysia({ prefix: '/admin/articles' })
	.get('/', async ({ request, query }) => {
		await requireStaff(request.headers);
		return listArticles(query);
	})
	.post('/', async ({ request, body }) => {
		const actor = await requireStaff(request.headers);
		return createArticle(
			actor,
			(body ?? {}) as Record<string, unknown>,
			hashIp(request.headers.get('x-forwarded-for'))
		);
	})
	.get('/:id', async ({ request, params }) => {
		await requireStaff(request.headers);
		return getArticle(params.id);
	})
	.patch('/:id', async ({ request, params, body }) => {
		const actor = await requireStaff(request.headers);
		return updateArticle(
			actor,
			params.id,
			(body ?? {}) as Record<string, unknown>,
			hashIp(request.headers.get('x-forwarded-for'))
		);
	})
	.delete('/:id', async ({ request, params }) => {
		const actor = await requireStaff(request.headers);
		return archiveArticle(actor, params.id, hashIp(request.headers.get('x-forwarded-for')));
	})
	.post('/:id/publish', async ({ request, params }) => {
		const actor = await requireStaff(request.headers);
		return publishArticle(actor, params.id, hashIp(request.headers.get('x-forwarded-for')));
	});
