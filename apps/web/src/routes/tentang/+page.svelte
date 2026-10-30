<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- mockup: sebagian rute belum dibangun */
	import PageHero from '#lib/components/site/PageHero.svelte';

	const values = [
		{
			icon: 'icon-[mdi--file-document-outline]',
			title: 'Bukti sebelum permintaan',
			body: 'Render, denah, spesifikasi, dan legalitas ditampilkan sebelum formulir meminta data pribadi Anda.'
		},
		{
			icon: 'icon-[mdi--handshake-outline]',
			title: 'Kesepakatan tertulis',
			body: 'Biaya, pembagian hasil, dan jadwal serah terima dicatat. Tidak ada angka yang berubah tanpa addendum.'
		},
		{
			icon: 'icon-[mdi--chart-line]',
			title: 'Progres yang dilaporkan',
			body: 'Pembeli dan pemilik lahan menerima laporan berkala berisi foto lapangan dan tahap pekerjaan.'
		}
	];
</script>

<svelte:head>
	<title>Tentang Azetta — Developer Properti di Makassar</title>
	<meta
		name="description"
		content="Azetta membangun rumah tapak dan mengelola kerja sama lahan di Makassar dan sekitarnya dengan pelaporan progres yang terbuka."
	/>
</svelte:head>

<PageHero
	breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Tentang' }]}
	eyebrow="Tentang"
	title="Membangun dengan angka yang bisa diperiksa"
	description="Kami mengembangkan rumah tapak dan mengelola lahan bersama pemiliknya, dengan satu aturan: semua angka penting ditulis sebelum pekerjaan dimulai."
/>

<div class="mx-auto max-w-6xl px-4 py-14">
	<div class="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
		<div>
			<h2 class="text-2xl md:text-3xl">Siapa kami</h2>
			<p class="mt-4 text-brand-gray-600">
				Azetta adalah pengembang properti yang berbasis di Makassar. Kami membangun rumah tapak
				berskala kecil hingga menengah dan menerima kerja sama lahan dari pemilik yang ingin
				lahannya produktif tanpa harus menjualnya.
			</p>
			<p class="mt-4 text-brand-gray-600">
				Fokus kami bukan volume, melainkan penyelesaian: unit yang terjual harus selesai dibangun
				dan diserahkan sesuai spesifikasi. Karena itu, kami membatasi jumlah proyek yang berjalan
				bersamaan.
			</p>
			<p class="mt-4 text-brand-gray-600">
				Sebagian besar pembeli kami adalah keluarga yang membeli rumah pertama, dan sebagian pemilik
				lahan adalah perorangan yang mewarisi tanah keluarga. Keduanya membutuhkan penjelasan yang
				sama jelasnya.
			</p>
		</div>

		<dl
			class="grid grid-cols-2 gap-px self-start overflow-hidden rounded-[1rem] border border-brand-line bg-brand-line"
		>
			<div class="bg-white p-5">
				<dt class="text-xs text-brand-gray-600">Berdiri</dt>
				<dd class="mt-1 text-2xl font-bold tabular-nums">2019</dd>
			</div>
			<div class="bg-white p-5">
				<dt class="text-xs text-brand-gray-600">Unit dikelola</dt>
				<dd class="mt-1 text-2xl font-bold tabular-nums">54</dd>
			</div>
			<div class="bg-white p-5">
				<dt class="text-xs text-brand-gray-600">Proyek berjalan</dt>
				<dd class="mt-1 text-2xl font-bold tabular-nums">2</dd>
			</div>
			<div class="bg-white p-5">
				<dt class="text-xs text-brand-gray-600">Wilayah</dt>
				<dd class="mt-1 text-2xl font-bold">Makassar</dd>
			</div>
		</dl>
	</div>

	<section class="mt-14">
		<h2 class="text-2xl md:text-3xl">Cara kami bekerja</h2>
		<div class="mt-8 grid gap-5 md:grid-cols-3">
			{#each values as value (value.title)}
				<article class="card border border-brand-line bg-white">
					<div class="card-body gap-3">
						<span
							class="grid size-11 place-items-center rounded-[0.5rem] border border-brand-line bg-brand-mist"
						>
							<span class="{value.icon} size-6"></span>
						</span>
						<h3 class="card-title text-base">{value.title}</h3>
						<p class="text-sm text-brand-gray-600">{value.body}</p>
					</div>
				</article>
			{/each}
		</div>
	</section>

	<div class="mt-14 rounded-[1rem] border border-brand-line bg-white p-6 md:p-8">
		<p class="font-bold">Ingin mengenal proyek dan tata kelola kami lebih jauh?</p>
		<p class="mt-2 max-w-2xl text-sm text-brand-gray-600">
			Ringkasan perusahaan, proyek berjalan, dan dokumen pendukung dapat kami kirim untuk Anda
			tinjau.
		</p>
		<div class="mt-4 flex flex-wrap gap-2">
			<a class="btn btn-primary btn-sm" href="/kontak">Hubungi kami</a>
			<a class="btn btn-outline btn-sm" href="/investasi">Informasi investasi</a>
		</div>
	</div>
</div>
