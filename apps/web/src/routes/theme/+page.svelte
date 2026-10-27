<!-- eslint-disable svelte/no-navigation-without-resolve -- pratinjau tema, tautan mengarah ke rute yang belum dibangun -->
<svelte:head>
	<title>Pratinjau Tema — Azetta</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="min-h-screen bg-base-100">
	<header class="sticky top-0 z-40 border-b border-base-300 bg-base-100/90 backdrop-blur">
		<div class="mx-auto flex h-20 max-w-6xl items-center gap-8 px-4">
			<a class="text-2xl font-bold tracking-tight text-primary" href="/">azetta</a>
			<nav class="hidden items-center gap-6 text-sm font-medium md:flex">
				<a class="link link-hover" href="/desain">Desain</a>
				<a class="link link-hover" href="/kerjasama-lahan">Kerja Sama Lahan</a>
				<a class="link link-hover" href="/investasi">Investasi</a>
				<a class="link link-hover" href="/proyek">Proyek</a>
				<a class="link link-hover" href="/artikel">Artikel</a>
			</nav>
			<div class="ml-auto flex items-center gap-2">
				<button class="btn btn-ghost btn-sm">Masuk</button>
				<button class="btn btn-primary btn-sm">Konsultasi</button>
			</div>
		</div>
	</header>

	<section class="relative overflow-hidden bg-base-200">
		<div
			class="absolute inset-0 bg-gradient-to-br from-primary/15 via-base-200 to-secondary/10"
		></div>
		<div class="relative mx-auto max-w-6xl px-4 py-20 text-center md:py-28">
			<span class="badge badge-primary badge-soft mb-4">#rumahImpianAnda</span>
			<h1 class="mx-auto max-w-3xl text-4xl leading-tight font-bold md:text-6xl">
				Desain rumah yang tumbuh bersama hidup Anda
			</h1>
			<p class="mx-auto mt-4 max-w-2xl text-base-content/70 md:text-lg">
				Katalog desain siap bangun, kerja sama lahan, dan peluang investasi properti dalam satu
				tempat.
			</p>
			<div class="join mx-auto mt-8 w-full max-w-2xl shadow-sm">
				<input
					class="input join-item w-full"
					placeholder="Cari gaya, luas lahan, atau jumlah kamar"
					aria-label="Cari desain"
				/>
				<select class="select join-item hidden sm:block" aria-label="Tipe properti">
					<option>Semua tipe</option>
					<option>Residensial</option>
					<option>Komersial</option>
					<option>Renovasi</option>
				</select>
				<button class="btn btn-primary join-item">Cari desain</button>
			</div>
		</div>
	</section>

	<section class="mx-auto max-w-6xl px-4 py-16">
		<div class="flex items-end justify-between gap-4">
			<div>
				<p class="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Katalog</p>
				<h2 class="mt-2 text-2xl font-semibold md:text-3xl">Desain populer</h2>
			</div>
			<button class="btn btn-outline btn-sm">Lihat semua</button>
		</div>

		<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each ['Rumah Minimalis 6×12', 'Rumah Tropis 8×15', 'Ruko Modern 5×15'] as title (title)}
				<article
					class="card border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
				>
					<figure class="grid h-44 place-items-center bg-base-200 text-base-content/30">
						Render 3D
					</figure>
					<div class="card-body gap-3">
						<div class="flex items-center gap-2">
							<span class="badge badge-primary badge-soft">Minimalis</span>
							<span class="text-xs text-base-content/60">2 lantai</span>
						</div>
						<h3 class="card-title text-base">{title}</h3>
						<p class="text-sm text-base-content/70">3 KT · 2 KM · 96 m²</p>
						<div class="mt-1 flex items-center justify-between">
							<span class="text-sm font-semibold text-primary">Mulai Rp1,5 jt</span>
							<button class="btn btn-primary btn-sm">Detail</button>
						</div>
					</div>
				</article>
			{/each}
		</div>
	</section>

	<section class="border-y border-base-300 bg-base-200/60">
		<div class="mx-auto max-w-6xl px-4 py-14">
			<span class="badge badge-neutral">Pratinjau tema</span>
			<h2 class="mt-3 text-2xl font-semibold">Warna & komponen daisyUI</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Semua komponen memakai kelas semantik daisyUI: <code>btn</code>, <code>badge</code>,
				<code>input</code>, <code>card</code>, <code>alert</code>.
			</p>

			<div class="mt-6 flex flex-wrap gap-2">
				<button class="btn btn-primary">Primary</button>
				<button class="btn btn-secondary">Secondary</button>
				<button class="btn btn-accent">Accent</button>
				<button class="btn btn-neutral">Neutral</button>
				<button class="btn btn-outline">Outline</button>
				<button class="btn btn-ghost">Ghost</button>
			</div>

			<div class="mt-6 flex flex-wrap gap-2">
				<span class="badge badge-primary">Baru</span>
				<span class="badge badge-secondary">Lahan</span>
				<span class="badge badge-accent">Investasi</span>
				<span class="badge badge-info">Info</span>
				<span class="badge badge-success">Tersedia</span>
				<span class="badge badge-warning">Terbatas</span>
				<span class="badge badge-error">Penuh</span>
			</div>

			<div class="mt-8 grid gap-4 md:grid-cols-3">
				<input class="input" placeholder="Nama lengkap" aria-label="Nama lengkap" />
				<select class="select" aria-label="Pilih kota">
					<option>Pilih kota</option>
					<option>Sleman</option>
					<option>Bantul</option>
				</select>
				<label class="input flex items-center gap-2">
					<span class="text-xs text-base-content/60">Rp</span>
					<input class="grow" placeholder="Rentang modal" aria-label="Rentang modal" />
				</label>
			</div>

			<div class="mt-8 grid gap-4 sm:grid-cols-3">
				<div class="stats border border-base-300 bg-base-100">
					<div class="stat">
						<div class="stat-title">Desain</div>
						<div class="stat-value text-primary">12</div>
						<div class="stat-desc">Siap bangun</div>
					</div>
				</div>
				<div class="stats border border-base-300 bg-base-100">
					<div class="stat">
						<div class="stat-title">Proyek</div>
						<div class="stat-value text-secondary">4</div>
						<div class="stat-desc">Portofolio</div>
					</div>
				</div>
				<div class="stats border border-base-300 bg-base-100">
					<div class="stat">
						<div class="stat-title">Respons</div>
						<div class="stat-value text-accent">≤ 2 jam</div>
						<div class="stat-desc">Jam kerja</div>
					</div>
				</div>
			</div>

			<div role="alert" class="alert alert-info mt-8">
				<span>Tema ini belum memiliki mode gelap sesuai lingkup MVP.</span>
			</div>
		</div>
	</section>

	<footer class="bg-neutral text-neutral-content">
		<div class="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
			<div class="md:col-span-2">
				<p class="text-2xl font-bold">azetta</p>
				<p class="mt-3 max-w-sm text-sm text-neutral-content/70">
					Developer properti: jual desain, kerja sama lahan, dan investasi.
				</p>
			</div>
			<div class="text-sm">
				<p class="font-semibold">Jelajahi</p>
				<ul class="mt-3 space-y-2 text-neutral-content/70">
					<li><a class="link link-hover" href="/desain">Katalog desain</a></li>
					<li><a class="link link-hover" href="/proyek">Proyek</a></li>
					<li><a class="link link-hover" href="/artikel">Artikel</a></li>
				</ul>
			</div>
			<div class="text-sm">
				<p class="font-semibold">Bantuan</p>
				<ul class="mt-3 space-y-2 text-neutral-content/70">
					<li><a class="link link-hover" href="/faq">FAQ</a></li>
					<li><a class="link link-hover" href="/kontak">Kontak</a></li>
					<li><a class="link link-hover" href="/kebijakan-privasi">Kebijakan privasi</a></li>
				</ul>
			</div>
		</div>
		<div class="border-t border-white/10 py-4 text-center text-xs text-neutral-content/60">
			Pratinjau internal — tidak diindeks mesin pencari.
		</div>
	</footer>
</div>
