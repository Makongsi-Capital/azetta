/** Bentuk payload yang dikirim API publik (`/api/v1/public/*`). */

export type SalesStatus = 'AVAILABLE' | 'INDENT' | 'SOLD';
export type ProjectStatus = 'PLANNED' | 'ONGOING' | 'COMPLETED';
export type LeadType = 'BUY_UNIT' | 'LAND_OFFER' | 'GENERAL';

export interface ApiProjectRef {
	slug: string;
	title: string;
	city: string;
	province: string;
	location: string;
}

export interface ApiImage {
	url: string;
	alt: string | null;
	width: number | null;
	height: number | null;
}

export interface ApiUnitMedia {
	id: number;
	kind: string;
	url: string;
	alt: string | null;
	width: number | null;
	height: number | null;
	isCover: boolean;
}

export interface ApiUnit {
	id: number;
	slug: string;
	unitCode: string;
	typeName: string;
	title: string;
	subtitle: string | null;
	project: ApiProjectRef | null;
	floors: number;
	bedrooms: number;
	bathrooms: number;
	carports: number;
	buildingAreaM2: number;
	landAreaM2: number;
	priceFrom: string | null;
	featured: boolean;
	salesStatus: SalesStatus;
	cover: ApiImage | null;
	description?: string;
	media?: ApiUnitMedia[];
	publishedAt?: string | null;
	updatedAt?: string;
	seo?: { title: string | null; description: string | null };
}

export interface ApiMediaItem {
	id: string;
	key: string;
	url: string;
	mime: string;
	size: number;
	folder: string;
	original_name: string | null;
	created_at: string;
}

export interface ApiUnitFilters {
	cities: string[];
	projects: { slug: string; title: string; city: string }[];
	types: string[];
	minPrice: string | null;
	maxPrice: string | null;
}

export interface ApiProject {
	id: number;
	slug: string;
	title: string;
	summary: string | null;
	description?: string | null;
	location: string;
	city: string;
	province: string;
	status: ProjectStatus;
	yearStarted: number | null;
	yearCompleted: number | null;
	landAreaM2?: number | null;
	unitCount: number | null;
	coverImageUrl: string | null;
	galleryUrls?: string[];
	seo?: { title: string | null; description: string | null };
}

export interface ApiArticle {
	id: number;
	slug: string;
	title: string;
	excerpt: string | null;
	content?: string;
	coverImageUrl: string | null;
	publishedAt: string | null;
	readingMinutes: number | null;
	tags: string[];
	authorName: string | null;
	seo?: { title: string | null; description: string | null };
}

export interface ApiFaq {
	id: number;
	question: string;
	answer: string;
	category: string;
	sortOrder: number;
	isActive: boolean;
}

export interface ApiTestimonial {
	id: number;
	name: string;
	role: string | null;
	projectName: string | null;
	quote: string;
	avatarUrl: string | null;
	sortOrder: number;
}

export interface ApiLead {
	id: string;
	reference: string;
	type: LeadType;
	status: string;
	statusLabel: string;
	message: string | null;
	unit: { slug: string; title: string } | null;
	createdAt: string;
	updatedAt: string;
}

export interface ApiLeadTimelineItem {
	type: string;
	body: string | null;
	createdAt: string;
}

export interface ApiLeadDetail extends ApiLead {
	landSubmission: Record<string, unknown> | null;
	attachments: { id: number; fileName: string; kind: string; url?: string }[];
	timeline: ApiLeadTimelineItem[];
}

export interface ApiProfile {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	phone: string | null;
	whatsapp: string | null;
	city: string | null;
	company: string | null;
}

export interface ApiLeadReceipt {
	reference: string;
	type: LeadType;
	createdAt: string;
	duplicate?: boolean;
	nextStep?: { message: string; whatsappUrl: string };
}
