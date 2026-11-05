import { fail, redirect } from '@sveltejs/kit';
import { ApiRequestError, apiRequestRaw, parseSetCookie } from '#lib/api/client.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user) redirect(303, '/akun');
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const name = String(form.get('name') ?? '').trim();
		const email = String(form.get('email') ?? '').trim();
		const phone = String(form.get('phone') ?? '').trim();
		const password = String(form.get('password') ?? '');
		const confirm = String(form.get('confirmPassword') ?? '');
		const agreed = form.get('terms') === 'on';

		const values = { name, email, phone };

		if (!name || !email || !password) {
			return fail(400, { ...values, message: 'Nama, email, dan kata sandi wajib diisi.' });
		}
		if (password.length < 8) {
			return fail(400, { ...values, message: 'Kata sandi minimal 8 karakter.' });
		}
		if (password !== confirm) {
			return fail(400, { ...values, message: 'Ulangi kata sandi tidak sama.' });
		}
		if (!agreed) {
			return fail(400, {
				...values,
				message: 'Persetujuan Kebijakan Privasi dan Syarat & Ketentuan wajib dicentang.'
			});
		}

		try {
			const result = await apiRequestRaw('/api/auth/sign-up/email', {
				method: 'POST',
				body: { name, email, password, phone: phone || undefined }
			});

			for (const header of result.setCookies) {
				const parsed = parseSetCookie(header);
				if (parsed) cookies.set(parsed.name, parsed.value, parsed.options);
			}
		} catch (error) {
			if (error instanceof ApiRequestError) {
				return fail(400, {
					...values,
					message:
						error.code === 'USER_ALREADY_EXISTS'
							? 'Email ini sudah terdaftar. Coba masuk.'
							: error.message
				});
			}
			throw error;
		}

		redirect(303, '/akun');
	}
};
