import { createHash } from 'node:crypto';
import { getEnv } from '../env';
import { auth } from './auth';
import { forbidden, unauthorized } from './http';

const env = getEnv();

export interface StaffActor {
	id: string;
	name: string;
	email: string;
	role: string;
}

export interface CustomerActor {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
}

export async function getSession(headers: Headers) {
	return auth.api.getSession({ headers });
}

/** Sesi aktif dengan peran staf (admin/super_admin). */
export async function requireStaff(headers: Headers): Promise<StaffActor> {
	const session = await getSession(headers);
	if (!session) throw unauthorized();

	const user = session.user as typeof session.user & { role?: string };
	if (user.role !== 'admin' && user.role !== 'super_admin') {
		throw forbidden('Hanya staf internal yang dapat mengakses endpoint ini.');
	}

	return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function requireSuperAdmin(headers: Headers): Promise<StaffActor> {
	const actor = await requireStaff(headers);
	if (actor.role !== 'super_admin') {
		throw forbidden('Aksi ini hanya dapat dilakukan super admin.');
	}
	return actor;
}

/** Sesi customer dengan email terverifikasi (endpoint `/me/*`). */
export async function requireVerifiedCustomer(headers: Headers): Promise<CustomerActor> {
	const session = await getSession(headers);
	if (!session) throw unauthorized();
	if (!session.user.emailVerified) {
		throw forbidden('Verifikasi email diperlukan untuk mengakses data ini.');
	}
	return {
		id: session.user.id,
		name: session.user.name,
		email: session.user.email,
		emailVerified: session.user.emailVerified
	};
}

export function hashIp(ip: string | undefined | null): string | null {
	if (!ip) return null;
	return createHash('sha256').update(`${env.IP_HASH_SALT}:${ip}`).digest('hex').slice(0, 24);
}
