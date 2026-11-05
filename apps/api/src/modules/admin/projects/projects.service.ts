import { ProjectStatus, type Prisma } from '@azetta/db';
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
import { serializeProject } from '../../../lib/serialize';
import { sanitizeHtml } from '../../../lib/sanitize';
import { recordAudit } from '../../../lib/audit';

const STATUSES = Object.values(ProjectStatus);

type Query = Record<string, string | undefined>;

function slugify(value: string): string {
	return value
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function parseYear(value: unknown): number | null {
	const parsed = Number(value);
	return Number.isInteger(parsed) && parsed > 1900 ? parsed : null;
}

function parseOptionalInt(value: unknown): number | null {
	if (value === null || value === undefined || value === '') return null;
	const parsed = Number(value);
	return Number.isInteger(parsed) ? parsed : null;
}

export async function listProjects(query: Query) {
	const { page, perPage, skip, take } = parsePagination(query, {
		defaultPerPage: 20,
		maxPerPage: 100
	});
	const term = normalizeSearch(query.q);
	const status = pickEnum(query.status, STATUSES);

	const where: Prisma.ProjectWhereInput = {
		deletedAt: null,
		...(status ? { status } : {}),
		...(query.city ? { city: query.city } : {}),
		...(query.published === 'true' ? { isPublished: true } : {}),
		...(term
			? {
					OR: [
						{ title: { contains: term, mode: 'insensitive' } },
						{ slug: { contains: term, mode: 'insensitive' } },
						{ city: { contains: term, mode: 'insensitive' } },
						{ location: { contains: term, mode: 'insensitive' } }
					]
				}
			: {})
	};

	const [rows, total] = await Promise.all([
		prisma.project.findMany({
			where,
			orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
			skip,
			take
		}),
		prisma.project.count({ where })
	]);

	return list(rows.map(serializeProject), {
		page,
		perPage,
		total,
		totalPages: Math.max(1, Math.ceil(total / perPage))
	});
}

export async function createProject(
	actor: StaffActor,
	payload: Record<string, unknown>,
	ipHash: string | null
) {
	const title = typeof payload.title === 'string' ? payload.title.trim() : '';
	if (!title) throw badRequest('Judul proyek wajib diisi.');

	const slug = slugify(String(payload.slug ?? title));
	if (await prisma.project.findUnique({ where: { slug } })) {
		throw conflict(`Slug "${slug}" sudah dipakai.`);
	}

	const project = await prisma.project.create({
		data: {
			slug,
			title,
			summary: typeof payload.summary === 'string' && payload.summary ? payload.summary : null,
			description:
				typeof payload.description === 'string' && payload.description
					? sanitizeHtml(payload.description)
					: null,
			location: String(payload.location ?? ''),
			city: String(payload.city ?? ''),
			province: String(payload.province ?? ''),
			status: pickEnum(String(payload.status ?? 'ONGOING'), STATUSES) ?? 'ONGOING',
			yearStarted: parseYear(payload.yearStarted),
			yearCompleted: parseYear(payload.yearCompleted),
			landAreaM2: parseOptionalInt(payload.landAreaM2),
			unitCount: parseOptionalInt(payload.unitCount),
			coverImageUrl:
				typeof payload.coverImageUrl === 'string' && payload.coverImageUrl
					? payload.coverImageUrl
					: null,
			galleryUrls: toStringArray(payload.galleryUrls as string[]).slice(0, 10),
			seoTitle: typeof payload.seoTitle === 'string' && payload.seoTitle ? payload.seoTitle : null,
			seoDescription:
				typeof payload.seoDescription === 'string' && payload.seoDescription
					? payload.seoDescription
					: null,
			createdById: actor.id
		}
	});

	await recordAudit({
		action: 'project.create',
		entityType: 'Project',
		entityId: project.id,
		actorId: actor.id,
		ipHash,
		after: { title, slug }
	});
	return ok(serializeProject(project));
}

export async function getProject(id: string) {
	const project = await prisma.project.findFirst({
		where: { id: Number(id), deletedAt: null }
	});
	if (!project) throw notFound('Proyek tidak ditemukan.');
	return ok(serializeProject(project));
}

export async function updateProject(
	actor: StaffActor,
	id: string,
	payload: Record<string, unknown>,
	ipHash: string | null
) {
	const existing = await prisma.project.findFirst({
		where: { id: Number(id), deletedAt: null }
	});
	if (!existing) throw notFound('Proyek tidak ditemukan.');

	const data: Prisma.ProjectUpdateInput = {};
	if (typeof payload.title === 'string' && payload.title.trim()) data.title = payload.title.trim();
	if (typeof payload.slug === 'string' && payload.slug.trim()) {
		const slug = slugify(payload.slug);
		if (slug !== existing.slug) {
			if (await prisma.project.findUnique({ where: { slug } })) {
				throw conflict(`Slug "${slug}" sudah dipakai.`);
			}
			data.slug = slug;
		}
	}
	if ('summary' in payload) data.summary = payload.summary ? String(payload.summary) : null;
	if (typeof payload.description === 'string') data.description = sanitizeHtml(payload.description);
	if (typeof payload.location === 'string') data.location = payload.location;
	if (typeof payload.city === 'string') data.city = payload.city;
	if (typeof payload.province === 'string') data.province = payload.province;
	const status = pickEnum(String(payload.status ?? ''), STATUSES);
	if (status) data.status = status;
	if ('yearStarted' in payload) data.yearStarted = parseYear(payload.yearStarted);
	if ('yearCompleted' in payload) data.yearCompleted = parseYear(payload.yearCompleted);
	if ('landAreaM2' in payload) data.landAreaM2 = parseOptionalInt(payload.landAreaM2);
	if ('unitCount' in payload) data.unitCount = parseOptionalInt(payload.unitCount);
	if ('coverImageUrl' in payload) {
		data.coverImageUrl = payload.coverImageUrl ? String(payload.coverImageUrl) : null;
	}
	if ('galleryUrls' in payload) {
		data.galleryUrls = toStringArray(payload.galleryUrls as string[]).slice(0, 10);
	}
	if ('seoTitle' in payload) data.seoTitle = payload.seoTitle ? String(payload.seoTitle) : null;
	if ('seoDescription' in payload) {
		data.seoDescription = payload.seoDescription ? String(payload.seoDescription) : null;
	}

	const updated = await prisma.project.update({ where: { id: existing.id }, data });
	await recordAudit({
		action: 'project.update',
		entityType: 'Project',
		entityId: existing.id,
		actorId: actor.id,
		ipHash,
		before: { title: existing.title, isPublished: existing.isPublished },
		after: { title: updated.title, isPublished: updated.isPublished }
	});
	return ok(serializeProject(updated));
}

export async function archiveProject(actor: StaffActor, id: string, ipHash: string | null) {
	const existing = await prisma.project.findFirst({
		where: { id: Number(id), deletedAt: null }
	});
	if (!existing) throw notFound('Proyek tidak ditemukan.');

	await prisma.project.update({
		where: { id: existing.id },
		data: { deletedAt: new Date(), isPublished: false }
	});
	await recordAudit({
		action: 'project.archive',
		entityType: 'Project',
		entityId: existing.id,
		actorId: actor.id,
		ipHash,
		before: { title: existing.title },
		after: { deletedAt: new Date().toISOString() }
	});
	return ok({ id: existing.id, archived: true });
}

export async function publishProject(actor: StaffActor, id: string, ipHash: string | null) {
	const existing = await prisma.project.findFirst({
		where: { id: Number(id), deletedAt: null }
	});
	if (!existing) throw notFound('Proyek tidak ditemukan.');
	if (!existing.coverImageUrl) throw badRequest('Gambar utama wajib diisi sebelum publish.');

	const updated = await prisma.project.update({
		where: { id: existing.id },
		data: { isPublished: true }
	});
	await recordAudit({
		action: 'project.publish',
		entityType: 'Project',
		entityId: existing.id,
		actorId: actor.id,
		ipHash,
		before: { isPublished: false },
		after: { isPublished: true }
	});
	return ok(serializeProject(updated));
}

export async function unpublishProject(actor: StaffActor, id: string, ipHash: string | null) {
	const existing = await prisma.project.findFirst({
		where: { id: Number(id), deletedAt: null }
	});
	if (!existing) throw notFound('Proyek tidak ditemukan.');

	const updated = await prisma.project.update({
		where: { id: existing.id },
		data: { isPublished: false }
	});
	await recordAudit({
		action: 'project.unpublish',
		entityType: 'Project',
		entityId: existing.id,
		actorId: actor.id,
		ipHash,
		before: { isPublished: true },
		after: { isPublished: false }
	});
	return ok(serializeProject(updated));
}

export async function presignProjectMedia() {
	return ok({ uploads: [] });
}
