import { apiRequest } from '#lib/api/client.js';
import type { ApiFaq } from '#lib/api/types.js';
import { toFaq } from '#lib/api/view.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const faqs = await apiRequest<ApiFaq[]>('/api/v1/public/faqs', { fetcher: fetch }).catch(
		() => null
	);

	return {
		faqs: (faqs?.data ?? []).map(toFaq)
	};
};
