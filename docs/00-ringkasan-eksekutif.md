# 00 — Ringkasan Eksekutif

> Dokumen ini untuk pembaca non-teknis. Detail ada di dokumen 01–12.
> Kembali ke [index](./README.md).

---

## 1. Latar belakang

Azetta adalah **developer properti yang menjual unit rumah** dari proyek perumahan yang dikembangkannya sendiri. Selain menjual rumah, Azetta **menerima lahan potensial** dari pemilik lahan — untuk **dibeli** maupun **dikerjasamakan**: pemilik lahan menyerahkan lahannya, Azetta membangun proyek di atasnya, lalu unitnya dijual kepada pembeli. Untuk membiayai pengembangan, Azetta juga membuka hubungan dengan **investor**; di website, informasi bagi investor disajikan sebagai **halaman pemberitahuan**, bukan alur pendaftaran.

Yang **tidak** dijual Azetta adalah gambar desain. **Desain adalah visual akhir yang diinginkan pembeli**: website menampilkan render unit, dan detail visual itu disepakati antara Azetta dan pembeli sebelum pembangunan.

Saat ini seluruh proses berjalan manual: penawaran lewat WhatsApp, katalog dikirim sebagai file PDF, dan pendaftaran lahan/investor dicatat di spreadsheet. Akibatnya:

1. **Tidak ada aset digital yang bekerja 24 jam.** Calon pembeli rumah dan pemilik lahan tidak menemukan Azetta lewat pencarian Google.
2. **Lead tidak terukur.** Tidak diketahui berapa orang melihat penawaran, berapa yang menghubungi, dan dari mana asalnya.
3. **Kualitas presentasi tidak konsisten.** Tidak semua prospek menerima informasi yang sama rapi dan lengkap.
4. **Lead mudah hilang.** Tanpa pencatatan, follow-up bergantung pada ingatan individu.

Rujukan pengalaman pengguna: [ruma.id](https://ruma.id/) — katalog rumah dengan filter, halaman detail berisi render + denah + spesifikasi + kisaran harga, dan CTA konsultasi.

## 2. Solusi yang diusulkan

Satu website publik (SvelteKit) + satu panel admin internal (SvelteKit) + satu API (ElysiaJS):

```text
                  ┌──────────────────────────────────────┐
   Pengunjung ───► │  Website publik (azetta.id)          │
   (Google/IG/Ads) │  · Katalog & detail unit rumah       │
                  │  · Proyek & portofolio               │
                  │  · Halaman kerja sama lahan          │
                  │  · Halaman informasi investasi       │
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
                  │  · CMS unit, proyek, artikel, FAQ    │
                  │  · Dashboard & ekspor CSV            │
                  └───────────────┬──────────────────────┘
                                  │ notifikasi
                                  ▼
                     Tim sales follow-up via WhatsApp
```

**Inti nilai:** setiap kunjungan punya jalur jelas menuju satu aksi, dan setiap lead tercatat, terklasifikasi, dan punya pemilik yang bertanggung jawab.

## 3. Aliran pengunjung

| Aliran | Halaman utama | Yang diinginkan pengunjung | Aksi di website |
|--------|---------------|----------------------------|-----------------|
| **Calon pembeli rumah** | Katalog `/rumah` & detail `/rumah/[slug]` | Lihat render, denah, spesifikasi, tipe, kisaran harga, dan status ketersediaan; lalu tanya atau jadwalkan survei | Form "Tanya unit ini" |
| **Pemilik lahan** | `/kerja-sama-lahan` | Paham opsi **dijual** atau **dikerjasamakan**, skema, syarat, dan alur; lalu tawarkan lahannya | Form multi-langkah data lahan + foto |
| **Pencari informasi investasi** | `/investasi` | Paham perusahaan, proyek berjalan, dan skema pengembangan | **Tanpa form** — CTA WhatsApp/email ke manajemen |

Dua aliran pertama bermuara ke tabel `Lead` dengan `type` berbeda (`BUY_UNIT`, `LAND_OFFER`), sehingga tim sales melihat satu antrean terpadu. Aliran ketiga **tidak menghasilkan lead** dan tidak masuk CRM; halaman investasi murni informasional.

## 4. Ruang lingkup MVP

### Termasuk
- Katalog **unit rumah** dengan filter (proyek, kota, tipe, jumlah kamar, luas tanah, luas bangunan, rentang harga, status ketersediaan) + pencarian.
- Halaman detail unit: galeri **render**, denah, spesifikasi, tipe, harga "mulai dari", status ketersediaan (`TERSEDIA`/`INDENT`/`TERJUAL`), CTA.
- Portofolio proyek `/proyek` + detail (bukti nyata untuk pembeli rumah & pemilik lahan).
- Halaman penawaran: kerja sama lahan (opsi jual/kerja sama), **investasi (informasi saja)**, tentang, kontak, FAQ.
- Dua formulir lead dengan validasi, anti-spam, dan lampiran foto lahan.
- **Akun publik**: daftar, verifikasi email, login/reset, halaman "Akun saya" untuk memantau status pengajuan, serta permohonan hapus akun yang ditinjau admin.
- Panel admin: login, CRM lead (list/detail/status/aktivitas/catatan pemohon/ekspor CSV), CMS unit rumah, proyek, artikel, FAQ, testimoni, pengaturan situs + unggah aset, dashboard ringkas.
- SEO teknis: SSR, sitemap, meta, schema.org, gambar teroptimasi.
- Analitik funnel sederhana (kunjungan → lihat unit → mulai form → submit → cek status).

### Tidak termasuk (fase berikutnya)
- Pembayaran online, checkout, booking fee, unduhan otomatis dokumen.
- **Formulir/pendaftaran investor** dan dashboard investor (laporan proyek, bagi hasil).
- Fitur akun lanjutan (favorit, notifikasi, ubah email, penghapusan akun otomatis/self-service).
- WhatsApp Business API / WhatsApp gateway berbayar.
- Aplikasi mobile.
- Multi-bahasa, multi-mata uang.

Rincian batas lingkup per fitur: [01 §4](./01-prd.md#4-ruang-lingkup).

## 5. Indikator keberhasilan

Target diukur **3 bulan setelah peluncuran** (baseline: nol).

| Kategori | Metrik | Target |
|----------|--------|--------|
| Trafik | Sesi organik/bulan | ≥ 1.000 |
| Konversi | Lead/bulan (`BUY_UNIT` + `LAND_OFFER`) | ≥ 40 |
| Konversi | Lead ÷ sesi halaman katalog & detail unit | ≥ 2,5% |
| Kualitas | Lead → qualified | ≥ 30% |
| Kualitas | Lead → deal (dilaporkan manual) | ≥ 5% |
| Respons | Lead pertama dihubungi | ≤ 2 jam kerja |
| Konten | Unit rumah publish | ≥ 12 |
| Konten | Proyek publish | ≥ 3 |
| Konten | Artikel publish | ≥ 8 |
| Informasi | Kunjungan `/investasi` per bulan (bukan lead) | ≥ 150 |
| Akun | Lead yang memiliki akun | ≥ 30% |
| Akun | Pemilik akun membuka status ≥ 2× | ≥ 40% |
| Teknis | Lighthouse mobile (Performance/SEO/A11y) | ≥ 90 |
| Teknis | LCP p75 | ≤ 2,5 s |
| Operasional | Uptime bulanan | ≥ 99,5% |
| Operasional | Unit dengan status ketersediaan terbaru | 100% (audit mingguan) |

Definisi metrik dan cara hitungnya: [02 §6](./02-model-bisnis-funnel.md#6-definisi-metrik).

## 6. Ringkasan jadwal

Tanpa tanggal mutlak; disusun 8 sprint (Sprint 0 selama 1 minggu, Sprint 1–7 masing-masing 2 minggu) dengan kapasitas 2 developer + dukungan desainer/QA paruh waktu. Total ±15 minggu kerja.

| Sprint | Fokus | Hasil yang bisa dilihat |
|--------|-------|-------------------------|
| 0 | Fondasi | Repo, DB, auth, tema UI, staging hidup |
| 1 | Katalog publik | Home + katalog unit + detail unit tayang |
| 2 | Penangkapan lead | Dua formulir berfungsi, notifikasi email masuk |
| 3 | CRM admin | Lead bisa dikelola end-to-end |
| 4 | CMS & proyek | Unit, proyek, artikel bisa diinput tanpa developer |
| 5 | Akun publik | Daftar → verifikasi → pantau status pengajuan |
| 6 | Konten & kualitas | Halaman statis, 12 unit, 4 proyek, 8 artikel, audit |
| 7 | Pengerasan & rilis | UAT, performa, keamanan, produksi |

Rincian task: [07](./07-backlog-sprint.md).

## 7. Ringkasan biaya

| Komponen | Perkiraan |
|----------|-----------|
| Effort total | **186 person-day** — 146 developer, 17 desain, 15 QA, 8 konten (lihat [08 §3](./08-estimasi-biaya.md#3-rincian-effort)) |
| Biaya tim (outsourced) | Rp 141–213 juta; dengan kontingensi 15% → **Rp 162–245 juta** |
| Infrastruktur bulanan | Rp 0,45–2,3 juta/bulan (baseline ±Rp 1,5 juta) |
| Biaya sekali bayar | Domain, aset visual, foto/render, legal review — Rp 4,75–15,5 juta |
| Kontingensi | 15% dari total |

## 8. Risiko utama

| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| Konten (foto/render/artikel) belum siap saat rilis — belum ada PIC khusus | Website tampak kosong, SEO lambat | Jadwalkan blok waktu tim internal 2×/minggu; pesan jasa render di Sprint 1; target 6 unit siap sebelum Sprint 3 |
| Status ketersediaan unit tidak diperbarui | Calon pembeli menanyakan unit yang sudah terjual; kredibilitas turun | Status per unit di CMS, audit mingguan, tampilkan tanggal "diperbarui" |
| Lead masuk tapi follow-up lambat | Investasi marketing terbuang | SLA 2 jam, notifikasi email real-time, dashboard lead belum dihubungi |
| Spam formulir & spam registrasi akun | CRM penuh sampah, kuota email habis | Honeypot + Turnstile + rate limit + deduplikasi nomor + verifikasi email wajib |
| Data pribadi (UU PDP), termasuk data akun | Sanksi & reputasi | Consent eksplisit, minimasi data, retensi 24 bulan, isolasi data per akun, audit log |
| Scope creep ke arah transaksi online / pendaftaran investor | Jadwal mundur | Batas lingkup tertulis di [01 §4](./01-prd.md#4-ruang-lingkup); perubahan via change request |
| Beban developer 98% kapasitas | Satu hambatan menggeser rilis | Pantau burndown; siapkan opsi menunda portofolio proyek bila perlu |

Register lengkap: [12](./12-risiko-asumsi-keputusan.md).
