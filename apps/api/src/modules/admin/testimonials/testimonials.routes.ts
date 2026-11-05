import { Elysia } from 'elysia';
import { hashIp, requireStaff } from '../../../lib/guard';
import {
	createTestimonial,
	deleteTestimonial,
	listTestimonials,
	updateTestimonial
} from './testimonials.service';

export const testimonialRoutes = new Elysia({ prefix: '/admin/testimonials' })
	.get('/', async ({ request, query }) => {
		await requireStaff(request.headers);
		return listTestimonials(query);
	})
	.post('/', async ({ request, body }) => {
		const actor = await requireStaff(request.headers);
		return createTestimonial(
			actor,
			(body ?? {}) as Record<string, unknown>,
			hashIp(request.headers.get('x-forwarded-for'))
		);
	})
	.patch('/:id', async ({ request, params, body }) => {
		const actor = await requireStaff(request.headers);
		return updateTestimonial(
			actor,
			params.id,
			(body ?? {}) as Record<string, unknown>,
			hashIp(request.headers.get('x-forwarded-for'))
		);
	})
	.delete('/:id', async ({ request, params }) => {
		const actor = await requireStaff(request.headers);
		return deleteTestimonial(actor, params.id, hashIp(request.headers.get('x-forwarded-for')));
	});
