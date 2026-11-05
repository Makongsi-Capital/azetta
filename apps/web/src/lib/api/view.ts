import type {
	ApiArticle,
	ApiFaq,
	ApiProject,
	ApiTestimonial,
	ApiUnit,
	SalesStatus
} from './types.js';

export type UnitStatus = 'TERSEDIA' | 'INDENT' | 'TERJUAL';
export type ProjectViewStatus = 'SEDANG BERJALAN' | 'SELESAI' | 'DIRENCANAKAN';

export interface UnitView {
	id: number;
	slug: string;
	title: string;
	type: string;
	style: string;
	category: string;
	project: string;
	projectSlug: string;
	floors: number;
	bedrooms: number;
	bathrooms: number;
	carports: number;
	landAreaM2: number;
	buildingAreaM2: number;
	priceFrom: number | null;
	district: string;
	city: string;
	status: UnitStatus;
	summary: string;
	descriptionHtml: string;
	cover: string | null;
	gallery: { url: string; alt: string }[];
	featured: boolean;
}

export interface ProjectView {
	slug: string;
	title: string;
	location: string;
	city: string;
	province: string;
	status: ProjectViewStatus;
	yearStarted: number | null;
	yearCompleted: number | null;
	unitCount: number | null;
	landAreaM2: number | null;
	summary: string;
	descriptionHtml: string;
	cover: string | null;
	gallery: string[];
}

export interface ArticleView {
	slug: string;
	title: string;
	excerpt: string;
	tag: string;
	tags: string[];
	readingMinutes: number | null;
	updated: string;
	publishedAt: string | null;
	authorName: string | null;
	cover: string | null;
	contentHtml: string;
}

export interface TestimonialView {
	name: string;
	role: string;
	quote: string;
}

export interface FaqView {
	question: string;
	answer: string;
	category: string;
}

export interface SiteConfigView {
	name: string;
	tagline: string;
	email: string;
	whatsapp: string;
}

const DEFAULT_SITE: SiteConfigView = {
	name: 'Azetta',
	tagline: 'Rumah tapak, kerja sama lahan, dan proyek properti.',
	email: 'azettaidofficial@gmail.com',
	whatsapp: ''
};

/** Site setting disimpan sebagai `{ [key]: value }`; `brand` berisi identitas situs. */
export function toSiteConfig(raw: Record<string, unknown> | null | undefined): SiteConfigView {
	const brand = (raw?.brand ?? {}) as Record<string, unknown>;
	const text = (value: unknown, fallback: string) =>
		typeof value === 'string' && value.trim() ? value : fallback;

	return {
		name: text(brand.name, DEFAULT_SITE.name),
		tagline: text(brand.tagline, DEFAULT_SITE.tagline),
		email: text(brand.email, DEFAULT_SITE.email),
		whatsapp: text(brand.whatsapp, DEFAULT_SITE.whatsapp)
	};
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
	day: 'numeric',
	month: 'long',
	year: 'numeric'
});

export function formatDate(value: string | null | undefined): string {
	if (!value) return '';
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? '' : dateFormatter.format(date);
}

const UNIT_STATUS: Record<SalesStatus, UnitStatus> = {
	AVAILABLE: 'TERSEDIA',
	INDENT: 'INDENT',
	SOLD: 'TERJUAL'
};

const PROJECT_STATUS: Record<ApiProject['status'], ProjectViewStatus> = {
	ONGOING: 'SEDANG BERJALAN',
	COMPLETED: 'SELESAI',
	PLANNED: 'DIRENCANAKAN'
};

const toPrice = (value: string | null): number | null => {
	if (!value) return null;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
};

export function toUnit(unit: ApiUnit): UnitView {
	const gallery = (unit.media ?? [])
		.filter((media) => media.url)
		.map((media) => ({ url: media.url, alt: media.alt ?? unit.title }));

	return {
		id: unit.id,
		slug: unit.slug,
		title: unit.title,
		type: unit.style,
		style: unit.style,
		category: unit.category,
		project: unit.project?.title ?? 'Azetta',
		projectSlug: unit.project?.slug ?? '',
		floors: unit.floors,
		bedrooms: unit.bedrooms,
		bathrooms: unit.bathrooms,
		carports: unit.carports,
		landAreaM2: unit.landAreaM2,
		buildingAreaM2: unit.buildingAreaM2,
		priceFrom: toPrice(unit.priceFrom),
		district: unit.project?.location ?? '',
		city: unit.project?.city ?? '',
		status: UNIT_STATUS[unit.salesStatus] ?? 'TERSEDIA',
		summary: unit.subtitle ?? '',
		descriptionHtml: unit.description ?? '',
		cover: unit.cover?.url ?? unit.media?.find((media) => media.isCover)?.url ?? null,
		gallery:
			gallery.length > 0 ? gallery : unit.cover ? [{ url: unit.cover.url, alt: unit.title }] : [],
		featured: unit.featured
	};
}

export function toProject(project: ApiProject): ProjectView {
	return {
		slug: project.slug,
		title: project.title,
		location: project.location,
		city: project.city,
		province: project.province,
		status: PROJECT_STATUS[project.status] ?? 'SEDANG BERJALAN',
		yearStarted: project.yearStarted,
		yearCompleted: project.yearCompleted,
		unitCount: project.unitCount,
		landAreaM2: project.landAreaM2 ?? null,
		summary: project.summary ?? '',
		descriptionHtml: project.description ?? '',
		cover: project.coverImageUrl,
		gallery: project.galleryUrls ?? []
	};
}

export function toArticle(article: ApiArticle): ArticleView {
	return {
		slug: article.slug,
		title: article.title,
		excerpt: article.excerpt ?? '',
		tag: article.tags[0] ?? 'Artikel',
		tags: article.tags,
		readingMinutes: article.readingMinutes,
		updated: formatDate(article.publishedAt),
		publishedAt: article.publishedAt,
		authorName: article.authorName,
		cover: article.coverImageUrl,
		contentHtml: article.content ?? ''
	};
}

export function toTestimonial(item: ApiTestimonial): TestimonialView {
	return {
		name: item.name,
		role: item.role ?? item.projectName ?? '',
		quote: item.quote
	};
}

export function toFaq(item: ApiFaq): FaqView {
	return {
		question: item.question,
		answer: item.answer,
		category: item.category
	};
}
