import { prisma } from '../../lib/prisma';
import {
	badRequest,
	list,
	notFound,
	ok,
	parsePagination,
	pickEnum,
	toStringArray
} from '../../lib/http';
import { serializeUnit } from '../../lib/serialize';
import { storage } from '../../lib/storage.service';
import { getEnv } from '../../env';

const env = getEnv();

const unitInclude = {
	media: { orderBy: { sortOrder: 'asc' as const } },
	project: {
		select: { slug: true, title: true, city: true, province: true, location: true }
	}
};

type Query = Record<string, string | undefined>;

type UnitWithRelations = Parameters<typeof serializeUnit>[0] & {
	project?: {
		slug: string;
		title: string;
		city: string;
		province: string;
		location: string;
	} | null;
};

function publicProject(project: UnitWithRelations['project']) {
	return project
		? {
				slug: project.slug,
				title: project.title,
				city: project.city,
				province: project.province,
				location: project.location
			}
		: null;
}

function publicUnit(unit: UnitWithRelations, includeDescription: boolean) {
	const serialized = serializeUnit(unit);
	return {
		id: serialized.id,
		slug: serialized.slug,
		unitCode: serialized.unitCode,
		typeName: serialized.typeName,
		title: serialized.title,
		subtitle: serialized.subtitle,
		project: publicProject(unit.project),
		...(includeDescription ? { description: serialized.description } : {}),
		floors: serialized.floors,
		bedrooms: serialized.bedrooms,
		bathrooms: serialized.bathrooms,
		carports: serialized.carports,
		buildingAreaM2: serialized.buildingAreaM2,
		landAreaM2: serialized.landAreaM2,
		priceFrom: serialized.priceFrom,
		featured: serialized.featured,
		salesStatus: serialized.salesStatus,
		cover: serialized.cover
			? { url: serialized.cover, alt: serialized.title, width: null, height: null }
			: null,
		...(includeDescription
			? {
					media: serialized.media,
					publishedAt: serialized.publishedAt,
					updatedAt: serialized.updatedAt,
					seo: { title: serialized.seoTitle, description: serialized.seoDescription }
				}
			: {})
	};
}

function normalizePhone(phone: string): string {
	return phone.replace(/\D/g, '').replace(/^0/, '62');
}

function referenceFor(type: string): string {
	const prefix = { BUY_UNIT: 'BU', LAND_OFFER: 'LD', GENERAL: 'GN' }[type] ?? 'GN';
	const now = new Date();
	return `AZT-${prefix}-${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

async function verifyTurnstile(token: string | undefined): Promise<boolean> {
	if (env.NODE_ENV !== 'production') return true;
	if (!token) return false;
	try {
		const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token })
		});
		const result = (await response.json()) as { success?: boolean };
		return result.success === true;
	} catch {
		return false;
	}
}

export async function listUnits(query: Query) {
	const { page, perPage, skip, take } = parsePagination(query, {
		defaultPerPage: 12,
		maxPerPage: 50
	});
	const type = query.type?.trim() || undefined;
	const salesStatusQuery = query.salesStatus?.trim();
	const salesStatus =
		salesStatusQuery === 'AVAILABLE' || salesStatusQuery === 'INDENT' || salesStatusQuery === 'SOLD'
			? (salesStatusQuery as 'AVAILABLE' | 'INDENT' | 'SOLD')
			: undefined;
	const bedrooms = query.bedrooms ? Number(query.bedrooms) : undefined;
	const minLandArea = query.minLandArea ? Number(query.minLandArea) : undefined;
	const minBuildingArea = query.minBuildingArea ? Number(query.minBuildingArea) : undefined;
	const minPrice = toBigInt(query.minPrice);
	const maxPrice = toBigInt(query.maxPrice);

	const where = {
		deletedAt: null,
		publishStatus: 'PUBLISHED' as const,
		...(salesStatus ? { salesStatus } : {}),
		...(query.q
			? {
					OR: [
						{ title: { contains: query.q, mode: 'insensitive' as const } },
						{ subtitle: { contains: query.q, mode: 'insensitive' as const } },
						{ typeName: { contains: query.q, mode: 'insensitive' as const } },
						{ unitCode: { contains: query.q, mode: 'insensitive' as const } }
					]
				}
			: {})
	};
	const scoped =
		query.project || query.city
			? {
					...where,
					project: {
						...(query.project ? { slug: query.project } : {}),
						...(query.city ? { city: { equals: query.city, mode: 'insensitive' as const } } : {})
					}
				}
			: where;
	const filtered = {
		...scoped,
		...(type ? { typeName: { equals: type, mode: 'insensitive' as const } } : {}),
		...(query.featured === 'true' ? { featured: true } : {}),
		...(Number.isInteger(bedrooms) && Number(bedrooms) > 0
			? { bedrooms: { gte: Number(bedrooms) } }
			: {}),
		...(Number.isInteger(minLandArea) && Number(minLandArea) > 0
			? { landAreaM2: { gte: Number(minLandArea) } }
			: {}),
		...(Number.isInteger(minBuildingArea) && Number(minBuildingArea) > 0
			? { buildingAreaM2: { gte: Number(minBuildingArea) } }
			: {}),
		...(minPrice !== undefined || maxPrice !== undefined
			? {
					priceFrom: {
						...(minPrice !== undefined ? { gte: minPrice } : {}),
						...(maxPrice !== undefined ? { lte: maxPrice } : {})
					}
				}
			: {})
	};

	const orderBy =
		query.sort === 'priceFrom'
			? ({ priceFrom: 'asc' } as const)
			: query.sort === '-priceFrom'
				? ({ priceFrom: 'desc' } as const)
				: query.sort === '-landAreaM2'
					? ({ landAreaM2: 'desc' } as const)
					: ({ publishedAt: 'desc' } as const);

	const [rows, total] = await Promise.all([
		prisma.unit.findMany({
			where: filtered,
			include: unitInclude,
			orderBy,
			skip,
			take
		}),
		prisma.unit.count({ where: filtered })
	]);

	return list(
		rows.map((row) => publicUnit(row, false)),
		{
			page,
			perPage,
			total,
			totalPages: Math.max(1, Math.ceil(total / perPage))
		}
	);
}

export async function getUnitFilters() {
	const [projects, types, priceRange] = await Promise.all([
		prisma.project.findMany({
			where: { deletedAt: null, isPublished: true },
			select: { slug: true, title: true, city: true },
			orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }]
		}),
		prisma.unit.findMany({
			where: { deletedAt: null, publishStatus: 'PUBLISHED' },
			select: { typeName: true },
			distinct: ['typeName']
		}),
		prisma.unit.aggregate({
			where: { deletedAt: null, publishStatus: 'PUBLISHED' },
			_min: { priceFrom: true },
			_max: { priceFrom: true }
		})
	]);
	return ok({
		cities: [...new Set(projects.map((row) => row.city).filter(Boolean))],
		projects: projects.map((row) => ({ slug: row.slug, title: row.title, city: row.city })),
		types: types.map((row) => row.typeName).filter(Boolean),
		minPrice: priceRange._min.priceFrom?.toString() ?? null,
		maxPrice: priceRange._max.priceFrom?.toString() ?? null
	});
}

function toBigInt(value: string | undefined): bigint | undefined {
	if (!value || !/^\d+$/.test(value.trim())) return undefined;
	return BigInt(value.trim());
}

export async function getUnitBySlug(slug: string) {
	const unit = await prisma.unit.findFirst({
		where: { slug, publishStatus: 'PUBLISHED', deletedAt: null },
		include: unitInclude
	});
	if (!unit) throw notFound('Unit tidak ditemukan.');
	return ok(publicUnit(unit, true));
}

export async function getRelatedUnits(slug: string) {
	const unit = await prisma.unit.findFirst({
		where: { slug, publishStatus: 'PUBLISHED', deletedAt: null }
	});
	if (!unit) throw notFound('Unit tidak ditemukan.');

	const rows = await prisma.unit.findMany({
		where: {
			id: { not: unit.id },
			publishStatus: 'PUBLISHED',
			deletedAt: null,
			OR: [{ projectId: unit.projectId }, { typeName: unit.typeName }]
		},
		include: unitInclude,
		take: 4,
		orderBy: { publishedAt: 'desc' }
	});
	return ok(rows.map((row) => publicUnit(row, false)));
}

export async function listProjects(query: Query) {
	const { page, perPage, skip, take } = parsePagination(query, {
		defaultPerPage: 9,
		maxPerPage: 50
	});
	const where = {
		isPublished: true,
		deletedAt: null,
		...(query.status ? { status: query.status as 'PLANNED' } : {}),
		...(query.city ? { city: query.city } : {})
	};
	const [rows, total] = await Promise.all([
		prisma.project.findMany({
			where,
			orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
			skip,
			take
		}),
		prisma.project.count({ where })
	]);
	return list(
		rows.map((row) => ({
			id: row.id,
			slug: row.slug,
			title: row.title,
			summary: row.summary,
			location: row.location,
			city: row.city,
			province: row.province,
			status: row.status,
			yearStarted: row.yearStarted,
			yearCompleted: row.yearCompleted,
			unitCount: row.unitCount,
			coverImageUrl: row.coverImageUrl
		})),
		{ page, perPage, total, totalPages: Math.max(1, Math.ceil(total / perPage)) }
	);
}

export async function getProjectBySlug(slug: string) {
	const project = await prisma.project.findFirst({
		where: { slug, isPublished: true, deletedAt: null }
	});
	if (!project) throw notFound('Proyek tidak ditemukan.');
	return ok({
		id: project.id,
		slug: project.slug,
		title: project.title,
		summary: project.summary,
		description: project.description,
		location: project.location,
		city: project.city,
		province: project.province,
		status: project.status,
		yearStarted: project.yearStarted,
		yearCompleted: project.yearCompleted,
		landAreaM2: project.landAreaM2,
		unitCount: project.unitCount,
		coverImageUrl: project.coverImageUrl,
		galleryUrls: project.galleryUrls,
		seo: { title: project.seoTitle, description: project.seoDescription }
	});
}

export async function listArticles(query: Query) {
	const { page, perPage, skip, take } = parsePagination(query, {
		defaultPerPage: 12,
		maxPerPage: 50
	});
	const where = {
		status: 'PUBLISHED' as const,
		deletedAt: null,
		...(query.tag ? { tags: { has: query.tag } } : {})
	};
	const [rows, total] = await Promise.all([
		prisma.article.findMany({
			where,
			orderBy: { publishedAt: 'desc' },
			skip,
			take,
			include: { author: { select: { name: true } } }
		}),
		prisma.article.count({ where })
	]);
	return list(
		rows.map((row) => ({
			id: row.id,
			slug: row.slug,
			title: row.title,
			excerpt: row.excerpt,
			coverImageUrl: row.coverImageUrl,
			publishedAt: row.publishedAt,
			readingMinutes: row.readingMinutes,
			tags: row.tags,
			authorName: row.author?.name ?? null
		})),
		{ page, perPage, total, totalPages: Math.max(1, Math.ceil(total / perPage)) }
	);
}

export async function getArticleBySlug(slug: string) {
	const article = await prisma.article.findFirst({
		where: { slug, status: 'PUBLISHED', deletedAt: null },
		include: { author: { select: { name: true } } }
	});
	if (!article) throw notFound('Artikel tidak ditemukan.');
	return ok({
		id: article.id,
		slug: article.slug,
		title: article.title,
		excerpt: article.excerpt,
		content: article.content,
		coverImageUrl: article.coverImageUrl,
		publishedAt: article.publishedAt,
		readingMinutes: article.readingMinutes,
		tags: article.tags,
		authorName: article.author?.name ?? null,
		seo: { title: article.seoTitle, description: article.seoDescription }
	});
}

export async function listFaqs() {
	const rows = await prisma.faq.findMany({
		where: { isActive: true },
		orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }]
	});
	return ok(rows);
}

export async function listTestimonials() {
	const rows = await prisma.testimonial.findMany({
		where: { isPublished: true },
		orderBy: { sortOrder: 'asc' }
	});
	return ok(rows);
}

export async function getSiteConfig() {
	const rows = await prisma.siteSetting.findMany();
	return ok(Object.fromEntries(rows.map((row) => [row.key, row.value])));
}

export async function getRegions() {
	return ok({ provinces: [], regencies: [] });
}

interface LeadContext {
	userId: string | null;
	ipHash: string | null;
	userAgent: string | null;
}

export async function createPublicLead(payload: Record<string, unknown>, context: LeadContext) {
	const type = pickEnum(String(payload.type ?? ''), ['BUY_UNIT', 'LAND_OFFER', 'GENERAL']);
	if (!type) throw badRequest('Tipe lead tidak valid.');

	const name = typeof payload.name === 'string' ? payload.name.trim() : '';
	const phone = typeof payload.phone === 'string' ? payload.phone.trim() : '';
	if (!name || !phone) throw badRequest('Nama dan nomor telepon wajib diisi.');
	if (payload.consent !== true) throw badRequest('Persetujuan pemrosesan data wajib diberikan.');

	const spam = typeof payload.honeypot === 'string' && payload.honeypot.trim().length > 0;
	const captchaOk = spam ? true : await verifyTurnstile(String(payload.turnstileToken ?? ''));
	if (!captchaOk) throw badRequest('Verifikasi captcha gagal.');

	const idempotencyKey =
		typeof payload.idempotencyKey === 'string' && payload.idempotencyKey
			? payload.idempotencyKey
			: null;
	if (idempotencyKey) {
		const existing = await prisma.lead.findUnique({ where: { idempotencyKey } });
		if (existing) {
			return ok({
				reference: existing.reference,
				type: existing.type,
				createdAt: existing.createdAt
			});
		}
	}

	const phoneNormalized = normalizePhone(phone);
	const recent = await prisma.lead.findFirst({
		where: {
			phoneNormalized,
			type,
			createdAt: { gte: new Date(Date.now() - 60_000) }
		}
	});
	if (recent) {
		return ok({
			reference: recent.reference,
			type: recent.type,
			createdAt: recent.createdAt,
			duplicate: true
		});
	}

	const lead = await prisma.lead.create({
		data: {
			reference: referenceFor(type),
			type,
			status: spam ? 'SPAM' : 'NEW',
			name,
			phone,
			phoneNormalized,
			email: typeof payload.email === 'string' && payload.email ? payload.email : null,
			city: typeof payload.city === 'string' && payload.city ? payload.city : null,
			message: typeof payload.message === 'string' && payload.message ? payload.message : null,
			unitId: Number.isInteger(payload.unitId) ? Number(payload.unitId) : null,
			userId: context.userId,
			source: 'WEBSITE',
			idempotencyKey,
			landingPath: typeof payload.landingPath === 'string' ? payload.landingPath : null,
			referrerUrl: typeof payload.referrerUrl === 'string' ? payload.referrerUrl : null,
			ipHash: context.ipHash,
			userAgent: context.userAgent
		}
	});

	const land = payload.land as Record<string, unknown> | undefined;
	if (type === 'LAND_OFFER' && land) {
		await prisma.landSubmission.create({
			data: {
				leadId: lead.id,
				address: String(land.address ?? ''),
				province: String(land.province ?? ''),
				city: String(land.city ?? payload.city ?? ''),
				district: land.district ? String(land.district) : null,
				areaM2: Number(land.areaM2 ?? 0),
				frontageM: land.frontageM ? Number(land.frontageM) : null,
				ownershipStatus: (land.ownershipStatus as 'SHM') ?? 'SHM',
				certificateOnBehalf: land.certificateOnBehalf ? String(land.certificateOnBehalf) : null,
				zoning: land.zoning ? String(land.zoning) : null,
				currentUse: land.currentUse ? String(land.currentUse) : null,
				roadAccess: land.roadAccess ? String(land.roadAccess) : null,
				estimatedValue: land.estimatedValue ? BigInt(String(land.estimatedValue)) : null,
				expectedScheme: (land.expectedScheme as 'BAGI_HASIL') ?? 'BELUM_TAHU',
				startTimeline: (land.startTimeline as 'M3_6') ?? null,
				notes: land.notes ? String(land.notes) : null
			}
		});
		const keys = toStringArray(land.attachmentKeys as string[]);
		if (keys.length > 0) {
			const uploaded = await prisma.media.findMany({ where: { key: { in: keys } } });
			for (const media of uploaded) {
				await prisma.leadAttachment.create({
					data: {
						leadId: lead.id,
						kind: 'LAND_PHOTO',
						fileName: media.original_name ?? media.key.split('/').pop() ?? media.key,
						storageKey: media.key,
						mimeType: media.mime,
						sizeBytes: media.size,
						uploadedById: context.userId
					}
				});
			}
		}
	}

	return ok({
		reference: lead.reference,
		type: lead.type,
		createdAt: lead.createdAt,
		nextStep: {
			message: 'Tim kami akan menghubungi Anda dalam 1 hari kerja.',
			whatsappUrl: 'https://wa.me/6281234567890?text=Halo%20Azetta'
		}
	});
}

/** Plafon kontrak unggah publik; batas efektif tetap mengikuti env bila lebih kecil. */
const PUBLIC_MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/** Unggah foto lahan dari pengunjung; hanya gambar, folder `leads`. */
export async function uploadPublicFile(file: File, userId: string | null) {
	const maxBytes = Math.min(
		env.OBJECT_STORAGE_MAX_UPLOAD_BYTES ?? PUBLIC_MAX_UPLOAD_BYTES,
		PUBLIC_MAX_UPLOAD_BYTES
	);

	return ok(await storage.uploadFile({ file, folder: 'leads', uploadedBy: userId, maxBytes }));
}

export async function recordEvents(payload: Record<string, unknown>) {
	const events = Array.isArray(payload.events) ? payload.events : [];
	let stored = 0;
	for (const event of events) {
		const item = event as Record<string, unknown>;
		if (!item.name || !item.path) continue;
		await prisma.funnelEvent.create({
			data: {
				name: String(item.name),
				path: String(item.path),
				unitId: Number.isInteger(item.unitId) ? Number(item.unitId) : null,
				leadId: typeof item.leadId === 'string' ? item.leadId : null,
				sessionId: typeof item.sessionId === 'string' ? item.sessionId : null,
				props: (item.props ?? undefined) as never
			}
		});
		stored += 1;
	}
	return ok({ stored });
}
