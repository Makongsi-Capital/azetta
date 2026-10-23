# 11 — Deployment & Operasional

> Kembali ke [index](./README.md) · Sebelumnya: [10](./10-seo-konten.md) · Berikutnya: [12](./12-risiko-asumsi-keputusan.md)

---

## 1. Environment

| Environment | URL | Tujuan | Data | Akses |
|-------------|-----|--------|------|-------|
| Local | `localhost:5173` / `:5174` / `:3000` | Pengembangan | Seed | Developer |
| Staging | `staging.azetta.id`, `api-staging.azetta.id`, `admin-staging.azetta.id` | QA, UAT, E2E | Seed + sintetis | Tim, dilindungi `noindex` + basic auth |
| Production | `azetta.id`, `www.azetta.id`, `admin.azetta.id`, `api.azetta.id`, `media.azetta.id` | Publik | Nyata | Publik (web) / staf (admin) |

Aturan:

- Staging **wajib** `noindex` (header `X-Robots-Tag` + meta) dan dilindungi login agar tidak bersaing dengan produksi di mesin pencari.
- Kunci rahasia berbeda per environment. Kunci produksi hanya dapat diakses oleh 2 orang.
- Tidak ada data produksi yang disalin ke staging tanpa anonimisasi.

## 2. Topologi produksi

```text
                       Internet
                          │
                  ┌───────▼────────┐
                  │ Cloudflare     │  DNS, CDN, WAF, TLS, Turnstile
                  └───┬────────┬───┘
          ┌───────────▼──┐  ┌──▼─────────────┐
          │ web (Node)   │  │ admin (Node)   │   Docker, 1 VPS
          │ :3001        │  │ :3002          │
          └───────┬──────┘  └───────┬────────┘
                  │                 │
                  └────────┬────────┘
                    ┌──────▼──────┐
                    │ api (Bun)   │  :3000
                    └──┬───────┬──┘
                       │       │
            ┌──────────▼──┐  ┌─▼──────────────┐
            │ PostgreSQL  │  │ Cloudflare R2  │
            │ :5432       │  │ (privat)       │
            └─────────────┘  └────────────────┘

  Reverse proxy: Caddy (TLS otomatis) atau Nginx
  Semua container di jaringan Docker privat; hanya Caddy terekspos.
```

**Ukuran awal yang disarankan:** VPS 4 vCPU / 8 GB RAM / 80 GB NVMe (mis. Hetzner CX32, Biznet Gio, atau setara). Postgres managed direkomendasikan setelah 3 bulan pertama atau saat lead > 200/bulan.

## 3. Alur rilis (CI/CD)

```text
Pull Request
  ├─ install (cache)
  ├─ typecheck (tsc + svelte-check)
  ├─ lint (eslint + prettier check)
  ├─ unit test
  ├─ build semua app
  └─ integration test (Postgres service container)

merge ke main
  ├─ build image Docker (tag: git SHA)
  ├─ push ke registry
  ├─ deploy staging
  ├─ prisma migrate deploy (staging)
  ├─ smoke test staging
  ├─ E2E subset (Playwright)
  └─ [manual approval]
        ├─ backup DB produksi
        ├─ prisma migrate deploy (produksi)
        ├─ rolling restart api → web → admin
        ├─ smoke test produksi
        └─ purge cache
```

Aturan:

- **Migrasi sebelum aplikasi baru** (expand/contract) agar versi lama tetap berjalan saat rollout.
- Rilis hanya dari `main`; branch lain hanya ke staging.
- Setiap rilis diberi tag versi (`v1.2.0`) dan catatan perubahan.
- Rilis dihindari pada Jumat sore dan hari libur nasional.

## 4. Konfigurasi environment

| Variabel | Wajib | Contoh | Keterangan |
|----------|:-----:|--------|------------|
| `NODE_ENV` | ✅ | `production` | — |
| `DATABASE_URL` | ✅ | `postgresql://user:pass@db:5432/azetta` | Termasuk `?schema=public&connection_limit=10` |
| `BETTER_AUTH_SECRET` | ✅ | 32+ byte acak | Rotasi = semua sesi logout |
| `BETTER_AUTH_URL` | ✅ | `https://api.azetta.id` | Basis URL auth |
| `WEB_ORIGIN` | ✅ | `https://azetta.id` | CORS & tautan |
| `ADMIN_ORIGIN` | ✅ | `https://admin.azetta.id` | CORS |
| `COOKIE_DOMAIN` | ✅ | `.azetta.id` | Produksi; kosong saat lokal |
| `IP_HASH_SALT` | ✅ | acak | Untuk `ipHash` |
| `R2_ACCOUNT_ID` | ✅ | — | Cloudflare |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | ✅ | — | Kredensial terbatas pada bucket |
| `R2_BUCKET` | ✅ | `azetta-prod-media` | — |
| `R2_PUBLIC_BASE_URL` | ✅ | `https://media.azetta.id` | Media publik desain |
| `TURNSTILE_SECRET_KEY` | ✅ | — | Verifikasi server |
| `PUBLIC_TURNSTILE_SITE_KEY` | ✅ | — | Klien |
| `RESEND_API_KEY` / `MAIL_FROM` | ✅ | `no-reply@azetta.id` | Notifikasi |
| `SALES_NOTIFY_EMAIL` | ✅ | `sales@azetta.id` | Penerima lead |
| `SENTRY_DSN` | ⚠️ | — | Disarankan |
| `PUBLIC_API_BASE_URL` | ✅ | `https://api.azetta.id` | Dipakai web/admin |
| `CLOUDFLARE_ZONE_ID` / `CLOUDFLARE_PURGE_TOKEN` | ⚠️ | — | Purge cache |
| `WHATSAPP_GATEWAY_URL` / `_TOKEN` | ❌ | — | Opsional |
| `ADMIN_BOOTSTRAP_EMAIL` / `_PASSWORD` | ❌ | — | Hanya untuk inisialisasi awal; hapus setelah dipakai |

Semua divalidasi saat boot (`apps/api/src/env.ts`); aplikasi menolak start bila ada yang hilang. Variabel `PUBLIC_*` untuk SvelteKit diekspos ke klien — **jangan** pernah menaruh rahasia di sana.

## 5. Database: migrasi & backup

### 5.1 Migrasi

| Tahap | Perintah | Catatan |
|-------|----------|---------|
| Lokal | `bun run db:migrate` | `prisma migrate dev` |
| Staging/Produksi | `bunx prisma migrate deploy` | Dijalankan di job deploy, bukan manual |
| Pemeriksaan | `bunx prisma migrate status` | Gagal bila ada drift |
| Percobaan | `bunx prisma migrate diff` | Untuk review perubahan |

Aturan:

- Perubahan destruktif (drop kolom/tabel) memakai pola **expand → migrate → contract** dalam dua rilis.
- Migrasi harus idempoten secara operasional: bila job deploy mengulang, tidak merusak data.
- Migrasi yang memakan waktu > 30 detik dijalankan manual dengan jendela pemeliharaan.

### 5.2 Backup

| Jenis | Frekuensi | Retensi | Lokasi |
|-------|-----------|---------|--------|
| Logical dump (`pg_dump -Fc`) | Harian 02.00 WIB | 30 hari | R2 bucket privat `azetta-backup` |
| Snapshot mingguan | Minggu 03.00 WIB | 3 bulan | Penyedia VPS/DB |
| Backup konfigurasi | Setiap perubahan | — | Repo privat (tanpa secret) |
| Backup media | Replikasi bucket | — | R2 (versioning aktif) |

**RPO ≤ 24 jam, RTO ≤ 4 jam.** Setiap kuartal dilakukan uji restore ke database kosong dan dicatat hasilnya.

## 6. Cache & invalidasi

| Lapisan | Perilaku |
|---------|----------|
| Browser | `Cache-Control: no-store` untuk halaman dengan data pengguna |
| CDN | HTML publik 60–300 s; aset statis 1 tahun (hash di nama file) |
| CDN media | 30 hari, `immutable` |
| API | `no-store` default; endpoint publik memakai `s-maxage` |

Alur invalidasi:

```text
Admin publish desain
   → API memperbarui status di DB
   → job purge memanggil Cloudflare API (URL terkait + /desain + /)
   → bila gagal: dicatat, dicoba ulang 3× (30 s, 2 mnt, 10 mnt)
   → TTL pendek menjamin konten baru muncul ≤ 5 menit
```

Jangan memakai purge "seluruh cache" kecuali darurat — biayanya mahal dan memicu lonjakan beban origin.

## 7. Monitoring & alerting

| Yang dipantau | Alat | Ambang alert |
|---------------|------|--------------|
| Uptime web & api | Uptime monitor eksternal | 2 kegagalan berturut (×1 menit) |
| Error 5xx | Sentry + log | > 5 dalam 5 menit |
| Latensi API p95 | Log/metrics | > 800 ms selama 10 menit |
| Koneksi DB | Health check | > 80% pool terpakai |
| Disk & RAM | Agent VPS | Disk > 80%, RAM > 90% |
| Backup harian | Job monitor | Backup tidak ada > 26 jam |
| Lead tidak tersimpan | Log khusus | 1 pun terjadi → alert segera |
| Email notifikasi gagal | Log | > 3 kegagalan/jam |

Kanal alert: WhatsApp/Slack grup teknis + email. Setiap alert harus punya pemilik dan tindakan; alert yang tidak actionable dihapus.

### 7.1 Health check

`GET /health` (tanpa auth, tidak di-cache):

```json
{
  "status": "ok",
  "version": "v1.0.0",
  "checks": { "database": "ok", "storage": "ok" },
  "uptimeSeconds": 86400
}
```

- `200` bila semua `ok`; `503` bila DB tidak dapat dijangkau.
- Tidak menampilkan nama host, versi DB, atau informasi internal lain.

## 8. Logging

- Format JSON satu baris (pino) ke stdout; dikumpulkan oleh Docker logging driver.
- Field wajib: `time`, `level`, `requestId`, `route`, `method`, `status`, `durationMs`.
- Retensi 30 hari (sesuai kebijakan penyedia).
- **Dilarang** mencatat: kata sandi, token, cookie, isi formulir lengkap, nomor telepon penuh, email penuh. Gunakan masker `+62812****789`.
- Log akses admin (audit) disimpan di DB, bukan hanya file log.

## 9. Rencana skalabilitas

| Pemicu | Tindakan |
|--------|----------|
| CPU > 70% selama 1 jam | Vertical scale VPS (8 vCPU/16 GB) |
| Trafik > 30 rb sesi/bulan | Pisahkan Postgres ke instance sendiri |
| API butuh > 1 replika | Tambahkan load balancer + Redis untuk rate limit & cache sesi |
| Media > 100 GB | Aktifkan Cloudflare Image Resizing; evaluasi biaya |
| Lead > 500/bulan | Tinjau kebutuhan CRM sungguhan (bukan lagi panel internal) |
| Query katalog melambat | Tambah index `pg_trgm`, atau pindahkan pencarian ke Meilisearch |

Prinsip: **jangan menskalakan sebelum ada bukti**. Ukur dulu, optimalkan query/index, baru tambah mesin.

## 10. Runbook

### 10.1 Deploy normal

```bash
# 1. Pastikan CI hijau pada commit yang akan dirilis
git log -1 --format='%H %s'

# 2. (Opsional) backup manual sebelum migrasi besar
pg_dump -Fc "$DATABASE_URL" > backup-$(date +%F-%H%M).dump

# 3. Migrasi
bunx prisma migrate deploy

# 4. Tarik image baru & restart berurutan
docker compose pull
docker compose up -d api && sleep 10 && curl -fsS https://api.azetta.id/health
docker compose up -d web admin

# 5. Smoke test
curl -fsS https://azetta.id/desain > /dev/null
curl -fsS https://admin.azetta.id/login > /dev/null

# 6. Purge cache
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE/purge_cache" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  --data '{"purge_everything":false,"files":["https://azetta.id/"]}'
```

### 10.2 Rollback

```bash
# Rollback aplikasi ke image sebelumnya (tanpa mengubah DB)
docker compose down
TAG=v1.1.3 docker compose up -d
curl -fsS https://api.azetta.id/health
```

Karena migrasi bersifat *expand/contract*, versi lama tetap kompatibel dengan skema baru selama satu rilis. Bila rollback memerlukan pembalikan data, **restore backup** — bukan menjalankan SQL manual.

Waktu target rollback: **≤ 15 menit**.

### 10.3 Restore backup

```bash
# 1. Hentikan penulisan (mode pemeliharaan)
docker compose stop api web admin

# 2. Buat DB baru, restore
createdb azetta_restore
pg_restore -d azetta_restore --clean --if-exists backup-2026-10-20.dump

# 3. Verifikasi jumlah baris tabel kunci
psql -d azetta_restore -c "select count(*) from lead; select count(*) from property_design;"

# 4. Arahkan DATABASE_URL ke DB hasil restore, jalankan API, smoke test
# 5. Catat insiden & penyebab di log insiden
```

### 10.4 Insiden

| Tingkat | Contoh | Respons | Komunikasi |
|---------|--------|---------|------------|
| SEV-1 | Situs mati, data pribadi bocor, lead tidak tersimpan | Semua tangan, mulai < 15 menit | Manajemen segera; publik bila perlu |
| SEV-2 | Fitur utama gagal (form lahan, CRM) | Mulai < 1 jam | Manajemen |
| SEV-3 | Fitur minor/lambat | Hari kerja berikutnya | Internal |
| SEV-4 | Kosmetik | Backlog | — |

Alur: deteksi → tetapkan tingkat → mitigasi (rollback/restore) → perbaiki akar masalah → tulis post-mortem tanpa menyalahkan individu (maks 3 hari kerja) → tindakan pencegahan dengan tenggat.

**Bila terjadi kebocoran data pribadi:** segera isolasi, catat cakupan (data apa, berapa subjek), beri tahu manajemen & pihak legal, ikuti kewajiban notifikasi UU PDP, dan simpan bukti.

## 11. Pemeliharaan rutin

| Frekuensi | Tugas | Pemilik |
|-----------|-------|---------|
| Harian (otomatis) | Backup, job retensi, digest lead | Sistem |
| Mingguan | Tinjau error Sentry, log 5xx, ukuran disk/DB | Developer |
| Mingguan | Perbarui dependensi patch (`bun update --latest` hanya untuk patch) | Developer |
| Bulanan | Uji restore, tinjau akses admin, tinjau rate limit | DevOps |
| Bulanan | Perbarui konten & periksa link rusak | Marketing |
| Kuartalan | Audit keamanan ringan, tinjau biaya infra, uji rollback | Tech lead |
| Tahunan | Rotasi kredensial, tinjau kebijakan privasi | Manajemen + tech lead |

## 12. Serah terima

Dokumen/aset yang wajib diserahkan:

- [ ] Akses repo (GitHub) + branch protection aktif.
- [ ] Kredensial di manajer rahasia (bukan di chat/email).
- [ ] Akses domain, Cloudflare, R2, penyedia VPS, email.
- [ ] Dokumen ini + runbook.
- [ ] Rekaman sesi pelatihan admin (1 jam).
- [ ] Daftar kontak darurat & jalur eskalasi.
- [ ] Catatan utang teknis yang diketahui.
