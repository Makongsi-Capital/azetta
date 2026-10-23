# 12 — Risiko, Asumsi & Keputusan

> Kembali ke [index](./README.md) · Sebelumnya: [11](./11-deployment-operations.md)

---

## 1. Ringkasan

Dokumen ini mencatat tiga hal yang menentukan keberhasilan rencana:

1. **Pertanyaan yang belum terjawab** — perlu keputusan sebelum sprint yang bersangkutan.
2. **Keputusan yang sudah diambil** — agar tidak diperdebatkan ulang tanpa alasan baru.
3. **Risiko** — beserta mitigasi dan pemiliknya.

## 2. Pertanyaan terbuka

| # | Pertanyaan | Mengapa penting | Default bila tidak dijawab | Dibutuhkan sebelum |
|---|------------|-----------------|----------------------------|--------------------|
| Q1 | Apakah pengunjung perlu akun/login di MVP? | Menambah 12–18 pd, alur auth kedua, dan kewajiban pengelolaan data | **Tidak.** Login hanya untuk staf admin | Sprint 0 |
| Q2 | Domain final & nama merek (apakah `azetta.id`?) | Menentukan cookie domain, email, canonical, dan materi cetak | `azetta.id` + `admin.` + `api.` + `media.` | Sprint 0 |
| Q3 | Nomor WhatsApp, email, alamat, dan jam operasional resmi | Tampil di semua CTA & footer; salah nomor = kehilangan lead | Placeholder di `SiteSetting`, wajib diganti sebelum rilis | Sprint 2 |
| Q4 | Apakah ada proyek berjalan yang boleh dipublikasikan (nama, foto, angka)? | Menentukan kekuatan halaman lahan & investasi | Tanpa portofolio; gunakan penjelasan proses & skema saja | Sprint 5 |
| Q5 | Harga desain ditampilkan ("mulai dari") atau "hubungi kami"? | Memengaruhi konversi dan ekspektasi harga | Tampilkan `priceFrom` bila diisi; sisanya "hubungi kami" | Sprint 1 |
| Q6 | Siapa pemilik lead per tipe & siapa penerima notifikasi? | Tanpa pemilik, SLA 2 jam tidak mungkin dipenuhi | Semua ke `sales@azetta.id`, ditugaskan manual | Sprint 2 |
| Q7 | Apakah memakai WhatsApp gateway berbayar untuk notifikasi? | Menambah biaya & integrasi; email mungkin cukup | Email saja; gateway ditunda | Sprint 2 |
| Q8 | Apakah estimasi biaya bangun boleh ditampilkan publik? | Bisa menjadi keunggulan transparansi, bisa juga disalahartikan | Tampilkan dengan disclaimer jelas | Sprint 1 |
| Q9 | Siapa penanggung jawab konten dan berapa kapasitas per minggu? | Konten adalah kritis jalur rilis | Marketing internal, 2 konten/minggu | Sprint 1 |
| Q10 | Apakah "Azetta" punya badan hukum & dokumen yang bisa ditampilkan di halaman tentang? | Kepercayaan investor & pemilik lahan | Tampilkan tanpa detail legal | Sprint 5 |

Cara menjawab: isi kolom keputusan pada tabel di bawah ini dan perbarui [§5 Change Log](#5-change-log).

| # | Keputusan | Tanggal | Oleh |
|---|-----------|---------|------|
| Q1 | | | |
| Q2 |azetta.id | | |
| Q3 |berikan halaman config di admin agar mudah diubah ketika production | | |
| Q4 | | | |
| Q5 | | | |
| Q6 | | | |
| Q7 | | | |
| Q8 | | | |
| Q9 | | | |
| Q10 | | | |

## 3. Log keputusan (ADR ringkas)

| ID | Keputusan | Alasan | Konsekuensi | Alternatif yang ditolak |
|----|-----------|--------|-------------|-------------------------|
| D1 | MVP bersifat **lead-gen**, tanpa pembayaran online | Transaksi properti butuh negosiasi, verifikasi, dan dokumen; payment gateway menambah kompleksitas & risiko | Pendapatan tidak terukur langsung; butuh disiplin pencatatan sales | Checkout desain digital, eskrow |
| D2 | **Monorepo Bun workspaces** | Elysia berjalan di Bun; satu perintah dev, kontrak & tipe dibagi | Semua tim harus memakai Bun | Turborepo, multi-repo |
| D3 | **Admin sebagai aplikasi terpisah** | Isolasi origin & bundel; memudahkan pembatasan akses | Dua deployment, dua konfigurasi | Route group di app yang sama |
| D4 | **Satu instance Better Auth di API** | Menghindari dua sumber sesi; guard terpusat | SvelteKit harus meneruskan cookie | Auth di masing-masing app |
| D5 | **TypeBox sebagai kontrak** | Native di Elysia, bisa dipakai validasi klien | Kurang populer dibanding Zod | Zod + konversi |
| D6 | **Soft delete untuk konten** | Menjaga integritas lead & SEO | Query harus memfilter `deletedAt` | Hard delete |
| D7 | **Tanpa akun publik di MVP** | Tidak ada kebutuhan yang terbukti; mengurangi beban privasi & keamanan | Pengunjung tidak bisa memantau status | Akun customer sejak awal |
| D8 | **CMS Markdown**, bukan WYSIWYG | Sederhana, aman, mudah direview di git-like flow | Penulis harus paham Markdown dasar (disediakan preview) | Editor blok, headless CMS |
| D9 | **Cloudflare R2** untuk media | Murah, egress gratis, kompatibel S3 | Bergantung pada Cloudflare | Disk VPS, S3 |
| D10 | **Tanpa Redis** di MVP | Skala awal tidak membutuhkan; mengurangi komponen | Rate limit per instance; tidak boleh multi-replika tanpa Redis | Redis sejak awal |
| D11 | **Hanya bahasa Indonesia** | Pasar awal Indonesia; mengurangi effort & risiko konten | Investor asing belum terlayani | ID+EN |
| D12 | **7 sprint / ±13 minggu** | Urutan ketergantungan & kapasitas 2 developer | Beban 95% kapasitas; tanpa buffer lingkup | 9–10 sprint dengan buffer |

Keputusan dapat diubah, tetapi perubahan harus mencatat: alasan baru, dampak jadwal/biaya, dan siapa yang menyetujui.

## 4. Register risiko

Skor = probabilitas (1–5) × dampak (1–5). Prioritas: ≥15 tinggi, 8–14 sedang, ≤7 rendah.

| ID | Risiko | Kategori | P | D | Skor | Mitigasi | Pemilik |
|----|--------|----------|:-:|:-:|:----:|----------|---------|
| R1 | Konten (render, foto, artikel) belum siap saat rilis | Konten | 4 | 5 | **20** | Kontrak fotografer/3D artist di Sprint 1; target 6 desain siap sebelum Sprint 3; daftar aset per desain | Marketing |
| R2 | Lead masuk tetapi tidak ditindaklanjuti ≤ 2 jam | Operasional | 4 | 4 | **16** | Notifikasi real-time, dashboard "belum dihubungi", SLA tertulis, tinjauan harian | Sales lead |
| R3 | Spam formulir membanjiri CRM | Teknis | 3 | 3 | 9 | Honeypot + Turnstile + rate limit + dedup; tinjauan spam mingguan | Developer |
| R4 | Kebocoran/penyalahgunaan data pribadi | Legal/Keamanan | 2 | 5 | **10** | Consent, minimasi, akses berbasis peran, audit log, retensi, enkripsi | Tech lead |
| R5 | Scope creep (permintaan transaksi/dashboard investor di tengah jalan) | Proyek | 4 | 4 | **16** | Batas lingkup tertulis; change request dengan trade-off | Manajemen |
| R6 | Keterlambatan karena satu developer menjadi bottleneck | Proyek | 3 | 4 | 12 | Dokumentasi, pair review, pembagian modul jelas, hindari bus factor | Tech lead |
| R7 | Peringkat SEO lambat (domain baru) | Marketing | 4 | 3 | 12 | Ekspektasi realistis 3–6 bulan; kanal berbayar & sosial di 90 hari pertama | Marketing |
| R8 | Kualitas lead rendah (banyak yang hanya penasaran) | Bisnis | 3 | 3 | 9 | Kualifikasi di form (rentang modal, luas lahan), lead scoring, tinjauan per kanal | Sales |
| R9 | Biaya infrastruktur naik tak terkendali | Finansial | 2 | 3 | 6 | Retensi data, pemantauan bulanan, R2 untuk media | Tech lead |
| R10 | Kehilangan data karena backup gagal | Teknis | 2 | 5 | **10** | Backup harian + uji restore kuartalan + alert backup | DevOps |
| R11 | Website lambat di jaringan mobile Indonesia | Teknis | 3 | 3 | 9 | Anggaran performa, uji 4G tersimulasi, CDN, gambar teroptimasi | Developer |
| R12 | Tim sales menolak memakai sistem (kembali ke spreadsheet) | Adopsi | 3 | 4 | 12 | Libatkan sales sejak Sprint 3, pelatihan, sederhanakan alur, tunjukkan manfaat | Manajemen |
| R13 | Klaim investasi menimbulkan masalah hukum | Legal | 2 | 5 | **10** | Tanpa janji imbal hasil, bagian risiko wajib, review legal | Manajemen |
| R14 | Vendor/penyedia layanan gangguan (Cloudflare, VPS, email) | Eksternal | 2 | 4 | 8 | Pilih penyedia mapan; siapkan jalur gagal untuk email (SMTP alternatif) | DevOps |
| R15 | Perubahan kebijakan platform (Google, Meta) menurunkan trafik | Eksternal | 3 | 3 | 9 | Diversifikasi kanal; bangun daftar kontak sendiri | Marketing |
| R16 | Slug berubah tanpa redirect → trafik hilang | Teknis | 3 | 2 | 6 | Kunci slug setelah publish; 301 otomatis bila terpaksa berubah | Developer |
| R17 | Data uji tercampur data produksi | Operasional | 2 | 4 | 8 | Environment terpisah, larangan salin data tanpa anonimisasi | DevOps |
| R18 | Bug pada perhitungan/penyimpanan nominal (BigInt) | Teknis | 2 | 3 | 6 | Serialisasi string + test unit format & pembulatan | Developer |

### 4.1 Rencana respons risiko tinggi (skor ≥ 15)

| Risiko | Tindakan konkret | Tenggat |
|--------|------------------|---------|
| R1 | Tetapkan daftar 12 desain + PIC aset; pesan jasa render; buffer konten 2 minggu sebelum Sprint 5 | Sebelum Sprint 2 |
| R2 | Tentukan sales lead, jam kerja, dan aturan eskalasi; aktifkan alert lead baru | Sebelum Sprint 3 |
| R5 | Tandatangani ruang lingkup MVP (dokumen ini) oleh manajemen | Sebelum Sprint 1 |

## 5. Change Log

| Tanggal | Versi | Perubahan | Alasan | Oleh |
|---------|-------|-----------|--------|------|
| 2026-10-23 | 1.0 | Dokumen awal dibuat | Perencanaan MVP | — |

## 6. Dependensi eksternal

| Dependensi | Dibutuhkan untuk | Risiko bila tidak ada | Rencana cadangan |
|------------|------------------|-----------------------|------------------|
| Domain & DNS | Rilis | Tidak bisa tayang di domain utama | Subdomain sementara |
| Cloudflare (CDN, Turnstile, R2) | Performa, keamanan, media | Tanpa CDN, spam naik | Provider lain (Bunny, S3) |
| Layanan email transaksional | Notifikasi lead | Lead tidak diketahui cepat | SMTP penyedia lain / notifikasi WA |
| Data wilayah Indonesia | Dropdown provinsi/kota | Input bebas, data kotor | Dataset statis bawaan |
| Aset visual (render/foto) | Katalog | Katalog tidak meyakinkan | Placeholder sementara (jangan rilis) |
| Review legal | Kebijakan privasi & syarat | Risiko kepatuhan | Template konservatif + review menyusul |
| Google Search Console | Pengukuran SEO | Buta terhadap performa pencarian | Analitik internal saja |

## 7. Asumsi yang dipakai di seluruh dokumen

| # | Asumsi | Dampak bila salah |
|---|--------|-------------------|
| A1 | Trafik awal 1.000–3.000 sesi/bulan | Arsitektur masih memadai hingga 30 rb sesi/bulan |
| A2 | Lead 40–100/bulan | CRM internal cukup; di atas 500/bulan perlu CRM khusus |
| A3 | Tidak ada transaksi online di MVP | Tidak perlu PCI/payment gateway |
| A4 | Satu organisasi, satu bahasa, satu mata uang | Tidak perlu multi-tenant/i18n |
| A5 | Tim 2 developer + desainer/QA paruh waktu | Jadwal 13 minggu |
| A6 | Konten disiapkan paralel oleh tim Azetta | Jika tidak, rilis tertunda tanpa menambah kode |
| A7 | Pengunjung mayoritas mobile dengan 4G | Prioritas performa mobile |
| A8 | Lead ditindaklanjuti manual oleh sales | Tanpa otomasi CRM di MVP |

## 8. Persetujuan

| Peran | Nama | Keputusan | Tanggal | Tanda tangan |
|-------|------|-----------|---------|--------------|
| Pemilik produk / manajemen | | ☐ Setuju ☐ Revisi | | |
| Tech lead | | ☐ Setuju ☐ Revisi | | |
| Sales lead | | ☐ Setuju ☐ Revisi | | |
| Marketing lead | | ☐ Setuju ☐ Revisi | | |

Catatan persetujuan:

> Dengan menyetujui dokumen ini, para pihak menyepakati ruang lingkup MVP ([01 §4](./01-prd.md#4-ruang-lingkup)), urutan sprint ([07](./07-backlog-sprint.md)), dan batas anggaran indikatif ([08](./08-estimasi-biaya.md)). Perubahan setelah persetujuan mengikuti proses di [07 §9](./07-backlog-sprint.md#9-manajemen-perubahan).
