import { Elysia, t } from 'elysia';
import { ApiError } from '../../lib/http';
import { getSession, hashIp } from '../../lib/guard';
import { checkRateLimit, clientIp } from '../../lib/rate-limit';
import {
	createPublicLead,
	getArticleBySlug,
	getProjectBySlug,
	getRegions,
	getRelatedUnits,
	getSiteConfig,
	getUnitBySlug,
	getUnitFilters,
	listArticles,
	listFaqs,
	listProjects,
	listTestimonials,
	listUnits,
	recordEvents,
	uploadPublicFile
} from './public.service';

export const publicRoutes = new Elysia({ prefix: '/public' })
	.get('/units', ({ query }) => listUnits(query))
	.get('/units/filters', () => getUnitFilters())
	.get('/units/:slug', ({ params }) => getUnitBySlug(params.slug))
	.get('/units/:slug/related', ({ params }) => getRelatedUnits(params.slug))
	.get('/projects', ({ query }) => listProjects(query))
	.get('/projects/:slug', ({ params }) => getProjectBySlug(params.slug))
	.get('/articles', ({ query }) => listArticles(query))
	.get('/articles/:slug', ({ params }) => getArticleBySlug(params.slug))
	.get('/faqs', () => listFaqs())
	.get('/testimonials', () => listTestimonials())
	.get('/site-config', () => getSiteConfig())
	.get('/regions', () => getRegions())
	.post('/leads', async ({ request, body, set }) => {
		const ipLimit = checkRateLimit(`leads:ip:${clientIp(request.headers)}`, 5, 60 * 60 * 1000);
		if (!ipLimit.allowed) {
			set.headers['retry-after'] = String(ipLimit.retryAfterSeconds);
			throw new ApiError(429, 'RATE_LIMITED', 'Terlalu banyak pengiriman. Coba lagi nanti.');
		}

		const payload = (body ?? {}) as Record<string, unknown>;
		const phone = typeof payload.phone === 'string' ? payload.phone : '';
		const phoneNormalized = phone.replace(/\D/g, '').replace(/^0/, '62');
		const phoneLimit = checkRateLimit(`leads:phone:${phoneNormalized}`, 3, 60 * 60 * 1000);
		if (!phoneLimit.allowed) {
			set.headers['retry-after'] = String(phoneLimit.retryAfterSeconds);
			throw new ApiError(429, 'RATE_LIMITED', 'Nomor ini sudah mengirim terlalu sering.');
		}

		const session = await getSession(request.headers);
		return createPublicLead(payload, {
			userId: session?.user.id ?? null,
			ipHash: hashIp(clientIp(request.headers)),
			userAgent: request.headers.get('user-agent')
		});
	})
	.post(
		'/uploads',
		async ({ request, body, set }) => {
			const limit = checkRateLimit(`uploads:${clientIp(request.headers)}`, 20, 60 * 60 * 1000);
			if (!limit.allowed) {
				set.headers['retry-after'] = String(limit.retryAfterSeconds);
				throw new ApiError(429, 'RATE_LIMITED', 'Batas unggah lampiran tercapai.');
			}

			const session = await getSession(request.headers);
			return uploadPublicFile(body.file, session?.user.id ?? null);
		},
		{ body: t.Object({ file: t.File() }) }
	)
	.post('/events', ({ request, body, set }) => {
		const limit = checkRateLimit(`events:${clientIp(request.headers)}`, 120, 60 * 1000);
		if (!limit.allowed) {
			set.headers['retry-after'] = String(limit.retryAfterSeconds);
			throw new ApiError(429, 'RATE_LIMITED', 'Batas pengiriman event tercapai.');
		}
		return recordEvents((body ?? {}) as Record<string, unknown>);
	});
