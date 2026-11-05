import type {
	ArticleItem,
	AuditLogItem,
	Customer,
	DeletionRequest,
	DesignUnit,
	FaqItem,
	Lead,
	ProjectItem,
	StaffUser,
	TestimonialItem
} from '#lib/mock/admin.js';

function toNumber(value: string | number | null | undefined): number | null {
	if (value === null || value === undefined || value === '') return null;
	return Number(value);
}

interface ApiLead extends Omit<Lead, 'estimatedValue'> {
	estimatedValue: string | number | null;
}

export function mapLead(lead: ApiLead): Lead {
	return { ...lead, estimatedValue: toNumber(lead.estimatedValue) };
}

interface ApiDesign extends Omit<
	DesignUnit,
	'priceFrom' | 'estimatedBuildCostMin' | 'estimatedBuildCostMax'
> {
	priceFrom: string | number | null;
	estimatedBuildCostMin: string | number | null;
	estimatedBuildCostMax: string | number | null;
}

export function mapDesign(design: ApiDesign): DesignUnit {
	return {
		...design,
		priceFrom: toNumber(design.priceFrom),
		estimatedBuildCostMin: toNumber(design.estimatedBuildCostMin),
		estimatedBuildCostMax: toNumber(design.estimatedBuildCostMax)
	};
}

export function mapProject(project: ProjectItem): ProjectItem {
	return project;
}

export function mapArticle(article: ArticleItem): ArticleItem {
	return article;
}

export function mapFaq(faq: FaqItem): FaqItem {
	return faq;
}

export function mapTestimonial(testimonial: TestimonialItem): TestimonialItem {
	return testimonial;
}

export function mapAudit(log: AuditLogItem): AuditLogItem {
	return log;
}

export function mapDeletion(request: DeletionRequest): DeletionRequest {
	return request;
}

export function mapStaff(user: StaffUser): StaffUser {
	return user;
}

export function mapCustomer(customer: Customer): Customer {
	return customer;
}
