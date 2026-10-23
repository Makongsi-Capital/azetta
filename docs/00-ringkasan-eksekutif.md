# 00 — Ringkasan Eksekutif

> Dokumen ini untuk pembaca non-teknis. Detail ada di dokumen 01–12.
> Kembali ke [index](./README.md).

---

## 1. Latar belakang

Azetta adalah developer properti yang selama ini menjual **gambar desain properti** dan menjalin **kerja sama dengan pemilik lahan**: pemilik lahan menyerahkan lahannya, Azetta mengolahnya menjadi proyek properti. Untuk membiayai pengembangan, Azetta mencari **investor**.

Saat ini seluruh proses berjalan manual: penawaran lewat WhatsApp, katalog desain dikirim sebagai file PDF, dan pendaftaran lahan/investor dicatat di spreadsheet. Akibatnya:

1. **Tidak ada aset digital yang bekerja 24 jam.** Calon pembeli desain, pemilik lahan, dan investor tidak menemukan Azetta lewat pencarian Google.
2. **Lead tidak terukur.** Tidak diketahui berapa orang melihat penawaran, berapa yang menghubungi, dan dari mana asalnya.
3. **Kualitas presentasi tidak konsisten.** Tidak semua prospek menerima informasi yang sama rapi dan lengkap.
4. **Lead mudah hilang.** Tanpa pencatatan, follow-up bergantung pada ingatan individu.

Rujukan pengalaman pengguna: [ruma.id](https://ruma.id/) — katalog desain rumah dengan filter, halaman detail berisi render + denah + estimasi biaya, dan CTA konsultasi.

## 2. Solusi yang diusulkan

Satu website publik (SvelteKit) + satu panel admin internal (SvelteKit) + satu API (ElysiaJS):

```text
                  ┌──────────────────────────────────────┐
   Pengunjung ───► │  Website publik (azetta.id)          │
   (Google/IG/Ads) │  · Katalog & detail desain           │
                  │  · Halaman kerja sama lahan          │
                  │  · Halaman investasi                 │
                  │  · Artikel/edukasi (SEO)             │
                  └───────────────┬──────────────────────┘
                                  │ form lead (JSON)
                                  ▼
                  ┌──────────────────────────────────────┐
                  │  API Elysia + Better Auth + Prisma   │
                  │  · simpan lead & lampiran            │
                  │  · anti-spam, validasi, deduplikasi  │
                  └───────────────┬──────────────────────┘
                                  │
                  ┌───────────────▼──────────────────────┐
                  │  Panel admin (admin.azetta.id)       │
                  │  · CRM lead + pipeline status        │
                  │  · CMS desain, artikel, FAQ          │
                  │  · Dashboard & ekspor CSV            │
                  └───────────────┬──────────────────────┘
                                  │ notifikasi
                                  ▼
                     Tim sales follow-up via WhatsApp
```

**Inti nilai:** setiap kunjungan punya jalur jelas menuju satu aksi (kirim lead), dan setiap lead tercatat, terklasifikasi, dan punya pemilik yang bertanggung jawab.

## 3. Tiga aliran pengunjung

| Aliran | Halaman utama | Yang diinginkan pengunjung | Aksi di website |
|--------|---------------|----------------------------|-----------------|
| **Calon pembeli desain** | Katalog `/desain` & detail `/desain/[slug]` | Lihat render, denah, spesifikasi, estimasi biaya, lalu tanya harga/kustomisasi | Form "Tanya desain ini" |
| **Pemilik lahan** | `/kerjasama-lahan` | Paham skema bagi hasil, lalu tawarkan lahannya | Form multi-langkah data lahan + foto |
| **Investor** | `/investasi` | Paham proyek, skema imbal hasil, risiko, lalu minta proposal | Form minat investasi (rentang modal, lokasi, horizon) |

Ketiganya bermuara ke tabel `Lead` dengan `type` berbeda, sehingga tim sales melihat satu antrean terpadu.

## 4. Ruang lingkup MVP

### Termasuk
- Katalog desain dengan filter (kategori, gaya, jumlah lantai, kamar, luas lahan) + pencarian.
- Halaman detail desain: galeri render, denah, spesifikasi, estimasi biaya bangun, CTA.
- Halaman statis penawaran: kerja sama lahan, investasi, tentang, kontak, FAQ.
- Tiga formulir lead dengan validasi, anti-spam, dan lampiran foto lahan.
- Panel admin: login, CRM lead (list/detail/status/aktivitas/ekspor CSV), CMS desain & artikel & FAQ, pengaturan situs, dashboard ringkas.
- SEO teknis: SSR, sitemap, meta, schema.org, gambar teroptimasi.
- Analitik funnel sederhana (kunjungan → lihat desain → mulai form → submit).

### Tidak termasuk (fase berikutnya)
- Pembayaran online, checkout, unduhan otomatis file desain.
- Akun publik untuk customer/investor (login hanya untuk staf admin).
- Dashboard investor (laporan proyek, bagi hasil).
- Aplikasi mobile.
- Multi-bahasa, multi-mata uang.
- Integrasi WhatsApp Business API / email marketing otomatis.

Rincian batas lingkup per fitur: [01 §4](./01-prd.md#4-ruang-lingkup).

## 5. Indikator keberhasilan

Target diukur **3 bulan setelah peluncuran** (baseline: nol).

| Kategori | Metrik | Target |
|----------|--------|--------|
| Trafik | Sesi organik/bulan | ≥ 1.000 |
| Konversi | Lead/bulan (semua tipe) | ≥ 40 |
| Konversi | Lead ÷ sesi halaman penawaran | ≥ 2,5% |
| Kualitas | Lead → qualified | ≥ 30% |
| Kualitas | Lead → deal (dilaporkan manual) | ≥ 5% |
| Respons | Lead pertama dihubungi | ≤ 2 jam kerja |
| Konten | Desain publish | ≥ 12 |
| Konten | Artikel publish | ≥ 8 |
| Teknis | Lighthouse mobile (Performance/SEO/A11y) | ≥ 90 |
| Teknis | LCP p75 | ≤ 2,5 s |
| Operasional | Uptime bulanan | ≥ 99,5% |

Definisi metrik dan cara hitungnya: [02 §6](./02-model-bisnis-funnel.md#6-definisi-metrik).

## 6. Ringkasan jadwal

Tanpa tanggal mutlak; disusun 7 sprint (Sprint 0 selama 1 minggu, Sprint 1–6 masing-masing 2 minggu) dengan kapasitas 2 developer + dukungan desainer/QA paruh waktu. Total ±13 minggu kerja.

| Sprint | Fokus | Hasil yang bisa dilihat |
|--------|-------|-------------------------|
| 0 | Fondasi | Repo, DB, auth, tema UI, staging hidup |
| 1 | Katalog publik | Home + katalog + detail desain tayang |
| 2 | Penangkapan lead | Tiga formulir berfungsi, notifikasi masuk |
| 3 | CRM admin | Lead bisa dikelola end-to-end |
| 4 | CMS | Desain & artikel bisa diinput tanpa developer |
| 5 | Konten & kepercayaan | Halaman statis, 12 desain, 8 artikel |
| 6 | Pengerasan & rilis | UAT, performa, keamanan, produksi |

Rincian task: [07](./07-backlog-sprint.md).

## 7. Ringkasan biaya

| Komponen | Perkiraan |
|----------|-----------|
| Effort total | **155 person-day** — 123 developer, 12 desain, 12 QA, 8 konten (lihat [08 §3](./08-estimasi-biaya.md#3-rincian-effort)) |
| Biaya tim (outsourced) | Rp117–186 juta; dengan kontingensi 15% → **Rp135–204 juta** |
| Infrastruktur bulanan | Rp0,45–2,4 juta/bulan (baseline ±Rp1,5 juta) |
| Biaya sekali bayar | Domain, aset visual, foto/render, legal review — Rp4,75–15,5 juta |
| Kontingensi | 15% dari total |

## 8. Risiko utama

| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| Konten (render/foto) belum siap saat rilis | Website tampak kosong, SEO lambat | Kontrak fotografer/3D artist di Sprint 1; siapkan placeholder terkurasi |
| Lead masuk tapi follow-up lambat | Investasi marketing terbuang | SLA 2 jam, notifikasi real-time, dashboard lead belum dihubungi |
| Spam formulir | CRM penuh sampah | Honeypot + Turnstile + rate limit + deduplikasi nomor |
| Data pribadi (UU PDP) | Sanksi & reputasi | Consent eksplisit, minimasi data, retensi 24 bulan, audit log |
| Scope creep ke arah transaksi online | Jadwal mundur | Batas lingkup tertulis di [01 §4](./01-prd.md#4-ruang-lingkup); perubahan via change request |

Register lengkap: [12](./12-risiko-asumsi-keputusan.md).
