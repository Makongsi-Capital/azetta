<script lang="ts">
	import Logo from '#lib/components/Logo.svelte';

	const palette = [
		{ name: 'ink', hex: '#1A1A1A', note: 'Tinta utama, latar gelap' },
		{ name: 'ink-2', hex: '#2B2B2B', note: 'Kartu di latar gelap' },
		{ name: 'ink-3', hex: '#3E3E3E', note: 'Garis di latar gelap' },
		{ name: 'gray-600', hex: '#5E5E5E', note: 'Teks sekunder, latar terang' },
		{ name: 'gray-500', hex: '#8C8C8C', note: 'Label di latar gelap' },
		{ name: 'gray-300', hex: '#B5B5B5', note: 'Teks sekunder, latar gelap' },
		{ name: 'line', hex: '#D6D8D9', note: 'Hairline di latar terang' },
		{ name: 'mist', hex: '#E8EAEB', note: 'Latar terang kedua' },
		{ name: 'paper', hex: '#F4F5F6', note: 'Latar terang utama' },
		{ name: 'white', hex: '#FFFFFF', note: 'Kartu di latar terang' }
	];

	const statusPalette = [
		{ name: 'info', hex: '#2C4F63', note: 'Keterangan sistem' },
		{ name: 'success', hex: '#2E5D46', note: 'Berhasil, tersedia' },
		{ name: 'warning', hex: '#7A5216', note: 'Perlu perhatian' },
		{ name: 'error', hex: '#8A3232', note: 'Gagal, terisi penuh' }
	];

	const contrast = [
		{ text: 'ink', bg: 'paper', ratio: '15,9 : 1', status: 'Aman' },
		{ text: 'gray-600', bg: 'paper', ratio: '5,9 : 1', status: 'Aman' },
		{ text: 'paper', bg: 'ink', ratio: '15,9 : 1', status: 'Aman' },
		{ text: 'gray-300', bg: 'ink', ratio: '8,5 : 1', status: 'Aman' },
		{ text: 'gray-500', bg: 'ink', ratio: '5,2 : 1', status: 'Aman' },
		{ text: 'gray-500', bg: 'paper', ratio: '3,1 : 1', status: 'Hanya ≥ 24 px' },
		{ text: 'paper', bg: 'info', ratio: '8,0 : 1', status: 'Aman' },
		{ text: 'paper', bg: 'success', ratio: '6,9 : 1', status: 'Aman' },
		{ text: 'paper', bg: 'warning', ratio: '6,3 : 1', status: 'Aman' },
		{ text: 'paper', bg: 'error', ratio: '7,4 : 1', status: 'Aman' }
	];
</script>

<svelte:head>
	<title>Panduan Tema — AZETTA</title>
	<meta name="robots" content="noindex" />
	<meta
		name="description"
		content="Pratinjau token, tipografi, dan komponen sesuai Brand Guidelines AZETTA."
	/>
</svelte:head>

<div class="bg-base-100">
	<section class="on-dark">
		<div class="mx-auto max-w-6xl px-4 py-20 md:py-28">
			<p class="eyebrow">Panduan tema</p>
			<h1 class="title-rule mt-4 max-w-3xl text-4xl md:text-6xl">
				Membangun aset bersama, dengan satu identitas.
			</h1>
			<p class="mt-6 max-w-2xl text-brand-gray-300 md:text-lg">
				Seluruh permukaan publik maupun admin memakai palet monokrom, huruf Arial, dan bidang polos
				tanpa bayangan. Yang membedakan adalah kontras, ukuran, dan ruang kosong — hanya umpan balik
				sistem yang memakai rona status.
			</p>
			<div class="mt-8 flex flex-wrap gap-3">
				<button class="btn btn-primary">Daftarkan lahan Anda</button>
				<button class="btn btn-outline border-brand-gray-500">Lihat katalog</button>
			</div>
			<p class="mt-6 text-sm text-brand-gray-500">
				Kajian awal gratis · Tanpa ikatan sampai akad · ±10 menit
			</p>
		</div>
	</section>

	<section class="mx-auto max-w-6xl px-4 py-16">
		<p class="eyebrow">Warna</p>
		<h2 class="mt-3 text-2xl md:text-3xl">Palet monokrom</h2>
		<p class="mt-2 max-w-2xl text-sm text-brand-gray-600">
			Sepuluh warna inti, tanpa warna aksen. Semua token tersedia sebagai utility Tailwind
			<code class="font-bold">bg-brand-*</code> dan <code class="font-bold">text-brand-*</code>.
		</p>

		<ul class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
			{#each palette as color (color.name)}
				<li class="card border border-brand-line bg-white">
					<div
						class="h-16 rounded-t-[1rem] border-b border-brand-line"
						style="background-color: {color.hex}"
					></div>
					<div class="p-3">
						<p class="text-sm font-bold">{color.name}</p>
						<p class="mt-0.5 text-xs text-brand-gray-600">{color.hex}</p>
						<p class="mt-2 text-xs text-brand-gray-600">{color.note}</p>
					</div>
				</li>
			{/each}
		</ul>

		<h3 class="mt-12 text-lg">Rona status</h3>
		<p class="mt-2 max-w-2xl text-sm text-brand-gray-600">
			Empat rona muted khusus umpan balik sistem — satu-satunya warna di luar palet monokrom. Warna
			tidak pernah menjadi satu-satunya pembeda: selalu ada label teks atau ikon.
		</p>

		<ul class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
			{#each statusPalette as color (color.name)}
				<li class="card border border-brand-line bg-white">
					<div
						class="rounded-t-[1rem] border-b border-brand-line p-3 text-xs font-bold text-brand-paper"
						style="background-color: {color.hex}"
					>
						{color.name}
					</div>
					<div class="p-3">
						<p class="text-sm font-bold">{color.hex}</p>
						<p class="mt-2 text-xs text-brand-gray-600">{color.note}</p>
					</div>
				</li>
			{/each}
		</ul>

		<h3 class="mt-12 text-lg">Kontras teks</h3>
		<div class="mt-4 overflow-x-auto">
			<table class="table border border-brand-line">
				<thead class="bg-white">
					<tr>
						<th>Teks</th>
						<th>Latar</th>
						<th>Rasio</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{#each contrast as row (row.text + row.bg)}
						<tr>
							<td>{row.text}</td>
							<td>{row.bg}</td>
							<td class="tabular-nums">{row.ratio}</td>
							<td>{row.status}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<p class="mt-4 text-sm text-brand-gray-600">
			Untuk keterangan kecil di latar terang, pakai gray-600, bukan gray-500.
		</p>
	</section>

	<section class="border-y border-brand-line bg-brand-mist">
		<div class="mx-auto max-w-6xl px-4 py-16">
			<p class="eyebrow">Tipografi</p>
			<h2 class="mt-3 text-2xl md:text-3xl">Satu keluarga huruf: Arial</h2>
			<p class="mt-2 max-w-2xl text-sm text-brand-gray-600">
				Cadangan Liberation Sans dan Helvetica, tersedia di semua perangkat. Tanpa webfont, sehingga
				tidak ada permintaan font tambahan.
			</p>

			<div class="mt-8 grid gap-4 md:grid-cols-2">
				<div class="card border border-brand-line bg-white">
					<div class="card-body gap-3">
						<span class="eyebrow">Display</span>
						<p class="text-5xl leading-none font-bold">112 px</p>
						<p class="text-sm text-brand-gray-600">Judul sampul, angka besar.</p>
					</div>
				</div>
				<div class="card border border-brand-line bg-white">
					<div class="card-body gap-3">
						<span class="eyebrow">Judul</span>
						<p class="text-3xl font-bold">Rancangan proyek Faisal</p>
						<p class="text-sm text-brand-gray-600">Selalu tebal 700, jarak baris 1,05–1,1.</p>
					</div>
				</div>
				<div class="card border border-brand-line bg-white">
					<div class="card-body gap-3">
						<span class="eyebrow">Isi</span>
						<p class="text-base">
							Lahan masuk sebagai modal penyertaan. Risiko disebut terbuka, lalu dijelaskan cara
							mengendalikannya.
						</p>
						<p class="text-sm text-brand-gray-600">Reguler 400, jarak baris 1,4–1,45.</p>
					</div>
				</div>
				<div class="card border border-brand-line bg-white">
					<div class="card-body gap-3">
						<span class="eyebrow">Penekanan</span>
						<p class="text-base">
							Dengan <strong>ketebalan</strong>, bukan ukuran baru dan bukan warna.
						</p>
						<p class="text-sm text-brand-gray-600">
							Miring hanya untuk tagline dan catatan status.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="mx-auto max-w-6xl px-4 py-16">
		<p class="eyebrow">Komponen</p>
		<h2 class="mt-3 text-2xl md:text-3xl">Komponen daisyUI</h2>
		<p class="mt-2 max-w-2xl text-sm text-brand-gray-600">
			Semua komponen memakai kelas semantik daisyUI: <code>btn</code>, <code>badge</code>,
			<code>input</code>, <code>card</code>, <code>alert</code>. Status memakai rona muted dan
			selalu disertai label teks, jadi tetap terbaca tanpa warna.
		</p>

		<p class="mt-6 text-xs text-brand-gray-600">
			Hierarki tombol lewat kontras: primary ink, secondary ink-2, accent ink-3.
		</p>
		<div class="mt-2 flex flex-wrap gap-2">
			<button class="btn btn-primary">Primary</button>
			<button class="btn btn-secondary">Secondary</button>
			<button class="btn btn-accent">Accent</button>
			<button class="btn btn-neutral">Neutral</button>
			<button class="btn btn-outline">Outline</button>
			<button class="btn btn-ghost">Ghost</button>
			<button class="btn btn-primary" disabled>Nonaktif</button>
		</div>

		<div class="mt-6 flex flex-wrap gap-2">
			<span class="badge badge-primary">Baru</span>
			<span class="badge badge-secondary">Lahan</span>
			<span class="badge badge-accent">Investasi</span>
			<span class="badge badge-info">Info</span>
			<span class="badge badge-success">Tersedia</span>
			<span class="badge badge-warning">Terbatas</span>
			<span class="badge badge-error">Penuh</span>
			<span class="badge badge-outline">Draft</span>
		</div>

		<div class="mt-8 grid gap-4 bg-white p-6 md:grid-cols-3">
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Nama lengkap</legend>
				<input class="input w-full" placeholder="Nama sesuai KTP" />
			</fieldset>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Kota</legend>
				<select class="select w-full">
					<option>Pilih kota</option>
					<option>Makassar</option>
					<option>Gowa</option>
				</select>
			</fieldset>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Rentang modal</legend>
				<input class="input w-full" placeholder="Rp 500 juta" />
			</fieldset>
			<fieldset class="fieldset md:col-span-3">
				<legend class="fieldset-legend">Catatan</legend>
				<textarea class="textarea w-full" rows="3" placeholder="Kondisi lahan, akses, dokumen"
				></textarea>
				<p class="fieldset-label">Data hanya dipakai untuk kajian awal.</p>
			</fieldset>
		</div>

		<div class="mt-8 grid gap-4 sm:grid-cols-3">
			<div class="stats border border-brand-line bg-white">
				<div class="stat">
					<div class="stat-title">Desain</div>
					<div class="stat-value">12</div>
					<div class="stat-desc">Siap bangun</div>
				</div>
			</div>
			<div class="stats border border-brand-line bg-white">
				<div class="stat">
					<div class="stat-title">Proyek</div>
					<div class="stat-value">4</div>
					<div class="stat-desc">Sudah deal</div>
				</div>
			</div>
			<div class="stats border border-brand-line bg-white">
				<div class="stat">
					<div class="stat-title">Respons</div>
					<div class="stat-value">≤ 2 jam</div>
					<div class="stat-desc">Jam kerja</div>
				</div>
			</div>
		</div>

		<div class="mt-8 grid gap-4 sm:grid-cols-2">
			<article class="card border border-brand-line bg-white">
				<figure
					class="grid h-40 place-items-center border-b border-brand-line bg-brand-mist text-sm text-brand-gray-600"
				>
					Render 3D · status tahap perencanaan
				</figure>
				<div class="card-body gap-3">
					<div class="flex flex-wrap items-center gap-2">
						<span class="badge badge-outline">Minimalis</span>
						<span class="text-xs text-brand-gray-600">2 lantai</span>
					</div>
					<h3 class="card-title text-base">Rumah Minimalis 6×12</h3>
					<p class="text-sm text-brand-gray-600">3 KT · 2 KM · 96 m²</p>
					<div class="mt-1 flex items-center justify-between">
						<span class="text-sm font-bold">Mulai Rp 1.500.000</span>
						<button class="btn btn-primary btn-sm">Detail</button>
					</div>
				</div>
			</article>

			<div class="grid gap-3">
				<div role="alert" class="alert alert-info">
					<span>Pendaftaran berhasil. Periksa email untuk verifikasi.</span>
				</div>
				<div role="alert" class="alert alert-success">
					<span>Pengajuan lahan diterima. Tim kami menghubungi dalam 1×24 jam kerja.</span>
				</div>
				<div role="alert" class="alert alert-warning">
					<span>Dokumen belum lengkap: sertifikat dan foto lahan.</span>
				</div>
				<div role="alert" class="alert alert-error">
					<span>Kata sandi salah. Coba lagi atau minta tautan reset.</span>
				</div>
			</div>
		</div>

		<div class="mt-8 flex flex-wrap items-center gap-6">
			<ul class="steps">
				<li class="step step-primary">Data diri</li>
				<li class="step step-primary">Data lahan</li>
				<li class="step">Tinjau</li>
			</ul>
			<progress class="progress w-40" value="45" max="100"></progress>
		</div>

		<div class="mt-8 flex flex-wrap items-center gap-3 text-sm">
			<span class="inline-flex items-center gap-2">
				<Logo size={14} wordmark={false} />
				Mark sebagai bullet
			</span>
			<span class="text-brand-gray-600">Tanpa emoji, tanpa warna aksen.</span>
		</div>
	</section>

	<section class="on-dark">
		<div class="mx-auto max-w-6xl px-4 py-16">
			<p class="eyebrow">Ajakan</p>
			<h2 class="title-rule mt-3 max-w-2xl text-3xl">
				Daftarkan lahan Anda, kami siapkan kajian awalnya.
			</h2>
			<p class="mt-6 max-w-xl text-brand-gray-300">
				Satu ajakan per materi publik. Angka transaksi hanya untuk pihak yang terlibat.
			</p>
			<div class="mt-8 flex flex-wrap gap-3">
				<button class="btn btn-primary">Ajukan lahan</button>
				<button class="btn btn-ghost">Baca FAQ</button>
			</div>
		</div>
	</section>
</div>
