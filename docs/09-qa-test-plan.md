# 09 — Rencana QA & Pengujian

> Kembali ke [index](./README.md) · Sebelumnya: [08](./08-estimasi-biaya.md) · Berikutnya: [10](./10-seo-konten.md)

---

## 1. Tujuan & prinsip

1. **Fokus pada risiko**, bukan mengejar cakupan 100%. Yang paling mahal bila gagal: kehilangan lead, kebocoran data pribadi, dan situs tidak dapat diakses.
2. **Otomasi yang bernilai.** Alur yang sering berubah diuji unit; alur bisnis kritis diuji E2E; sisanya manual terarah.
3. **Uji di perangkat nyata.** Mayoritas pengunjung memakai Android kelas menengah dengan jaringan 4G.
4. **Setiap bug punya bukti**: langkah reproduksi, environment, screenshot/log, dan `requestId`.

## 2. Lingkup pengujian

| Masuk uji | Di luar uji |
|-----------|-------------|
| Semua halaman publik & form | Pembayaran (tidak ada di MVP) |
| Panel admin (CRM, CMS, pengaturan) | Infrastruktur cloud penyedia |
| API publik & admin | Aplikasi mobile native |
| Keamanan, aksesibilitas, performa | Integrasi WhatsApp Business API |
| Alur email notifikasi | Ketahanan DDoS skala besar |
| Proses backup & restore | Multi-region failover |

## 3. Environment & data uji

| Environment | Tujuan | Data |
|-------------|--------|------|
| `local` | Pengembangan & unit test | Seed lengkap, Turnstile test key |
| `staging` | QA, E2E, UAT | Seed + data sintetis, email ke Mailpit/kotak uji, `noindex` |
| `production` | Pengguna nyata | Hanya akun admin & konten nyata |

Aturan:

- Data uji **tidak pernah** memakai nomor/email orang nyata. Gunakan format `+6280000000xx` dan `@example.test`.
- `staging` dilindungi basic auth atau Cloudflare Access agar tidak terindeks.
- Turnstile di staging memakai *test keys* resmi (selalu lolos) dan satu test key "selalu gagal" untuk menguji jalur error.

## 4. Level pengujian & tools

| Level | Cakupan | Tool |
|-------|---------|------|
| Unit | Util normalisasi nomor, validasi skema, transisi status, formatter, sanitasi Markdown | `bun test` / Vitest |
| Integrasi API | Route + Prisma + Postgres nyata (test container) | Vitest + `fetch` ke instance uji |
| Komponen | Komponen UI kritis (form field, stepper, tabel) | Vitest + `@testing-library/svelte` |
| E2E | Alur bisnis kritis lintas halaman | Playwright |
| Manual eksploratif | UX, edge case, perangkat | Checklist |
| Non-fungsional | Performa, aksesibilitas, keamanan | Lighthouse CI, axe, OWASP checklist |

Target otomasi: **≥ 70% baris** untuk `apps/api/src/modules` dan `packages/contracts`; tidak ada target persentase untuk komponen UI (dinilai dari E2E).

## 5. Matriks uji fungsional

### 5.1 Katalog publik

| ID | Skenario | Harapan |
|----|----------|---------|
| TC-PUB-01 | Buka `/desain` tanpa filter | Menampilkan maks 12 desain `PUBLISHED`, urut terbaru |
| TC-PUB-02 | Filter kategori + lantai | Hasil sesuai; URL memuat query; reload mempertahankan filter |
| TC-PUB-03 | Pencarian "minimalis" | Hasil relevan; pencarian kosong mengembalikan semua |
| TC-PUB-04 | Filter tanpa hasil | Empty state + tombol reset; status 200 (bukan error) |
| TC-PUB-05 | Halaman 2 pagination | Data berbeda dari halaman 1; tidak ada duplikat |
| TC-PUB-06 | Buka detail desain `PUBLISHED` | Galeri, spesifikasi, denah, harga "mulai dari" tampil; **tidak ada** angka estimasi biaya bangun |
| TC-PUB-07 | Buka slug `DRAFT` | 404 kustom; tidak membocorkan data |
| TC-PUB-08 | Field opsional kosong (mis. carport) | Baris tidak ditampilkan; tidak ada "null"/"—" berlebihan |
| TC-PUB-09 | Klik galeri | Lightbox terbuka; panah & Esc berfungsi; fokus kembali ke thumbnail |
| TC-PUB-10 | Desain terkait | Maks 4; tidak memuat desain yang sedang dibuka |
| TC-PUB-11 | Share URL filter | Orang lain melihat hasil filter yang sama |
| TC-PUB-12 | Artikel & FAQ | Konten dari CMS; `FAQPage` JSON-LD valid |

### 5.2 Lead

| ID | Skenario | Harapan |
|----|----------|---------|
| TC-LEAD-01 | Submit form desain lengkap | 201; redirect terima kasih; lead muncul di admin; email terkirim |
| TC-LEAD-02 | Submit tanpa nama | Error di field nama; tidak ada request tersimpan |
| TC-LEAD-03 | Nomor `0812-3456-7890` | Tersimpan `+6281234567890`; `phoneNormalized=6281234567890` |
| TC-LEAD-04 | Nomor tidak valid (`12345`) | Ditolak dengan pesan jelas |
| TC-LEAD-05 | Email format salah | Ditolak di klien & server |
| TC-LEAD-06 | Consent tidak dicentang | Submit diblokir; pesan menjelaskan alasan |
| TC-LEAD-07 | Submit dua kali cepat | Hanya satu lead; kedua mengembalikan referensi sama |
| TC-LEAD-08 | Honeypot terisi | Respons 201 palsu; lead tersimpan `SPAM`; tidak ada email |
| TC-LEAD-09 | Turnstile token invalid | 400 `INVALID_CAPTCHA`; pengguna dapat mencoba lagi |
| TC-LEAD-10 | 6 submit/jam dari IP sama | 429 + `Retry-After` |
| TC-LEAD-11 | Form lahan: lanjut tanpa provinsi | Error di langkah 2; langkah 1 tetap terisi |
| TC-LEAD-12 | Form lahan: 6 foto | Ditolak sebelum unggah; pesan batas 5 |
| TC-LEAD-13 | Form lahan: foto 6 MB | Ditolak dengan pesan ukuran |
| TC-LEAD-14 | Form lahan: unggah lalu batalkan | Objek `tmp` dibersihkan dalam 24 jam |
| TC-LEAD-15 | Refresh di tengah form lahan | Draft dipulihkan (dari `sessionStorage`) |
| TC-LEAD-16 | Form investasi tanpa email | Ditolak (email wajib untuk tipe ini) |
| TC-LEAD-17 | Submit dengan JS dimatikan | Form tetap terkirim (progressive enhancement) |
| TC-LEAD-18 | Koneksi terputus saat submit | Pesan error + tombol coba lagi; isian tidak hilang |
| TC-LEAD-19 | Atribusi UTM | `utm_source`/`campaign`/`landingPath` tersimpan |
| TC-LEAD-20 | Halaman terima kasih dibuka langsung | Tampil generik tanpa error |

### 5.3 Admin — CRM

| ID | Skenario | Harapan |
|----|----------|---------|
| TC-ADM-01 | Akses `/admin/leads` tanpa login | Redirect ke `/login?next=/leads`; setelah login kembali ke tujuan |
| TC-ADM-02 | Login salah 6× | Percobaan ke-6 ditolak 429; pesan jelas |
| TC-ADM-03 | Login sebagai `customer` lalu akses `/admin/leads` | 403; menu admin tidak tampil; API menolak |
| TC-ADM-04 | Filter status `NEW` + tipe `LAND_OFFER` | Hasil benar; filter tersimpan di URL |
| TC-ADM-05 | Cari nomor telepon sebagian | Menemukan lead terkait |
| TC-ADM-06 | Ubah status `NEW` → `WON` | Ditolak (transisi ilegal) dengan pesan |
| TC-ADM-07 | Ubah status ke `LOST` tanpa alasan | Ditolak |
| TC-ADM-08 | Ubah status ke `CONTACTED` | `firstContactedAt` terisi; aktivitas `STATUS_CHANGE` tercatat |
| TC-ADM-09 | Catat aktivitas WhatsApp | Timeline bertambah; `lastContactedAt` diperbarui |
| TC-ADM-10 | Buka lampiran | URL bertanda tangan; kedaluwarsa 15 menit; akses tanpa sesi → 403 |
| TC-ADM-11 | Ekspor CSV dengan filter | Hanya baris terfilter; kolom sesuai; karakter UTF-8 benar |
| TC-ADM-12 | Nama berisi `=cmd()` di CSV | Diescape agar tidak menjadi formula (CSV injection) |
| TC-ADM-13 | Dua admin membuka lead sama | Perubahan terakhir menang; tidak ada data hilang tanpa peringatan |
| TC-ADM-14 | Dashboard setelah lead baru | Angka bertambah konsisten dengan daftar |
| TC-ADM-15 | Tulis `customerNote` pada lead | Tersimpan; muncul di `/akun` pemilik; tidak memuat data internal |
| TC-ADM-16 | Daftar pelanggan (`/pelanggan`) | Hanya baca; tidak menampilkan kata sandi/token |
| TC-ADM-17 | Tandai permohonan hapus akun selesai | Status `COMPLETED`; hilang dari daftar `PENDING`; aksi tercatat di audit; data **tidak** terhapus otomatis |

### 5.3a Akun publik

| ID | Skenario | Harapan |
|----|----------|---------|
| TC-ACC-01 | Registrasi email baru | Akun dibuat `role=customer`; email verifikasi terkirim; belum bisa melihat pengajuan |
| TC-ACC-02 | Registrasi email yang sudah terdaftar | Pesan seragam; tidak membocorkan keberadaan akun; email konfirmasi tidak dikirim berulang |
| TC-ACC-03 | Klik tautan verifikasi | `emailVerified=true`; `/akun` dapat diakses |
| TC-ACC-04 | Tautan verifikasi kedaluwarsa (24 jam) | Pesan jelas + tombol kirim ulang |
| TC-ACC-05 | Kirim ulang verifikasi 4× dalam 1 jam | Permintaan ke-4 → 429 |
| TC-ACC-06 | Lupa sandi untuk email tidak terdaftar | Respons tetap "Jika email terdaftar…"; tidak ada email terkirim |
| TC-ACC-07 | Reset sandi dengan token valid | Kata sandi berubah; semua sesi lain dicabut |
| TC-ACC-08 | Akses `/akun` tanpa login | Redirect `/masuk?next=/akun` |
| TC-ACC-09 | Akses `/akun` sebelum verifikasi | Banner verifikasi; daftar pengajuan tidak dirender |
| TC-ACC-10 | Dua akun, masing-masing punya pengajuan | Tidak ada data yang saling terlihat; membuka ID milik orang lain → 404 |
| TC-ACC-11 | Submit lead saat login | `userId` terisi; pengajuan muncul di `/akun` |
| TC-ACC-12 | Submit lead tanpa akun, lalu daftar dengan email sama | Pengajuan otomatis tertaut setelah verifikasi |
| TC-ACC-13 | Lead berstatus `SPAM` milik pengguna | Tidak muncul di `/akun` |
| TC-ACC-14 | Ubah profil (nama/WA/kota) | Tersimpan; email tidak berubah |
| TC-ACC-15 | Ubah email melalui PATCH `/me` | Ditolak/diabaikan; email tetap |
| TC-ACC-16 | Ganti kata sandi dengan sandi lama salah | Ditolak; pesan jelas |
| TC-ACC-17 | Label status | Tidak ada istilah internal (`QUALIFIED`, `SPAM`) yang tampil |
| TC-ACC-18 | Sesi kedaluwarsa saat membuka detail pengajuan | Redirect login; setelah login kembali ke pengajuan |
| TC-ACC-19 | Ajukan hapus akun dari profil | `201`; status `PENDING` tampil; akun **masih aktif** dan bisa login |
| TC-ACC-20 | Ajukan hapus akun dua kali | Permintaan kedua → `409 DUPLICATE_REQUEST`; tidak ada data yang terhapus otomatis |

### 5.3b Proyek

| ID | Skenario | Harapan |
|----|----------|---------|
| TC-PRJ-01 | Proyek `isPublished=false` diakses lewat URL | 404 |
| TC-PRJ-02 | Publish tanpa cover | Ditolak dengan pesan |
| TC-PRJ-03 | Publish projects | Tampil di `/proyek` dan section beranda ≤ 5 menit |
| TC-PRJ-04 | Galeri 11 gambar | Ditolak (maks 10) |
| TC-PRJ-05 | Proyek tanpa unit/luas | Field kosong disembunyikan |

### 5.4 Admin — CMS

| ID | Skenario | Harapan |
|----|----------|---------|
| TC-CMS-01 | Buat desain draft | Tidak tampil di publik; tampil di admin |
| TC-CMS-02 | Publish tanpa media | Ditolak dengan daftar kekurangan |
| TC-CMS-03 | Publish lengkap | Tampil di katalog ≤ 5 menit; sitemap memuat URL |
| TC-CMS-04 | Ubah slug desain yang sudah tayang | URL lama 301 ke URL baru (atau ditolak — lihat kebijakan) |
| TC-CMS-05 | Hapus desain yang punya lead | Ditolak 409; sarankan arsipkan |
| TC-CMS-06 | Hapus media cover | Cover otomatis pindah ke media berikutnya |
| TC-CMS-07 | Artikel dengan Markdown berisi `<script>` | Skrip tidak dieksekusi (disanitasi) |
| TC-CMS-08 | Ubah nomor WhatsApp di pengaturan | Tampil di footer & tombol WA ≤ 5 menit |
| TC-CMS-09 | Non-admin membuka `/pengguna` | 403 |
| TC-CMS-10 | Super admin menonaktifkan dirinya | Ditolak |

### 5.5 Non-fungsional

| ID | Skenario | Harapan |
|----|----------|---------|
| TC-NFR-01 | Lighthouse mobile 4 halaman | Perf/A11y/BP/SEO ≥ 90 |
| TC-NFR-02 | LCP pada 4G tersimulasi | ≤ 2,5 s |
| TC-NFR-03 | Navigasi keyboard penuh di form lahan | Semua kontrol dapat dicapai & dioperasikan |
| TC-NFR-04 | Pembaca layar (NVDA/TalkBack) pada form | Label, error, dan status terkirim terbaca |
| TC-NFR-05 | Zoom 200% | Tidak ada konten terpotong/horizontal scroll pada 360 px |
| TC-NFR-06 | API 100 permintaan paralel ke katalog | p95 ≤ 300 ms; tanpa error 5xx |
| TC-NFR-07 | Restore backup ke DB kosong | Data lengkap; waktu < 4 jam |
| TC-NFR-08 | Matikan DB | API mengembalikan 503 rapi (bukan stack trace), health check merah |

## 6. Alur E2E kritis (Playwright)

| Alur | Langkah | Kriteria lulus |
|------|---------|----------------|
| **E2E-1** Desain | Beranda → katalog → filter → detail → isi form → terima kasih | Referensi tampil; lead ada di DB |
| **E2E-2** Lahan | `/kerjasama-lahan` → 3 langkah → unggah 2 foto → submit | Lead + `LandSubmission` + 2 lampiran tersimpan |
| **E2E-3** Investasi | `/investasi` → form → submit | `InvestmentInterest` tersimpan |
| **E2E-4** CRM | Login → daftar lead → buka E2E-1 → ubah status → catat aktivitas | Status & aktivitas persist setelah reload |
| **E2E-5** CMS | Login → buat desain → unggah media → publish → buka halaman publik | Desain tampil dengan media |
| **E2E-6** Otorisasi | Akses endpoint admin tanpa cookie | 401/403; tidak ada data bocor |
| E2E-7 | Anti-spam | Submit dengan honeypot terisi | Tidak ada notifikasi; status `SPAM` |
| **E2E-8** Akun | Daftar → verifikasi (Mailpit) → login → `/akun` → buka pengajuan | Hanya melihat pengajuannya sendiri; status tampil ramah pengguna |
| **E2E-9** Isolasi akun | Buat 2 akun + 2 pengajuan; akun A membuka URL pengajuan akun B | 404; tidak ada data bocor |
| **E2E-10** Proyek | Login admin → buat proyek → publish → buka `/proyek/[slug]` | Proyek tampil dengan galeri |

E2E berjalan di CI pada setiap PR (subset) dan sebelum rilis (semua).

## 7. Checklist keamanan

| # | Area | Pemeriksaan | Cara verifikasi |
|---|------|-------------|-----------------|
| S1 | Kontrol akses | Setiap route `/admin/*` memakai guard; tidak ada data sensitif di endpoint publik | Uji manual + test otomatis per route |
| S2 | IDOR | Akses lead/lampiran milik orang lain | Uji dengan dua akun berbeda |
| S3 | Injeksi | Semua query lewat Prisma; tidak ada `$queryRawUnsafe` | Code review + `grep` |
| S4 | XSS | Markdown disanitasi sebelum render; tidak ada `{@html}` tanpa sanitasi | Test payload `<img src=x onerror=alert(1)>` |
| S5 | CSRF | Mutasi memakai cookie `sameSite=lax` + origin check; CORS terbatas | Uji request lintas origin |
| S6 | Rate limit | Login, lead, presign, events | Uji melebihi batas |
| S7 | Unggah file | MIME diverifikasi (magic bytes), ukuran dibatasi, nama file tidak dipakai mentah | Unggah file `.php` dengan MIME palsu |
| S8 | URL bertanda tangan | Kedaluwarsa, tidak dapat ditebak, tidak dapat dipakai ulang | Uji akses setelah 15 menit |
| S9 | Header | HSTS, CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` | `curl -I` + securityheaders.com |
| S10 | Kebocoran log | Tidak ada kata sandi/token/nomor penuh di log | Telusuri log staging |
| S11 | Dependency | `bun audit` / Dependabot bersih dari high/critical | CI |
| S12 | Brute force | Login dibatasi; pesan error tidak membedakan email ada/tidak | Uji login |
| S13 | Enumerasi | Endpoint publik tidak membocorkan daftar pengguna/lead; pesan registrasi & reset seragam | Uji endpoint |
| S14 | Mass assignment | PATCH hanya menerima field yang diizinkan; `role`/`email` diabaikan | Kirim `role` pada PATCH `/me` → ditolak |
| S15 | CSV injection | Sel yang dimulai `=`, `+`, `-`, `@` diescape | Uji ekspor |
| S16 | Backup | Backup terenkripsi, akses terbatas, restore teruji | Audit akses |
| S17 | Secrets | Tidak ada kunci di repo; `.env` di `.gitignore`; secret di manajer rahasia | `gitleaks` di CI |
| S18 | Error | Tidak ada stack trace di respons produksi | Uji 500 |
| S19 | Penyalahgunaan registrasi | Rate limit per IP; Turnstile; verifikasi email wajib; kuota kirim email | Uji 10 registrasi/menit |
| S20 | Pencabutan sesi | Reset/ubah kata sandi mencabut sesi lain; akun nonaktif langsung tidak bisa mengakses | Uji dua perangkat |
| S21 | Isolasi data akun | `/me/*` selalu memfilter `userId`; ID pengajuan orang lain → 404 | Uji otomatis dua akun |

## 8. Anggaran performa

| Metrik | Target | Alat |
|--------|--------|------|
| LCP (p75, mobile) | ≤ 2,5 s | Lighthouse CI, CrUX |
| INP (p75) | ≤ 200 ms | CrUX |
| CLS (p75) | ≤ 0,1 | Lighthouse CI |
| TTFB (p75) | ≤ 800 ms | Cloudflare Analytics |
| JS halaman katalog | ≤ 180 KB gzip | Build report |
| Gambar hero | ≤ 250 KB (WebP/AVIF) | Audit manual |
| Font | ≤ 2 berkas, `display=swap` | Audit manual |

Aturan: setiap PR yang menambah > 25 KB JS harus disertai alasan di deskripsi PR.

## 9. Checklist aksesibilitas (WCAG 2.2 AA)

- [ ] Semua gambar punya `alt` sesuai konteks.
- [ ] Kontras teks ≥ 4,5:1 (cek di tema terang).
- [ ] Fokus terlihat pada semua elemen interaktif.
- [ ] Urutan tab logis; tidak ada `tabindex` > 0.
- [ ] Form: label terhubung, `aria-required`, `aria-invalid`, error terbaca.
- [ ] Pesan status (terkirim/gagal) memakai `aria-live`.
- [ ] Modal: fokus terperangkap, `Esc` menutup, fokus kembali.
- [ ] Heading berurutan tanpa lompatan.
- [ ] Bahasa halaman `lang="id"`; istilah asing ditandai bila perlu.
- [ ] Tidak ada teks dalam gambar yang esensial.
- [ ] Target sentuh ≥ 44×44 px.
- [ ] Menghormati `prefers-reduced-motion`.

## 10. Kepatuhan privasi (UU PDP)

| # | Kewajiban | Implementasi | Bukti |
|---|-----------|--------------|-------|
| P1 | Dasar pemrosesan | Checkbox consent eksplisit, tidak pre-checked | Screenshot + test |
| P2 | Transparansi | Kebijakan privasi menjelaskan data, tujuan, retensi | Dokumen tayang |
| P3 | Minimasi | Hanya field yang dipakai; tanpa NIK | Review skema DB |
| P4 | Retensi | Anonimisasi 24 bulan; spam 90 hari | Job + log |
| P5 | Hak akses & hapus | Prosedur manual ≤ 30 hari (permohonan di `/akun/profil` atau email) | SOP tertulis |
| P6 | Keamanan | Enkripsi transport, akses berbasis peran, audit log | Checklist §7 |
| P7 | Pemroses pihak ketiga | Daftar vendor (hosting, email, storage) + perjanjian | Daftar vendor |
| P8 | Insiden | Prosedur notifikasi kebocoran | Runbook |
| P9 | Data akun | Hanya email + profil minimal; tidak ada NIK/alamat lengkap wajib | Review skema `user` |
| P10 | Hak subjek data akun | Permintaan hapus via `/akun/profil` → daftar admin; anonimisasi + cabut sesi ≤ 30 hari | SOP + uji |
| P11 | Anak di bawah umur | Form menyatakan layanan untuk 18+; tidak ada verifikasi usia khusus di MVP | Teks syarat |

## 11. UAT (User Acceptance Test)

**Peserta:** 1 admin/sales senior, 1 perwakilan manajemen, 1 staf marketing.
**Durasi:** 2 sesi × 2 jam, di staging, dengan data uji mendekati nyata.

Skenario UAT:

| # | Skenario | Peran | Lulus bila |
|---|----------|-------|-----------|
| U1 | Menemukan desain sesuai lahan 6×12 | Marketing | ≤ 3 menit, tanpa bantuan |
| U2 | Mengirim pertanyaan desain dari ponsel | Marketing | ≤ 90 detik, tanpa error |
| U3 | Mengajukan lahan 800 m² dengan 3 foto | Marketing | Selesai tanpa bertanya |
| U4 | Merespons lead baru dari daftar | Sales | ≤ 60 detik sampai tombol WhatsApp |
| U5 | Mengubah status & mencatat hasil telepon | Sales | ≤ 60 detik, data tersimpan |
| U6 | Menemukan lead yang belum dihubungi | Sales | ≤ 15 detik |
| U7 | Menambah desain baru & publish | Marketing | ≤ 10 menit, tanpa developer |
| U8 | Menulis artikel & publish | Marketing | ≤ 15 menit |
| U9 | Mengubah nomor WhatsApp situs | Manajemen | ≤ 2 menit, langsung tampil |
| U10 | Mengekspor lead bulan ini | Manajemen | File terbuka rapi di Excel |
| U11 | Mendaftar akun & memantau status pengajuan | Marketing | ≤ 3 menit; status terbaca tanpa bertanya ke sales |
| U12 | Menulis catatan untuk pemohon | Sales | ≤ 30 detik; catatan tampil di akun pemohon |
| U13 | Menambah proyek baru & publish | Marketing | ≤ 10 menit, tanpa developer |
| U14 | Mengunggah dokumen legal di Pengaturan | Manajemen | ≤ 3 menit; tautan tampil di halaman legal |

Kriteria: setiap peserta menilai kemudahan 1–5; rata-rata ≥ 4; tidak ada blocker.

## 12. Kriteria rilis

Rilis produksi hanya bila **semua** terpenuhi:

- [ ] 0 bug `blocker`/`critical` terbuka.
- [ ] ≤ 3 bug `major` terbuka, semuanya punya workaround terdokumentasi.
- [ ] Seluruh E2E kritis lulus di staging (termasuk E2E akun & isolasi data).
- [ ] Uji isolasi data akun (IDOR) lulus otomatis.
- [ ] Lighthouse ≥ 90 pada 4 halaman (mobile).
- [ ] Checklist keamanan S1–S18 lulus.
- [ ] Checklist privasi P1–P8 lulus.
- [ ] Backup & restore teruji.
- [ ] UAT disetujui tertulis oleh sales & manajemen.
- [ ] Runbook & kontak darurat tersedia.
- [ ] Monitoring & alert aktif di produksi.

## 13. Klasifikasi & penanganan bug

| Tingkat | Definisi | SLA perbaikan |
|---------|----------|---------------|
| **Blocker** | Situs tidak bisa dipakai / lead tidak tersimpan / data pribadi bocor | Segera (< 4 jam) |
| **Critical** | Fitur utama gagal untuk sebagian pengguna | < 1 hari |
| **Major** | Fitur bekerja tetapi hasil salah / UX sangat terganggu | < 3 hari |
| **Minor** | Ketidaknyamanan, teks, tampilan | Sprint berikutnya |
| **Trivial** | Kosmetik | Backlog |

Format laporan bug: judul, environment, langkah reproduksi, hasil yang diharapkan vs aktual, bukti (screenshot/log/`requestId`), tingkat, dampak bisnis.

## 14. Pelaporan

- Ringkasan harian selama sprint: jumlah test lulus/gagal, bug baru, bug tertutup.
- Laporan per sprint: cakupan uji, defect density, risiko terbuka.
- Metrik kualitas yang dipantau setelah rilis: error rate 5xx, jumlah lead gagal simpan (harus 0), waktu muat p75, jumlah laporan pengguna.
