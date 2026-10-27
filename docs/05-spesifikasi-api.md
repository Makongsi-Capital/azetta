# 05 — Spesifikasi API

> Kembali ke [index](./README.md) · Sebelumnya: [04](./04-data-model.md) · Berikutnya: [06](./06-ux-sitemap-wireframe.md)

---

## 1. Gambaran

| Aspek | Nilai |
|-------|-------|
| Base URL produksi | `https://api.azetta.id` |
| Base URL lokal | `http://localhost:3000` |
| Prefix versi | `/api/v1` |
| Auth | `/api/auth/*` (Better Auth) |
| Format | JSON UTF-8, kecuali unggah media (presigned `PUT` langsung ke R2) |
| Dokumentasi | OpenAPI 3.1 di `/docs` (hanya aktif di non-produksi atau dilindungi basic auth) |
| Klien | Eden Treaty (`packages/api-client`) untuk web & admin |

## 2. Konvensi

### 2.1 Amplop respons

Sukses (single):

```json
{ "data": { "id": "clx…", "slug": "rumah-minimalis-2-lantai" } }
```

Sukses (list):

```json
{
  "data": [ { "id": "clx…" } ],
  "meta": { "page": 1, "perPage": 12, "total": 57, "totalPages": 5 }
}
```

Gagal:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Data yang dikirim belum lengkap.",
    "details": [ { "field": "phone", "message": "Nomor WhatsApp tidak valid" } ],
    "requestId": "6f1c2a9e-…"
  }
}
```

### 2.2 Pagination, urutan, filter

| Parameter | Default | Batas |
|-----------|---------|-------|
| `page` | 1 | ≥ 1 |
| `perPage` | 12 | 1–50 (publik), 1–100 (admin) |
| `sort` | `-publishedAt` | Daftar nilai per endpoint |
| `q` | — | 1–100 karakter |

Aturan:

- `page` di luar jangkauan → `data: []`, `meta.total` tetap benar (bukan 404).
- Filter yang tidak dikenal diabaikan; nilai filter yang tidak valid → `400 VALIDATION_ERROR`.
- Pencarian `q` di-trim dan dinormalisasi (lowercase, buang karakter kontrol).

### 2.3 Waktu & ID

- Semua timestamp: ISO 8601 UTC, contoh `2026-10-23T04:15:00.000Z`.
- ID internal: `cuid` (string). Tidak pernah memakai urutan angka.
- `reference` lead: `AZT-{DS|LD|IV|GN}-{yyMM}-{5 char}` — mis. `AZT-LD-2610-K7Q2M`.

### 2.4 Tipe data khusus

| Tipe Prisma | Representasi JSON | Contoh |
|-------------|-------------------|--------|
| `BigInt` (uang) | **string** desimal | `"1500000000"` |
| `DateTime` | string ISO UTC | `"2026-10-23T04:15:00.000Z"` |
| `Json` | objek bebas | `{ "source": "ig" }` |
| `enum` | string UPPER_SNAKE | `"LAND_OFFER"` |

> `BigInt` diserialisasi sebagai string karena `JSON.stringify` tidak mendukung `BigInt`. Kontrak TypeBox mendefinisikan field ini sebagai `t.String({ pattern: '^[0-9]+$' })`.

### 2.5 Idempotensi & deduplikasi

- Klien mengirim `Idempotency-Key` (UUID v4) di body saat submit lead.
- Kunci disimpan pada kolom `Lead.idempotencyKey` (unik). Permintaan dengan kunci yang sudah ada mengembalikan lead tersebut dengan status `200` (bukan `201`).
- Tanpa kunci, deduplikasi tetap dilakukan: `(phoneNormalized, type)` yang sama dalam **60 detik** → kembalikan lead yang ada (`200`) dan tandai `duplicate`.
- Deduplikasi **24 jam** tidak memblokir: lead baru tetap dibuat, dan admin melihat peringatan "kemungkinan duplikat" pada detail lead (lihat FR-LEAD-10).

### 2.6 Header wajib/umum

| Header | Kapan | Keterangan |
|--------|-------|------------|
| `Content-Type: application/json` | Semua POST/PATCH JSON | — |
| `Authorization: Bearer …` | Opsional; web memakai cookie | Untuk integrasi non-browser |
| `X-Request-Id` | Opsional dari klien | Diteruskan/dibuat; dikembalikan di respons |
| `Accept-Language` | Opsional | MVP hanya `id` |

## 3. Autentikasi

### 3.1 Endpoint Better Auth (`/api/auth/*`)

| Metode | Path | Fungsi | Akses |
|--------|------|--------|-------|
| POST | `/sign-up/email` | Registrasi publik | Anonim + Turnstile |
| POST | `/sign-in/email` | Login | Anonim (rate limit) |
| POST | `/sign-out` | Akhiri sesi | Sesi aktif |
| GET | `/get-session` | Ambil sesi aktif | Sesi aktif |
| POST | `/send-verification-email` | Kirim ulang verifikasi | Anonim (maks 3×/jam) |
| GET | `/verify-email` | Verifikasi lewat token | Anonim |
| POST | `/forget-password` | Kirim tautan reset | Anonim (rate limit) |
| POST | `/reset-password` | Reset dengan token | Anonim |
| POST | `/change-password` | Ganti kata sandi sendiri | Sesi aktif |
| POST | `/admin/create-user` | Buat akun internal | `super_admin` |
| POST | `/admin/set-role` | Ubah peran | `super_admin` |
| POST | `/admin/ban-user` / `/unban-user` | Nonaktifkan/aktifkan | `super_admin` |

> Registrasi publik **aktif** (`disableSignUp: false`) dan selalu menghasilkan `role = "customer"`; peran tidak dapat dikirim dari klien. Akun internal hanya dibuat `super_admin`. Nama endpoint mengikuti dokumentasi Better Auth versi yang dipakai; tabel ini adalah yang **digunakan** aplikasi.

### 3.2 Matriks otorisasi

| Area | Anonim | `customer` | `admin` | `super_admin` |
|------|:------:|:----------:|:-------:|:-------------:|
| Baca katalog/artikel/proyek | ✅ | ✅ | ✅ | ✅ |
| Kirim lead | ✅ | ✅ | ✅ | ✅ |
| Melihat pengajuan sendiri (`/me/leads`) | ❌ | ✅ (setelah verifikasi email) | — | — |
| Mengajukan hapus akun (`/me/deletion-request`) | ❌ | ✅ (setelah verifikasi email) | — | — |
| Melihat & memproses permohonan hapus akun | ❌ | ❌ | ✅ | ✅ |
| Baca semua lead | ❌ | ❌ | ✅ | ✅ |
| Ubah status/catat aktivitas/catatan pemohon | ❌ | ❌ | ✅ | ✅ |
| Lihat lampiran lead | ❌ | ❌ | ✅ | ✅ |
| Kelola desain/proyek/artikel | ❌ | ❌ | ✅ | ✅ |
| Ekspor data pribadi | ❌ | ❌ | ✅ | ✅ |
| Kelola pengguna & peran | ❌ | ❌ | ❌ | ✅ |
| Ubah pengaturan situs & unggah aset | ❌ | ❌ | ✅ | ✅ |
| Lihat audit log | ❌ | ❌ | ✅ | ✅ |

Catatan: kolom `customer` **tidak** memiliki akses ke `/api/v1/admin/*`. Satu cookie sesi dipakai bersama web & admin, sehingga pembatasan wajib ditegakkan di server (lihat [03 §6.3](./03-arsitektur-teknis.md#63-guard)).

## 4. Endpoint publik

### 4.1 Ringkasan

| Metode | Path | Fungsi | Cache |
|--------|------|--------|-------|
| GET | `/public/designs` | Daftar desain publish | 60 s |
| GET | `/public/designs/filters` | Nilai filter tersedia + jumlah | 300 s |
| GET | `/public/designs/:slug` | Detail desain | 300 s |
| GET | `/public/designs/:slug/related` | Desain terkait (maks 4) | 300 s |
| GET | `/public/projects` | Daftar proyek publish | 60 s |
| GET | `/public/projects/:slug` | Detail proyek | 300 s |
| GET | `/public/articles` | Daftar artikel publish | 60 s |
| GET | `/public/articles/:slug` | Detail artikel | 300 s |
| GET | `/public/faqs` | FAQ aktif | 600 s |
| GET | `/public/testimonials` | Testimoni publish | 600 s |
| GET | `/public/site-config` | Kontak, brand, hero, template WA, analytics, dokumen legal | 300 s |
| GET | `/public/regions` | Provinsi & kabupaten/kota | 1 hari (etag) |
| POST | `/public/uploads/presign` | URL unggah lampiran lead | — |
| POST | `/public/leads` | Kirim lead | — |
| POST | `/public/events` | Kirim event funnel (batch) | — |
| GET | `/me` | Profil pengguna yang login | no-store |
| PATCH | `/me` | Ubah profil sendiri | no-store |
| GET | `/me/leads` | Daftar pengajuan milik sendiri | no-store |
| GET | `/me/leads/:id` | Detail pengajuan milik sendiri | no-store |
| GET | `/me/deletion-request` | Status permohonan hapus akun milik sendiri | no-store |
| POST | `/me/deletion-request` | Ajukan permohonan hapus akun | no-store |

> Empat endpoint terakhir berada di prefiks `/api/v1` dan memerlukan sesi `customer` yang email-nya terverifikasi.

### 4.2 `GET /public/designs`

**Query:** `q`, `category`, `style`, `floors`, `bedrooms`, `minLandArea`, `maxPrice`, `sort` (`-publishedAt` \| `-viewCount` \| `priceFrom` \| `-priceFrom`), `page`, `perPage`.

**Contoh:**

```http
GET /api/v1/public/designs?category=RESIDENTIAL&floors=2&bedrooms=3&sort=-publishedAt&page=1
```

```json
{
  "data": [
    {
      "id": "clx1",
      "slug": "rumah-minimalis-2-lantai-6x12",
      "title": "Rumah Minimalis 2 Lantai 6×12",
      "subtitle": "3 kamar tidur, cocok untuk lahan sempit",
      "category": "RESIDENTIAL",
      "style": "Minimalis",
      "floors": 2,
      "bedrooms": 3,
      "bathrooms": 2,
      "carports": 1,
      "buildingAreaM2": 96,
      "landAreaMinM2": 72,
      "priceFrom": "4500000",
      "featured": true,
      "cover": {
        "url": "https://media.azetta.id/designs/clx1/cover.webp",
        "alt": "Tampak depan rumah minimalis dua lantai",
        "width": 1600,
        "height": 1067
      },
      "tags": ["Minimalis", "Lahan Sempit"]
    }
  ],
  "meta": { "page": 1, "perPage": 12, "total": 8, "totalPages": 1 }
}
```

**Catatan:** `description` **tidak** disertakan pada list (payload lebih kecil).

### 4.3 `GET /public/designs/:slug`

```json
{
  "data": {
    "id": "clx1",
    "slug": "rumah-minimalis-2-lantai-6x12",
    "title": "Rumah Minimalis 2 Lantai 6×12",
    "subtitle": "3 kamar tidur, cocok untuk lahan sempit",
    "description": "## Konsep\nRumah ini …",
    "category": "RESIDENTIAL",
    "style": "Minimalis",
    "floors": 2,
    "bedrooms": 3,
    "bathrooms": 2,
    "carports": 1,
    "buildingAreaM2": 96,
    "landAreaMinM2": 72,
    "priceFrom": "4500000",
    "media": [
      { "id": "m1", "kind": "IMAGE", "url": "https://…", "alt": "…", "width": 1600, "height": 1067, "isCover": true },
      { "id": "m2", "kind": "FLOOR_PLAN", "url": "https://…", "alt": "Denah lantai 1", "width": 1200, "height": 1600, "isCover": false }
    ],
    "tags": ["Minimalis", "Lahan Sempit"],
    "publishedAt": "2026-10-01T02:00:00.000Z",
    "seo": { "title": "…", "description": "…" }
  }
}
```

> **Tidak dikirim ke publik:** `estimatedBuildCostMin`, `estimatedBuildCostMax`, `createdById`, dan catatan internal. Estimasi biaya hanya tersedia di endpoint admin (Q8).

Respons `404 NOT_FOUND` untuk desain `DRAFT`/`ARCHIVED`/`deletedAt != null` — tanpa membedakan alasannya (menghindari kebocoran informasi).

### 4.4 `POST /public/leads`

Satu endpoint untuk tiga tipe. Skema bersifat diskriminatif berdasarkan `type`.

**Body — `BUY_DESIGN`:**

```json
{
  "type": "BUY_DESIGN",
  "name": "Budi Santoso",
  "phone": "081234567890",
  "email": "budi@example.com",
  "city": "Bandung",
  "message": "Apakah bisa diubah jadi 3 kamar?",
  "designId": "clx1",
  "consent": true,
  "turnstileToken": "0.abc…",
  "honeypot": "",
  "idempotencyKey": "5c2f0a7e-3db5-4b1c-9a56-8a5f5f2a9c11",
  "utm": { "source": "google", "medium": "cpc", "campaign": "desain-rumah" },
  "landingPath": "/desain/rumah-minimalis-2-lantai-6x12",
  "referrerUrl": "https://www.google.com/"
}
```

**Body — `LAND_OFFER`:**

```json
{
  "type": "LAND_OFFER",
  "name": "Sari Wulandari",
  "phone": "081298765432",
  "email": "sari@example.com",
  "city": "Sleman",
  "message": "Lahan warisan, ingin dikerjasamakan.",
  "consent": true,
  "turnstileToken": "0.abc…",
  "honeypot": "",
  "land": {
    "address": "Jl. Kaliurang KM 12, RT 02 RW 05",
    "province": "DI Yogyakarta",
    "city": "Sleman",
    "district": "Ngaglik",
    "areaM2": 800,
    "frontageM": 20,
    "ownershipStatus": "SHM",
    "certificateOnBehalf": "Sari Wulandari",
    "zoning": "Perumahan",
    "currentUse": "Lahan kosong",
    "roadAccess": "Jalan aspal 6 meter",
    "estimatedValue": "1200000000",
    "expectedScheme": "BAGI_HASIL",
    "startTimeline": "M3_6",
    "notes": "Dekat kampus, ada akses air PDAM.",
    "attachmentKeys": ["leads/tmp/7c9f1.jpg", "leads/tmp/7c9f2.jpg"]
  }
}
```

**Body — `INVEST`:**

```json
{
  "type": "INVEST",
  "name": "Hendra Wijaya",
  "phone": "081211112222",
  "email": "hendra@example.com",
  "city": "Jakarta Selatan",
  "message": "Tertarik proyek residensial di Jabodetabek.",
  "consent": true,
  "turnstileToken": "0.abc…",
  "honeypot": "",
  "invest": {
    "budgetRange": "B1_5",
    "preferredLocations": ["Jakarta", "Bogor"],
    "horizonMonths": 24,
    "riskProfile": "MODERATE",
    "instrument": "PROFIT_SHARE",
    "notes": "Ingin laporan progres bulanan."
  }
}
```

**Respons `201`:**

```json
{
  "data": {
    "reference": "AZT-LD-2610-K7Q2M",
    "type": "LAND_OFFER",
    "createdAt": "2026-10-23T04:15:00.000Z",
    "nextStep": {
      "message": "Tim kami akan menghubungi Anda dalam 1 hari kerja.",
      "whatsappUrl": "https://wa.me/6281234567890?text=Halo%20Azetta…"
    }
  }
}
```

**Perilaku khusus:**

| Kondisi | Respons |
|---------|---------|
| Honeypot terisi | `201` palsu (referensi acak), lead disimpan `SPAM` tanpa notifikasi |
| `spamScore ≥ 100` | `201` palsu, disimpan `SPAM` |
| Turnstile gagal | `400 INVALID_CAPTCHA` |
| Dedup 60 detik | `200` + referensi yang sudah ada |
| Rate limit | `429 RATE_LIMITED` + `Retry-After` |
| Pengunjung sedang login | `userId` diambil dari sesi; field `userId` di body **diabaikan** |
| Belum verifikasi email | Lead tetap dibuat (tanpa akun tertaut) dan pengajuan tertaut setelah email diverifikasi |

Catatan: lead dari pengunjung yang login **tetap** dapat dikirim meski email belum terverifikasi — verifikasi hanya syarat untuk *melihat* pengajuan, bukan untuk mengirim.

### 4.5 `POST /public/uploads/presign`

Dipakai untuk foto lahan sebelum submit lead.

**Body:**

```json
{
  "purpose": "LAND_PHOTO",
  "files": [
    { "fileName": "lahan-1.jpg", "mimeType": "image/jpeg", "sizeBytes": 1843200 },
    { "fileName": "lahan-2.jpg", "mimeType": "image/jpeg", "sizeBytes": 2048000 }
  ],
  "turnstileToken": "0.abc…"
}
```

**Respons:**

```json
{
  "data": {
    "uploads": [
      {
        "key": "leads/tmp/7c9f1a2b.jpg",
        "url": "https://r2.azetta.id/leads/tmp/7c9f1a2b.jpg?X-Amz-Signature=…",
        "method": "PUT",
        "headers": { "Content-Type": "image/jpeg" },
        "expiresIn": 600
      }
    ]
  }
}
```

Batasan: maks 5 file/permintaan, ≤5 MB/file, MIME `image/jpeg|png|webp`, prefix `leads/tmp/`. Objek `tmp` yang tidak dirujuk lead dihapus setelah 24 jam. Saat lead dibuat, API memindahkan objek ke `leads/{leadId}/…` (copy + delete) dan mencatat metadata.

### 4.6 `GET /public/projects` & `GET /public/projects/:slug`

**Query daftar:** `status` (`PLANNED`|`ONGOING`|`COMPLETED`), `city`, `page`, `perPage` (default 9).

```json
{
  "data": [
    {
      "id": "prj1",
      "slug": "cluster-ngaglik-sleman",
      "title": "Cluster Ngaglik",
      "summary": "12 unit rumah dua lantai di Sleman.",
      "location": "Ngaglik, Sleman",
      "city": "Sleman",
      "province": "DI Yogyakarta",
      "status": "COMPLETED",
      "yearStarted": 2023,
      "yearCompleted": 2025,
      "unitCount": 12,
      "coverImageUrl": "https://media.azetta.id/projects/prj1/cover.webp"
    }
  ],
  "meta": { "page": 1, "perPage": 9, "total": 3, "totalPages": 1 }
}
```

Detail menambahkan `description`, `galleryUrls`, `landAreaM2`, dan `seo`. Proyek dengan `isPublished = false` → `404`.

### 4.7 Akun saya

Memerlukan `requireUser` (sesi + `emailVerified = true`). **Semua** endpoint memfilter `userId = user.id`; tidak ada parameter `userId` dari klien.

**`GET /me`**

```json
{
  "data": {
    "id": "usr_1",
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "emailVerified": true,
    "phone": "081234567890",
    "city": "Bandung",
    "createdAt": "2026-10-20T03:00:00.000Z"
  }
}
```

**`PATCH /me`** — hanya `name`, `phone`, `city`, `whatsapp`. Perubahan `email`/`role` diabaikan (atau `400 VALIDATION_ERROR` bila dikirim).

**`GET /me/leads`**

```json
{
  "data": [
    {
      "id": "clx_lead_1",
      "reference": "AZT-LD-2610-K7Q2M",
      "type": "LAND_OFFER",
      "statusLabel": "Sedang ditinjau",
      "statusTone": "info",
      "createdAt": "2026-10-23T04:15:00.000Z",
      "updatedAt": "2026-10-24T02:10:00.000Z",
      "customerNote": "Lokasi sudah sesuai. Survei dijadwalkan minggu depan.",
      "customerNoteUpdatedAt": "2026-10-24T02:10:00.000Z",
      "designSlug": null
    }
  ],
  "meta": { "page": 1, "perPage": 20, "total": 1, "totalPages": 1 }
}
```

**`GET /me/leads/:id`** menambahkan ringkasan data yang dikirim pengguna (tanpa catatan internal), riwayat perubahan status yang ramah pengguna, dan lampiran miliknya (URL bertanda tangan 15 menit).

Aturan:

| Aturan | Detail |
|--------|--------|
| Kepemilikan | `lead.userId !== user.id` → `404 NOT_FOUND` (bukan 403, agar tidak membocorkan keberadaan data) |
| Status `SPAM` | Tidak pernah dikembalikan |
| Catatan internal | `LeadActivity` tidak dikirim; hanya `customerNote` |
| Verifikasi email | Belum verifikasi → `403 EMAIL_NOT_VERIFIED` |
| Rate limit | 120/menit per pengguna |

**Permohonan hapus akun (Q12)**

- `POST /me/deletion-request` menerima `{ "reason": "..." }` (opsional, maks 500 karakter) dan membuat `AccountDeletionRequest` berstatus `PENDING`. Respons `201` berisi `{ id, status, requestedAt }`.
- `GET /me/deletion-request` mengembalikan permohonan terakhir milik pengguna atau `null`. Status yang mungkin: `PENDING`, `COMPLETED`, `REJECTED`.
- Akun **tetap aktif** dan dapat dipakai sampai admin memproses. Tidak ada penghapusan otomatis di MVP.
- Bila sudah ada permohonan `PENDING`, `POST` berikutnya → `409 DUPLICATE_REQUEST` (bukan membuat baris baru).
- Permohonan wajib melalui sesi terverifikasi; belum verifikasi → `403 EMAIL_NOT_VERIFIED`.

```json
{
  "data": {
    "id": "cdr_1",
    "status": "PENDING",
    "reason": "Tidak lagi menggunakan layanan",
    "requestedAt": "2026-10-27T03:00:00.000Z",
    "handledAt": null
  }
}
```

### 4.8 `POST /public/events`

Batch maks 20 event; dipakai untuk funnel internal. Bila analitik pihak ketiga aktif, event tetap dikirim agar data tidak hilang karena ad-blocker.

```json
{
  "sessionId": "s_9f2c…",
  "events": [
    { "name": "design_view", "path": "/desain/rumah-minimalis-2-lantai-6x12", "designId": "clx1", "props": { "source": "catalog" } },
    { "name": "lead_form_start", "path": "/desain/rumah-minimalis-2-lantai-6x12", "designId": "clx1" }
  ]
}
```

Respons: `202 Accepted` `{ "data": { "accepted": 2 } }`. Event tanpa `name` yang dikenal diabaikan.

## 5. Endpoint admin

Semua endpoint di bawah memerlukan sesi + peran sesuai [§3.2](#32-matriks-otorisasi).

### 5.1 Lead

| Metode | Path | Fungsi |
|--------|------|--------|
| GET | `/admin/leads` | Daftar + filter + pencarian + urutan |
| GET | `/admin/leads/:id` | Detail lengkap (termasuk detail tipe, lampiran, aktivitas) |
| PATCH | `/admin/leads/:id` | Ubah `priority`, `assignedToId`, `estimatedValue`, `nextFollowUpAt`, `city`, `customerNote` |
| POST | `/admin/leads/:id/status` | Transisi status |
| POST | `/admin/leads/:id/activities` | Catat aktivitas |
| DELETE | `/admin/leads/:id/activities/:activityId` | Hapus catatan (khusus `super_admin`, tercatat di audit) |
| GET | `/admin/leads/:id/attachments/:attachmentId/url` | URL bertanda tangan (15 menit) |
| GET | `/admin/leads/export` | CSV sesuai filter |
| GET | `/admin/leads/stats` | Ringkasan angka untuk badge/filter |

**`GET /admin/leads` query:** `status`, `type`, `assignedToId` (`me` didukung), `priority`, `q` (nama/telepon/email/referensi), `createdFrom`, `createdTo`, `sort` (`-createdAt` \| `createdAt` \| `nextFollowUpAt`), `page`, `perPage`.

**`POST /admin/leads/:id/status`:**

```json
{ "status": "QUALIFIED", "note": "Sudah bicara via telepon, anggaran sesuai.", "estimatedValue": "850000000" }
```

Respons `200` mengembalikan lead terbaru. Aturan:

- Transisi divalidasi terhadap tabel [04 §3.6](./04-data-model.md#36-pipeline-status).
- `LOST` tanpa `lostReason` → `400 VALIDATION_ERROR`.
- Setiap transisi membuat `LeadActivity` bertipe `STATUS_CHANGE` dengan `meta: { from, to }`.
- Transisi pertama ke `CONTACTED` mengisi `firstContactedAt` bila masih kosong.

**`POST /admin/leads/:id/activities`:**

```json
{ "type": "WHATSAPP", "body": "Sudah kirim katalog paket desain.", "meta": { "templateId": "T1" } }
```

Aturan: `body` wajib untuk `NOTE`/`CALL`/`WHATSAPP`/`EMAIL`/`MEETING`; maks 2.000 karakter. Aktivitas tipe kontak memperbarui `lastContactedAt`. Aktivitas `NOTE` tidak mengubah status.

**`GET /admin/leads/export`** mengembalikan `text/csv; charset=utf-8` dengan header `Content-Disposition`. Kolom: `reference, createdAt, type, status, priority, name, phone, email, city, designSlug, assignedTo, source, utmSource, utmCampaign, estimatedValue, firstContactedAt, closedAt, lostReason`.

### 5.2 Desain

| Metode | Path | Fungsi |
|--------|------|--------|
| GET | `/admin/designs` | Daftar semua status, filter, urutan |
| POST | `/admin/designs` | Buat draft |
| GET | `/admin/designs/:id` | Detail untuk editor |
| PATCH | `/admin/designs/:id` | Ubah field |
| DELETE | `/admin/designs/:id` | Arsipkan (soft delete); `409` bila punya lead aktif |
| POST | `/admin/designs/:id/publish` | Set `PUBLISHED` + `publishedAt` |
| POST | `/admin/designs/:id/archive` | Set `ARCHIVED` |
| POST | `/admin/designs/:id/duplicate` | Duplikasi sebagai draft baru |
| POST | `/admin/designs/:id/media/presign` | URL unggah media |
| POST | `/admin/designs/:id/media` | Daftarkan media setelah unggah |
| PATCH | `/admin/designs/:id/media/:mediaId` | Ubah `alt`, `sortOrder`, `isCover` |
| DELETE | `/admin/designs/:id/media/:mediaId` | Hapus media (objek R2 ikut dihapus) |
| POST | `/admin/designs/:id/media/reorder` | Atur ulang urutan sekaligus |

**Validasi publish:** minimal 1 media `IMAGE`, `description` ≥ 50 karakter, `seoTitle`/`seoDescription` terisi atau dapat diturunkan otomatis, `slug` unik.

### 5.3 Konten

| Metode | Path | Fungsi |
|--------|------|--------|
| GET/POST | `/admin/articles` | Daftar / buat |
| GET/PATCH/DELETE | `/admin/articles/:id` | Detail / ubah / arsipkan |
| POST | `/admin/articles/:id/publish` | Publish |
| GET/POST | `/admin/faqs` | Daftar / buat |
| PATCH/DELETE | `/admin/faqs/:id` | Ubah / hapus |
| GET/POST | `/admin/testimonials` | Daftar / buat |
| PATCH/DELETE | `/admin/testimonials/:id` | Ubah / hapus |
| GET | `/admin/settings` | Semua setting |
| PATCH | `/admin/settings` | Ubah sebagian (`{ key: value }`) |
| POST | `/admin/settings/assets/presign` | URL unggah logo/favicon/dokumen legal |

**`POST /admin/settings/assets/presign`** menerima `{ purpose, fileName, mimeType, sizeBytes }` dengan `purpose` ∈ `BRAND_LOGO` | `BRAND_FAVICON` | `LEGAL_DOCUMENT`. MIME: gambar untuk brand, `application/pdf` untuk dokumen legal. Setelah unggah, URL disimpan melalui `PATCH /admin/settings` pada kunci `brand` atau `legal`.

### 5.4 Proyek

| Metode | Path | Fungsi |
|--------|------|--------|
| GET | `/admin/projects` | Daftar semua status |
| POST | `/admin/projects` | Buat draft |
| GET/PATCH/DELETE | `/admin/projects/:id` | Detail / ubah / arsipkan |
| POST | `/admin/projects/:id/publish` | Publish (wajib `coverImageUrl`) |
| POST | `/admin/projects/:id/unpublish` | Tarik dari publik |
| POST | `/admin/projects/:id/media/presign` | Unggah cover/galeri |

Aturan: `galleryUrls` maks 10; `sortOrder` menentukan urutan tampil; proyek `deletedAt` tidak pernah tampil.

### 5.5 Pengguna, statistik, audit

| Metode | Path | Fungsi | Peran |
|--------|------|--------|-------|
| GET | `/admin/users` | Daftar pengguna **internal** (`role` ≠ customer) | admin |
| GET | `/admin/customers` | Daftar akun customer (baca saja) | super_admin |
| POST | `/admin/users` | Buat pengguna internal | super_admin |
| PATCH | `/admin/users/:id/role` | Ubah peran (`admin`/`super_admin`) | super_admin |
| POST | `/admin/users/:id/disable` | Nonaktifkan | super_admin |
| GET | `/admin/account-deletion-requests` | Daftar permohonan hapus akun (default `PENDING`, urut terbaru) | admin |
| PATCH | `/admin/account-deletion-requests/:id` | Tandai `COMPLETED`/`REJECTED` + catatan internal; tercatat di audit | admin |
| GET | `/admin/stats/overview` | Kartu ringkasan | admin |
| GET | `/admin/stats/leads-timeseries` | Tren harian 30/90 hari | admin |
| GET | `/admin/stats/funnel` | Konversi per tahap | admin |
| GET | `/admin/audit-logs` | Riwayat aksi | admin |

**`GET /admin/stats/overview`:**

```json
{
  "data": {
    "newToday": 6,
    "notContacted": 11,
    "staleOver24h": 3,
    "byType": { "BUY_DESIGN": 24, "LAND_OFFER": 9, "INVEST": 5, "GENERAL": 2 },
    "byStatus": { "NEW": 11, "CONTACTED": 12, "QUALIFIED": 8, "PROPOSAL": 3, "NEGOTIATION": 2, "WON": 3, "LOST": 1, "SPAM": 0 },
    "medianFirstResponseMinutes": 74
  }
}
```

**`GET /admin/stats/leads-timeseries?days=30&groupBy=type`:**

```json
{
  "data": [
    { "date": "2026-10-01", "BUY_DESIGN": 3, "LAND_OFFER": 1, "INVEST": 0, "GENERAL": 0 }
  ]
}
```

## 6. Rate limit

| Endpoint | Batas | Kunci |
|----------|-------|-------|
| `POST /public/leads` | 5/jam | IP |
| `POST /public/leads` | 3/jam | `phoneNormalized` |
| `POST /public/uploads/presign` | 20/jam | IP |
| `POST /public/events` | 120/menit | IP |
| `GET /public/*` | 300/menit | IP |
| `POST /auth/sign-up/*` | 3/jam | IP |
| `POST /auth/sign-in/*` | 5/menit | IP + email |
| `POST /auth/forget-password` | 3/jam | IP + email |
| `POST /auth/send-verification-email` | 3/jam | IP + email |
| `/me/*` | 120/menit | `userId` |
| `POST /me/deletion-request` | 3/jam | `userId` |
| `/admin/*` | 600/menit | `userId` |

Implementasi MVP: `@elysiajs/rate-limit` dengan penyimpanan in-memory per instance. **Bila API dijalankan lebih dari satu replika**, pindahkan penyimpanan ke Redis agar batas tetap akurat (lihat [11 §9](./11-deployment-operations.md#9-rencana-skalabilitas)).

## 7. Error & penanganan di klien

| Kode | Perilaku UI |
|------|-------------|
| `VALIDATION_ERROR` | Tampilkan pesan per field; fokus ke field pertama yang salah |
| `INVALID_CAPTCHA` | Tampilkan ulang Turnstile + pesan "verifikasi gagal, coba lagi" |
| `RATE_LIMITED` | Pesan "terlalu banyak percobaan", tampilkan sisa waktu dari `Retry-After` |
| `DUPLICATE_RESOURCE` | Pada slug desain/artikel: sarankan slug alternatif; pada email: arahkan ke login |
| `EMAIL_NOT_VERIFIED` | Tampilkan banner "verifikasi email" + tombol kirim ulang |
| `DUPLICATE_REQUEST` | Tampilkan permohonan yang sudah ada beserta statusnya |
| `NOT_FOUND` | Halaman 404 kustom |
| `INTERNAL_ERROR` | Pesan umum + `requestId` untuk dilaporkan |

Klien **tidak** melakukan retry otomatis pada POST lead (kecuali timeout jaringan dengan `Idempotency-Key` yang sama).

## 8. Notifikasi

Setelah lead tersimpan (bukan `SPAM`), API mengirim:

| Kanal | Penerima | Isi | Kegagalan |
|-------|----------|-----|-----------|
| Email | `SALES_NOTIFY_EMAIL` | Ringkasan lead + tautan admin + `requestId` | Retry 3× (1 mnt, 5 mnt, 15 mnt), lalu catat `notify_failed` |

Email juga dipakai untuk: verifikasi akun, reset kata sandi, dan (opsional) pemberitahuan ke pemohon saat `customerNote` diperbarui. Tidak ada WhatsApp gateway di MVP (Q7); tombol WhatsApp tetap tersedia sebagai tautan `wa.me` yang dibuka pengguna.

Kegagalan notifikasi **tidak** menggagalkan respons ke pengunjung. Status pengiriman dicatat di `LeadActivity` bertipe `SYSTEM` agar terlihat di detail lead.

## 9. Klien & kontrak

```ts
// packages/api-client/src/index.ts
import { treaty } from '@elysia/eden';
import type { App } from '../../apps/api/src/index';

export function createClient(baseUrl: string, fetchImpl = fetch) {
  return treaty<App>(baseUrl, { fetcher: fetchImpl, credentials: 'include' });
}
```

Aturan:

- Web dan admin mengimpor tipe `App` dari `apps/api` **hanya sebagai tipe** (`import type`) sehingga tidak ada ketergantungan runtime.
- Semua panggilan API dibungkus helper yang menormalkan error menjadi `ApiClientError { code, message, details, requestId }`.
- Endpoint publik dipanggil dari `+page.server.ts` (server-side) bila memungkinkan agar cache & SEO konsisten.

## 10. Perubahan kontrak

| Jenis perubahan | Kompatibel? | Prosedur |
|-----------------|:-----------:|----------|
| Tambah field opsional pada respons | ✅ | Langsung |
| Tambah field wajib pada request | ❌ | Naikkan versi (`/api/v2`) atau beri default |
| Ubah tipe field | ❌ | Versi baru + migrasi klien |
| Hapus endpoint | ❌ | Deprecation minimal 1 rilis |

Karena hanya ada dua klien internal di monorepo, perubahan besar dapat dilakukan serentak; aturan di atas berlaku bila nanti ada integrasi eksternal.
