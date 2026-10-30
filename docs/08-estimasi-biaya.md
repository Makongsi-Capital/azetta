# 08 — Estimasi Effort & Biaya

> Kembali ke [index](./README.md) · Sebelumnya: [07](./07-backlog-sprint.md) · Berikutnya: [09](./09-qa-test-plan.md)

---

## 1. Ringkasan

| Pos | Nilai |
|-----|-------|
| Effort total | **187 person-day** (147 developer, 17 desain, 15 QA, 8 konten) |
| Durasi kalender | **±15 minggu** dengan 2 developer full-time |
| Biaya tim (outsourced) | **Rp 142–214 juta** (dihitung per peran, §3.3) |
| Biaya tim + kontingensi 15% | **Rp 163–246 juta** |
| Infrastruktur bulanan | **Rp 450 ribu–2,3 juta** (baseline ±Rp 1,5 juta) |
| Biaya sekali bayar | **Rp 4,75–15,5 juta** (domain, aset visual, review legal, dsb.) |
| TCO 12 bulan (build + infra + sekali bayar) | **±Rp 152–258 juta** (tanpa kontingensi) |

> Semua angka adalah **rentang indikatif**, bukan penawaran. Angka berubah bila asumsi di §2 berubah.

## 2. Asumsi estimasi

| # | Asumsi | Bila tidak terpenuhi |
|---|--------|----------------------|
| 1 | 2 developer full-time, familiar dengan SvelteKit & TypeScript | +25–40% effort |
| 2 | Desain UI (high-fidelity) tersedia untuk 9 halaman utama (termasuk 3 halaman akun & proyek) | +8–12 pd desain + iterasi frontend |
| 3 | Konten (12 desain, 4 proyek, 8 artikel, foto/render) disiapkan tim internal Azetta tanpa PIC khusus (Q9) | +3–5 minggu keterlambatan rilis |
| 4 | Tidak ada integrasi pihak ketiga selain email & Turnstile | +2–4 pd per integrasi |
| 5 | Tidak ada pembayaran, multi-bahasa, atau dashboard investor | +15–30 pd per fitur besar |
| 6 | Satu lingkungan produksi, tanpa HA/multi-region | +10–20 pd |
| 7 | UAT dilakukan paralel, bukan setelah semua selesai | +2 minggu |
| 8 | Tidak ada perubahan lingkup setelah Sprint 1 | +5–15% |
| 9 | Akun publik terbatas pada pemantauan progres + permohonan hapus akun, tanpa favorit/chat/notifikasi maupun penghapusan otomatis | +4–8 pd |
| 10 | Verifikasi email memakai penyedia email transaksional yang sama dengan notifikasi | +1–2 pd (integrasi tambahan) |
| 11 | Tiptap dipakai sebagai library editor (MIT); tidak ada layanan editor/hosting tambahan | +2–4 pd bila butuh kolaborasi realtime atau penyimpanan dokumen eksternal |

Rate acuan pasar (2026, Indonesia, proyek lepas):

| Peran | Rate per person-day |
|-------|---------------------|
| Junior developer | Rp 500–700 ribu |
| Mid developer | Rp 800 ribu–1,2 juta |
| Senior developer / arsitek | Rp 1,3–1,8 juta |
| UI/UX designer | Rp 700 ribu–1,1 juta |
| QA engineer | Rp 600–900 ribu |
| Content writer | Rp 400–700 ribu |

## 3. Rincian effort

### 3.1 Per peran

| Peran | Lingkup | pd |
|-------|---------|:--:|
| Developer (2 orang) | Sprint 0–7 sesuai [07 §3](./07-backlog-sprint.md#3-rincian-task) | **147** |
| UI/UX designer | Wireframe → high-fidelity 9 halaman (beranda, katalog, detail, lahan, investasi, proyek, akun, auth, admin lead) | 13 |
| UI/UX designer | Aset visual, ikonografi, QA visual antar breakpoint | 4 |
| QA engineer | Test case & matriks uji | 3 |
| QA engineer | Regresi manual 2 putaran + UAT support | 12 |
| Content writer | Copywriting halaman + 8 artikel (riset & tulis) | 8 |
| **Total** | | **187** |

> Automated E2E (Playwright) dihitung sebagai task developer (`E5-06`, `E7-01`), bukan QA, agar tidak terhitung dua kali.

### 3.2 Per fase

| Fase | Sprint | Dev pd | Non-dev pd | Total |
|------|--------|:------:|:----------:|:-----:|
| Fondasi | 0 | 10 | 0 | 10 |
| Katalog | 1 | 20 | 4 (desain 3 halaman) | 24 |
| Lead | 2 | 20 | 4 (desain form 1, QA 1) | 24 |
| CRM | 3 | 20 | 4 (desain admin 3, QA 1) | 24 |
| CMS & proyek | 4 | 20 | 2 (desain proyek/CMS) | 22 |
| Akun publik | 5 | 20 | 4 (desain akun 3, QA 1) | 24 |
| Konten & kualitas | 6 | 17 | 19 (desain 2, QA 9, konten 8) | 36 |
| Rilis | 7 | 20 | 3 (QA/UAT) | 23 |
| **Total** | | **147** | **40** | **187** |

> Total non-developer 40 pd = desain 17 + QA 15 + konten 8. Seluruh angka mengacu pada [§3.1](#31-per-peran).

### 3.3 Distribusi biaya per peran (outsourced)

| Peran | pd | Rate (Rp/pd) | Subtotal |
|-------|:--:|--------------|----------|
| Developer | 147 | 800 rb – 1,2 jt | 117,6 – 176,4 jt |
| Designer | 17 | 700 rb – 1,1 jt | 11,9 – 18,7 jt |
| QA | 15 | 600 – 900 rb | 9,0 – 13,5 jt |
| Content | 8 | 400 – 700 rb | 3,2 – 5,6 jt |
| **Total** | **187** | — | **141,7 – 214,2 jt** |

Dengan kontingensi 15%: **Rp 163,0 – 246,3 juta** (dibulatkan Rp 163–246 juta).

Kenaikan dari v1.0 (155 → 185 pd) berasal dari: akun publik +14 pd pengembangan, portofolio proyek +5 pd, unggah aset legal/brand +2 pd, serta penyesuaian desain & QA +9 pd.

Kenaikan v1.2 (185 → 187 pd): permohonan hapus akun (Q12) +2 pd developer di Sprint 5.

## 4. Skenario tim

| Skenario | Komposisi | Biaya eksternal | Durasi | Catatan |
|----------|-----------|-----------------|--------|---------|
| **A. In-house penuh** | 2 dev + desainer + QA internal | Rp 0 (biaya gaji tetap) | 15 minggu | Termurah secara kas, butuh kapasitas tim |
| **B. Outsourced penuh** | Vendor/agency | Rp 142–214 jt | 15 minggu | Cepat, perlu manajemen vendor & serah terima |
| **C. Hybrid (disarankan)** | 1 dev internal + 1 dev senior lepas + desainer lepas | Rp 70–110 jt | 15–17 minggu | Pengetahuan produk tetap di internal |
| **D. Satu developer** | 1 dev full-stack | Rp 58–87 jt (own cost) | 26–30 minggu | Risiko bottleneck & bus factor tinggi |

Rekomendasi: **C** — menjaga pengetahuan produk di internal sambil menambah kapasitas.

## 5. Biaya infrastruktur bulanan

| Komponen | Minimum | Baseline | Catatan |
|----------|--------:|---------:|---------|
| VPS aplikasi (4 vCPU / 8 GB, Docker: api+web+admin) | Rp 400 rb | Rp 800 rb | Cukup untuk 30 rb sesi/bulan |
| PostgreSQL | Rp 0 (self-host di VPS) | Rp 700 rb | Managed (Neon/Supabase/RDS) untuk backup otomatis |
| Object storage R2 (20 GB + operasi) | Rp 20 rb | Rp 60 rb | Egress gratis |
| Email transaksional | Rp 0 (free tier 3.000/bulan) | Rp 320 rb | Notifikasi lead + verifikasi akun + reset sandi |
| Error tracking (Sentry) | Rp 0 (free) | Rp 420 rb | Free tier cukup untuk MVP |
| CDN/WAF (Cloudflare) | Rp 0 (free) | Rp 0 | Pro opsional Rp 320 rb |
| Domain `.id` | Rp 21 rb | Rp 21 rb | Rp 250 rb/tahun |
| Monitoring uptime | Rp 0 | Rp 0 | Layanan gratis |
| **Total** | **±Rp 441 rb** | **±Rp 2,32 jt** | Baseline realistis **Rp 1,4–1,8 jt** tanpa layanan opsional |

Catatan v1.1: komponen **WhatsApp gateway dihapus** (Q7). Asumsi kurs: USD 1 = Rp 16.500 (perbarui saat pembelian).

## 6. Biaya sekali bayar

| Pos | Rentang | Catatan |
|-----|--------:|---------|
| Domain & SSL | Rp 250–500 rb | SSL gratis (Let's Encrypt/Cloudflare) |
| Aset visual (render 3D / fotografi) | Rp 3–8 jt | 12 desain + 4 proyek; bisa dikerjakan internal |
| Review legal (privasi & syarat) | Rp 1,5–4 jt | Wajib sebelum rilis |
| Setup akun bisnis & email domain | Rp 0–500 rb | Termasuk SPF/DKIM/DMARC untuk deliverability |
| Pelatihan tim (1 sesi) | Rp 0–1 jt | Bisa internal |
| Cadangan perangkat/alat | Rp 0–1,5 jt | — |
| **Total** | **Rp 4,75–15,5 jt** | — |

## 7. Total biaya kepemilikan 12 bulan

| Komponen | Minimum | Maksimum |
|----------|--------:|---------:|
| Build (tim) | Rp 141,7 jt | Rp 246,3 jt (termasuk kontingensi) |
| Infrastruktur 12 bulan | Rp 5,3 jt | Rp 27,8 jt |
| Sekali bayar | Rp 4,75 jt | Rp 15,5 jt |
| **TCO 12 bulan** | **±Rp 152 jt** | **±Rp 290 jt** |

Tanpa kontingensi, TCO berada di **Rp 152–258 juta**. Biaya operasional setelah tahun pertama: **Rp 5,3–27,8 juta/tahun** + pemeliharaan bila diperlukan.

## 8. Sensitivitas

| Perubahan | Dampak effort | Dampak biaya (bottom-up) |
|-----------|---------------|--------------------------|
| Menunda portofolio proyek ke fase 2 | −7 pd | −Rp 5–8 jt |
| Menunda akun publik (kembali ke v1.0) | −17 pd | −Rp 13–20 jt |
| Tambah pembayaran online + order | +18–25 pd | +Rp 14–31 jt |
| Tambah dashboard investor | +20–30 pd | +Rp 16–37 jt |
| Tambah multi-bahasa | +8–12 pd | +Rp 6–14 jt |
| Tambah routing lead per tim + pengingat otomatis | +6–8 pd | +Rp 5–10 jt |
| Desain UI dibuat dari nol tanpa desainer | +10–14 pd dev | +Rp 8–16 jt |
| Konten terlambat 1 bulan | 0 pd, +4 minggu kalender | Opportunitas hilang |
| Ganti Postgres ke managed + HA | +2–4 pd | +Rp 3–6 jt/tahun |
| Kebutuhan audit keamanan formal | +10–15 pd | +Rp 8–18 jt |

## 9. Cara menekan biaya (tanpa merusak kualitas)

1. **Pakai template komponen daisyUI** apa adanya pada MVP; kustomisasi setelah ada trafik.
2. **Batasi animasi & ilustrasi custom** — fokus pada kualitas foto/render.
3. **Konten internal**: tulis artikel dari transkrip wawancara tim sales (lebih murah & autentik).
4. **Satu lingkungan staging**, bukan dua.
5. **Self-host Postgres** di VPS yang sama untuk 3 bulan pertama, pindah ke managed saat trafik naik.
6. **Tunda fitur analitik lanjutan** — gunakan Umami self-host atau GA4 gratis.
7. **Jangan mengejar 100% Lighthouse** — target 90 sudah cukup; setiap 5 poin terakhir biasanya mahal.
8. **Portofolio proyek memakai array URL**, bukan tabel media penuh — mengurangi pekerjaan UI & skema.

## 10. Pemantauan biaya

| Bulanan | Yang diperiksa |
|---------|----------------|
| Pemakaian VPS (CPU/RAM/disk) | Apakah perlu upgrade atau optimasi |
| Ukuran DB & storage | Apakah retensi berjalan |
| Email terkirim (notifikasi + verifikasi + reset) | Apakah melewati free tier |
| Error tracking quota | Apakah noise perlu difilter |
| Biaya iklan vs lead | Hentikan kanal dengan CPL di atas ambang |

Biaya yang perlu diwaspadai: egress storage (R2 gratis, tapi bukan semua provider), query DB tak terindeks yang memaksa upgrade VPS, dan retensi `funnel_event` yang tidak berjalan.
