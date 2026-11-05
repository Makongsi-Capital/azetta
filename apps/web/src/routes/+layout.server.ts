import { apiRequest } from '#lib/api/client.js';
import { toSiteConfig } from '#lib/api/view.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch, locals }) => {
	let siteConfig: Record<string, unknown> = {};

	try {
		const result = await apiRequest<Record<string, unknown>>('/api/v1/public/site-config', {
			fetcher: fetch
		});
		siteConfig = result.data ?? {};
	} catch (error) {
		console.warn('[web] site-config gagal dimuat', error);
	}

	return {
		user: locals.user,
		site: toSiteConfig(siteConfig)
	};
};
