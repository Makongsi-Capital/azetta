import { prisma } from '../../../lib/prisma';
import { badRequest, ok } from '../../../lib/http';
import type { StaffActor } from '../../../lib/guard';
import { recordAudit } from '../../../lib/audit';

export async function getSettings() {
	const rows = await prisma.siteSetting.findMany({ orderBy: { key: 'asc' } });
	return ok(Object.fromEntries(rows.map((row) => [row.key, row.value])));
}

export async function updateSettings(
	actor: StaffActor,
	payload: Record<string, unknown>,
	ipHash: string | null
) {
	if (Object.keys(payload).length === 0) throw badRequest('Tidak ada pengaturan yang dikirim.');

	const before = await prisma.siteSetting.findMany({
		where: { key: { in: Object.keys(payload) } }
	});

	for (const [key, value] of Object.entries(payload)) {
		await prisma.siteSetting.upsert({
			where: { key },
			update: { value: value as never, updatedById: actor.id },
			create: { key, value: value as never, updatedById: actor.id }
		});
	}

	await recordAudit({
		action: 'settings.update',
		entityType: 'SiteSetting',
		entityId: Object.keys(payload).join(','),
		actorId: actor.id,
		ipHash,
		before: Object.fromEntries(before.map((row) => [row.key, row.value])),
		after: payload
	});
	return ok(payload);
}

export async function presignSettingAsset() {
	return ok({ uploads: [] });
}
