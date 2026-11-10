import { UnitMediaKind, UnitPublishStatus, UnitSalesStatus, type Prisma } from '@azetta/db';
import { objectKeyFromUrl } from '../../../lib/object-storage';
import { prisma } from '../../../lib/prisma';
import {
	badRequest,
	conflict,
	list,
	normalizeSearch,
	notFound,
	ok,
	parsePagination,
	pickEnum,
	toStringArray
} from '../../../lib/http';
import type { StaffActor } from '../../../lib/guard';
import { serializeUnit } from '../../../lib/serialize';
import { sanitizeHtml } from '../../../lib/sanitize';
import { recordAudit } from '../../../lib/audit';

const PUBLISH_STATUSES = Object.values(UnitPublishStatus);
const SALES_STATUSES = Object.values(UnitSalesStatus);
const MEDIA_KINDS = Object.values(UnitMediaKind);

const unitInclude = {
	media: { orderBy: { sortOrder: 'asc' as const } }
};

type Query = Record<string, string | undefined>;

function slugify(value: string): string {
	return value
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function parseBigInt(value: unknown): bigint | null {
	if (value === null || value === undefined || value === '') return null;
	const parsed = BigInt(String(value));
	return parsed < 0n ? null : parsed;
}

function parseNumber(value: unknown, fallback = 0): number {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeUnitCode(value: unknown): string {
	return typeof value === 'string' ? value.trim().toUpperCase() : '';
}

async function assertProjectExists(projectId: number) {
	const project = await prisma.project.findFirst({
		where: { id: projectId, deletedAt: null },
		select: { id: true }
	});
	if (!project) throw badRequest('Proyek tidak ditemukan.');
}

async function assertUnitCodeUnique(projectId: number, unitCode: string, excludeId?: number) {
	const duplicate = await prisma.unit.findFirst({
		where: { projectId, unitCode, ...(excludeId ? { id: { not: excludeId } } : {}) },
		select: { id: true }
	});
	if (duplicate) throw conflict(`Kode unit "${unitCode}" sudah dipakai pada proyek ini.`);
}

async function nextAvailableUnitCode(projectId: number, base: string) {
	let candidate = `${base}-COPY`;
	let index = 2;
	while (
		await prisma.unit.findFirst({
			where: { projectId, unitCode: candidate },
			select: { id: true }
		})
	) {
		candidate = `${base}-COPY${index++}`;
	}
	return candidate;
}

async function replaceMedia(unitId: number, cover: string | null, gallery: string[]) {
	await prisma.unitMedia.deleteMany({ where: { unitId } });
	const urls = [...new Set([cover, ...gallery].filter((url): url is string => !!url))];
	let order = 0;
	for (const url of urls) {
		await prisma.unitMedia.create({
			data: {
				unitId,
				url,
				storageKey: objectKeyFromUrl(url),
				isCover: url === cover,
				sortOrder: order++,
				kind: 'PHOTO'
			}
		});
	}
}

export async function listUnits(query: Query) {
	const { page, perPage, skip, take } = parsePagination(query, {
		defaultPerPage: 20,
		maxPerPage: 100
	});
	const term = normalizeSearch(query.q);
	const publishStatus = pickEnum(query.publishStatus ?? query.status, PUBLISH_STATUSES);
	const salesStatus = pickEnum(query.salesStatus, SALES_STATUSES);
	const projectId = query.projectId ? Number(query.projectId) : undefined;

	const where: Prisma.UnitWhereInput = {
		deletedAt: null,
		...(projectId && Number.isInteger(projectId) ? { projectId } : {}),
		...(publishStatus ? { publishStatus } : {}),
		...(salesStatus ? { salesStatus } : {}),
		...(query.featured === 'true' ? { featured: true } : {}),
		...(term
			? {
					OR: [
						{ title: { contains: term, mode: 'insensitive' } },
						{ slug: { contains: term, mode: 'insensitive' } },
						{ unitCode: { contains: term, mode: 'insensitive' } },
						{ typeName: { contains: term, mode: 'insensitive' } }
					]
				}
			: {})
	};

	const orderBy =
		query.sort === 'priceFrom'
			? ({ priceFrom: 'asc' } as const)
			: query.sort === '-priceFrom'
				? ({ priceFrom: 'desc' } as const)
				: query.sort === 'title'
					? ({ title: 'asc' } as const)
					: query.sort === 'unitCode'
						? ({ unitCode: 'asc' } as const)
						: ({ updatedAt: 'desc' } as const);

	const [rows, total] = await Promise.all([
		prisma.unit.findMany({ where, include: unitInclude, orderBy, skip, take }),
		prisma.unit.count({ where })
	]);

	return list(rows.map(serializeUnit), {
		page,
		perPage,
		total,
		totalPages: Math.max(1, Math.ceil(total / perPage))
	});
}

export async function createUnit(
	actor: StaffActor,
	payload: Record<string, unknown>,
	ipHash: string | null
) {
	const title = typeof payload.title === 'string' ? payload.title.trim() : '';
	if (!title) throw badRequest('Judul unit wajib diisi.');

	const projectId = Number(payload.projectId);
	if (!Number.isInteger(projectId) || projectId <= 0) {
		throw badRequest('Proyek wajib dipilih.');
	}
	await assertProjectExists(projectId);

	const slug = slugify(String(payload.slug ?? title));
	const existing = await prisma.unit.findUnique({ where: { slug } });
	if (existing) throw conflict(`Slug "${slug}" sudah dipakai.`);

	const unitCode = normalizeUnitCode(payload.unitCode) || slug.toUpperCase();
	if (!unitCode) throw badRequest('Kode unit wajib diisi.');
	await assertUnitCodeUnique(projectId, unitCode);

	const created = await prisma.unit.create({
		data: {
			slug,
			unitCode,
			typeName: typeof payload.typeName === 'string' && payload.typeName ? payload.typeName : title,
			title,
			subtitle: typeof payload.subtitle === 'string' && payload.subtitle ? payload.subtitle : null,
			description: sanitizeHtml(String(payload.description ?? '')),
			projectId,
			floors: parseNumber(payload.floors, 1),
			bedrooms: parseNumber(payload.bedrooms),
			bathrooms: parseNumber(payload.bathrooms),
			carports: parseNumber(payload.carports),
			buildingAreaM2: parseNumber(payload.buildingAreaM2),
			landAreaM2: parseNumber(payload.landAreaM2 ?? payload.landAreaMinM2),
			estimatedBuildCostMin: parseBigInt(payload.estimatedBuildCostMin),
			estimatedBuildCostMax: parseBigInt(payload.estimatedBuildCostMax),
			priceFrom: parseBigInt(payload.priceFrom),
			publishStatus: pickEnum(String(payload.publishStatus ?? ''), PUBLISH_STATUSES) ?? 'DRAFT',
			salesStatus: pickEnum(String(payload.salesStatus ?? ''), SALES_STATUSES) ?? 'AVAILABLE',
			featured: payload.featured === true,
			publishedAt:
				pickEnum(String(payload.publishStatus ?? ''), PUBLISH_STATUSES) === 'PUBLISHED'
					? new Date()
					: null,
			seoTitle: typeof payload.seoTitle === 'string' && payload.seoTitle ? payload.seoTitle : null,
			seoDescription:
				typeof payload.seoDescription === 'string' && payload.seoDescription
					? payload.seoDescription
					: null
		}
	});

	await replaceMedia(
		created.id,
		String(payload.cover ?? '') || null,
		toStringArray(payload.gallery as string[])
	);

	await recordAudit({
		action: 'unit.create',
		entityType: 'Unit',
		entityId: created.id,
		actorId: actor.id,
		ipHash,
		after: { title, slug, unitCode }
	});

	const result = await prisma.unit.findUnique({
		where: { id: created.id },
		include: unitInclude
	});
	return ok(serializeUnit(result!));
}

export async function getUnit(id: string) {
	const unit = await prisma.unit.findFirst({
		where: { id: Number(id), deletedAt: null },
		include: unitInclude
	});
	if (!unit) throw notFound('Unit tidak ditemukan.');
	return ok(serializeUnit(unit));
}

export async function updateUnit(
	actor: StaffActor,
	id: string,
	payload: Record<string, unknown>,
	ipHash: string | null
) {
	const existing = await prisma.unit.findFirst({
		where: { id: Number(id), deletedAt: null }
	});
	if (!existing) throw notFound('Unit tidak ditemukan.');

	const data: Prisma.UnitUpdateInput = {};
	if (typeof payload.title === 'string' && payload.title.trim()) data.title = payload.title.trim();
	if (typeof payload.slug === 'string' && payload.slug.trim()) {
		const slug = slugify(payload.slug);
		if (slug !== existing.slug) {
			const duplicate = await prisma.unit.findUnique({ where: { slug } });
			if (duplicate) throw conflict(`Slug "${slug}" sudah dipakai.`);
			data.slug = slug;
		}
	}
	if ('subtitle' in payload) data.subtitle = payload.subtitle ? String(payload.subtitle) : null;
	if (typeof payload.description === 'string') data.description = sanitizeHtml(payload.description);
	if (typeof payload.typeName === 'string' && payload.typeName.trim()) {
		data.typeName = payload.typeName.trim();
	}

	let projectId = existing.projectId;
	if ('projectId' in payload) {
		const nextProjectId = Number(payload.projectId);
		if (!Number.isInteger(nextProjectId) || nextProjectId <= 0) {
			throw badRequest('Proyek wajib dipilih.');
		}
		await assertProjectExists(nextProjectId);
		projectId = nextProjectId;
		data.project = { connect: { id: nextProjectId } };
	}

	if ('unitCode' in payload) {
		const unitCode = normalizeUnitCode(payload.unitCode);
		if (!unitCode) throw badRequest('Kode unit wajib diisi.');
		if (unitCode !== existing.unitCode || projectId !== existing.projectId) {
			await assertUnitCodeUnique(projectId, unitCode, existing.id);
		}
		data.unitCode = unitCode;
	} else if (projectId !== existing.projectId) {
		await assertUnitCodeUnique(projectId, existing.unitCode, existing.id);
	}

	if ('floors' in payload) data.floors = parseNumber(payload.floors, existing.floors);
	if ('bedrooms' in payload) data.bedrooms = parseNumber(payload.bedrooms);
	if ('bathrooms' in payload) data.bathrooms = parseNumber(payload.bathrooms);
	if ('carports' in payload) data.carports = parseNumber(payload.carports);
	if ('buildingAreaM2' in payload) data.buildingAreaM2 = parseNumber(payload.buildingAreaM2);
	if ('landAreaM2' in payload) data.landAreaM2 = parseNumber(payload.landAreaM2);
	if ('landAreaMinM2' in payload) data.landAreaM2 = parseNumber(payload.landAreaMinM2);
	if ('estimatedBuildCostMin' in payload) {
		data.estimatedBuildCostMin = parseBigInt(payload.estimatedBuildCostMin);
	}
	if ('estimatedBuildCostMax' in payload) {
		data.estimatedBuildCostMax = parseBigInt(payload.estimatedBuildCostMax);
	}
	if ('priceFrom' in payload) data.priceFrom = parseBigInt(payload.priceFrom);
	if ('publishStatus' in payload) {
		const publishStatus = pickEnum(String(payload.publishStatus ?? ''), PUBLISH_STATUSES);
		if (!publishStatus) throw badRequest('Status publish tidak valid.');
		data.publishStatus = publishStatus;
		if (publishStatus === 'PUBLISHED' && !existing.publishedAt) data.publishedAt = new Date();
	}
	if ('salesStatus' in payload) {
		const salesStatus = pickEnum(String(payload.salesStatus ?? ''), SALES_STATUSES);
		if (!salesStatus) throw badRequest('Status ketersediaan tidak valid.');
		data.salesStatus = salesStatus;
	}
	if (typeof payload.featured === 'boolean') data.featured = payload.featured;
	if ('seoTitle' in payload) data.seoTitle = payload.seoTitle ? String(payload.seoTitle) : null;
	if ('seoDescription' in payload) {
		data.seoDescription = payload.seoDescription ? String(payload.seoDescription) : null;
	}

	await prisma.unit.update({ where: { id: existing.id }, data });
	if ('cover' in payload || 'gallery' in payload) {
		await replaceMedia(
			existing.id,
			payload.cover ? String(payload.cover) : null,
			toStringArray(payload.gallery as string[])
		);
	}

	await recordAudit({
		action: 'unit.update',
		entityType: 'Unit',
		entityId: existing.id,
		actorId: actor.id,
		ipHash,
		before: { title: existing.title, publishStatus: existing.publishStatus },
		after: { title: data.title ?? existing.title }
	});

	const updated = await prisma.unit.findUnique({
		where: { id: existing.id },
		include: unitInclude
	});
	return ok(serializeUnit(updated!));
}

export async function archiveUnit(actor: StaffActor, id: string, ipHash: string | null) {
	const existing = await prisma.unit.findFirst({
		where: { id: Number(id), deletedAt: null }
	});
	if (!existing) throw notFound('Unit tidak ditemukan.');

	const activeLeads = await prisma.lead.count({
		where: {
			unitId: existing.id,
			deletedAt: null,
			status: { notIn: ['WON', 'LOST', 'SPAM'] }
		}
	});
	if (activeLeads > 0) {
		throw conflict('Unit masih memiliki lead aktif dan tidak dapat diarsipkan.');
	}

	await prisma.unit.update({
		where: { id: existing.id },
		data: { publishStatus: 'ARCHIVED', deletedAt: new Date() }
	});
	await recordAudit({
		action: 'unit.archive',
		entityType: 'Unit',
		entityId: existing.id,
		actorId: actor.id,
		ipHash,
		before: { publishStatus: existing.publishStatus },
		after: { publishStatus: 'ARCHIVED' }
	});
	return ok({ id: existing.id, archived: true });
}

export async function publishUnit(actor: StaffActor, id: string, ipHash: string | null) {
	const existing = await prisma.unit.findFirst({
		where: { id: Number(id), deletedAt: null },
		include: { media: true }
	});
	if (!existing) throw notFound('Unit tidak ditemukan.');

	const issues: string[] = [];
	if (existing.media.length === 0) issues.push('Minimal satu media diperlukan.');
	if (existing.description.replace(/<[^>]*>/g, '').trim().length < 50) {
		issues.push('Deskripsi minimal 50 karakter.');
	}
	if (!existing.seoTitle || !existing.seoDescription)
		issues.push('SEO title/description wajib diisi.');
	if (!existing.priceFrom) issues.push('Harga mulai wajib diisi.');
	if (issues.length > 0) {
		throw badRequest(
			'Unit belum memenuhi syarat publish.',
			issues.map((message) => ({ message }))
		);
	}

	const updated = await prisma.unit.update({
		where: { id: existing.id },
		data: { publishStatus: 'PUBLISHED', publishedAt: existing.publishedAt ?? new Date() },
		include: unitInclude
	});
	await recordAudit({
		action: 'unit.publish',
		entityType: 'Unit',
		entityId: existing.id,
		actorId: actor.id,
		ipHash,
		before: { publishStatus: existing.publishStatus },
		after: { publishStatus: 'PUBLISHED' }
	});
	return ok(serializeUnit(updated));
}

export async function setUnitArchived(actor: StaffActor, id: string, ipHash: string | null) {
	const existing = await prisma.unit.findFirst({
		where: { id: Number(id), deletedAt: null }
	});
	if (!existing) throw notFound('Unit tidak ditemukan.');

	const updated = await prisma.unit.update({
		where: { id: existing.id },
		data: { publishStatus: 'ARCHIVED' },
		include: unitInclude
	});
	await recordAudit({
		action: 'unit.archive',
		entityType: 'Unit',
		entityId: existing.id,
		actorId: actor.id,
		ipHash,
		before: { publishStatus: existing.publishStatus },
		after: { publishStatus: 'ARCHIVED' }
	});
	return ok(serializeUnit(updated));
}

export async function duplicateUnit(
	actor: StaffActor,
	id: string,
	payload: Record<string, unknown>,
	ipHash: string | null
) {
	const existing = await prisma.unit.findFirst({
		where: { id: Number(id), deletedAt: null },
		include: unitInclude
	});
	if (!existing) throw notFound('Unit tidak ditemukan.');

	const slugBase = slugify(String(payload.slug ?? `${existing.slug}-copy`));
	let slug = slugBase;
	let slugIndex = 2;
	while (await prisma.unit.findUnique({ where: { slug } })) {
		slug = `${slugBase}-${slugIndex++}`;
	}
	const unitCode = await nextAvailableUnitCode(existing.projectId, existing.unitCode);

	const created = await prisma.unit.create({
		data: {
			slug,
			unitCode,
			typeName: existing.typeName,
			title: `${existing.title} (salinan)`,
			subtitle: existing.subtitle,
			description: existing.description,
			projectId: existing.projectId,
			floors: existing.floors,
			bedrooms: existing.bedrooms,
			bathrooms: existing.bathrooms,
			carports: existing.carports,
			buildingAreaM2: existing.buildingAreaM2,
			landAreaM2: existing.landAreaM2,
			estimatedBuildCostMin: existing.estimatedBuildCostMin,
			estimatedBuildCostMax: existing.estimatedBuildCostMax,
			priceFrom: existing.priceFrom,
			seoTitle: existing.seoTitle,
			seoDescription: existing.seoDescription,
			publishStatus: 'DRAFT',
			salesStatus: existing.salesStatus
		}
	});
	for (const media of existing.media) {
		await prisma.unitMedia.create({
			data: {
				unitId: created.id,
				kind: media.kind,
				storageKey: media.storageKey,
				url: media.url,
				alt: media.alt,
				width: media.width,
				height: media.height,
				sortOrder: media.sortOrder,
				isCover: media.isCover
			}
		});
	}

	await recordAudit({
		action: 'unit.duplicate',
		entityType: 'Unit',
		entityId: created.id,
		actorId: actor.id,
		ipHash,
		before: { sourceId: existing.id },
		after: { id: created.id }
	});

	const result = await prisma.unit.findUnique({
		where: { id: created.id },
		include: unitInclude
	});
	return ok(serializeUnit(result!));
}

export async function addUnitMedia(id: string, payload: Record<string, unknown>) {
	const url = typeof payload.url === 'string' ? payload.url : '';
	if (!url) throw badRequest('URL media wajib diisi.');

	const unit = await prisma.unit.findFirst({
		where: { id: Number(id), deletedAt: null }
	});
	if (!unit) throw notFound('Unit tidak ditemukan.');

	const kind = pickEnum(String(payload.kind ?? ''), MEDIA_KINDS) ?? 'PHOTO';

	const media = await prisma.unitMedia.create({
		data: {
			unitId: unit.id,
			url,
			storageKey: objectKeyFromUrl(String(payload.storageKey ?? url)),
			alt: typeof payload.alt === 'string' ? payload.alt : null,
			kind,
			isCover: payload.isCover === true,
			sortOrder: parseNumber(payload.sortOrder)
		}
	});
	return ok({ id: media.id, url: media.url, isCover: media.isCover });
}

export async function deleteUnitMedia(id: string, mediaId: string) {
	const media = await prisma.unitMedia.findFirst({
		where: { id: Number(mediaId), unitId: Number(id) }
	});
	if (!media) throw notFound('Media tidak ditemukan.');
	await prisma.unitMedia.delete({ where: { id: media.id } });
	return ok({ id: media.id, deleted: true });
}
