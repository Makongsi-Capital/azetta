import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins';
import { adminAc, defaultAc, userAc } from 'better-auth/plugins/admin/access';
import { prisma } from './prisma';
import { getEnv } from '../env';

const env = getEnv();

export const auth = betterAuth({
	appName: 'Azetta',
	baseURL: env.BETTER_AUTH_URL,
	basePath: '/api/auth',
	secret: env.BETTER_AUTH_SECRET,
	database: prismaAdapter(prisma, { provider: 'postgresql' }),
	// Tidak ada request browser langsung ke API (semua lewat server web/admin),
	// jadi trustedOrigins cukup default Better Auth (baseURL).
	emailAndPassword: {
		enabled: true,
		disableSignUp: false,
		minPasswordLength: 8
	},
	user: {
		additionalFields: {
			phone: { type: 'string', required: false },
			whatsapp: { type: 'string', required: false },
			city: { type: 'string', required: false },
			company: { type: 'string', required: false },
			lastLoginAt: { type: 'date', required: false, input: false }
		}
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7,
		updateAge: 60 * 60 * 24
	},
	advanced: {
		cookiePrefix: 'azetta',
		...(env.COOKIE_DOMAIN
			? {
					crossSubDomainCookies: {
						enabled: true,
						domain: env.COOKIE_DOMAIN
					}
				}
			: {})
	},
	plugins: [
		admin({
			defaultRole: 'customer',
			adminRoles: ['admin', 'super_admin'],
			ac: defaultAc as never,
			roles: {
				admin: adminAc,
				super_admin: adminAc,
				customer: userAc
			} as never
		})
	]
});

export type AuthSession = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

/** Buat akun super admin pertama dari env (idempoten). */
export async function ensureBootstrapAdmin(): Promise<void> {
	const email = env.ADMIN_EMAIL_SEED?.trim();
	const password = env.ADMIN_PASSWORD_SEED?.trim();
	if (!email || !password) return;

	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) {
		if (existing.role !== 'super_admin') {
			await prisma.user.update({ where: { email }, data: { role: 'super_admin' } });
			console.info(`Akun ${email} dipromosikan menjadi super_admin.`);
		}
		return;
	}

	await auth.api.signUpEmail({
		body: { email, password, name: 'Super Admin' }
	});
	await prisma.user.update({
		where: { email },
		data: { role: 'super_admin', emailVerified: true }
	});
	console.info(`Akun super admin awal dibuat: ${email}`);
}
