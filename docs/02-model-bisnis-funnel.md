# 02 — Model Bisnis & Funnel Lead

> Kembali ke [index](./README.md) · Sebelumnya: [01](./01-prd.md) · Berikutnya: [03](./03-arsitektur-teknis.md)

---

## 1. Dua aliran nilai dan satu halaman informasi

Azetta memonetisasi **penjualan rumah** dan **pengolahan lahan**. Halaman investasi disediakan sebagai keterbukaan informasi, bukan sebagai kanal penjualan. Website harus melayani ketiganya tanpa membuat pengunjung bingung.

| Aliran | Apa yang ditawarkan Azetta | Sumber pendapatan | Siapa yang membayar | Bukti yang dibutuhkan pengunjung |
|--------|----------------------------|-------------------|---------------------|----------------------------------|
| **A. Penjualan unit rumah** | Unit rumah tapak dari proyek Azetta (render, denah, spesifikasi, tipe, status ketersediaan) | Harga jual unit, dibayar bertahap sesuai kesepakatan (di luar aplikasi) | Pembeli rumah | Kualitas render, denah & spesifikasi, lokasi, progres proyek, legalitas, kejelasan status unit |
| **B. Kerja sama lahan** | Kemampuan membangun + modal + izin + pemasaran; **atau** pembelian lahan oleh Azetta | Bagi hasil penjualan unit, fee pengelolaan, atau laba proyek; bila lahan dibeli, kepemilikan berpindah ke Azetta | Pemilik lahan (dalam bentuk pembagian hasil atau harga jual lahan) | Skema bagi hasil, rekam jejak proyek, legalitas, kejelasan biaya, kepastian hak atas lahan |
| **C. Informasi investasi** *(bukan lini penjualan)* | Keterbukaan informasi perusahaan & proyek | Tidak ada pendapatan langsung dari website; pendanaan proyek berjalan lewat hubungan manajemen di luar situs | — | Profil perusahaan, proyek berjalan, tata kelola, kontak yang responsif |

**Yang tidak dijual:** gambar desain. **Desain adalah visual akhir yang diinginkan pembeli** dan ditampilkan sebagai render pada halaman unit; detailnya disepakati antara Azetta dan pembeli sebelum pembangunan. Karena itu tidak ada katalog desain, harga paket desain, atau alur "beli desain".

**Implikasi desain website:**

- Aliran A dan B punya **halaman pendaratan sendiri** (`/rumah`, `/kerja-sama-lahan`) karena kata kunci, keberatan, dan keputusan pengunjungnya berbeda.
- Aliran C cukup satu halaman `/investasi` berisi informasi dan CTA kontak — **tanpa formulir**, tanpa pencatatan lead, dan tanpa masuk pipeline sales.

## 2. Proporsi usaha yang diharapkan

Asumsi perencanaan (bukan janji):

| Aliran | Kontribusi lead | Kontribusi pendapatan | Panjang siklus |
|--------|:---------------:|:---------------------:|----------------|
| A. Penjualan unit rumah | 65% | 85% | 14–90 hari |
| B. Kerja sama lahan | 35% | 15% | 1–6 bulan |
| C. Informasi investasi | 0% (memang tidak diniatkan) | Tidak diukur di website | — |

Angka ini menentukan prioritas: **pendapatan utama berasal dari penjualan unit, sedangkan lahan adalah sumber pasokan proyek.** Karena itu katalog unit harus menjadi magnet trafik (SEO) sekaligus halaman konversi utama, sementara halaman kerja sama lahan harus menjadi materi paling meyakinkan bagi pemilik lahan.

## 3. Funnel dan definisi tahap

```text
  Keterpaparan        Kunjungan          Minat             Lead            Qualified         Deal
  (Google/IG/Ads) ──► Sesi ──────────► Lihat unit ────► Submit form ──► Dihubungi ──► Unit terjual
                        100%              ▸ 40%             ▸ 3–6%          ▸ 50–70%        ▸ 15–25%
```

| Tahap | Definisi operasional | Sistem pencatat |
|-------|----------------------|-----------------|
| **Sesi** | Kunjungan unik (GA4/Umami) | Analitik |
| **Minat** | Melihat halaman detail unit atau halaman kerja sama lahan | Event `unit_view`, `offer_view` |
| **Lead** | Formulir terkirim & tervalidasi | Tabel `Lead` |
| **Contacted** | Sales sudah menghubungi minimal 1× | `Lead.status = CONTACTED` |
| **Qualified** | Memenuhi minimal 3 dari 4 kriteria kualifikasi (lihat §5) | `Lead.status = QUALIFIED` |
| **Proposal** | Penawaran unit / skema kerja sama dikirim | `Lead.status = PROPOSAL` |
| **Negotiation** | Pembahasan harga, skema pembayaran, atau syarat kerja sama berjalan | `Lead.status = NEGOTIATION` |
| **Won** | Unit terjual (booking/akad) atau kerja sama lahan ditandatangani | `Lead.status = WON` + `closedAt` |
| **Lost** | Ditolak/tidak dilanjutkan | `Lead.status = LOST` + `lostReason` |

**Aturan penting:**

- Sistem hanya mencatat sampai `WON`. Nilai rupiah deal dicatat pada kolom `estimatedValue` (opsional, diisi sales) agar analitik tidak memerlukan integrasi keuangan.
- `WON` **tidak** mengubah status ketersediaan unit secara otomatis di MVP. Admin memperbarui `salesStatus` unit secara terpisah agar tidak ada unit terjual yang tetap tampil `TERSEDIA`.
- Halaman `/investasi` tidak memiliki tahap funnel. Yang diukur hanya kunjungan halaman dan klik kanal kontak (event analitik), bukan lead.

## 4. Titik handover (di luar aplikasi)

Karena tidak ada transaksi online, kejelasan "apa yang terjadi setelah submit" adalah bagian dari produk.

| Aliran | SLA respons | Kanal pertama | Isi kontak pertama | Penyerahan ke tim lain |
|--------|-------------|---------------|--------------------|------------------------|
| Pembeli rumah | ≤ 2 jam kerja | WhatsApp | Konfirmasi unit yang dimaksud, tanya kesiapan dana/KPR, kirim daftar tipe & jadwal survei | Tim proyek bila perlu jadwal tinjauan lokasi |
| Lahan | ≤ 1 hari kerja | Telepon, lalu WhatsApp | Konfirmasi luas & lokasi, tanya maksud (dijual/dikerjasamakan), jelaskan skema, minta foto/dokumen tambahan, jadwalkan survei | Tim proyek/legal |
| Informasi investasi | ≤ 1 hari kerja (bila kontak masuk) | WhatsApp/email | Kirim ringkasan perusahaan & proyek, jadwalkan diskusi | Manajemen |

**Yang wajib dicatat sales setelah kontak pertama:** status, ringkasan hasil, potensi nilai, langkah berikutnya + tanggal. Tanpa ini, funnel tidak bisa diukur.

## 5. Kualifikasi lead (lead scoring manual)

Sales memberi skor 0–2 pada empat dimensi; total ≥ 5 dari 8 = **qualified**.

| Dimensi | 0 | 1 | 2 |
|---------|---|---|---|
| **Kebutuhan** (kesesuaian dengan penawaran) | Belum jelas | Ada niat, belum spesifik | Jelas & sesuai (unit tertentu / lahan siap / maksud lahan jelas) |
| **Waktu** | > 12 bulan / tidak tahu | 3–12 bulan | ≤ 3 bulan |
| **Kapasitas** (dana / luas lahan) | Di bawah ambang | Mendekati ambang | Memenuhi ambang |
| **Kewenangan** | Bukan pengambil keputusan | Ikut memutuskan | Pengambil keputusan |

Ambang indikatif per aliran:

- **Rumah:** mampu membeli unit pada kisaran harga yang ditawarkan (tunai atau KPR dengan persetujuan prinsip), atau sudah memiliki dana siap.
- **Lahan:** luas ≥ 300 m², legalitas jelas atau dapat diurus, akses jalan memadai, maksud (dijual/dikerjasamakan) sudah jelas.

> Ambang ini adalah parameter bisnis, bukan aturan teknis. Bila berubah, cukup ubah panduan sales — tidak perlu perubahan sistem.

## 6. Definisi metrik

| Metrik | Rumus | Sumber |
|--------|-------|--------|
| Lead rate | `jumlah Lead / sesi` × 100% | DB + analitik |
| Conversion by page | `Lead dengan landingPath = X / sesi halaman X` | `Lead.landingPath` + analitik |
| Unit view rate | `sesi halaman detail unit / sesi katalog` | Analitik |
| Contact rate | `Lead status ≥ CONTACTED / total Lead` | DB |
| Qualification rate | `Lead QUALIFIED / Lead CONTACTED` | DB |
| Win rate | `Lead WON / Lead QUALIFIED` | DB |
| Speed to lead | median(`firstContactedAt − createdAt`) | DB |
| Cost per lead (berbayar) | biaya iklan / lead dari kanal berbayar | Manual (input di laporan) |
| Content yield | lead dari halaman artikel / artikel publish | `Lead.landingPath` |
| Stale lead | lead `NEW` > 24 jam | DB |
| Akun conversion | `jumlah User role=customer / jumlah Lead` | DB |
| Status view rate | kunjungan `/akun` ÷ pemilik akun aktif | DB + analitik |
| Informational reach | kunjungan `/investasi` dan klik kontak (bukan lead) | Analitik |
| Unit availability accuracy | unit `TERSEDIA` yang benar-benar tersedia / total unit `TERSEDIA` (audit sampling) | Manual (audit mingguan) |

Dashboard admin menampilkan metrik yang dapat dihitung dari DB; metrik berbayar tetap dihitung manual sampai ada integrasi iklan.

## 7. Irama operasional

| Ritme | Aktivitas | Pemilik |
|-------|-----------|---------|
| Harian (pagi) | Bersihkan antrean `NEW`, pastikan tidak ada lead > 12 jam tanpa kontak | Sales lead |
| Harian (sore) | Perbarui status semua lead yang dihubungi hari ini | Sales |
| Harian | Perbarui `salesStatus` unit yang baru terjual/di-booking | Admin konten |
| Mingguan | Review funnel: lead per sumber, alasan lost, konten dengan konversi terbaik | Marketing + sales |
| Mingguan | Audit 10 unit acak: status ketersediaan & harga sesuai kondisi lapangan | Admin konten |
| Bulanan | Review kualitas lead per kanal, putuskan lanjut/hentikan kanal berbayar | Manajemen |

## 8. Template pesan (dipakai di panel admin)

Template disimpan sebagai `SiteSetting` sehingga dapat diubah tanpa deploy.

**T1 — Unit rumah (kontak pertama):**
> Halo {nama}, terima kasih sudah menghubungi Azetta. Saya {sales} dari tim Azetta. Betul Anda tertarik dengan unit *{judul unit}* di {proyek}? Boleh saya tahu rencana pembelian Anda (tunai/KPR) dan perkiraan waktu pembelian? Saya kirimkan detail tipe, ketersediaan unit, dan jadwal survei.

**T2 — Lahan:**
> Halo {nama}, terima kasih telah menawarkan lahan di {kota}. Saya {sales}. Kami tertarik mendiskusikan lahan Anda — baik untuk dibeli maupun dikerjasamakan. Boleh kami tahu status kepemilikan dan apakah bisa dijadwalkan survei minggu ini?

**T3 — Follow-up tanpa respons (H+3):**
> Halo {nama}, saya ingin memastikan pesan saya sebelumnya sudah diterima. Bila masih berminat, saya siap bantu jelaskan. Bila belum waktunya, tidak masalah — kami bisa menghubungi kembali kapan pun Anda siap.

## 9. Ilustrasi ekonomi funnel

Ilustrasi untuk 1.000 sesi/bulan (asumsi konservatif):

| Tahap | Angka | Asumsi |
|-------|-------|--------|
| Sesi | 1.000 | 70% organik, 20% sosial, 10% iklan |
| Lihat halaman unit / penawaran lahan | 450 | 45% |
| Mulai isi form | 90 | 20% dari yang melihat |
| Lead terkirim | 45 | 50% menyelesaikan form |
| Contacted | 43 | 95% |
| Qualified | 20 | 47% |
| Deal | 3–4 | 18% |

Nilai ekonominya bergantung pada harga jual unit, sehingga tidak dicantumkan di sini. Yang penting: **satu lead mahal bila tidak ditindaklanjuti**; karena itu SLA dan pencatatan status adalah fitur inti, bukan tambahan.

## 10. Batasan model lead-gen

| Batasan | Konsekuensi | Kompensasi |
|---------|-------------|------------|
| Tidak ada transaksi di situs | Tidak bisa mengukur pendapatan langsung | Kolom `estimatedValue` + rekap manual bulanan |
| Kualitas lead bergantung sales | Data funnel bisa menyesatkan bila status tidak diperbarui | Status wajib diperbarui; audit mingguan |
| Status unit diperbarui manual | Risiko menampilkan unit yang sudah terjual | Audit mingguan, tanggal pembaruan tampil di halaman unit |
| Halaman investasi tanpa form | Tidak ada lead investor yang tercatat | CTA WhatsApp/email; percakapan dicatat manual oleh manajemen |
| Akun publik tanpa transaksi | Pengguna bisa memantau tetapi tidak bisa membeli | Arahkan ke WhatsApp/sales dari halaman akun |
| Kebocoran lead ke kanal pribadi | Riwayat hilang bila sales resign | Kebijakan: semua kontak via nomor perusahaan, aktivitas wajib dicatat |

## 11. Kesiapan fase berikutnya

Desain sistem saat ini sudah menyiapkan jalur menuju transaksi tanpa migrasi besar:

| Fase 2 | Perubahan yang diperlukan |
|--------|---------------------------|
| Booking / checkout unit | Tambah `Order`, `Booking`, `Payment`; status lead `WON` memicu booking dan mengubah `salesStatus` unit |
| Akun lanjutan | Favorit unit, notifikasi email/WA, penghapusan akun otomatis, ubah email |
| Portal investor | Tambah `Investor`, `Investment`, `Distribution`; akses berbasis akun undangan (bukan pendaftaran publik) |
| Kontrak digital | Tambah `Agreement` + penyimpanan dokumen |
