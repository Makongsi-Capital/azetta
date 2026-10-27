# 12 — Risiko, Asumsi & Keputusan

> Kembali ke [index](./README.md) · Sebelumnya: [11](./11-deployment-operations.md)

---

## 1. Ringkasan

Dokumen ini mencatat tiga hal yang menentukan keberhasilan rencana:

1. **Keputusan atas pertanyaan terbuka** — Q1–Q10 dijawab pada v1.1, Q11–Q12 dijawab pada v1.2 (27 Oktober 2026); rincian yang sengaja ditunda dicatat terpisah.
2. **Keputusan arsitektur/produk** — agar tidak diperdebatkan ulang tanpa alasan baru.
3. **Risiko** — beserta mitigasi dan pemiliknya.

## 2. Keputusan atas pertanyaan terbuka

Seluruh pertanyaan di bawah **sudah dijawab**: Q1–Q10 pada 23 Oktober 2026 (v1.1) dan Q11–Q12 pada 27 Oktober 2026 (v1.2). Jawaban ini menjadi baseline dan sudah diterapkan ke seluruh dokumen terkait.

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
| Q11 | Apakah akun publik memakai verifikasi email wajib? | **Ya** — akun wajib memverifikasi email sebelum dapat melihat pengajuan | [01 FR-ACC-02](./01-prd.md#55-modul-akun-publik), [03 §6.1](./03-arsitektur-teknis.md#61-konfigurasi-better-auth) |
| Q12 | Apakah pemilik akun boleh menghapus akun sendiri di MVP? | **Hanya mengajukan permohonan** — pemohon mengirim permohonan dari `/akun/profil`; admin melihatnya sebagai daftar dan memproses penghapusan. Penghapusan/anonimisasi otomatis ditunda | Model `AccountDeletionRequest`, endpoint `/me/deletion-request` & `/admin/account-deletion-requests`, halaman profil + admin, Sprint 5 (+2 pd); [04 §3.8](./04-data-model.md#38-accountdeletionrequest), [05 §4.7](./05-spesifikasi-api.md#47-akun-saya) |

Rincian yang sengaja **belum diputuskan** (tidak memblokir MVP, tetapi harus jelas sebelum rilis):

| # | Rincian | Status | Dibutuhkan sebelum |
|---|---------|--------|--------------------|
| Q12a | Mekanisme penghapusan/anonimisasi setelah permohonan disetujui (manual vs job, perlakuan data lead) | **Ditunda** — pada MVP admin memproses manual di luar sistem; target ≤ 30 hari tetap berlaku | Sprint 7 (sebelum rilis) |
| Q12b | Apakah permohonan dapat dibatalkan pemohon sebelum diproses | **Ditunda** — belum ada endpoint pembatalan | Sprint 5 |

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
| D8 | **CMS WYSIWYG berbasis Tiptap**, bukan Markdown | Tim internal non-teknis butuh editor visual; Tiptap ringan, berlisensi MIT, extensible, dan tidak mengikat ke layanan eksternal | Konten disimpan sebagai **HTML tersanitasi**; sanitasi wajib di server (allowlist tag/atribut) sebelum disimpan dan dirender; editor hanya dimuat di admin; estimasi E4-03 tetap 4 pd | Markdown textarea + preview, headless CMS |
| D9 | **Cloudflare R2** untuk media | Murah, egress gratis, kompatibel S3 | Bergantung pada Cloudflare | Disk VPS, S3 |
| D10 | **Tanpa Redis** di MVP | Skala awal tidak membutuhkan; mengurangi komponen | Rate limit per instance; tidak boleh multi-replika tanpa Redis | Redis sejak awal |
| D11 | **Hanya bahasa Indonesia** | Pasar awal Indonesia; mengurangi effort & risiko konten | Investor asing belum terlayani | ID+EN |
| D12 | **8 sprint / ±15 minggu** | Tambahan akun publik & portofolio proyek menaikkan effort | Beban developer 98% kapasitas; tanpa buffer lingkup | 7 sprint dengan lingkup lama |
| D13 | **Portofolio proyek masuk MVP** | Ada proyek yang boleh dipublikasikan (Q4); bukti sosial penting untuk lahan & investasi | +1 model, +2 halaman, +CRUD admin | Menunda proyek ke fase 2 |
| D14 | **Estimasi biaya bangun tidak ditampilkan publik** | Menghindari ekspektasi harga yang tidak mengikat (Q8) | Data tetap disimpan untuk sales; UI publik tidak memuatnya | Menampilkan dengan disclaimer |
| D15 | **Tanpa WhatsApp gateway** | Email dinilai cukup pada volume awal (Q7) | Notifikasi bergantung pada email; risiko email masuk spam dimitigasi dengan domain terautentikasi | Gateway berbayar sejak MVP |
| D16 | **Satu peran internal (`admin`) + `super_admin`** | Semua lead ditangani admin (Q6); peran tambahan tanpa pembedaan tugas hanya menambah kompleksitas | Tidak ada pembatasan per tim; kehati-hatian lewat audit log | Peran `staff` dengan akses terbatas |
| D17 | **Hapus akun lewat permohonan ke admin**, bukan self-service | Pemilik produk memutuskan (Q12); penghapusan menyentuh data lead dan kewajiban retensi sehingga perlu keputusan admin | Ada daftar permohonan di panel admin; penghapusan data tetap manual di MVP; tidak ada tombol hapus langsung | Penghapusan mandiri seketika; tiket manual lewat email |

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
| R24 | Permohonan hapus akun menumpuk dan melewati target ≤ 30 hari | Legal/Operasional | 3 | 4 | 12 | Daftar `PENDING` di panel admin, tinjauan mingguan, penanggung jawab eksplisit, catat tanggal proses | Manajemen |
| R25 | XSS melalui HTML yang dihasilkan editor WYSIWYG | Keamanan | 3 | 5 | **15** | Sanitasi server-side ber-allowlist, larang `script`/`iframe`/event handler/`javascript:`, uji payload XSS otomatis, CSP ketat | Tech lead |

### 4.1 Rencana respons risiko tinggi (skor ≥ 15)

| Risiko | Tindakan konkret | Tenggat |
|--------|------------------|---------|
| R1 | Tetapkan daftar 12 desain + PIC aset; pesan jasa render; buffer konten 2 minggu sebelum Sprint 5 | Sebelum Sprint 2 |
| R2 | Tentukan sales lead, jam kerja, dan aturan eskalasi; aktifkan alert lead baru | Sebelum Sprint 3 |
| R5 | Tandatangani ruang lingkup MVP (dokumen ini) oleh manajemen | Sebelum Sprint 1 |
| R25 | Terapkan sanitasi HTML ber-allowlist + uji XSS otomatis pada konten Tiptap | Sebelum Sprint 4 |

## 5. Change Log

| Tanggal | Versi | Perubahan | Alasan | Oleh |
|---------|-------|-----------|--------|------|
| 2026-10-23 | 1.0 | Dokumen awal dibuat | Perencanaan MVP | — |
| 2026-10-23 | 1.1 | Q1–Q10 dijawab; **akun publik** dan **portofolio proyek** masuk MVP; peran `staff` dihapus; estimasi biaya bangun tidak ditampilkan; WhatsApp gateway dihapus; effort 155 → 185 pd; jadwal 7 → 8 sprint | Keputusan pemilik produk atas pertanyaan terbuka | Pemilik produk |
| 2026-10-27 | 1.2 | Q11 dijawab (verifikasi email wajib); Q12 dijawab (**permohonan hapus akun** lewat admin, tanpa self-service); model + endpoint + halaman terkait; effort 185 → 187 pd | Keputusan pemilik produk atas pertanyaan lanjutan | Pemilik produk |
| 2026-10-27 | 1.3 | **D8 diubah**: CMS Markdown → **WYSIWYG Tiptap** dengan penyimpanan HTML tersanitasi; risiko XSS (R25) dicatat | Permintaan pemilik produk | Pemilik produk |

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
