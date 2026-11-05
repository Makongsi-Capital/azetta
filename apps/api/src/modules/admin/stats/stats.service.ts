import { LeadStatus, LeadType } from '@azetta/db';
import { prisma } from '../../../lib/prisma';
import { ok } from '../../../lib/http';

const STATUSES = Object.values(LeadStatus);
const TYPES = Object.values(LeadType);

function dayKey(date: Date): string {
	return date.toISOString().slice(0, 10);
}

export async function getOverview() {
	const now = new Date();
	const startOfToday = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
	const staleThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);

	const [newToday, notContacted, staleOver24h, byTypeRows, byStatusRows, contactedLeads] =
		await Promise.all([
			prisma.lead.count({ where: { deletedAt: null, createdAt: { gte: startOfToday } } }),
			prisma.lead.count({ where: { deletedAt: null, status: 'NEW', firstContactedAt: null } }),
			prisma.lead.count({
				where: { deletedAt: null, status: 'NEW', createdAt: { lt: staleThreshold } }
			}),
			prisma.lead.groupBy({ by: ['type'], where: { deletedAt: null }, _count: { _all: true } }),
			prisma.lead.groupBy({ by: ['status'], where: { deletedAt: null }, _count: { _all: true } }),
			prisma.lead.findMany({
				where: { deletedAt: null, firstContactedAt: { not: null } },
				select: { createdAt: true, firstContactedAt: true },
				take: 500,
				orderBy: { createdAt: 'desc' }
			})
		]);

	const byType = Object.fromEntries(TYPES.map((type) => [type, 0])) as Record<string, number>;
	for (const row of byTypeRows) byType[row.type] = row._count._all;
	const byStatus = Object.fromEntries(STATUSES.map((status) => [status, 0])) as Record<
		string,
		number
	>;
	for (const row of byStatusRows) byStatus[row.status] = row._count._all;

	const responseMinutes = contactedLeads
		.map((lead) => (lead.firstContactedAt!.getTime() - lead.createdAt.getTime()) / 60_000)
		.filter((minutes) => Number.isFinite(minutes) && minutes >= 0)
		.sort((a, b) => a - b);
	const medianFirstResponseMinutes =
		responseMinutes.length === 0
			? null
			: Math.round(responseMinutes[Math.floor(responseMinutes.length / 2)]!);

	return ok({
		newToday,
		notContacted,
		staleOver24h,
		byType,
		byStatus,
		medianFirstResponseMinutes
	});
}

export async function getLeadsTimeseries(daysInput: number) {
	const days = Math.min(90, Math.max(1, daysInput || 30));
	const start = new Date();
	start.setUTCHours(0, 0, 0, 0);
	start.setUTCDate(start.getUTCDate() - (days - 1));

	const leads = await prisma.lead.findMany({
		where: { deletedAt: null, createdAt: { gte: start } },
		select: { createdAt: true, type: true }
	});

	const buckets = new Map<
		string,
		{ date: string; count: number; byType: Record<string, number> }
	>();
	for (let index = 0; index < days; index += 1) {
		const date = new Date(start.getTime() + index * 24 * 60 * 60 * 1000);
		const key = dayKey(date);
		buckets.set(key, {
			date: key,
			count: 0,
			byType: Object.fromEntries(TYPES.map((type) => [type, 0])) as Record<string, number>
		});
	}
	for (const lead of leads) {
		const bucket = buckets.get(dayKey(lead.createdAt));
		if (!bucket) continue;
		bucket.count += 1;
		bucket.byType[lead.type] = (bucket.byType[lead.type] ?? 0) + 1;
	}

	return ok(
		[...buckets.values()].map((bucket) => ({
			date: bucket.date,
			count: bucket.count,
			...bucket.byType
		}))
	);
}

export async function getFunnel() {
	const rows = await prisma.lead.groupBy({
		by: ['status'],
		where: { deletedAt: null },
		_count: { _all: true }
	});
	const counts = Object.fromEntries(STATUSES.map((status) => [status, 0])) as Record<
		string,
		number
	>;
	for (const row of rows) counts[row.status] = row._count._all;
	return ok(counts);
}
