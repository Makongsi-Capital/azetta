# 12 — Risiko, Asumsi & Keputusan

> Kembali ke [index](./README.md) · Sebelumnya: [11](./11-deployment-operations.md)

---

## 1. Ringkasan

Dokumen ini mencatat tiga hal yang menentukan keberhasilan rencana:

1. **Keputusan atas pertanyaan terbuka** — sudah dijawab seluruhnya pada v1.1; pertanyaan baru dicatat terpisah.
2. **Keputusan arsitektur/produk** — agar tidak diperdebatkan ulang tanpa alasan baru.
3. **Risiko** — beserta mitigasi dan pemiliknya.

## 2. Keputusan atas pertanyaan terbuka

Seluruh pertanyaan di bawah **sudah dijawab** pada 23 Oktober 2026 oleh pemilik produk. Jawaban ini menjadi baseline dokumen versi 1.1 dan sudah diterapkan ke seluruh dokumen terkait.

| # | Pertanyaan | Keputusan | Dampak ke dokumen |
|---|------------|-----------|-------------------|
| Q1 | Apakah pengunjung perlu akun/login di MVP? | **Ya** — pengunjung dapat membuat akun untuk memantau progres pengajuan | Ruang lingkup + sprint baru (S5), model `User` dipakai, halaman `/masuk`, `/daftar`, `/akun`; lihat [01 §4](./01-prd.md#4-ruang-lingkup) & [06 §4.12](./06-ux-sitemap-wireframe.md#412-akun-saya) |
| Q2 | Domain final & nama merek | **`azetta.id`** (+ `admin.`, `api.`, `media.`) | Tidak berubah dari default |
| Q3 | Nomor WhatsApp, email, alamat, jam operasional | **Dikelola lewat halaman Pengaturan admin** agar bisa diubah saat produksi | [01 FR-ADM-12](./01-prd.md#53-modul-admin), [04 §3.5](./04-data-model.md#35-article-faq-testimonial-sitesetting) |
| Q4 | Proyek yang boleh dipublikasikan | **Ya, ada** — portofolio proyek masuk MVP | Model `Project`, halaman `/proyek`, admin CRUD; lihat [04 §3.7](./04-data-model.md#37-project) |
| Q5 | Harga desain ditampilkan? | **Ya** — `priceFrom` bila diisi, sisanya "hubungi kami" | Tidak berubah dari default |
| Q6 | Pemilik lead per tipe | **Semua lead ditangani admin**; tidak ada routing per tipe | Peran `staff` dihapus; satu antrean lead; [05 §3.2](./05-spesifikasi-api.md#32-matriks-otorisasi) |
| Q7 | WhatsApp gateway berbayar? | **Tidak** — notifikasi email saja | [05 §8](./05-spesifikasi-api.md#8-notifikasi), [11 §4](./11-deployment-operations.md#4-konfigurasi-environment) |
| Q8 | Estimasi biaya bangun ditampilkan publik? | **Tidak** — hanya dipakai internal sales | Field tetap ada di DB sebagai data internal, tidak dikirim API publik; [06 §4.3](./06-ux-sitemap-wireframe.md#43-detail-desain-desainslug) |
| Q9 | Penanggung jawab konten | **Belum ada PIC khusus**; dikerjakan tim internal secara best-effort, opsi penambahan tetap terbuka | Risiko R1 naik; [10 §8](./10-seo-konten.md#8-kalender-konten) |
| Q10 | Badan hukum & dokumen perusahaan | **Belum ada**; halaman Pengaturan menyediakan unggah dokumen agar bisa ditambahkan kemudian | Setting `legal` + unggah berkas; [06 §4.8](./06-ux-sitemap-wireframe.md#48-tentang-tentang) |

Pertanyaan baru yang muncul setelah baseline ini dicatat pada tabel berikut, bukan ditambahkan sebagai asumsi diam-diam.

| # | Pertanyaan baru | Status | Dibutuhkan sebelum |
|---|-----------------|--------|--------------------|
| Q11 | Apakah akun publik memakai verifikasi email wajib? | Diasumsikan **ya** (mencegah spam & memungkinkan reset kata sandi) | Sprint 5 |
| Q12 | Apakah pemilik akun boleh menghapus akun sendiri di MVP? | Diasumsikan **belum**; penghapusan/anonimisasi via permintaan manual ≤ 30 hari | Sprint 5 |

## 3. Log keputusan (ADR ringkas)

| ID | Keputusan | Alasan | Konsekuensi | Alternatif yang ditolak |
|----|-----------|--------|-------------|-------------------------|
| D1 | MVP bersifat **lead-gen**, tanpa pembayaran online | Transaksi properti butuh negosiasi, verifikasi, dan dokumen; payment gateway menambah kompleksitas & risiko | Pendapatan tidak terukur langsung; butuh disiplin pencatatan sales | Checkout desain digital, eskrow |
| D2 | **Monorepo Bun workspaces** | Elysia berjalan di Bun; satu perintah dev, kontrak & tipe dibagi | Semua tim harus memakai Bun | Turborepo, multi-repo |
| D3 | **Admin sebagai aplikasi terpisah** | Isolasi origin & bundel; memudahkan pembatasan akses | Dua deployment, dua konfigurasi | Route group di app yang sama |
| D4 | **Satu instance Better Auth di API** | Menghindari dua sumber sesi; guard terpusat; dipakai admin maupun customer | SvelteKit harus meneruskan cookie | Auth di masing-masing app |
| D5 | **TypeBox sebagai kontrak** | Native di Elysia, bisa dipakai validasi klien | Kurang populer dibanding Zod | Zod + konversi |
| D6 | **Soft delete untuk konten** | Menjaga integritas lead & SEO | Query harus memfilter `deletedAt` | Hard delete |
| D7 | **Akun publik masuk MVP, terbatas pada pemantauan progres** | Pemilik produk memutuskan pengunjung perlu melihat status pengajuannya (Q1) | +1 sprint, kewajiban verifikasi email & perlindungan data akun; tidak ada fitur sosial/favorit | Tanpa akun publik; akun penuh dengan favorit & checkout |
| D8 | **CMS Markdown**, bukan WYSIWYG | Sederhana, aman, mudah direview di git-like flow | Penulis harus paham Markdown dasar (disediakan preview) | Editor blok, headless CMS |
| D9 | **Cloudflare R2** untuk media | Murah, egress gratis, kompatibel S3 | Bergantung pada Cloudflare | Disk VPS, S3 |
| D10 | **Tanpa Redis** di MVP | Skala awal tidak membutuhkan; mengurangi komponen | Rate limit per instance; tidak boleh multi-replika tanpa Redis | Redis sejak awal |
| D11 | **Hanya bahasa Indonesia** | Pasar awal Indonesia; mengurangi effort & risiko konten | Investor asing belum terlayani | ID+EN |
| D12 | **8 sprint / ±15 minggu** | Tambahan akun publik & portofolio proyek menaikkan effort | Beban developer 97% kapasitas; tanpa buffer lingkup | 7 sprint dengan lingkup lama |
| D13 | **Portofolio proyek masuk MVP** | Ada proyek yang boleh dipublikasikan (Q4); bukti sosial penting untuk lahan & investasi | +1 model, +2 halaman, +CRUD admin | Menunda proyek ke fase 2 |
| D14 | **Estimasi biaya bangun tidak ditampilkan publik** | Menghindari ekspektasi harga yang tidak mengikat (Q8) | Data tetap disimpan untuk sales; UI publik tidak memuatnya | Menampilkan dengan disclaimer |
| D15 | **Tanpa WhatsApp gateway** | Email dinilai cukup pada volume awal (Q7) | Notifikasi bergantung pada email; risiko email masuk spam dimitigasi dengan domain terautentikasi | Gateway berbayar sejak MVP |
| D16 | **Satu peran internal (`admin`) + `super_admin`** | Semua lead ditangani admin (Q6); peran tambahan tanpa pembedaan tugas hanya menambah kompleksitas | Tidak ada pembatasan per tim; kehati-hatian lewat audit log | Peran `staff` dengan akses terbatas |

Keputusan dapat diubah, tetapi perubahan harus mencatat: alasan baru, dampak jadwal/biaya, dan siapa yang menyetujui.

## 4. Register risiko

Skor = probabilitas (1–5) × dampak (1–5). Prioritas: ≥15 tinggi, 8–14 sedang, ≤7 rendah.

| ID | Risiko | Kategori | P | D | Skor | Mitigasi | Pemilik |
|----|--------|----------|:-:|:-:|:----:|----------|---------|
| R1 | Konten (render, foto, artikel) belum siap saat rilis | Konten | 5 | 5 | **25** | Belum ada PIC konten khusus (Q9): jadwalkan blok waktu tim internal 2×/minggu; pesan jasa render di Sprint 1; target 6 desain siap sebelum Sprint 3; siapkan daftar aset per desain | Manajemen |
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
| R19 | Akun publik membuka permukaan serangan baru (credential stuffing, enumerasi akun, spam registrasi) | Keamanan | 3 | 4 | 12 | Verifikasi email wajib, rate limit login & registrasi, Turnstile di form daftar, pesan error seragam, audit akses | Tech lead |
| R20 | Data pribadi akun menambah kewajiban UU PDP (hak akses/hapus) | Legal | 3 | 4 | 12 | Kebijakan privasi diperluas, prosedur permintaan ≤ 30 hari, minimasi data, anonimisasi saat penghapusan | Manajemen |
| R21 | Publikasi proyek melanggar kerahasiaan klien/investor | Legal/Relasi | 2 | 4 | 8 | Persetujuan tertulis per proyek sebelum publish; field `isPublished` default `false`; tanpa angka keuangan sensitif | Manajemen |
| R22 | Tanpa estimasi biaya publik, calon pembeli desain ragu atau membanjiri sales dengan pertanyaan harga | Bisnis | 3 | 2 | 6 | Tampilkan `priceFrom` paket desain, FAQ biaya, artikel estimasi biaya sebagai jawaban tidak langsung | Marketing |
| R23 | Semua lead ditangani satu tim admin tanpa routing → lead menumpuk saat sibuk | Operasional | 3 | 3 | 9 | Antrean tunggal + prioritas + filter "belum dihubungi"; tinjauan harian; opsi routing di fase 2 | Sales lead |

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
| 2026-10-23 | 1.1 | Q1–Q10 dijawab; **akun publik** dan **portofolio proyek** masuk MVP; peran `staff` dihapus; estimasi biaya bangun tidak ditampilkan; WhatsApp gateway dihapus; effort 155 → 185 pd; jadwal 7 → 8 sprint | Keputusan pemilik produk atas pertanyaan terbuka | Pemilik produk |

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
| A5 | Tim 2 developer + desainer/QA paruh waktu | Jadwal 15 minggu |
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
