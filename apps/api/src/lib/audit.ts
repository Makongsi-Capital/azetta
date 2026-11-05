import { prisma } from './prisma';

interface AuditInput {
	action: string;
	entityType: string;
	entityId: string | number;
	actorId?: string | null;
	ipHash?: string | null;
	before?: unknown;
	after?: unknown;
}

export async function recordAudit(input: AuditInput): Promise<void> {
	await prisma.auditLog.create({
		data: {
			action: input.action,
			entityType: input.entityType,
			entityId: String(input.entityId),
			actorId: input.actorId ?? null,
			ipHash: input.ipHash ?? null,
			before: (input.before ?? null) as never,
			after: (input.after ?? null) as never
		}
	});
}
