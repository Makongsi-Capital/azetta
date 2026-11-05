import { prisma } from '../../../lib/prisma';
import { badRequest, list, notFound, ok, parsePagination } from '../../../lib/http';
import type { StaffActor } from '../../../lib/guard';
import { recordAudit } from '../../../lib/audit';

type Query = Record<string, string | undefined>;

export async function listTestimonials(query: Query) {
	const { page, perPage, skip, take } = parsePagination(query, {
		defaultPerPage: 100,
		maxPerPage: 100
	});
	const [rows, total] = await Promise.all([
		prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' }, skip, take }),
		prisma.testimonial.count()
	]);
	return list(rows, { page, perPage, total, totalPages: Math.max(1, Math.ceil(total / perPage)) });
}

export async function createTestimonial(
	actor: StaffActor,
	payload: Record<string, unknown>,
	ipHash: string | null
) {
	const name = typeof payload.name === 'string' ? payload.name.trim() : '';
	const quote = typeof payload.quote === 'string' ? payload.quote.trim() : '';
	if (!name || !quote) throw badRequest('Nama dan kutipan wajib diisi.');

	const testimonial = await prisma.testimonial.create({
		data: {
			name,
			quote,
			role: typeof payload.role === 'string' && payload.role ? payload.role : null,
			projectName:
				typeof payload.projectName === 'string' && payload.projectName ? payload.projectName : null,
			avatarUrl:
				typeof payload.avatarUrl === 'string' && payload.avatarUrl ? payload.avatarUrl : null,
			isPublished: payload.isPublished === true,
			sortOrder: Number(payload.sortOrder ?? 0) || 0
		}
	});
	await recordAudit({
		action: 'testimonial.create',
		entityType: 'Testimonial',
		entityId: testimonial.id,
		actorId: actor.id,
		ipHash,
		after: { name }
	});
	return ok(testimonial);
}

export async function updateTestimonial(
	actor: StaffActor,
	id: string,
	payload: Record<string, unknown>,
	ipHash: string | null
) {
	const existing = await prisma.testimonial.findUnique({ where: { id: Number(id) } });
	if (!existing) throw notFound('Testimoni tidak ditemukan.');

	const testimonial = await prisma.testimonial.update({
		where: { id: existing.id },
		data: {
			...(typeof payload.name === 'string' ? { name: payload.name } : {}),
			...(typeof payload.quote === 'string' ? { quote: payload.quote } : {}),
			...('role' in payload ? { role: payload.role ? String(payload.role) : null } : {}),
			...('projectName' in payload
				? { projectName: payload.projectName ? String(payload.projectName) : null }
				: {}),
			...('avatarUrl' in payload
				? { avatarUrl: payload.avatarUrl ? String(payload.avatarUrl) : null }
				: {}),
			...(typeof payload.isPublished === 'boolean' ? { isPublished: payload.isPublished } : {}),
			...(payload.sortOrder !== undefined ? { sortOrder: Number(payload.sortOrder) || 0 } : {})
		}
	});
	await recordAudit({
		action: 'testimonial.update',
		entityType: 'Testimonial',
		entityId: testimonial.id,
		actorId: actor.id,
		ipHash,
		before: { isPublished: existing.isPublished },
		after: { isPublished: testimonial.isPublished }
	});
	return ok(testimonial);
}

export async function deleteTestimonial(actor: StaffActor, id: string, ipHash: string | null) {
	const existing = await prisma.testimonial.findUnique({ where: { id: Number(id) } });
	if (!existing) throw notFound('Testimoni tidak ditemukan.');
	await prisma.testimonial.delete({ where: { id: existing.id } });
	await recordAudit({
		action: 'testimonial.delete',
		entityType: 'Testimonial',
		entityId: existing.id,
		actorId: actor.id,
		ipHash,
		before: { name: existing.name }
	});
	return ok({ id: existing.id, deleted: true });
}
