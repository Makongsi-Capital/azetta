# 10 — Strategi SEO & Konten

> Kembali ke [index](./README.md) · Sebelumnya: [09](./09-qa-test-plan.md) · Berikutnya: [11](./11-deployment-operations.md)

---

## 1. Tujuan

| # | Tujuan | Target 3 bulan | Target 6 bulan |
|---|--------|----------------|----------------|
| SEO-1 | Trafik organik | 1.000 sesi/bulan | 4.000 sesi/bulan |
| SEO-2 | Lead dari organik | 25/bulan | 100/bulan |
| SEO-3 | Halaman terindeks | 25 | 60 |
| SEO-4 | Peringkat 10 besar untuk 10 kata kunci utama | 3 kata kunci | 8 kata kunci |

**Kondisi awal:** domain baru, tanpa otoritas, tanpa konten. Ini berarti SEO adalah investasi 3–6 bulan, bukan kanal instan. Kanal berbayar & sosial tetap diperlukan untuk 90 hari pertama.

## 2. Riset kata kunci

Dikelompokkan per niat pencarian agar setiap klaster punya halaman tujuan yang jelas.

### 2.1 Klaster A — Desain (volume tertinggi, kompetisi sedang–tinggi)

| Kata kunci | Niat | Halaman tujuan | Prioritas |
|------------|------|----------------|:---------:|
| desain rumah minimalis 2 lantai | Informasi/komersial | `/desain/[slug]` (desain terkait) | Tinggi |
| desain rumah 6x12 2 lantai | Komersial | detail desain dengan lahan 72 m² | Tinggi |
| desain rumah 7x12 | Komersial | detail desain | Sedang |
| desain rumah type 36 / 45 / 70 | Komersial | filter katalog + artikel | Sedang |
| desain rumah tropis modern | Komersial | detail desain + artikel | Sedang |
| desain ruko minimalis 2 lantai | Komersial | detail desain komersial | Sedang |
| desain rumah kecil 2 lantai | Informasi | artikel + katalog | Rendah |
| jasa desain rumah custom | Transaksi (lead) | `/desain` + form | Tinggi |

### 2.2 Klaster B — Kerja sama lahan (volume rendah, nilai tinggi)

| Kata kunci | Niat | Halaman tujuan | Prioritas |
|------------|------|----------------|:---------:|
| kerja sama lahan dengan developer | Komersial | `/kerjasama-lahan` | **Sangat tinggi** |
| bagi hasil tanah dengan developer | Komersial | `/kerjasama-lahan` | Sangat tinggi |
| mau bangun rumah tapi tidak punya modal | Informasi | `/kerjasama-lahan` + artikel | Tinggi |
| jual tanah ke developer | Transaksi | `/kerjasama-lahan` | Tinggi |
| syarat kerja sama lahan perumahan | Informasi | artikel + FAQ | Sedang |
| tanah warisan mau dibangun | Informasi | artikel | Sedang |

### 2.3 Klaster C — Investasi (volume rendah, nilai tertinggi)

| Kata kunci | Niat | Halaman tujuan | Prioritas |
|------------|------|----------------|:---------:|
| investasi properti untuk pemula | Informasi | artikel → `/investasi` | Tinggi |
| investasi tanah kavling | Informasi | artikel | Sedang |
| modal investasi properti 500 juta | Informasi | `/investasi` | Sedang |
| keuntungan investasi properti | Informasi | artikel | Sedang |
| developer properti terpercaya | Komersial | `/tentang` + `/proyek` | Sedang |

### 2.4 Klaster D — Biaya & teknis (pintu masuk trafik)

| Kata kunci | Niat | Halaman tujuan |
|------------|------|----------------|
| estimasi biaya bangun rumah 2 lantai | Informasi | artikel + kalkulasi di detail desain |
| harga jasa desain rumah per meter | Komersial | artikel + `/desain` |
| RAB rumah type 45 | Informasi | artikel |
| berapa lama bangun rumah 2 lantai | Informasi | artikel/FAQ |

### 2.5 Klaster E — Merek & lokal

| Kata kunci | Halaman |
|------------|---------|
| azetta | Beranda |
| azetta properti / azetta developer | `/tentang` |
| desain rumah + nama kota (mis. "desain rumah jogja") | halaman kota (fase 2) atau artikel berbasis lokasi |

> **Catatan:** halaman per-kota (programmatic SEO) **tidak** dibuat di MVP. Tanpa konten unik per kota, halaman seperti ini menjadi *doorway page* yang berisiko dan tidak berguna.

## 3. Peta URL

| URL | Tipe | Diindeks? | Catatan |
|-----|------|:---------:|---------|
| `/` | Beranda | ✅ | |
| `/desain` | Katalog | ✅ | Filter default |
| `/desain?category=…&floors=…` | Katalog terfilter | ⚠️ | Diindeks hanya bila ≤ 2 parameter dan ada ≥ 1 hasil |
| `/desain?q=…` | Hasil pencarian | ❌ | `noindex` |
| `/desain/[slug]` | Detail desain | ✅ | Satu-satunya URL kanonis per desain |
| `/kerjasama-lahan` | Landing | ✅ | |
| `/investasi` | Landing | ✅ | |
| `/artikel` | Daftar artikel | ✅ | Pagination `?page=2` `noindex,follow` |
| `/artikel/[slug]` | Artikel | ✅ | |
| `/tentang`, `/kontak`, `/faq` | Statis | ✅ | |
| `/terima-kasih/*` | Konfirmasi | ❌ | `noindex,nofollow` |
| `/kebijakan-privasi`, `/syarat-ketentuan` | Legal | ✅ | |
| `/404` | Error | ❌ | Status 404 |

**Aturan slug:**

- Kebab-case, tanpa stop word berlebih: `/desain/rumah-minimalis-2-lantai-6x12`.
- Tidak berubah setelah publish. Bila terpaksa berubah, buat **301 redirect** permanen dan perbarui internal link.
- Tidak memuat ID numerik.

## 4. Template on-page

| Halaman | `<title>` | Meta description | H1 |
|---------|-----------|------------------|-----|
| Beranda | `Azetta — Desain Properti, Kerja Sama Lahan & Investasi` | 150–160 char, memuat 3 aliran | `Desain siap bangun, lahan diolah bersama, modal tumbuh bersama` |
| Katalog | `Katalog Desain Rumah & Properti — Azetta` | `Jelajahi {n} desain rumah, ruko, dan interior dengan denah lengkap dan estimasi biaya. Filter sesuai luas lahan Anda.` | `Katalog Desain` |
| Detail desain | `{Judul} — Desain {Kategori} {Gaya} \| Azetta` | 150–160 char dari ringkasan + spesifikasi | `{Judul}` |
| Kerja sama lahan | `Kerja Sama Lahan dengan Developer — Tanpa Modal, Bagi Hasil \| Azetta` | `Punya lahan tapi tidak punya modal? Azetta mengolah lahan Anda dengan skema bagi hasil yang transparan. Ajukan lahan Anda.` | `Kerja Sama Lahan` |
| Investasi | `Investasi Properti Bersama Azetta — Skema & Proyek` | `Kenali skema investasi properti Azetta: bagi hasil, ekuitas, dan imbal tetap, beserta risiko dan tata kelolanya.` | `Investasi Properti` |
| Artikel | `{Judul Artikel} \| Azetta` | 150–160 char dari excerpt | `{Judul Artikel}` |
| FAQ | `Pertanyaan Umum — Azetta` | Ringkasan topik FAQ | `Pertanyaan Umum` |

Aturan:

- Satu `h1` per halaman; `h2` untuk bagian; jangan memakai heading untuk tujuan styling.
- Paragraf pertama halaman penawaran memuat kata kunci utama secara alami dalam 100 kata pertama.
- Setiap halaman punya minimal 3 internal link kontekstual (bukan hanya menu).
- Meta description tidak diambil otomatis dari potongan konten acak — ditulis atau diturunkan dari `subtitle`/`excerpt`.

## 5. Aturan teknis SEO

### 5.1 Indexing

| Aturan | Detail |
|--------|--------|
| Canonical | Self-referencing di semua halaman; filter memakai canonical ke `/desain` bila > 2 parameter |
| `noindex` | Pencarian, halaman terima kasih, halaman staging, pagination artikel |
| `robots.txt` | `Allow: /` + `Disallow: /api/`, `/admin/`, `/terima-kasih/`; `Sitemap:` absolut |
| Sitemap | Dinamis: desain publish, artikel publish, halaman statis; `lastmod` akurat |
| Redirect | Slug berubah → 301; HTTP→HTTPS → 301; `www`→non-www (pilih satu) |
| 404 | Status 404 sungguhan (bukan 200 dengan halaman "tidak ditemukan") |
| Trailing slash | Konsisten (tanpa trailing slash) + redirect |

### 5.2 Renderability

- Semua konten utama ada di HTML awal (SSR), tidak bergantung pada JavaScript.
- Data terstruktur disisipkan server-side, bukan lewat skrip klien.
- Teks di dalam gambar tidak diandalkan sebagai konten.

### 5.3 Gambar

- Format WebP (fallback JPEG), `srcset` 400/800/1600.
- `alt` deskriptif dari admin (wajib untuk cover).
- `width`/`height` selalu diisi untuk mencegah CLS.
- Nama file bermakna: `rumah-minimalis-2-lantai-tampak-depan.webp`.
- Lazy loading untuk gambar di bawah lipatan; **tidak** untuk gambar hero.

### 5.4 Core Web Vitals

| Metrik | Strategi |
|--------|----------|
| LCP | Hero image `preload`, ukuran tepat, CDN, tanpa slider berat |
| INP | Minimalkan JS di halaman publik; event handler ringan; hindari library besar |
| CLS | Dimensi gambar eksplisit; font `swap`; tidak menyisipkan banner di atas konten |

## 6. Data terstruktur (JSON-LD)

| Tipe | Halaman | Field wajib |
|------|---------|-------------|
| `Organization` | Semua (layout) | `name`, `url`, `logo`, `sameAs`, `contactPoint` |
| `WebSite` | Beranda | `name`, `url`, `potentialAction` (SearchAction ke `/desain?q=`) |
| `BreadcrumbList` | Semua kecuali beranda | `itemListElement` |
| `CreativeWork` (subtipe `House` bila sesuai) | Detail desain | `name`, `description`, `image`, `creator`, `datePublished` |
| `Article` | Detail artikel | `headline`, `image`, `datePublished`, `dateModified`, `author` |
| `FAQPage` | `/faq` dan FAQ di landing | `mainEntity[]` |
| `Service` | `/kerjasama-lahan`, `/investasi` | `name`, `description`, `provider` |
| `LocalBusiness` | `/kontak` (bila ada alamat fisik) | `address`, `telephone`, `openingHours` |

**Yang sengaja tidak dipakai:**

- `Product` + `Offer` pada desain — karena tidak ada transaksi online dan harga tidak selalu tersedia; berisiko melanggar pedoman Google.
- `Review`/`AggregateRating` fiktif — dilarang dan merusak kepercayaan.
- `RealEstateListing` — tidak sesuai (yang dijual adalah jasa desain, bukan listing properti).

## 7. Rencana konten awal

### 7.1 12 desain (konten produk)

| # | Judul | Kategori | Gaya | Lahan min | KT/KM | Kata kunci utama |
|---|-------|----------|------|-----------|-------|------------------|
| 1 | Rumah Minimalis 2 Lantai 6×12 | Residential | Minimalis | 72 m² | 3/2 | desain rumah 6x12 2 lantai |
| 2 | Rumah Tropis Modern 2 Lantai 8×15 | Residential | Tropis | 120 m² | 4/3 | desain rumah tropis modern |
| 3 | Rumah Skandinavia 1 Lantai 7×12 | Residential | Skandinavia | 84 m² | 3/2 | desain rumah skandinavia |
| 4 | Rumah Type 45 Modern | Residential | Modern | 90 m² | 2/1 | desain rumah type 45 |
| 5 | Rumah Type 36 Hemat Lahan | Residential | Minimalis | 72 m² | 2/1 | desain rumah type 36 |
| 6 | Rumah Industrial 2 Lantai 9×15 | Residential | Industrial | 135 m² | 3/3 | desain rumah industrial |
| 7 | Rumah Klasik Modern 2 Lantai | Residential | Klasik Modern | 150 m² | 4/3 | desain rumah klasik modern |
| 8 | Rumah Tumbuh 1 Lantai + Rencana Lantai 2 | Residential | Minimalis | 100 m² | 2/2 | desain rumah tumbuh |
| 9 | Ruko Minimalis 2 Lantai 5×15 | Commercial | Minimalis | 75 m² | — | desain ruko minimalis 2 lantai |
| 10 | Ruko Modern 3 Lantai Sudut | Commercial | Modern | 120 m² | — | desain ruko 3 lantai |
| 11 | Renovasi Rumah Lama Jadi Modern | Renovation | Modern | 90 m² | 3/2 | renovasi rumah jadi modern |
| 12 | Interior Ruang Tamu Minimalis 4×5 | Interior | Minimalis | — | — | desain interior ruang tamu minimalis |

Setiap desain wajib memiliki: 5–8 gambar (eksterior, interior, denah per lantai), deskripsi 300–600 kata, spesifikasi lengkap, estimasi biaya, dan 1 CTA.

### 7.2 8 artikel (konten pendukung)

| # | Judul | Klaster | Kata kunci | Funnel |
|---|-------|---------|------------|--------|
| 1 | Kerja Sama Lahan dengan Developer: Skema, Syarat, dan Hal yang Perlu Diperiksa | Lahan | kerja sama lahan dengan developer | MOFU |
| 2 | Bagi Hasil Tanah dengan Developer: Bagaimana Hitungannya? | Lahan | bagi hasil tanah dengan developer | MOFU |
| 3 | Punya Tanah tapi Tidak Punya Modal: Ini Pilihan Anda | Lahan | bangun rumah tanpa modal | TOFU |
| 4 | Estimasi Biaya Bangun Rumah 2 Lantai 6×12 (Rincian 2026) | Biaya | estimasi biaya bangun rumah 2 lantai | TOFU |
| 5 | Harga Jasa Desain Rumah: Apa yang Mempengaruhi? | Desain | harga jasa desain rumah per meter | MOFU |
| 6 | 7 Hal yang Perlu Dicek Sebelum Memilih Desain Rumah | Desain | cara memilih desain rumah | TOFU |
| 7 | Investasi Properti untuk Pemula: Mulai dari Mana? | Investasi | investasi properti untuk pemula | TOFU |
| 8 | Risiko Investasi Properti dan Cara Memitigasinya | Investasi | risiko investasi properti | MOFU |

Aturan artikel: 900–1.500 kata, minimal 1 tabel/gambar orisinal, 3 internal link (1 ke halaman penawaran), CTA di tengah dan akhir, penulis bernama (E-E-A-T), tanggal update terlihat.

### 7.3 FAQ (10 pertanyaan awal)

Umum (3), Desain (3), Lahan (2), Investasi (2). Contoh: "Apakah bisa konsultasi sebelum membeli desain?", "Apakah harga desain termasuk RAB?", "Bagaimana skema bagi hasil lahan?", "Apakah investasi dijamin untung?" (jawaban jujur: tidak ada jaminan).

## 8. Kalender konten

| Minggu | Konten | Pemilik |
|--------|--------|---------|
| 1–2 | 6 desain pertama (foto + deskripsi), halaman statis | Marketing + fotografer |
| 3–4 | 6 desain berikutnya, artikel #4 & #5 | Marketing |
| 5–6 | Artikel #1 & #2 (klaster lahan), FAQ lahan | Marketing + sales |
| 7–8 | Artikel #3 & #6 | Marketing |
| 9–10 | Artikel #7 & #8, FAQ investasi | Marketing + manajemen |
| 11–12 | Optimasi konten berdasarkan data GSC | Marketing |

Setiap artikel baru dipublikasikan **setelah** halaman tujuannya siap (jangan mengirim trafik ke halaman kosong).

## 9. SEO lokal

1. **Google Business Profile** untuk kantor Azetta (kategori: kontraktor/developer), dengan foto proyek & jam operasional.
2. **NAP konsisten** (nama, alamat, telepon) di website, GBP, dan direktori.
3. **Halaman kontak** memuat peta dan alamat teks (dapat dibaca mesin).
4. **Daftar direktori** properti/konstruksi lokal yang relevan (tanpa spam link).
5. Bila ada proyek fisik: buat konten per proyek (fase 2) dengan lokasi jelas.

## 10. Pengukuran

| Alat | Fungsi | Biaya |
|------|--------|-------|
| Google Search Console | Kinerja pencarian, indexing, Core Web Vitals | Gratis |
| GA4 atau Umami | Sesi, sumber, konversi | Gratis / murah |
| `funnel_event` internal | Konversi per halaman & desain | Gratis |
| Lighthouse CI | Regresi performa per PR | Gratis |
| Rank tracker (opsional) | Posisi kata kunci | Rp100–300 rb/bulan |

Laporan bulanan wajib memuat: sesi organik, klik GSC, CTR, posisi rata-rata 10 kata kunci utama, lead per landing page, dan 5 halaman dengan impresi tinggi tapi CTR rendah (kandidat perbaikan judul).

## 11. Off-page & otoritas

| Tindakan | Target |
|----------|--------|
| Profil bisnis & direktori kredibel | 5 tautan dalam 3 bulan |
| Publikasi artikel tamu di media properti/konstruksi | 1–2 per kuartal |
| Kolaborasi dengan arsitek/kontraktor (cross-link) | 2 per kuartal |
| Konten yang layak dikutip (data biaya bangun, panduan legal) | 2 per kuartal |
| Sosial media (IG/TikTok) untuk distribusi | Rutin, bukan untuk backlink langsung |

Hindari: beli backlink, PBN, komentar spam, dan pertukaran link massal.

## 12. Guardrail konten

1. **Tidak ada klaim hasil investasi pasti.** Selalu sertakan bagian risiko.
2. **Estimasi biaya** selalu berlabel "estimasi", dengan tanggal dan asumsi.
3. **Tidak menyalin** deskripsi desain dari sumber lain; setiap desain punya penjelasan orisinal.
4. **Tidak membuat halaman kota** tanpa konten unik.
5. **Tidak mengubah slug** tanpa 301.
6. **Tidak mengindeks** halaman dengan konten tipis (< 300 kata) kecuali halaman fungsional.
7. Perbarui artikel setiap 6–12 bulan; cantumkan tanggal pembaruan.

## 13. Checklist rilis SEO

- [ ] `robots.txt` & `sitemap.xml` dapat diakses dan benar.
- [ ] Semua halaman publik punya `title` + `description` unik.
- [ ] Canonical self-referencing; filter > 2 parameter `noindex`.
- [ ] Halaman terima kasih & staging `noindex`.
- [ ] JSON-LD valid (Rich Results Test) tanpa error.
- [ ] Gambar punya `alt` + dimensi; hero di-preload.
- [ ] Redirect 301 untuk slug yang berubah.
- [ ] GSC & analytics terpasang dan terverifikasi.
- [ ] Tidak ada halaman 200 untuk konten yang tidak ada.
- [ ] Internal link: setiap desain terhubung ke minimal 1 artikel relevan dan sebaliknya.
