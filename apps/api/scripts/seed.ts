/**
 * Seed data demo untuk pengembangan lokal.
 * Jalankan: bun --env-file=../../.env scripts/seed.ts (dari apps/api)
 */
import { prisma } from '../src/lib/prisma';
import { auth } from '../src/lib/auth';

const ADMIN_EMAIL = 'admin@azetta.id';
const ADMIN_PASSWORD = 'Admin12345!';

const daysAgo = (days: number, hour = 9) => {
	const date = new Date();
	date.setDate(date.getDate() - days);
	date.setHours(hour, 0, 0, 0);
	return date;
};

async function ensureUser(email: string, password: string, name: string, role: string) {
	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) {
		return prisma.user.update({
			where: { email },
			data: { role, emailVerified: true, name }
		});
	}
	const result = await auth.api.signUpEmail({ body: { email, password, name } });
	return prisma.user.update({
		where: { id: result.user.id },
		data: { role, emailVerified: true }
	});
}

async function main() {
	const superAdmin = await ensureUser(ADMIN_EMAIL, ADMIN_PASSWORD, 'Rina Pratama', 'super_admin');
	await ensureUser('dimas@azetta.id', 'Admin12345!', 'Dimas Anggara', 'admin');
	const customer = await ensureUser(
		'budi@example.com',
		'Customer12345!',
		'Budi Santoso',
		'customer'
	);

	await prisma.siteSetting.upsert({
		where: { key: 'brand' },
		update: {},
		create: {
			key: 'brand',
			value: {
				name: 'Azetta',
				tagline: 'Rumah tapak, kerja sama lahan, dan proyek properti.',
				whatsapp: '6281234567890',
				email: 'halo@azetta.id'
			},
			updatedById: superAdmin.id
		}
	});

	const projects = [
		{
			slug: 'azetta-residence',
			title: 'Azetta Residence',
			summary: 'Cluster 24 unit di Sleman Utara dengan konsep hunian tropis.',
			location: 'Jl. Kaliurang KM 9',
			city: 'Sleman',
			province: 'DI Yogyakarta',
			status: 'ONGOING' as const,
			yearStarted: 2024,
			landAreaM2: 4800,
			unitCount: 24,
			coverImageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
			galleryUrls: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'],
			isPublished: true,
			sortOrder: 1
		},
		{
			slug: 'azetta-garden',
			title: 'Azetta Garden',
			summary: 'Dua belas unit dengan taman lingkungan di tengah klaster.',
			location: 'Jl. Palagan KM 7',
			city: 'Sleman',
			province: 'DI Yogyakarta',
			status: 'ONGOING' as const,
			yearStarted: 2025,
			landAreaM2: 3200,
			unitCount: 12,
			coverImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
			galleryUrls: [],
			isPublished: true,
			sortOrder: 2
		},
		{
			slug: 'azetta-signature',
			title: 'Azetta Signature',
			summary: 'Hunian premium 12 unit di kawasan Ngaglik.',
			location: 'Jl. Palagan KM 12',
			city: 'Sleman',
			province: 'DI Yogyakarta',
			status: 'PLANNED' as const,
			yearStarted: 2026,
			landAreaM2: 2600,
			unitCount: 12,
			coverImageUrl: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde',
			galleryUrls: [],
			isPublished: false,
			sortOrder: 3
		}
	];

	for (const project of projects) {
		await prisma.project.upsert({
			where: { slug: project.slug },
			update: {},
			create: { ...project, createdById: superAdmin.id }
		});
	}

	const designCount = await prisma.propertyDesign.count();
	if (designCount === 0) {
		const designs = [
			{
				slug: 'azetta-residence-a1',
				title: 'Azetta Residence A1',
				subtitle: 'Tipe 45 dengan taman belakang',
				description:
					'<p>Unit dua lantai dengan ruang keluarga terbuka dan taman belakang 12 m2. Cocok untuk keluarga muda yang membutuhkan ruang kerja di rumah.</p>',
				category: 'RESIDENTIAL' as const,
				style: 'Modern tropis',
				floors: 2,
				bedrooms: 3,
				bathrooms: 2,
				carports: 1,
				buildingAreaM2: 90,
				landAreaMinM2: 96,
				estimatedBuildCostMin: 720_000_000n,
				estimatedBuildCostMax: 850_000_000n,
				priceFrom: 850_000_000n,
				status: 'PUBLISHED' as const,
				featured: true,
				publishedAt: daysAgo(120),
				seoTitle: 'Azetta Residence A1 — Tipe 45',
				seoDescription: 'Unit tipe 45 dua lantai di Sleman Utara.'
			},
			{
				slug: 'azetta-residence-b2',
				title: 'Azetta Residence B2',
				subtitle: 'Tipe 54 corner',
				description:
					'<p>Unit sudut dengan carport dua mobil, dapur terbuka, dan balkon utama menghadap taman cluster.</p>',
				category: 'RESIDENTIAL' as const,
				style: 'Minimalis',
				floors: 2,
				bedrooms: 4,
				bathrooms: 3,
				carports: 2,
				buildingAreaM2: 110,
				landAreaMinM2: 120,
				estimatedBuildCostMin: 950_000_000n,
				estimatedBuildCostMax: 1_100_000_000n,
				priceFrom: 1_250_000_000n,
				status: 'PUBLISHED' as const,
				featured: false,
				publishedAt: daysAgo(80),
				seoTitle: 'Azetta Residence B2 — Tipe 54',
				seoDescription: 'Unit tipe 54 corner di Azetta Residence.'
			},
			{
				slug: 'azetta-garden-c1',
				title: 'Azetta Garden C1',
				subtitle: 'Draf tipe 36',
				description: '<p>Rumah satu lantai untuk pasangan muda dengan taman depan.</p>',
				category: 'RESIDENTIAL' as const,
				style: 'Skandinavia',
				floors: 1,
				bedrooms: 2,
				bathrooms: 1,
				carports: 1,
				buildingAreaM2: 36,
				landAreaMinM2: 72,
				priceFrom: 620_000_000n,
				status: 'DRAFT' as const,
				featured: false
			}
		];

		for (const design of designs) {
			const created = await prisma.propertyDesign.create({ data: design });
			await prisma.propertyDesignMedia.createMany({
				data: [
					{
						designId: created.id,
						url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
						storageKey: 'seed/cover-1',
						alt: 'Tampak depan unit',
						isCover: true,
						sortOrder: 0
					},
					{
						designId: created.id,
						url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
						storageKey: 'seed/gallery-1',
						alt: 'Ruang keluarga',
						isCover: false,
						sortOrder: 1
					}
				]
			});
			const tag = await prisma.designTag.upsert({
				where: { slug: 'modern' },
				update: {},
				create: { slug: 'modern', name: 'Modern' }
			});
			await prisma.designTagOnDesign.create({ data: { designId: created.id, tagId: tag.id } });
		}
	}

	// Tautkan unit contoh ke proyeknya agar halaman publik punya konteks proyek dan kota.
	const projectIds = new Map(
		(await prisma.project.findMany({ select: { id: true, slug: true } })).map((project) => [
			project.slug,
			project.id
		])
	);
	const designProject: Record<string, string> = {
		'azetta-residence-a1': 'azetta-residence',
		'azetta-residence-b2': 'azetta-residence',
		'azetta-garden-c1': 'azetta-garden'
	};
	for (const [designSlug, projectSlug] of Object.entries(designProject)) {
		const projectId = projectIds.get(projectSlug);
		if (!projectId) continue;
		await prisma.propertyDesign.updateMany({
			where: { slug: designSlug, projectId: null },
			data: { projectId }
		});
	}

	const articleCount = await prisma.article.count();
	if (articleCount === 0) {
		await prisma.article.createMany({
			data: [
				{
					slug: 'panduan-memilih-rumah-pertama',
					title: 'Panduan memilih rumah pertama tanpa menyesal',
					excerpt: 'Lima hal yang perlu diperiksa sebelum membayar tanda jadi.',
					content:
						'<h2>Mulai dari kebutuhan</h2><p>Sebelum melihat unit, tuliskan kebutuhan ruang keluarga Anda untuk lima tahun ke depan.</p>',
					status: 'PUBLISHED',
					publishedAt: daysAgo(9),
					readingMinutes: 7,
					tags: ['panduan', 'pembeli'],
					authorId: superAdmin.id
				},
				{
					slug: 'skema-kerja-sama-lahan',
					title: 'Skema kerja sama lahan: bagi hasil, sewa, atau jual',
					excerpt: 'Memahami tiga skema yang umum dipakai pemilik lahan.',
					content: '<p>Setiap skema memiliki konsekuensi pajak dan risiko yang berbeda.</p>',
					status: 'DRAFT',
					tags: ['lahan'],
					authorId: superAdmin.id
				}
			]
		});
	}

	if ((await prisma.faq.count()) === 0) {
		await prisma.faq.createMany({
			data: [
				{
					question: 'Apakah harga unit sudah termasuk PPN dan biaya notaris?',
					answer:
						'Harga yang tampil adalah harga dasar unit. PPN, BPHTB, dan biaya notaris dihitung terpisah.',
					category: 'pembelian',
					sortOrder: 1
				},
				{
					question: 'Berapa lama proses serah terima setelah akad?',
					answer: 'Serah terima dilakukan paling lambat 14 hari kerja setelah pelunasan.',
					category: 'pembelian',
					sortOrder: 2
				},
				{
					question: 'Apakah Azetta menerima kerja sama lahan?',
					answer: 'Ya. Kami membuka skema bagi hasil, sewa, dan jual putus.',
					category: 'lahan',
					sortOrder: 1
				}
			]
		});
	}

	if ((await prisma.testimonial.count()) === 0) {
		await prisma.testimonial.createMany({
			data: [
				{
					name: 'Rudi Hartono',
					role: 'Pemilik lahan',
					projectName: 'Azetta Residence',
					quote: 'Proses verifikasi lahan rapi dan komunikasi tiap tahap jelas.',
					isPublished: true,
					sortOrder: 1
				},
				{
					name: 'Lina Permata',
					role: 'Pembeli unit',
					projectName: 'Azetta Signature',
					quote: 'Laporan progres berkala membuat kami tenang tanpa datang tiap minggu.',
					isPublished: true,
					sortOrder: 2
				}
			]
		});
	}

	if ((await prisma.lead.count()) === 0) {
		const design = await prisma.propertyDesign.findFirst({ where: { status: 'PUBLISHED' } });
		const seedLeads = [
			{
				type: 'BUY_DESIGN' as const,
				status: 'NEW' as const,
				priority: 'HIGH' as const,
				name: 'Budi Santoso',
				phone: '081298765432',
				email: 'budi@example.com',
				city: 'Bandung',
				message: 'Apakah unit A1 masih tersedia? Bisa KPR?',
				userId: customer.id,
				designId: design?.id ?? null,
				createdAt: daysAgo(1)
			},
			{
				type: 'LAND_OFFER' as const,
				status: 'CONTACTED' as const,
				priority: 'NORMAL' as const,
				name: 'Sari Wulandari',
				phone: '081234567890',
				email: 'sari@example.com',
				city: 'Sleman',
				message: 'Lahan dekat ring road utara, terbuka untuk bagi hasil.',
				createdAt: daysAgo(3),
				firstContactedAt: daysAgo(2)
			},
			{
				type: 'GENERAL' as const,
				status: 'QUALIFIED' as const,
				priority: 'URGENT' as const,
				name: 'Maya Kartika',
				phone: '082112345678',
				city: 'Surabaya',
				message: 'Ingin info proyek yang siap huni tahun depan.',
				createdAt: daysAgo(5),
				firstContactedAt: daysAgo(4)
			},
			{
				type: 'BUY_DESIGN' as const,
				status: 'WON' as const,
				priority: 'NORMAL' as const,
				name: 'Dewi Lestari',
				phone: '081377788899',
				city: 'Yogyakarta',
				message: 'Sudah survei, ingin lanjut akad.',
				createdAt: daysAgo(20),
				firstContactedAt: daysAgo(19),
				closedAt: daysAgo(6)
			},
			{
				type: 'LAND_OFFER' as const,
				status: 'NEW' as const,
				priority: 'LOW' as const,
				name: 'Taufik Hidayat',
				phone: '085266677788',
				city: 'Bantul',
				message: 'Menawarkan lahan 1.200 m2 dekat jalan provinsi.',
				createdAt: daysAgo(7)
			}
		];

		for (const [index, lead] of seedLeads.entries()) {
			const prefix = { BUY_DESIGN: 'DS', LAND_OFFER: 'LD', INVEST: 'IV', GENERAL: 'GN' }[lead.type];
			await prisma.lead.create({
				data: {
					...lead,
					reference: `AZT-${prefix}-2611-SEED${index}`,
					phoneNormalized: lead.phone.replace(/\D/g, '').replace(/^0/, '62'),
					source: 'WEBSITE',
					assignedToId: index === 0 ? superAdmin.id : null,
					nextFollowUpAt: index < 2 ? daysAgo(-2, 10) : null,
					activities: {
						create: {
							type: 'SYSTEM',
							body: 'Lead dibuat dari formulir situs.',
							actorId: superAdmin.id
						}
					}
				}
			});
		}
	}

	if ((await prisma.accountDeletionRequest.count()) === 0) {
		await prisma.accountDeletionRequest.create({
			data: {
				userId: customer.id,
				reason: 'Tidak lagi menggunakan layanan dan ingin menghapus data pribadi.'
			}
		});
	}

	console.info(`Seed selesai. Login admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
}

await main();
await prisma.$disconnect();
