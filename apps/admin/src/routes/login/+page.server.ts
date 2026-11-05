import { fail, redirect } from '@sveltejs/kit';
import { ApiRequestError, apiRequestRaw, parseSetCookie } from '#lib/server/api.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const next = url.searchParams.get('next');
	return {
		next: next && next.startsWith('/') ? next : '/dashboard',
		forbidden: url.searchParams.get('error') === 'forbidden'
	};
};

export const actions: Actions = {
	default: async ({ request, cookies, url, fetch }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();
		const password = String(form.get('password') ?? '');

		if (!email || !password) {
			return fail(400, {
				email,
				message: 'Email dan kata sandi wajib diisi.'
			});
		}

		try {
			const result = await apiRequestRaw<{ user: { role?: string } }>('/api/auth/sign-in/email', {
				method: 'POST',
				body: { email, password },
				fetcher: fetch
			});

			const role = result.data?.user.role;
			if (role !== 'admin' && role !== 'super_admin') {
				return fail(403, {
					email,
					message: 'Akun ini bukan staf internal Azetta.'
				});
			}

			for (const header of result.setCookies) {
				const parsed = parseSetCookie(header);
				if (parsed) cookies.set(parsed.name, parsed.value, parsed.options);
			}
		} catch (error) {
			if (error instanceof ApiRequestError) {
				return fail(400, {
					email,
					message: error.message || 'Email atau kata sandi salah.'
				});
			}
			throw error;
		}

		const next = url.searchParams.get('next');
		throw redirect(303, next && next.startsWith('/') ? next : '/dashboard');
	}
};
