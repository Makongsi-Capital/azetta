import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit/hooks';
import { fetchSession, parseSetCookie, signOut } from '#lib/server/api.js';

const STAFF_ROLES = new Set(['admin', 'super_admin']);
const PUBLIC_PATHS = new Set(['/login']);

function isAssetRequest(pathname: string): boolean {
	return (
		pathname.startsWith('/_app/') ||
		pathname.startsWith('/brand/') ||
		/\.[a-z0-9]+$/i.test(pathname)
	);
}

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	if (pathname === '/logout') {
		await signOut(event.request.headers.get('cookie'));
		for (const name of event.cookies.getAll().map((cookie) => cookie.name)) {
			if (name.startsWith('azetta.')) {
				event.cookies.delete(name, { path: '/' });
			}
		}
		throw redirect(303, '/login');
	}

	event.locals.user = null;

	if (!isAssetRequest(pathname)) {
		const { user, setCookies } = await fetchSession(event.request.headers.get('cookie'));

		for (const header of setCookies) {
			const parsed = parseSetCookie(header);
			if (parsed) event.cookies.set(parsed.name, parsed.value, parsed.options);
		}

		if (user && !STAFF_ROLES.has(user.role)) {
			event.locals.user = null;
			throw redirect(303, '/login?error=forbidden');
		}

		event.locals.user = user;

		if (!user && !PUBLIC_PATHS.has(pathname)) {
			const next = `${pathname}${event.url.search}`;
			throw redirect(303, `/login?next=${encodeURIComponent(next)}`);
		}

		if (user && PUBLIC_PATHS.has(pathname)) {
			throw redirect(303, '/dashboard');
		}
	}

	const response = await resolve(event);

	response.headers.set('x-content-type-options', 'nosniff');
	response.headers.set('referrer-policy', 'same-origin');
	response.headers.set('x-frame-options', 'DENY');
	response.headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=()');
	response.headers.set('x-robots-tag', 'noindex, nofollow');

	return response;
};
