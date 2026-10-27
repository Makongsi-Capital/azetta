# 03 — Arsitektur Teknis

> Kembali ke [index](./README.md) · Sebelumnya: [02](./02-model-bisnis-funnel.md) · Berikutnya: [04](./04-data-model.md)

---

## 1. Prinsip

1. **Satu sumber kebenaran data** — hanya API yang menyentuh database. Frontend tidak pernah memakai Prisma langsung.
2. **Type-safety end-to-end** — kontrak didefinisikan sekali di `packages/contracts`, dipakai API dan frontend.
3. **Server-rendered by default untuk halaman publik** — SEO adalah kanal utama, jadi HTML harus lengkap tanpa JavaScript.
4. **Admin terisolasi** — aplikasi terpisah, origin terpisah, guard di server; tidak ada bundel admin yang dikirim ke pengunjung.
5. **Stateless & horizontal-ready** — sesi di database, tidak ada state di memori proses; bisa di-scale dengan menambah replika.
6. **Kegagalan yang terlihat** — semua error punya kode, request ID, dan tercatat; notifikasi yang gagal tidak menggagalkan penyimpanan data.

## 2. Diagram container

```text
                         ┌───────────────────────────────┐
   Pengunjung  ────────► │ Cloudflare (CDN, WAF, DNS)    │
                         └───────────────┬───────────────┘
                                         │
                    ┌────────────────────┴─────────────────────┐
                    │                                          │
        ┌───────────▼────────────┐               ┌─────────────▼────────────┐
        │ apps/web (SvelteKit)   │               │ apps/admin (SvelteKit)   │
        │ SSR Node, azetta.id    │               │ SSR Node, admin.azetta.id│
        │ - katalog, artikel     │               │ - CRM, CMS               │
        │ - form lead            │               │ - guard sesi + peran     │
        └───────────┬────────────┘               └─────────────┬────────────┘
                    │  fetch JSON (Eden Treaty / fetch)        │
                    └────────────────┬─────────────────────────┘
                                     │  HTTPS, cookie sesi
                        ┌────────────▼─────────────┐
                        │ apps/api (ElysiaJS/Bun)  │
                        │ - REST /api/v1           │
                        │ - Better Auth /api/auth  │
                        │ - validasi TypeBox       │
                        │ - rate limit, Turnstile  │
                        └───┬───────────┬──────────┘
                            │           │
              ┌─────────────▼──┐   ┌────▼─────────────────┐
              │ PostgreSQL     │   │ Object storage (R2/S3)│
              │ (Prisma)       │   │ media desain, lampiran│
              └────────────────┘   └──────────────────────┘
                            │
              ┌─────────────▼──────────────────────────┐
              │ Layanan pendukung                      │
              │ · Email transaksional (notifikasi lead)│
              │ · Sentry (error), Umami/GA4 (analitik) │
              │ · Uptime monitor                       │
              └────────────────────────────────────────┘
```

## 3. Struktur monorepo

```text
azetta/
├─ apps/
│  ├─ api/                     # ElysiaJS — satu-satunya pemilik akses DB
│  │  ├─ src/
│  │  │  ├─ index.ts           # bootstrap server
│  │  │  ├─ env.ts             # validasi env (TypeBox)
│  │  │  ├─ lib/
│  │  │  │  ├─ auth.ts         # instance Better Auth
│  │  │  │  ├─ prisma.ts       # PrismaClient singleton
│  │  │  │  ├─ storage.ts      # presigned URL R2/S3
│  │  │  │  ├─ mailer.ts       # notifikasi email
│  │  │  │  ├─ turnstile.ts    # verifikasi CAPTCHA
│  │  │  │  └─ logger.ts       # pino
│  │  │  ├─ plugins/
│  │  │  │  ├─ auth-guard.ts   # derive user + requireRole
│  │  │  │  ├─ request-id.ts
│  │  │  │  ├─ rate-limit.ts
│  │  │  │  └─ error-handler.ts
│  │  │  ├─ modules/
│  │  │  │  ├─ public/         # designs, projects, articles, site, leads
│  │  │  │  ├─ account/        # profil, pengajuan milik user
│  │  │  │  ├─ admin/          # leads, designs, projects, articles, users, stats, settings
│  │  │  │  └─ uploads/
│  │  │  └─ jobs/              # cron: retensi data, pembersihan spam
│  │  ├─ test/
│  │  └─ package.json
│  ├─ web/                     # SvelteKit publik
│  │  ├─ src/
│  │  │  ├─ lib/
│  │  │  │  ├─ api.ts          # klien API (server + browser)
│  │  │  │  ├─ components/     # komponen khas web
│  │  │  │  └─ stores/         # state form, filter
│  │  │  ├─ routes/
│  │  │  │  ├─ +layout.svelte / +layout.server.ts
│  │  │  │  ├─ +page.svelte              # beranda
│  │  │  │  ├─ desain/+page.svelte
│  │  │  │  ├─ desain/[slug]/+page.svelte
│  │  │  │  ├─ kerjasama-lahan/+page.svelte
│  │  │  │  ├─ investasi/+page.svelte
│  │  │  │  ├─ proyek/+page.svelte
│  │  │  │  ├─ proyek/[slug]/+page.svelte
│  │  │  │  ├─ artikel/+page.svelte
│  │  │  │  ├─ artikel/[slug]/+page.svelte
│  │  │  │  ├─ masuk/, daftar/, lupa-sandi/, reset-sandi/, verifikasi-email/
│  │  │  │  ├─ akun/                     # layout ber-guard sesi
│  │  │  │  │  ├─ +layout.server.ts      # redirect bila belum login
│  │  │  │  │  ├─ +page.svelte           # ringkasan & daftar pengajuan
│  │  │  │  │  ├─ pengajuan/[id]/+page.svelte
│  │  │  │  │  └─ profil/+page.svelte
│  │  │  │  ├─ tentang/, kontak/, faq/
│  │  │  │  ├─ terima-kasih/[type]/+page.svelte
│  │  │  │  ├─ kebijakan-privasi/, syarat-ketentuan/
│  │  │  │  ├─ sitemap.xml/+server.ts
│  │  │  │  └─ robots.txt/+server.ts
│  │  │  └─ app.html / app.css
│  │  └─ package.json
│  └─ admin/                   # SvelteKit admin
│     ├─ src/
│     │  ├─ hooks.server.ts    # guard sesi + peran di setiap request
│     │  ├─ lib/
│     │  │  ├─ api.server.ts   # fetch dengan cookie forwarding
│     │  │  └─ components/
│     │  └─ routes/
│     │     ├─ login/
│     │     ├─ (app)/+layout.server.ts   # guard
│     │     ├─ (app)/dashboard/
│     │     ├─ (app)/leads/
│     │     ├─ (app)/desain/
│     │     ├─ (app)/proyek/
│     │     ├─ (app)/artikel/
│     │     ├─ (app)/pengguna/
│     │     └─ (app)/pengaturan/
│     └─ package.json
├─ packages/
│  ├─ db/                      # schema.prisma, migrasi, seed, Prisma client
│  ├─ contracts/               # TypeBox: skema request/response + enum
│  ├─ api-client/              # Eden Treaty + wrapper error
│  ├─ ui/                      # komponen Svelte bersama + preset daisyUI
│  ├─ seo/                     # helper meta tag & JSON-LD
│  └─ config/                  # tsconfig, eslint, prettier, tailwind preset
├─ docker/                     # Dockerfile api/web/admin, compose dev
├─ .github/workflows/          # ci.yml, deploy.yml
├─ bunfig.toml
├─ package.json                # workspaces
└─ .env.example
```

### Aturan dependensi

| Paket | Boleh bergantung pada | Tidak boleh |
|-------|----------------------|-------------|
| `apps/web` | `contracts`, `api-client`, `ui`, `seo`, tipe dari `db` | `db` (runtime), `apps/api` |
| `apps/admin` | `contracts`, `api-client`, `ui`, tipe dari `db` | `db` (runtime), `apps/api` |
| `apps/api` | `contracts`, `db`, `config` | `ui`, `apps/web` |
| `packages/db` | `config` | apa pun di `apps/` |
| `packages/ui` | `config` | `db`, `api` |

Aturan ini dijaga dengan `eslint-plugin-import` (`no-restricted-imports`) agar tidak dilanggar tanpa sengaja.

Pengecualian: `apps/web` dan `apps/admin` boleh mengimpor **tipe** model Prisma dari `@azetta/db` memakai `import type` (mis. `import type { Design } from '@azetta/db'`). Impor runtime tetap dilarang karena hanya API yang boleh mengakses database; aturan ESLint membedakan keduanya lewat `allowTypeImports`.

### Perintah kerja

```bash
bun install
bun run dev            # menjalankan api + web + admin bersamaan
bun run dev:api        # http://localhost:3000
bun run dev:web        # http://localhost:5173
bun run dev:admin      # http://localhost:5174
bun run db:migrate     # prisma migrate dev
bun run db:seed
bun run check          # tsc + svelte-check
bun run test           # vitest (unit + integrasi)
bun run test:e2e       # playwright
bun run build
```

## 4. Stack dan alasan

| Lapisan | Pilihan | Alasan | Alternatif yang ditolak |
|---------|---------|--------|-------------------------|
| Runtime API | Bun | Elysia dioptimalkan untuk Bun; startup & throughput baik; satu toolchain dengan workspace | Node + Fastify (lebih umum, tapi kehilangan keunggulan Elysia) |
| Framework API | ElysiaJS | Validasi TypeBox terintegrasi, plugin ringkas, Eden Treaty untuk tipe klien | Hono (bagus, tapi dipilih Elysia sesuai arahan) |
| Auth | Better Auth | Sesi di DB, plugin admin, adapter Prisma, dukungan TypeScript penuh | Auth.js (lebih terikat Next), implementasi sendiri (rawan celah) |
| ORM | Prisma | Skema deklaratif, migrasi jelas, tipe kuat | Drizzle (lebih ringan, tapi ekosistem migrasi kurang terintegrasi) |
| DB | PostgreSQL 16 | Transaksi, tipe JSONB, full-text, andal | MySQL (tidak dipilih: butuh JSONB & FTS) |
| Web publik | SvelteKit 3 + `adapter-node` | SSR, routing berbasis file, form actions, ukuran bundel kecil | Next.js (lebih berat, ekosistem besar) |
| Admin | SvelteKit 3 (app terpisah) | Isolasi origin & bundel, guard di server | Route group `/(admin)` di app yang sama (risiko bocor bundel & konfigurasi) |
| CSS | Tailwind CSS 4 + daisyUI 5 | Komponen siap pakai, tema mudah diubah | CSS-in-JS, Bootstrap |
| Ikon | Iconify (`@iconify/svelte`) | Ikon on-demand, tidak menambah banyak bobot | Font icon |
| Kontrak | TypeBox | Dipakai native Elysia; bisa dipakai validasi klien | Zod (butuh lapisan konversi ekstra di Elysia) |
| Editor konten | Markdown (textarea + preview) | Sederhana, aman, mudah direview | WYSIWYG berat (fase 2) |
| Media | Cloudflare R2 + URL presigned | Murah, egress gratis, kompatibel S3 | Simpan di disk VPS (tidak skalabel) |
| Antrian/job | `setInterval` in-process + endpoint cron | Tidak butuh infrastruktur tambahan di MVP | Redis/BullMQ (ditunda) |

## 5. Alur permintaan

### 5.1 Halaman publik (SSR)

```text
Browser → GET /desain/rumah-minimalis-2-lantai
        → Cloudflare (cache hit? → sajikan)
        → SvelteKit +page.server.ts
             └─ fetch API /api/v1/public/designs/rumah-minimalis-2-lantai
                    └─ Elysia → Prisma → PostgreSQL
        → render HTML lengkap + data untuk hidrasi
        → Response dengan Cache-Control publik
```

Aturan:

- Semua pemanggilan API dari `+page.server.ts` memakai `fetch` bawaan SvelteKit agar bisa diinstrumentasi.
- Endpoint API yang dipanggil server harus publik dan tidak memerlukan cookie (halaman publik tidak punya sesi).
- Data yang sensitif tidak pernah dikirim ke browser pada halaman publik.

### 5.2 Form lead (progressive enhancement)

```text
Browser
  ├─ validasi klien (skema dari packages/contracts)
  ├─ Turnstile token
  └─ POST /api/v1/public/leads (JSON atau multipart untuk foto lahan)
        ├─ rate limit (IP + nomor)
        ├─ verifikasi Turnstile
        ├─ cek honeypot & waktu isi
        ├─ validasi TypeBox
        ├─ normalisasi nomor telepon
        ├─ simpan Lead (+ LandSubmission / InvestmentInterest)
        ├─ simpan lampiran (presigned → metadata)
        └─ enqueue notifikasi (tidak menunggu)
              → 201 { data: { reference, ... } }
```

Form tetap berfungsi tanpa JavaScript? Untuk MVP tidak wajib, tetapi gunakan `<form>` native + `use:enhance` agar ada fallback progresif. Bila JavaScript mati, submit tetap bekerja melalui action server SvelteKit yang meneruskan ke API.

### 5.3 Panel admin

```text
Browser admin → GET /leads
  → hooks.server.ts: baca cookie sesi, panggil /api/auth/get-session
      ├─ tidak ada sesi → 302 /login
      └─ ada sesi tapi role bukan admin → 403
  → +page.server.ts → API /api/v1/admin/leads (dengan cookie diteruskan)
  → render tabel
```

Semua mutasi melewati API. SvelteKit **tidak** menulis ke DB.

## 6. Autentikasi & otorisasi

### 6.1 Konfigurasi Better Auth

| Aspek | Keputusan |
|-------|-----------|
| Metode | Email + password untuk semua pengguna; Google OAuth ditunda ke fase 2 |
| Registrasi | Terbuka untuk publik (`/daftar`), selalu menghasilkan peran `customer`; Turnstile + rate limit |
| Verifikasi email | **Wajib** sebelum akun dapat melihat pengajuan; tautan berlaku 24 jam |
| Reset kata sandi | Via email, token sekali pakai berlaku 1 jam |
| Base path | `/api/auth` |
| Tabel | `user`, `session`, `account`, `verification` (skema di [04](./04-data-model.md)) |
| Adapter | `@better-auth/prisma-adapter` |
| Plugin | `admin` (role, ban, impersonate) |
| Cookie | `httpOnly`, `secure` (produksi), `sameSite=lax`, domain `.azetta.id` (produksi) |
| Masa sesi | Admin 7 hari; customer 30 hari; perpanjangan otomatis saat aktif |
| Peran | `customer` (default), `admin`, `super_admin` |
| Peran admin | `admin`, `super_admin` (dikonfigurasi di `adminRoles`) |
| Pembuatan akun internal | Hanya `super_admin`; tidak ada endpoint publik yang dapat memberi peran internal |

> Peran `investor`/`landowner` tidak dipakai: identitas kepentingan pengguna ditentukan dari **tipe pengajuan**, bukan dari peran akun. Ini menghindari pengguna yang tertarik pada dua aliran sekaligus harus punya dua akun.

### 6.2 Alur sesi lintas aplikasi

```text
admin.azetta.id                api.azetta.id
     │  POST /api/auth/sign-in/email
     │──────────────────────────────►│  Set-Cookie: azetta.session_token
     │◄──────────────────────────────│  (Domain=.azetta.id, HttpOnly, Secure)
     │
     │  GET /api/auth/get-session (credentials: include)
     │──────────────────────────────►│  validasi token di DB
     │◄──────────────────────────────│  { user: { id, role, ... } }
```

Karena `admin.azetta.id` dan `api.azetta.id` berada pada registri domain yang sama, cookie `lax` cukup dan tidak perlu CORS longgar. CORS tetap dibatasi ke origin yang dikenal:

```ts
// apps/api/src/index.ts (ringkas)
const ALLOWED = [env.WEB_ORIGIN, env.ADMIN_ORIGIN];

new Elysia()
  .use(cors({ origin: ALLOWED, credentials: true }))
  .use(authGuard)               // derive { user, session }
  .use(rateLimit)
  .use(errorHandler)
  .use(openapi({ path: '/docs' }))
  .group('/api/v1', app => app.use(publicRoutes).use(adminRoutes))
  .mount(auth.handler)          // /api/auth/*
  .listen(3000);
```

### 6.3 Guard

```ts
// apps/api/src/plugins/auth-guard.ts
export const authGuard = new Elysia({ name: 'auth' })
  .derive(async ({ request }) => {
    const session = await auth.api.getSession({ headers: request.headers });
    return { user: session?.user ?? null, session: session?.session ?? null };
  });

export const requireAdmin = new Elysia({ name: 'require-admin' })
  .use(authGuard)
  .onBeforeHandle(({ user, set }) => {
    if (!user) { set.status = 401; throw new ApiError('AUTH_REQUIRED'); }
    if (!['admin', 'super_admin'].includes(user.role)) {
      set.status = 403; throw new ApiError('FORBIDDEN');
    }
  });

export const requireUser = new Elysia({ name: 'require-user' })
  .use(authGuard)
  .onBeforeHandle(({ user, set }) => {
    if (!user) { set.status = 401; throw new ApiError('AUTH_REQUIRED'); }
    if (!user.emailVerified) { set.status = 403; throw new ApiError('EMAIL_NOT_VERIFIED'); }
  });
```

Aturan tambahan:

- Guard diterapkan pada **setiap** route admin (defense in depth), bukan hanya pada grup.
- Endpoint yang mengubah peran pengguna hanya untuk `super_admin`.
- Percobaan login dibatasi 5/menit per IP + email; registrasi 3/jam per IP.
- Tidak ada endpoint publik yang mengembalikan daftar pengguna atau data pribadi lead.
- Route `/api/v1/me/*` memakai `requireUser` **dan** selalu memfilter `userId = user.id`; tidak ada endpoint `GET /leads/:id` untuk customer.
- Satu cookie sesi dipakai bersama web & admin (domain `.azetta.id`). Pemisahan wewenang dilakukan lewat peran di server, bukan lewat domain. Akun `customer` yang cookie-nya terbaca tidak dapat memanggil endpoint admin (403) — diuji di [09](./09-qa-test-plan.md#5-matriks-uji-fungsional).
- Halaman `/akun` di web dijaga di `+layout.server.ts` (redirect ke `/masuk?next=…`) **dan** datanya hanya diambil dari `/api/v1/me/*`.

## 7. Rendering & caching

| Halaman | Strategi | Cache |
|---------|----------|-------|
| Beranda | SSR | CDN 60 s, purge saat konten berubah |
| Katalog (`/desain`) | SSR, filter via query | CDN 60 s (`s-maxage=60, stale-while-revalidate=300`) |
| Detail desain | SSR | CDN 300 s, purge per URL saat publish |
| Proyek (`/proyek`, detail) | SSR | CDN 300 s, purge per URL saat publish |
| Artikel | SSR | CDN 300 s, purge per URL |
| Tentang/Kontak/FAQ | SSR | CDN 600 s |
| Kebijakan/Syarat | Prerender saat build | immutable sampai deploy |
| Terima kasih | SSR, `noindex` | no-store |
| Masuk/Daftar/Lupa sandi | SSR, `noindex` | no-store |
| Akun (`/akun/*`) | SSR guard + data per pengguna, `noindex` | no-store |
| Admin | SSR guard + CSR tabel | no-store |

Invalidasi: saat admin mem-publish desain/artikel, API memanggil endpoint purge Cloudflare (`POST /purge_cache` dengan `files` atau `tags`) melalui job. Bila purge gagal, TTL pendek tetap menjamin konten baru tampil ≤ 5 menit. Detail: [11 §6](./11-deployment-operations.md#6-cache--invalidasi).

Aturan tambahan:

- `+page.server.ts` mengatur `setHeaders({ 'cache-control': ... })`.
- Halaman dengan query filter tidak boleh di-cache tanpa memperhitungkan query string (Cloudflare memperhitungkan query secara default).
- Jangan pernah meng-cache respons yang mengandung cookie pengguna.

## 8. Media & penyimpanan

| Aspek | Keputusan |
|-------|-----------|
| Penyimpanan | Cloudflare R2 (bucket privat) |
| Bucket produksi | `azetta-prod-media` dengan custom domain `media.azetta.id` |
| Media publik desain | Disajikan lewat CDN dengan URL stabil; objek tidak dapat didaftar publik |
| Lampiran lead (foto lahan) | Bucket privat; akses hanya via URL presigned 15 menit |
| Unggah admin | Presigned `PUT`, maks 10 MB, MIME diizinkan: JPEG/PNG/WebP |
| Unggah publik | Presigned `PUT` dengan content-type & size dibatasi, dipakai sekali, kedaluwarsa 10 menit |
| Nama objek | `designs/{designId}/{nanoid}.webp`, `leads/{leadId}/{nanoid}.jpg` |
| Optimasi | Varian 400/800/1600 px dibuat saat upload (sharp) atau on-the-fly Image Resizing Cloudflare |
| Pembersihan | Objek tanpa referensi dihapus oleh job mingguan (orphan sweep) |

## 9. Kontrak & validasi

`packages/contracts` adalah satu-satunya tempat skema didefinisikan:

```ts
// packages/contracts/src/lead.ts
import { Type as t } from '@sinclair/typebox';
import { PHONE_PATTERN } from './common';

export const LandSubmissionSchema = t.Object({
  address: t.String({ minLength: 10, maxLength: 300 }),
  province: t.String({ minLength: 1 }),
  city: t.String({ minLength: 1 }),
  areaM2: t.Number({ minimum: 50, maximum: 1_000_000 }),
  ownershipStatus: t.Union([
    t.Literal('SHM'), t.Literal('SHGB'), t.Literal('AJB'),
    t.Literal('GIRIK'), t.Literal('LETTER_C'), t.Literal('OTHER'),
  ]),
  expectedScheme: t.Union([
    t.Literal('BAGI_HASIL'), t.Literal('SEWA'),
    t.Literal('JUAL'), t.Literal('BELUM_TAHU'),
  ]),
  notes: t.Optional(t.String({ maxLength: 1000 })),
  attachmentKeys: t.Optional(t.Array(t.String(), { maxItems: 5 })),
});

export const CreateLandLeadSchema = t.Object({
  type: t.Literal('LAND_OFFER'),
  name: t.String({ minLength: 2, maxLength: 80 }),
  phone: t.String({ pattern: PHONE_PATTERN }),
  email: t.Optional(t.String({ format: 'email', maxLength: 160 })),
  city: t.Optional(t.String({ maxLength: 80 })),
  message: t.Optional(t.String({ maxLength: 1000 })),
  consent: t.Literal(true),
  turnstileToken: t.String(),
  honeypot: t.Optional(t.String({ maxLength: 0 })),
  utm: t.Optional(t.Object({
    source: t.Optional(t.String({ maxLength: 100 })),
    medium: t.Optional(t.String({ maxLength: 100 })),
    campaign: t.Optional(t.String({ maxLength: 100 })),
    content: t.Optional(t.String({ maxLength: 100 })),
    term: t.Optional(t.String({ maxLength: 100 })),
  })),
  land: LandSubmissionSchema,
});
```

Aturan:

- Perubahan kontrak wajib lewat PR yang memperbarui API + frontend bersamaan (monorepo memudahkan).
- API memvalidasi ulang semua input; validasi klien hanya untuk UX.
- Tipe respons didefinisikan eksplisit; tidak ada `any` di `packages/contracts`.
- Skema yang dipakai form publik diekspor sebagai `FormSchema` terpisah (tanpa `turnstileToken`) agar bisa dipakai validasi klien.

## 10. Penanganan error & observabilitas

### 10.1 Format error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Data yang dikirim belum lengkap.",
    "details": [{ "field": "phone", "message": "Nomor WhatsApp tidak valid" }],
    "requestId": "6f1c2a9e-6b1d-4f3a-9a0e-2f0f3c1b7d21"
  }
}
```

`details` **tidak** membocorkan stack trace, query SQL, atau nama tabel. Error 5xx hanya menampilkan pesan generik + `requestId`.

### 10.2 Kode error

| HTTP | Kode | Konteks |
|------|------|---------|
| 400 | `VALIDATION_ERROR` | Input tidak lolos skema |
| 400 | `INVALID_CAPTCHA` | Turnstile gagal |
| 400 | `INVALID_TRANSITION` | Transisi status lead ilegal |
| 401 | `AUTH_REQUIRED` | Belum login |
| 403 | `FORBIDDEN` | Peran tidak cukup |
| 403 | `EMAIL_NOT_VERIFIED` | Akun belum memverifikasi email |
| 404 | `NOT_FOUND` | Entitas tidak ada / tidak publish / bukan milik pengguna |
| 409 | `DUPLICATE_RESOURCE` | Slug atau email sudah dipakai |
| 413 | `PAYLOAD_TOO_LARGE` | Lampiran melebihi batas |
| 415 | `UNSUPPORTED_MEDIA_TYPE` | MIME tidak diizinkan |
| 429 | `RATE_LIMITED` | Melebihi kuota; sertakan `Retry-After` |
| 500 | `INTERNAL_ERROR` | Kesalahan tak terduga (dicatat ke Sentry) |
| 503 | `SERVICE_UNAVAILABLE` | DB/penyimpanan tidak tersedia |

### 10.3 Logging

- `pino` JSON ke stdout; setiap baris memuat `requestId`, `route`, `method`, `status`, `durationMs`, `userId` (bila ada).
- **Tidak boleh dicatat:** kata sandi, token sesi, isi pesan form lengkap, nomor telepon penuh (mask: `+62812****789`).
- Sentry menerima error 5xx dengan `requestId` sebagai tag; frontends mengirim error klien dengan `release` versi.

### 10.4 Job berkala

| Job | Jadwal | Tugas |
|-----|--------|-------|
| `purge-cache` | saat publish | Hapus cache halaman terkait |
| `cleanup-spam` | harian | Hapus lead `SPAM` > 90 hari |
| `retention` | harian | Anonimkan lead `WON`/`LOST` > 24 bulan |
| `orphan-media` | mingguan | Hapus objek tanpa referensi |
| `digest` | harian 08.00 WIB | Ringkasan lead baru ke manajemen |

## 11. Konfigurasi environment

Semua variabel divalidasi saat boot (aplikasi menolak start bila ada yang hilang/salah format). Daftar lengkap: [11 §4](./11-deployment-operations.md#4-konfigurasi-environment).

## 12. Alternatif yang dipertimbangkan

| Keputusan | Alternatif | Alasan tidak dipilih |
|-----------|------------|----------------------|
| Monorepo Bun workspaces | Turborepo + pnpm | Menambah satu lapisan tool tanpa manfaat besar untuk 3 app |
| Admin sebagai app terpisah | Route group di `apps/web` | Bundel admin berisiko terkirim ke publik; origin terpisah memudahkan pembatasan akses (WAF/Cloudflare Access) |
| API terpisah dari SvelteKit | SvelteKit `+server.ts` saja | Diinginkan satu API untuk web, admin, dan integrasi masa depan |
| Auth di SvelteKit | Sesi di API | Dua implementasi sesi = dua sumber bug; satu instance Better Auth lebih sederhana |
| SSR penuh | SPA + API | SEO adalah kanal utama |
| Markdown di DB | Headless CMS eksternal | Biaya & kompleksitas tambahan; tim kecil |

## 13. Batas arsitektur MVP

- Tidak ada message queue; notifikasi dikirim in-process dengan retry 3× lalu dicatat gagal.
- Tidak ada read replica; satu Postgres.
- Tidak ada WebSocket/realtime; dashboard memakai polling/refresh manual.
- Tidak ada multi-tenant; satu organisasi (Azetta).
- Tidak ada API publik berbayar; `/api/v1` hanya untuk aplikasi internal.
- Akun publik bersifat **baca-saja terhadap pengajuannya sendiri**; tidak ada chat, notifikasi realtime, atau unggah dokumen lanjutan di MVP.
- Tidak ada antrian email persisten; email verifikasi/reset dikirim langsung dengan retry terbatas dan kegagalan dicatat.
