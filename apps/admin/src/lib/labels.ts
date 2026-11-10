import type {
	ActivityType,
	ArticleStatus,
	AttachmentKind,
	DeletionRequest,
	ExpectedScheme,
	LeadPriority,
	LeadSource,
	LeadStatus,
	LeadType,
	OwnershipStatus,
	ProjectStatus,
	Role,
	StartTimeline,
	UnitPublishStatus,
	UnitSalesStatus
} from './mock/admin.js';

export const leadTypeLabel: Record<LeadType, string> = {
	BUY_UNIT: 'Beli unit',
	LAND_OFFER: 'Tawar lahan',
	GENERAL: 'Umum'
};

export const leadTypeShort: Record<LeadType, string> = {
	BUY_UNIT: 'BU',
	LAND_OFFER: 'LD',
	GENERAL: 'UM'
};

export const leadStatusLabel: Record<LeadStatus, string> = {
	NEW: 'Baru',
	CONTACTED: 'Dihubungi',
	QUALIFIED: 'Kualifikasi',
	PROPOSAL: 'Proposal',
	NEGOTIATION: 'Negosiasi',
	WON: 'Menang',
	LOST: 'Kalah',
	SPAM: 'Spam'
};

export const leadStatusTone: Record<LeadStatus, string> = {
	NEW: 'badge-info',
	CONTACTED: 'badge-ghost',
	QUALIFIED: 'badge-warning',
	PROPOSAL: 'badge-warning',
	NEGOTIATION: 'badge-warning',
	WON: 'badge-success',
	LOST: 'badge-error',
	SPAM: 'badge-error'
};

export const leadPriorityLabel: Record<LeadPriority, string> = {
	LOW: 'Rendah',
	NORMAL: 'Normal',
	HIGH: 'Tinggi',
	URGENT: 'Mendesak'
};

export const leadPriorityTone: Record<LeadPriority, string> = {
	LOW: 'badge-ghost',
	NORMAL: 'badge-outline',
	HIGH: 'badge-warning',
	URGENT: 'badge-error'
};

export const leadSourceLabel: Record<LeadSource, string> = {
	WEBSITE: 'Situs',
	ORGANIC_SEARCH: 'Pencarian organik',
	SOCIAL: 'Media sosial',
	ADS: 'Iklan',
	REFERRAL: 'Rujukan',
	WHATSAPP: 'WhatsApp',
	EVENT: 'Acara',
	OTHER: 'Lainnya'
};

export const activityTypeLabel: Record<ActivityType, string> = {
	NOTE: 'Catatan',
	STATUS_CHANGE: 'Perubahan status',
	ASSIGNMENT: 'Penugasan',
	CALL: 'Telepon',
	WHATSAPP: 'WhatsApp',
	EMAIL: 'Email',
	MEETING: 'Pertemuan',
	SYSTEM: 'Sistem'
};

export const activityTypeIcon: Record<ActivityType, string> = {
	NOTE: 'icon-[mdi--note-text-outline]',
	STATUS_CHANGE: 'icon-[mdi--swap-horizontal]',
	ASSIGNMENT: 'icon-[mdi--account-arrow-right-outline]',
	CALL: 'icon-[mdi--phone-outline]',
	WHATSAPP: 'icon-[mdi--whatsapp]',
	EMAIL: 'icon-[mdi--email-outline]',
	MEETING: 'icon-[mdi--account-group-outline]',
	SYSTEM: 'icon-[mdi--cog-outline]'
};

export const ownershipStatusLabel: Record<OwnershipStatus, string> = {
	SHM: 'SHM',
	SHGB: 'SHGB',
	AJB: 'AJB',
	GIRIK: 'Girik',
	LETTER_C: 'Letter C',
	OTHER: 'Lainnya'
};

export const expectedSchemeLabel: Record<ExpectedScheme, string> = {
	BAGI_HASIL: 'Bagi hasil',
	SEWA: 'Sewa',
	JUAL: 'Jual putus',
	BELUM_TAHU: 'Belum tahu'
};

export const startTimelineLabel: Record<StartTimeline, string> = {
	IMMEDIATE: 'Segera',
	M3_6: '3–6 bulan',
	M6_12: '6–12 bulan',
	OVER_12: 'Lebih dari 12 bulan',
	UNKNOWN: 'Belum pasti'
};

export const attachmentKindLabel: Record<AttachmentKind, string> = {
	LAND_PHOTO: 'Foto lahan',
	DOCUMENT: 'Dokumen',
	OTHER: 'Lainnya'
};

export const unitPublishStatusLabel: Record<UnitPublishStatus, string> = {
	DRAFT: 'Draf',
	PUBLISHED: 'Terbit',
	ARCHIVED: 'Diarsipkan'
};

export const unitPublishStatusTone: Record<UnitPublishStatus, string> = {
	DRAFT: 'badge-ghost',
	PUBLISHED: 'badge-success',
	ARCHIVED: 'badge-outline'
};

export const unitSalesStatusLabel: Record<UnitSalesStatus, string> = {
	AVAILABLE: 'Tersedia',
	INDENT: 'Indent',
	SOLD: 'Terjual'
};

export const unitSalesStatusTone: Record<UnitSalesStatus, string> = {
	AVAILABLE: 'badge-success',
	INDENT: 'badge-warning',
	SOLD: 'badge-error'
};

export const projectStatusLabel: Record<ProjectStatus, string> = {
	PLANNED: 'Direncanakan',
	ONGOING: 'Berjalan',
	COMPLETED: 'Selesai'
};

export const projectStatusTone: Record<ProjectStatus, string> = {
	PLANNED: 'badge-ghost',
	ONGOING: 'badge-info',
	COMPLETED: 'badge-success'
};

export const articleStatusLabel: Record<ArticleStatus, string> = {
	DRAFT: 'Draf',
	PUBLISHED: 'Terbit',
	ARCHIVED: 'Diarsipkan'
};

export const articleStatusTone: Record<ArticleStatus, string> = {
	DRAFT: 'badge-ghost',
	PUBLISHED: 'badge-success',
	ARCHIVED: 'badge-outline'
};

export const deletionStatusLabel: Record<DeletionRequest['status'], string> = {
	PENDING: 'Menunggu',
	COMPLETED: 'Selesai',
	REJECTED: 'Ditolak'
};

export const deletionStatusTone: Record<DeletionRequest['status'], string> = {
	PENDING: 'badge-warning',
	COMPLETED: 'badge-success',
	REJECTED: 'badge-error'
};

export const roleLabel: Record<Role, string> = {
	admin: 'Admin',
	super_admin: 'Super admin',
	customer: 'Pelanggan'
};
