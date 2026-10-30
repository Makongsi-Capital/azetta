/**
 * Data contoh untuk mockup tampilan publik. Bentuk field mengikuti model Prisma
 * (PropertyDesign, Project, Article, Testimonial) agar mudah diganti panggilan API.
 */

const photo = (id: string, width = 900) =>
	`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=70`;

export type UnitStatus = 'TERSEDIA' | 'INDENT' | 'TERJUAL';

export interface MockUnit {
	slug: string;
	title: string;
	project: string;
	projectSlug: string;
	type: string;
	floors: number;
	bedrooms: number;
	bathrooms: number;
	landAreaM2: number;
	buildingAreaM2: number;
	priceFrom: number;
	district: string;
	city: string;
	status: UnitStatus;
	summary: string;
	cover: string;
}

export interface MockProject {
	slug: string;
	title: string;
	location: string;
	city: string;
	status: 'SEDANG BERJALAN' | 'SELESAI';
	yearStarted: number;
	yearCompleted?: number;
	unitCount: number;
	landAreaM2: number;
	summary: string;
	cover: string;
}

export interface MockTestimonial {
	name: string;
	role: string;
	quote: string;
}

export interface MockArticle {
	slug: string;
	title: string;
	excerpt: string;
	tag: string;
	readingMinutes: number;
	updated: string;
	cover: string;
	sections: { heading: string; paragraphs: string[] }[];
}

export interface MockFaq {
	question: string;
	answer: string;
	category: string;
}

export const units: MockUnit[] = [
	{
		slug: 'azetta-residence-a1',
		title: 'Azetta Residence A1',
		project: 'Azetta Residence',
		projectSlug: 'azetta-residence',
		type: 'Tipe 45',
		floors: 2,
		bedrooms: 3,
		bathrooms: 2,
		landAreaM2: 96,
		buildingAreaM2: 90,
		priceFrom: 850_000_000,
		district: 'Tamalanrea',
		city: 'Makassar',
		status: 'TERSEDIA',
		summary:
			'Unit sudut dua lantai dengan carport dua mobil, dapur bersih terpisah, dan taman kecil di belakang.',
		cover: photo('1600596542815-ffad4c1539a9')
	},
	{
		slug: 'azetta-residence-a2',
		title: 'Azetta Residence A2',
		project: 'Azetta Residence',
		projectSlug: 'azetta-residence',
		type: 'Tipe 45',
		floors: 2,
		bedrooms: 3,
		bathrooms: 2,
		landAreaM2: 96,
		buildingAreaM2: 90,
		priceFrom: 865_000_000,
		district: 'Tamalanrea',
		city: 'Makassar',
		status: 'TERSEDIA',
		summary:
			'Tipe yang sama dengan A1, menghadap jalan lingkungan dan siap huni tanpa pekerjaan tambahan.',
		cover: photo('1600585154340-be6161a56a0c')
	},
	{
		slug: 'azetta-residence-b1',
		title: 'Azetta Residence B1',
		project: 'Azetta Residence',
		projectSlug: 'azetta-residence',
		type: 'Tipe 60',
		floors: 2,
		bedrooms: 4,
		bathrooms: 3,
		landAreaM2: 120,
		buildingAreaM2: 110,
		priceFrom: 1_200_000_000,
		district: 'Tamalanrea',
		city: 'Makassar',
		status: 'INDENT',
		summary:
			'Unit indent dengan opsi penambahan kamar di lantai dua; serah terima mengikuti progres proyek.',
		cover: photo('1600585154526-990dced4db0d')
	},
	{
		slug: 'azetta-garden-e1',
		title: 'Azetta Garden E1',
		project: 'Azetta Garden',
		projectSlug: 'azetta-garden',
		type: 'Tipe 70',
		floors: 2,
		bedrooms: 4,
		bathrooms: 3,
		landAreaM2: 140,
		buildingAreaM2: 120,
		priceFrom: 1_600_000_000,
		district: 'Panakkukang',
		city: 'Makassar',
		status: 'TERSEDIA',
		summary:
			'Unit hook dengan taman lebih luas di sisi samping, cocok untuk keluarga dengan dua kendaraan.',
		cover: photo('1512917774080-9991f1c4c750')
	},
	{
		slug: 'azetta-garden-f2',
		title: 'Azetta Garden F2',
		project: 'Azetta Garden',
		projectSlug: 'azetta-garden',
		type: 'Tipe 90',
		floors: 2,
		bedrooms: 4,
		bathrooms: 4,
		landAreaM2: 180,
		buildingAreaM2: 150,
		priceFrom: 2_400_000_000,
		district: 'Panakkukang',
		city: 'Makassar',
		status: 'TERJUAL',
		summary: 'Unit terbesar di klaster; sudah terjual dan ditampilkan sebagai gambaran tipe 90.',
		cover: photo('1613490493576-7fde63acd811')
	},
	{
		slug: 'griya-biringkanaya-c1',
		title: 'Griya Biringkanaya C1',
		project: 'Griya Biringkanaya',
		projectSlug: 'griya-biringkanaya',
		type: 'Tipe 36',
		floors: 1,
		bedrooms: 2,
		bathrooms: 1,
		landAreaM2: 72,
		buildingAreaM2: 60,
		priceFrom: 520_000_000,
		district: 'Biringkanaya',
		city: 'Makassar',
		status: 'TERSEDIA',
		summary: 'Tipe 36 satu lantai untuk keluarga kecil, berada di lingkungan yang sudah dihuni.',
		cover: photo('1570129477492-45c003edd2be')
	},
	{
		slug: 'griya-biringkanaya-d1',
		title: 'Griya Biringkanaya D1',
		project: 'Griya Biringkanaya',
		projectSlug: 'griya-biringkanaya',
		type: 'Tipe 45',
		floors: 1,
		bedrooms: 3,
		bathrooms: 2,
		landAreaM2: 90,
		buildingAreaM2: 78,
		priceFrom: 640_000_000,
		district: 'Biringkanaya',
		city: 'Makassar',
		status: 'INDENT',
		summary:
			'Tipe 45 satu lantai dengan ruang keluarga terbuka ke teras belakang, tersedia secara indent.',
		cover: photo('1568605114967-8130f3a36994')
	},
	{
		slug: 'griya-biringkanaya-c2',
		title: 'Griya Biringkanaya C2',
		project: 'Griya Biringkanaya',
		projectSlug: 'griya-biringkanaya',
		type: 'Tipe 36',
		floors: 1,
		bedrooms: 2,
		bathrooms: 1,
		landAreaM2: 72,
		buildingAreaM2: 60,
		priceFrom: 535_000_000,
		district: 'Biringkanaya',
		city: 'Makassar',
		status: 'TERSEDIA',
		summary: 'Tipe 36 dengan posisi dekat taman lingkungan, siap huni dan sudah berlistrik.',
		cover: photo('1600047509807-ba8f99d2cdde')
	}
];

export const featuredUnits = units.filter((unit) => unit.status !== 'TERJUAL').slice(0, 6);

export const projects: MockProject[] = [
	{
		slug: 'azetta-residence',
		title: 'Azetta Residence',
		location: 'Tamalanrea',
		city: 'Makassar',
		status: 'SEDANG BERJALAN',
		yearStarted: 2025,
		unitCount: 24,
		landAreaM2: 12_000,
		summary:
			'Dua puluh empat unit rumah tapak dua lantai. Tahap pertama sudah struktur, tahap dua menyusul kuartal berikutnya.',
		cover: photo('1541888946425-d81bb19240f5')
	},
	{
		slug: 'azetta-garden',
		title: 'Azetta Garden',
		location: 'Panakkukang',
		city: 'Makassar',
		status: 'SEDANG BERJALAN',
		yearStarted: 2025,
		unitCount: 12,
		landAreaM2: 7_500,
		summary:
			'Dua belas unit dengan taman lingkungan di tengah klaster, progres di tahap finishing fasad.',
		cover: photo('1605276374104-dee2a0ed3cd6')
	},
	{
		slug: 'griya-biringkanaya',
		title: 'Griya Biringkanaya',
		location: 'Biringkanaya',
		city: 'Makassar',
		status: 'SELESAI',
		yearStarted: 2022,
		yearCompleted: 2024,
		unitCount: 18,
		landAreaM2: 9_000,
		summary: 'Delapan belas unit rumah tapak, seluruhnya terjual dan sudah dihuni.',
		cover: photo('1564013799919-ab600027ffc6')
	},
	{
		slug: 'kavling-terpadu-gowa',
		title: 'Kavling Terpadu Gowa',
		location: 'Somba Opu',
		city: 'Gowa',
		status: 'SELESAI',
		yearStarted: 2023,
		yearCompleted: 2025,
		unitCount: 16,
		landAreaM2: 14_000,
		summary: 'Kavling siap bangun dengan jalan lingkungan dan jaringan air terpasang.',
		cover: photo('1449844908441-8829872d2607')
	}
];

export const testimonials: MockTestimonial[] = [
	{
		name: 'Andi Rahmat',
		role: 'Pemilik Azetta Residence A1',
		quote:
			'Spesifikasi yang dikirim sesuai dengan unit yang kami terima. Progres dilaporkan tiap bulan tanpa perlu menagih.'
	},
	{
		name: 'Sari Wulandari',
		role: 'Pemilik lahan, Gowa',
		quote:
			'Skema bagi hasil dijelaskan terbuka, termasuk biaya yang menjadi beban kami dan yang tidak. Tidak ada angka yang berubah di tengah jalan.'
	},
	{
		name: 'Budi Santoso',
		role: 'Pembeli unit Tipe 60',
		quote:
			'Saya minta denah dan legalitas lebih dulu sebelum membayar. Tim Azetta mengirimkannya lengkap dalam dua hari kerja.'
	}
];

export const articles: MockArticle[] = [
	{
		slug: 'kerja-sama-lahan-dengan-developer',
		title: 'Kerja Sama Lahan dengan Developer: Skema, Syarat, dan Hal yang Perlu Diperiksa',
		excerpt:
			'Sebelum menandatangani apa pun: pahami bentuk kerja sama, siapa menanggung biaya, dan dokumen apa yang wajib Anda pegang.',
		tag: 'Lahan',
		readingMinutes: 9,
		updated: '14 Januari 2026',
		cover: photo('1580587771525-78b9dba3b914'),
		sections: [
			{
				heading: 'Tiga bentuk kerja sama yang umum',
				paragraphs: [
					'Pertama, lahan dibeli developer dengan harga tetap. Pemilik lahan menerima uang, kepemilikan berpindah, dan riset pasar menjadi tanggungan developer. Kedua, lahan menjadi penyertaan modal: pemilik menerima bagian dari hasil penjualan unit setelah biaya pembangunan dikembalikan.',
					'Ketiga, developer hanya menerima fee pengelolaan, sementara modal dan risiko sepenuhnya ada pada pemilik lahan. Setiap bentuk punya konsekuensi berbeda pada arus kas dan pajak, jadi pilih yang paling sesuai dengan kebutuhan Anda, bukan yang paling cepat menawarkan angka besar.'
				]
			},
			{
				heading: 'Yang harus ada di dalam perjanjian',
				paragraphs: [
					'Perjanjian perlu menyebut objek lahan secara lengkap, jangka waktu, pembagian hasil, siapa menanggung biaya perizinan, dan apa yang terjadi bila proyek berhenti di tengah jalan. Tanpa klausul penghentian, pemilik lahan sulit meminta pertanggungjawaban.',
					'Minta pula mekanisme pelaporan progres dan akses pemeriksaan. Bila developer tidak bisa menunjukkan laporan berkala, itu tanda tata kelola proyeknya belum siap.'
				]
			},
			{
				heading: 'Dokumen yang wajib Anda pegang',
				paragraphs: [
					'Sertifikat asli tetap di tangan pemilik sampai ada peralihan hak yang sah. Simpan salinan perjanjian bertanda tangan, bukti pembayaran, dan dokumen perizinan yang menyebut lahan Anda sebagai objek.',
					'Sebelum menandatangani, minta waktu untuk membaca ulang bersama penasihat hukum. Tidak ada kesepakatan yang sedemikian mendesak sampai tidak boleh ditinjau.'
				]
			}
		]
	},
	{
		slug: 'estimasi-biaya-bangun-rumah-2-lantai',
		title: 'Estimasi Biaya Bangun Rumah 2 Lantai 6×12 (Rincian 2026)',
		excerpt:
			'Rincian komponen biaya dari pondasi sampai finishing, beserta kisaran yang wajar untuk tiap tahap pekerjaan.',
		tag: 'Biaya',
		readingMinutes: 7,
		updated: '2 Februari 2026',
		cover: photo('1600607687939-ce8a6c25118c'),
		sections: [
			{
				heading: 'Komponen biaya dari pondasi ke finishing',
				paragraphs: [
					'Rumah dua lantai 6×12 meter dengan luas bangunan sekitar 120 m² biasanya dipecah menjadi pekerjaan persiapan, pondasi dan struktur, dinding serta atap, instalasi mekanikal-elektrikal, dan finishing. Porsi struktur adalah yang paling sulit dikurangi setelah pekerjaan dimulai.',
					'Biaya per meter persegi bukan angka tunggal: spesifikasi atap, jenis kusen, dan pilihan lantai mengubah hasil akhir cukup jauh. Karena itu, bandingkan penawaran pada spesifikasi yang sama, bukan pada angka totalnya saja.'
				]
			},
			{
				heading: 'Cara membaca kisaran harga per meter',
				paragraphs: [
					'Kisaran harga biasanya mencakup pekerjaan standar: pondasi batu kali atau tiang pancang dangkal, dinding bata ringan, atap baja ringan, dan finishing keramik ukuran standar. Di luar itu, biaya bertambah.',
					'Jika penawaran jauh lebih murah dari kisaran umum, periksa apa yang tidak termasuk: kusen, pengecatan luar, pagar, atau saluran drainase. Selisih kecil di awal sering menjadi biaya besar di akhir.'
				]
			},
			{
				heading: 'Pos biaya yang sering terlewat',
				paragraphs: [
					'Biaya perizinan, sambungan listrik dan air, pengurugan tanah, serta pengelolaan sisa material jarang muncul di penawaran awal. Siapkan cadangan sekitar sepuluh persen dari nilai kontrak untuk pos-pos ini.'
				]
			}
		]
	},
	{
		slug: 'hal-yang-perlu-dicek-sebelum-membeli-rumah-baru',
		title: '7 Hal yang Perlu Dicek Sebelum Membeli Rumah Baru',
		excerpt:
			'Dari sertifikat dan izin sampai kualitas drainase — daftar periksa singkat sebelum Anda membayar tanda jadi.',
		tag: 'Rumah',
		readingMinutes: 6,
		updated: '20 Maret 2026',
		cover: photo('1592595896551-12b371d546d5'),
		sections: [
			{
				heading: 'Legalitas dan status tanah',
				paragraphs: [
					'Pastikan sertifikat sesuai dengan lokasi dan luas yang ditawarkan, serta tidak sedang dijaminkan. Untuk rumah indent, tanyakan izin yang sudah terbit dan nomor persetujuan bangunan gedung.',
					'Cek juga status unit: tersedia, indent, atau sudah terjual. Status yang berubah-ubah tanpa penjelasan tertulis adalah tanda pencatatan penjualan belum rapi.'
				]
			},
			{
				heading: 'Kualitas bangunan dan lingkungan',
				paragraphs: [
					'Lihat unit contoh atau unit yang sudah selesai, bukan hanya render. Perhatikan kemiringan lantai basah, sambungan atap, dan jalur air hujan. Saat hujan, periksa apakah air menggenang di jalan lingkungan.',
					'Tanyakan rencana pengembangan tahap berikutnya. Lahan kosong di sebelah unit bisa berubah menjadi bangunan lain yang mengubah akses dan pandangan.'
				]
			},
			{
				heading: 'Hal administratif setelah akad',
				paragraphs: [
					'Setelah akad, dokumen yang perlu Anda simpan: perjanjian pengikatan jual beli, sertifikat atau akta, bukti pembayaran pajak, dan berita acara serah terima. Pastikan nama pada semua dokumen sama.',
					'Untuk pembelian melalui KPR, minta jadwal pencairan dan daftar dokumen yang harus Anda lengkapi agar tidak ada penundaan di akhir.'
				]
			}
		]
	}
];

/** Foto interior contoh untuk galeri detail unit. */
export const interiorPhotos = [
	photo('1600607687939-ce8a6c25118c'),
	photo('1600585154526-990dced4db0d'),
	photo('1580587771525-78b9dba3b914'),
	photo('1592595896551-12b371d546d5')
];

export const findUnit = (slug: string) => units.find((unit) => unit.slug === slug);

export const findArticle = (slug: string) => articles.find((article) => article.slug === slug);

export const findProject = (slug: string) => projects.find((project) => project.slug === slug);

export const unitsOfProject = (projectSlug: string) =>
	units.filter((unit) => unit.projectSlug === projectSlug);

export const relatedUnitsOf = (unit: MockUnit, limit = 3) =>
	[
		...unitsOfProject(unit.projectSlug).filter((item) => item.slug !== unit.slug),
		...units.filter((item) => item.projectSlug !== unit.projectSlug)
	].slice(0, limit);

export const faqs: MockFaq[] = [
	{
		category: 'Umum',
		question: 'Apa saja layanan Azetta?',
		answer:
			'Azetta menjual unit rumah tapak dari proyek sendiri dan menerima kerja sama lahan, baik lahan dibeli maupun dibangun bersama. Informasi investasi tersedia sebagai keterbukaan informasi, bukan penawaran efek.'
	},
	{
		category: 'Umum',
		question: 'Di mana lokasi proyek Azetta?',
		answer:
			'Proyek yang ditampilkan berada di Makassar dan sekitarnya. Setiap halaman proyek mencantumkan kecamatan dan kota agar Anda bisa menilai aksesnya.'
	},
	{
		category: 'Rumah',
		question: 'Apa arti status Tersedia, Indent, dan Terjual?',
		answer:
			'Tersedia berarti unit siap ditinjau dan dipesan. Indent berarti unit dibangun setelah pemesanan. Terjual berarti unit sudah memiliki pemesan; halaman tetap ditampilkan sebagai gambaran tipe.'
	},
	{
		category: 'Rumah',
		question: 'Apakah harga di situs sudah final?',
		answer:
			'Tidak. Harga yang ditampilkan adalah harga mulai dari per tipe dan bersifat indikatif. Harga final, skema pembayaran, dan jadwal serah terima ditulis dalam kesepakatan.'
	},
	{
		category: 'Rumah',
		question: 'Bisakah saya mengubah spesifikasi?',
		answer:
			'Perubahan material dapat diminta sebelum pekerjaan struktur dimulai. Setelah itu, perubahan hanya dimungkinkan untuk pekerjaan finishing tertentu dan akan memengaruhi harga.'
	},
	{
		category: 'Lahan',
		question: 'Lahan seperti apa yang cocok dikerjasamakan?',
		answer:
			'Lahan dengan akses jalan yang bisa dilalui kendaraan, status kepemilikan jelas, dan luas yang memadai untuk beberapa unit. Kajian awal gratis dan tidak mengikat.'
	},
	{
		category: 'Lahan',
		question: 'Berapa lama proses kajian lahan?',
		answer:
			'Kajian awal memerlukan sekitar satu sampai dua minggu setelah dokumen dan foto lahan diterima. Hasilnya berupa rekomendasi skema, bukan keputusan final.'
	},
	{
		category: 'Investasi',
		question: 'Apakah Azetta menawarkan surat berharga?',
		answer:
			'Tidak. Situs ini hanya memuat keterbukaan informasi perusahaan dan proyek. Pendanaan proyek berjalan melalui hubungan manajemen di luar situs dan tidak dipasarkan sebagai produk investasi.'
	}
];
