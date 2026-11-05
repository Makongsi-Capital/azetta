import { redirect } from '@sveltejs/kit';
import { signOut } from '#lib/api/client.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	redirect(303, '/');
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		await signOut(request.headers.get('cookie'));
		for (const cookie of cookies.getAll()) {
			if (cookie.name.startsWith('azetta.')) {
				cookies.delete(cookie.name, { path: '/' });
			}
		}
		redirect(303, '/');
	}
};
