# 01 — PRD: Produk & Kebutuhan

> Kembali ke [index](./README.md) · Sebelumnya: [00](./00-ringkasan-eksekutif.md) · Berikutnya: [02](./02-model-bisnis-funnel.md)

---

## 1. Visi & tujuan

**Visi:** menjadikan Azetta sebagai rujukan digital untuk "memiliki rumah" — tempat orang menemukan unit rumah yang layak dibeli, menawarkan lahan untuk dibeli atau dikerjasamakan, dan memahami proyek Azetta secara terbuka, lalu berlanjut ke transaksi nyata dengan Azetta.

**Tujuan produk (12 bulan pertama):**

| # | Tujuan | Ukuran |
|---|--------|--------|
| G1 | Menghasilkan lead berkualitas secara mandiri dari kanal digital | ≥ 40 lead/bulan pada bulan ke-3 |
| G2 | Mengurangi ketergantungan pada penjualan lisan | ≥ 50% lead baru berasal dari website |
| G3 | Menstandarkan presentasi penawaran | 100% penawaran memakai materi dari website |
| G4 | Membuat proses follow-up dapat diaudit | 100% lead punya status & pemilik |
| G5 | Membangun otoritas konten | 8 artikel + 12 unit rumah terindeks pada bulan ke-3 |
| G6 | Memberi ketenangan setelah pengajuan | ≥ 30% lead memiliki akun; ≥ 40% pemilik akun membuka halaman status ≥ 2× |

**Non-tujuan (bukan alasan website ini dibuat):**

- Bukan toko online: tidak ada pembayaran, booking, atau unduhan otomatis.
- Bukan portal listing properti pihak ketiga: hanya unit dari proyek Azetta.
- Bukan kanal pendaftaran investor: halaman investasi bersifat informasi.
- Bukan pengganti CRM perusahaan penuh: cukup untuk menampung dan mengelola lead website.

## 2. Persona

### P1 — Calon pembeli rumah ("Pak Budi", 34, karyawan/kontraktor kecil)

- **Konteks:** punya anggaran Rp 600 juta–1,2 miliar, mencari rumah tapak untuk keluarga di kota tempat ia bekerja.
- **Masalah:** bingung memilih tipe dan lokasi; tidak tahu kisaran harga serta unit mana yang masih tersedia; ragu menghubungi karena takut dipaksa membeli.
- **Perilaku:** mencari lewat Google ("rumah dijual 2 lantai [kota]", "rumah subsidi [kota]"), melihat banyak foto di ponsel, membandingkan beberapa pengembang, menyimpan tautan unit.
- **Yang meyakinkan:** render realistis, denah jelas, spesifikasi, harga "mulai dari", lokasi & akses, progres proyek, legalitas, testimoni, dan status ketersediaan yang jelas.
- **Aksi sukses:** mengirim form "Tanya unit ini" dengan nomor WhatsApp aktif (opsional membuat akun untuk memantau progres).

> Catatan: akun **tidak wajib** untuk mengirim form. Akun ditawarkan *setelah* submit ("Buat akun untuk memantau progres") agar tidak menambah gesekan di awal.

### P2 — Pemilik lahan ("Bu Sari", 52, pemilik tanah warisan)

- **Konteks:** memiliki lahan 800 m² di pinggir kota, tidak punya modal membangun.
- **Masalah:** tidak paham skema kerja sama; khawatir lahan "hilang" atau dirugikan; butuh kepastian legal.
- **Perilaku:** mencari "kerja sama tanah tanpa modal", "bagi hasil tanah dengan developer".
- **Yang meyakinkan:** penjelasan skema bagi hasil yang jelas, alur dan dokumen yang dibutuhkan, contoh proyek, legalitas perusahaan, tidak ada biaya di muka.
- **Aksi sukses:** mengirim form lahan lengkap dengan foto dan perkiraan luas.

### P3 — Investor ("Pak Hendra", 45, profesional/pengusaha)

- **Konteks:** punya dana menganggur Rp 500 juta–5 miliar, mencari instrumen properti.
- **Masalah:** butuh gambaran proyek, skema bagi hasil, horizon waktu, dan risiko sebelum menghubungi.
- **Perilaku:** membandingkan beberapa developer, mengecek rekam jejak, membaca halaman "tentang" dan portofolio.
- **Yang meyakinkan:** profil perusahaan, ringkasan proyek berjalan, tata kelola, kontak yang responsif.
- **Aksi sukses:** menghubungi manajemen lewat kanal kontak di halaman `/investasi`.

> Catatan: halaman investasi adalah **halaman pemberitahuan**. Tidak ada formulir, tidak ada akun investor, dan kontak yang masuk tidak dicatat sebagai `Lead` — percakapan dikelola manajemen di luar CRM website.

### P4 — Staf sales/admin Azetta ("Mbak Rina", 27)

- **Konteks:** menerima lead dari website, menelepon/WhatsApp, mencatat hasil.
- **Masalah:** lead tersebar di WA pribadi & spreadsheet; lupa follow-up; tidak ada rekap.
- **Kebutuhan:** satu daftar lead dengan status, prioritas, catatan, dan pengingat sederhana.
- **Aksi sukses:** mengubah status lead dan mencatat aktivitas dalam < 1 menit.

> Pada MVP **semua lead ditangani oleh peran `admin`** (keputusan Q6). Tidak ada peran `staff` terpisah dan tidak ada routing otomatis per tipe lead.

### P5 — Pemilik/pengelola Azetta

- **Kebutuhan:** melihat performa kanal, kualitas lead, dan konten yang tayang tanpa bertanya ke tim.

## 3. Perjalanan pengguna

### 3.1 Calon pembeli rumah

```text
Google/IG Ads ──► Home ──► Katalog unit (filter) ──► Detail unit
                                                        │
                                            [Tanya unit ini]
                                                        ▼
                                            Form singkat (nama, WA, pesan)
                                                        ▼
                                        Halaman terima kasih + tombol WA
                                                        ▼
                            (opsional) "Buat akun untuk memantau progres"
                                                        ▼
                                      Sales menerima notifikasi & menindaklanjuti
```

Titik gesek yang harus dihilangkan: form lebih dari 5 field pada alur ini, **permintaan membuat akun sebelum submit**, dan **status ketersediaan unit yang tidak jelas** (pengunjung menanyakan unit yang sudah terjual).

### 3.1a Setelah membuat akun (pemantauan)

```text
/daftar ──► verifikasi email ──► /akun
                                   │
                                   ├─ Daftar pengajuan (unit rumah/lahan)
                                   │      └─ status ringkas + catatan terbaru dari tim
                                   └─ Profil (nama, WhatsApp, kota, kata sandi)
```

### 3.2 Pemilik lahan

```text
Google "kerja sama lahan" ──► /kerja-sama-lahan
        │  (dua opsi: dijual ke Azetta atau dikerjasamakan; skema, syarat, alur, FAQ, contoh proyek)
        ▼
[Tawarkan lahan] ──► Form 3 langkah
        1. Identitas & kontak
        2. Data lahan (alamat, luas, legalitas, akses, foto)
        3. Maksud penawaran (dijual / dikerjasamakan) + skema yang diinginkan + persetujuan
        ▼
Terima kasih + estimasi waktu respons (2 hari kerja)
        ▼
Sales kualifikasi → survei lokasi → penawaran harga beli atau proposal kerja sama (di luar sistem)
```

### 3.3 Informasi investasi

```text
Google/relasi ──► /investasi (profil perusahaan, proyek berjalan, skema, risiko, FAQ)
        │
        └─► [Hubungi manajemen] ──► WhatsApp / email (tanpa form, tanpa lead)
                                        ▼
                            Manajemen menindaklanjuti di luar sistem
```

Tidak ada formulir, tidak ada tahap funnel, dan tidak ada data yang masuk ke CRM website. Halaman ini murni informasi agar calon investor bisa menilai Azetta sebelum menghubungi.

### 3.4 Admin (harian)

```text
Login admin ──► Dashboard (lead baru, belum dihubungi)
   ▼
Daftar lead (filter: baru / tipe / prioritas / assignee)
   ▼
Detail lead ──► [WhatsApp] template pesan ──► catat aktivitas ──► ubah status
   ▼
Lead qualified ──► diteruskan ke tim proyek/legal (di luar sistem)
```

Semua pengguna internal memakai peran `admin`; `super_admin` hanya untuk mengelola akun pengguna.

## 4. Ruang lingkup

### 4.1 Matriks lingkup

| Modul | Fitur | MVP | Fase 2 | Catatan |
|-------|-------|:---:|:------:|---------|
| **Katalog unit rumah** | Daftar unit + filter + pencarian | ✅ | | Server-side filter, URL shareable; hanya unit dari proyek publish |
| | Detail unit (galeri render, denah, spesifikasi, CTA) | ✅ | | **Harga final & skema pembayaran tidak ditampilkan** (Q5) |
| | Status ketersediaan per unit (`TERSEDIA`/`INDENT`/`TERJUAL`) | ✅ | | Badge status; unit terjual tetap dapat diakses, CTA dialihkan ke unit sejenis |
| | Unit terkait | ✅ | | 4 item, berbasis proyek/kota/tipe |
| | Harga "mulai dari" per tipe | ✅ | | Bila `priceFrom` kosong → "Hubungi kami" (Q5) |
| | Simpan/favorit | ❌ | ✅ | Bisa menyusul setelah akun publik ada |
| **Proyek** | Halaman portofolio `/proyek` + detail | ✅ | | Proyek dari CMS, hanya yang `isPublished` (Q4) |
| | CMS proyek + galeri | ✅ | | Tanpa angka keuangan sensitif |
| **Lead** | Form tanya unit rumah | ✅ | | Guest atau akun; akun tidak wajib |
| | Form pengajuan lahan (3 langkah + foto) | ✅ | | Maks 5 foto, 5 MB/foto; maksud dijual/dikerjasamakan |
| | Form kontak umum | ✅ | | `type = GENERAL` |
| | Notifikasi lead baru ke admin (email) | ✅ | | Tanpa WhatsApp gateway (Q7) — lihat [05 §8](./05-spesifikasi-api.md#8-notifikasi) |
| | Auto-reply email ke pemohon | ❌ | ✅ | Butuh domain email terverifikasi & template transaksional |
| | Tautan lead ke akun pemohon | ✅ | | Bila pengunjung login saat submit |
| **Akun publik** | Registrasi, login, verifikasi email, reset kata sandi | ✅ | | Better Auth; verifikasi wajib (Q1) |
| | Halaman "Akun saya": profil + daftar pengajuan | ✅ | | Melihat status & catatan dari tim |
| | Detail pengajuan + riwayat status | ✅ | | Terbatas pada pengajuan milik sendiri |
| | Permohonan hapus akun | ✅ | | Diajukan dari `/akun/profil`; tampil sebagai daftar di admin; penghapusan/anonimisasi diproses manual (Q12) |
| | Hapus akun mandiri (otomatis) | ❌ | ✅ | Fase 2 — butuh alur penghapusan otomatis |
| | Favorit, notifikasi, chat | ❌ | ✅ | — |
| **Panel admin** | Login & manajemen sesi | ✅ | | Peran `admin` / `super_admin` |
| | CRM lead (list, filter, detail, aktivitas, assignment, ekspor) | ✅ | | Semua lead ditangani admin (Q6) |
| | Pipeline status + alasan lost + catatan untuk pemohon | ✅ | | Catatan tampil di akun pemohon |
| | Deteksi duplikat (nomor WA) | ✅ | | Peringatan, bukan blokir |
| | Template pesan WhatsApp | ✅ | | Disimpan sebagai setting |
| | Pengingat follow-up otomatis | ❌ | ✅ | |
| | CMS unit rumah + media manager + status ketersediaan | ✅ | | Unit terikat ke proyek; render, denah, foto |
| | CMS artikel, FAQ, testimoni | ✅ | | |
| | CMS proyek + galeri | ✅ | | |
| | Pengaturan situs: kontak, hero, template WA, brand, dokumen legal | ✅ | | Dapat diubah saat produksi (Q3, Q10) |
| | Manajemen pengguna internal | ✅ | | Hanya `super_admin` |
| | Audit log | ✅ | | Aksi tulis admin |
| | Dashboard statistik | ✅ | | 4 kartu + grafik 30 hari |
| **Transaksi** | Pembayaran online / booking unit | ❌ | ✅ | Di luar MVP |
| | Pengajuan KPR di situs | ❌ | ✅ | Diarahkan ke bank mitra di luar sistem |
| | Kontrak digital / e-sign | ❌ | ✅ | |
| **Investor** | Halaman informasi `/investasi` | ✅ | | Tanpa form, tanpa lead (Q13) |
| | Portal investor & laporan proyek | ❌ | ✅ | Butuh akun undangan, bukan pendaftaran publik |
| **Lain-lain** | Multi-bahasa | ❌ | ✅ | Struktur i18n disiapkan, konten ID saja |
| | Blog/tag | ✅ | | Tag sederhana |
| | Newsletter | ❌ | ✅ | |

### 4.2 Definisi "selesai" untuk MVP

MVP dinyatakan selesai bila seluruh butir berikut benar:

1. Kedua formulir lead (tanya unit & pengajuan lahan) berhasil mengirim data dan muncul di panel admin < 5 detik.
2. Lead dapat diubah status, diberi catatan, dan diekspor CSV.
3. Pengunjung dapat mendaftar akun, memverifikasi email, dan melihat **hanya** pengajuannya sendiri beserta status terbaru.
4. Halaman `/proyek` menampilkan proyek yang dipublikasikan dari CMS.
5. Seluruh konten unit/artikel/proyek dapat dikelola dari panel admin tanpa deploy ulang.
6. Tidak ada halaman publik yang menampilkan data placeholder.
7. Lighthouse mobile ≥ 90 untuk Performance, Accessibility, Best Practices, SEO pada 4 halaman utama.
8. Checklist keamanan di [09 §7](./09-qa-test-plan.md#7-checklist-keamanan) lulus.
9. UAT oleh perwakilan sales dan manajemen disetujui.
10. Pemohon dapat mengajukan hapus akun dan permohonan tersebut tampil di daftar admin (penghapusan data dilakukan manual, di luar sistem).

## 5. Kebutuhan fungsional

Prioritas memakai MoSCoW: **M** = must, **S** = should, **C** = could.

### 5.1 Modul publik — katalog

| ID | Kebutuhan | Prioritas | Kriteria penerimaan ringkas |
|----|-----------|:---------:|------------------------------|
| FR-PUB-01 | Pengunjung dapat melihat daftar unit rumah berstatus `PUBLISHED` dari proyek yang juga `PUBLISHED` | M | Hanya unit publish yang tampil; draft/arsip 404 |
| FR-PUB-02 | Daftar dapat difilter proyek, kota, tipe, jumlah kamar tidur, luas tanah minimum, luas bangunan minimum, rentang harga, dan status ketersediaan | M | Filter tercermin di query string & bisa dibagikan |
| FR-PUB-03 | Pencarian teks pada judul unit, nama proyek, tipe, dan lokasi | M | Hasil relevan; minimal 1 karakter → debounce 300 ms |
| FR-PUB-04 | Urutan: terbaru, harga terendah, harga tertinggi, luas tanah terbesar | S | Default terbaru/featured |
| FR-PUB-05 | Pagination 12 unit/halaman | M | Navigasi tetap accessible |
| FR-PUB-06 | Detail unit menampilkan galeri render, denah, spesifikasi, tipe, status ketersediaan, dan CTA | M | Semua field kosong disembunyikan; **harga final dan skema pembayaran tidak ditampilkan** (internal sales) |
| FR-PUB-07 | Unit terkait (maks 4) | S | Prioritas proyek/kota/tipe sama; fallback ke unit terbaru |
| FR-PUB-08 | Halaman artikel & detail artikel | M | Konten dari CMS, slug unik |
| FR-PUB-09 | Halaman FAQ, tentang, kontak, kebijakan privasi, syarat & ketentuan | M | Dapat diedit lewat CMS/settings |
| FR-PUB-10 | Tombol WhatsApp mengambang | S | Membuka `wa.me` dengan pesan pembuka berisi judul unit (bila di halaman detail) |
| FR-PUB-11 | Halaman `/proyek` menampilkan proyek `isPublished` | M | Urut `sortOrder` lalu tahun terbaru; kosong → section disembunyikan |
| FR-PUB-12 | Detail proyek `/proyek/[slug]` | M | Galeri, lokasi, tahun, ringkasan; proyek tidak publish → 404 |
| FR-PUB-13 | Halaman proyek memuat CTA ke katalog unit & kerja sama lahan | S | Maks 2 CTA, tidak mengganggu bacaan |
| FR-PUB-14 | Halaman `/investasi` menampilkan informasi perusahaan/proyek **tanpa formulir** | M | Hanya CTA WhatsApp/email; tidak ada endpoint pembuatan lead investor |
| FR-PUB-15 | Unit berstatus `TERJUAL` tetap dapat diakses publik | S | Badge "Terjual"; form dinonaktifkan; CTA diarahkan ke unit sejenis (BR-12) |

### 5.2 Modul lead

| ID | Kebutuhan | Prioritas | Kriteria penerimaan ringkas |
|----|-----------|:---------:|------------------------------|
| FR-LEAD-01 | Form tanya unit pada halaman detail & modal dari kartu katalog | M | Prefill `unitId`; field: nama, WhatsApp, email (opsional), pesan |
| FR-LEAD-02 | Form pengajuan lahan 3 langkah | M | Data tersimpan per langkah; bisa kembali tanpa kehilangan isian |
| FR-LEAD-03 | Unggah maks 5 foto lahan (JPG/PNG/WebP, ≤5 MB) | M | Format & ukuran divalidasi di klien dan server |
| FR-LEAD-04 | Pilihan maksud penawaran lahan: **dijual** atau **dikerjasamakan** | M | Wajib dipilih di langkah 3; bila "belum tahu" boleh dikosongkan dengan catatan |
| FR-LEAD-05 | Persetujuan pemrosesan data pribadi wajib dicentang | M | Tidak bisa submit tanpa centang; teks mengarah ke kebijakan privasi |
| FR-LEAD-06 | Anti-spam: honeypot, Turnstile, rate limit, waktu isi minimum | M | Bot honeypot ditolak diam-diam (200 palsu) dan dicatat sebagai `SPAM` |
| FR-LEAD-07 | Nomor telepon dinormalisasi ke format `+62…` | M | Input `0812…`, `+62812…`, `62812…` menghasilkan nilai sama |
| FR-LEAD-08 | Halaman terima kasih dengan nomor referensi & tombol WhatsApp | M | Referensi tampil dan dapat dipakai sales untuk mencari lead |
| FR-LEAD-09 | Notifikasi lead baru ke tim (email) | M | Terkirim < 60 detik; kegagalan notifikasi tidak membatalkan penyimpanan lead |
| FR-LEAD-10 | Deduplikasi: peringatan bila nomor sama dalam 24 jam | S | Lead tetap dibuat; admin melihat badge "duplikat" |
| FR-LEAD-11 | Form kontak umum | C | Menghasilkan `type = GENERAL` |
| FR-LEAD-12 | Simpan draf form di `sessionStorage` | C | Dihapus setelah submit sukses |
| FR-LEAD-13 | Bila pengunjung sedang login, lead ditautkan ke akunnya | M | `Lead.userId` terisi; muncul di halaman "Akun saya" |
| FR-LEAD-14 | Setelah submit, tawarkan pembuatan akun (opsional) | S | Tautan "Buat akun untuk memantau progres"; tidak menghalangi |
| FR-LEAD-15 | Tidak ada formulir pendaftaran investor | M | Halaman `/investasi` hanya CTA WhatsApp/email; `type` lead tidak memiliki nilai `INVEST` |

### 5.3 Modul admin

| ID | Kebutuhan | Prioritas | Kriteria penerimaan ringkas |
|----|-----------|:---------:|------------------------------|
| FR-ADM-01 | Login email+password; sesi 7 hari; logout | M | Salah password 5× → jeda 60 detik (rate limit) |
| FR-ADM-02 | Otorisasi berbasis peran (`admin`, `super_admin`) | M | Rute admin tanpa sesi → redirect login; API → 401/403 |
| FR-ADM-03 | Daftar lead dengan filter status/tipe/assignee/tanggal + pencarian | M | Query dipertahankan di URL |
| FR-ADM-04 | Detail lead: kontak, data spesifik tipe (unit/lahan), lampiran, riwayat aktivitas | M | Data lahan tampil terstruktur, bukan JSON mentah |
| FR-ADM-05 | Ubah status via pipeline dengan validasi transisi | M | Transisi ilegal ditolak dengan pesan jelas |
| FR-ADM-06 | Catat aktivitas (telepon, WA, email, meeting, catatan) | M | Tercatat dengan aktor & waktu |
| FR-ADM-07 | Tetapkan lead ke admin | M | Assignee hanya pengguna berperan `admin`/`super_admin` |
| FR-ADM-08 | Ekspor CSV sesuai filter aktif | S | Maks 5.000 baris; kolom terdokumentasi |
| FR-ADM-09 | Deteksi duplikat nomor | S | Badge + tautan ke lead lain |
| FR-ADM-10 | CRUD unit rumah + unggah media + status ketersediaan + atur urutan + cover | M | Simpan sebagai draft; publish manual; `salesStatus` terpisah dari status publish |
| FR-ADM-11 | CRUD artikel/FAQ/testimoni | M | Editor WYSIWYG Tiptap; gambar diunggah lewat presign; konten disimpan sebagai HTML tersanitasi |
| FR-ADM-12 | Pengaturan situs (kontak, jam kerja, teks hero, template WA) | S | Perubahan langsung tampil ≤ 5 menit |
| FR-ADM-13 | Dashboard: lead baru hari ini, belum dihubungi, per tipe, tren 30 hari | M | Angka konsisten dengan daftar lead |
| FR-ADM-14 | Kelola pengguna admin (undang, ubah peran, nonaktifkan) | S | Hanya `super_admin`; tidak bisa menonaktifkan diri sendiri |
| FR-ADM-15 | Audit log aksi tulis | S | Menyimpan aktor, aksi, entitas, waktu |
| FR-ADM-16 | Template pesan WhatsApp siap pakai per tipe lead | C | Tombol menyalin/membuka WA dengan isi terisi |
| FR-ADM-17 | CRUD proyek + galeri gambar | M | Publish manual; proyek tidak publish tidak tampil di web |
| FR-ADM-18 | Unggah aset merek & dokumen legal di Pengaturan | M | Logo, dokumen PDF; URL tersimpan di setting; hanya `admin` |
| FR-ADM-19 | Tulis catatan untuk pemohon pada lead | M | Tampil di halaman akun pemohon; tanpa data internal |
| FR-ADM-20 | Daftar permohonan hapus akun + tandai selesai/ditolak | M | Hanya menampilkan permohonan `PENDING` secara default; aksi tercatat di audit; penghapusan data dilakukan manual |

### 5.4 Modul analitik

| ID | Kebutuhan | Prioritas |
|----|-----------|:---------:|
| FR-AN-01 | Pencatatan event funnel (lihat daftar event di [06 §9](./06-ux-sitemap-wireframe.md#9-analitik-event)) | M |
| FR-AN-02 | Atribusi `utm_*` & referrer disimpan pada lead | M |
| FR-AN-03 | Integrasi alat pihak ketiga (GA4/Umami) | S |
| FR-AN-04 | Laporan konversi per sumber | C |

### 5.5 Modul akun publik

| ID | Kebutuhan | Prioritas | Kriteria penerimaan ringkas |
|----|-----------|:---------:|------------------------------|
| FR-ACC-01 | Registrasi dengan email + kata sandi | M | Kata sandi min. 8 karakter; email unik; Turnstile aktif; pesan error tidak mengungkap apakah email terdaftar |
| FR-ACC-02 | Verifikasi email sebelum dapat melihat pengajuan | M | Tautan verifikasi berlaku 24 jam; dapat kirim ulang maks 3×/jam |
| FR-ACC-03 | Login, logout, lupa kata sandi | M | Reset via email, token sekali pakai berlaku 1 jam |
| FR-ACC-04 | Halaman `Akun saya` berisi profil & daftar pengajuan | M | Hanya menampilkan `Lead.userId = user.id` |
| FR-ACC-05 | Detail pengajuan menampilkan status ramah pengguna & catatan tim | M | Status internal dipetakan (lihat [05 §4.7](./05-spesifikasi-api.md#47-akun-saya)); tanpa catatan internal |
| FR-ACC-06 | Ubah profil (nama, WhatsApp, kota) & kata sandi | M | Perubahan tercatat di audit ringan; email tidak dapat diubah sendiri di MVP |
| FR-ACC-07 | Pengajuan tanpa akun tetap dapat ditautkan nanti | S | Setelah verifikasi email yang sama, pengajuan dengan email tersebut otomatis tertaut |
| FR-ACC-08 | Ajukan hapus akun dari `/akun/profil` | M | Membuat `AccountDeletionRequest` berstatus `PENDING`; status permohonan tampil; akun tetap aktif sampai admin memproses; maksimal satu permohonan aktif per akun |
| FR-ACC-09 | Sesi akun 30 hari, dapat dilihat & diakhiri dari perangkat lain | C | Daftar sesi sederhana |

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
| NFR-17 | Keamanan akun | Perlindungan kredensial | Rate limit login/registrasi/reset; pesan error seragam; sesi di DB dapat dicabut |
| NFR-18 | Privasi akun | Isolasi data antar pengguna | Setiap query pengajuan difilter `userId`; tidak ada IDOR (diuji otomatis) |
| NFR-19 | Ketersediaan email | Pengiriman verifikasi & reset | Retry 3×; kegagalan tercatat & terlihat di admin |
| NFR-20 | Identitas visual | Kepatuhan Brand Guidelines v1.0 pada web publik & admin | Palet monokrom (ink/paper/mist/line) untuk permukaan & aksi, ditambah empat rona status muted (info/success/warning/error, D20); huruf Arial, tanpa bayangan; logo & favicon dari berkas resmi |
| NFR-21 | Bahasa materi publik | Nada dan aturan wajib Brand Guidelines §07 | Sapaan "Anda", kalimat pendek, angka `Rp 1.500.000`, tidak ada klaim hasil/imbal pasti maupun risiko nol |

## 7. Aturan bisnis

| ID | Aturan |
|----|--------|
| BR-01 | Lead hanya dapat dibuat dengan `type` ∈ {`BUY_UNIT`, `LAND_OFFER`, `GENERAL`}. |
| BR-02 | `landSubmission` wajib ada untuk `LAND_OFFER`; `unitId` wajib ada untuk `BUY_UNIT`. |
| BR-03 | Lead buatan pengunjung selalu mulai dari status `NEW`; hanya admin yang boleh mengubah status. |
| BR-04 | Nomor telepon harus nomor Indonesia yang valid (operator seluler). Nomor luar negeri ditolak pada MVP. |
| BR-05 | Unit berstatus `DRAFT`/`ARCHIVED` tidak dapat diakses publik maupun ditanyakan lewat form. |
| BR-06 | Unit tidak boleh dihapus permanen bila sudah punya lead; gunakan `ARCHIVED` (soft delete). |
| BR-07 | Perubahan status lead wajib tercatat sebagai `LeadActivity`. |
| BR-08 | Lead bersumber spam tidak dihapus otomatis; disimpan 90 hari lalu dibersihkan. |
| BR-09 | Data pribadi dihapus/dianonimkan 24 bulan setelah `closedAt`, kecuali ada kewajiban hukum. |
| BR-10 | Lampiran lahan hanya dapat diakses pengguna admin terautentikasi melalui URL bertanda tangan (kedaluwarsa 15 menit). |
| BR-11 | Harga unit ditampilkan sebagai "mulai dari" per tipe bila `priceFrom` diisi; bila kosong, tampil "Hubungi kami". |
| BR-12 | Unit `TERJUAL` tetap dapat diakses publik dengan badge status; formulir dinonaktifkan dan CTA diarahkan ke unit sejenis. |
| BR-13 | Akun publik hanya dapat melihat pengajuan dengan `userId` miliknya; tidak ada akses berdasarkan nomor referensi saja. |
| BR-14 | Pengajuan tanpa akun otomatis tertaut ke akun ketika email yang sama diverifikasi (bila email diisi). |
| BR-15 | Email harus terverifikasi sebelum data pengajuan ditampilkan. |
| BR-16 | Proyek hanya tampil publik bila `isPublished = true`; persetujuan publikasi diperoleh di luar sistem. |
| BR-17 | Catatan untuk pemohon (`customerNote`) tidak boleh memuat data lead lain, angka internal, atau penilaian internal. |
| BR-18 | Registrasi publik selalu menghasilkan peran `customer`; akun internal hanya dibuat `super_admin`. |
| BR-19 | Akun dengan peran `customer` tidak dapat mengakses `/admin/*` meskipun memiliki sesi valid. |
| BR-20 | Halaman `/investasi` tidak memiliki formulir dan tidak membuat `Lead`; kanal yang tersedia hanya WhatsApp/email. |
| BR-21 | Status ketersediaan unit (`salesStatus`) hanya dapat diubah admin; perubahan tercatat di audit log beserta waktunya. |

## 8. Asumsi & dependensi

| # | Asumsi/dependensi | Dampak bila tidak terpenuhi |
|---|-------------------|-----------------------------|
| A1 | Azetta menyediakan minimal 12 unit siap tayang (dari ≥3 proyek) + foto/render/denah beresolusi tinggi | Katalog kosong, SEO & kredibilitas gagal |
| A2 | Semua transaksi & kontrak dilakukan di luar aplikasi | Perlu proses manual sales |
| A3 | Tim sales bersedia memakai panel admin sebagai satu-satunya sumber data lead | Data kembali tersebar |
| A4 | Domain `azetta.id` (atau setara) tersedia dan dapat diatur DNS-nya | Tidak bisa rilis di domain utama |
| A5 | Layanan email transaksional tersedia untuk notifikasi | Notifikasi jatuh ke alternatif WhatsApp/grup |
| A6 | Data wilayah Indonesia (provinsi/kabupaten) tersedia (statis atau API) | Dropdown wilayah harus disederhanakan jadi input bebas |
| A7 | Tidak ada kebutuhan audit keamanan formal (ISO/PCI) di fase MVP | Pengerasan & dokumentasi tambahan |
| A8 | Proyek yang dipublikasikan telah mendapat persetujuan manajemen Azetta (proyek milik sendiri) | Risiko kerahasiaan & relasi (R21) |

## 9. Pertanyaan yang sudah dijawab

| Pertanyaan | Jawaban | Dimana diimplementasikan |
|------------|---------|--------------------------|
| Apakah ada transaksi online? | Tidak — lead-gen, kontak di luar aplikasi | [02 §4](./02-model-bisnis-funnel.md#4-titik-handover-di-luar-aplikasi), [06](./06-ux-sitemap-wireframe.md) |
| Apakah pengunjung punya akun? | Ya, untuk memantau progres pengajuan | [01 §5.5](#55-modul-akun-publik), [06 §4.12](./06-ux-sitemap-wireframe.md#412-akun-saya) |
| Domain? | `azetta.id` + subdomain `admin`, `api`, `media` | [11 §1](./11-deployment-operations.md#1-environment) |
| Nomor kontak & jam kerja? | Dikelola lewat halaman Pengaturan admin | [04 §3.4](./04-data-model.md#34-article-faq-testimonial-sitesetting) |
| Ada proyek yang boleh dipublikasikan? | Ya — halaman `/proyek` | [01 §5.1](#51-modul-publik--katalog) FR-PUB-11..13 |
| Harga final unit & skema pembayaran ditampilkan? | Tidak — hanya "mulai dari" per tipe; sisanya dibahas sales | BR-11, [06 §4.3](./06-ux-sitemap-wireframe.md#43-detail-unit-rumah-rumahslug) |
| Investor bisa mendaftar lewat website? | Tidak — halaman `/investasi` hanya informasi + CTA kontak | FR-PUB-14, FR-LEAD-15, BR-20 |
| WhatsApp gateway? | Tidak dipakai; email saja | [05 §8](./05-spesifikasi-api.md#8-notifikasi) |
| Siapa menangani lead? | Semua admin, tanpa routing per tipe | BR-03, [05 §3.2](./05-spesifikasi-api.md#32-matriks-otorisasi) |
| Bahasa? | Indonesia saja | [10 §3](./10-seo-konten.md#3-peta-url) |
| Pasar? | Indonesia | Aturan BR-04 |
| Repo? | Monorepo | [03 §3](./03-arsitektur-teknis.md#3-struktur-monorepo) |
| Verifikasi email wajib? | Ya — sebelum akun dapat melihat pengajuan (Q11) | FR-ACC-02, [03 §6.1](./03-arsitektur-teknis.md#61-konfigurasi-better-auth) |
| Boleh hapus akun sendiri? | Tidak — hanya mengajukan permohonan; admin memproses (Q12) | FR-ACC-08, FR-ADM-20, [04 §3.7](./04-data-model.md#37-accountdeletionrequest) |

Pertanyaan lanjutan Q11 (verifikasi email) dan Q12 (hapus akun) diterapkan pada v1.2; Q13 (halaman investor tanpa formulir) diterapkan pada v1.6 — lihat [12 §2](./12-risiko-asumsi-keputusan.md#2-keputusan-atas-pertanyaan-terbuka). Mekanisme teknis penghapusan (Q12a) masih ditunda.

## 10. Referensi produk

| Referensi | Yang diambil | Yang sengaja tidak diambil |
|-----------|--------------|----------------------------|
| [ruma.id](https://ruma.id/) | Struktur katalog rumah, filter, halaman detail dengan render + denah, CTA konsultasi | Model transaksi, akun penuh, dan tampilan skema pembayaran |
| Portal properti besar (99.co, Rumah123) | Pola filter & kartu listing | Volume listing pihak ketiga, iklan |
| Situs developer/kontraktor | Halaman "tentang", portofolio proyek, formulir kontak | — |
