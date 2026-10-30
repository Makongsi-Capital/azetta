# 02 — Model Bisnis & Funnel Lead

> Kembali ke [index](./README.md) · Sebelumnya: [01](./01-prd.md) · Berikutnya: [03](./03-arsitektur-teknis.md)

---

## 1. Tiga aliran nilai

Azetta memonetisasi tiga hal berbeda, dan website harus melayani ketiganya tanpa membuat pengunjung bingung.

| Aliran | Apa yang dijual Azetta | Sumber pendapatan | Siapa yang membayar | Bukti yang dibutuhkan pengunjung |
|--------|------------------------|-------------------|---------------------|----------------------------------|
| **A. Desain** | Paket gambar desain (render, denah, spesifikasi, RAB indikatif) | Harga paket desain (sekali bayar) + jasa kustomisasi | Pembeli desain | Kualitas render, kelengkapan gambar, harga mulai, contoh revisi |
| **B. Kerja sama lahan** | Kemampuan membangun + modal + izin + pemasaran | Bagi hasil penjualan unit, fee pengelolaan, atau bagi laba | Pemilik lahan (dalam bentuk pembagian hasil) | Skema bagi hasil, rekam jejak proyek, legalitas, kejelasan biaya |
| **C. Investasi** | Kesempatan menanam modal pada proyek pengembangan lahan | Bagi hasil keuntungan proyek, fee pengelolaan | Investor | Proyeksi imbal hasil, horizon, tata kelola, mitigasi risiko |

**Implikasi desain website:** ketiga aliran harus punya **halaman pendaratan sendiri** (bukan satu halaman "layanan" gabungan), karena kata kunci, keberatan, dan keputusan yang dihadapi pengunjung sangat berbeda.

## 2. Proporsi usaha yang diharapkan

Asumsi perencanaan (bukan janji):

| Aliran | Kontribusi lead | Kontribusi pendapatan | Panjang siklus |
|--------|:---------------:|:---------------------:|----------------|
| A. Desain | 60% | 15% | 3–14 hari |
| B. Lahan | 25% | 45% | 1–6 bulan |
| C. Investasi | 15% | 40% | 1–3 bulan |

Angka ini menentukan prioritas: **volume lead berasal dari desain, nilai terbesar dari lahan & investasi.** Karena itu katalog desain harus menjadi magnet trafik (SEO), sementara halaman lahan & investasi harus menjadi halaman dengan materi paling meyakinkan.

## 3. Funnel dan definisi tahap

```text
  Keterpaparan        Kunjungan          Minat             Lead            Qualified         Deal
  (Google/IG/Ads) ──► Sesi ──────────► Lihat desain ──► Submit form ──► Dihubungi ──► Kerja sama
                        100%              ▸ 35%             ▸ 3–6%          ▸ 50–70%        ▸ 15–25%
```

| Tahap | Definisi operasional | Sistem pencatat |
|-------|----------------------|-----------------|
| **Sesi** | Kunjungan unik (GA4/Umami) | Analitik |
| **Minat** | Melihat halaman detail desain / halaman lahan / halaman investasi | Event `design_view`, `offer_view` |
| **Lead** | Formulir terkirim & tervalidasi | Tabel `Lead` |
| **Contacted** | Sales sudah menghubungi minimal 1× | `Lead.status = CONTACTED` |
| **Qualified** | Memenuhi minimal 3 dari 4 kriteria kualifikasi (lihat §5) | `Lead.status = QUALIFIED` |
| **Proposal** | Penawaran/skema dikirim | `Lead.status = PROPOSAL` |
| **Negotiation** | Pembahasan harga/skema berjalan | `Lead.status = NEGOTIATION` |
| **Won** | Kesepakatan ditandatangani / pembayaran desain diterima | `Lead.status = WON` + `closedAt` |
| **Lost** | Ditolak/tidak dilanjutkan | `Lead.status = LOST` + `lostReason` |

**Aturan penting:** sistem hanya mencatat sampai `WON`. Nilai rupiah deal dicatat pada kolom `estimatedValue` (opsional, diisi sales) agar analitik tidak memerlukan integrasi keuangan.

## 4. Titik handover (di luar aplikasi)

Karena tidak ada transaksi online, kejelasan "apa yang terjadi setelah submit" adalah bagian dari produk.

| Aliran | SLA respons | Kanal pertama | Isi kontak pertama | Penyerahan ke tim lain |
|--------|-------------|---------------|--------------------|------------------------|
| Desain | ≤ 2 jam kerja | WhatsApp | Konfirmasi desain yang dimaksud, tanya lokasi & waktu mulai bangun, kirim daftar paket | Tim desain bila minta kustomisasi |
| Lahan | ≤ 1 hari kerja | Telepon, lalu WhatsApp | Konfirmasi luas & lokasi, jelaskan skema, minta foto/dokumen tambahan, jadwalkan survei | Tim proyek/legal |
| Investasi | ≤ 1 hari kerja | WhatsApp/email | Kirim ringkasan proyek, tanya rentang dana & preferensi, jadwalkan diskusi | Manajemen |

**Yang wajib dicatat sales setelah kontak pertama:** status, ringkasan hasil, potensi nilai, langkah berikutnya + tanggal. Tanpa ini, funnel tidak bisa diukur.

## 5. Kualifikasi lead (lead scoring manual)

Sales memberi skor 0–2 pada empat dimensi; total ≥ 5 dari 8 = **qualified**.

| Dimensi | 0 | 1 | 2 |
|---------|---|---|---|
| **Kebutuhan** (kesesuaian dengan penawaran) | Belum jelas | Ada niat, belum spesifik | Jelas & sesuai (desain spesifik / lahan siap / dana siap) |
| **Waktu** | > 12 bulan / tidak tahu | 3–12 bulan | ≤ 3 bulan |
| **Kapasitas** (dana / luas lahan) | Di bawah ambang | Mendekati ambang | Memenuhi ambang |
| **Kewenangan** | Bukan pengambil keputusan | Ikut memutuskan | Pengambil keputusan |

Ambang indikatif per aliran:

- Desain: mampu membeli paket desain (mulai Rp…, lihat daftar harga internal).
- Lahan: luas ≥ 300 m², legalitas jelas atau dapat diurus, akses jalan memadai.
- Investasi: dana ≥ Rp 250 juta, siap menempatkan dana dalam 6 bulan.

> Ambang ini adalah parameter bisnis, bukan aturan teknis. Bila berubah, cukup ubah panduan sales — tidak perlu perubahan sistem.

## 6. Definisi metrik

| Metrik | Rumus | Sumber |
|--------|-------|--------|
| Lead rate | `jumlah Lead / sesi` × 100% | DB + analitik |
| Conversion by page | `Lead dengan landingPath = X / sesi halaman X` | `Lead.landingPath` + analitik |
| Contact rate | `Lead status ≥ CONTACTED / total Lead` | DB |
| Qualification rate | `Lead QUALIFIED / Lead CONTACTED` | DB |
| Win rate | `Lead WON / Lead QUALIFIED` | DB |
| Speed to lead | median(`firstContactedAt − createdAt`) | DB |
| Cost per lead (berbayar) | biaya iklan / lead dari kanal berbayar | Manual (input di laporan) |
| Content yield | lead dari halaman artikel / artikel publish | `Lead.landingPath` |
| Stale lead | lead `NEW` > 24 jam | DB |
| Akun conversion | `jumlah User role=customer / jumlah Lead` | DB |
| Status view rate | kunjungan `/akun` ÷ pemilik akun aktif | DB + analitik |

Dashboard admin menampilkan metrik yang dapat dihitung dari DB; metrik berbayar tetap dihitung manual sampai ada integrasi iklan.

## 7. Irama operasional

| Ritme | Aktivitas | Pemilik |
|-------|-----------|---------|
| Harian (pagi) | Bersihkan antrean `NEW`, pastikan tidak ada lead > 12 jam tanpa kontak | Sales lead |
| Harian (sore) | Perbarui status semua lead yang dihubungi hari ini | Sales |
| Mingguan | Review funnel: lead per sumber, alasan lost, konten dengan konversi terbaik | Marketing + sales |
| Bulanan | Review kualitas lead per kanal, putuskan lanjut/hentikan kanal berbayar | Manajemen |

## 8. Template pesan (dipakai di panel admin)

Template disimpan sebagai `SiteSetting` sehingga dapat diubah tanpa deploy.

**T1 — Desain (kontak pertama):**
> Halo {nama}, terima kasih sudah menghubungi Azetta. Saya {sales} dari tim Azetta. Betul Anda tertarik dengan desain *{judul}*? Boleh saya tahu rencana lokasi dan perkiraan waktu mulai bangun? Saya kirimkan detail paket dan estimasi biayanya.

**T2 — Lahan:**
> Halo {nama}, terima kasih telah menawarkan lahan di {kota}. Saya {sales}. Kami tertarik mendiskusikan kerja sama pengolahan. Boleh kami tahu status kepemilikan dan apakah bisa dijadwalkan survei minggu ini?

**T3 — Investasi:**
> Halo {nama}, terima kasih atas minat Anda pada proyek Azetta. Saya {sales}. Saya kirimkan ringkasan proyek dan skema kerja sama. Apakah bisa kita jadwalkan diskusi 30 menit minggu ini?

**T4 — Follow-up tanpa respons (H+3):**
> Halo {nama}, saya ingin memastikan pesan saya sebelumnya sudah diterima. Bila masih berminat, saya siap bantu jelaskan. Bila belum waktunya, tidak masalah — kami bisa menghubungi kembali kapan pun Anda siap.

## 9. Ilustrasi ekonomi funnel

Ilustrasi untuk 1.000 sesi/bulan (asumsi konservatif):

| Tahap | Angka | Asumsi |
|-------|-------|--------|
| Sesi | 1.000 | 70% organik, 20% sosial, 10% iklan |
| Lihat halaman penawaran | 450 | 45% |
| Mulai isi form | 90 | 20% dari yang melihat |
| Lead terkirim | 45 | 50% menyelesaikan form |
| Contacted | 43 | 95% |
| Qualified | 20 | 47% |
| Deal | 3–4 | 18% |

Nilai ekonominya bergantung pada harga internal Azetta, sehingga tidak dicantumkan di sini. Yang penting: **satu lead mahal bila tidak ditindaklanjuti**; karena itu SLA dan pencatatan status adalah fitur inti, bukan tambahan.

## 10. Batasan model lead-gen

| Batasan | Konsekuensi | Kompensasi |
|---------|-------------|------------|
| Tidak ada transaksi di situs | Tidak bisa mengukur pendapatan langsung | Kolom `estimatedValue` + rekap manual bulanan |
| Kualitas lead bergantung sales | Data funnel bisa menyesatkan bila status tidak diperbarui | Status wajib diperbarui; audit mingguan |
| Tidak ada akun publik | — | **Sudah tidak berlaku**: akun tersedia untuk memantau progres (Q1) |
| Akun publik tanpa transaksi | Pengguna bisa memantau tetapi tidak bisa membeli | Arahkan ke WhatsApp/sales dari halaman akun |
| Kebocoran lead ke kanal pribadi | Riwayat hilang bila sales resign | Kebijakan: semua kontak via nomor perusahaan, aktivitas wajib dicatat |

## 11. Kesiapan fase berikutnya

Desain sistem saat ini sudah menyiapkan jalur menuju transaksi tanpa migrasi besar:

| Fase 2 | Perubahan yang diperlukan |
|--------|---------------------------|
| Checkout desain | Tambah `Order`, `OrderItem`, `Payment`; status lead `WON` memicu order |
| Akun lanjutan | Favorit, notifikasi email/WA, penghapusan akun otomatis, ubah email |
| Dashboard investor | Tambah `Investment`, `Distribution`; laporan proyek per investor (model `Project` sudah ada di MVP) |
| Kontrak digital | Tambah `Agreement` + penyimpanan dokumen |
