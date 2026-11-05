import { submitLead } from '#lib/server/leads.js';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, url }) => {
		const form = await request.formData();
		return submitLead(form, {
			cookie: request.headers.get('cookie'),
			type: 'GENERAL',
			landingPath: url.pathname
		});
	}
};
