import { interiorPhotos, units } from './site.js';

export type MilestoneStatus = 'SELESAI' | 'BERJALAN' | 'RENCANA';
export type PaymentStatus = 'LUNAS' | 'JATUH TEMPO' | 'AKAN DATANG';

export interface MockMilestone {
	label: string;
	date: string;
	status: MilestoneStatus;
	note?: string;
}

export interface MockPayment {
	label: string;
	amount: number;
	dueDate: string;
	status: PaymentStatus;
}

export interface MockDocument {
	name: string;
	updatedAt: string;
	available: boolean;
}

export interface MockOwnedUnit {
	id: string;
	unitSlug: string;
	projectSlug: string;
	unitTitle: string;
	projectTitle: string;
	location: string;
	stage: string;
	progress: number;
	startedAt: string;
	handoverTarget: string;
	price: number;
	cover: string;
	gallery: string[];
	milestones: MockMilestone[];
	payments: MockPayment[];
	documents: MockDocument[];
	pic: { name: string; role: string; email: string };
}

export interface MockSubmission {
	id: string;
	kind: 'Unit' | 'Lahan';
	title: string;
	status: 'KAJIAN' | 'DIHUBUNGI' | 'SELESAI';
	submittedAt: string;
	note: string;
}

export const account = {
	name: 'Andi Rahmat',
	email: 'andi.rahmat@email.com',
	memberSince: 'September 2025'
};

const coverOf = (slug: string) => units.find((unit) => unit.slug === slug)?.cover ?? '';

export const ownedUnits: MockOwnedUnit[] = [
	{
		id: 'azetta-residence-a1',
		unitSlug: 'azetta-residence-a1',
		projectSlug: 'azetta-residence',
		unitTitle: 'Azetta Residence A1',
		projectTitle: 'Azetta Residence',
		location: 'Tamalanrea, Makassar',
		stage: 'Dinding & atap lantai 2',
		progress: 62,
		startedAt: '12 September 2025',
		handoverTarget: 'Juni 2026',
		price: 850_000_000,
		cover: coverOf('azetta-residence-a1'),
		gallery: [coverOf('azetta-residence-a1'), ...interiorPhotos].slice(0, 3),
		milestones: [
			{ label: 'Akad & booking', date: '12 Sep 2025', status: 'SELESAI' },
			{ label: 'Pondasi & struktur lantai 1', date: '5 Des 2025', status: 'SELESAI' },
			{ label: 'Struktur lantai 2', date: '18 Feb 2026', status: 'SELESAI' },
			{
				label: 'Dinding & atap',
				date: '10 Apr 2026',
				status: 'BERJALAN',
				note: 'Progres 62% — menunggu penutup atap.'
			},
			{ label: 'Finishing & MEP', date: 'Mei 2026', status: 'RENCANA' },
			{ label: 'Serah terima', date: 'Juni 2026', status: 'RENCANA' }
		],
		payments: [
			{ label: 'Termin 1 — DP 10%', amount: 85_000_000, dueDate: '12 Sep 2025', status: 'LUNAS' },
			{ label: 'Termin 2 — 30%', amount: 255_000_000, dueDate: '20 Nov 2025', status: 'LUNAS' },
			{
				label: 'Termin 3 — 40%',
				amount: 340_000_000,
				dueDate: '15 Apr 2026',
				status: 'JATUH TEMPO'
			},
			{
				label: 'Termin 4 — 20% & akad',
				amount: 170_000_000,
				dueDate: '10 Jun 2026',
				status: 'AKAN DATANG'
			}
		],
		documents: [
			{ name: 'Perjanjian Pengikatan Jual Beli', updatedAt: '12 Sep 2025', available: true },
			{ name: 'Denah & spesifikasi teknis', updatedAt: '2 Okt 2025', available: true },
			{ name: 'Kuitansi termin 1–2', updatedAt: '5 Jan 2026', available: true },
			{ name: 'Sertifikat', updatedAt: '—', available: false }
		],
		pic: { name: 'Nurul Fadilah', role: 'Customer relations', email: 'azettaidofficial@gmail.com' }
	},
	{
		id: 'griya-biringkanaya-c1',
		unitSlug: 'griya-biringkanaya-c1',
		projectSlug: 'griya-biringkanaya',
		unitTitle: 'Griya Biringkanaya C1',
		projectTitle: 'Griya Biringkanaya',
		location: 'Biringkanaya, Makassar',
		stage: 'Sudah dihuni',
		progress: 100,
		startedAt: '18 Maret 2024',
		handoverTarget: 'Selesai 14 Feb 2025',
		price: 520_000_000,
		cover: coverOf('griya-biringkanaya-c1'),
		gallery: [coverOf('griya-biringkanaya-c1'), ...interiorPhotos].slice(0, 3),
		milestones: [
			{ label: 'Akad & booking', date: '18 Mar 2024', status: 'SELESAI' },
			{ label: 'Pondasi & struktur', date: '2 Jul 2024', status: 'SELESAI' },
			{ label: 'Dinding, atap & MEP', date: '20 Nov 2024', status: 'SELESAI' },
			{ label: 'Finishing', date: '8 Jan 2025', status: 'SELESAI' },
			{ label: 'Serah terima', date: '14 Feb 2025', status: 'SELESAI' }
		],
		payments: [
			{ label: 'Termin 1 — DP 10%', amount: 52_000_000, dueDate: '18 Mar 2024', status: 'LUNAS' },
			{ label: 'Termin 2 — 40%', amount: 208_000_000, dueDate: '2 Jul 2024', status: 'LUNAS' },
			{ label: 'Termin 3 — 30%', amount: 156_000_000, dueDate: '20 Nov 2024', status: 'LUNAS' },
			{
				label: 'Termin 4 — 20% & akad',
				amount: 104_000_000,
				dueDate: '14 Feb 2025',
				status: 'LUNAS'
			}
		],
		documents: [
			{ name: 'Perjanjian Pengikatan Jual Beli', updatedAt: '18 Mar 2024', available: true },
			{ name: 'Sertifikat & akta jual beli', updatedAt: '20 Feb 2025', available: true },
			{ name: 'Berita acara serah terima', updatedAt: '14 Feb 2025', available: true }
		],
		pic: { name: 'Nurul Fadilah', role: 'Customer relations', email: 'azettaidofficial@gmail.com' }
	}
];

export const submissions: MockSubmission[] = [
	{
		id: 'SUB-2026-014',
		kind: 'Lahan',
		title: 'Lahan 800 m², Somba Opu, Gowa',
		status: 'KAJIAN',
		submittedAt: '2 Mar 2026',
		note: 'Survei lokasi dijadwalkan pekan ini.'
	},
	{
		id: 'SUB-2026-003',
		kind: 'Unit',
		title: 'Pertanyaan unit Azetta Garden E1',
		status: 'SELESAI',
		submittedAt: '18 Jan 2026',
		note: 'Sudah dijawab tim sales pada 19 Jan 2026.'
	}
];

export const findOwnedUnit = (id: string) => ownedUnits.find((unit) => unit.id === id);
