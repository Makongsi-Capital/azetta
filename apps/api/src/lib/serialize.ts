import { buildPublicUrl } from './object-storage';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/** Ubah BigInt ke string desimal dan Date ke ISO 8601 (docs §2.3–2.4). */
export function jsonSafe(value: unknown): JsonValue {
	if (value === null || value === undefined) return null;
	if (typeof value === 'bigint') return value.toString();
	if (value instanceof Date) return value.toISOString();
	if (Array.isArray(value)) return value.map(jsonSafe);
	if (typeof value === 'object') {
		const result: { [key: string]: JsonValue } = {};
		for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
			if (item === undefined) continue;
			result[key] = jsonSafe(item);
		}
		return result;
	}
	if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string') {
		return value;
	}
	return null;
}

interface ActivityRow {
	id: number;
	type: string;
	body: string | null;
	createdAt: Date;
	actor?: { name: string } | null;
}

interface AttachmentRow {
	id: number;
	kind: string;
	fileName: string;
	mimeType: string;
	sizeBytes: number;
	url?: string;
	storageKey: string;
}

interface LandRow {
	address: string;
	province: string;
	city: string;
	district: string | null;
	areaM2: number;
	frontageM: number | null;
	ownershipStatus: string;
	expectedScheme: string;
	startTimeline: string | null;
	notes: string | null;
}

interface LeadRow {
	id: string;
	reference: string;
	type: string;
	status: string;
	priority: string;
	name: string;
	phone: string;
	email: string | null;
	city: string | null;
	message: string | null;
	unitId: number | null;
	source: string;
	assignedToId: string | null;
	estimatedValue: bigint | null;
	lostReason: string | null;
	firstContactedAt: Date | null;
	lastContactedAt: Date | null;
	nextFollowUpAt: Date | null;
	customerNote: string | null;
	createdAt: Date;
	updatedAt: Date;
	unit?: { id: number; title: string } | null;
	assignedTo?: { id: string; name: string } | null;
	landSubmission?: LandRow | null;
	attachments?: AttachmentRow[];
	activities?: ActivityRow[];
}

export function serializeLead(lead: LeadRow) {
	return {
		id: lead.id,
		reference: lead.reference,
		type: lead.type,
		status: lead.status,
		priority: lead.priority,
		name: lead.name,
		phone: lead.phone,
		email: lead.email,
		city: lead.city,
		message: lead.message,
		unitId: lead.unitId,
		unitTitle: lead.unit?.title ?? null,
		source: lead.source,
		assignedToId: lead.assignedToId,
		assignedToName: lead.assignedTo?.name ?? null,
		estimatedValue: lead.estimatedValue === null ? null : lead.estimatedValue.toString(),
		lostReason: lead.lostReason,
		firstContactedAt: lead.firstContactedAt,
		lastContactedAt: lead.lastContactedAt,
		nextFollowUpAt: lead.nextFollowUpAt,
		customerNote: lead.customerNote,
		createdAt: lead.createdAt,
		updatedAt: lead.updatedAt,
		landSubmission: lead.landSubmission ?? null,
		attachments: (lead.attachments ?? []).map((attachment) => ({
			id: attachment.id,
			kind: attachment.kind,
			fileName: attachment.fileName,
			mimeType: attachment.mimeType,
			sizeBytes: attachment.sizeBytes,
			url: buildPublicUrl(attachment.storageKey)
		})),
		activities: (lead.activities ?? []).map((activity) => ({
			id: activity.id,
			type: activity.type,
			body: activity.body ?? '',
			actorName: activity.actor?.name ?? 'Sistem',
			createdAt: activity.createdAt
		}))
	};
}

interface MediaRow {
	id: number;
	kind: string;
	url: string;
	alt: string | null;
	width: number | null;
	height: number | null;
	isCover: boolean;
}

interface UnitRow {
	id: number;
	slug: string;
	unitCode: string;
	typeName: string;
	title: string;
	subtitle: string | null;
	description: string;
	projectId: number;
	floors: number;
	bedrooms: number;
	bathrooms: number;
	carports: number;
	buildingAreaM2: number;
	landAreaM2: number;
	priceFrom: bigint | null;
	publishStatus: string;
	salesStatus: string;
	featured: boolean;
	viewCount: number;
	publishedAt: Date | null;
	seoTitle: string | null;
	seoDescription: string | null;
	createdAt: Date;
	updatedAt: Date;
	media: (MediaRow & { storageKey: string; sortOrder: number })[];
}

/**
 * Serialisasi unit untuk API. `estimatedBuildCostMin/Max` sengaja tidak pernah
 * dikirim karena hanya untuk internal (docs v1.7, Q8).
 */
export function serializeUnit(unit: UnitRow) {
	const cover = unit.media.find((media) => media.isCover) ?? unit.media[0];
	return {
		id: unit.id,
		slug: unit.slug,
		unitCode: unit.unitCode,
		typeName: unit.typeName,
		title: unit.title,
		subtitle: unit.subtitle,
		description: unit.description,
		projectId: unit.projectId,
		floors: unit.floors,
		bedrooms: unit.bedrooms,
		bathrooms: unit.bathrooms,
		carports: unit.carports,
		buildingAreaM2: unit.buildingAreaM2,
		landAreaM2: unit.landAreaM2,
		priceFrom: unit.priceFrom?.toString() ?? null,
		publishStatus: unit.publishStatus,
		salesStatus: unit.salesStatus,
		featured: unit.featured,
		viewCount: unit.viewCount,
		publishedAt: unit.publishedAt,
		seoTitle: unit.seoTitle,
		seoDescription: unit.seoDescription,
		createdAt: unit.createdAt,
		updatedAt: unit.updatedAt,
		cover: cover?.url ?? null,
		gallery: unit.media.map((media) => media.url),
		media: unit.media.map((media) => ({
			id: media.id,
			kind: media.kind,
			url: media.url,
			alt: media.alt,
			width: media.width,
			height: media.height,
			isCover: media.isCover,
			sortOrder: media.sortOrder
		}))
	};
}

interface ProjectRow {
	id: number;
	slug: string;
	title: string;
	summary: string | null;
	description: string | null;
	location: string;
	city: string;
	province: string;
	status: string;
	yearStarted: number | null;
	yearCompleted: number | null;
	landAreaM2: number | null;
	unitCount: number | null;
	coverImageUrl: string | null;
	galleryUrls: string[];
	isPublished: boolean;
	sortOrder: number;
	seoTitle: string | null;
	seoDescription: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export function serializeProject(project: ProjectRow) {
	const safe = jsonSafe(project);
	return typeof safe === 'object' && safe !== null && !Array.isArray(safe) ? safe : {};
}

interface ArticleRow {
	id: number;
	slug: string;
	title: string;
	excerpt: string | null;
	content: string;
	coverImageUrl: string | null;
	status: string;
	publishedAt: Date | null;
	readingMinutes: number | null;
	tags: string[];
	viewCount: number;
	seoTitle: string | null;
	seoDescription: string | null;
	authorId: string | null;
	author?: { id: string; name: string } | null;
	createdAt: Date;
	updatedAt: Date;
}

export function serializeArticle(article: ArticleRow) {
	return {
		id: article.id,
		slug: article.slug,
		title: article.title,
		excerpt: article.excerpt,
		content: article.content,
		coverImageUrl: article.coverImageUrl,
		status: article.status,
		publishedAt: article.publishedAt,
		readingMinutes: article.readingMinutes,
		tags: article.tags,
		viewCount: article.viewCount,
		seoTitle: article.seoTitle,
		seoDescription: article.seoDescription,
		authorId: article.authorId,
		authorName: article.author?.name ?? null,
		createdAt: article.createdAt,
		updatedAt: article.updatedAt
	};
}

interface UserRow {
	id: string;
	name: string;
	email: string;
	role: string;
	banned: boolean;
	lastLoginAt: Date | null;
	createdAt: Date;
	phone?: string | null;
	city?: string | null;
	emailVerified?: boolean;
}

export function serializeStaff(user: UserRow) {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
		banned: user.banned,
		lastLoginAt: user.lastLoginAt,
		createdAt: user.createdAt
	};
}

export function serializeCustomer(user: UserRow & { leadCount?: number }) {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		phone: user.phone ?? null,
		city: user.city ?? null,
		emailVerified: user.emailVerified ?? false,
		banned: user.banned,
		leadCount: user.leadCount ?? 0,
		createdAt: user.createdAt,
		lastLoginAt: user.lastLoginAt
	};
}

interface DeletionRow {
	id: string;
	userId: string;
	reason: string | null;
	status: string;
	requestedAt: Date;
	handledAt: Date | null;
	note: string | null;
	user: { name: string; email: string };
	handledBy?: { name: string } | null;
}

export function serializeDeletionRequest(request: DeletionRow) {
	return {
		id: request.id,
		userId: request.userId,
		name: request.user.name,
		email: request.user.email,
		reason: request.reason,
		status: request.status,
		requestedAt: request.requestedAt,
		handledAt: request.handledAt,
		handledByName: request.handledBy?.name ?? null,
		note: request.note
	};
}

interface AuditRow {
	id: number;
	action: string;
	entityType: string;
	entityId: string;
	before: unknown;
	after: unknown;
	ipHash: string | null;
	actor?: { name: string } | null;
	createdAt: Date;
}

export function serializeAuditLog(log: AuditRow) {
	return {
		id: log.id,
		action: log.action,
		entityType: log.entityType,
		entityId: log.entityId,
		actorName: log.actor?.name ?? null,
		ipHash: log.ipHash,
		before: log.before ?? null,
		after: log.after ?? null,
		createdAt: log.createdAt
	};
}
