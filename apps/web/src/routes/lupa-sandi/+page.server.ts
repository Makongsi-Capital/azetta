import { fail } from '@sveltejs/kit';
import { ApiRequestError, apiRequestRaw } from '#lib/api/client.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user) return { signedIn: true };
	return { signedIn: false };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();

		if (!email) {
			return fail(400, { email, message: 'Email wajib diisi.' });
		}

		try {
			await apiRequestRaw('/api/auth/forget-password', {
				method: 'POST',
				// Path relatif lolos validasi redirectURL Better Auth tanpa perlu origin publik.
				body: { email, redirectTo: '/masuk' }
			});
		} catch (error) {
			if (error instanceof ApiRequestError && error.status === 400) {
				return fail(400, { email, message: error.message });
			}
			// Jangan bocorkan status pendaftaran email; anggap permintaan berhasil.
			console.warn('[web] forget-password gagal', error);
		}

		return { email, sent: true };
	}
};
