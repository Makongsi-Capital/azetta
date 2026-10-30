# Panduan Kontribusi

Dokumen ini menjelaskan cara menyiapkan lingkungan, konvensi kode, dan alur kontribusi di monorepo Azetta. Rencana produk dan arsitektur ada di [docs/](./docs/README.md).

## Sebelum mulai

- Baca [docs/03 — arsitektur teknis](./docs/03-arsitektur-teknis.md) untuk batas modul, dan [docs/04 — data model](./docs/04-data-model.md) sebelum menyentuh Prisma.
- Perubahan yang mengubah perilaku publik sebaiknya merujuk halaman dokumen yang relevan (mis. `docs/06 §4.1` untuk beranda).
- Untuk pekerjaan UI, halaman [`/theme`](./apps/web/src/routes/theme/+page.svelte) adalah rujukan token dan komponen yang sudah disetujui.

## Prasyarat

- [Bun](https://bun.sh) 1.4+ (versi dikunci di `packageManager`)
- Docker + Docker Compose — PostgreSQL 16, Adminer, dan Mailpit lokal
- Node.js 22+ hanya untuk menjalankan hasil build SvelteKit

## Menyiapkan lingkungan lokal

```bash
cp .env.example .env
docker compose -f db.compose.yaml up -d   # PostgreSQL :5432, Adminer, Mailpit UI :8025
bun install
bun run db:generate                       # generate Prisma Client, tipe JSON, skema TypeBox
bun run db:migrate                        # terapkan migrasi yang ada
bun run dev                               # api :3000, web :5173, admin :5174
```

Pemeriksaan cepat: `curl http://localhost:3000/health`.

Jangan pernah meng-commit `.env`, kredensial, atau isi `packages/db/src/generated/`.

## Perintah

| Perintah                                                         | Kegunaan                                                        |
| ---------------------------------------------------------------- | --------------------------------------------------------------- |
| `bun run dev` / `dev:api` / `dev:web` / `dev:admin`              | Jalankan semua aplikasi atau salah satu                         |
| `bun run check`                                                  | Typecheck (`tsc` + `svelte-check`) untuk paket DB dan semua app |
| `bun run lint` / `lint:fix`                                      | ESLint seluruh repo                                             |
| `bun run format` / `format:check`                                | Prettier seluruh repo                                           |
| `bun run test`                                                   | Unit test API (Vitest)                                          |
| `bun run test:e2e`                                               | E2E web (Playwright)                                            |
| `bun run db:generate` / `db:migrate` / `db:deploy` / `db:studio` | Alur Prisma                                                     |
| `bun run build`                                                  | Build semua aplikasi                                            |

Hook `pre-commit` (Husky) menjalankan `lint-staged`: ESLint `--fix` + Prettier untuk `.ts/.js/.svelte`, Prettier untuk `.json/.md/.css/.yml`.

## Struktur dan batas dependensi

```text
apps/api     ElysiaJS (Bun) — satu-satunya pemilik akses database
apps/web     SvelteKit publik
apps/admin   SvelteKit panel admin
packages/db  schema, migrasi, Prisma Client
packages/config  tsconfig, ESLint, Prettier bersama
```

| Paket                    | Boleh bergantung pada                         | Tidak boleh                    |
| ------------------------ | --------------------------------------------- | ------------------------------ |
| `apps/web`, `apps/admin` | `config`, tipe dari `db` (`import type` saja) | akses runtime `db`, `apps/api` |
| `apps/api`               | `db`, `config`                                | `ui`, `apps/web`, `apps/admin` |
| `packages/db`            | `config`                                      | apa pun di `apps/`             |

Aturan ini dijaga ESLint (`no-restricted-imports`). Impor runtime Prisma dari frontend akan ditolak; hanya `import type` yang diizinkan.

## Konvensi kode

- **TypeScript ketat** dan **Svelte 5 runes** (`$state`, `$derived`, `$props`, `{@render}`). Jangan memakai sintaks store lama untuk komponen baru.
- **Format** mengikuti [prettier.config.js](./prettier.config.js): tab, kutip tunggal, lebar 100, tanpa trailing comma.
- **Log**: `console.log` dilarang ESLint; gunakan `console.info/warn/error` bila benar-benar perlu.
- **Komentar** hanya untuk hal yang tidak terbaca dari kode (alasan keputusan, jebakan, aturan brand). Jangan menjelaskan hal yang sudah jelas.
- **Gaya visual** memakai Tailwind 4 + daisyUI dengan tema `azetta` di [apps/web/src/routes/layout.css](./apps/web/src/routes/layout.css): palet monokrom, token `brand-*`, tanpa shadow/gradasi. Warna status hanya untuk umpan balik sistem dan wajib disertai label teks.
- **Ikon** memakai kelas literal `icon-[mdi--nama-ikon]`. Nama ikon harus ditulis langsung di markup/string literal agar terdeteksi Tailwind — kelas yang dirakit saat runtime tidak akan ter-generate.
- **Navigasi internal**: aturan `svelte/no-navigation-without-resolve` aktif. Selama rute tujuan belum dibangun, tambahkan `/* eslint-disable svelte/no-navigation-without-resolve */` di blok `<script>` beserta alasan singkat.
- **Data contoh** untuk tampilan publik berada di `apps/web/src/lib/mock/`. Jangan menambah dependensi hanya untuk data mockup; ganti dengan panggilan API saat integrasi.

## Basis data

1. Ubah [packages/db/prisma/schema.prisma](./packages/db/prisma/schema.prisma).
2. `bun run db:migrate` dan beri nama migrasi yang deskriptif.
3. `bun run db:generate` untuk memperbarui client, tipe JSON, dan skema TypeBox.
4. Jangan mengedit isi `packages/db/src/generated/` — folder itu dihasilkan dan di-gitignore.

Karena `allowAny = false`, setiap field `Json` wajib diberi anotasi `/// [Tipe]` dan tipe-nya dideklarasikan di [packages/db/src/json-types.ts](./packages/db/src/json-types.ts).

## Tes

- **API**: `bun run test` (Vitest, `apps/api/test`).
- **Web E2E**: `bun run test:e2e`. Sekali saja per mesin: `bunx playwright install chromium`.
- Berkas tes E2E dinamai `*.e2e.ts` dan diletakkan di `apps/web/src/routes/`.
- Tes harus deterministik: periksa struktur DOM dan teks, jangan bergantung pada gambar eksternal atau waktu render.
- Setiap perbaikan bug sebaiknya menyertakan tes yang gagal sebelum perbaikan.

## Alur kontribusi

1. Buat branch dari `main`: `feat/…`, `fix/…`, `docs/…`, atau `chore/…`.
2. Jaga commit tetap kecil dan atomik — satu niat per commit. Pisahkan perubahan mekanis (format, rename) dari perubahan perilaku.
3. Pesan commit singkat dalam bahasa Indonesia, mengikuti riwayat repo: `tambah …`, `perbaiki …`, `perbarui …`. Rujuk dokumen terkait bila relevan.
4. Pastikan hook `pre-commit` lolos; jangan melewatinya dengan `--no-verify`.
5. Buka pull request dengan ringkasan, langkah verifikasi, dan tangkapan layar untuk perubahan UI.

## Daftar periksa sebelum PR

- [ ] `bun run check` lolos
- [ ] `bun run lint` dan `bun run format:check` lolos
- [ ] `bun run test` dan `bun run test:e2e` lolos
- [ ] Tidak ada `console.log`, kredensial, atau `.env` yang ikut ter-commit
- [ ] Batas dependensi paket tidak dilanggar
- [ ] Dokumentasi diperbarui bila mengubah kontrak API, model data, atau batas modul

## Pertanyaan

Buka issue atau diskusi di [GitHub Makongsi-Capital/azetta](https://github.com/Makongsi-Capital/azetta). Untuk hal sensitif, hubungi azettaidofficial@gmail.com.
