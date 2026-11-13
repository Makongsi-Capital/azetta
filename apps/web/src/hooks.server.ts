import type { Handle } from '@sveltejs/kit/hooks';
import { fetchSession, parseSetCookie } from '#lib/api/client.js';

function isAssetRequest(pathname: string): boolean {
	return (
		pathname.startsWith('/_app/') ||
		pathname.startsWith('/brand/') ||
		/\.[a-z0-9]+$/i.test(pathname)
	);
}

const PROBE_PATHS = new Set(['/health']);

const PRIVATE_PREFIXES = [
	'/akun',
	'/masuk',
	'/daftar',
	'/lupa-sandi',
	'/reset-sandi',
	'/verifikasi-email',
	'/theme'
];

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.user = null;

	if (!isAssetRequest(event.url.pathname) && !PROBE_PATHS.has(event.url.pathname)) {
		const { user, setCookies } = await fetchSession(
			event.request.headers.get('cookie'),
			event.fetch
		);

		for (const header of setCookies) {
			const parsed = parseSetCookie(header);
			if (parsed) event.cookies.set(parsed.name, parsed.value, parsed.options);
		}

		event.locals.user = user;
	}

	const response = await resolve(event);

	response.headers.set('x-content-type-options', 'nosniff');
	response.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
	response.headers.set('x-frame-options', 'SAMEORIGIN');
	response.headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=()');

	if (PRIVATE_PREFIXES.some((prefix) => event.url.pathname.startsWith(prefix))) {
		response.headers.set('x-robots-tag', 'noindex, nofollow');
	}

	return response;
};
