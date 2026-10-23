# 07 — Backlog & Rencana Sprint

> Kembali ke [index](./README.md) · Sebelumnya: [06](./06-ux-sitemap-wireframe.md) · Berikutnya: [08](./08-estimasi-biaya.md)

---

## 1. Cara membaca dokumen ini

- **Epic** = kelompok kerja dengan satu hasil yang bisa didemokan.
- **Task** = unit kerja ≤ 4 person-day; bila lebih, dipecah.
- **pd** = person-day (1 hari kerja satu orang, ±6 jam fokus efektif).
- **Acceptance** = kondisi yang harus benar agar task dianggap selesai (bukan sekadar "kode sudah ditulis").
- Urutan sprint adalah **urutan ketergantungan**, bukan tanggal. Tidak ada tanggal mutlak.

**Asumsi kapasitas:** 2 developer full-time (1 backend-leaning, 1 frontend-leaning), desainer paruh waktu, QA paruh waktu. Kapasitas developer per sprint 2 minggu = 20 pd; Sprint 0 = 1 minggu = 10 pd.

## 2. Ringkasan epic

| Epic | Nama | Hasil yang bisa didemokan | Sprint |
|------|------|---------------------------|--------|
| E0 | Fondasi | Repo jalan, DB & auth siap, staging hidup | 0 |
| E1 | Katalog publik | Pengunjung bisa menjelajah desain | 1 |
| E2 | Penangkapan lead | Tiga formulir mengirim lead nyata | 2 |
| E3 | CRM admin | Sales mengelola lead end-to-end | 3 |
| E4 | CMS & pengaturan | Konten dikelola tanpa developer | 4 |
| E5 | Konten & penyempurnaan | Situs lengkap, konten terisi | 5 |
| E6 | Pengerasan & rilis | Produksi stabil, tim terlatih | 6 |

## 3. Rincian task

### Sprint 0 — Fondasi (10 pd)

**Sprint goal:** satu perintah `bun run dev` menyalakan API + web + admin, terhubung ke Postgres lokal, dengan login admin berfungsi dan CI hijau.

| ID | Task | Acceptance | pd | Depends |
|----|------|------------|:--:|---------|
| E0-01 | Setup monorepo Bun workspaces | `bun install` bersih; `tsc --noEmit` & `svelte-check` lulus di semua paket; ESLint + Prettier + aturan `no-restricted-imports` aktif; husky pre-commit menjalankan lint-staged | 2 | — |
| E0-02 | Docker compose dev + env | `docker compose up` menyalakan Postgres 16 + Mailpit; `.env.example` lengkap; `env.ts` menolak start bila variabel wajib kosong | 1 | E0-01 |
| E0-03 | Prisma schema v1 + migrasi + seed | Migrasi pertama sukses; `prisma studio` menampilkan semua tabel; seed idempoten (dijalankan 2× hasil sama) | 3 | E0-02 |
| E0-04 | Better Auth + guard + CORS | Login/logout via curl berhasil; cookie `httpOnly`; `/admin/*` tanpa sesi → 401; CORS hanya mengizinkan origin web/admin; rate limit login aktif | 3 | E0-03 |
| E0-05 | CI + staging skeleton | GitHub Actions: typecheck, lint, unit test, build; deploy staging otomatis dari branch `main`; URL staging dapat diakses | 1 | E0-03 |

> Catatan: UI kit **belum** dibuat di sprint ini agar fondasi data/auth selesai lebih dulu. Halaman masih memakai HTML polos.

### Sprint 1 — Katalog publik (20 pd)

**Sprint goal:** pengunjung dapat membuka beranda, memfilter katalog, dan membaca detail desain dari data nyata di database.

| ID | Task | Acceptance | pd | Depends |
|----|------|------------|:--:|---------|
| E1-01 | UI kit + tema + shell aplikasi | Button/Input/Select/Badge/Card/Skeleton tersedia dan terdokumentasi; header/footer web + sidebar admin; tema daisyUI dari satu preset; halaman contoh semua komponen | 4 | E0-01 |
| E1-02 | API daftar desain (filter, cari, urut, paginasi) | Semua filter di [05 §4.2](./05-spesifikasi-api.md#42-get-publicdesigns) berfungsi; query < 100 ms pada seed 12 desain; hasil hanya `PUBLISHED` | 3 | E0-03 |
| E1-03 | API detail & terkait | Detail mengembalikan media + tag + seo; `DRAFT`/`ARCHIVED` → 404; related maks 4 dengan fallback | 2 | E1-02 |
| E1-04 | Halaman beranda | Section sesuai [06 §4.1](./06-ux-sitemap-wireframe.md#41-beranda-); data dari API; section kosong disembunyikan; skor Lighthouse awal ≥ 85 | 2 | E1-01, E1-02 |
| E1-05 | Halaman katalog | Filter sidebar (desktop) & drawer (mobile); state di URL; pagination; empty state; skeleton; kartu sesuai desain | 4 | E1-01, E1-02 |
| E1-06 | Halaman detail desain | Galeri + lightbox keyboard; tab denah; spesifikasi; sticky CTA mobile; 404 kustom | 3 | E1-01, E1-03 |
| E1-07 | Pipeline media + seed 12 desain | Presign admin berfungsi; varian 400/800/1600 dibuat; cover & alt tersimpan; seed menghasilkan 12 desain dengan gambar nyata | 2 | E0-02 |

### Sprint 2 — Penangkapan lead (20 pd)

**Sprint goal:** lead dari ketiga alur tersimpan ke database, memicu notifikasi, dan tampil di halaman terima kasih dengan nomor referensi.

| ID | Task | Acceptance | pd | Depends |
|----|------|------------|:--:|---------|
| E2-01 | SEO dasar | Title/description unik tiap halaman; canonical; OG/Twitter card; `sitemap.xml` dinamis; `robots.txt`; JSON-LD Organization/WebSite/Breadcrumb | 2 | E1-04, E1-05, E1-06 |
| E2-02 | API `POST /public/leads` | 3 tipe tervalidasi; normalisasi nomor; dedup 60 s; `Idempotency-Key`; referensi `AZT-…` unik; transaksi atomik lead + detail | 4 | E0-03, E0-04 |
| E2-03 | Anti-spam | Honeypot, Turnstile server-side, waktu isi, `spamScore`; bot mendapat 201 palsu; rate limit sesuai [05 §6](./05-spesifikasi-api.md#6-rate-limit); ada unit test untuk tiap sinyal | 2 | E2-02 |
| E2-04 | Presign unggah publik + pemindahan objek | Maks 5 file/5 MB; MIME divalidasi; objek `tmp` dipindah ke `leads/{id}/`; objek tak terpakai dibersihkan | 2 | E0-02 |
| E2-05 | Form tanya desain + form investasi | Validasi klien & server konsisten; prefill `designId`; submit sukses → redirect; error per field; berfungsi tanpa JS | 3 | E1-06, E2-02 |
| E2-06 | Form pengajuan lahan 3 langkah | Stepper; validasi per langkah; draft `sessionStorage`; unggah foto dengan progres & hapus; kembali tanpa kehilangan data | 4 | E2-02, E2-04 |
| E2-07 | Halaman terima kasih + funnel event | Referensi tampil & bisa disalin; pesan lanjutan per tipe; `noindex`; event `lead_submit_success` terkirim | 2 | E2-05, E2-06 |
| E2-08 | Notifikasi lead baru | Email terkirim < 60 s; retry 3×; kegagalan dicatat sebagai aktivitas `SYSTEM`; tidak menggagalkan respons | 1 | E2-02 |

### Sprint 3 — CRM admin (20 pd)

**Sprint goal:** sales dapat melihat, memfilter, menghubungi, dan memperbarui status lead tanpa membuka spreadsheet.

| ID | Task | Acceptance | pd | Depends |
|----|------|------------|:--:|---------|
| E3-01 | Shell admin + login + guard | Login/logout; redirect `?next=`; guard di `hooks.server.ts`; menu sesuai peran; sesi kedaluwarsa → login | 3 | E0-04, E1-01 |
| E3-02 | API admin lead (list/detail) | Filter & pencarian sesuai [05 §5.1](./05-spesifikasi-api.md#51-lead); hanya data yang diizinkan; detail memuat tipe + lampiran + aktivitas | 3 | E2-02 |
| E3-03 | Tabel lead + filter bar | Kolom lengkap; tab cepat (Baru/Belum dihubungi/Milik saya); state di URL; badge jumlah; pagination; empty state | 3 | E3-01, E3-02 |
| E3-04 | Detail lead + panel samping | Data kontak & tipe tampil terstruktur; panel status/prioritas/assignee/nilai/follow-up dapat disimpan | 3 | E3-02 |
| E3-05 | Transisi status + aktivitas + timeline | Matriks transisi ditegakkan; `LOST` wajib alasan; aktivitas memperbarui `lastContactedAt`; timeline urut terbaru | 3 | E3-04 |
| E3-06 | Lampiran aman | URL bertanda tangan 15 menit; preview gambar; non-admin → 403; objek tidak dapat diakses tanpa tanda tangan | 1 | E3-02 |
| E3-07 | Ekspor CSV | Mengikuti filter aktif; header & encoding benar (UTF-8 BOM agar Excel rapi); maks 5.000 baris | 1 | E3-03 |
| E3-08 | Dashboard ringkas | 4 kartu + grafik 30 hari; angka cocok dengan daftar; waktu muat < 2 s | 3 | E3-02 |

### Sprint 4 — CMS & pengaturan (18 pd)

**Sprint goal:** staf non-teknis dapat menambah desain, artikel, FAQ, testimoni, dan mengubah teks/CTA situs.

| ID | Task | Acceptance | pd | Depends |
|----|------|------------|:--:|---------|
| E4-01 | CRUD desain + alur publish | Form lengkap dengan validasi; slug otomatis & bisa diubah; draft/publish/archive; validasi publish di [05 §5.2](./05-spesifikasi-api.md#52-desain); duplikasi desain | 4 | E1-02 |
| E4-02 | Media manager | Unggah banyak file; urutkan drag-drop; pilih cover; hapus (objek R2 ikut); `alt` wajib sebelum publish | 3 | E1-07, E4-01 |
| E4-03 | CRUD artikel + halaman publik | Editor Markdown + preview; publish/archive; daftar & detail publik dengan pagination; `Article` JSON-LD | 4 | E2-01 |
| E4-04 | FAQ & testimoni | CRUD; urutan; aktif/nonaktif; tampil di `/faq` dan beranda; `FAQPage` JSON-LD | 2 | E4-03 |
| E4-05 | Pengaturan situs | 7 kunci setting dapat diubah; kontak/hero/template WA langsung dipakai web; validasi nilai; audit tercatat | 3 | E3-01 |
| E4-06 | Pengguna & audit log | Super admin dapat membuat/menonaktifkan pengguna & mengubah peran; tidak bisa menonaktifkan diri; audit menampilkan aktor, aksi, waktu | 2 | E3-01 |

### Sprint 5 — Konten & penyempurnaan (15 pd dev + 5 pd konten)

**Sprint goal:** situs terasa lengkap dan kredibel; performa serta aksesibilitas memenuhi target.

| ID | Task | Acceptance | pd | Depends |
|----|------|------------|:--:|---------|
| E5-01 | Halaman statis & 404 | Tentang, kontak (+form `GENERAL`), FAQ, privasi, syarat, 404; semua konten dari CMS/settings | 3 | E4-05 |
| E5-02 | Cache & invalidasi | Header cache sesuai [03 §7](./03-arsitektur-teknis.md#7-rendering--caching); purge terpicu saat publish; konten baru tampil ≤ 5 menit meski purge gagal | 2 | E4-01 |
| E5-03 | Observability | Sentry menerima error API & frontend dengan `requestId`; log terstruktur tanpa data pribadi; uptime monitor aktif | 2 | E0-05 |
| E5-04 | Job terjadwal | Cleanup spam 90 hari, retensi 24 bulan, orphan media, digest harian; idempoten; tercatat di log | 2 | E3-02 |
| E5-05 | Input konten awal | 12 desain, 8 artikel, 10 FAQ, 3 testimoni (nyata), teks semua halaman | 5 | E4-01..E4-05 |
| E5-06 | Audit aksesibilitas | axe tanpa error kritis pada 6 halaman utama; navigasi keyboard & fokus lulus; perbaikan diterapkan | 2 | E5-01 |
| E5-07 | Audit performa | Lighthouse mobile ≥ 90 (Perf/SEO/A11y/BP) pada 4 halaman; LCP ≤ 2,5 s; gambar WebP/AVIF + `srcset` | 2 | E5-01 |
| E5-08 | Review copy & legal | Tidak ada klaim berlebihan; disclaimer investasi & estimasi biaya ada; privasi/syarat disetujui pihak berwenang | 2 | E5-01 |

### Sprint 6 — Pengerasan & rilis (20 pd)

**Sprint goal:** bukti bahwa sistem tahan dipakai, lalu peluncuran ke produksi dengan pemantauan aktif.

| ID | Task | Acceptance | pd | Depends |
|----|------|------------|:--:|---------|
| E6-01 | E2E alur kritis | Playwright: katalog → detail → submit lead; form lahan 3 langkah + foto; login admin → ubah status; publish desain tampil di web | 3 | E2-07, E3-05, E4-01 |
| E6-02 | Security review | Checklist [09 §7](./09-qa-test-plan.md#7-checklist-keamanan) lulus; header keamanan aktif; tidak ada endpoint tanpa guard; dependency audit bersih dari high/critical | 2 | E3-01 |
| E6-03 | Backup & runbook | Backup harian teruji restore ke DB bersih; RPO/RTO terukur; runbook deploy/rollback/insiden tersedia | 2 | E5-03 |
| E6-04 | UAT | Sales & manajemen menjalankan skenario UAT; semua temuan blocker & major ditutup | 4 | E6-01 |
| E6-05 | Perbaikan bug | Bug hasil UAT/audit; regresi diuji ulang | 3 | E6-04 |
| E6-06 | Peluncuran produksi | DNS, TLS, env produksi, migrasi, smoke test, monitoring, handover & pelatihan 1 jam | 3 | E6-03, E6-05 |
| E6-07 | Buffer rilis | Cadangan untuk gangguan tak terduga | 3 | — |

## 4. Jadwal sprint

| Sprint | Durasi | Kapasitas dev | Beban dev | Fokus | Demo |
|--------|--------|:-------------:|:---------:|-------|------|
| 0 | 1 minggu | 10 pd | 10 pd | Fondasi | `bun run dev` + login admin |
| 1 | 2 minggu | 20 pd | 20 pd | Katalog | Jelajah katalog & detail |
| 2 | 2 minggu | 20 pd | 20 pd | Lead | Kirim 3 jenis lead |
| 3 | 2 minggu | 20 pd | 20 pd | CRM | Kelola lead end-to-end |
| 4 | 2 minggu | 20 pd | 18 pd | CMS | Tambah desain & artikel |
| 5 | 2 minggu | 20 pd | 15 pd | Konten & kualitas | Situs lengkap + skor audit |
| 6 | 2 minggu | 20 pd | 20 pd | Rilis | Produksi |
| **Total** | **13 minggu** | **130 pd** | **123 pd** | | |

Beban developer 123/130 pd ≈ **95% kapasitas**. Ini disengaja untuk jadwal tercepat, tetapi **tidak menyisakan ruang untuk perubahan lingkup**. Jika ingin buffer 15%, tambahkan 2 minggu (total ±15 minggu).

Effort non-developer (tidak masuk 123 pd): desain UI 12 pd, QA 12 pd, konten 8 pd. Rincian: [08 §3](./08-estimasi-biaya.md#3-rincian-effort).

## 5. Jalur kritis

```text
E0-01 ─► E0-03 ─► E0-04 ─┬─► E2-02 ─► E2-03 ─► E2-05 ─► E2-07 ─► E6-01 ─► E6-04 ─► E6-06
                        │                └─► E2-06 ─┘
E0-01 ─► E1-01 ─► E1-02 ─► E1-05 ─► E1-06 ─┘
                                     │
                                     └─► E2-01 ─► E4-03 ─► E5-05 ─► E5-07 ─► E6-04
E0-04 ─► E3-01 ─► E3-02 ─► E3-05 ─► E6-01
```

Konsekuensi:

1. **E0-03 (skema Prisma) dan E0-04 (auth) tidak boleh terlambat** — semua sprint bergantung padanya.
2. Konten (E5-05) bergantung pada CMS selesai di Sprint 4; tim konten harus menyiapkan materi **sejak Sprint 1** agar tidak menjadi bottleneck.
3. UAT (E6-04) membutuhkan sales yang sudah memakai sistem di Sprint 3–5; jangan menunda pelatihan sampai akhir.

## 6. Definition of Ready (DoR)

Task boleh masuk sprint bila:

- [ ] Tujuan & acceptance criteria tertulis dan dapat diuji.
- [ ] Desain UI (bila ada) tersedia atau disepakati.
- [ ] Dependensi teknis sudah selesai atau dijadwalkan lebih dulu.
- [ ] Estimasi ≤ 4 pd (bila lebih, dipecah).
- [ ] Pertanyaan terbuka yang memblokir sudah dijawab.

## 7. Definition of Done (DoD)

- [ ] Acceptance criteria terpenuhi dan dibuktikan (test/screenshot/demo).
- [ ] Unit/integrasi test ditambahkan untuk logika baru; suite hijau.
- [ ] `bun run check` dan lint bersih.
- [ ] Tidak ada data sensitif di log atau respons.
- [ ] Pesan error & empty state ditangani (bukan hanya happy path).
- [ ] Aksesibilitas dasar: label, fokus, kontras.
- [ ] Dokumentasi teknis terkait diperbarui (API/DB/README).
- [ ] Di-review minimal 1 developer lain dan di-merge ke `main`.
- [ ] Ter-deploy ke staging dan dapat diuji.

## 8. Backlog fase 2 (belum dikerjakan)

Dicatat agar tidak hilang; **tidak** masuk estimasi MVP.

| ID | Item | Nilai |
|----|------|-------|
| F2-01 | Pembayaran online + order desain | Monetisasi langsung |
| F2-02 | Unduhan file desain otomatis | Skalabilitas penjualan |
| F2-03 | Akun publik & riwayat pengajuan | Retensi & transparansi |
| F2-04 | Dashboard investor (proyek, laporan, distribusi) | Kepercayaan investor |
| F2-05 | WhatsApp Business API (notifikasi & balasan otomatis) | Kecepatan respons |
| F2-06 | Pengingat follow-up & penugasan otomatis | Disiplin sales |
| F2-07 | Kategori & tag dinamis dari admin | Skalabilitas katalog |
| F2-08 | Multi-bahasa (ID/EN) | Investor asing |
| F2-09 | Kalkulator biaya bangun interaktif | Engagement & lead |
| F2-10 | Portal pemilik lahan (status pengajuan) | Transparansi |
| F2-11 | A/B testing hero & CTA | Optimasi konversi |
| F2-12 | Integrasi CRM eksternal (HubSpot dll.) | Bila tim membesar |
| F2-13 | Program referral | Akuisisi |
| F2-14 | PWA & mode offline katalog | Mobilitas |

## 9. Manajemen perubahan

1. Permintaan baru dicatat sebagai change request dengan dampak estimasi & sprint yang terdampak.
2. Perubahan yang menambah ≤ 1 pd dan tidak mengubah kontrak API dapat masuk sprint berjalan bila ada buffer.
3. Perubahan yang mengubah lingkup MVP (mis. menambah pembayaran) **wajib** mengganti task lain dengan bobot setara — bukan menambah beban.
4. Setiap perubahan dicatat di [12 §5](./12-risiko-asumsi-keputusan.md#5-change-log).
