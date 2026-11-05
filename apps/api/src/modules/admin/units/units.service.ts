import { DesignCategory, DesignStatus, type Prisma } from '@azetta/db';
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
import { serializeDesign } from '../../../lib/serialize';
import { sanitizeHtml } from '../../../lib/sanitize';
import { recordAudit } from '../../../lib/audit';

const CATEGORIES = Object.values(DesignCategory);
const STATUSES = Object.values(DesignStatus);

const designInclude = {
	media: { orderBy: { sortOrder: 'asc' as const } },
	tags: { include: { tag: true } }
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

async function saveTags(designId: number, tagNames: string[]) {
	await prisma.designTagOnDesign.deleteMany({ where: { designId } });
	for (const name of tagNames) {
		const slug = slugify(name);
		if (!slug) continue;
		const tag = await prisma.designTag.upsert({
			where: { slug },
			update: {},
			create: { slug, name }
		});
		await prisma.designTagOnDesign.create({ data: { designId, tagId: tag.id } });
	}
}

async function replaceMedia(designId: number, cover: string | null, gallery: string[]) {
	await prisma.propertyDesignMedia.deleteMany({ where: { designId } });
	const urls = [...new Set([cover, ...gallery].filter((url): url is string => !!url))];
	let order = 0;
	for (const url of urls) {
		await prisma.propertyDesignMedia.create({
			data: {
				designId,
				url,
				storageKey: objectKeyFromUrl(url),
				isCover: url === cover,
				sortOrder: order++,
				kind: 'IMAGE'
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
	const category = pickEnum(query.category, CATEGORIES);
	const status = pickEnum(query.status, STATUSES);

	const where: Prisma.PropertyDesignWhereInput = {
		deletedAt: null,
		...(category ? { category } : {}),
		...(status ? { status } : {}),
		...(query.featured === 'true' ? { featured: true } : {}),
		...(term
			? {
					OR: [
						{ title: { contains: term, mode: 'insensitive' } },
						{ slug: { contains: term, mode: 'insensitive' } },
						{ style: { contains: term, mode: 'insensitive' } }
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
					: ({ updatedAt: 'desc' } as const);

	const [rows, total] = await Promise.all([
		prisma.propertyDesign.findMany({ where, include: designInclude, orderBy, skip, take }),
		prisma.propertyDesign.count({ where })
	]);

	return list(rows.map(serializeDesign), {
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

	const slug = slugify(String(payload.slug ?? title));
	const existing = await prisma.propertyDesign.findUnique({ where: { slug } });
	if (existing) throw conflict(`Slug "${slug}" sudah dipakai.`);

	const design = await prisma.propertyDesign.create({
		data: {
			slug,
			title,
			subtitle: typeof payload.subtitle === 'string' && payload.subtitle ? payload.subtitle : null,
			description: sanitizeHtml(String(payload.description ?? '')),
			category: pickEnum(String(payload.category ?? 'RESIDENTIAL'), CATEGORIES) ?? 'RESIDENTIAL',
			style: typeof payload.style === 'string' ? payload.style : '',
			floors: parseNumber(payload.floors, 1),
			bedrooms: parseNumber(payload.bedrooms),
			bathrooms: parseNumber(payload.bathrooms),
			carports: parseNumber(payload.carports),
			buildingAreaM2: parseNumber(payload.buildingAreaM2),
			landAreaMinM2: parseNumber(payload.landAreaMinM2),
			estimatedBuildCostMin: parseBigInt(payload.estimatedBuildCostMin),
			estimatedBuildCostMax: parseBigInt(payload.estimatedBuildCostMax),
			priceFrom: parseBigInt(payload.priceFrom),
			featured: payload.featured === true,
			seoTitle: typeof payload.seoTitle === 'string' && payload.seoTitle ? payload.seoTitle : null,
			seoDescription:
				typeof payload.seoDescription === 'string' && payload.seoDescription
					? payload.seoDescription
					: null
		}
	});

	await replaceMedia(
		design.id,
		String(payload.cover ?? '') || null,
		toStringArray(payload.gallery as string[])
	);
	await saveTags(design.id, toStringArray(payload.tags as string[]));

	await recordAudit({
		action: 'design.create',
		entityType: 'PropertyDesign',
		entityId: design.id,
		actorId: actor.id,
		ipHash,
		after: { title, slug }
	});

	const created = await prisma.propertyDesign.findUnique({
		where: { id: design.id },
		include: designInclude
	});
	return ok(serializeDesign(created!));
}

export async function getUnit(id: string) {
	const design = await prisma.propertyDesign.findFirst({
		where: { id: Number(id), deletedAt: null },
		include: designInclude
	});
	if (!design) throw notFound('Unit tidak ditemukan.');
	return ok(serializeDesign(design));
}

export async function updateUnit(
	actor: StaffActor,
	id: string,
	payload: Record<string, unknown>,
	ipHash: string | null
) {
	const existing = await prisma.propertyDesign.findFirst({
		where: { id: Number(id), deletedAt: null }
	});
	if (!existing) throw notFound('Unit tidak ditemukan.');

	const data: Prisma.PropertyDesignUpdateInput = {};
	if (typeof payload.title === 'string' && payload.title.trim()) data.title = payload.title.trim();
	if (typeof payload.slug === 'string' && payload.slug.trim()) {
		const slug = slugify(payload.slug);
		if (slug !== existing.slug) {
			const duplicate = await prisma.propertyDesign.findUnique({ where: { slug } });
			if (duplicate) throw conflict(`Slug "${slug}" sudah dipakai.`);
			data.slug = slug;
		}
	}
	if ('subtitle' in payload) data.subtitle = payload.subtitle ? String(payload.subtitle) : null;
	if (typeof payload.description === 'string') data.description = sanitizeHtml(payload.description);
	const category = pickEnum(String(payload.category ?? ''), CATEGORIES);
	if (category) data.category = category;
	if (typeof payload.style === 'string') data.style = payload.style;
	if ('floors' in payload) data.floors = parseNumber(payload.floors, existing.floors);
	if ('bedrooms' in payload) data.bedrooms = parseNumber(payload.bedrooms);
	if ('bathrooms' in payload) data.bathrooms = parseNumber(payload.bathrooms);
	if ('carports' in payload) data.carports = parseNumber(payload.carports);
	if ('buildingAreaM2' in payload) data.buildingAreaM2 = parseNumber(payload.buildingAreaM2);
	if ('landAreaMinM2' in payload) data.landAreaMinM2 = parseNumber(payload.landAreaMinM2);
	if ('estimatedBuildCostMin' in payload) {
		data.estimatedBuildCostMin = parseBigInt(payload.estimatedBuildCostMin);
	}
	if ('estimatedBuildCostMax' in payload) {
		data.estimatedBuildCostMax = parseBigInt(payload.estimatedBuildCostMax);
	}
	if ('priceFrom' in payload) data.priceFrom = parseBigInt(payload.priceFrom);
	if (typeof payload.featured === 'boolean') data.featured = payload.featured;
	if ('seoTitle' in payload) data.seoTitle = payload.seoTitle ? String(payload.seoTitle) : null;
	if ('seoDescription' in payload) {
		data.seoDescription = payload.seoDescription ? String(payload.seoDescription) : null;
	}

	await prisma.propertyDesign.update({ where: { id: existing.id }, data });
	if ('cover' in payload || 'gallery' in payload) {
		await replaceMedia(
			existing.id,
			payload.cover ? String(payload.cover) : null,
			toStringArray(payload.gallery as string[])
		);
	}
	if ('tags' in payload) await saveTags(existing.id, toStringArray(payload.tags as string[]));

	await recordAudit({
		action: 'design.update',
		entityType: 'PropertyDesign',
		entityId: existing.id,
		actorId: actor.id,
		ipHash,
		before: { title: existing.title, status: existing.status },
		after: { title: data.title ?? existing.title }
	});

	const updated = await prisma.propertyDesign.findUnique({
		where: { id: existing.id },
		include: designInclude
	});
	return ok(serializeDesign(updated!));
}

export async function archiveUnit(actor: StaffActor, id: string, ipHash: string | null) {
	const existing = await prisma.propertyDesign.findFirst({
		where: { id: Number(id), deletedAt: null }
	});
	if (!existing) throw notFound('Unit tidak ditemukan.');

	const activeLeads = await prisma.lead.count({
		where: {
			designId: existing.id,
			deletedAt: null,
			status: { notIn: ['WON', 'LOST', 'SPAM'] }
		}
	});
	if (activeLeads > 0) {
		throw conflict('Unit masih memiliki lead aktif dan tidak dapat diarsipkan.');
	}

	await prisma.propertyDesign.update({
		where: { id: existing.id },
		data: { status: 'ARCHIVED', deletedAt: new Date() }
	});
	await recordAudit({
		action: 'design.archive',
		entityType: 'PropertyDesign',
		entityId: existing.id,
		actorId: actor.id,
		ipHash,
		before: { status: existing.status },
		after: { status: 'ARCHIVED' }
	});
	return ok({ id: existing.id, archived: true });
}

export async function publishUnit(actor: StaffActor, id: string, ipHash: string | null) {
	const existing = await prisma.propertyDesign.findFirst({
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

	const updated = await prisma.propertyDesign.update({
		where: { id: existing.id },
		data: { status: 'PUBLISHED', publishedAt: existing.publishedAt ?? new Date() },
		include: designInclude
	});
	await recordAudit({
		action: 'design.publish',
		entityType: 'PropertyDesign',
		entityId: existing.id,
		actorId: actor.id,
		ipHash,
		before: { status: existing.status },
		after: { status: 'PUBLISHED' }
	});
	return ok(serializeDesign(updated));
}

export async function setUnitArchived(actor: StaffActor, id: string, ipHash: string | null) {
	const existing = await prisma.propertyDesign.findFirst({
		where: { id: Number(id), deletedAt: null }
	});
	if (!existing) throw notFound('Unit tidak ditemukan.');

	const updated = await prisma.propertyDesign.update({
		where: { id: existing.id },
		data: { status: 'ARCHIVED' },
		include: designInclude
	});
	await recordAudit({
		action: 'design.archive',
		entityType: 'PropertyDesign',
		entityId: existing.id,
		actorId: actor.id,
		ipHash,
		before: { status: existing.status },
		after: { status: 'ARCHIVED' }
	});
	return ok(serializeDesign(updated));
}

export async function duplicateUnit(
	actor: StaffActor,
	id: string,
	payload: Record<string, unknown>,
	ipHash: string | null
) {
	const existing = await prisma.propertyDesign.findFirst({
		where: { id: Number(id), deletedAt: null },
		include: designInclude
	});
	if (!existing) throw notFound('Unit tidak ditemukan.');

	const slug = slugify(String(payload.slug ?? `${existing.slug}-copy`));
	if (await prisma.propertyDesign.findUnique({ where: { slug } })) {
		throw conflict(`Slug "${slug}" sudah dipakai.`);
	}

	const created = await prisma.propertyDesign.create({
		data: {
			slug,
			title: `${existing.title} (salinan)`,
			subtitle: existing.subtitle,
			description: existing.description,
			category: existing.category,
			style: existing.style,
			floors: existing.floors,
			bedrooms: existing.bedrooms,
			bathrooms: existing.bathrooms,
			carports: existing.carports,
			buildingAreaM2: existing.buildingAreaM2,
			landAreaMinM2: existing.landAreaMinM2,
			estimatedBuildCostMin: existing.estimatedBuildCostMin,
			estimatedBuildCostMax: existing.estimatedBuildCostMax,
			priceFrom: existing.priceFrom,
			seoTitle: existing.seoTitle,
			seoDescription: existing.seoDescription,
			status: 'DRAFT'
		}
	});
	for (const media of existing.media) {
		await prisma.propertyDesignMedia.create({
			data: {
				designId: created.id,
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
		action: 'design.duplicate',
		entityType: 'PropertyDesign',
		entityId: created.id,
		actorId: actor.id,
		ipHash,
		before: { sourceId: existing.id },
		after: { id: created.id }
	});

	const result = await prisma.propertyDesign.findUnique({
		where: { id: created.id },
		include: designInclude
	});
	return ok(serializeDesign(result!));
}

export async function addUnitMedia(id: string, payload: Record<string, unknown>) {
	const url = typeof payload.url === 'string' ? payload.url : '';
	if (!url) throw badRequest('URL media wajib diisi.');

	const design = await prisma.propertyDesign.findFirst({
		where: { id: Number(id), deletedAt: null }
	});
	if (!design) throw notFound('Unit tidak ditemukan.');

	const media = await prisma.propertyDesignMedia.create({
		data: {
			designId: design.id,
			url,
			storageKey: objectKeyFromUrl(String(payload.storageKey ?? url)),
			alt: typeof payload.alt === 'string' ? payload.alt : null,
			kind: 'IMAGE',
			isCover: payload.isCover === true,
			sortOrder: parseNumber(payload.sortOrder)
		}
	});
	return ok({ id: media.id, url: media.url, isCover: media.isCover });
}

export async function deleteUnitMedia(id: string, mediaId: string) {
	const media = await prisma.propertyDesignMedia.findFirst({
		where: { id: Number(mediaId), designId: Number(id) }
	});
	if (!media) throw notFound('Media tidak ditemukan.');
	await prisma.propertyDesignMedia.delete({ where: { id: media.id } });
	return ok({ id: media.id, deleted: true });
}
