import { fail, redirect } from '@sveltejs/kit';
import { ApiRequestError, apiRequestRaw, parseSetCookie } from '#lib/api/client.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, url }) => {
	if (locals.user) redirect(303, '/akun');

	const next = url.searchParams.get('next');
	return { next: next && next.startsWith('/') ? next : '/akun' };
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();
		const password = String(form.get('password') ?? '');

		if (!email || !password) {
			return fail(400, { email, message: 'Email dan kata sandi wajib diisi.' });
		}

		try {
			const result = await apiRequestRaw('/api/auth/sign-in/email', {
				method: 'POST',
				body: { email, password }
			});

			for (const header of result.setCookies) {
				const parsed = parseSetCookie(header);
				if (parsed) cookies.set(parsed.name, parsed.value, parsed.options);
			}
		} catch (error) {
			if (error instanceof ApiRequestError) {
				return fail(error.status === 429 ? 429 : 400, {
					email,
					message:
						error.status === 429
							? 'Terlalu banyak percobaan. Coba lagi beberapa saat lagi.'
							: 'Email atau kata sandi salah.'
				});
			}
			throw error;
		}

		const next = url.searchParams.get('next');
		redirect(303, next && next.startsWith('/') ? next : '/akun');
	}
};
