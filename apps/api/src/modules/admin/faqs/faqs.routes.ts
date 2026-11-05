import { Elysia } from 'elysia';
import { hashIp, requireStaff } from '../../../lib/guard';
import { createFaq, deleteFaq, listFaqs, updateFaq } from './faqs.service';

export const faqRoutes = new Elysia({ prefix: '/admin/faqs' })
	.get('/', async ({ request, query }) => {
		await requireStaff(request.headers);
		return listFaqs(query);
	})
	.post('/', async ({ request, body }) => {
		const actor = await requireStaff(request.headers);
		return createFaq(
			actor,
			(body ?? {}) as Record<string, unknown>,
			hashIp(request.headers.get('x-forwarded-for'))
		);
	})
	.patch('/:id', async ({ request, params, body }) => {
		const actor = await requireStaff(request.headers);
		return updateFaq(
			actor,
			params.id,
			(body ?? {}) as Record<string, unknown>,
			hashIp(request.headers.get('x-forwarded-for'))
		);
	})
	.delete('/:id', async ({ request, params }) => {
		const actor = await requireStaff(request.headers);
		return deleteFaq(actor, params.id, hashIp(request.headers.get('x-forwarded-for')));
	});
