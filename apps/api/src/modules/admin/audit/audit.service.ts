import type { Prisma } from '@azetta/db';
import { prisma } from '../../../lib/prisma';
import { list, normalizeSearch, parsePagination } from '../../../lib/http';
import { serializeAuditLog } from '../../../lib/serialize';

type Query = Record<string, string | undefined>;

export async function listAuditLogs(query: Query) {
	const { page, perPage, skip, take } = parsePagination(query, {
		defaultPerPage: 50,
		maxPerPage: 100
	});
	const term = normalizeSearch(query.q);
	const where: Prisma.AuditLogWhereInput = {
		...(query.entityType ? { entityType: query.entityType } : {}),
		...(query.actorId ? { actorId: query.actorId } : {}),
		...(term
			? {
					OR: [
						{ action: { contains: term, mode: 'insensitive' } },
						{ entityType: { contains: term, mode: 'insensitive' } },
						{ entityId: { contains: term, mode: 'insensitive' } }
					]
				}
			: {})
	};
	const [rows, total] = await Promise.all([
		prisma.auditLog.findMany({
			where,
			orderBy: { createdAt: 'desc' },
			skip,
			take,
			include: { actor: { select: { name: true } } }
		}),
		prisma.auditLog.count({ where })
	]);
	return list(rows.map(serializeAuditLog), {
		page,
		perPage,
		total,
		totalPages: Math.max(1, Math.ceil(total / perPage))
	});
}
