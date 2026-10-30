# Dokumen Perencanaan Azetta

**Versi:** 1.5 (revisi identitas visual — Brand Guidelines v1.0 + rona status)
**Tanggal:** 30 Oktober 2026
**Status:** Menunggu persetujuan pemilik produk

Dokumen ini adalah rencana lengkap pembangunan **website Azetta** — mulai dari latar belakang produk, model bisnis, arsitektur teknis, model data, spesifikasi API, desain UX, backlog pengembangan, estimasi biaya, rencana QA, strategi SEO, hingga operasional peluncuran. Identitas visual dan bahasa mengikuti [AZETTA Brand Guidelines v1.0](./AZETTA_Brand_Guidelines.pdf).

---

## 1. Ringkasan dalam satu paragraf

Azetta adalah developer properti yang menjual **gambar desain properti** dan membuka **kerja sama pengolahan lahan** dengan pemilik lahan, serta **menghimpun investor** untuk memodali pengembangan lahan. Website Azetta berfungsi sebagai **mesin akuisisi lead** (bukan e-commerce): pengunjung melihat katalog desain, portofolio proyek, dan halaman penawaran, lalu mengisi formulir minat; negosiasi dan transaksi dilakukan **di luar aplikasi** oleh tim admin Azetta. Pengunjung dapat **membuat akun** untuk memantau status pengajuannya. Rilis pertama (MVP) mencakup katalog desain, portofolio proyek, tiga alur formulir lead (beli desain, daftar lahan, minat investasi), akun publik untuk pemantauan progres, serta panel admin/CRM untuk mengelola lead, konten, dan pengaturan situs.

---

## 2. Peta dokumen

| # | Dokumen | Isi | Pembaca utama |
|---|---------|-----|---------------|
| 00 | [Ringkasan Eksekutif](./00-ringkasan-eksekutif.md) | Masalah, solusi, ruang lingkup, KPI, ringkasan waktu & biaya | Manajemen, stakeholder |
| 01 | [PRD — Produk & Kebutuhan](./01-prd.md) | Persona, user journey, kebutuhan fungsional & non-fungsional, ruang lingkup in/out | Produk, developer |
| 02 | [Model Bisnis & Funnel Lead](./02-model-bisnis-funnel.md) | Tiga aliran pendapatan, definisi funnel, SLA follow-up, lead scoring | Sales, manajemen |
| 03 | [Arsitektur Teknis](./03-arsitektur-teknis.md) | Monorepo, stack, alur auth, rendering, caching, deployment topology | Developer, DevOps |
| 04 | [Model Data & Skema Prisma](./04-data-model.md) | ERD, kamus data, skema Prisma lengkap, index, seed, retensi | Backend, DBA |
| 05 | [Spesifikasi API](./05-spesifikasi-api.md) | Konvensi, endpoint publik & admin, contoh request/response, rate limit | Backend, frontend |
| 06 | [Sitemap, UX & Wireframe](./06-ux-sitemap-wireframe.md) | Peta halaman, spesifikasi tiap halaman, field form, wireframe | Desainer, frontend, QA |
| 07 | [Backlog & Rencana Sprint](./07-backlog-sprint.md) | Epic, task, acceptance criteria, urutan sprint | PM, developer |
| 08 | [Estimasi Effort & Biaya](./08-estimasi-biaya.md) | Person-day, komposisi tim, biaya infrastruktur & vendor | Manajemen |
| 09 | [Rencana QA & Pengujian](./09-qa-test-plan.md) | Matriks tes, kriteria rilis, UAT, checklist keamanan & aksesibilitas | QA, developer |
| 10 | [Strategi SEO & Konten](./10-seo-konten.md) | Struktur URL, keyword map, schema markup, kalender konten | Marketing |
| 11 | [Deployment & Operasional](./11-deployment-operations.md) | Pipeline CI/CD, environment, backup, monitoring, runbook | DevOps |
| 12 | [Risiko, Asumsi & Keputusan](./12-risiko-asumsi-keputusan.md) | Register risiko, asumsi, pertanyaan terbuka, log keputusan | Semua pihak |
| R | [AZETTA Brand Guidelines v1.0](./AZETTA_Brand_Guidelines.pdf) | Prinsip merek, logo, palet monokrom, tipografi, elemen grafis, format, suara & bahasa, kontak | Semua pihak |

Urutan baca yang disarankan:

- **Manajemen:** 00 → 02 → 08 → 12
- **Produk/desain:** 01 → 02 → 06 → 07
- **Engineering:** 03 → 04 → 05 → 07 → 09 → 11
- **Marketing:** 01 → 02 → 06 → 10

Semua pihak: Brand Guidelines (`AZETTA_Brand_Guidelines.pdf`) sebelum menyetujui materi visual atau naskah publik.

---

## 3. Keputusan kunci (dikonfirmasi)

| Topik | Keputusan |
|-------|-----------|
| Model bisnis yang dicakup | Jual gambar desain, kerja sama lahan, penghimpunan investor |
| Cakupan MVP | **Lead-gen saja** — belum ada transaksi/pembayaran online |
| Titik konversi | Formulir lead → follow-up manual via WhatsApp/telepon/email |
| Akun publik | **Ada** — untuk memantau progres pengajuan (verifikasi email wajib); hapus akun lewat **permohonan ke admin**, bukan self-service |
| Portofolio proyek | **Ada** — halaman `/proyek` dari CMS |
| Harga & biaya | Harga paket "mulai dari" ditampilkan; **estimasi biaya bangun tidak** ditampilkan publik |
| Notifikasi | Email saja (tanpa WhatsApp gateway) |
| Peran internal | `admin` + `super_admin` — semua lead ditangani admin, tanpa routing per tipe |
| Domain | `azetta.id` (+ `admin.`, `api.`, `media.`) |
| Pasar | Indonesia, bahasa Indonesia |
| Frontend customer | SvelteKit + Tailwind + daisyUI + Iconify |
| Frontend admin | SvelteKit (aplikasi terpisah) + Tailwind + daisyUI |
| Identitas visual | **Monokrom** (ink/paper/mist/line) untuk permukaan & aksi, huruf Arial tanpa webfont, bidang polos tanpa bayangan — mengikuti Brand Guidelines v1.0; empat rona status muted sebagai pengecualian (D20) |
| Bahasa materi publik | Indonesia, sapaan "Anda", kalimat pendek, tanpa klaim hasil; nomor WhatsApp tidak dicetak di materi pemasaran (web tetap memakai tautan `wa.me`, D19) |
| Backend | ElysiaJS (Bun) + Better Auth + Prisma |
| Database | PostgreSQL |
| Editor konten | Tiptap (WYSIWYG), konten disimpan sebagai HTML tersanitasi |
| Struktur repo | Monorepo (Bun workspaces) |
| Target waktu | Tidak ada tanggal mutlak — 8 sprint relatif, ±15 minggu (lihat [07](./07-backlog-sprint.md)) |

Rincian alasan tiap keputusan ada di [12 — Log Keputusan](./12-risiko-asumsi-keputusan.md#3-log-keputusan-adr-ringkas).

---

## 4. Konvensi penulisan

- **Mata uang:** Rupiah penuh tanpa desimal, ditulis `Rp 1.500.000` (spasi setelah `Rp`, titik ribuan). Desimal memakai koma: `11,3%`.
- **Istilah lead:** "lead" = orang yang mengisi formulir minat; "prospect" = lead yang sudah dikualifikasi; "deal" = kerja sama yang disepakati (dicatat di luar sistem pada MVP).
- **Penamaan teknis:** `camelCase` untuk JSON/TypeScript, `PascalCase` untuk model Prisma, `snake_case` untuk kolom database hasil `@map` bila diperlukan.
- **Status dokumen:** draft → review → disetujui. Setiap perubahan besar dicatat di bagian *Change Log* pada [12](./12-risiko-asumsi-keputusan.md#5-change-log).

---

## 5. Glosarium

| Istilah | Arti |
|---------|------|
| **Desain** | Paket gambar desain properti yang dijual Azetta (render, denah, spesifikasi). |
| **Lahan** | Bidang tanah milik pihak eksternal yang ditawarkan untuk dikerjasamakan. |
| **Investor** | Pihak yang menanamkan modal pada pengembangan lahan. |
| **Lead** | Data kontak + minat yang dikirim melalui formulir website. |
| **Lead type** | Klasifikasi lead: `BUY_DESIGN`, `LAND_OFFER`, `INVEST`, `GENERAL`. |
| **Funnel** | Rangkaian tahap dari kunjungan → lead → kualifikasi → deal. |
| **CRM** | Panel admin untuk mengelola lead dan aktivitas follow-up. |
| **Turnstile** | CAPTCHA dari Cloudflare untuk menahan spam bot. |
| **UU PDP** | Undang-Undang No. 27/2022 tentang Pelindungan Data Pribadi. |
| **Eden Treaty** | Klien TypeScript yang dihasilkan Elysia agar frontend memanggil API secara type-safe. |

---

## 6. Cara memakai dokumen ini

1. Q1–Q12 sudah dijawab pemilik produk dan diterapkan pada v1.2 — lihat [12 §2](./12-risiko-asumsi-keputusan.md#2-keputusan-atas-pertanyaan-terbuka). Rincian teknis penghapusan akun (Q12a) sengaja ditunda sampai sebelum rilis.
2. Setujui ruang lingkup di [01 §4](./01-prd.md#4-ruang-lingkup) — perhatikan tambahan **akun publik**, **permohonan hapus akun**, dan **portofolio proyek**.
3. Setujui backlog dan urutan sprint di [07](./07-backlog-sprint.md) (8 sprint, ±15 minggu, beban 98%).
4. Setelah disetujui, dokumen ini menjadi baseline; perubahan lingkup dicatat sebagai change request di [12 §5](./12-risiko-asumsi-keputusan.md#5-change-log).

---

## 7. Catatan penting

- Dokumen ini **belum** berisi kode. Implementasi mengikuti backlog di [07](./07-backlog-sprint.md).
- Identitas visual dan aturan bahasa materi publik mengikuti [Brand Guidelines v1.0](./AZETTA_Brand_Guidelines.pdf); token tema ada di [06 §7](./06-ux-sitemap-wireframe.md#7-inventaris-komponen-ui) dan di `apps/*/src/routes/layout.css`.
- Semua estimasi biaya adalah **rentang indikatif** berbasis asumsi yang ditulis eksplisit di [08 §2](./08-estimasi-biaya.md#2-asumsi-estimasi).
- Konten (foto, render, artikel) belum tersedia dan menjadi prasyarat peluncuran — lihat [10 §7](./10-seo-konten.md#7-rencana-konten-awal).
- **Belum ada PIC konten khusus** (Q9) dan **belum ada badan hukum** (Q10); keduanya memengaruhi risiko R1 dan materi halaman legal.
