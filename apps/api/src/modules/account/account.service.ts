import { prisma } from '../../lib/prisma';
import { badRequest, notFound, ok } from '../../lib/http';

const STATUS_LABEL: Record<string, string> = {
	NEW: 'Diterima',
	CONTACTED: 'Sedang dihubungi',
	QUALIFIED: 'Sedang ditinjau',
	PROPOSAL: 'Penawaran disiapkan',
	NEGOTIATION: 'Dalam diskusi',
	WON: 'Selesai',
	LOST: 'Ditutup'
};

export async function getProfile(userId: string) {
	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) throw notFound('Akun tidak ditemukan.');
	return ok({
		id: user.id,
		name: user.name,
		email: user.email,
		emailVerified: user.emailVerified,
		phone: user.phone,
		whatsapp: user.whatsapp,
		city: user.city,
		company: user.company
	});
}

export async function updateProfile(userId: string, payload: Record<string, unknown>) {
	const user = await prisma.user.update({
		where: { id: userId },
		data: {
			...(typeof payload.name === 'string' ? { name: payload.name } : {}),
			...(typeof payload.phone === 'string' ? { phone: payload.phone } : {}),
			...(typeof payload.whatsapp === 'string' ? { whatsapp: payload.whatsapp } : {}),
			...(typeof payload.city === 'string' ? { city: payload.city } : {}),
			...(typeof payload.company === 'string' ? { company: payload.company } : {})
		}
	});
	return ok({
		id: user.id,
		name: user.name,
		email: user.email,
		emailVerified: user.emailVerified,
		phone: user.phone,
		whatsapp: user.whatsapp,
		city: user.city,
		company: user.company
	});
}

export async function listMyLeads(userId: string) {
	const rows = await prisma.lead.findMany({
		where: { userId, deletedAt: null, status: { not: 'SPAM' } },
		orderBy: { createdAt: 'desc' },
		include: { unit: { select: { slug: true, title: true } } }
	});
	return ok(
		rows.map((lead) => ({
			id: lead.id,
			reference: lead.reference,
			type: lead.type,
			status: lead.status,
			statusLabel: STATUS_LABEL[lead.status] ?? lead.status,
			message: lead.message,
			unit: lead.unit,
			createdAt: lead.createdAt,
			updatedAt: lead.updatedAt
		}))
	);
}

export async function getMyLead(userId: string, id: string) {
	const lead = await prisma.lead.findFirst({
		where: { id, userId, deletedAt: null },
		include: {
			unit: { select: { slug: true, title: true } },
			landSubmission: true,
			attachments: true,
			activities: {
				where: { type: { in: ['STATUS_CHANGE', 'SYSTEM'] } },
				orderBy: { createdAt: 'desc' }
			}
		}
	});
	if (!lead || lead.status === 'SPAM') throw notFound('Pengajuan tidak ditemukan.');

	return ok({
		id: lead.id,
		reference: lead.reference,
		type: lead.type,
		status: lead.status,
		statusLabel: STATUS_LABEL[lead.status] ?? lead.status,
		message: lead.message,
		unit: lead.unit,
		landSubmission: lead.landSubmission,
		attachments: lead.attachments,
		timeline: lead.activities.map((activity) => ({
			type: activity.type,
			body: activity.body,
			createdAt: activity.createdAt
		})),
		createdAt: lead.createdAt,
		updatedAt: lead.updatedAt
	});
}

export async function getDeletionRequest(userId: string) {
	return ok(
		await prisma.accountDeletionRequest.findFirst({
			where: { userId },
			orderBy: { requestedAt: 'desc' }
		})
	);
}

export async function createDeletionRequest(userId: string, payload: Record<string, unknown>) {
	const pending = await prisma.accountDeletionRequest.findFirst({
		where: { userId, status: 'PENDING' }
	});
	if (pending) throw badRequest('Permohonan hapus akun Anda masih menunggu diproses.');

	return ok(
		await prisma.accountDeletionRequest.create({
			data: {
				userId,
				reason: typeof payload.reason === 'string' && payload.reason ? payload.reason : null
			}
		})
	);
}
