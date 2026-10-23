# 06 — Sitemap, UX & Wireframe

> Kembali ke [index](./README.md) · Sebelumnya: [05](./05-spesifikasi-api.md) · Berikutnya: [07](./07-backlog-sprint.md)

---

## 1. Prinsip UX

1. **Satu halaman, satu keputusan.** Setiap halaman penawaran hanya mendorong satu aksi utama.
2. **Mobile-first.** ±75% trafik properti datang dari ponsel; semua form dirancang untuk satu tangan.
3. **Bukti sebelum permintaan.** Gambar, spesifikasi, dan penjelasan skema tampil sebelum form meminta data.
4. **Tidak ada kejutan.** Jumlah langkah, waktu pengisian, dan apa yang terjadi setelah submit dinyatakan sejak awal.
5. **Bisa dipindai.** Judul jelas, paragraf pendek, angka penting ditonjolkan, tidak ada dinding teks.
6. **Aksesibel.** Kontras AA, navigasi keyboard, label eksplisit, error terbaca pembaca layar.

## 2. Sitemap

### 2.1 Publik (`azetta.id`)

```text
/
├─ /desain                          katalog + filter
│  └─ /desain/[slug]                detail desain
├─ /kerjasama-lahan                 penawaran untuk pemilik lahan
├─ /investasi                       penawaran untuk investor
├─ /proyek                          (opsional MVP+) portofolio proyek
├─ /artikel                         daftar artikel
│  └─ /artikel/[slug]               detail artikel
├─ /tentang
├─ /kontak
├─ /faq
├─ /terima-kasih/[type]             type: desain | lahan | investasi | umum  (noindex)
├─ /kebijakan-privasi
├─ /syarat-ketentuan
├─ /sitemap.xml
├─ /robots.txt
└─ /404
```

### 2.2 Admin (`admin.azetta.id`)

```text
/login
/dashboard
/leads
/leads/[id]
/desain
/desain/baru
/desain/[id]
/artikel
/artikel/[id]
/konten/faq
/konten/testimoni
/pengguna
/pengaturan
/audit
```

> `/pengguna` hanya tampil untuk `super_admin`. Menu lain tampil untuk `admin` dan `super_admin`; `staff` hanya melihat `/dashboard` dan `/leads`.

## 3. Navigasi global

### 3.1 Header publik

```text
┌──────────────────────────────────────────────────────────────────┐
│ [Logo Azetta]   Desain   Kerja Sama Lahan   Investasi   Artikel  │
│                                          [Hubungi Kami ▸]        │
└──────────────────────────────────────────────────────────────────┘
```

- Tinggi 64 px (mobile 56 px), sticky dengan latar semi-transparan setelah scroll.
- Mobile: logo + tombol menu (drawer dari kanan). Drawer memuat tautan + CTA WhatsApp.
- Item aktif ditandai garis bawah dan `aria-current="page"`.
- CTA "Hubungi Kami" mengarah ke `/kontak`; di halaman detail desain diganti "Tanya Desain Ini" (scroll ke form).

### 3.2 Footer

Empat kolom (mobile: akordeon):

| Kolom | Isi |
|-------|-----|
| Merek | Logo, kalimat singkat, alamat, jam operasional |
| Layanan | Desain, Kerja Sama Lahan, Investasi, Proyek |
| Informasi | Tentang, Artikel, FAQ, Kontak |
| Legal | Kebijakan Privasi, Syarat & Ketentuan + nomor WhatsApp/email |

Baris bawah: `© 2026 Azetta. Seluruh hak cipta dilindungi.`

### 3.3 Navigasi admin

Sidebar kiri 240 px (collapse jadi 64 px), berisi Dashboard, Lead (dengan badge jumlah `NEW`), Desain, Artikel, FAQ, Testimoni, Pengguna*, Pengaturan, Audit. Header atas: pencarian global (lead), nama pengguna, menu keluar.

## 4. Spesifikasi halaman publik

Format tiap halaman: **tujuan → struktur → CTA → status → SEO → event**.

### 4.1 Beranda `/`

**Tujuan:** menyatakan siapa Azetta dan mengarahkan pengunjung ke tiga jalur yang tepat dalam < 10 detik.

**Struktur:**

1. **Hero** — headline nilai (mis. "Desain rumah yang siap dibangun, lahan yang diolah bersama, modal yang tumbuh bersama"), subheadline 1 kalimat, dua CTA: "Lihat Katalog Desain" (utama) + "Tawarkan Lahan Anda" (sekunder), gambar render.
2. **Tiga kartu jalur** — Desain / Kerja Sama Lahan / Investasi, masing-masing dengan ikon Iconify, 1 kalimat, tautan.
3. **Desain unggulan** — 6 kartu desain (`featured`), tautan "Lihat semua desain".
4. **Cara kerja** — 3–4 langkah bernomor (konsultasi → pilih desain/skema → kerja sama → konstruksi).
5. **Angka kredibilitas** — jumlah desain, proyek, lahan dikerjasamakan (dari pengaturan; disembunyikan bila kosong).
6. **Testimoni** — maks 3, karusel sederhana.
7. **Artikel terbaru** — 3 kartu.
8. **CTA penutup** — "Siap mulai? Bicara dengan tim kami" + tombol WhatsApp.

**CTA utama:** ke `/desain`. **CTA sekunder:** ke `/kerjasama-lahan`.

**Status:** skeleton saat memuat data desain/artikel; bila kosong, sembunyikan seluruh section (bukan menampilkan placeholder).

**SEO:** title "Azetta — Desain Properti, Kerja Sama Lahan, dan Investasi", description 150–160 karakter, `Organization` + `WebSite` JSON-LD.

**Event:** `home_view`, `cta_click` (props: `cta`, `position`).

### 4.2 Katalog `/desain`

**Tujuan:** membantu pengunjung menemukan desain yang sesuai lahan & kebutuhan, lalu membuka detail.

**Struktur:**

```text
┌──────────────────────────────────────────────────────────────┐
│ Breadcrumb: Beranda / Desain                                 │
│ H1: Katalog Desain Rumah                          [57 desain]│
│ [🔍 Cari desain…]                    [Filter ▾]  [Urutkan ▾] │
│ ┌─ Filter (sidebar 260px, mobile: drawer) ─┐ ┌─ Grid 3 kolom ─┐│
│ │ Kategori   ☐ Rumah  ☐ Komersial          │ │ [Kartu] [Kartu] ││
│ │ Gaya       ☐ Minimalis ☐ Tropis …        │ │ [Kartu] [Kartu] ││
│ │ Lantai     ○ 1 ○ 2 ○ 3+                  │ │ [Kartu] [Kartu] ││
│ │ Kamar tidur○ 1 ○ 2 ○ 3 ○ 4+              │ │                 ││
│ │ Luas lahan min ___ m²                    │ │                 ││
│ │ Harga maks ___ juta                      │ │                 ││
│ │ [Reset filter]                           │ │                 ││
│ └──────────────────────────────────────────┘ └─────────────────┘│
│                          [ ‹ 1 2 3 4 5 › ]                    │
└──────────────────────────────────────────────────────────────┘
```

**Kartu desain:** cover 4:3 (lazy, `srcset`), badge kategori, judul, `3 KT · 2 KM · 2 Lantai · 96 m²`, "Mulai Rp4,5 jt" atau "Hubungi kami", tombol "Lihat detail" (seluruh kartu dapat diklik).

**Perilaku filter:**

- Semua filter tercermin di URL (`?category=RESIDENTIAL&floors=2`) sehingga bisa dibagikan & diindeks.
- Perubahan filter memakai navigasi SvelteKit (bukan reload penuh), dengan indikator loading pada grid.
- Tombol "Filter" di mobile membuka drawer; jumlah filter aktif tampil di badge.
- Filter kosong ("0 hasil") menampilkan saran: hapus filter, lihat semua desain, atau hubungi tim.

**SEO:** `ItemList` JSON-LD untuk 12 item pertama; canonical menyertakan query yang diizinkan; `noindex` untuk kombinasi filter > 2 parameter (hindari duplikat) — lihat [10 §5](./10-seo-konten.md#5-aturan-teknis-seo).

**Event:** `catalog_view`, `catalog_filter_apply` (`filter`, `value`), `design_card_click` (`designId`, `position`).

### 4.3 Detail desain `/desain/[slug]`

**Tujuan:** meyakinkan bahwa desain ini layak dibeli, lalu menangkap lead.

**Struktur (desktop 2 kolom):**

```text
┌───────────────────────────────────────────┬─────────────────────┐
│ Breadcrumb                                │  ┌───────────────┐  │
│ H1 Rumah Minimalis 2 Lantai 6×12          │  │ Mulai dari    │  │
│ Minimalis · 2 Lantai · 3 KT · 2 KM        │  │ Rp4.500.000    │  │
│ ┌───────────────────────────────────────┐ │  │ [Tanya Desain]│  │
│ │            GALERI (1 besar + 4 thumb) │ │  │ [WhatsApp]    │  │
│ └───────────────────────────────────────┘ │  ├───────────────┤  │
│ Spesifikasi (grid 2 kolom)                │  │ Luas bangunan │  │
│  Luas bangunan 96 m²   Luas lahan 72 m²   │  │ 96 m²         │  │
│  Kamar tidur 3         Kamar mandi 2      │  │ Lantai 2      │  │
│  Carport 1             Gaya Minimalis     │  └───────────────┘  │
│ Deskripsi (Markdown)                      │                     │
│ Denah (tab: Lantai 1 / Lantai 2)          │                     │
│ Estimasi biaya bangun (± disclaimer)      │                     │
│ ─────────────────────────────────────────  │                     │
│ FORM "Tanya desain ini" (inline)          │                     │
│ Nama · WhatsApp · Email · Pesan · ☐ setuju│                     │
│ [Kirim pertanyaan]                        │                     │
│ ─────────────────────────────────────────  │                     │
│ Desain terkait (4 kartu)                  │                     │
└───────────────────────────────────────────┴─────────────────────┘
```

**Aturan tampilan:**

- Field kosong disembunyikan (mis. tanpa `carports` → baris tidak ditampilkan).
- `priceFrom` kosong → "Hubungi kami untuk harga".
- Estimasi biaya selalu disertai: "Estimasi kasar, bukan penawaran resmi. Biaya aktual bergantung lokasi dan spesifikasi."
- Galeri: klik membuka lightbox; panah keyboard berfungsi; `alt` deskriptif.
- Sticky sidebar di desktop; di mobile, bar aksi menempel di bawah (`sticky bottom-0`) berisi harga + tombol "Tanya Desain".

**CTA:** submit form (utama), WhatsApp (sekunder — membuka `wa.me` dengan pesan berisi judul desain).

**Status:** 404 kustom bila tidak ditemukan; skeleton galeri saat hidrasi.

**SEO:** `Product` **tidak** dipakai (tidak ada transaksi); gunakan `CreativeWork` + `BreadcrumbList`. Title: "{Judul} — Desain {Kategori} {Gaya} | Azetta". OG image = cover.

**Event:** `design_view` (`designId`), `design_lead_click`, `lead_form_start`, `lead_submit_success`, `whatsapp_click` (`placement`).

### 4.4 Kerja sama lahan `/kerjasama-lahan`

**Tujuan:** meyakinkan pemilik lahan bahwa skema aman dan menguntungkan, lalu mengumpulkan data lahan.

**Struktur:**

1. **Hero** — "Punya lahan? Kami yang bangun, Anda dapat hasilnya." Subheadline + CTA "Ajukan Lahan Saya".
2. **Masalah yang dipahami** — 3 poin (tidak punya modal, tidak mau repot, takut lahan terbengkalai).
3. **Skema kerja sama** — 3 kartu: Bagi Hasil, Sewa Lahan, Beli Lahan. Masing-masing: cara kerja, cocok untuk, catatan.
4. **Alur 5 langkah** — Ajukan → Verifikasi & survei → Proposal skema → Perjanjian → Pembangunan & bagi hasil.
5. **Dokumen yang disiapkan** — sertifikat, KTP, dll. (transparansi mengurangi keraguan).
6. **FAQ** — 6 pertanyaan (dari CMS, kategori `lahan`).
7. **Form pengajuan** (3 langkah, inline atau halaman `/kerjasama-lahan/ajukan` — dipilih inline agar tidak kehilangan konteks).
8. **Testimoni pemilik lahan** (bila ada).

**CTA:** mulai form. **Event:** `offer_view` (`type: land`), `land_form_start`, `land_form_step` (`step`), `lead_submit_success`.

### 4.5 Investasi `/investasi`

**Tujuan:** memberi gambaran proyek & skema, menyaring investor berdasarkan kapasitas, lalu menjadwalkan diskusi.

**Struktur:**

1. **Hero** — "Ikut membangun proyek properti bersama Azetta." CTA "Minta Proposal".
2. **Ringkasan peluang** — 3–4 poin: jenis proyek, lokasi, horizon, skema imbal hasil (tanpa janji angka pasti).
3. **Skema kemitraan** — tabel/kartu: Profit Sharing, Equity, Fixed Return (dengan catatan "bukan jaminan").
4. **Tata kelola & transparansi** — laporan progres, rekening proyek, audit.
5. **Risiko** — bagian eksplisit (wajib, membangun kepercayaan): risiko pasar, perizinan, konstruksi, likuiditas.
6. **FAQ investor** — 6 pertanyaan.
7. **Form minat investasi**.

**Aturan konten:** tidak boleh memuat klaim imbal hasil terjamin; setiap angka disertai periode & asumsi. Ini bukan hanya etika, tetapi juga mengurangi risiko hukum.

**Event:** `offer_view` (`type: invest`), `invest_form_start`, `lead_submit_success`.

### 4.6 Artikel `/artikel` & `/artikel/[slug]`

- Daftar: kartu (cover, judul, ringkasan, tanggal, estimasi baca), pagination 9/halaman, filter tag sederhana.
- Detail: judul, meta (tanggal, waktu baca), cover, isi Markdown (heading, list, gambar, tabel, blockquote), CTA di tengah/akhir ("Lihat katalog desain" / "Tanya tim"), artikel terkait 3.
- `Article` + `BreadcrumbList` JSON-LD.
- Event: `article_view`, `article_cta_click`.

### 4.7 Tentang `/tentang`

Struktur: cerita singkat, visi, tim (foto + peran, opsional), nilai, proyek yang sudah dikerjakan, CTA kontak. Bertujuan membangun kepercayaan untuk dua aliran bernilai besar (lahan & investasi).

### 4.8 Kontak `/kontak`

- Info kontak (WhatsApp, telepon, email, alamat, jam operasional, peta opsional).
- Form kontak umum (`type = GENERAL`): nama, WhatsApp, email, kota, pesan, consent.
- Tautan cepat ke tiga alur.

### 4.9 Terima kasih `/terima-kasih/[type]`

Halaman `noindex`, tidak dapat diakses langsung tanpa referensi valid? (MVP: dapat diakses langsung, isi generik).

Isi:

1. Ikon centang + "Terima kasih, {nama}!" (nama dari `sessionStorage`; jika tidak ada, "Terima kasih!").
2. Nomor referensi (monospace, bisa disalin).
3. "Apa yang terjadi selanjutnya" — 3 langkah sesuai tipe, dengan estimasi waktu.
4. Tombol WhatsApp "Chat sekarang" (opsional, agar yang tidak sabar bisa langsung).
5. Tautan kembali ke katalog/beranda.

### 4.10 FAQ `/faq`

Akordeon per kategori (Umum, Desain, Lahan, Investasi) + form kontak di bawah. `FAQPage` JSON-LD.

### 4.11 Halaman legal

- `/kebijakan-privasi`: data yang dikumpulkan, tujuan, dasar pemrosesan (consent), retensi, hak subjek data, kontak.
- `/syarat-ketentuan`: penggunaan situs, hak kekayaan intelektual gambar desain, batasan tanggung jawab, hukum yang berlaku.
- Keduanya wajib direview pihak legal sebelum rilis.

### 4.12 Halaman 404

Pesan ramah + pencarian desain + tautan ke tiga alur utama. Status HTTP 404 sungguhan.

## 5. Spesifikasi formulir

### 5.1 Aturan umum

| Aturan | Detail |
|--------|--------|
| Label | Selalu terlihat di atas field (bukan placeholder-only) |
| Wajib | Ditandai `*` dan `aria-required="true"` |
| Validasi | Saat blur + saat submit; pesan di bawah field, `aria-describedby` |
| Error | Fokus otomatis ke field pertama yang salah; ringkasan error di atas form untuk pembaca layar |
| Tombol submit | Menampilkan spinner + teks "Mengirim…" dan dinonaktifkan saat proses |
| Sukses | Redirect ke `/terima-kasih/[type]` (bukan hanya toast) |
| Gagal jaringan | Pesan + tombol "Coba lagi"; isian tidak hilang |
| Autofill | `autocomplete="name"`, `tel`, `email`, `address-level1/2`, `street-address` |
| Anti-spam | Honeypot tersembunyi (`tabindex="-1"`, `aria-hidden`), Turnstile invisible, waktu render |
| Privasi | Tautan ke kebijakan privasi di samping checkbox consent |

### 5.2 Form "Tanya desain ini" (`BUY_DESIGN`)

| Field | Tipe | Wajib | Validasi | Pesan error |
|-------|------|:-----:|----------|-------------|
| `name` | text | ✅ | 2–80 char | "Nama minimal 2 karakter" |
| `phone` | tel | ✅ | regex Indonesia, 9–15 digit | "Masukkan nomor WhatsApp yang valid, mis. 081234567890" |
| `email` | email | — | format email, ≤160 | "Format email tidak valid" |
| `city` | text | — | ≤80 | — |
| `message` | textarea | — | ≤1000 | "Pesan maksimal 1000 karakter" |
| `consent` | checkbox | ✅ | harus `true` | "Anda perlu menyetujui pemrosesan data" |

Helper text di bawah tombol: "Kami akan menghubungi Anda via WhatsApp pada jam kerja."

### 5.3 Form pengajuan lahan (`LAND_OFFER`) — 3 langkah

**Langkah 1 — Tentang Anda**

| Field | Tipe | Wajib | Validasi |
|-------|------|:-----:|----------|
| `name` | text | ✅ | 2–80 |
| `phone` | tel | ✅ | regex Indonesia |
| `email` | email | — | format email |
| `city` | text | ✅ | ≤80 (domisili) |

**Langkah 2 — Tentang lahan**

| Field | Tipe | Wajib | Validasi / pilihan |
|-------|------|:-----:|--------------------|
| `address` | textarea | ✅ | 10–300 |
| `province` | select | ✅ | 38 provinsi |
| `city` | select | ✅ | kabupaten/kota sesuai provinsi |
| `district` | text | — | ≤80 |
| `areaM2` | number | ✅ | 50–1.000.000 |
| `frontageM` | number | — | 1–500 |
| `ownershipStatus` | select | ✅ | SHM / SHGB / AJB / Girik / Letter C / Lainnya |
| `certificateOnBehalf` | text | — | ≤120 |
| `zoning` | text | — | ≤120, mis. "Perumahan" |
| `currentUse` | text | — | ≤120, mis. "Lahan kosong" |
| `roadAccess` | text | — | ≤120 |
| `estimatedValue` | number (rupiah) | — | ≥0 |
| `photos` | file | — | maks 5, ≤5 MB, JPG/PNG/WebP |

Bantuan di atas field foto: "Foto membantu kami menilai potensi lahan. Maksimal 5 foto, masing-masing 5 MB."

**Langkah 3 — Rencana kerja sama**

| Field | Tipe | Wajib | Pilihan |
|-------|------|:-----:|---------|
| `expectedScheme` | radio card | ✅ | Bagi hasil / Sewa / Jual / Belum tahu |
| `startTimeline` | select | — | Segera / 3–6 bulan / 6–12 bulan / >12 bulan / Belum tahu |
| `notes` | textarea | — | ≤1000 |
| `consent` | checkbox | ✅ | — |

**Perilaku stepper:** indikator 1-2-3, tombol "Kembali"/"Lanjut", validasi per langkah, draft di `sessionStorage` (dihapus setelah sukses), peringatan bila halaman ditinggalkan dengan isian.

### 5.4 Form minat investasi (`INVEST`)

| Field | Tipe | Wajib | Pilihan / validasi |
|-------|------|:-----:|--------------------|
| `name` | text | ✅ | 2–80 |
| `phone` | tel | ✅ | regex Indonesia |
| `email` | email | ✅ | format email |
| `city` | text | — | ≤80 |
| `budgetRange` | radio card | ✅ | <500 jt / 500 jt–1 M / 1–5 M / 5–20 M / >20 M |
| `preferredLocations` | multi-select | ✅ | maks 5 kota |
| `horizonMonths` | select | ✅ | 6–12, 13–24, 25–36, >36 bulan |
| `riskProfile` | radio | ✅ | Konservatif / Moderat / Agresif / Belum tahu |
| `instrument` | select | — | Bagi hasil / Ekuitas / Imbal tetap / Terbuka |
| `notes` | textarea | — | ≤1000 |
| `consent` | checkbox | ✅ | — |

### 5.5 Form kontak umum (`GENERAL`)

`name`, `phone`, `email`, `city`, `message` (wajib, ≤1000), `consent`.

## 6. Wireframe kunci

### 6.1 Beranda (mobile)

```text
┌──────────────────────────────┐
│ ☰  AZETTA          [Hubungi] │
├──────────────────────────────┤
│                              │
│  Desain siap bangun,         │
│  lahan diolah bersama,       │
│  modal tumbuh bersama.       │
│                              │
│  [ Lihat Katalog Desain  ]   │
│  [ Tawarkan Lahan Anda   ]   │
│                              │
│  ┌────────────────────────┐  │
│  │      render rumah      │  │
│  └────────────────────────┘  │
├──────────────────────────────┤
│  Pilih jalur Anda            │
│  ┌────────┐ ┌────────┐       │
│  │ Desain │ │ Lahan  │       │
│  └────────┘ └────────┘       │
│  ┌────────┐                  │
│  │Investasi│                 │
│  └────────┘                  │
├──────────────────────────────┤
│  Desain unggulan   Lihat →   │
│  ┌────────┐ ┌────────┐       │
│  │ kartu  │ │ kartu  │       │
│  └────────┘ └────────┘       │
├──────────────────────────────┤
│  Cara kerja (1→2→3→4)        │
├──────────────────────────────┤
│  Testimoni                   │
├──────────────────────────────┤
│  Artikel terbaru             │
├──────────────────────────────┤
│  Siap mulai? [WhatsApp]      │
├──────────────────────────────┤
│  Footer                       │
└──────────────────────────────┘
```

### 6.2 Detail desain (mobile, dengan sticky CTA)

```text
┌──────────────────────────────┐
│ ‹ Kembali                    │
│ ┌──────────────────────────┐ │
│ │        foto utama        │ │
│ └──────────────────────────┘ │
│ ● ○ ○ ○  (indikator galeri)  │
│ Rumah Minimalis 2 Lantai     │
│ 3 KT · 2 KM · 96 m² · 2 lt   │
│ ┌────────────┬─────────────┐ │
│ │ 3 KT       │ 2 KM        │ │
│ ├────────────┼─────────────┤ │
│ │ 96 m²      │ 72 m² lahan │ │
│ └────────────┴─────────────┘ │
│ Deskripsi …                  │
│ Denah  [Lantai 1][Lantai 2]  │
│ Estimasi biaya Rp450–600 jt  │
│ (disclaimer)                 │
│ ── Tanya desain ini ──       │
│ [Nama]                       │
│ [WhatsApp]                   │
│ [Email (opsional)]           │
│ [Pesan]                      │
│ ☐ Saya setuju data diproses  │
│ [ Kirim pertanyaan ]         │
│ Desain terkait               │
├──────────────────────────────┤
│ Rp4,5 jt   [Tanya Desain]    │ ← sticky
└──────────────────────────────┘
```

### 6.3 Form lahan — langkah 2 (mobile)

```text
┌──────────────────────────────┐
│ Ajukan Lahan                 │
│ ①─────②─────③                │
│ Tentang lahan                │
│                              │
│ Alamat lengkap *             │
│ ┌──────────────────────────┐ │
│ │                          │ │
│ └──────────────────────────┘ │
│ Provinsi *                   │
│ [ Pilih provinsi       ▾ ]   │
│ Kabupaten/Kota *             │
│ [ Pilih kota           ▾ ]   │
│ Kecamatan                    │
│ [                        ]   │
│ Luas lahan (m²) *            │
│ [ 800                    ]   │
│ Lebar depan (m)              │
│ [ 20                     ]   │
│ Status kepemilikan *         │
│ [ SHM                  ▾ ]   │
│ Foto lahan (maks 5)          │
│ ┌──────────────────────────┐ │
│ │  + Tarik foto / pilih    │ │
│ └──────────────────────────┘ │
│ [thumb] [thumb]              │
│                              │
│ [ Kembali ]   [ Lanjut → ]   │
└──────────────────────────────┘
```

### 6.4 Admin — daftar lead

```text
┌──────────┬──────────────────────────────────────────────────────┐
│ AZETTA   │ Lead                       [ + Lead manual ]  [CSV]  │
│          ├──────────────────────────────────────────────────────┤
│ Dashboard│ [Semua 42][Baru 11][Belum dihubungi 3][Milik saya 8] │
│ Lead  11 │ ┌──────────────────────────────────────────────────┐ │
│ Desain   │ │ 🔍 Cari nama / nomor / referensi…  ▾ Filter       │ │
│ Artikel  │ ├────┬─────────┬────────┬────────┬─────────┬───────┤ │
│ FAQ      │ │Tipe│ Nama    │ Kota   │ Status │ Sumber  │ Waktu │ │
│ Testimoni│ ├────┼─────────┼────────┼────────┼─────────┼───────┤ │
│ Pengguna │ │ LD │ Sari W. │ Sleman │ ● Baru │ Organik │ 2 j   │ │
│ Setting  │ │ DS │ Budi S. │ Bandung│ ● Baru │ Iklan   │ 3 j   │ │
│ Audit    │ │ IV │ Hendra  │ Jaksel │ ◐ Dihub │ Langsung│ 5 j   │ │
│          │ └────┴─────────┴────────┴────────┴─────────┴───────┘ │
│          │                              [ ‹ 1 2 3 › ]          │
└──────────┴──────────────────────────────────────────────────────┘
```

### 6.5 Admin — detail lead

```text
┌──────────┬──────────────────────────────────────────────────────┐
│ Sidebar  │ ‹ Lead  AZT-LD-2610-K7Q2M      [WhatsApp] [Ubah status]│
│          ├─────────────────────────┬────────────────────────────┤
│          │ Sari Wulandari          │ Status: [ QUALIFIED  ▾ ]   │
│          │ 0812****5432            │ Prioritas: [ Normal ▾ ]    │
│          │ sari@example.com        │ Assignee: [ Rina ▾ ]       │
│          │ Sleman, DIY             │ Estimasi nilai: 1.200.000.000│
│          │ Masuk: 23 Okt 2026 11:15│ Follow-up: [ 25 Okt ]      │
│          ├─────────────────────────┤                            │
│          │ Data lahan              │                            │
│          │ Alamat: Jl. Kaliurang…  │                            │
│          │ Luas: 800 m²            │                            │
│          │ SHM, bagi hasil         │                            │
│          │ [Foto 1][Foto 2][Foto 3]│                            │
│          ├─────────────────────────┤                            │
│          │ Aktivitas               │                            │
│          │ ● 11:20 Telepon — …     │                            │
│          │ ● 11:15 Lead dibuat     │                            │
│          │ [Tulis aktivitas…]      │                            │
│          └─────────────────────────┴────────────────────────────┘
```

## 7. Inventaris komponen UI

Semua di `packages/ui`, dibangun di atas daisyUI + Tailwind, dengan variabel tema di `packages/config/tailwind.preset.ts`.

| Komponen | daisyUI dasar | Dipakai di |
|----------|---------------|------------|
| `Button` | `btn` (+ `btn-primary`, `btn-ghost`) | Semua |
| `Input`, `Textarea`, `Select` | `input`, `textarea`, `select` | Form |
| `Checkbox`, `Radio` | `checkbox`, `radio` | Form |
| `RadioCard` | `radio` + `card` | Skema/rentang modal |
| `FileDropzone` | kustom + `file-input` | Foto lahan |
| `Badge` | `badge` | Status, kategori |
| `DesignCard` | `card` | Katalog, beranda |
| `Stat` | `stat` | Dashboard |
| `Table` | `table` | Admin |
| `Pagination` | `join` | Katalog, admin |
| `Modal`, `Drawer` | `modal`, `drawer` | Filter mobile, lightbox |
| `Toast` | `toast` | Feedback admin |
| `Steps` | `steps` | Form lahan |
| `Timeline` | `timeline` | Aktivitas lead |
| `Skeleton` | `skeleton` | Loading |
| `EmptyState` | kustom | Katalog kosong, daftar kosong |
| `Breadcrumbs` | `breadcrumbs` | Publik & admin |
| `MarkdownEditor` | textarea + preview | CMS |
| `ConfirmDialog` | `modal` | Hapus/arsipkan |

**Tema:** warna utama mengikuti identitas Azetta (didefinisikan sekali di `tailwind.preset.ts`), radius 12 px, font sans (system stack + satu webfont opsional), dark mode **tidak** diaktifkan di MVP.

**Ikon (Iconify):** pakai set `lucide` untuk UI dan `mdi`/`ph` bila perlu. Ikon dekoratif `aria-hidden="true"`.

## 8. Status & edge case

| Situasi | Perilaku |
|---------|----------|
| Data kosong (katalog) | Empty state + saran hapus filter |
| Gambar gagal dimuat | Placeholder abu-abu dengan ikon + `alt` tetap ada |
| Koneksi lambat | Skeleton untuk katalog; tombol submit menampilkan spinner |
| Sesi admin kedaluwarsa | Redirect ke `/login?next=…` setelah menyimpan tujuan |
| Submit ganda | Tombol nonaktif + `Idempotency-Key` |
| Nama dengan karakter non-latin | Diterima; panjang dihitung per karakter |
| Nomor telepon dengan spasi/tanda hubung | Dinormalisasi sebelum validasi |
| Pengguna menekan back saat form lahan langkah 2 | Draft dipulihkan dari `sessionStorage` |
| JavaScript mati | Form tetap dapat dikirim (progressive enhancement) |

## 9. Analitik event

| Event | Kapan | Properti |
|-------|-------|----------|
| `home_view` | Beranda dimuat | `referrer` |
| `catalog_view` | Katalog dimuat | `filterCount`, `resultCount` |
| `catalog_filter_apply` | Filter berubah | `filter`, `value` |
| `design_card_click` | Kartu diklik | `designId`, `position` |
| `design_view` | Detail desain dimuat | `designId`, `source` |
| `offer_view` | Halaman lahan/investasi dimuat | `type` |
| `lead_form_start` | Field pertama difokuskan | `type`, `designId` |
| `lead_form_step` | Langkah form lahan selesai | `step` |
| `lead_submit_attempt` | Tombol submit ditekan | `type` |
| `lead_submit_success` | Respons sukses | `type`, `reference` |
| `lead_submit_error` | Respons gagal | `type`, `code` |
| `whatsapp_click` | Tombol WA diklik | `placement`, `designId` |
| `article_view` | Artikel dibuka | `slug` |
| `article_cta_click` | CTA dalam artikel | `slug`, `target` |

`sessionId` acak disimpan di `sessionStorage`; tidak ada data pribadi di event.

## 10. Aksesibilitas & responsif

| Aspek | Ketentuan |
|-------|-----------|
| Breakpoint | 360, 768, 1024, 1280, 1536 px |
| Target sentuh | ≥ 44×44 px |
| Kontras | ≥ 4,5:1 teks normal, ≥ 3:1 teks besar & ikon |
| Fokus | `focus-visible` ring 2 px, tidak dihapus |
| Skip link | "Lewati ke konten" di awal halaman |
| Heading | Satu `h1` per halaman, hierarki tanpa lompatan |
| Form | Label terhubung, error `aria-live="polite"`, `aria-invalid` |
| Modal | Fokus terperangkap, `Esc` menutup, fokus kembali ke pemicu |
| Gambar | `alt` deskriptif; dekoratif `alt=""` |
| Animasi | Menghormati `prefers-reduced-motion` |
| Bahasa | `<html lang="id">` |

## 11. Nada bahasa (copy)

- Bahasa Indonesia formal-santai, sapaan "Anda".
- Hindari jargon teknis properti yang tidak dijelaskan (mis. "KDB", "GSB") — jelaskan dalam kurung.
- Angka konkret lebih baik daripada superlatif ("96 m²" bukan "sangat luas").
- Tidak ada klaim berlebihan ("pasti untung", "termurah") — terutama di halaman investasi.
- CTA berupa kata kerja: "Lihat katalog", "Ajukan lahan", "Minta proposal".
