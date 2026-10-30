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

### 2.1 Klaster A — Rumah dijual (volume tertinggi, niat komersial)

| Kata kunci | Niat | Halaman tujuan | Prioritas |
|------------|------|----------------|:---------:|
| rumah dijual {kota} | Komersial | `/rumah` (filter kota) | **Sangat tinggi** |
| rumah baru {kota} | Komersial | `/rumah` + `/proyek` | Tinggi |
| perumahan {kota} | Komersial | `/proyek/[slug]` | Tinggi |
| rumah type 36 / 45 / 60 | Komersial | detail unit + filter tipe | Tinggi |
| rumah 2 lantai {kota} | Komersial | `/rumah` (filter lantai) | Tinggi |
| rumah tapak minimalis | Komersial | `/rumah` + artikel | Sedang |
| rumah siap huni {kota} | Komersial | `/rumah` (status `AVAILABLE`) | Sedang |
| rumah KPR {kota} | Komersial | artikel + `/rumah` | Sedang |
| rumah subsidi {kota} | Informasi/komersial | artikel + `/rumah` | Rendah |

### 2.2 Klaster B — Lahan (volume rendah, nilai tinggi, sumber pasokan)

| Kata kunci | Niat | Halaman tujuan | Prioritas |
|------------|------|----------------|:---------:|
| kerja sama lahan dengan developer | Komersial | `/kerja-sama-lahan` | **Sangat tinggi** |
| bagi hasil tanah dengan developer | Komersial | `/kerja-sama-lahan` | Sangat tinggi |
| jual tanah ke developer | Transaksi | `/kerja-sama-lahan` (opsi "Dijual") | Tinggi |
| mau bangun rumah tapi tidak punya modal | Informasi | `/kerja-sama-lahan` + artikel | Tinggi |
| syarat kerja sama lahan perumahan | Informasi | artikel + FAQ | Sedang |
| tanah warisan mau dibangun | Informasi | artikel | Sedang |

### 2.3 Klaster C — Investasi (informasi, volume rendah)

| Kata kunci | Niat | Halaman tujuan | Prioritas |
|------------|------|----------------|:---------:|
| investasi properti untuk pemula | Informasi | artikel → `/investasi` | Sedang |
| investasi tanah kavling | Informasi | artikel | Sedang |
| modal investasi properti 500 juta | Informasi | `/investasi` | Sedang |
| keuntungan investasi properti | Informasi | artikel | Sedang |
| developer properti terpercaya | Komersial | `/tentang` + `/proyek` | Sedang |

> Klaster ini **tidak** diarahkan ke formulir. Halaman `/investasi` hanya menyediakan CTA kontak; targetnya kunjungan informasional dan kredibilitas, bukan lead.

### 2.4 Klaster D — Biaya, KPR & teknis (pintu masuk trafik)

| Kata kunci | Niat | Halaman tujuan |
|------------|------|----------------|
| harga rumah type 45 | Informasi/komersial | detail unit + artikel |
| estimasi biaya bangun rumah 2 lantai | Informasi | artikel (panduan umum, bukan angka per unit) |
| simulasi KPR rumah | Informasi | artikel |
| berapa lama bangun rumah 2 lantai | Informasi | artikel/FAQ |
| biaya notaris & BPHTB membeli rumah | Informasi | artikel |

### 2.5 Klaster E — Merek & lokal

| Kata kunci | Halaman |
|------------|---------|
| azetta | Beranda |
| azetta properti / azetta developer | `/tentang` |
| rumah dijual + nama kota (mis. "rumah dijual jogja") | `/rumah?city=…` (fase 1) atau artikel berbasis lokasi |

> **Catatan:** halaman per-kota (programmatic SEO) **tidak** dibuat di MVP. Tanpa konten unik per kota, halaman seperti ini menjadi *doorway page* yang berisiko dan tidak berguna. Filter kota pada `/rumah` sudah menangkap niat ini.

## 3. Peta URL

| URL | Tipe | Diindeks? | Catatan |
|-----|------|:---------:|---------|
| `/` | Beranda | ✅ | |
| `/rumah` | Katalog unit | ✅ | Filter default |
| `/rumah?city=…&type=…` | Katalog terfilter | ⚠️ | Diindeks hanya bila ≤ 2 parameter dan ada ≥ 1 hasil |
| `/rumah?q=…` | Hasil pencarian | ❌ | `noindex` |
| `/rumah/[slug]` | Detail unit | ✅ | Satu-satunya URL kanonis per unit |
| `/proyek` | Daftar proyek | ✅ | |
| `/proyek/[slug]` | Detail proyek | ✅ | |
| `/kerja-sama-lahan` | Landing | ✅ | |
| `/investasi` | Halaman informasi | ✅ | Tanpa form; `noindex` bila konten belum siap |
| `/artikel` | Daftar artikel | ✅ | Pagination `?page=2` `noindex,follow` |
| `/artikel/[slug]` | Artikel | ✅ | |
| `/tentang`, `/kontak`, `/faq` | Statis | ✅ | |
| `/masuk`, `/daftar`, `/lupa-sandi`, `/reset-sandi`, `/verifikasi-email` | Auth | ❌ | `noindex,nofollow` |
| `/akun`, `/akun/*` | Area pengguna | ❌ | `noindex,nofollow`; wajib login |
| `/terima-kasih/*` | Konfirmasi | ❌ | `noindex,nofollow` |
| `/kebijakan-privasi`, `/syarat-ketentuan` | Legal | ✅ | |
| `/404` | Error | ❌ | Status 404 |

**Aturan slug:**

- Kebab-case, tanpa stop word berlebih: `/rumah/azetta-residence-tipe-45-a1`.
- Tidak berubah setelah publish. Bila terpaksa berubah, buat **301 redirect** permanen dan perbarui internal link.
- Tidak memuat ID numerik.

## 4. Template on-page

| Halaman | `<title>` | Meta description | H1 |
|---------|-----------|------------------|-----|
| Beranda | `Azetta — Rumah Tapak, Kerja Sama Lahan & Proyek Properti` | 150–160 char, memuat aliran utama | `Rumah siap dihuni, dibangun oleh Azetta` |
| Katalog | `Rumah Dijual — Katalog Unit Azetta` | `Lihat {n} unit rumah tapak dari proyek Azetta: tipe, luas tanah, harga mulai dari, dan status ketersediaan terbaru.` | `Rumah Dijual` |
| Detail unit | `{Judul Unit} — Rumah {Tipe} di {Kota} \| Azetta` | 150–160 char dari ringkasan + spesifikasi | `{Judul Unit}` |
| Proyek | `Proyek Azetta — Portofolio Pengembangan Lahan` | `Lihat proyek yang sedang berjalan dan telah selesai dikembangkan Azetta, lengkap dengan lokasi dan spesifikasinya.` | `Proyek Azetta` |
| Detail proyek | `{Judul Proyek} — Proyek Azetta di {Kota}` | 150–160 char dari ringkasan proyek | `{Judul Proyek}` |
| Kerja sama lahan | `Jual atau Kerja Sama Lahan dengan Developer — Azetta` | `Punya lahan? Azetta membeli lahan atau membangun bersama Anda, lalu unitnya dijual. Lihat skema, syarat, dan alurnya.` | `Kerja Sama Lahan` |
| Investasi | `Informasi Investasi & Tata Kelola — Azetta` | `Profil perusahaan, proyek berjalan, skema kemitraan, dan risiko yang perlu diketahui sebelum menghubungi Azetta.` | `Informasi Investasi` |
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
| Canonical | Self-referencing di semua halaman; filter memakai canonical ke `/rumah` bila > 2 parameter |
| `noindex` | Pencarian, halaman terima kasih, halaman staging, pagination artikel |
| `robots.txt` | `Allow: /` + `Disallow: /api/`, `/admin/`, `/terima-kasih/`; `Sitemap:` absolut |
| Sitemap | Dinamis: unit publish, artikel publish, halaman statis; `lastmod` akurat |
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
| `WebSite` | Beranda | `name`, `url`, `potentialAction` (SearchAction ke `/rumah?q=`) |
| `BreadcrumbList` | Semua kecuali beranda | `itemListElement` |
| `Residence` (subtipe `House`) | Detail unit | `name`, `description`, `image`, `address`, `numberOfRooms`, `floorSize` |
| `CreativeWork` | Detail proyek | `name`, `description`, `image`, `dateCreated`, `locationCreated` |
| `ItemList` | Katalog `/rumah` | `itemListElement` (maks 12 unit pertama) |
| `Article` | Detail artikel | `headline`, `image`, `datePublished`, `dateModified`, `author` |
| `FAQPage` | `/faq` dan FAQ di landing | `mainEntity[]` |
| `Service` | `/kerja-sama-lahan` | `name`, `description`, `provider` |
| `LocalBusiness` | `/kontak` (bila ada alamat fisik) | `address`, `telephone`, `openingHours` |

**Yang sengaja tidak dipakai:**

- `Product` + `Offer` pada unit — harga hanya indikatif dan transaksi terjadi di luar situs; berisiko melanggar pedoman Google.
- `Review`/`AggregateRating` fiktif — dilarang dan merusak kepercayaan.
- `RealEstateListing` — tidak memberi rich result dan menyiratkan ketersediaan real-time yang tidak dijamin data kami.

## 7. Rencana konten awal

### 7.1 12 unit rumah (konten produk)

| # | Proyek | Kode | Tipe | LT / LB | KT/KM | Status | Kata kunci utama |
|---|--------|------|------|---------|-------|--------|------------------|
| 1 | Azetta Residence | A1 | Tipe 45 | 96 / 90 m² | 3/2 | Tersedia | rumah type 45 {kota} |
| 2 | Azetta Residence | A2 | Tipe 45 | 96 / 90 m² | 3/2 | Tersedia | rumah 2 lantai {kota} |
| 3 | Azetta Residence | B1 | Tipe 60 | 120 / 110 m² | 4/3 | Indent | rumah type 60 {kota} |
| 4 | Azetta Residence | B2 | Tipe 60 | 120 / 110 m² | 4/3 | Terjual | rumah siap huni {kota} |
| 5 | Griya Ngaglik | C1 | Tipe 36 | 72 / 60 m² | 2/1 | Tersedia | rumah type 36 {kota} |
| 6 | Griya Ngaglik | C2 | Tipe 36 | 72 / 60 m² | 2/1 | Tersedia | rumah murah {kota} |
| 7 | Griya Ngaglik | D1 | Tipe 45 | 90 / 78 m² | 3/2 | Indent | rumah tapak minimalis |
| 8 | Griya Ngaglik | D2 | Tipe 45 | 90 / 78 m² | 3/2 | Terjual | rumah keluarga {kota} |
| 9 | Azetta Garden | E1 | Tipe 70 | 140 / 120 m² | 4/3 | Tersedia | rumah 2 lantai hook |
| 10 | Azetta Garden | E2 | Tipe 70 | 140 / 120 m² | 4/3 | Tersedia | rumah taman {kota} |
| 11 | Azetta Garden | F1 | Tipe 90 | 180 / 150 m² | 4/4 | Indent | rumah mewah {kota} |
| 12 | Azetta Garden | F2 | Tipe 90 | 180 / 150 m² | 4/4 | Terjual | rumah cluster {kota} |

Setiap unit wajib memiliki: 5–8 media (render eksterior, interior, denah per lantai, foto progres bila ada), deskripsi 300–600 kata, spesifikasi lengkap, harga "mulai dari" per tipe, status ketersediaan, dan 1 CTA. **Harga final dan skema pembayaran tidak dicantumkan** — angka biaya hanya ada di artikel panduan umum.

### 7.2 4 proyek (bukti sosial)

| # | Judul | Status | Lokasi | Kata kunci pendukung |
|---|-------|--------|--------|----------------------|
| 1 | Cluster Ngaglik | Selesai | Sleman, DIY | proyek perumahan sleman |
| 2 | Rumah Tropis Kaliurang | Sedang berjalan | Sleman, DIY | developer rumah jogja |
| 3 | Ruko Modern Maguwo | Sedang berjalan | Sleman, DIY | ruko modern jogja |
| 4 | Kavling Terpadu Bantul | Direncanakan | Bantul, DIY | kavling bantul |

Proyek hanya dipublikasikan setelah ada persetujuan tertulis (R21). Tanpa foto & persetujuan, section proyek tidak ditampilkan.

### 7.3 8 artikel (konten pendukung)

| # | Judul | Klaster | Kata kunci | Funnel |
|---|-------|---------|------------|--------|
| 1 | Kerja Sama Lahan dengan Developer: Skema, Syarat, dan Hal yang Perlu Diperiksa | Lahan | kerja sama lahan dengan developer | MOFU |
| 2 | Bagi Hasil Tanah dengan Developer: Bagaimana Hitungannya? | Lahan | bagi hasil tanah dengan developer | MOFU |
| 3 | Punya Tanah tapi Tidak Punya Modal: Ini Pilihan Anda | Lahan | bangun rumah tanpa modal | TOFU |
| 4 | Estimasi Biaya Bangun Rumah 2 Lantai 6×12 (Rincian 2026) | Biaya | estimasi biaya bangun rumah 2 lantai | TOFU |
| 5 | Harga Rumah Type 45: Apa Saja yang Mempengaruhi? | Rumah | harga rumah type 45 | MOFU |
| 6 | 7 Hal yang Perlu Dicek Sebelum Membeli Rumah Baru | Rumah | cara memilih rumah baru | TOFU |
| 7 | Investasi Properti untuk Pemula: Mulai dari Mana? | Investasi | investasi properti untuk pemula | TOFU |
| 8 | Risiko Investasi Properti dan Cara Memitigasinya | Investasi | risiko investasi properti | MOFU |

Aturan artikel: 900–1.500 kata, minimal 1 tabel/gambar orisinal, 3 internal link (1 ke halaman penawaran), CTA di tengah dan akhir, penulis bernama (E-E-A-T), tanggal update terlihat.

### 7.4 FAQ (10 pertanyaan awal)

Umum (3), Rumah (3), Lahan (2), Investasi (2). Contoh: "Apakah harga yang tampil sudah final?", "Bisakah unit dibeli dengan KPR?", "Apa beda 'dijual' dan 'dikerjasamakan' untuk lahan?", "Apakah investasi dijamin untung?" (jawaban jujur: tidak ada jaminan).

### 7.5 Aturan bahasa & visual materi (Brand Guidelines §07–§08)

Berlaku untuk seluruh naskah publik: halaman situs, artikel, FAQ, caption media sosial, dan lampiran PDF.

| Wajib | Rincian |
|-------|---------|
| Sapaan | "Anda"; kalimat pendek, satu gagasan per kalimat |
| Angka | `Rp 1.646.000.000` (spasi setelah `Rp`, titik ribuan), desimal koma: `11,3%` |
| Judul | Pernyataan/pertanyaan langsung, bukan slogan, tanpa tagar |
| Status proyek | Apa adanya: "Rancangan proyek Faisal · tahap perencanaan" |
| Ajakan | Setiap materi publik ditutup dengan **satu** ajakan (formulir kajian) |
| Gambar | Foto lahan, render, dan denah asli proyek — bukan foto stok; tiap render/denah diberi keterangan status |
| Penutup | Penyerta ajakan: "Kajian awal gratis · Tanpa ikatan sampai akad · ±10 menit" |

| Jangan | Gunakan |
|--------|---------|
| Menyebut angka imbal hasil di materi publik | Ajakan untuk kajian; angka hanya di materi tertutup beserta asumsinya |
| "Aman", "pasti untung", "tanpa risiko" | Sebut risikonya, lalu cara mengendalikannya |
| "Lahan tetap milik Anda" | "Lahan masuk sebagai modal penyertaan" |
| "Pasar saham" | "Pengalihan saham" atau "pasar sekunder terbatas" |
| Menampilkan proyek yang belum deal | Hanya proyek yang sudah deal, status apa adanya |
| Harga lahan milik pemilik tertentu | Angka transaksi hanya untuk pihak yang terlibat |

Kontak materi publik: formulir `forms.gle/FjX6A6XZjksGbASU9`, Instagram `@azetta.indonesia`, email `azettaidofficial@gmail.com`. Pada materi pemasaran (media sosial, poster, PDF, presentasi) nomor WhatsApp tidak dicetak sebagai teks; di web, tombol `wa.me` tetap tersedia sebagai kanal konversi sekunder (pengecualian resmi D19).

## 8. Kalender konten

| Minggu | Konten | Pemilik |
|--------|--------|---------|
| 1–2 | 6 unit pertama (foto/render + deskripsi), 2 proyek, halaman statis | Tim internal (no dedicated PIC) + fotografer |
| 3–4 | 6 unit berikutnya, 2 proyek, artikel #4 & #5 | Tim internal |
| 5–6 | Artikel #1 & #2 (klaster lahan), FAQ lahan | Tim internal + sales |
| 7–8 | Artikel #3 & #6 | Tim internal |
| 9–10 | Artikel #7 & #8, FAQ investasi | Tim internal + manajemen |
| 11–12 | Optimasi konten berdasarkan data GSC | Tim internal |

Karena belum ada PIC konten khusus (Q9), jadwalkan blok waktu tetap 2×/minggu (mis. Selasa & Kamis, 2 jam). Tanpa jadwal tetap, risiko R1 (konten terlambat) sangat tinggi.

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
| `funnel_event` internal | Konversi per halaman & unit | Gratis |
| Lighthouse CI | Regresi performa per PR | Gratis |
| Rank tracker (opsional) | Posisi kata kunci | Rp 100–300 rb/bulan |

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
2. **Artikel biaya** memakai label "estimasi" dengan tanggal & asumsi; **halaman unit tidak menampilkan harga final atau skema pembayaran**.
3. **Tidak menyalin** deskripsi unit dari sumber lain; setiap unit punya penjelasan orisinal.
4. **Tidak membuat halaman kota** tanpa konten unik.
5. **Tidak mengubah slug** tanpa 301.
6. **Tidak mengindeks** halaman dengan konten tipis (< 300 kata) kecuali halaman fungsional.
7. Perbarui artikel setiap 6–12 bulan; cantumkan tanggal pembaruan.

## 13. Checklist rilis SEO

- [ ] `robots.txt` & `sitemap.xml` dapat diakses dan benar.
- [ ] Semua halaman publik punya `title` + `description` unik.
- [ ] Canonical self-referencing; filter > 2 parameter `noindex`.
- [ ] Halaman terima kasih & staging `noindex`.
- [ ] Halaman auth (`/masuk`, `/daftar`, `/lupa-sandi`, `/reset-sandi`, `/verifikasi-email`) dan `/akun*` `noindex,nofollow`.
- [ ] Sitemap memuat unit, proyek, artikel, dan halaman statis yang publish.
- [ ] JSON-LD valid (Rich Results Test) tanpa error.
- [ ] Gambar punya `alt` + dimensi; hero di-preload.
- [ ] Redirect 301 untuk slug yang berubah.
- [ ] GSC & analytics terpasang dan terverifikasi.
- [ ] Tidak ada halaman 200 untuk konten yang tidak ada.
- [ ] Internal link: setiap unit terhubung ke minimal 1 artikel relevan dan sebaliknya.
