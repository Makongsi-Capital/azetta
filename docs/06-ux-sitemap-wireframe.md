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
7. **Tenang dan tegas.** Monokrom, tanpa warna aksen, tanpa bayangan atau gradasi; keyakinan datang dari kejelasan, bukan dari efek visual (Brand Guidelines §01 & §03).

## 2. Sitemap

### 2.1 Publik (`azetta.id`)

```text
/
├─ /rumah                           katalog unit rumah + filter
│  └─ /rumah/[slug]                 detail unit rumah
├─ /proyek                          daftar proyek perumahan
│  └─ /proyek/[slug]                detail proyek + unit yang tersedia
├─ /kerja-sama-lahan                penawaran lahan (dijual / dikerjasamakan)
├─ /investasi                       informasi untuk investor (tanpa form)
├─ /artikel                         daftar artikel
│  └─ /artikel/[slug]               detail artikel
├─ /masuk                           login akun                (noindex)
├─ /daftar                          registrasi akun           (noindex)
├─ /lupa-sandi                      minta tautan reset        (noindex)
├─ /reset-sandi                     form kata sandi baru      (noindex)
├─ /verifikasi-email                konfirmasi verifikasi     (noindex)
├─ /akun                            ringkasan & daftar pengajuan  (noindex, wajib login)
│  ├─ /akun/pengajuan/[id]          detail status pengajuan
│  └─ /akun/profil                  ubah profil & kata sandi
├─ /tentang
├─ /kontak
├─ /faq
├─ /terima-kasih/[type]             type: unit | lahan | umum  (noindex)
├─ /kebijakan-privasi
├─ /syarat-ketentuan
├─ /sitemap.xml
├─ /robots.txt
└─ /404
```

> `/theme` adalah halaman pratinjau komponen internal (`noindex`) dan tidak ditautkan dari navigasi publik.

### 2.2 Admin (`admin.azetta.id`)

```text
/login
/dashboard
/leads
/leads/[id]
/unit
/unit/baru
/unit/[id]
/proyek
/proyek/baru
/proyek/[id]
/artikel
/artikel/[id]
/konten/faq
/konten/testimoni
/pengguna
/pelanggan
/permohonan-hapus
/pengaturan
/audit
```

> `/pengguna` dan `/pelanggan` hanya tampil untuk `super_admin`; `/pelanggan` bersifat baca saja. `/permohonan-hapus` tampil untuk `admin` dan `super_admin`. Menu lain tampil untuk `admin` dan `super_admin`.

## 3. Navigasi global

### 3.1 Header publik

```text
┌───────────────────────────────────────────────────────────────────────────┐
│ [Logo Azetta]  Rumah  Proyek  Kerja Sama Lahan  Investasi  Artikel         │
│                                     [Masuk]  [Hubungi Kami ▸]             │
└───────────────────────────────────────────────────────────────────────────┘
```

- Tinggi 64 px (mobile 56 px), sticky dengan latar semi-transparan setelah scroll.
- Mobile: logo + tombol menu (drawer dari kanan). Drawer memuat tautan + CTA WhatsApp.
- Item aktif ditandai garis bawah dan `aria-current="page"`.
- CTA "Hubungi Kami" mengarah ke `/kontak`; di halaman detail unit diganti "Tanya Unit Ini" (scroll ke form).
- Bila sesi aktif, "Masuk" berganti avatar dengan menu: **Akun saya**, **Pengajuan saya**, **Keluar**. Nama pengguna tidak ditampilkan di header publik (privasi di ruang bersama).
- Halaman `/akun` tidak menampilkan header pemasaran penuh; header disederhanakan (logo + tombol keluar).

### 3.2 Footer

Empat kolom (mobile: akordeon):

| Kolom | Isi |
|-------|-----|
| Merek | Logo, kalimat singkat, alamat, jam operasional |
| Layanan | Rumah, Kerja Sama Lahan, Investasi, Proyek |
| Informasi | Tentang, Artikel, FAQ, Kontak |
| Legal | Kebijakan Privasi, Syarat & Ketentuan + nomor WhatsApp/email |

Baris bawah: `© 2026 Azetta. Seluruh hak cipta dilindungi.`

### 3.3 Navigasi admin

Sidebar kiri 240 px (collapse jadi 64 px), berisi Dashboard, Lead (dengan badge jumlah `NEW`), Unit, Proyek, Artikel, FAQ, Testimoni, Pengguna*, Pelanggan*, Permohonan Hapus, Pengaturan, Audit. Header atas: pencarian global (lead), nama pengguna, menu keluar.

## 4. Spesifikasi halaman publik

Format tiap halaman: **tujuan → struktur → CTA → status → SEO → event**.

### 4.1 Beranda `/`

**Tujuan:** menyatakan siapa Azetta dan mengarahkan pengunjung ke jalur yang tepat dalam < 10 detik.

**Struktur:**

1. **Hero** — headline nilai (mis. "Rumah yang siap dihuni, dibangun oleh Azetta"), subheadline 1 kalimat, dua CTA: "Lihat Katalog Rumah" (utama) + "Tawarkan Lahan Anda" (sekunder), gambar render unit unggulan.
2. **Tiga kartu jalur** — Rumah / Kerja Sama Lahan / Informasi Investasi, masing-masing dengan ikon Iconify, 1 kalimat, tautan.
3. **Unit unggulan** — 6 kartu unit (`featured`, `PUBLISHED`), tautan "Lihat semua unit".
4. **Proyek yang sedang & sudah berjalan** — 3 kartu proyek `ONGOING`/`COMPLETED`, tautan "Lihat semua proyek" (Q4).
5. **Cara kerja** — 3–4 langkah bernomor (pilih unit → konsultasi & survei → KPR/kesepakatan → serah terima).
6. **Testimoni** — maks 3, karusel sederhana.
7. **Artikel terbaru** — 3 kartu.
8. **CTA penutup** — "Siap memiliki rumah? Bicara dengan tim kami" + tombol WhatsApp.

**CTA utama:** ke `/rumah`. **CTA sekunder:** ke `/kerja-sama-lahan`.

**Status:** skeleton saat memuat data unit/artikel; bila kosong, sembunyikan seluruh section (bukan menampilkan placeholder).

**SEO:** title "Azetta — Rumah Tapak, Kerja Sama Lahan, dan Proyek Properti", description 150–160 karakter, `Organization` + `WebSite` JSON-LD.

**Event:** `home_view`, `cta_click` (props: `cta`, `position`).

### 4.2 Katalog `/rumah`

**Tujuan:** membantu pengunjung menemukan unit yang sesuai lokasi, anggaran, dan kebutuhan, lalu membuka detail.

**Struktur:**

```text
┌──────────────────────────────────────────────────────────────┐
│ Breadcrumb: Beranda / Rumah                                  │
│ H1: Rumah Dijual                                  [12 unit]  │
│ [🔍 Cari unit, proyek, atau kota…]    [Filter ▾]  [Urutkan ▾]│
│ ┌─ Filter (sidebar 260px, mobile: drawer) ─┐ ┌─ Grid 3 kolom ─┐│
│ │ Proyek    ☐ Azetta Residence ☐ …         │ │ [Kartu] [Kartu] ││
│ │ Kota      ☐ Bandung ☐ Sleman …           │ │ [Kartu] [Kartu] ││
│ │ Tipe      ☐ 36 ☐ 45 ☐ 60 ☐ 90            │ │ [Kartu] [Kartu] ││
│ │ Kamar     ○ 2 ○ 3 ○ 4+                   │ │                 ││
│ │ Luas tanah min ___ m²                    │ │                 ││
│ │ Luas bangunan min ___ m²                 │ │                 ││
│ │ Harga maks ___ juta                      │ │                 ││
│ │ Ketersediaan ☐ Tersedia ☐ Indent ☐ Terjual│ │                ││
│ │ [Reset filter]                           │ │                 ││
│ └──────────────────────────────────────────┘ └─────────────────┘│
│                          [ ‹ 1 2 3 4 5 › ]                    │
└──────────────────────────────────────────────────────────────┘
```

**Kartu unit:** cover 4:3 (lazy, `srcset`), badge status (`Tersedia`/`Indent`/`Terjual`), judul + kode unit, nama proyek & kota, `3 KT · 2 KM · 2 Lantai · LB 90 m² / LT 96 m²`, "Mulai Rp 850 juta" atau "Hubungi kami", tombol "Lihat detail" (seluruh kartu dapat diklik).

**Perilaku filter:**

- Semua filter tercermin di URL (`?city=Bandung&type=Tipe+45`) sehingga bisa dibagikan & diindeks.
- Perubahan filter memakai navigasi SvelteKit (bukan reload penuh), dengan indikator loading pada grid.
- Tombol "Filter" di mobile membuka drawer; jumlah filter aktif tampil di badge.
- Filter kosong ("0 hasil") menampilkan saran: hapus filter, lihat semua unit, atau hubungi tim.
- Default menyembunyikan `SOLD`; pengunjung dapat menampilkannya lewat filter (transparansi stok).

**SEO:** `ItemList` JSON-LD untuk 12 item pertama; canonical menyertakan query yang diizinkan; `noindex` untuk kombinasi filter > 2 parameter (hindari duplikat) — lihat [10 §5](./10-seo-konten.md#5-aturan-teknis-seo).

**Event:** `catalog_view`, `catalog_filter_apply` (`filter`, `value`), `unit_card_click` (`unitId`, `position`).

### 4.3 Detail unit rumah `/rumah/[slug]`

**Tujuan:** meyakinkan bahwa unit ini layak dibeli dan masih tersedia, lalu menangkap lead.

**Struktur (desktop 2 kolom):**

```text
┌───────────────────────────────────────────┬─────────────────────┐
│ Breadcrumb                                │  ┌───────────────┐  │
│ H1 Azetta Residence Tipe 45 · Unit A1     │  │ Mulai dari    │  │
│ [Tersedia] Bandung · 2 Lantai · 3 KT · 2 KM│ │ Rp 850 juta   │  │
│ ┌───────────────────────────────────────┐ │  │ [Tanya Unit]  │  │
│ │            GALERI RENDER (1+4)        │ │  │ [WhatsApp]    │  │
│ └───────────────────────────────────────┘ │  ├───────────────┤  │
│ Spesifikasi (grid 2 kolom)                │  │ Luas tanah    │  │
│  LT 96 m²   LB 90 m²   Kamar 3            │  │ 96 m²         │  │
│  KM 2       Carport 1   Lantai 2          │  │ Tipe 45       │  │
│ Deskripsi (editor)                        │  └───────────────┘  │
│ Denah (tab: Lantai 1 / Lantai 2)          │                     │
│ Proyek: Azetta Residence →                │                     │
│ ─────────────────────────────────────────  │                     │
│ FORM "Tanya unit ini" (inline)            │                     │
│ Nama · WhatsApp · Email · Pesan · ☐ setuju│                     │
│ [Kirim pertanyaan]                        │                     │
│ ─────────────────────────────────────────  │                     │
│ Unit terkait (4 kartu)                    │                     │
└───────────────────────────────────────────┴─────────────────────┘
```

**Aturan tampilan:**

- Field kosong disembunyikan.
- `priceFrom` kosong → "Hubungi kami untuk harga".
- **Harga final dan skema pembayaran tidak ditampilkan**; dibahas sales.
- Badge status + teks "Status diperbarui {tanggal}" agar pengunjung tahu kesegaran data.
- Unit `SOLD`: halaman tetap tampil, badge "Terjual", form diganti CTA "Lihat unit sejenis" dan "Tanya ketersediaan unit lain".
- Galeri: render & denah dipisah tab; klik membuka lightbox; panah keyboard berfungsi; `alt` deskriptif.
- Sticky sidebar di desktop; di mobile, bar aksi menempel di bawah (`sticky bottom-0`) berisi harga + tombol "Tanya Unit".
- Bila pengunjung sudah login, form menampilkan "Mengirim sebagai {email}" dan lead otomatis tertaut ke akun.

**CTA:** submit form (utama), WhatsApp (sekunder — membuka `wa.me` dengan pesan berisi judul unit).

**Status:** 404 kustom bila tidak ditemukan; skeleton galeri saat hidrasi.

**SEO:** `Residence` + `BreadcrumbList`; title "{Judul Unit} — Rumah {Tipe} di {Kota} | Azetta". OG image = cover render.

**Event:** `unit_view` (`unitId`, `salesStatus`), `unit_lead_click`, `lead_form_start`, `lead_submit_success`, `whatsapp_click` (`placement`).

### 4.4 Kerja sama lahan `/kerja-sama-lahan`

**Tujuan:** meyakinkan pemilik lahan bahwa tawarannya aman dan menguntungkan — baik dijual maupun dikerjasamakan — lalu mengumpulkan data lahan.

**Struktur:**

1. **Hero** — "Punya lahan? Jual, atau bangun bersama Azetta." Subheadline + CTA "Tawarkan Lahan Saya".
2. **Dua opsi** — kartu **Dijual ke Azetta** (harga dibahas setelah survei & appraisal) dan **Dikerjasamakan** (Azetta membangun, hasil penjualan unit dibagi sesuai perjanjian). Masing-masing: cara kerja, cocok untuk, catatan.
3. **Masalah yang dipahami** — 3 poin (tidak punya modal, tidak mau repot, takut lahan terbengkalai).
4. **Alur 5 langkah** — Ajukan → Verifikasi & survei → Penawaran harga / proposal skema → Perjanjian → Pembangunan & bagi hasil.
5. **Dokumen yang disiapkan** — sertifikat, KTP, dll. (transparansi mengurangi keraguan).
6. **FAQ** — 6 pertanyaan (dari CMS, kategori `lahan`).
7. **Form pengajuan** (3 langkah, inline). Langkah 3 memuat pilihan **maksud penawaran**: dijual / dikerjasamakan / belum tahu.
8. **Testimoni pemilik lahan** (bila ada).

**CTA:** mulai form. **Event:** `offer_view` (`type: land`), `land_form_start`, `land_form_step` (`step`), `lead_submit_success`.

**Catatan:** tidak ada form terpisah untuk "jual lahan" dan "kerja sama" di MVP — satu form dengan pilihan maksud, agar pemilik lahan tidak harus memutuskan sebelum tahu skemanya.

### 4.5 Investasi `/investasi`

**Tujuan:** memberi informasi yang cukup bagi calon investor untuk menilai Azetta, lalu menghubungi manajemen. **Halaman ini bukan kanal pendaftaran.**

**Struktur:**

1. **Hero** — "Mengenal proyek dan tata kelola Azetta." CTA "Hubungi Manajemen" (WhatsApp/email).
2. **Profil perusahaan** — pengalaman, struktur, rekam jejak.
3. **Proyek berjalan** — ringkasan proyek yang boleh dipublikasikan (tautan ke `/proyek`).
4. **Skema kemitraan** — penjelasan umum (bagi hasil/ekuitas) dengan catatan "bukan jaminan" dan "detail dibahas langsung".
5. **Tata kelola & transparansi** — laporan progres, rekening proyek, audit.
6. **Risiko** — bagian eksplisit: risiko pasar, perizinan, konstruksi, likuiditas.
7. **FAQ investor** — 6 pertanyaan.

**Aturan:**

- **Tanpa formulir**, tanpa field data pribadi, dan tanpa `Lead` yang dibuat.
- Satu-satunya aksi adalah tautan `wa.me` / `mailto:` ke kontak manajemen (dari `SiteSetting.contact`).
- Tidak boleh memuat klaim imbal hasil terjamin; setiap angka disertai periode & asumsi.
- Tidak menampilkan data proyek yang belum disetujui untuk publik.

**Event:** `invest_page_view`, `contact_click` (`channel`, `placement`). Tidak ada event funnel lead.

### 4.6 Proyek `/proyek` & `/proyek/[slug]`

**Tujuan:** memberi bukti nyata bahwa Azetta mengerjakan proyek, sehingga pemilik lahan dan investor lebih percaya.

**Struktur daftar:**

1. Judul + paragraf pembuka singkat (1–2 kalimat).
2. Filter ringan: status (Sedang berjalan / Selesai / Direncanakan) dan kota.
3. Grid kartu 9/halaman: cover 4:3, badge status, judul, lokasi, tahun.
4. Empty state bila belum ada proyek publish → section tidak ditampilkan di beranda, halaman menampilkan penjelasan singkat.

**Struktur detail:**

1. Breadcrumb + judul + badge status.
2. Meta: lokasi, tahun mulai/selesai, luas lahan, jumlah unit (bila diisi).
3. Cover + galeri (grid, lightbox).
4. Deskripsi kaya (HTML tersanitasi dari Tiptap).
5. CTA: "Tawarkan lahan Anda" dan "Hubungi manajemen" (maks 2).

**Aturan:**

- Tidak menampilkan angka keuangan, harga jual, atau nama klien tanpa persetujuan.
- Proyek `isPublished = false` → 404.
- Tanpa peta interaktif di MVP (menghindari bobot & kebutuhan API peta).

**SEO:** `CreativeWork` + `BreadcrumbList`; title "{Judul Proyek} — Proyek Azetta di {Kota}".

**Event:** `project_list_view`, `project_view` (`slug`), `project_cta_click`.

### 4.7 Artikel `/artikel` & `/artikel/[slug]`

- Daftar: kartu (cover, judul, ringkasan, tanggal, estimasi baca), pagination 9/halaman, filter tag sederhana.
- Detail: judul, meta (tanggal, waktu baca), cover, isi kaya (heading, list, gambar, tabel, blockquote), CTA di tengah/akhir ("Lihat katalog rumah" / "Tanya tim"), artikel terkait 3.
- `Article` + `BreadcrumbList` JSON-LD.
- Event: `article_view`, `article_cta_click`.

### 4.8 Tentang `/tentang`

Struktur: cerita singkat, visi, tim (foto + peran, opsional), nilai, proyek yang sudah dikerjakan, CTA kontak. Bertujuan membangun kepercayaan untuk dua aliran bernilai besar (lahan & investasi).

### 4.9 Kontak `/kontak`

- Info kontak (WhatsApp, telepon, email, alamat, jam operasional, peta opsional).
- Form kontak umum (`type = GENERAL`): nama, WhatsApp, email, kota, pesan, consent.
- Tautan cepat ke tiga alur.

### 4.10 Terima kasih `/terima-kasih/[type]`

Halaman `noindex`, tidak dapat diakses langsung tanpa referensi valid? (MVP: dapat diakses langsung, isi generik).

Isi:

1. Ikon centang + "Terima kasih, {nama}!" (nama dari `sessionStorage`; jika tidak ada, "Terima kasih!").
2. Nomor referensi (monospace, bisa disalin).
3. "Apa yang terjadi selanjutnya" — 3 langkah sesuai tipe, dengan estimasi waktu.
4. Tombol WhatsApp "Chat sekarang" (opsional, agar yang tidak sabar bisa langsung).
5. Tautan kembali ke katalog/beranda.

### 4.11 FAQ `/faq`

Akordeon per kategori (Umum, Rumah, Lahan, Investasi) + form kontak di bawah. `FAQPage` JSON-LD.

### 4.12 Akun saya

**Rute:** `/akun`, `/akun/pengajuan/[id]`, `/akun/profil`

**Tujuan:** memberi ketenangan setelah mengirim pengajuan — pengguna tahu statusnya tanpa harus menghubungi sales.

**Akses:** wajib login + email terverifikasi. Belum login → `/masuk?next=/akun`; belum verifikasi → banner verifikasi dengan tombol kirim ulang.

**Struktur:**

```text
┌──────────────────────────────────────────────────────────────┐
│ [Logo]                                    [Avatar ▾] [Keluar]│
├──────────────────────────────────────────────────────────────┤
│ Halo, Budi                                                   │
│ [ Pengajuan saya ]  [ Profil ]                               │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ AZT-LD-2610-K7Q2M            [ Sedang ditinjau ]        │ │
│ │ Pengajuan lahan · 23 Okt 2026                            │ │
│ │ "Lokasi sudah sesuai. Survei dijadwalkan minggu depan."  │ │
│ │                                         [Lihat detail →] │ │
│ └──────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ AZT-DS-2610-P3M8Q            [ Selesai ]                │ │
│ │ Tanya unit · Azetta Residence Tipe 45 (A1)               │ │
│ │                                         [Lihat detail →] │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

**Detail pengajuan (`/akun/pengajuan/[id]`):**

1. Header: referensi, tipe, tanggal, badge status ramah pengguna.
2. Linimasa status: `Diterima → Dihubungi → Ditinjau → Penawaran → Selesai` — hanya tahap yang sudah dilalui yang terisi, dengan tanggal.
3. Catatan terbaru dari tim (`customerNote`), bila ada.
4. Ringkasan data yang dikirim (tanpa catatan internal): unit yang ditanyakan / luas & lokasi lahan.
5. Lampiran milik pengguna (foto lahan) dengan pratinjau.
6. CTA: "Chat tim kami" (WhatsApp berisi referensi) + "Kembali".

**Profil (`/akun/profil`):**

- Nama, WhatsApp, kota (dapat diubah).
- Email (tidak dapat diubah; tampil dengan tanda terverifikasi).
- Ganti kata sandi (kata sandi lama + baru + konfirmasi).
- Bagian "Hapus akun": tombol **Ajukan permohonan hapus akun** + dialog konfirmasi dengan alasan opsional. Setelah terkirim, status "Menunggu diproses" tampil dan tombol dinonaktifkan. Akun tetap aktif sampai admin memproses (Q12).
- Halaman admin `/permohonan-hapus`: tabel `PENDING` (nama, email, alasan, tanggal), aksi "Tandai selesai" / "Tolak" + catatan; tanpa tombol yang menghapus data otomatis.

**Aturan tampilan:**

- Status internal tidak pernah ditampilkan apa adanya; gunakan label di [04 §3.5](./04-data-model.md#35-pipeline-status).
- Lead `SPAM` tidak muncul.
- Bila pengguna membuka pengajuan milik orang lain → 404.
- Tidak ada data internal (assignee, estimasi nilai, catatan aktivitas) di halaman ini.

**SEO:** `noindex, nofollow`.

**Event:** `account_view`, `submission_view` (`type`), `account_profile_update`.

### 4.13 Halaman legal

- `/kebijakan-privasi`: data yang dikumpulkan, tujuan, dasar pemrosesan (consent), retensi, hak subjek data, kontak.
- `/syarat-ketentuan`: penggunaan situs, hak kekayaan intelektual gambar/render unit, batasan tanggung jawab, hukum yang berlaku.
- Keduanya wajib direview pihak legal sebelum rilis.

### 4.14 Halaman 404

Pesan ramah + pencarian unit + tautan ke dua alur utama. Status HTTP 404 sungguhan.

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
| Login | Bila sesi aktif, nama & email terisi otomatis dan dapat diubah; lead tertaut ke akun |

### 5.2 Form "Tanya unit ini" (`BUY_UNIT`)

| Field | Tipe | Wajib | Validasi | Pesan error |
|-------|------|:-----:|----------|-------------|
| `name` | text | ✅ | 2–80 char | "Nama minimal 2 karakter" |
| `phone` | tel | ✅ | regex Indonesia, 9–15 digit | "Masukkan nomor WhatsApp yang valid, mis. 081234567890" |
| `email` | email | — | format email, ≤160 | "Format email tidak valid" |
| `city` | text | — | ≤80 | — |
| `message` | textarea | — | ≤1000 | "Pesan maksimal 1000 karakter" |
| `consent` | checkbox | ✅ | harus `true` | "Anda perlu menyetujui pemrosesan data" |

Field tersembunyi: `unitId` (dari halaman), `utm`, `landingPath`. Helper text: "Kami akan menghubungi Anda via WhatsApp pada jam kerja."

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

**Langkah 3 — Maksud penawaran**

| Field | Tipe | Wajib | Pilihan |
|-------|------|:-----:|---------|
| `offerIntent` | radio card | ✅ | **Dijual ke Azetta** / **Dikerjasamakan** / Belum tahu |
| `startTimeline` | select | — | Segera / 3–6 bulan / 6–12 bulan / >12 bulan / Belum tahu |
| `notes` | textarea | — | ≤1000 |
| `consent` | checkbox | ✅ | — |

Salinan bantuan di bawah `offerIntent`: "Dijual: Azetta membeli lahan Anda. Dikerjasamakan: Azetta membangun, lalu hasil penjualan unit dibagi sesuai perjanjian."

**Perilaku stepper:** indikator 1-2-3, tombol "Kembali"/"Lanjut", validasi per langkah, draft di `sessionStorage` (dihapus setelah sukses), peringatan bila halaman ditinggalkan dengan isian.

### 5.4 Form kontak umum (`GENERAL`)

`name`, `phone`, `email`, `city`, `message` (wajib, ≤1000), `consent`.

### 5.5 Form akun

**Daftar (`/daftar`)**

| Field | Tipe | Wajib | Validasi / pesan |
|-------|------|:-----:|------------------|
| `name` | text | ✅ | 2–80; "Nama minimal 2 karakter" |
| `email` | email | ✅ | format email; "Format email tidak valid" |
| `password` | password | ✅ | min. 8 karakter, ada huruf & angka; indikator kekuatan |
| `confirmPassword` | password | ✅ | harus sama; "Kata sandi tidak sama" |
| `consent` | checkbox | ✅ | setuju kebijakan privasi & syarat |
| Turnstile | invisible | ✅ | — |

Setelah submit: halaman "Cek email Anda" + tombol kirim ulang (maks 3×/jam). Tidak ada auto-login sebelum verifikasi.

**Masuk (`/masuk`)**

`email`, `password`, tautan "Lupa kata sandi?". Pesan gagal selalu sama: "Email atau kata sandi salah" (tidak membocorkan keberadaan akun).

**Lupa sandi (`/lupa-sandi`)** — `email`; respons selalu "Jika email terdaftar, kami telah mengirim tautan reset."

**Reset sandi (`/reset-sandi?token=…`)** — `password` + `confirmPassword`; token tidak valid/kedaluwarsa → pesan + tautan minta ulang.

**Profil (`/akun/profil`)** — `name`, `whatsapp`, `city`; bagian terpisah "Ubah kata sandi" (`currentPassword`, `newPassword`, `confirmPassword`). Email hanya-baca.

## 6. Wireframe kunci

### 6.1 Beranda (mobile)

```text
┌──────────────────────────────┐
│ ☰  AZETTA          [Hubungi] │
├──────────────────────────────┤
│                              │
│  Rumah siap dihuni,          │
│  dibangun oleh Azetta.       │
│  Lahan Anda, kami kelola.    │
│                              │
│  [ Lihat Katalog Rumah   ]   │
│  [ Tawarkan Lahan Anda   ]   │
│                              │
│  ┌────────────────────────┐  │
│  │      render rumah      │  │
│  └────────────────────────┘  │
├──────────────────────────────┤
│  Pilih jalur Anda            │
│  ┌────────┐ ┌────────┐       │
│  │ Rumah  │ │ Lahan  │       │
│  └────────┘ └────────┘       │
│  ┌────────┐                  │
│  │Investasi│ (info)          │
│  └────────┘                  │
├──────────────────────────────┤
│  Unit unggulan     Lihat →   │
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

### 6.2 Detail unit rumah (mobile, dengan sticky CTA)

```text
┌──────────────────────────────┐
│ ‹ Kembali                    │
│ ┌──────────────────────────┐ │
│ │        foto utama        │ │
│ └──────────────────────────┘ │
│ ● ○ ○ ○  (indikator galeri)  │
│ Azetta Residence · Tipe 45   │
│ A1 · [Tersedia] · Bandung    │
│ 3 KT · 2 KM · LB 90 · LT 96  │
│ ┌────────────┬─────────────┐ │
│ │ 3 KT       │ 2 KM        │ │
│ ├────────────┼─────────────┤ │
│ │ LB 90 m²   │ LT 96 m²    │ │
│ └────────────┴─────────────┘ │
│ Deskripsi …                  │
│ Denah  [Lantai 1][Lantai 2]  │
│ ── Tanya unit ini ──         │
│ [Nama]                       │
│ [WhatsApp]                   │
│ [Email (opsional)]           │
│ [Pesan]                      │
│ ☐ Saya setuju data diproses  │
│ [ Kirim pertanyaan ]         │
│ Unit terkait                 │
├──────────────────────────────┤
│ Rp 850 jt   [Tanya Unit]      │ ← sticky
└──────────────────────────────┘
```

### 6.3 Form lahan — langkah 2 (mobile)

```text
┌──────────────────────────────┐
│ Tawarkan Lahan               │
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
│ Unit     │ │ 🔍 Cari nama / nomor / referensi…  ▾ Filter       │ │
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
| `RadioCard` | `radio` + `card` | Maksud penawaran lahan |
| `FileDropzone` | kustom + `file-input` | Foto lahan |
| `Badge` | `badge` | Status unit, status pengajuan |
| `UnitCard` | `card` | Katalog, beranda |
| `ProjectCard` | `card` | Beranda, `/proyek` |
| `StatusBadge` | `badge` | Status pengajuan (label ramah pengguna) |
| `Stat` | `stat` | Dashboard |
| `Table` | `table` | Admin |
| `Pagination` | `join` | Katalog, admin |
| `Modal`, `Drawer` | `modal`, `drawer` | Filter mobile, lightbox |
| `Toast` | `toast` | Feedback admin |
| `Steps` | `steps` | Form lahan |
| `Timeline` | `timeline` | Aktivitas lead |
| `Skeleton` | `skeleton` | Loading |
| `EmptyState` | kustom | Katalog kosong, daftar kosong |
| `Avatar` | `avatar` | Header akun, admin |
| `Alert` | `alert` | Banner verifikasi email, catatan sistem |
| `Breadcrumbs` | `breadcrumbs` | Publik & admin |
| `RichTextEditor` | Tiptap + toolbar | CMS |
| `ConfirmDialog` | `modal` | Hapus/arsipkan |

**Editor konten (Tiptap):** toolbar H2/H3, bold, italic, bullet & numbered list, link, gambar (unggah via presign R2), blockquote, tabel, undo/redo. Paste dibersihkan otomatis; tidak ada HTML mentah atau `script`. Pratinjau publik merender HTML tersanitasi.

**Tema (Brand Guidelines v1.0):** tema daisyUI `azetta` (light-only, **monokrom**) didefinisikan di `apps/web/src/routes/layout.css` dan `apps/admin/src/routes/layout.css` (identik sampai token dipindah ke `packages/ui` pada E1-01). Rujukan lengkap: `docs/AZETTA_Brand_Guidelines.pdf`.

| Token | Nilai | Pemakaian |
|-------|-------|-----------|
| `base-100` | `#F4F5F6` (paper) | Latar utama halaman |
| `base-200` | `#E8EAEB` (mist) | Latar kedua / section selang-seling |
| `base-300` | `#D6D8D9` (line) | Hairline, garis pemisah |
| `base-content` | `#1A1A1A` (ink) | Teks utama |
| `primary` / `neutral` | `#1A1A1A` (ink) | Tombol utama, section gelap |
| `secondary` / `accent` | `#2B2B2B` / `#3E3E3E` | Hierarki tombol lewat kontras |
| Status | `info` `#2C4F63` · `success` `#2E5D46` · `warning` `#7A5216` · `error` `#8A3232` (teks paper) | Rona muted khusus umpan balik sistem — satu-satunya warna di luar palet monokrom (D20) |
| Font | `Arial, 'Liberation Sans', Helvetica, sans-serif` | Semua teks; tanpa webfont |
| Radius | field 8 px, box 16 px | Bidang polos tanpa bayangan |
| Utility brand | `bg-brand-*`, `text-brand-*` (ink, ink-2, ink-3, gray-600/500/300, line, mist, paper) | Bila butuh nilai palet langsung |
| Kelas bantu | `.eyebrow`, `.title-rule`, `.on-dark` | Eyebrow kapital, garis aksen 5 px di bawah judul, permukaan gelap (teks paper, tombol utama berbalik, kartu ink-2) |
| Lockup logo | mark 90×84, jarak 0,24 × lebar mark, tinggi kapital wordmark 0,5 × tinggi mark | Ukuran minimum lockup 120 px — di bawahnya pakai mark saja (`wordmark={false}`) |

Aturan visual yang mengikat:

1. **Tanpa warna aksen pada permukaan dan aksi.** Satu-satunya warna adalah empat rona status muted (`info`, `success`, `warning`, `error`) untuk umpan balik sistem; kontras teks paper di atasnya 6,3–8,0:1. Status tetap **wajib** disertai label teks atau ikon — warna tidak pernah menjadi satu-satunya pembeda.
2. **Tanpa bayangan, gradasi, atau efek elevasi.** Pemisah memakai hairline `line`; kartu adalah bidang putih (`bg-white`) di atas latar paper/mist, dan `ink-2` bila di dalam `.on-dark`.
3. **Ritme gelap–terang.** Hero, pernyataan penting, dan ajakan memakai latar ink (`.on-dark`); section isi berselang-seling paper dan mist.
4. **Judul** selalu tebal (700) dengan jarak baris 1,05–1,1; **isi** reguler 400 dengan jarak baris 1,4–1,45; penekanan memakai ketebalan, bukan warna atau ukuran baru.
5. **Logo** memakai mark asterisk resmi (`logo-mark.svg` / komponen `Logo.svelte`); jangan menggambar ulang atau mengubah warna selain ink dan paper.
6. **Kanal WhatsApp (pengecualian resmi, D19).** Tombol `wa.me` tetap dipakai di web sebagai kanal konversi sekunder (lihat FR-PUB-10), tetapi nomor WhatsApp tidak dicetak sebagai teks pada materi pemasaran (media sosial, poster, PDF, presentasi). Tombol memakai gaya `btn-outline` monokrom, bukan warna aksen.

Halaman pratinjau `/theme` (`noindex`) menampilkan palet, rasio kontras, skala tipografi, dan seluruh komponen. Pada E1-01 token dipindahkan ke preset bersama di `packages/ui`.

**Ikon (Iconify):** pakai set `lucide` untuk UI dan `mdi`/`ph` bila perlu. Ikon dekoratif `aria-hidden="true"`.

## 8. Status & edge case

| Situasi | Perilaku |
|---------|----------|
| Data kosong (katalog) | Empty state + saran hapus filter |
| Unit sudah terjual | Halaman tetap tampil dengan badge `Terjual`; form dinonaktifkan, CTA ke unit sejenis |
| Unit `INDENT` | Badge `Indent`; form tetap aktif dengan catatan estimasi serah terima |
| Gambar gagal dimuat | Placeholder abu-abu dengan ikon + `alt` tetap ada |
| Koneksi lambat | Skeleton untuk katalog; tombol submit menampilkan spinner |
| Sesi admin kedaluwarsa | Redirect ke `/login?next=…` setelah menyimpan tujuan |
| Sesi customer kedaluwarsa | Redirect ke `/masuk?next=/akun…` |
| Email belum diverifikasi | Banner di `/akun` + tombol kirim ulang; data pengajuan tidak ditampilkan |
| Pengguna membuka pengajuan orang lain | 404 (bukan 403) |
| Akun dinonaktifkan | Sesi dicabut; pesan "akun tidak aktif, hubungi kami" |
| Reset kata sandi dengan token kedaluwarsa | Pesan + tautan minta ulang |
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
| `unit_card_click` | Kartu unit diklik | `unitId`, `position` |
| `unit_view` | Detail unit dimuat | `unitId`, `salesStatus` |
| `offer_view` | Halaman lahan dimuat | `type` |
| `invest_page_view` | Halaman informasi investasi dimuat | `referrer` |
| `contact_click` | Kanal kontak diklik | `channel`, `placement` |
| `project_list_view` | Daftar proyek dimuat | `filterCount` |
| `project_view` | Detail proyek dibuka | `slug` |
| `project_cta_click` | CTA proyek diklik | `slug`, `target` |
| `register_submit` | Form daftar dikirim | `source` |
| `register_success` | Akun berhasil dibuat | — |
| `email_verified` | Verifikasi email berhasil | — |
| `login_success` | Login berhasil | `role` |
| `account_view` | `/akun` dibuka | `submissionCount` |
| `account_deletion_request` | Permohonan hapus akun terkirim | — |
| `submission_view` | Detail pengajuan dibuka | `type`, `statusLabel` |
| `lead_form_start` | Field pertama difokuskan | `type`, `unitId` |
| `lead_form_step` | Langkah form lahan selesai | `step` |
| `lead_submit_attempt` | Tombol submit ditekan | `type` |
| `lead_submit_success` | Respons sukses | `type`, `reference` |
| `lead_submit_error` | Respons gagal | `type`, `code` |
| `whatsapp_click` | Tombol WA diklik | `placement`, `unitId` |
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

Mengikuti Brand Guidelines §07 — bahasa Indonesia yang sopan, hangat, dan lugas.

| Aspek | Ketentuan |
|-------|-----------|
| Sapaan | "Anda". Di WhatsApp (internal, setelah lead masuk): Bapak/Ibu, dibuka dan ditutup dengan salam. |
| Kalimat | Pendek, satu gagasan per kalimat. |
| Angka | Ribuan dengan titik, desimal dengan koma: `Rp 1.646.000.000` · `11,3%`. |
| Judul | Pernyataan atau pertanyaan yang langsung kena — bukan slogan, tanpa tagar. |
| Status proyek | Apa adanya: "Rancangan proyek Faisal · tahap perencanaan". |

Jangan/gunakan:

| Jangan | Gunakan |
|--------|---------|
| Menyebut angka imbal hasil di materi publik | Ajakan untuk kajian; angka hanya di materi tertutup beserta asumsinya |
| "Aman", "pasti untung", "tanpa risiko" | Sebut risikonya, lalu cara mengendalikannya |
| "Lahan tetap milik Anda" | "Lahan masuk sebagai modal penyertaan" |
| "Pasar saham" | "Pengalihan saham" atau "pasar sekunder terbatas" |
| Menampilkan proyek yang belum deal | Hanya proyek yang sudah deal, status apa adanya |
| Harga lahan milik pemilik tertentu di materi publik | Angka transaksi hanya untuk pihak yang terlibat |

Tambahan untuk UI:

- Hindari jargon teknis properti yang tidak dijelaskan (mis. "KDB", "GSB") — jelaskan dalam kurung.
- Angka konkret lebih baik daripada superlatif ("96 m²" bukan "sangat luas").
- CTA berupa kata kerja: "Lihat katalog", "Tawarkan lahan", "Hubungi manajemen".
- Tanpa emoji; pemisah butir memakai mark AZETTA, bukan titik atau emoji.
- Setiap materi publik ditutup dengan satu ajakan.
