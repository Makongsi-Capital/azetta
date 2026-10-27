# Azetta

Monorepo website Azetta: website publik, panel admin, dan API.

Rencana lengkap ada di [docs/](./docs/README.md) — mulai dari [ringkasan eksekutif](./docs/00-ringkasan-eksekutif.md).

## Struktur

```text
apps/
  api/     ElysiaJS (Bun) — satu-satunya pemilik akses database
  web/     SvelteKit publik (azetta.id)
  admin/   SvelteKit panel admin (admin.azetta.id)
packages/
  config/  tsconfig, ESLint, dan Prettier bersama
```

## Prasyarat

- [Bun](https://bun.sh) 1.4+
- Docker + Docker Compose (PostgreSQL & Mailpit lokal)
- Node.js 22+ hanya untuk menjalankan hasil build produksi SvelteKit

## Menyiapkan lingkungan lokal

```bash
cp .env.example .env
docker compose up -d      # PostgreSQL 16 (:5432) + Mailpit (:1025, UI :8025)
bun install
bun run dev               # api :3000, web :5173, admin :5174
```

Pemeriksaan cepat:

```bash
curl http://localhost:3000/health
```

## Perintah

| Perintah                                    | Kegunaan                                          |
| ------------------------------------------- | ------------------------------------------------- |
| `bun run dev`                               | Jalankan api + web + admin bersamaan              |
| `bun run dev:api` / `dev:web` / `dev:admin` | Jalankan satu aplikasi                            |
| `bun run check`                             | Typecheck semua aplikasi (`tsc` + `svelte-check`) |
| `bun run lint` / `lint:fix`                 | ESLint                                            |
| `bun run format` / `format:check`           | Prettier                                          |
| `bun run test`                              | Unit test API (Vitest)                            |
| `bun run test:e2e`                          | E2E web (Playwright)                              |
| `bun run build`                             | Build semua aplikasi                              |

Validasi environment dijalankan saat API boot ([apps/api/src/env.ts](./apps/api/src/env.ts)); API menolak start bila variabel wajib kosong atau URL tidak valid.
