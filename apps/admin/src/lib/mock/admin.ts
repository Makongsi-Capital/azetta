/**
 * Data contoh panel admin. Bentuk field mengikuti model Prisma di
 * `packages/db/prisma/schema.prisma` agar mudah diganti panggilan API.
 *
 * Semua tanggal dipatok relatif ke MOCK_NOW supaya angka dan label waktu
 * konsisten antara dashboard, daftar, dan detail.
 */

import { formatDateInput } from '../format.js';

export const MOCK_NOW = new Date('2026-11-04T09:30:00+07:00');

/** Waktu WIB pada `dayOffset` hari sebelum MOCK_NOW. */
function at(dayOffset: number, hour: number, minute = 0): string {
	return new Date(Date.UTC(2026, 10, 4 - dayOffset, hour - 7, minute)).toISOString();
}

const photo = (id: string, width = 1000) =>
	`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=70`;

export type Role = 'admin' | 'super_admin' | 'customer';

export interface StaffUser {
	id: string;
	name: string;
	email: string;
	role: Role;
	banned: boolean;
	lastLoginAt: string | null;
	createdAt: string;
}

export interface Customer {
	id: string;
	name: string;
	email: string;
	phone: string | null;
	city: string | null;
	emailVerified: boolean;
	banned: boolean;
	leadCount: number;
	createdAt: string;
	lastLoginAt: string | null;
}

export const currentUser: StaffUser = {
	id: 'u-1',
	name: 'Rina Pratama',
	email: 'rina@azetta.id',
	role: 'super_admin',
	banned: false,
	lastLoginAt: at(0, 7, 40),
	createdAt: at(420, 9, 0)
};

export const staffUsers: StaffUser[] = [
	currentUser,
	{
		id: 'u-2',
		name: 'Dimas Anggara',
		email: 'dimas@azetta.id',
		role: 'admin',
		banned: false,
		lastLoginAt: at(0, 7, 12),
		createdAt: at(310, 10, 0)
	},
	{
		id: 'u-3',
		name: 'Sinta Maharani',
		email: 'sinta@azetta.id',
		role: 'admin',
		banned: false,
		lastLoginAt: at(1, 16, 45),
		createdAt: at(180, 9, 30)
	},
	{
		id: 'u-4',
		name: 'Yoga Pratama',
		email: 'yoga@azetta.id',
		role: 'admin',
		banned: true,
		lastLoginAt: at(34, 11, 20),
		createdAt: at(150, 14, 0)
	}
];

export const customers: Customer[] = [
	{
		id: 'c-1',
		name: 'Sari Wulandari',
		email: 'sari.wulandari@example.com',
		phone: '081234567890',
		city: 'Sleman',
		emailVerified: true,
		banned: false,
		leadCount: 2,
		createdAt: at(64, 8, 15),
		lastLoginAt: at(2, 19, 5)
	},
	{
		id: 'c-2',
		name: 'Budi Santoso',
		email: 'budi.santoso@example.com',
		phone: '081298765432',
		city: 'Bandung',
		emailVerified: true,
		banned: false,
		leadCount: 1,
		createdAt: at(41, 13, 40),
		lastLoginAt: at(0, 8, 47)
	},
	{
		id: 'c-3',
		name: 'Maya Kartika',
		email: 'maya.kartika@example.com',
		phone: '082112345678',
		city: 'Surabaya',
		emailVerified: false,
		banned: false,
		leadCount: 1,
		createdAt: at(30, 9, 5),
		lastLoginAt: at(0, 7, 35)
	},
	{
		id: 'c-4',
		name: 'Hendra Wijaya',
		email: 'hendra.wijaya@example.com',
		phone: '081355566677',
		city: 'Jakarta Selatan',
		emailVerified: true,
		banned: false,
		leadCount: 3,
		createdAt: at(120, 15, 0),
		lastLoginAt: at(1, 20, 30)
	},
	{
		id: 'c-5',
		name: 'Dewi Lestari',
		email: 'dewi.lestari@example.com',
		phone: '081399988877',
		city: 'Bantul',
		emailVerified: true,
		banned: false,
		leadCount: 1,
		createdAt: at(22, 10, 20),
		lastLoginAt: at(1, 13, 10)
	},
	{
		id: 'c-6',
		name: 'Taufik Hidayat',
		email: 'taufik.hidayat@example.com',
		phone: '081211122233',
		city: 'Jakarta Pusat',
		emailVerified: true,
		banned: false,
		leadCount: 2,
		createdAt: at(200, 8, 0),
		lastLoginAt: at(3, 9, 45)
	},
	{
		id: 'c-7',
		name: 'Lina Permata',
		email: 'lina.permata@example.com',
		phone: '085644433322',
		city: 'Depok',
		emailVerified: true,
		banned: false,
		leadCount: 1,
		createdAt: at(96, 17, 25),
		lastLoginAt: at(4, 18, 0)
	},
	{
		id: 'c-8',
		name: 'Andi Saputra',
		email: 'andi.saputra@example.com',
		phone: '081777766655',
		city: 'Bogor',
		emailVerified: false,
		banned: false,
		leadCount: 1,
		createdAt: at(12, 11, 10),
		lastLoginAt: null
	},
	{
		id: 'c-9',
		name: 'Nabila Putri',
		email: 'nabila.putri@example.com',
		phone: '081255544433',
		city: 'Bekasi',
		emailVerified: true,
		banned: true,
		leadCount: 1,
		createdAt: at(75, 12, 0),
		lastLoginAt: at(7, 10, 10)
	},
	{
		id: 'c-10',
		name: 'Rudi Hartono',
		email: 'rudi.hartono@example.com',
		phone: '081266677788',
		city: 'Yogyakarta',
		emailVerified: true,
		banned: false,
		leadCount: 1,
		createdAt: at(140, 9, 35),
		lastLoginAt: at(5, 8, 20)
	}
];

export interface DeletionRequest {
	id: string;
	userId: string;
	name: string;
	email: string;
	reason: string | null;
	status: 'PENDING' | 'COMPLETED' | 'REJECTED';
	requestedAt: string;
	handledAt: string | null;
	handledByName: string | null;
	note: string | null;
}

export const deletionRequests: DeletionRequest[] = [
	{
		id: 'dr-1',
		userId: 'c-8',
		name: 'Andi Saputra',
		email: 'andi.saputra@example.com',
		reason: 'Tidak lagi menggunakan layanan dan ingin menghapus data pribadi.',
		status: 'PENDING',
		requestedAt: at(1, 10, 20),
		handledAt: null,
		handledByName: null,
		note: null
	},
	{
		id: 'dr-2',
		userId: 'c-3',
		name: 'Maya Kartika',
		email: 'maya.kartika@example.com',
		reason: 'Sudah membeli rumah melalui agen lain.',
		status: 'PENDING',
		requestedAt: at(2, 15, 45),
		handledAt: null,
		handledByName: null,
		note: null
	},
	{
		id: 'dr-3',
		userId: 'c-9',
		name: 'Nabila Putri',
		email: 'nabila.putri@example.com',
		reason: null,
		status: 'PENDING',
		requestedAt: at(4, 8, 5),
		handledAt: null,
		handledByName: null,
		note: null
	},
	{
		id: 'dr-4',
		userId: 'c-6',
		name: 'Taufik Hidayat',
		email: 'taufik.hidayat@example.com',
		reason: 'Data sudah tidak relevan setelah proses investasi selesai.',
		status: 'COMPLETED',
		requestedAt: at(19, 13, 30),
		handledAt: at(18, 9, 15),
		handledByName: 'Rina Pratama',
		note: 'Data transaksi dipertahankan sesuai kewajiban arsip.'
	},
	{
		id: 'dr-5',
		userId: 'c-5',
		name: 'Dewi Lestari',
		email: 'dewi.lestari@example.com',
		reason: 'Ingin mendaftar ulang dengan email lain.',
		status: 'REJECTED',
		requestedAt: at(26, 16, 0),
		handledAt: at(25, 10, 40),
		handledByName: 'Dimas Anggara',
		note: 'Akun masih memiliki pengajuan lahan aktif; pengguna diminta menghubungi tim.'
	}
];

// ============================================================
// Lead & CRM
// ============================================================

export type LeadType = 'BUY_DESIGN' | 'LAND_OFFER' | 'INVEST' | 'GENERAL';
export type LeadStatus =
	'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST' | 'SPAM';
export type LeadPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type LeadSource =
	'WEBSITE' | 'ORGANIC_SEARCH' | 'SOCIAL' | 'ADS' | 'REFERRAL' | 'WHATSAPP' | 'EVENT' | 'OTHER';
export type ActivityType =
	'NOTE' | 'STATUS_CHANGE' | 'ASSIGNMENT' | 'CALL' | 'WHATSAPP' | 'EMAIL' | 'MEETING' | 'SYSTEM';
export type OwnershipStatus = 'SHM' | 'SHGB' | 'AJB' | 'GIRIK' | 'LETTER_C' | 'OTHER';
export type ExpectedScheme = 'BAGI_HASIL' | 'SEWA' | 'JUAL' | 'BELUM_TAHU';
export type StartTimeline = 'IMMEDIATE' | 'M3_6' | 'M6_12' | 'OVER_12' | 'UNKNOWN';
export type BudgetRange = 'UNDER_500M' | 'M500_1B' | 'B1_5' | 'B5_20B' | 'ABOVE_20B';
export type RiskProfile = 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE' | 'UNKNOWN';
export type InvestmentInstrument = 'EQUITY' | 'PROFIT_SHARE' | 'FIXED_RETURN' | 'OPEN';
export type AttachmentKind = 'LAND_PHOTO' | 'DOCUMENT' | 'OTHER';

export interface LeadActivity {
	id: number;
	type: ActivityType;
	body: string;
	actorName: string;
	createdAt: string;
}

export interface LandSubmission {
	address: string;
	province: string;
	city: string;
	district: string | null;
	areaM2: number;
	frontageM: number | null;
	ownershipStatus: OwnershipStatus;
	expectedScheme: ExpectedScheme;
	startTimeline: StartTimeline | null;
	notes: string | null;
}

export interface InvestmentInterest {
	budgetRange: BudgetRange;
	preferredLocations: string[];
	horizonMonths: number | null;
	riskProfile: RiskProfile;
	instrument: InvestmentInstrument | null;
	notes: string | null;
}

export interface LeadAttachment {
	id: number;
	kind: AttachmentKind;
	fileName: string;
	mimeType: string;
	sizeBytes: number;
	url: string;
}

export interface Lead {
	id: string;
	reference: string;
	type: LeadType;
	status: LeadStatus;
	priority: LeadPriority;
	name: string;
	phone: string;
	email: string | null;
	city: string | null;
	message: string | null;
	designId: number | null;
	designTitle: string | null;
	source: LeadSource;
	assignedToId: string | null;
	assignedToName: string | null;
	estimatedValue: number | null;
	lostReason: string | null;
	firstContactedAt: string | null;
	lastContactedAt: string | null;
	nextFollowUpAt: string | null;
	createdAt: string;
	updatedAt: string;
	landSubmission: LandSubmission | null;
	investmentInterest: InvestmentInterest | null;
	attachments: LeadAttachment[];
	activities: LeadActivity[];
	customerNote: string | null;
}

let activityId = 0;
const act = (
	type: ActivityType,
	body: string,
	actorName: string,
	createdAt: string
): LeadActivity => ({ id: ++activityId, type, body, actorName, createdAt });

const createdActivity = (createdAt: string, path = '/kontak') =>
	act('SYSTEM', `Lead dibuat dari formulir ${path}.`, 'Sistem', createdAt);

const landPhoto = (id: string) => photo(id, 640);

export const leads: Lead[] = [
	{
		id: 'ld-01',
		reference: 'AZT-LD-2611-K7Q2M',
		type: 'LAND_OFFER',
		status: 'NEW',
		priority: 'HIGH',
		name: 'Sari Wulandari',
		phone: '081234567890',
		email: 'sari.wulandari@example.com',
		city: 'Sleman',
		message:
			'Lahan dekat ring road Utara, ingin ditawarkan untuk kerja sama bagi hasil. Sertifikat atas nama sendiri.',
		designId: null,
		designTitle: null,
		source: 'ORGANIC_SEARCH',
		assignedToId: null,
		assignedToName: null,
		estimatedValue: 1_200_000_000,
		lostReason: null,
		firstContactedAt: null,
		lastContactedAt: null,
		nextFollowUpAt: at(-1, 10, 0),
		createdAt: at(0, 9, 12),
		updatedAt: at(0, 9, 12),
		landSubmission: {
			address: 'Jl. Kaliurang KM 9, Sleman',
			province: 'DI Yogyakarta',
			city: 'Sleman',
			district: 'Ngaglik',
			areaM2: 800,
			frontageM: 20,
			ownershipStatus: 'SHM',
			expectedScheme: 'BAGI_HASIL',
			startTimeline: 'M3_6',
			notes: 'Akses jalan aspal 6 meter, dekat kampus.'
		},
		investmentInterest: null,
		attachments: [
			{
				id: 1,
				kind: 'LAND_PHOTO',
				fileName: 'lahan-depan.jpg',
				mimeType: 'image/jpeg',
				sizeBytes: 482_000,
				url: landPhoto('1500382017468-9049fed747ef')
			},
			{
				id: 2,
				kind: 'LAND_PHOTO',
				fileName: 'akses-jalan.jpg',
				mimeType: 'image/jpeg',
				sizeBytes: 391_000,
				url: landPhoto('1500530855697-b586d89ba3ee')
			},
			{
				id: 3,
				kind: 'DOCUMENT',
				fileName: 'sertifikat-shm.pdf',
				mimeType: 'application/pdf',
				sizeBytes: 1_204_000,
				url: '#'
			}
		],
		activities: [createdActivity(at(0, 9, 12), '/kerja-sama-lahan')],
		customerNote: null
	},
	{
		id: 'ld-02',
		reference: 'AZT-LD-2611-M3P8T',
		type: 'BUY_DESIGN',
		status: 'NEW',
		priority: 'NORMAL',
		name: 'Budi Santoso',
		phone: '081298765432',
		email: 'budi.santoso@example.com',
		city: 'Bandung',
		message: 'Tertarik Tipe 45, minta simulasi KPR dan jadwal survei akhir pekan.',
		designId: 1,
		designTitle: 'Azetta Residence A1 — Tipe 45',
		source: 'ADS',
		assignedToId: 'u-2',
		assignedToName: 'Dimas Anggara',
		estimatedValue: 850_000_000,
		lostReason: null,
		firstContactedAt: null,
		lastContactedAt: null,
		nextFollowUpAt: at(-1, 13, 30),
		createdAt: at(0, 8, 47),
		updatedAt: at(0, 8, 47),
		landSubmission: null,
		investmentInterest: null,
		attachments: [],
		activities: [createdActivity(at(0, 8, 47), '/rumah/azetta-residence-a1')],
		customerNote: null
	},
	{
		id: 'ld-03',
		reference: 'AZT-LD-2611-R5N1B',
		type: 'INVEST',
		status: 'NEW',
		priority: 'HIGH',
		name: 'Hendra Wijaya',
		phone: '081355566677',
		email: 'hendra.wijaya@example.com',
		city: 'Jakarta Selatan',
		message: 'Ingin diversifikasi ke proyek residensial di Yogyakarta dengan tenor 2 tahun.',
		designId: null,
		designTitle: null,
		source: 'WHATSAPP',
		assignedToId: 'u-1',
		assignedToName: 'Rina Pratama',
		estimatedValue: 2_500_000_000,
		lostReason: null,
		firstContactedAt: null,
		lastContactedAt: null,
		nextFollowUpAt: at(-1, 15, 0),
		createdAt: at(0, 8, 10),
		updatedAt: at(0, 8, 10),
		landSubmission: null,
		investmentInterest: {
			budgetRange: 'B5_20B',
			preferredLocations: ['Yogyakarta', 'Solo'],
			horizonMonths: 24,
			riskProfile: 'MODERATE',
			instrument: 'PROFIT_SHARE',
			notes: 'Lebih memilih proyek yang sudah berjalan.'
		},
		attachments: [],
		activities: [createdActivity(at(0, 8, 10), '/investasi')],
		customerNote: null
	},
	{
		id: 'ld-04',
		reference: 'AZT-LD-2611-C9D4H',
		type: 'BUY_DESIGN',
		status: 'NEW',
		priority: 'NORMAL',
		name: 'Maya Kartika',
		phone: '082112345678',
		email: 'maya.kartika@example.com',
		city: 'Surabaya',
		message: 'Mencari unit dengan 3 kamar tidur untuk keluarga, budget maksimal Rp 1,2 M.',
		designId: 2,
		designTitle: 'Azetta Residence B2 — Tipe 54',
		source: 'WEBSITE',
		assignedToId: null,
		assignedToName: null,
		estimatedValue: 1_150_000_000,
		lostReason: null,
		firstContactedAt: null,
		lastContactedAt: null,
		nextFollowUpAt: null,
		createdAt: at(0, 7, 35),
		updatedAt: at(0, 7, 35),
		landSubmission: null,
		investmentInterest: null,
		attachments: [],
		activities: [createdActivity(at(0, 7, 35), '/rumah/azetta-residence-b2')],
		customerNote: null
	},
	{
		id: 'ld-05',
		reference: 'AZT-LD-2611-J2F6W',
		type: 'LAND_OFFER',
		status: 'NEW',
		priority: 'NORMAL',
		name: 'Agus Prasetyo',
		phone: '081399988811',
		email: 'agus.prasetyo@example.com',
		city: 'Yogyakarta',
		message: 'Ada lahan warisan 1.200 m² di Bantul, ingin tahu skema kerja sama.',
		designId: null,
		designTitle: null,
		source: 'REFERRAL',
		assignedToId: 'u-1',
		assignedToName: 'Rina Pratama',
		estimatedValue: 1_800_000_000,
		lostReason: null,
		firstContactedAt: null,
		lastContactedAt: null,
		nextFollowUpAt: null,
		createdAt: at(0, 6, 50),
		updatedAt: at(0, 6, 50),
		landSubmission: {
			address: 'Jl. Parangtritis KM 12, Bantul',
			province: 'DI Yogyakarta',
			city: 'Bantul',
			district: 'Sewon',
			areaM2: 1200,
			frontageM: 24,
			ownershipStatus: 'SHM',
			expectedScheme: 'BELUM_TAHU',
			startTimeline: 'OVER_12',
			notes: 'Masih dibahas bersama ahli waris.'
		},
		investmentInterest: null,
		attachments: [
			{
				id: 4,
				kind: 'LAND_PHOTO',
				fileName: 'lahan-bantul.jpg',
				mimeType: 'image/jpeg',
				sizeBytes: 512_000,
				url: landPhoto('1494526585095-c41746248156')
			}
		],
		activities: [createdActivity(at(0, 6, 50), '/kerja-sama-lahan')],
		customerNote: null
	},
	{
		id: 'ld-06',
		reference: 'AZT-LD-2611-T8Y3L',
		type: 'GENERAL',
		status: 'NEW',
		priority: 'LOW',
		name: 'Rina Marlina',
		phone: '081277788899',
		email: 'rina.marlina@example.com',
		city: 'Semarang',
		message: 'Menanyakan lowongan kerja sama untuk kontraktor lokal.',
		designId: null,
		designTitle: null,
		source: 'SOCIAL',
		assignedToId: null,
		assignedToName: null,
		estimatedValue: null,
		lostReason: null,
		firstContactedAt: null,
		lastContactedAt: null,
		nextFollowUpAt: null,
		createdAt: at(0, 6, 5),
		updatedAt: at(0, 6, 5),
		landSubmission: null,
		investmentInterest: null,
		attachments: [],
		activities: [createdActivity(at(0, 6, 5), '/kontak')],
		customerNote: null
	},
	{
		id: 'ld-07',
		reference: 'AZT-LD-2611-B4S9E',
		type: 'BUY_DESIGN',
		status: 'CONTACTED',
		priority: 'HIGH',
		name: 'Fajar Nugroho',
		phone: '081355577799',
		email: 'fajar.nugroho@example.com',
		city: 'Bekasi',
		message: 'Sudah melihat unit di situs, ingin tahu ketersediaan dan promo.',
		designId: 4,
		designTitle: 'Azetta Signature D1 — Tipe 70',
		source: 'ADS',
		assignedToId: 'u-2',
		assignedToName: 'Dimas Anggara',
		estimatedValue: 1_850_000_000,
		lostReason: null,
		firstContactedAt: at(1, 10, 15),
		lastContactedAt: at(1, 10, 15),
		nextFollowUpAt: at(-2, 11, 0),
		createdAt: at(1, 9, 20),
		updatedAt: at(1, 10, 15),
		landSubmission: null,
		investmentInterest: null,
		attachments: [],
		activities: [
			createdActivity(at(1, 9, 20), '/rumah/azetta-signature-d1'),
			act('STATUS_CHANGE', 'Status NEW → CONTACTED.', 'Dimas Anggara', at(1, 10, 15)),
			act(
				'CALL',
				'Telepon 4 menit. Minta dikirim brosur dan simulasi KPR.',
				'Dimas Anggara',
				at(1, 10, 18)
			)
		],
		customerNote: 'Prioritas: simulasi KPR dan ketersediaan unit.'
	},
	{
		id: 'ld-08',
		reference: 'AZT-LD-2610-V6K2A',
		type: 'LAND_OFFER',
		status: 'CONTACTED',
		priority: 'NORMAL',
		name: 'Dewi Lestari',
		phone: '081399988877',
		email: 'dewi.lestari@example.com',
		city: 'Bantul',
		message: 'Lahan 600 m² dekat pasar, ingin ditawarkan dengan skema jual putus.',
		designId: null,
		designTitle: null,
		source: 'ORGANIC_SEARCH',
		assignedToId: 'u-1',
		assignedToName: 'Rina Pratama',
		estimatedValue: 900_000_000,
		lostReason: null,
		firstContactedAt: at(2, 9, 0),
		lastContactedAt: at(2, 9, 0),
		nextFollowUpAt: at(-3, 9, 30),
		createdAt: at(2, 8, 30),
		updatedAt: at(2, 9, 0),
		landSubmission: {
			address: 'Jl. Imogiri Barat KM 5, Bantul',
			province: 'DI Yogyakarta',
			city: 'Bantul',
			district: 'Sewon',
			areaM2: 600,
			frontageM: 18,
			ownershipStatus: 'SHGB',
			expectedScheme: 'JUAL',
			startTimeline: 'IMMEDIATE',
			notes: 'Bangunan lama masih berdiri, siap dibongkar.'
		},
		investmentInterest: null,
		attachments: [
			{
				id: 5,
				kind: 'LAND_PHOTO',
				fileName: 'lahan-pasar.jpg',
				mimeType: 'image/jpeg',
				sizeBytes: 445_000,
				url: landPhoto('1449844908441-8829872d2607')
			}
		],
		activities: [
			createdActivity(at(2, 8, 30), '/kerja-sama-lahan'),
			act('STATUS_CHANGE', 'Status NEW → CONTACTED.', 'Rina Pratama', at(2, 9, 0))
		],
		customerNote: null
	},
	{
		id: 'ld-09',
		reference: 'AZT-LD-2610-N1R7Q',
		type: 'INVEST',
		status: 'QUALIFIED',
		priority: 'URGENT',
		name: 'Taufik Hidayat',
		phone: '081211122233',
		email: 'taufik.hidayat@example.com',
		city: 'Jakarta Pusat',
		message: 'Investor berpengalaman, ingin masuk ke proyek yang sedang berjalan.',
		designId: null,
		designTitle: null,
		source: 'EVENT',
		assignedToId: 'u-2',
		assignedToName: 'Dimas Anggara',
		estimatedValue: 4_000_000_000,
		lostReason: null,
		firstContactedAt: at(3, 10, 0),
		lastContactedAt: at(1, 14, 30),
		nextFollowUpAt: at(-1, 14, 0),
		createdAt: at(3, 9, 15),
		updatedAt: at(1, 14, 30),
		landSubmission: null,
		investmentInterest: {
			budgetRange: 'B5_20B',
			preferredLocations: ['Yogyakarta', 'Semarang'],
			horizonMonths: 36,
			riskProfile: 'AGGRESSIVE',
			instrument: 'EQUITY',
			notes: 'Ingin laporan progres bulanan dan akses ke proyek prioritas.'
		},
		attachments: [],
		activities: [
			createdActivity(at(3, 9, 15), '/investasi'),
			act('STATUS_CHANGE', 'Status NEW → CONTACTED.', 'Dimas Anggara', at(3, 10, 0)),
			act(
				'MEETING',
				'Meeting daring 45 menit, membahas proyeksi dan struktur ekuitas.',
				'Dimas Anggara',
				at(1, 14, 30)
			),
			act('STATUS_CHANGE', 'Status CONTACTED → QUALIFIED.', 'Dimas Anggara', at(1, 14, 35))
		],
		customerNote: 'Kirim deck investasi terbaru sebelum follow-up.'
	},
	{
		id: 'ld-10',
		reference: 'AZT-LD-2610-P3H8C',
		type: 'BUY_DESIGN',
		status: 'QUALIFIED',
		priority: 'HIGH',
		name: 'Nabila Putri',
		phone: '081255544411',
		email: 'nabila.putri@example.com',
		city: 'Bekasi',
		message: 'Sudah survei lokasi, tinggal membahas skema pembayaran.',
		designId: 2,
		designTitle: 'Azetta Residence B2 — Tipe 54',
		source: 'REFERRAL',
		assignedToId: 'u-1',
		assignedToName: 'Rina Pratama',
		estimatedValue: 1_150_000_000,
		lostReason: null,
		firstContactedAt: at(4, 11, 0),
		lastContactedAt: at(2, 16, 20),
		nextFollowUpAt: at(-4, 10, 0),
		createdAt: at(4, 10, 30),
		updatedAt: at(2, 16, 20),
		landSubmission: null,
		investmentInterest: null,
		attachments: [],
		activities: [
			createdActivity(at(4, 10, 30), '/rumah/azetta-residence-b2'),
			act('STATUS_CHANGE', 'Status NEW → CONTACTED.', 'Rina Pratama', at(4, 11, 0)),
			act('WHATSAPP', 'Mengirim denah dan daftar harga terbaru.', 'Rina Pratama', at(3, 9, 10)),
			act('MEETING', 'Survei lokasi bersama keluarga di unit B2.', 'Rina Pratama', at(2, 16, 20)),
			act('STATUS_CHANGE', 'Status CONTACTED → QUALIFIED.', 'Rina Pratama', at(2, 16, 25))
		],
		customerNote: 'Cek skema DP 20% dan estimasi BI checking.'
	},
	{
		id: 'ld-11',
		reference: 'AZT-LD-2610-D7W4S',
		type: 'GENERAL',
		status: 'PROPOSAL',
		priority: 'NORMAL',
		name: 'Andi Saputra',
		phone: '081777766655',
		email: 'andi.saputra@example.com',
		city: 'Bogor',
		message: 'Menanyakan kerja sama penyediaan material bangunan.',
		designId: null,
		designTitle: null,
		source: 'OTHER',
		assignedToId: 'u-2',
		assignedToName: 'Dimas Anggara',
		estimatedValue: 350_000_000,
		lostReason: null,
		firstContactedAt: at(5, 10, 0),
		lastContactedAt: at(3, 11, 30),
		nextFollowUpAt: at(-5, 9, 0),
		createdAt: at(5, 9, 0),
		updatedAt: at(3, 11, 30),
		landSubmission: null,
		investmentInterest: null,
		attachments: [],
		activities: [
			createdActivity(at(5, 9, 0), '/kontak'),
			act('STATUS_CHANGE', 'Status NEW → CONTACTED.', 'Dimas Anggara', at(5, 10, 0)),
			act('EMAIL', 'Proposal kerja sama material dikirim.', 'Dimas Anggara', at(3, 11, 30)),
			act('STATUS_CHANGE', 'Status CONTACTED → PROPOSAL.', 'Dimas Anggara', at(3, 11, 35))
		],
		customerNote: null
	},
	{
		id: 'ld-12',
		reference: 'AZT-LD-2610-F5G1N',
		type: 'BUY_DESIGN',
		status: 'NEGOTIATION',
		priority: 'URGENT',
		name: 'Lina Permata',
		phone: '085644433322',
		email: 'lina.permata@example.com',
		city: 'Depok',
		message: 'Sudah sepakat unit, sedang negosiasi biaya administrasi dan waktu serah terima.',
		designId: 4,
		designTitle: 'Azetta Signature D1 — Tipe 70',
		source: 'REFERRAL',
		assignedToId: 'u-1',
		assignedToName: 'Rina Pratama',
		estimatedValue: 1_850_000_000,
		lostReason: null,
		firstContactedAt: at(6, 9, 0),
		lastContactedAt: at(1, 10, 0),
		nextFollowUpAt: at(-1, 9, 30),
		createdAt: at(6, 8, 0),
		updatedAt: at(1, 10, 0),
		landSubmission: null,
		investmentInterest: null,
		attachments: [],
		activities: [
			createdActivity(at(6, 8, 0), '/rumah/azetta-signature-d1'),
			act('STATUS_CHANGE', 'Status NEW → CONTACTED.', 'Rina Pratama', at(6, 9, 0)),
			act(
				'MEETING',
				'Pertemuan di kantor pemasaran, memilih unit D1.',
				'Rina Pratama',
				at(4, 14, 0)
			),
			act('STATUS_CHANGE', 'Status CONTACTED → QUALIFIED.', 'Rina Pratama', at(4, 14, 10)),
			act('STATUS_CHANGE', 'Status QUALIFIED → PROPOSAL.', 'Rina Pratama', at(3, 9, 0)),
			act('STATUS_CHANGE', 'Status PROPOSAL → NEGOTIATION.', 'Rina Pratama', at(2, 15, 0))
		],
		customerNote: 'Minta konfirmasi biaya admin sebelum 5 November.'
	},
	{
		id: 'ld-13',
		reference: 'AZT-LD-2610-W2B6J',
		type: 'LAND_OFFER',
		status: 'WON',
		priority: 'NORMAL',
		name: 'Rudi Hartono',
		phone: '081266677788',
		email: 'rudi.hartono@example.com',
		city: 'Yogyakarta',
		message: 'Lahan 1.500 m² di Ring Road Selatan, sepakat bagi hasil 35:65.',
		designId: null,
		designTitle: null,
		source: 'REFERRAL',
		assignedToId: 'u-2',
		assignedToName: 'Dimas Anggara',
		estimatedValue: 3_200_000_000,
		lostReason: null,
		firstContactedAt: at(12, 9, 0),
		lastContactedAt: at(3, 13, 0),
		nextFollowUpAt: null,
		createdAt: at(13, 8, 30),
		updatedAt: at(3, 13, 0),
		landSubmission: {
			address: 'Jl. Ring Road Selatan, Bantul',
			province: 'DI Yogyakarta',
			city: 'Bantul',
			district: 'Banguntapan',
			areaM2: 1500,
			frontageM: 30,
			ownershipStatus: 'SHM',
			expectedScheme: 'BAGI_HASIL',
			startTimeline: 'IMMEDIATE',
			notes: 'Sudah tanda tangan kesepakatan awal.'
		},
		investmentInterest: null,
		attachments: [],
		activities: [
			createdActivity(at(13, 8, 30), '/kerja-sama-lahan'),
			act('STATUS_CHANGE', 'Status NEW → CONTACTED.', 'Dimas Anggara', at(12, 9, 0)),
			act('MEETING', 'Survei lahan dan verifikasi sertifikat.', 'Dimas Anggara', at(8, 10, 0)),
			act('STATUS_CHANGE', 'Status CONTACTED → QUALIFIED.', 'Dimas Anggara', at(8, 10, 30)),
			act('STATUS_CHANGE', 'Status QUALIFIED → WON.', 'Dimas Anggara', at(3, 13, 0))
		],
		customerNote: null
	},
	{
		id: 'ld-14',
		reference: 'AZT-LD-2610-A8C3R',
		type: 'BUY_DESIGN',
		status: 'LOST',
		priority: 'LOW',
		name: 'Siti Aminah',
		phone: '081788899900',
		email: 'siti.aminah@example.com',
		city: 'Semarang',
		message: 'Menunda pembelian sampai tahun depan.',
		designId: 3,
		designTitle: 'Azetta Garden C3 — Tipe 36',
		source: 'WEBSITE',
		assignedToId: 'u-1',
		assignedToName: 'Rina Pratama',
		estimatedValue: 620_000_000,
		lostReason: 'Menunda pembelian, memilih menyewa sampai kondisi keuangan stabil.',
		firstContactedAt: at(9, 10, 0),
		lastContactedAt: at(7, 15, 0),
		nextFollowUpAt: null,
		createdAt: at(10, 8, 10),
		updatedAt: at(7, 15, 0),
		landSubmission: null,
		investmentInterest: null,
		attachments: [],
		activities: [
			createdActivity(at(10, 8, 10), '/rumah/azetta-garden-c3'),
			act('STATUS_CHANGE', 'Status NEW → CONTACTED.', 'Rina Pratama', at(9, 10, 0)),
			act('CALL', 'Telepon 6 menit; pembeli menunda rencana.', 'Rina Pratama', at(7, 15, 0)),
			act('STATUS_CHANGE', 'Status CONTACTED → LOST.', 'Rina Pratama', at(7, 15, 10))
		],
		customerNote: null
	},
	{
		id: 'ld-15',
		reference: 'AZT-LD-2610-U9E5K',
		type: 'INVEST',
		status: 'WON',
		priority: 'HIGH',
		name: 'Bayu Prakoso',
		phone: '081355588800',
		email: 'bayu.prakoso@example.com',
		city: 'Surabaya',
		message: 'Investasi Rp 1,5 M pada proyek Azetta Garden.',
		designId: null,
		designTitle: null,
		source: 'EVENT',
		assignedToId: 'u-2',
		assignedToName: 'Dimas Anggara',
		estimatedValue: 1_500_000_000,
		lostReason: null,
		firstContactedAt: at(21, 9, 0),
		lastContactedAt: at(12, 10, 0),
		nextFollowUpAt: null,
		createdAt: at(22, 8, 0),
		updatedAt: at(12, 10, 0),
		landSubmission: null,
		investmentInterest: {
			budgetRange: 'B1_5',
			preferredLocations: ['Yogyakarta'],
			horizonMonths: 18,
			riskProfile: 'MODERATE',
			instrument: 'FIXED_RETURN',
			notes: 'Dana sudah dicairkan.'
		},
		attachments: [],
		activities: [
			createdActivity(at(22, 8, 0), '/investasi'),
			act('STATUS_CHANGE', 'Status NEW → CONTACTED.', 'Dimas Anggara', at(21, 9, 0)),
			act('MEETING', 'Presentasi proyek dan due diligence.', 'Dimas Anggara', at(16, 13, 0)),
			act('STATUS_CHANGE', 'Status CONTACTED → QUALIFIED.', 'Dimas Anggara', at(16, 13, 30)),
			act('STATUS_CHANGE', 'Status QUALIFIED → WON.', 'Dimas Anggara', at(12, 10, 0))
		],
		customerNote: null
	},
	{
		id: 'ld-16',
		reference: 'AZT-LD-2609-S1M7Q',
		type: 'BUY_DESIGN',
		status: 'SPAM',
		priority: 'LOW',
		name: 'Kartika Sari',
		phone: '081100000000',
		email: null,
		city: null,
		message: 'Pesan berulang tanpa isi.',
		designId: null,
		designTitle: null,
		source: 'WEBSITE',
		assignedToId: null,
		assignedToName: null,
		estimatedValue: null,
		lostReason: null,
		firstContactedAt: null,
		lastContactedAt: null,
		nextFollowUpAt: null,
		createdAt: at(16, 2, 15),
		updatedAt: at(16, 2, 15),
		landSubmission: null,
		investmentInterest: null,
		attachments: [],
		activities: [
			createdActivity(at(16, 2, 15), '/kontak'),
			act('SYSTEM', 'Ditandai spam oleh filter otomatis (skor 85).', 'Sistem', at(16, 2, 16))
		],
		customerNote: null
	},
	{
		id: 'ld-17',
		reference: 'AZT-LD-2609-H4T2D',
		type: 'GENERAL',
		status: 'NEW',
		priority: 'NORMAL',
		name: 'Joko Susilo',
		phone: '081299900011',
		email: 'joko.susilo@example.com',
		city: 'Klaten',
		message: 'Minta informasi kantor pemasaran dan jam kunjungan.',
		designId: null,
		designTitle: null,
		source: 'ORGANIC_SEARCH',
		assignedToId: null,
		assignedToName: null,
		estimatedValue: null,
		lostReason: null,
		firstContactedAt: null,
		lastContactedAt: null,
		nextFollowUpAt: null,
		createdAt: at(20, 11, 45),
		updatedAt: at(20, 11, 45),
		landSubmission: null,
		investmentInterest: null,
		attachments: [],
		activities: [createdActivity(at(20, 11, 45), '/kontak')],
		customerNote: null
	},
	{
		id: 'ld-18',
		reference: 'AZT-LD-2609-G6B8L',
		type: 'LAND_OFFER',
		status: 'CONTACTED',
		priority: 'NORMAL',
		name: 'Wulan Sari',
		phone: '081244455566',
		email: 'wulan.sari@example.com',
		city: 'Sleman',
		message: 'Menawarkan lahan 950 m² di Pakem untuk proyek baru.',
		designId: null,
		designTitle: null,
		source: 'SOCIAL',
		assignedToId: 'u-1',
		assignedToName: 'Rina Pratama',
		estimatedValue: 1_400_000_000,
		lostReason: null,
		firstContactedAt: at(28, 9, 30),
		lastContactedAt: at(28, 9, 30),
		nextFollowUpAt: at(-6, 10, 0),
		createdAt: at(29, 8, 15),
		updatedAt: at(28, 9, 30),
		landSubmission: {
			address: 'Jl. Kaliurang KM 20, Pakem',
			province: 'DI Yogyakarta',
			city: 'Sleman',
			district: 'Pakem',
			areaM2: 950,
			frontageM: 22,
			ownershipStatus: 'SHM',
			expectedScheme: 'BAGI_HASIL',
			startTimeline: 'M6_12',
			notes: 'Kontur miring, perlu kajian struktur.'
		},
		investmentInterest: null,
		attachments: [],
		activities: [
			createdActivity(at(29, 8, 15), '/kerja-sama-lahan'),
			act('STATUS_CHANGE', 'Status NEW → CONTACTED.', 'Rina Pratama', at(28, 9, 30))
		],
		customerNote: null
	}
];

// ============================================================
// Katalog unit
// ============================================================

export type DesignCategory = 'RESIDENTIAL' | 'COMMERCIAL' | 'RENOVATION' | 'INTERIOR';
export type DesignStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface DesignUnit {
	id: number;
	slug: string;
	title: string;
	subtitle: string | null;
	description: string;
	category: DesignCategory;
	style: string;
	floors: number;
	bedrooms: number;
	bathrooms: number;
	carports: number;
	buildingAreaM2: number;
	landAreaMinM2: number;
	estimatedBuildCostMin: number | null;
	estimatedBuildCostMax: number | null;
	priceFrom: number | null;
	status: DesignStatus;
	featured: boolean;
	viewCount: number;
	publishedAt: string | null;
	seoTitle: string | null;
	seoDescription: string | null;
	createdAt: string;
	updatedAt: string;
	cover: string;
	gallery: string[];
	tags: string[];
}

export const units: DesignUnit[] = [
	{
		id: 1,
		slug: 'azetta-residence-a1',
		title: 'Azetta Residence A1',
		subtitle: 'Tipe 45 dengan taman belakang',
		description:
			'<p>Unit dua lantai dengan ruang keluarga terbuka dan taman belakang 12 m². Cocok untuk keluarga muda yang membutuhkan ruang kerja di rumah.</p>',
		category: 'RESIDENTIAL',
		style: 'Modern tropis',
		floors: 2,
		bedrooms: 3,
		bathrooms: 2,
		carports: 1,
		buildingAreaM2: 90,
		landAreaMinM2: 96,
		estimatedBuildCostMin: 720_000_000,
		estimatedBuildCostMax: 850_000_000,
		priceFrom: 850_000_000,
		status: 'PUBLISHED',
		featured: true,
		viewCount: 1240,
		publishedAt: at(120, 9, 0),
		seoTitle: 'Azetta Residence A1 — Rumah Tipe 45 di Sleman',
		seoDescription:
			'Rumah dua lantai 3 kamar tidur di Azetta Residence, Sleman. Luas bangunan 90 m², harga mulai Rp 850 juta.',
		createdAt: at(140, 8, 0),
		updatedAt: at(6, 14, 20),
		cover: photo('1600596542815-ffad4c1539a9'),
		gallery: [
			photo('1600596542815-ffad4c1539a9'),
			photo('1600585154340-be6161a56a0c'),
			photo('1600607687939-ce8a6c25118c')
		],
		tags: ['2 lantai', 'taman', 'siap huni']
	},
	{
		id: 2,
		slug: 'azetta-residence-b2',
		title: 'Azetta Residence B2',
		subtitle: 'Tipe 54 untuk keluarga besar',
		description:
			'<p>Denah lebar dengan empat kamar tidur dan dua carport. Area servis terpisah dari area keluarga.</p>',
		category: 'RESIDENTIAL',
		style: 'Modern minimalis',
		floors: 2,
		bedrooms: 4,
		bathrooms: 2,
		carports: 2,
		buildingAreaM2: 108,
		landAreaMinM2: 120,
		estimatedBuildCostMin: 950_000_000,
		estimatedBuildCostMax: 1_150_000_000,
		priceFrom: 1_150_000_000,
		status: 'PUBLISHED',
		featured: true,
		viewCount: 980,
		publishedAt: at(98, 10, 30),
		seoTitle: 'Azetta Residence B2 — Rumah Tipe 54 di Sleman',
		seoDescription:
			'Rumah tipe 54 dengan 4 kamar tidur dan 2 carport di Azetta Residence, Sleman. Harga mulai Rp 1,15 miliar.',
		createdAt: at(110, 9, 15),
		updatedAt: at(3, 11, 0),
		cover: photo('1600585154340-be6161a56a0c'),
		gallery: [photo('1600585154340-be6161a56a0c'), photo('1600585154526-990dced4db0d')],
		tags: ['4 kamar', 'carport ganda']
	},
	{
		id: 3,
		slug: 'azetta-garden-c3',
		title: 'Azetta Garden C3',
		subtitle: 'Tipe 36 satu lantai',
		description:
			'<p>Unit satu lantai dengan taman bersama dan akses langsung ke area komunal. Efisien untuk pasangan muda.</p>',
		category: 'RESIDENTIAL',
		style: 'Scandinavian',
		floors: 1,
		bedrooms: 2,
		bathrooms: 1,
		carports: 1,
		buildingAreaM2: 72,
		landAreaMinM2: 84,
		estimatedBuildCostMin: 520_000_000,
		estimatedBuildCostMax: 620_000_000,
		priceFrom: 620_000_000,
		status: 'PUBLISHED',
		featured: false,
		viewCount: 645,
		publishedAt: at(64, 9, 0),
		seoTitle: 'Azetta Garden C3 — Rumah Tipe 36 di Bantul',
		seoDescription:
			'Rumah satu lantai 2 kamar tidur di Azetta Garden, Bantul. Harga mulai Rp 620 juta.',
		createdAt: at(80, 8, 30),
		updatedAt: at(12, 9, 45),
		cover: photo('1600585154526-990dced4db0d'),
		gallery: [photo('1600585154526-990dced4db0d')],
		tags: ['satu lantai', 'taman komunal']
	},
	{
		id: 4,
		slug: 'azetta-signature-d1',
		title: 'Azetta Signature D1',
		subtitle: 'Tipe 70 dengan rooftop',
		description:
			'<p>Unit premium dengan rooftop dan area kerja khusus. Material fasad dipilih untuk perawatan rendah.</p>',
		category: 'RESIDENTIAL',
		style: 'Kontemporer',
		floors: 2,
		bedrooms: 4,
		bathrooms: 3,
		carports: 2,
		buildingAreaM2: 140,
		landAreaMinM2: 150,
		estimatedBuildCostMin: 1_600_000_000,
		estimatedBuildCostMax: 1_850_000_000,
		priceFrom: 1_850_000_000,
		status: 'PUBLISHED',
		featured: true,
		viewCount: 1580,
		publishedAt: at(45, 9, 0),
		seoTitle: 'Azetta Signature D1 — Rumah Tipe 70 dengan Rooftop',
		seoDescription:
			'Rumah premium 4 kamar tidur dengan rooftop di Azetta Signature, Sleman. Harga mulai Rp 1,85 miliar.',
		createdAt: at(60, 10, 0),
		updatedAt: at(1, 16, 10),
		cover: photo('1512917774080-9991f1c4c750'),
		gallery: [
			photo('1512917774080-9991f1c4c750'),
			photo('1613490493576-7fde63acd811'),
			photo('1600047509807-ba8f99d2cdde')
		],
		tags: ['rooftop', 'premium', '4 kamar']
	},
	{
		id: 5,
		slug: 'azetta-compact-e1',
		title: 'Azetta Compact E1',
		subtitle: 'Tipe 30 untuk lahan sempit',
		description:
			'<p>Rancangan satu lantai dengan pencahayaan alami maksimal pada lahan 72 m². Sedang dalam penyusunan gambar kerja.</p>',
		category: 'RESIDENTIAL',
		style: 'Minimalis',
		floors: 1,
		bedrooms: 2,
		bathrooms: 1,
		carports: 1,
		buildingAreaM2: 60,
		landAreaMinM2: 72,
		estimatedBuildCostMin: 420_000_000,
		estimatedBuildCostMax: 480_000_000,
		priceFrom: 480_000_000,
		status: 'DRAFT',
		featured: false,
		viewCount: 0,
		publishedAt: null,
		seoTitle: null,
		seoDescription: null,
		createdAt: at(9, 13, 0),
		updatedAt: at(2, 10, 30),
		cover: photo('1568605114967-8130f3a36994'),
		gallery: [photo('1568605114967-8130f3a36994')],
		tags: ['lahan sempit', 'efisien']
	},
	{
		id: 6,
		slug: 'azetta-shophouse-s1',
		title: 'Azetta Shophouse S1',
		subtitle: 'Ruko tiga lantai di Commercial Park',
		description:
			'<p>Unit komersial tiga lantai dengan parkir depan. Modul struktur memungkinkan penggabungan dua unit.</p>',
		category: 'COMMERCIAL',
		style: 'Industrial modern',
		floors: 3,
		bedrooms: 0,
		bathrooms: 3,
		carports: 2,
		buildingAreaM2: 240,
		landAreaMinM2: 160,
		estimatedBuildCostMin: 2_100_000_000,
		estimatedBuildCostMax: 2_400_000_000,
		priceFrom: 2_400_000_000,
		status: 'DRAFT',
		featured: false,
		viewCount: 0,
		publishedAt: null,
		seoTitle: null,
		seoDescription: null,
		createdAt: at(5, 9, 0),
		updatedAt: at(0, 9, 15),
		cover: photo('1541888946425-d81bb19240f5'),
		gallery: [photo('1541888946425-d81bb19240f5')],
		tags: ['komersial', 'investasi']
	},
	{
		id: 7,
		slug: 'azetta-renovasi-r1',
		title: 'Azetta Renovasi R1',
		subtitle: 'Paket renovasi rumah lama',
		description:
			'<p>Paket renovasi fasad dan penataan ulang ruang tamu untuk rumah lama di area kota.</p>',
		category: 'RENOVATION',
		style: 'Adaptif',
		floors: 1,
		bedrooms: 3,
		bathrooms: 2,
		carports: 1,
		buildingAreaM2: 110,
		landAreaMinM2: 120,
		estimatedBuildCostMin: 300_000_000,
		estimatedBuildCostMax: 350_000_000,
		priceFrom: 350_000_000,
		status: 'ARCHIVED',
		featured: false,
		viewCount: 210,
		publishedAt: at(220, 9, 0),
		seoTitle: 'Azetta Renovasi R1 — Paket Renovasi Rumah',
		seoDescription: 'Paket renovasi rumah lama dengan penataan ulang ruang utama.',
		createdAt: at(240, 8, 0),
		updatedAt: at(30, 11, 30),
		cover: photo('1570129477492-45c003edd2be'),
		gallery: [photo('1570129477492-45c003edd2be')],
		tags: ['renovasi']
	},
	{
		id: 8,
		slug: 'azetta-interior-loft-i1',
		title: 'Azetta Interior Loft I1',
		subtitle: 'Paket interior unit loft',
		description:
			'<p>Paket interior lengkap untuk unit loft 96 m², termasuk dapur, ruang kerja, dan penyimpanan tersembunyi.</p>',
		category: 'INTERIOR',
		style: 'Japandi',
		floors: 2,
		bedrooms: 2,
		bathrooms: 2,
		carports: 0,
		buildingAreaM2: 96,
		landAreaMinM2: 0,
		estimatedBuildCostMin: 220_000_000,
		estimatedBuildCostMax: 260_000_000,
		priceFrom: 260_000_000,
		status: 'PUBLISHED',
		featured: false,
		viewCount: 380,
		publishedAt: at(38, 9, 30),
		seoTitle: 'Azetta Interior Loft I1 — Paket Desain Interior',
		seoDescription: 'Paket interior Japandi untuk unit loft 96 m², termasuk dapur dan ruang kerja.',
		createdAt: at(50, 9, 0),
		updatedAt: at(8, 14, 0),
		cover: photo('1605276374104-dee2a0ed3cd6'),
		gallery: [photo('1605276374104-dee2a0ed3cd6')],
		tags: ['interior', 'japandi']
	}
];

// ============================================================
// Proyek
// ============================================================

export type ProjectStatus = 'PLANNED' | 'ONGOING' | 'COMPLETED';

export interface ProjectItem {
	id: number;
	slug: string;
	title: string;
	summary: string | null;
	description: string | null;
	location: string;
	city: string;
	province: string;
	status: ProjectStatus;
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
	createdAt: string;
	updatedAt: string;
}

export const projects: ProjectItem[] = [
	{
		id: 1,
		slug: 'azetta-residence',
		title: 'Azetta Residence',
		summary: 'Cluster 24 unit di Sleman Utara dengan konsep hunian tropis.',
		description:
			'<p>Proyek berjalan sejak 2024 dengan 24 unit tipe 45 dan 54. Tahap pertama sudah diserahkan pada pertengahan 2025.</p>',
		location: 'Jl. Kaliurang KM 9',
		city: 'Sleman',
		province: 'DI Yogyakarta',
		status: 'ONGOING',
		yearStarted: 2024,
		yearCompleted: null,
		landAreaM2: 4800,
		unitCount: 24,
		coverImageUrl: photo('1600596542815-ffad4c1539a9'),
		galleryUrls: [photo('1600596542815-ffad4c1539a9'), photo('1600585154340-be6161a56a0c')],
		isPublished: true,
		sortOrder: 1,
		seoTitle: 'Azetta Residence — Cluster Hunian di Sleman',
		seoDescription: 'Cluster 24 unit di Sleman Utara dengan konsep hunian tropis.',
		createdAt: at(400, 9, 0),
		updatedAt: at(10, 11, 0)
	},
	{
		id: 2,
		slug: 'azetta-garden',
		title: 'Azetta Garden',
		summary: '16 unit satu lantai dengan taman komunal di Bantul.',
		description:
			'<p>Hunian satu lantai dengan taman komunal seluas 600 m². Sedang berjalan pada tahap struktur.</p>',
		location: 'Jl. Imogiri Barat KM 5',
		city: 'Bantul',
		province: 'DI Yogyakarta',
		status: 'ONGOING',
		yearStarted: 2025,
		yearCompleted: null,
		landAreaM2: 3200,
		unitCount: 16,
		coverImageUrl: photo('1600585154526-990dced4db0d'),
		galleryUrls: [photo('1600585154526-990dced4db0d')],
		isPublished: true,
		sortOrder: 2,
		seoTitle: 'Azetta Garden — Hunian Satu Lantai di Bantul',
		seoDescription: '16 unit satu lantai dengan taman komunal di Bantul.',
		createdAt: at(300, 9, 0),
		updatedAt: at(16, 10, 30)
	},
	{
		id: 3,
		slug: 'azetta-signature',
		title: 'Azetta Signature',
		summary: '12 unit premium dengan rooftop di Seturan.',
		description:
			'<p>Proyek premium yang direncanakan mulai 2026. Sedang dalam proses perizinan dan penyusunan desain.</p>',
		location: 'Jl. Seturan Raya',
		city: 'Sleman',
		province: 'DI Yogyakarta',
		status: 'PLANNED',
		yearStarted: 2026,
		yearCompleted: null,
		landAreaM2: 2600,
		unitCount: 12,
		coverImageUrl: photo('1512917774080-9991f1c4c750'),
		galleryUrls: [photo('1512917774080-9991f1c4c750')],
		isPublished: true,
		sortOrder: 3,
		seoTitle: 'Azetta Signature — Hunian Premium di Seturan',
		seoDescription: '12 unit premium dengan rooftop di Seturan, Sleman.',
		createdAt: at(120, 9, 0),
		updatedAt: at(4, 14, 0)
	},
	{
		id: 4,
		slug: 'azetta-compact',
		title: 'Azetta Compact',
		summary: '20 unit tipe 30 yang telah selesai pada 2023.',
		description:
			'<p>Proyek pertama Azetta dengan 20 unit tipe 30. Seluruh unit telah diserahkan dan dikelola warga.</p>',
		location: 'Jl. Maguwoharjo',
		city: 'Sleman',
		province: 'DI Yogyakarta',
		status: 'COMPLETED',
		yearStarted: 2022,
		yearCompleted: 2023,
		landAreaM2: 3000,
		unitCount: 20,
		coverImageUrl: photo('1568605114967-8130f3a36994'),
		galleryUrls: [photo('1568605114967-8130f3a36994')],
		isPublished: true,
		sortOrder: 4,
		seoTitle: 'Azetta Compact — Proyek Selesai 2023',
		seoDescription: '20 unit tipe 30 yang telah selesai pada 2023 di Maguwoharjo.',
		createdAt: at(500, 9, 0),
		updatedAt: at(60, 9, 0)
	},
	{
		id: 5,
		slug: 'azetta-commercial-park',
		title: 'Azetta Commercial Park',
		summary: 'Delapan unit ruko di Solo, tahap perencanaan.',
		description:
			'<p>Kawasan komersial dengan delapan unit ruko tiga lantai. Menunggu finalisasi desain fasad.</p>',
		location: 'Jl. Adi Sucipto',
		city: 'Solo',
		province: 'Jawa Tengah',
		status: 'PLANNED',
		yearStarted: 2026,
		yearCompleted: null,
		landAreaM2: 5400,
		unitCount: 8,
		coverImageUrl: photo('1541888946425-d81bb19240f5'),
		galleryUrls: [photo('1541888946425-d81bb19240f5')],
		isPublished: false,
		sortOrder: 5,
		seoTitle: null,
		seoDescription: null,
		createdAt: at(20, 9, 0),
		updatedAt: at(1, 9, 45)
	},
	{
		id: 6,
		slug: 'azetta-riverside',
		title: 'Azetta Riverside',
		summary: '18 unit selesai 2022 di Klaten.',
		description:
			'<p>Proyek hunian tepi sungai dengan 18 unit, selesai dan diserahkan pada 2022.</p>',
		location: 'Jl. Ki Ageng Gribig',
		city: 'Klaten',
		province: 'Jawa Tengah',
		status: 'COMPLETED',
		yearStarted: 2021,
		yearCompleted: 2022,
		landAreaM2: 4200,
		unitCount: 18,
		coverImageUrl: photo('1494526585095-c41746248156'),
		galleryUrls: [photo('1494526585095-c41746248156')],
		isPublished: true,
		sortOrder: 6,
		seoTitle: 'Azetta Riverside — Proyek Selesai 2022',
		seoDescription: '18 unit hunian tepi sungai di Klaten, selesai 2022.',
		createdAt: at(620, 9, 0),
		updatedAt: at(120, 9, 0)
	}
];

// ============================================================
// Konten
// ============================================================

export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface ArticleItem {
	id: number;
	slug: string;
	title: string;
	excerpt: string | null;
	content: string;
	coverImageUrl: string | null;
	status: ArticleStatus;
	publishedAt: string | null;
	readingMinutes: number | null;
	tags: string[];
	viewCount: number;
	seoTitle: string | null;
	seoDescription: string | null;
	authorId: string | null;
	authorName: string | null;
	createdAt: string;
	updatedAt: string;
}

export const articles: ArticleItem[] = [
	{
		id: 1,
		slug: 'panduan-memilih-rumah-pertama',
		title: 'Panduan memilih rumah pertama tanpa menyesal',
		excerpt: 'Lima hal yang perlu diperiksa sebelum membayar tanda jadi.',
		content:
			'<h2>Mulai dari kebutuhan, bukan harga</h2><p>Sebelum melihat unit, tuliskan kebutuhan ruang keluarga Anda untuk lima tahun ke depan...</p><h2>Periksa legalitas dan akses</h2><p>Pastikan sertifikat, IMB/PBG, dan akses jalan sesuai dengan yang dijanjikan.</p>',
		coverImageUrl: photo('1600585154340-be6161a56a0c'),
		status: 'PUBLISHED',
		publishedAt: at(9, 9, 0),
		readingMinutes: 7,
		tags: ['panduan', 'pembeli'],
		viewCount: 1420,
		seoTitle: 'Panduan Memilih Rumah Pertama — Azetta',
		seoDescription: 'Lima hal yang perlu diperiksa sebelum membayar tanda jadi rumah pertama.',
		authorId: 'u-1',
		authorName: 'Rina Pratama',
		createdAt: at(10, 9, 0),
		updatedAt: at(9, 9, 0)
	},
	{
		id: 2,
		slug: 'skema-kerja-sama-lahan',
		title: 'Skema kerja sama lahan: bagi hasil, sewa, atau jual',
		excerpt: 'Perbandingan sederhana tiga skema yang paling sering ditanyakan pemilik lahan.',
		content:
			'<h2>Bagi hasil</h2><p>Pemilik lahan menerima porsi unit atau keuntungan sesuai kesepakatan...</p><h2>Sewa</h2><p>Cocok bila pemilik ingin pendapatan tetap tanpa terlibat proses pembangunan.</p>',
		coverImageUrl: photo('1494526585095-c41746248156'),
		status: 'PUBLISHED',
		publishedAt: at(16, 10, 0),
		readingMinutes: 6,
		tags: ['lahan', 'kerja sama'],
		viewCount: 860,
		seoTitle: 'Skema Kerja Sama Lahan — Azetta',
		seoDescription: 'Perbandingan skema bagi hasil, sewa, dan jual untuk pemilik lahan.',
		authorId: 'u-2',
		authorName: 'Dimas Anggara',
		createdAt: at(18, 9, 0),
		updatedAt: at(16, 10, 0)
	},
	{
		id: 3,
		slug: 'memahami-kpr-dan-biaya-tersembunyi',
		title: 'Memahami KPR dan biaya yang sering terlewat',
		excerpt: 'Rincian biaya provisi, appraisal, dan asuransi dalam pengajuan KPR.',
		content:
			'<h2>Biaya di muka</h2><p>Selain DP, ada biaya provisi, appraisal, notaris, dan asuransi...</p>',
		coverImageUrl: photo('1554224155-6726b3ff858f'),
		status: 'PUBLISHED',
		publishedAt: at(23, 9, 30),
		readingMinutes: 8,
		tags: ['KPR', 'pembeli'],
		viewCount: 2120,
		seoTitle: 'Memahami KPR dan Biaya Tersembunyi — Azetta',
		seoDescription: 'Rincian biaya provisi, appraisal, dan asuransi dalam pengajuan KPR.',
		authorId: 'u-1',
		authorName: 'Rina Pratama',
		createdAt: at(24, 8, 0),
		updatedAt: at(23, 9, 30)
	},
	{
		id: 4,
		slug: 'memilih-lokasi-investasi-properti',
		title: 'Memilih lokasi investasi properti di kota kecil',
		excerpt: 'Faktor akses, pertumbuhan penduduk, dan rencana tata ruang.',
		content:
			'<h2>Bukan hanya harga tanah</h2><p>Perhatikan rencana jalan, kampus, dan pusat layanan kesehatan...</p>',
		coverImageUrl: photo('1449844908441-8829872d2607'),
		status: 'PUBLISHED',
		publishedAt: at(31, 11, 0),
		readingMinutes: 5,
		tags: ['investasi'],
		viewCount: 540,
		seoTitle: 'Memilih Lokasi Investasi Properti — Azetta',
		seoDescription: 'Faktor akses, pertumbuhan penduduk, dan rencana tata ruang.',
		authorId: 'u-2',
		authorName: 'Dimas Anggara',
		createdAt: at(33, 9, 0),
		updatedAt: at(31, 11, 0)
	},
	{
		id: 5,
		slug: 'merawat-rumah-tropis',
		title: 'Merawat rumah tropis agar tetap nyaman',
		excerpt: 'Pemeriksaan rutin untuk atap, ventilasi, dan kelembapan.',
		content: '<h2>Atap dan talang</h2><p>Periksa talang setiap awal musim hujan...</p>',
		coverImageUrl: photo('1600607687939-ce8a6c25118c'),
		status: 'DRAFT',
		publishedAt: null,
		readingMinutes: 4,
		tags: ['perawatan'],
		viewCount: 0,
		seoTitle: null,
		seoDescription: null,
		authorId: 'u-3',
		authorName: 'Sinta Maharani',
		createdAt: at(6, 14, 0),
		updatedAt: at(2, 9, 0)
	},
	{
		id: 6,
		slug: 'tahapan-pembangunan-rumah',
		title: 'Tahapan pembangunan rumah dari pondasi sampai serah terima',
		excerpt: 'Apa saja yang bisa dipantau pemilik pada setiap tahap.',
		content: '<h2>Tahap struktur</h2><p>Pemilik dapat meminta laporan foto mingguan...</p>',
		coverImageUrl: photo('1503387762-592deb58ef4e'),
		status: 'DRAFT',
		publishedAt: null,
		readingMinutes: 9,
		tags: ['pembangunan', 'panduan'],
		viewCount: 0,
		seoTitle: null,
		seoDescription: null,
		authorId: 'u-1',
		authorName: 'Rina Pratama',
		createdAt: at(4, 10, 0),
		updatedAt: at(1, 15, 30)
	},
	{
		id: 7,
		slug: 'catatan-pasar-properti-2025',
		title: 'Catatan pasar properti 2025 di DIY',
		excerpt: 'Ringkasan tren harga dan permintaan di Sleman dan Bantul.',
		content: '<h2>Permintaan</h2><p>Permintaan rumah tapak di bawah Rp 1 M tetap kuat...</p>',
		coverImageUrl: photo('1486406146926-c627a92ad1ab'),
		status: 'ARCHIVED',
		publishedAt: at(210, 9, 0),
		readingMinutes: 6,
		tags: ['pasar'],
		viewCount: 760,
		seoTitle: 'Catatan Pasar Properti 2025 di DIY — Azetta',
		seoDescription: 'Ringkasan tren harga dan permintaan properti di Sleman dan Bantul.',
		authorId: 'u-2',
		authorName: 'Dimas Anggara',
		createdAt: at(215, 9, 0),
		updatedAt: at(190, 9, 0)
	},
	{
		id: 8,
		slug: 'checklist-sebelum-serah-terima',
		title: 'Checklist sebelum menerima kunci rumah',
		excerpt: 'Daftar pemeriksaan singkat saat serah terima unit.',
		content:
			'<h2>Air dan listrik</h2><p>Uji semua keran, saluran pembuangan, dan titik lampu...</p>',
		coverImageUrl: photo('1600047509807-ba8f99d2cdde'),
		status: 'PUBLISHED',
		publishedAt: at(2, 8, 0),
		readingMinutes: 5,
		tags: ['serah terima', 'panduan'],
		viewCount: 190,
		seoTitle: 'Checklist Sebelum Serah Terima Rumah — Azetta',
		seoDescription: 'Daftar pemeriksaan singkat saat serah terima unit rumah.',
		authorId: 'u-1',
		authorName: 'Rina Pratama',
		createdAt: at(3, 9, 0),
		updatedAt: at(2, 8, 0)
	}
];

export interface FaqItem {
	id: number;
	question: string;
	answer: string;
	category: string;
	sortOrder: number;
	isActive: boolean;
	updatedAt: string;
}

export const faqs: FaqItem[] = [
	{
		id: 1,
		question: 'Apakah harga unit sudah termasuk PPN dan biaya notaris?',
		answer:
			'Harga yang tampil adalah harga dasar unit. PPN, BPHTB, dan biaya notaris dihitung terpisah dan akan dirinci dalam penawaran resmi.',
		category: 'pembelian',
		sortOrder: 1,
		isActive: true,
		updatedAt: at(8, 10, 0)
	},
	{
		id: 2,
		question: 'Berapa lama proses serah terima setelah akad?',
		answer:
			'Serah terima dilakukan paling lambat 14 hari kerja setelah pelunasan atau pencairan KPR, setelah pemeriksaan bersama.',
		category: 'pembelian',
		sortOrder: 2,
		isActive: true,
		updatedAt: at(8, 10, 0)
	},
	{
		id: 3,
		question: 'Apakah bisa membeli unit secara tunai bertahap?',
		answer:
			'Bisa. Skema tunai bertahap tersedia dengan termin 3–12 kali sesuai kesepakatan dan tanpa bunga.',
		category: 'pembayaran',
		sortOrder: 3,
		isActive: true,
		updatedAt: at(12, 11, 30)
	},
	{
		id: 4,
		question: 'Skema kerja sama lahan apa saja yang tersedia?',
		answer:
			'Ada tiga skema: bagi hasil unit, sewa lahan berkala, dan jual putus. Pilihan disesuaikan dengan tujuan pemilik lahan.',
		category: 'lahan',
		sortOrder: 4,
		isActive: true,
		updatedAt: at(15, 9, 0)
	},
	{
		id: 5,
		question: 'Apakah lahan harus bebas sengketa?',
		answer:
			'Ya. Kami melakukan verifikasi sertifikat dan pengecekan status lahan sebelum kesepakatan ditandatangani.',
		category: 'lahan',
		sortOrder: 5,
		isActive: true,
		updatedAt: at(15, 9, 0)
	},
	{
		id: 6,
		question: 'Bagaimana cara memantau progres pembangunan?',
		answer:
			'Pemilik dapat masuk ke halaman Akun untuk melihat progres, foto terbaru, dan jadwal termin.',
		category: 'proyek',
		sortOrder: 6,
		isActive: true,
		updatedAt: at(20, 14, 0)
	},
	{
		id: 7,
		question: 'Apakah unit bisa dikreditkan melalui bank selain rekanan?',
		answer:
			'Bisa, selama bank tersebut menyetujui objek dan proses appraisal sesuai jadwal proyek.',
		category: 'pembayaran',
		sortOrder: 7,
		isActive: false,
		updatedAt: at(40, 10, 0)
	},
	{
		id: 8,
		question: 'Apakah tersedia garansi struktur?',
		answer:
			'Struktur bergaransi 10 tahun dan instalasi listrik serta plumbing bergaransi 1 tahun sejak serah terima.',
		category: 'proyek',
		sortOrder: 8,
		isActive: true,
		updatedAt: at(22, 9, 30)
	}
];

export interface TestimonialItem {
	id: number;
	name: string;
	role: string | null;
	projectName: string | null;
	quote: string;
	avatarUrl: string | null;
	isPublished: boolean;
	sortOrder: number;
	updatedAt: string;
}

export const testimonials: TestimonialItem[] = [
	{
		id: 1,
		name: 'Rudi Hartono',
		role: 'Pemilik lahan',
		projectName: 'Azetta Residence',
		quote:
			'Proses verifikasi lahan rapi dan komunikasi tiap tahap jelas. Skema bagi hasilnya mudah dipahami.',
		avatarUrl: null,
		isPublished: true,
		sortOrder: 1,
		updatedAt: at(11, 9, 0)
	},
	{
		id: 2,
		name: 'Lina Permata',
		role: 'Pembeli unit',
		projectName: 'Azetta Signature',
		quote:
			'Yang paling membantu adalah laporan progres berkala. Kami bisa memantau tanpa harus datang tiap minggu.',
		avatarUrl: null,
		isPublished: true,
		sortOrder: 2,
		updatedAt: at(9, 13, 0)
	},
	{
		id: 3,
		name: 'Taufik Hidayat',
		role: 'Investor',
		projectName: 'Azetta Garden',
		quote: 'Laporan bulanan dan akses ke tim proyek membuat proses due diligence lebih cepat.',
		avatarUrl: null,
		isPublished: true,
		sortOrder: 3,
		updatedAt: at(18, 10, 30)
	},
	{
		id: 4,
		name: 'Nabila Putri',
		role: 'Pembeli unit',
		projectName: 'Azetta Residence',
		quote: 'Tim pemasaran tidak memaksa. Semua simulasi biaya dijelaskan sampai detail.',
		avatarUrl: null,
		isPublished: true,
		sortOrder: 4,
		updatedAt: at(5, 15, 0)
	},
	{
		id: 5,
		name: 'Andi Saputra',
		role: 'Mitra material',
		projectName: 'Azetta Commercial Park',
		quote: 'Koordinasi pengadaan jelas dan pembayaran sesuai jadwal.',
		avatarUrl: null,
		isPublished: false,
		sortOrder: 5,
		updatedAt: at(2, 11, 0)
	},
	{
		id: 6,
		name: 'Dewi Lestari',
		role: 'Pemilik lahan',
		projectName: 'Azetta Garden',
		quote: 'Kajian lahan dilakukan transparan, termasuk potensi kendala kontur.',
		avatarUrl: null,
		isPublished: true,
		sortOrder: 6,
		updatedAt: at(25, 9, 15)
	}
];

// ============================================================
// Audit
// ============================================================

export interface AuditLogItem {
	id: number;
	action: string;
	entityType: string;
	entityId: string;
	actorName: string | null;
	ipHash: string | null;
	before: Record<string, unknown> | null;
	after: Record<string, unknown> | null;
	createdAt: string;
}

export const auditLogs: AuditLogItem[] = [
	{
		id: 1,
		action: 'lead.status.change',
		entityType: 'Lead',
		entityId: 'ld-12',
		actorName: 'Rina Pratama',
		ipHash: 'a91f…3c2',
		before: { status: 'PROPOSAL' },
		after: { status: 'NEGOTIATION' },
		createdAt: at(2, 15, 0)
	},
	{
		id: 2,
		action: 'design.update',
		entityType: 'PropertyDesign',
		entityId: '4',
		actorName: 'Sinta Maharani',
		ipHash: 'b04e…81d',
		before: { priceFrom: 1_800_000_000 },
		after: { priceFrom: 1_850_000_000 },
		createdAt: at(1, 16, 10)
	},
	{
		id: 3,
		action: 'article.publish',
		entityType: 'Article',
		entityId: '8',
		actorName: 'Rina Pratama',
		ipHash: 'a91f…3c2',
		before: { status: 'DRAFT' },
		after: { status: 'PUBLISHED' },
		createdAt: at(2, 8, 0)
	},
	{
		id: 4,
		action: 'deletion_request.complete',
		entityType: 'AccountDeletionRequest',
		entityId: 'dr-4',
		actorName: 'Rina Pratama',
		ipHash: 'a91f…3c2',
		before: { status: 'PENDING' },
		after: { status: 'COMPLETED' },
		createdAt: at(18, 9, 15)
	},
	{
		id: 5,
		action: 'user.role.change',
		entityType: 'User',
		entityId: 'u-3',
		actorName: 'Rina Pratama',
		ipHash: 'a91f…3c2',
		before: { role: 'admin' },
		after: { role: 'super_admin' },
		createdAt: at(22, 13, 30)
	},
	{
		id: 6,
		action: 'user.disable',
		entityType: 'User',
		entityId: 'u-4',
		actorName: 'Rina Pratama',
		ipHash: 'a91f…3c2',
		before: { banned: false },
		after: { banned: true, banReason: 'Kontrak kerja berakhir.' },
		createdAt: at(34, 11, 20)
	},
	{
		id: 7,
		action: 'project.unpublish',
		entityType: 'Project',
		entityId: '5',
		actorName: 'Dimas Anggara',
		ipHash: 'c77a…9ef',
		before: { isPublished: true },
		after: { isPublished: false },
		createdAt: at(1, 9, 45)
	},
	{
		id: 8,
		action: 'faq.update',
		entityType: 'Faq',
		entityId: '7',
		actorName: 'Sinta Maharani',
		ipHash: 'b04e…81d',
		before: { isActive: true },
		after: { isActive: false },
		createdAt: at(40, 10, 0)
	},
	{
		id: 9,
		action: 'settings.update',
		entityType: 'SiteSetting',
		entityId: 'contact',
		actorName: 'Rina Pratama',
		ipHash: 'a91f…3c2',
		before: { whatsapp: '6281122334455' },
		after: { whatsapp: '6281234567890' },
		createdAt: at(27, 14, 40)
	},
	{
		id: 10,
		action: 'lead.assign',
		entityType: 'Lead',
		entityId: 'ld-09',
		actorName: 'Dimas Anggara',
		ipHash: 'c77a…9ef',
		before: { assignedToId: null },
		after: { assignedToId: 'u-2' },
		createdAt: at(3, 9, 30)
	},
	{
		id: 11,
		action: 'lead.export',
		entityType: 'Lead',
		entityId: 'export',
		actorName: 'Rina Pratama',
		ipHash: 'a91f…3c2',
		before: null,
		after: { count: 18, filter: 'status=NEW' },
		createdAt: at(1, 8, 10)
	},
	{
		id: 13,
		action: 'lead.assign',
		entityType: 'Lead',
		entityId: 'ld-02',
		actorName: 'Dimas Anggara',
		ipHash: 'c77a…9ef',
		before: { assignedToId: null },
		after: { assignedToId: 'u-2' },
		createdAt: at(0, 8, 50)
	},
	{
		id: 14,
		action: 'design.update',
		entityType: 'PropertyDesign',
		entityId: '5',
		actorName: 'Sinta Maharani',
		ipHash: 'b04e…81d',
		before: { status: 'PUBLISHED' },
		after: { status: 'DRAFT' },
		createdAt: at(0, 8, 30)
	},
	{
		id: 12,
		action: 'testimonial.publish',
		entityType: 'Testimonial',
		entityId: '5',
		actorName: 'Sinta Maharani',
		ipHash: 'b04e…81d',
		before: { isPublished: false },
		after: { isPublished: true },
		createdAt: at(2, 11, 0)
	}
];

// ============================================================
// Statistik turunan
// ============================================================

export const leadStats = {
	total: leads.length,
	new: leads.filter((lead) => lead.status === 'NEW').length,
	notContacted: leads.filter((lead) => lead.status === 'NEW' && !lead.firstContactedAt).length,
	mine: leads.filter((lead) => lead.assignedToId === currentUser.id).length,
	newToday: leads.filter((lead) => formatDateInput(lead.createdAt) === formatDateInput(MOCK_NOW))
		.length,
	staleOver24h: leads.filter(
		(lead) =>
			lead.status === 'NEW' &&
			new Date(lead.createdAt).getTime() < MOCK_NOW.getTime() - 24 * 60 * 60 * 1000
	).length,
	medianFirstResponseMinutes: 74
};

export const leadsByStatus: { status: LeadStatus; count: number }[] = (
	[
		'NEW',
		'CONTACTED',
		'QUALIFIED',
		'PROPOSAL',
		'NEGOTIATION',
		'WON',
		'LOST',
		'SPAM'
	] as LeadStatus[]
).map((status) => ({
	status,
	count: leads.filter((lead) => lead.status === status).length
}));

export const leadsByType: { type: LeadType; count: number }[] = (
	['BUY_DESIGN', 'LAND_OFFER', 'INVEST', 'GENERAL'] as LeadType[]
).map((type) => ({ type, count: leads.filter((lead) => lead.type === type).length }));

/** Tren 30 hari terakhir, dihitung dari tanggal pembuatan lead contoh. */
export const leadSeries = Array.from({ length: 30 }, (_, index) => {
	const dayOffset = 29 - index;
	const date = new Date(MOCK_NOW.getTime() - dayOffset * 24 * 60 * 60 * 1000);
	const key = formatDateInput(date);
	return {
		date: key,
		count: leads.filter((lead) => formatDateInput(lead.createdAt) === key).length
	};
});

export const upcomingFollowUps = leads
	.filter((lead) => lead.nextFollowUpAt && lead.status !== 'WON' && lead.status !== 'LOST')
	.sort((a, b) => (a.nextFollowUpAt ?? '').localeCompare(b.nextFollowUpAt ?? ''));

export function findLead(id: string): Lead | undefined {
	return leads.find((lead) => lead.id === id);
}

export function findUnit(id: number): DesignUnit | undefined {
	return units.find((unit) => unit.id === id);
}

export function findProject(id: number): ProjectItem | undefined {
	return projects.find((project) => project.id === id);
}

export function findArticle(id: number): ArticleItem | undefined {
	return articles.find((article) => article.id === id);
}

export function findStaff(id: string): StaffUser | undefined {
	return staffUsers.find((user) => user.id === id);
}
