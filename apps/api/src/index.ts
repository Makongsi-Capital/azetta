import { Elysia } from 'elysia';
import { getEnv } from './env';
import { ApiError, envelopeError } from './lib/http';
import { auth, ensureBootstrapAdmin } from './lib/auth';
import { leadRoutes } from './modules/admin/leads/leads.routes';
import { unitRoutes } from './modules/admin/units/units.routes';
import { projectRoutes } from './modules/admin/projects/projects.routes';
import { articleRoutes } from './modules/admin/articles/articles.routes';
import { faqRoutes } from './modules/admin/faqs/faqs.routes';
import { testimonialRoutes } from './modules/admin/testimonials/testimonials.routes';
import { settingRoutes } from './modules/admin/settings/settings.routes';
import { userRoutes } from './modules/admin/users/users.routes';
import { statsRoutes } from './modules/admin/stats/stats.routes';
import { auditRoutes } from './modules/admin/audit/audit.routes';
import { publicRoutes } from './modules/public/public.routes';
import { mediaRoutes } from './modules/admin/media/media.routes';
import { pruneRateLimits } from './lib/rate-limit';
import { meRoutes } from './modules/account/account.routes';

const env = getEnv();

// API hanya dipanggil server-side (web/admin) lewat fetch internal, jadi tidak perlu CORS.
const app = new Elysia()
	.onRequest(({ request, set }) => {
		const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID();
		set.headers['x-request-id'] = requestId;
	})
	.onError(({ error, code, request, set }) => {
		const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID();
		set.headers['x-request-id'] = requestId;

		if (error instanceof ApiError) {
			set.status = error.status;
			return envelopeError(
				{ code: error.code, message: error.message, details: error.details },
				requestId
			);
		}
		if (code === 'NOT_FOUND') {
			set.status = 404;
			return envelopeError({ code: 'NOT_FOUND', message: 'Endpoint tidak ditemukan.' }, requestId);
		}
		if (code === 'VALIDATION' || code === 'PARSE') {
			set.status = 400;
			return envelopeError(
				{ code: 'VALIDATION_ERROR', message: 'Data yang dikirim tidak valid.' },
				requestId
			);
		}

		console.error('[api] unhandled error', error);
		set.status = 500;
		return envelopeError(
			{ code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan pada server.' },
			requestId
		);
	})
	.get('/health', () => ({ status: 'ok', env: env.NODE_ENV }))
	.all('/api/auth/*', ({ request }) => auth.handler(request))
	.group('/api/v1', (api) =>
		api
			.use(publicRoutes)
			.use(meRoutes)
			.use(leadRoutes)
			.use(unitRoutes)
			.use(projectRoutes)
			.use(articleRoutes)
			.use(faqRoutes)
			.use(testimonialRoutes)
			.use(settingRoutes)
			.use(userRoutes)
			.use(statsRoutes)
			.use(mediaRoutes)
			.use(auditRoutes)
	)
	.listen(env.PORT);

await ensureBootstrapAdmin();
setInterval(pruneRateLimits, 60_000).unref?.();

console.info(`API Azetta berjalan di http://localhost:${app.server?.port}`);
