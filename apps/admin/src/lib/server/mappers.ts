import type {
	ArticleItem,
	AuditLogItem,
	Customer,
	DeletionRequest,
	FaqItem,
	Lead,
	ProjectItem,
	StaffUser,
	TestimonialItem,
	UnitItem
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

interface ApiUnit extends Omit<
	UnitItem,
	'priceFrom' | 'estimatedBuildCostMin' | 'estimatedBuildCostMax' | 'projectTitle'
> {
	priceFrom: string | number | null;
	estimatedBuildCostMin: string | number | null;
	estimatedBuildCostMax: string | number | null;
	projectTitle?: string | null;
}

export function mapUnit(unit: ApiUnit): UnitItem {
	return {
		...unit,
		projectTitle: unit.projectTitle ?? '',
		priceFrom: toNumber(unit.priceFrom),
		estimatedBuildCostMin: toNumber(unit.estimatedBuildCostMin),
		estimatedBuildCostMax: toNumber(unit.estimatedBuildCostMax)
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
