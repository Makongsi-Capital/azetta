import { LeadPriority, LeadStatus, LeadType, type Prisma } from '@azetta/db';
import { prisma } from '../../../lib/prisma';
import {
	badRequest,
	conflict,
	list,
	normalizeSearch,
	notFound,
	ok,
	parsePagination,
	pickEnum
} from '../../../lib/http';
import type { StaffActor } from '../../../lib/guard';
import { serializeLead } from '../../../lib/serialize';
import { recordAudit } from '../../../lib/audit';

const STATUSES = Object.values(LeadStatus);
const TYPES = Object.values(LeadType);
const PRIORITIES = Object.values(LeadPriority);

const TRANSITIONS: Record<string, string[]> = {
	NEW: ['CONTACTED', 'LOST', 'SPAM'],
	CONTACTED: ['QUALIFIED', 'LOST', 'SPAM'],
	QUALIFIED: ['PROPOSAL', 'LOST'],
	PROPOSAL: ['NEGOTIATION', 'QUALIFIED', 'WON', 'LOST'],
	NEGOTIATION: ['WON', 'LOST'],
	WON: [],
	LOST: ['NEW'],
	SPAM: ['NEW']
};

const CONTACT_ACTIVITIES = new Set(['CALL', 'WHATSAPP', 'EMAIL', 'MEETING']);
const ACTIVITY_TYPES = [
	'NOTE',
	'STATUS_CHANGE',
	'ASSIGNMENT',
	'CALL',
	'WHATSAPP',
	'EMAIL',
	'MEETING',
	'SYSTEM'
];

const leadInclude = {
	unit: { select: { id: true, title: true } },
	assignedTo: { select: { id: true, name: true } },
	landSubmission: true,
	attachments: true,
	activities: {
		orderBy: { createdAt: 'desc' as const },
		include: { actor: { select: { name: true } } }
	}
};

type Query = Record<string, string | undefined>;

function buildFilters(query: Query, actorId: string): Prisma.LeadWhereInput {
	const term = normalizeSearch(query.q);
	const assignedToId = query.assignedToId === 'me' ? actorId : query.assignedToId;
	const createdFrom = query.createdFrom ? new Date(query.createdFrom) : undefined;
	const createdTo = query.createdTo ? new Date(query.createdTo) : undefined;
	const status = pickEnum(query.status, STATUSES);
	const type = pickEnum(query.type, TYPES);
	const priority = pickEnum(query.priority, PRIORITIES);

	return {
		deletedAt: null,
		...(status ? { status } : {}),
		...(type ? { type } : {}),
		...(priority ? { priority } : {}),
		...(assignedToId ? { assignedToId } : {}),
		...(createdFrom || createdTo
			? {
					createdAt: {
						...(createdFrom ? { gte: createdFrom } : {}),
						...(createdTo ? { lte: createdTo } : {})
					}
				}
			: {}),
		...(term
			? {
					OR: [
						{ name: { contains: term, mode: 'insensitive' } },
						{ phone: { contains: term } },
						{ email: { contains: term, mode: 'insensitive' } },
						{ reference: { contains: term, mode: 'insensitive' } }
					]
				}
			: {})
	};
}

export async function listLeads(actor: StaffActor, query: Query) {
	const { page, perPage, skip, take } = parsePagination(query, {
		defaultPerPage: 20,
		maxPerPage: 100
	});
	const where = buildFilters(query, actor.id);
	const orderBy =
		query.sort === 'createdAt'
			? ({ createdAt: 'asc' } as const)
			: query.sort === 'nextFollowUpAt'
				? ({ nextFollowUpAt: 'asc' } as const)
				: ({ createdAt: 'desc' } as const);

	const [rows, total] = await Promise.all([
		prisma.lead.findMany({ where, include: leadInclude, orderBy, skip, take }),
		prisma.lead.count({ where })
	]);

	return list(rows.map(serializeLead), {
		page,
		perPage,
		total,
		totalPages: Math.max(1, Math.ceil(total / perPage))
	});
}

export async function getLeadStats(actor: StaffActor) {
	const now = new Date();
	const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const staleThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);

	const [total, newCount, notContacted, mine, newToday, staleOver24h, grouped] = await Promise.all([
		prisma.lead.count({ where: { deletedAt: null } }),
		prisma.lead.count({ where: { deletedAt: null, status: 'NEW' } }),
		prisma.lead.count({ where: { deletedAt: null, status: 'NEW', firstContactedAt: null } }),
		prisma.lead.count({ where: { deletedAt: null, assignedToId: actor.id } }),
		prisma.lead.count({ where: { deletedAt: null, createdAt: { gte: startOfToday } } }),
		prisma.lead.count({
			where: { deletedAt: null, status: 'NEW', createdAt: { lt: staleThreshold } }
		}),
		prisma.lead.groupBy({ by: ['status'], where: { deletedAt: null }, _count: { _all: true } })
	]);

	const byStatus = Object.fromEntries(STATUSES.map((status) => [status, 0])) as Record<
		string,
		number
	>;
	for (const row of grouped) byStatus[row.status] = row._count._all;

	return ok({ total, new: newCount, notContacted, mine, newToday, staleOver24h, byStatus });
}

export async function exportLeadsCsv(actor: StaffActor, query: Query) {
	const where = buildFilters(query, actor.id);
	const rows = await prisma.lead.findMany({
		where,
		include: { unit: { select: { title: true } }, assignedTo: { select: { name: true } } },
		orderBy: { createdAt: 'desc' }
	});

	const header = [
		'reference',
		'createdAt',
		'type',
		'status',
		'priority',
		'name',
		'phone',
		'email',
		'city',
		'unitTitle',
		'assignedTo',
		'source',
		'utmSource',
		'utmCampaign',
		'estimatedValue',
		'firstContactedAt',
		'closedAt',
		'lostReason'
	];
	const escape = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
	const body = rows.map((lead) =>
		[
			lead.reference,
			lead.createdAt.toISOString(),
			lead.type,
			lead.status,
			lead.priority,
			lead.name,
			lead.phone,
			lead.email,
			lead.city,
			lead.unit?.title,
			lead.assignedTo?.name,
			lead.source,
			lead.utmSource,
			lead.utmCampaign,
			lead.estimatedValue?.toString(),
			lead.firstContactedAt?.toISOString(),
			lead.closedAt?.toISOString(),
			lead.lostReason
		]
			.map(escape)
			.join(',')
	);

	return `\uFEFF${[header.join(','), ...body].join('\r\n')}`;
}

export async function getLead(id: string) {
	const lead = await prisma.lead.findFirst({
		where: { id, deletedAt: null },
		include: leadInclude
	});
	if (!lead) throw notFound('Lead tidak ditemukan.');
	return ok(serializeLead(lead));
}

export async function createLead(
	actor: StaffActor,
	payload: Record<string, unknown>,
	ipHash: string | null
) {
	const name = typeof payload.name === 'string' ? payload.name.trim() : '';
	const phone = typeof payload.phone === 'string' ? payload.phone.trim() : '';
	if (!name || !phone) throw badRequest('Nama dan nomor telepon wajib diisi.');

	const type = pickEnum(String(payload.type ?? 'GENERAL'), TYPES) ?? 'GENERAL';
	const priority = pickEnum(String(payload.priority ?? 'NORMAL'), PRIORITIES) ?? 'NORMAL';
	const phoneNormalized = phone.replace(/\D/g, '').replace(/^0/, '62');
	const prefix = { BUY_UNIT: 'BU', LAND_OFFER: 'LD', GENERAL: 'GN' }[type];
	const now = new Date();
	const reference = `AZT-${prefix}-${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

	const lead = await prisma.lead.create({
		data: {
			reference,
			type,
			priority,
			name,
			phone,
			phoneNormalized,
			email: typeof payload.email === 'string' && payload.email ? payload.email : null,
			city: typeof payload.city === 'string' && payload.city ? payload.city : null,
			message: typeof payload.message === 'string' && payload.message ? payload.message : null,
			source: 'OTHER',
			assignedToId: actor.id,
			activities: {
				create: {
					type: 'SYSTEM',
					body: 'Lead dibuat manual oleh admin.',
					actorId: actor.id
				}
			}
		},
		include: leadInclude
	});

	await recordAudit({
		action: 'lead.create',
		entityType: 'Lead',
		entityId: lead.id,
		actorId: actor.id,
		ipHash,
		after: { reference, type, priority }
	});

	return ok(serializeLead(lead));
}

export async function updateLead(
	actor: StaffActor,
	id: string,
	payload: Record<string, unknown>,
	ipHash: string | null
) {
	const existing = await prisma.lead.findFirst({ where: { id, deletedAt: null } });
	if (!existing) throw notFound('Lead tidak ditemukan.');

	const data: Prisma.LeadUpdateInput = {};
	const priority = pickEnum(String(payload.priority ?? ''), PRIORITIES);
	if (priority) data.priority = priority;
	if (typeof payload.city === 'string') data.city = payload.city;
	if (typeof payload.customerNote === 'string') {
		data.customerNote = payload.customerNote;
		data.customerNoteUpdatedAt = new Date();
	}
	if ('assignedToId' in payload) {
		data.assignedTo =
			typeof payload.assignedToId === 'string' && payload.assignedToId
				? { connect: { id: payload.assignedToId } }
				: { disconnect: true };
	}
	if ('estimatedValue' in payload) {
		data.estimatedValue =
			payload.estimatedValue === null || payload.estimatedValue === ''
				? null
				: BigInt(String(payload.estimatedValue));
	}
	if ('nextFollowUpAt' in payload) {
		data.nextFollowUpAt = payload.nextFollowUpAt ? new Date(String(payload.nextFollowUpAt)) : null;
	}

	const updated = await prisma.lead.update({
		where: { id: existing.id },
		data,
		include: leadInclude
	});

	await recordAudit({
		action: 'lead.update',
		entityType: 'Lead',
		entityId: existing.id,
		actorId: actor.id,
		ipHash,
		before: {
			priority: existing.priority,
			assignedToId: existing.assignedToId,
			estimatedValue: existing.estimatedValue?.toString() ?? null,
			nextFollowUpAt: existing.nextFollowUpAt?.toISOString() ?? null
		},
		after: {
			priority: updated.priority,
			assignedToId: updated.assignedToId,
			estimatedValue: updated.estimatedValue?.toString() ?? null,
			nextFollowUpAt: updated.nextFollowUpAt?.toISOString() ?? null
		}
	});

	return ok(serializeLead(updated));
}

export async function changeLeadStatus(
	actor: StaffActor,
	id: string,
	payload: Record<string, unknown>,
	ipHash: string | null
) {
	const nextStatus = pickEnum(String(payload.status ?? ''), STATUSES);
	if (!nextStatus) throw badRequest('Status tidak valid.');

	const existing = await prisma.lead.findFirst({ where: { id, deletedAt: null } });
	if (!existing) throw notFound('Lead tidak ditemukan.');
	if (existing.status === nextStatus) {
		const lead = await prisma.lead.findUnique({ where: { id: existing.id }, include: leadInclude });
		return ok(serializeLead(lead!));
	}

	const allowed = TRANSITIONS[existing.status] ?? [];
	if (!allowed.includes(nextStatus)) {
		throw conflict(`Transisi status ${existing.status} → ${nextStatus} tidak diizinkan.`);
	}
	if (nextStatus === 'LOST' && !String(payload.lostReason ?? '').trim()) {
		throw badRequest('Alasan kalah wajib diisi sebelum menandai lead LOST.');
	}

	const now = new Date();
	const updated = await prisma.lead.update({
		where: { id: existing.id },
		data: {
			status: nextStatus,
			...(nextStatus === 'CONTACTED' && !existing.firstContactedAt
				? { firstContactedAt: now }
				: {}),
			...(nextStatus === 'WON' || nextStatus === 'LOST' ? { closedAt: now } : {}),
			...(nextStatus === 'LOST'
				? { lostReason: String(payload.lostReason) }
				: nextStatus === 'NEW'
					? { lostReason: null, closedAt: null }
					: {}),
			...('estimatedValue' in payload &&
			payload.estimatedValue !== null &&
			payload.estimatedValue !== ''
				? { estimatedValue: BigInt(String(payload.estimatedValue)) }
				: {}),
			activities: {
				create: {
					type: 'STATUS_CHANGE',
					body:
						typeof payload.note === 'string' && payload.note.trim()
							? payload.note.trim()
							: `Status ${existing.status} → ${nextStatus}.`,
					meta: { from: existing.status, to: nextStatus },
					actorId: actor.id
				}
			}
		},
		include: leadInclude
	});

	await recordAudit({
		action: 'lead.status.change',
		entityType: 'Lead',
		entityId: existing.id,
		actorId: actor.id,
		ipHash,
		before: { status: existing.status },
		after: { status: nextStatus }
	});

	return ok(serializeLead(updated));
}

export async function addLeadActivity(
	actor: StaffActor,
	id: string,
	payload: Record<string, unknown>
) {
	const type = pickEnum(String(payload.type ?? ''), ACTIVITY_TYPES);
	if (!type || type === 'STATUS_CHANGE' || type === 'SYSTEM') {
		throw badRequest('Tipe aktivitas tidak valid.');
	}
	const activityBody = typeof payload.body === 'string' ? payload.body.trim() : '';
	if (CONTACT_ACTIVITIES.has(type) || type === 'NOTE') {
		if (!activityBody) throw badRequest('Catatan aktivitas wajib diisi.');
		if (activityBody.length > 2000) {
			throw badRequest('Catatan aktivitas maksimal 2.000 karakter.');
		}
	}

	const existing = await prisma.lead.findFirst({ where: { id, deletedAt: null } });
	if (!existing) throw notFound('Lead tidak ditemukan.');

	const now = new Date();
	const activity = await prisma.leadActivity.create({
		data: {
			leadId: existing.id,
			type: type as 'NOTE',
			body: activityBody || null,
			meta: (payload.meta ?? undefined) as never,
			actorId: actor.id
		}
	});

	if (CONTACT_ACTIVITIES.has(type)) {
		await prisma.lead.update({
			where: { id: existing.id },
			data: {
				lastContactedAt: now,
				...(existing.firstContactedAt ? {} : { firstContactedAt: now })
			}
		});
	}

	return ok({
		id: activity.id,
		type: activity.type,
		body: activity.body ?? '',
		actorName: actor.name,
		createdAt: activity.createdAt
	});
}

export async function deleteLeadActivity(
	actor: StaffActor,
	id: string,
	activityId: string,
	ipHash: string | null
) {
	const activity = await prisma.leadActivity.findFirst({
		where: { id: Number(activityId), leadId: id }
	});
	if (!activity) throw notFound('Aktivitas tidak ditemukan.');

	await prisma.leadActivity.delete({ where: { id: activity.id } });
	await recordAudit({
		action: 'lead.activity.delete',
		entityType: 'LeadActivity',
		entityId: activity.id,
		actorId: actor.id,
		ipHash,
		before: { type: activity.type, body: activity.body }
	});

	return ok({ id: activity.id, deleted: true });
}

export async function getLeadAttachmentUrl(id: string, attachmentId: string) {
	const attachment = await prisma.leadAttachment.findFirst({
		where: { id: Number(attachmentId), leadId: id }
	});
	if (!attachment) throw notFound('Lampiran tidak ditemukan.');

	return ok({ url: attachment.storageKey, expiresIn: 900 });
}
