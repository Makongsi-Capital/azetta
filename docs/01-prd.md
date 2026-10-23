# 01 — PRD: Produk & Kebutuhan

> Kembali ke [index](./README.md) · Sebelumnya: [00](./00-ringkasan-eksekutif.md) · Berikutnya: [02](./02-model-bisnis-funnel.md)

---

## 1. Visi & tujuan

**Visi:** menjadikan Azetta sebagai rujukan digital untuk "memulai proyek properti" — tempat orang menemukan desain yang layak dibangun, menawarkan lahan, atau menanam modal, lalu berlanjut ke kerja sama nyata dengan Azetta.

**Tujuan produk (12 bulan pertama):**

| # | Tujuan | Ukuran |
|---|--------|--------|
| G1 | Menghasilkan lead berkualitas secara mandiri dari kanal digital | ≥ 40 lead/bulan pada bulan ke-3 |
| G2 | Mengurangi ketergantungan pada penjualan lisan | ≥ 50% lead baru berasal dari website |
| G3 | Menstandarkan presentasi penawaran | 100% penawaran memakai materi dari website |
| G4 | Membuat proses follow-up dapat diaudit | 100% lead punya status & pemilik |
| G5 | Membangun otoritas konten | 8 artikel + 12 desain terindeks pada bulan ke-3 |

**Non-tujuan (bukan alasan website ini dibuat):**

- Bukan toko online: tidak ada pembayaran, tidak ada unduhan otomatis.
- Bukan portal listing properti pihak ketiga: hanya properti/desain Azetta.
- Bukan pengganti CRM perusahaan penuh: cukup untuk menampung dan mengelola lead website.

## 2. Persona

### P1 — Calon pembeli desain ("Pak Budi", 34, karyawan/kontraktor kecil)

- **Konteks:** punya lahan 120 m², ingin bangun rumah, sedang mengumpulkan referensi desain.
- **Masalah:** bingung memilih desain; tidak tahu kisaran biaya bangun; ragu menghubungi karena takut dipaksa beli.
- **Perilaku:** mencari lewat Google ("desain rumah 2 lantai 6x12"), melihat banyak gambar di ponsel, menyimpan screenshot.
- **Yang meyakinkan:** render realistis, denah jelas, estimasi biaya transparan, harga mulai dari, testimoni.
- **Aksi sukses:** mengirim form "Tanya desain ini" dengan nomor WhatsApp aktif.

### P2 — Pemilik lahan ("Bu Sari", 52, pemilik tanah warisan)

- **Konteks:** memiliki lahan 800 m² di pinggir kota, tidak punya modal membangun.
- **Masalah:** tidak paham skema kerja sama; khawatir lahan "hilang" atau dirugikan; butuh kepastian legal.
- **Perilaku:** mencari "kerja sama tanah tanpa modal", "bagi hasil tanah dengan developer".
- **Yang meyakinkan:** penjelasan skema bagi hasil yang jelas, alur dan dokumen yang dibutuhkan, contoh proyek, legalitas perusahaan, tidak ada biaya di muka.
- **Aksi sukses:** mengirim form lahan lengkap dengan foto dan perkiraan luas.

### P3 — Investor ("Pak Hendra", 45, profesional/pengusaha)

- **Konteks:** punya dana menganggur Rp500 juta–5 miliar, mencari instrumen properti.
- **Masalah:** butuh gambaran proyek, skema bagi hasil, horizon waktu, dan risiko sebelum bertemu.
- **Perilaku:** membandingkan beberapa developer, minta proposal tertulis, mengecek rekam jejak.
- **Yang meyakinkan:** ringkasan proyek berjalan, skema imbal hasil, tata kelola, kontak yang responsif.
- **Aksi sukses:** mengirim form minat investasi dengan rentang modal dan preferensi lokasi.

### P4 — Staf sales/admin Azetta ("Mbak Rina", 27)

- **Konteks:** menerima lead dari website, menelepon/WhatsApp, mencatat hasil.
- **Masalah:** lead tersebar di WA pribadi & spreadsheet; lupa follow-up; tidak ada rekap.
- **Kebutuhan:** satu daftar lead dengan status, prioritas, catatan, dan pengingat sederhana.
- **Aksi sukses:** mengubah status lead dan mencatat aktivitas dalam < 1 menit.

### P5 — Pemilik/pengelola Azetta

- **Kebutuhan:** melihat performa kanal, kualitas lead, dan konten yang tayang tanpa bertanya ke tim.

## 3. Perjalanan pengguna

### 3.1 Calon pembeli desain

```text
Google/IG Ads ──► Home ──► Katalog (filter) ──► Detail desain
                                                    │
                                       [Tanya desain ini]
                                                    ▼
                                        Form singkat (nama, WA, pesan)
                                                    ▼
                                    Halaman terima kasih + tombol WA
                                                    ▼
                                  Sales menerima notifikasi & menindaklanjuti
```

Titik gesek yang harus dihilangkan: form lebih dari 5 field pada alur ini, permintaan membuat akun, dan harga yang disembunyikan total.

### 3.2 Pemilik lahan

```text
Google "kerja sama lahan" ──► /kerjasama-lahan
        │  (skema, syarat, alur, FAQ, contoh proyek)
        ▼
[Ajukan lahan] ──► Form 3 langkah
        1. Identitas & kontak
        2. Data lahan (alamat, luas, legalitas, akses, foto)
        3. Skema yang diinginkan + persetujuan
        ▼
Terima kasih + estimasi waktu respons (2 hari kerja)
        ▼
Sales kualifikasi → survei lokasi → proposal kerja sama (di luar sistem)
```

### 3.3 Investor

```text
Google/relasi ──► /investasi (proyek, skema, risiko, FAQ)
        ▼
[Minta proposal] ──► Form (rentang modal, lokasi diminati, horizon, profil risiko)
        ▼
Terima kasih + jadwal diskusi
        ▼
Sales mengirim deck & mengatur pertemuan
```

### 3.4 Staf sales (harian)

```text
Login admin ──► Dashboard (lead baru, belum dihubungi)
   ▼
Daftar lead (filter: baru / tipe / milik saya)
   ▼
Detail lead ──► [WhatsApp] template pesan ──► catat aktivitas ──► ubah status
   ▼
Lead qualified ──► diteruskan ke tim proyek/investasi
```

## 4. Ruang lingkup

### 4.1 Matriks lingkup

| Modul | Fitur | MVP | Fase 2 | Catatan |
|-------|-------|:---:|:------:|---------|
| **Katalog desain** | Daftar desain + filter + pencarian | ✅ | | Server-side filter, URL shareable |
| | Detail desain (galeri, denah, spesifikasi, estimasi biaya) | ✅ | | |
| | Desain terkait | ✅ | | 4 item, berbasis kategori/gaya |
| | Simpan/favorit | ❌ | ✅ | Butuh akun publik |
| **Lead** | Form tanya desain | ✅ | | Guest, tanpa akun |
| | Form pengajuan lahan (3 langkah + foto) | ✅ | | Maks 5 foto, 5 MB/foto |
| | Form minat investasi | ✅ | | |
| | Form kontak umum | ✅ | | `type = GENERAL` |
| | Notifikasi ke sales (email + WhatsApp gateway opsional) | ✅ | | Lihat [05 §8](./05-spesifikasi-api.md#8-notifikasi) |
| | Auto-reply email ke pemohon | ❌ | ✅ | Butuh domain email terverifikasi |
| | Status lead untuk pemohon | ❌ | ✅ | Butuh akun publik |
| **Panel admin** | Login & manajemen sesi | ✅ | | Better Auth admin plugin |
| | CRM lead (list, filter, detail, aktivitas, assignment, ekspor) | ✅ | | |
| | Pipeline status + alasan lost | ✅ | | |
| | Deteksi duplikat (nomor WA) | ✅ | | Peringatan, bukan blokir |
| | Template pesan WhatsApp | ✅ | | Disimpan sebagai setting |
| | Pengingat follow-up otomatis | ❌ | ✅ | |
| | CMS desain + media manager | ✅ | | |
| | CMS artikel, FAQ, testimoni | ✅ | | |
| | Pengaturan situs (kontak, teks beranda) | ✅ | | |
| | Manajemen pengguna admin | ✅ | | Hanya super admin |
| | Audit log | ✅ | | Aksi tulis admin |
| | Dashboard statistik | ✅ | | 4 kartu + grafik 30 hari |
| **Transaksi** | Pembayaran online | ❌ | ✅ | Di luar MVP |
| | Unduhan file desain otomatis | ❌ | ✅ | |
| | Kontrak digital / e-sign | ❌ | ✅ | |
| **Akun publik** | Registrasi customer/investor | ❌ | ✅ | |
| **Investor** | Dashboard proyek & laporan | ❌ | ✅ | |
| **Lain-lain** | Multi-bahasa | ❌ | ✅ | Struktur i18n disiapkan, konten ID saja |
| | Blog/kategori/tag | ✅ | | Tag sederhana |
| | Newsletter | ❌ | ✅ | |

### 4.2 Definisi "selesai" untuk MVP

MVP dinyatakan selesai bila seluruh butir berikut benar:

1. Ketiga formulir lead berhasil mengirim data dan muncul di panel admin < 5 detik.
2. Lead dapat diubah status, diberi catatan, dan diekspor CSV.
3. Seluruh konten desain/artikel dapat dikelola dari panel admin tanpa deploy ulang.
4. Tidak ada halaman publik yang menampilkan data placeholder.
5. Lighthouse mobile ≥ 90 untuk Performance, Accessibility, Best Practices, SEO pada 4 halaman utama.
6. Checklist keamanan di [09 §7](./09-qa-test-plan.md#7-checklist-keamanan) lulus.
7. UAT oleh perwakilan sales dan manajemen disetujui.

## 5. Kebutuhan fungsional

Prioritas memakai MoSCoW: **M** = must, **S** = should, **C** = could.

### 5.1 Modul publik — katalog

| ID | Kebutuhan | Prioritas | Kriteria penerimaan ringkas |
|----|-----------|:---------:|------------------------------|
| FR-PUB-01 | Pengunjung dapat melihat daftar desain berstatus `PUBLISHED` | M | Hanya desain publish yang tampil; draft 404 |
| FR-PUB-02 | Daftar dapat difilter kategori, gaya, lantai, kamar tidur, luas lahan minimum, dan rentang harga | M | Filter tercermin di query string & bisa dibagikan |
| FR-PUB-03 | Pencarian teks pada judul, deskripsi, tag | M | Hasil relevan; minimal 1 karakter → debounce 300 ms |
| FR-PUB-04 | Urutan: terbaru, terpopuler, harga terendah, harga tertinggi | S | Default terbaru/featured |
| FR-PUB-05 | Pagination 12 item/halaman | M | Navigasi tetap accessible |
| FR-PUB-06 | Detail desain menampilkan galeri, denah, spesifikasi, estimasi biaya, CTA | M | Semua field kosong disembunyikan, bukan ditampilkan kosong |
| FR-PUB-07 | Desain terkait (maks 4) | S | Fallback ke desain terbaru bila tidak ada yang cocok |
| FR-PUB-08 | Halaman artikel & detail artikel | M | Konten dari CMS, slug unik |
| FR-PUB-09 | Halaman FAQ, tentang, kontak, kebijakan privasi, syarat & ketentuan | M | Dapat diedit lewat CMS/settings |
| FR-PUB-10 | Tombol WhatsApp mengambang | S | Membuka `wa.me` dengan pesan pembuka berisi judul desain (bila di halaman detail) |

### 5.2 Modul lead

| ID | Kebutuhan | Prioritas | Kriteria penerimaan ringkas |
|----|-----------|:---------:|------------------------------|
| FR-LEAD-01 | Form tanya desain pada halaman detail & modal dari kartu katalog | M | Prefill `designId`; field: nama, WhatsApp, email (opsional), pesan |
| FR-LEAD-02 | Form pengajuan lahan 3 langkah | M | Data tersimpan per langkah; bisa kembali tanpa kehilangan isian |
| FR-LEAD-03 | Unggah maks 5 foto lahan (JPG/PNG/WebP, ≤5 MB) | M | Format & ukuran divalidasi di klien dan server |
| FR-LEAD-04 | Form minat investasi | M | Field: nama, WA, email (wajib), rentang modal, lokasi diminati, horizon, profil risiko |
| FR-LEAD-05 | Persetujuan pemrosesan data pribadi wajib dicentang | M | Tidak bisa submit tanpa centang; teks mengarah ke kebijakan privasi |
| FR-LEAD-06 | Anti-spam: honeypot, Turnstile, rate limit, waktu isi minimum | M | Bot honeypot ditolak diam-diam (200 palsu) dan dicatat sebagai `SPAM` |
| FR-LEAD-07 | Nomor telepon dinormalisasi ke format `+62…` | M | Input `0812…`, `+62812…`, `62812…` menghasilkan nilai sama |
| FR-LEAD-08 | Halaman terima kasih dengan nomor referensi & tombol WhatsApp | M | Referensi tampil dan dapat dipakai sales untuk mencari lead |
| FR-LEAD-09 | Notifikasi lead baru ke tim (email; opsional WhatsApp) | M | Terkirim < 60 detik; kegagalan notifikasi tidak membatalkan penyimpanan lead |
| FR-LEAD-10 | Deduplikasi: peringatan bila nomor sama dalam 24 jam | S | Lead tetap dibuat; admin melihat badge "duplikat" |
| FR-LEAD-11 | Form kontak umum | C | Menghasilkan `type = GENERAL` |
| FR-LEAD-12 | Simpan draf form di `sessionStorage` | C | Dihapus setelah submit sukses |

### 5.3 Modul admin

| ID | Kebutuhan | Prioritas | Kriteria penerimaan ringkas |
|----|-----------|:---------:|------------------------------|
| FR-ADM-01 | Login email+password; sesi 7 hari; logout | M | Salah password 5× → jeda 60 detik (rate limit) |
| FR-ADM-02 | Otorisasi berbasis peran (`admin`, `super_admin`) | M | Rute admin tanpa sesi → redirect login; API → 401/403 |
| FR-ADM-03 | Daftar lead dengan filter status/tipe/assignee/tanggal + pencarian | M | Query dipertahankan di URL |
| FR-ADM-04 | Detail lead: kontak, data spesifik tipe, lampiran, riwayat aktivitas | M | Data lahan/investasi tampil terstruktur, bukan JSON mentah |
| FR-ADM-05 | Ubah status via pipeline dengan validasi transisi | M | Transisi ilegal ditolak dengan pesan jelas |
| FR-ADM-06 | Catat aktivitas (telepon, WA, email, meeting, catatan) | M | Tercatat dengan aktor & waktu |
| FR-ADM-07 | Tetapkan lead ke staf | M | Assignee hanya pengguna berperan staf/admin |
| FR-ADM-08 | Ekspor CSV sesuai filter aktif | S | Maks 5.000 baris; kolom terdokumentasi |
| FR-ADM-09 | Deteksi duplikat nomor | S | Badge + tautan ke lead lain |
| FR-ADM-10 | CRUD desain + unggah media + atur urutan + cover | M | Simpan sebagai draft; publish manual |
| FR-ADM-11 | CRUD artikel/FAQ/testimoni | M | Editor teks kaya (Markdown atau WYSIWYG) |
| FR-ADM-12 | Pengaturan situs (kontak, jam kerja, teks hero, template WA) | S | Perubahan langsung tampil ≤ 5 menit |
| FR-ADM-13 | Dashboard: lead baru hari ini, belum dihubungi, per tipe, tren 30 hari | M | Angka konsisten dengan daftar lead |
| FR-ADM-14 | Kelola pengguna admin (undang, ubah peran, nonaktifkan) | S | Hanya `super_admin`; tidak bisa menonaktifkan diri sendiri |
| FR-ADM-15 | Audit log aksi tulis | S | Menyimpan aktor, aksi, entitas, waktu |
| FR-ADM-16 | Template pesan WhatsApp siap pakai per tipe lead | C | Tombol menyalin/membuka WA dengan isi terisi |

### 5.4 Modul analitik

| ID | Kebutuhan | Prioritas |
|----|-----------|:---------:|
| FR-AN-01 | Pencatatan event funnel (lihat daftar event di [06 §9](./06-ux-sitemap-wireframe.md#9-analitik-event)) | M |
| FR-AN-02 | Atribusi `utm_*` & referrer disimpan pada lead | M |
| FR-AN-03 | Integrasi alat pihak ketiga (GA4/Umami) | S |
| FR-AN-04 | Laporan konversi per sumber | C |

## 6. Kebutuhan non-fungsional

| ID | Kategori | Kebutuhan | Target terukur |
|----|----------|-----------|----------------|
| NFR-01 | Performa | Halaman publik utama (home, katalog, detail) | LCP p75 ≤ 2,5 s pada 4G; TTFB ≤ 800 ms |
| NFR-02 | Performa | Bobot JS halaman katalog | ≤ 180 KB gzip |
| NFR-03 | Performa | API baca publik p95 | ≤ 300 ms |
| NFR-04 | Ketersediaan | Uptime bulanan | ≥ 99,5% |
| NFR-05 | Skalabilitas | Kapasitas awal | 30.000 sesi/bulan, 500 lead/bulan, tanpa perubahan arsitektur |
| NFR-06 | Keamanan | Transport & header | HTTPS wajib, HSTS, CSP, `X-Content-Type-Options`, `Referrer-Policy` |
| NFR-07 | Keamanan | Kata sandi | Hash scrypt/argon2 oleh Better Auth; tidak pernah dicatat di log |
| NFR-08 | Keamanan | Otorisasi | Semua endpoint admin diverifikasi server-side, tidak bergantung UI |
| NFR-09 | Privasi | Kepatuhan UU PDP | Consent, minimasi, retensi 24 bulan, hak hapus ≤ 30 hari |
| NFR-10 | Aksesibilitas | WCAG 2.2 level AA pada alur utama | Kontras ≥ 4,5:1, navigasi keyboard, label form, fokus terlihat |
| NFR-11 | SEO | SSR untuk halaman konten; meta & canonical benar | Semua halaman publik punya title & description unik |
| NFR-12 | Kompatibilitas | Browser | 2 versi terakhir Chrome/Safari/Firefox/Edge; iOS 15+; Android 9+ |
| NFR-13 | Observabilitas | Error tracking & log terstruktur | Error 5xx terdeteksi < 5 menit |
| NFR-14 | Maintainability | Type-safety end-to-end | `tsc --noEmit` bersih; tidak ada `any` di kontrak API |
| NFR-15 | Backup | Data hilang maksimum | RPO ≤ 24 jam, RTO ≤ 4 jam |
| NFR-16 | Lokalisasi | Format tanggal & angka | `id-ID`, zona `Asia/Jakarta`, Rupiah tanpa desimal |

## 7. Aturan bisnis

| ID | Aturan |
|----|--------|
| BR-01 | Lead hanya dapat dibuat dengan `type` ∈ {`BUY_DESIGN`, `LAND_OFFER`, `INVEST`, `GENERAL`}. |
| BR-02 | `landSubmission` wajib ada untuk `LAND_OFFER`; `investmentInterest` wajib untuk `INVEST`. |
| BR-03 | Lead buatan pengunjung selalu mulai dari status `NEW`; hanya admin yang boleh mengubah status. |
| BR-04 | Nomor telepon harus nomor Indonesia yang valid (operator seluler). Nomor luar negeri ditolak pada MVP. |
| BR-05 | Desain berstatus `DRAFT`/`ARCHIVED` tidak dapat diakses publik maupun ditanyakan lewat form. |
| BR-06 | Desain tidak boleh dihapus permanen bila sudah punya lead; gunakan `ARCHIVED` (soft delete). |
| BR-07 | Perubahan status lead wajib tercatat sebagai `LeadActivity`. |
| BR-08 | Lead bersumber spam tidak dihapus otomatis; disimpan 90 hari lalu dibersihkan. |
| BR-09 | Data pribadi dihapus/dianonimkan 24 bulan setelah `closedAt`, kecuali ada kewajiban hukum. |
| BR-10 | Lampiran lahan hanya dapat diakses pengguna admin terautentikasi melalui URL bertanda tangan (kedaluwarsa 15 menit). |
| BR-11 | Harga desain ditampilkan sebagai "mulai dari" bila `priceFrom` diisi; bila kosong, tampil "Hubungi kami". |
| BR-12 | Estimasi biaya bangun selalu disertai disclaimer "bukan penawaran resmi". |

## 8. Asumsi & dependensi

| # | Asumsi/dependensi | Dampak bila tidak terpenuhi |
|---|-------------------|-----------------------------|
| A1 | Azetta menyediakan minimal 12 desain siap tayang + render/denah beresolusi tinggi | Katalog kosong, SEO & kredibilitas gagal |
| A2 | Semua transaksi & kontrak dilakukan di luar aplikasi | Perlu proses manual sales |
| A3 | Tim sales bersedia memakai panel admin sebagai satu-satunya sumber data lead | Data kembali tersebar |
| A4 | Domain `azetta.id` (atau setara) tersedia dan dapat diatur DNS-nya | Tidak bisa rilis di domain utama |
| A5 | Layanan email transaksional tersedia untuk notifikasi | Notifikasi jatuh ke alternatif WhatsApp/grup |
| A6 | Data wilayah Indonesia (provinsi/kabupaten) tersedia (statis atau API) | Dropdown wilayah harus disederhanakan jadi input bebas |
| A7 | Tidak ada kebutuhan audit keamanan formal (ISO/PCI) di fase MVP | Pengerasan & dokumentasi tambahan |

## 9. Pertanyaan yang sudah dijawab

| Pertanyaan | Jawaban | Dimana diimplementasikan |
|------------|---------|--------------------------|
| Apakah ada transaksi online? | Tidak — lead-gen, kontak di luar aplikasi | [02 §4](./02-model-bisnis-funnel.md#4-titik-handover-di-luar-aplikasi), [06](./06-ux-sitemap-wireframe.md) |
| Bahasa? | Indonesia saja | [10 §3](./10-seo-konten.md#3-peta-url) |
| Pasar? | Indonesia | Aturan BR-04 |
| Repo? | Monorepo | [03 §3](./03-arsitektur-teknis.md#3-struktur-monorepo) |

Pertanyaan yang **belum** terjawab ada di [12 §2](./12-risiko-asumsi-keputusan.md#2-pertanyaan-terbuka).

## 10. Referensi produk

| Referensi | Yang diambil | Yang sengaja tidak diambil |
|-----------|--------------|----------------------------|
| [ruma.id](https://ruma.id/) | Struktur katalog desain, filter, halaman detail dengan render + denah + estimasi biaya, CTA konsultasi | Model transaksi dan akun pengguna |
| Portal properti besar (99.co, Rumah123) | Pola filter & kartu listing | Volume listing pihak ketiga, iklan |
| Situs developer/kontraktor | Halaman "tentang", portofolio proyek, formulir kontak | — |
