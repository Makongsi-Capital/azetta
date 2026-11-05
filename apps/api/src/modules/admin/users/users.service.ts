import type { Prisma } from '@azetta/db';
import { prisma } from '../../../lib/prisma';
import {
	badRequest,
	forbidden,
	list,
	normalizeSearch,
	notFound,
	ok,
	parsePagination
} from '../../../lib/http';
import type { StaffActor } from '../../../lib/guard';
import {
	serializeCustomer,
	serializeDeletionRequest,
	serializeStaff
} from '../../../lib/serialize';
import { recordAudit } from '../../../lib/audit';

const STAFF_ROLES = ['admin', 'super_admin'];

type Query = Record<string, string | undefined>;

export async function listUsers(query: Query) {
	const { page, perPage, skip, take } = parsePagination(query, {
		defaultPerPage: 20,
		maxPerPage: 100
	});
	const term = normalizeSearch(query.q);
	const where: Prisma.UserWhereInput = {
		role: { in: STAFF_ROLES },
		...(term
			? {
					OR: [
						{ name: { contains: term, mode: 'insensitive' } },
						{ email: { contains: term, mode: 'insensitive' } }
					]
				}
			: {})
	};
	const [rows, total] = await Promise.all([
		prisma.user.findMany({ where, orderBy: { createdAt: 'asc' }, skip, take }),
		prisma.user.count({ where })
	]);
	return list(rows.map(serializeStaff), {
		page,
		perPage,
		total,
		totalPages: Math.max(1, Math.ceil(total / perPage))
	});
}

export async function createStaffUser(
	actor: StaffActor,
	payload: Record<string, unknown>,
	ipHash: string | null
) {
	const email = typeof payload.email === 'string' ? payload.email.trim() : '';
	const name = typeof payload.name === 'string' ? payload.name.trim() : '';
	const password = typeof payload.password === 'string' ? payload.password : '';
	const role =
		typeof payload.role === 'string' && STAFF_ROLES.includes(payload.role) ? payload.role : 'admin';
	if (!email || !name || password.length < 8) {
		throw badRequest('Nama, email, dan kata sandi minimal 8 karakter wajib diisi.');
	}

	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) throw badRequest('Email sudah terpakai.');

	const { auth } = await import('../../../lib/auth');
	const result = await auth.api.signUpEmail({ body: { email, password, name } });
	const user = await prisma.user.update({
		where: { id: result.user.id },
		data: { role, emailVerified: true }
	});

	await recordAudit({
		action: 'user.create',
		entityType: 'User',
		entityId: user.id,
		actorId: actor.id,
		ipHash,
		after: { email, role }
	});
	return ok(serializeStaff(user));
}

export async function updateUserRole(
	actor: StaffActor,
	id: string,
	payload: Record<string, unknown>,
	ipHash: string | null
) {
	const role = typeof payload.role === 'string' ? payload.role : '';
	if (!STAFF_ROLES.includes(role)) throw badRequest('Peran tidak valid.');
	if (id === actor.id && role !== 'super_admin') {
		throw forbidden('Anda tidak dapat menurunkan peran akun sendiri.');
	}

	const existing = await prisma.user.findUnique({ where: { id } });
	if (!existing || !STAFF_ROLES.includes(existing.role)) {
		throw notFound('Pengguna internal tidak ditemukan.');
	}

	const user = await prisma.user.update({ where: { id: existing.id }, data: { role } });
	await recordAudit({
		action: 'user.role.change',
		entityType: 'User',
		entityId: user.id,
		actorId: actor.id,
		ipHash,
		before: { role: existing.role },
		after: { role }
	});
	return ok(serializeStaff(user));
}

export async function setUserDisabled(
	actor: StaffActor,
	id: string,
	payload: Record<string, unknown>,
	ipHash: string | null
) {
	if (id === actor.id) throw forbidden('Anda tidak dapat menonaktifkan akun sendiri.');
	const banned = payload.banned !== false;

	const existing = await prisma.user.findUnique({ where: { id } });
	if (!existing || !STAFF_ROLES.includes(existing.role)) {
		throw notFound('Pengguna internal tidak ditemukan.');
	}

	const user = await prisma.user.update({
		where: { id: existing.id },
		data: { banned, banReason: banned ? 'Dinonaktifkan super admin' : null }
	});
	await recordAudit({
		action: banned ? 'user.disable' : 'user.enable',
		entityType: 'User',
		entityId: user.id,
		actorId: actor.id,
		ipHash,
		before: { banned: existing.banned },
		after: { banned }
	});
	return ok(serializeStaff(user));
}

export async function listCustomers(query: Query) {
	const { page, perPage, skip, take } = parsePagination(query, {
		defaultPerPage: 20,
		maxPerPage: 100
	});
	const term = normalizeSearch(query.q);
	const where: Prisma.UserWhereInput = {
		role: 'customer',
		...(term
			? {
					OR: [
						{ name: { contains: term, mode: 'insensitive' } },
						{ email: { contains: term, mode: 'insensitive' } },
						{ phone: { contains: term } }
					]
				}
			: {})
	};
	const [rows, total] = await Promise.all([
		prisma.user.findMany({
			where,
			orderBy: { createdAt: 'desc' },
			skip,
			take,
			include: { _count: { select: { createdLeads: true } } }
		}),
		prisma.user.count({ where })
	]);
	return list(
		rows.map((user) => serializeCustomer({ ...user, leadCount: user._count.createdLeads })),
		{ page, perPage, total, totalPages: Math.max(1, Math.ceil(total / perPage)) }
	);
}

export async function listDeletionRequests(query: Query) {
	const { page, perPage, skip, take } = parsePagination(query, {
		defaultPerPage: 50,
		maxPerPage: 100
	});
	const status = query.status as 'PENDING' | 'COMPLETED' | 'REJECTED' | undefined;
	const where: Prisma.AccountDeletionRequestWhereInput = status ? { status } : {};

	const [rows, total] = await Promise.all([
		prisma.accountDeletionRequest.findMany({
			where,
			orderBy: { requestedAt: 'desc' },
			include: {
				user: { select: { name: true, email: true } },
				handledBy: { select: { name: true } }
			},
			skip,
			take
		}),
		prisma.accountDeletionRequest.count({ where })
	]);
	return list(rows.map(serializeDeletionRequest), {
		page,
		perPage,
		total,
		totalPages: Math.max(1, Math.ceil(total / perPage))
	});
}

export async function processDeletionRequest(
	actor: StaffActor,
	id: string,
	payload: Record<string, unknown>,
	ipHash: string | null
) {
	const status = payload.status;
	if (status !== 'COMPLETED' && status !== 'REJECTED') {
		throw badRequest('Status harus COMPLETED atau REJECTED.');
	}

	const existing = await prisma.accountDeletionRequest.findUnique({ where: { id } });
	if (!existing) throw notFound('Permohonan tidak ditemukan.');

	const updated = await prisma.accountDeletionRequest.update({
		where: { id: existing.id },
		data: {
			status,
			handledAt: new Date(),
			handledById: actor.id,
			note: typeof payload.note === 'string' && payload.note ? payload.note : null
		},
		include: {
			user: { select: { name: true, email: true } },
			handledBy: { select: { name: true } }
		}
	});

	await recordAudit({
		action: 'deletion-request.process',
		entityType: 'AccountDeletionRequest',
		entityId: existing.id,
		actorId: actor.id,
		ipHash,
		before: { status: existing.status },
		after: { status }
	});
	return ok(serializeDeletionRequest(updated));
}
