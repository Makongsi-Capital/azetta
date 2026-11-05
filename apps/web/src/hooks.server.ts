import type { Handle } from '@sveltejs/kit/hooks';
import { fetchSession, parseSetCookie } from '#lib/api/client.js';

function isAssetRequest(pathname: string): boolean {
	return (
		pathname.startsWith('/_app/') ||
		pathname.startsWith('/brand/') ||
		/\.[a-z0-9]+$/i.test(pathname)
	);
}

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.user = null;

	if (!isAssetRequest(event.url.pathname)) {
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

	return resolve(event);
};
