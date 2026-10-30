<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- mockup: sebagian rute belum dibangun */
	import ProjectCard from '#lib/components/site/ProjectCard.svelte';
	import PageHero from '#lib/components/site/PageHero.svelte';
	import { projects } from '#lib/mock/site.js';

	const ongoing = projects.filter((project) => project.status === 'SEDANG BERJALAN');

	const governance = [
		'Setiap proyek dipublikasikan hanya setelah ada persetujuan tertulis dari pemilik lahan.',
		'Laporan progres memuat foto lapangan, tahap pekerjaan, dan perkiraan serah terima.',
		'Perubahan spesifikasi dan biaya dicatat dalam addendum, bukan disepakati lisan.',
		'Dokumen legalitas ditunjukkan sebelum tanda tangan, bukan setelah pembayaran.'
	];

	const risks = [
		'Jadwal pembangunan dapat bergeser karena cuaca, perizinan, atau pasokan material.',
		'Harga jual unit dapat berubah mengikuti kondisi pasar dan biaya konstruksi.',
		'Pengembalian dana bergantung pada penjualan unit, bukan pada jaminan tetap.',
		'Keterbukaan informasi di situs ini bukan jaminan kinerja di masa depan.'
	];
</script>

<svelte:head>
	<title>Informasi Investasi &amp; Tata Kelola — Azetta</title>
	<meta
		name="description"
		content="Profil perusahaan, proyek berjalan, tata kelola, dan risiko yang perlu diketahui sebelum menghubungi Azetta."
	/>
</svelte:head>

<PageHero
	breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Investasi' }]}
	eyebrow="Keterbukaan informasi"
	title="Informasi investasi dan tata kelola"
	description="Halaman ini memuat profil perusahaan dan proyek yang sedang berjalan. Tidak ada penawaran efek atau produk investasi di sini."
/>

<div class="mx-auto max-w-6xl px-4 py-12">
	<div role="alert" class="alert alert-info">
		<span class="icon-[mdi--file-document-outline] size-5 shrink-0"></span>
		<span>
			Azetta tidak menawarkan surat berharga melalui situs ini. Pendanaan proyek berjalan melalui
			hubungan manajemen di luar situs dan tidak dipasarkan sebagai produk investasi.
		</span>
	</div>

	<dl
		class="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[1rem] border border-brand-line bg-brand-line sm:grid-cols-4"
	>
		<div class="bg-white p-4">
			<dt class="text-xs text-brand-gray-600">Proyek berjalan</dt>
			<dd class="mt-1 text-lg font-bold tabular-nums">{ongoing.length}</dd>
		</div>
		<div class="bg-white p-4">
			<dt class="text-xs text-brand-gray-600">Unit dikelola</dt>
			<dd class="mt-1 text-lg font-bold tabular-nums">54</dd>
		</div>
		<div class="bg-white p-4">
			<dt class="text-xs text-brand-gray-600">Wilayah</dt>
			<dd class="mt-1 text-lg font-bold">Makassar &amp; Gowa</dd>
		</div>
		<div class="bg-white p-4">
			<dt class="text-xs text-brand-gray-600">Respons kontak</dt>
			<dd class="mt-1 text-lg font-bold tabular-nums">≤ 1 hari</dd>
		</div>
	</dl>
</div>

<section class="border-y border-brand-line bg-brand-mist">
	<div class="mx-auto max-w-6xl px-4 py-14">
		<h2 class="text-2xl md:text-3xl">Proyek yang sedang berjalan</h2>
		<p class="mt-3 max-w-2xl text-sm text-brand-gray-600">
			Ringkasan proyek aktif. Detail lokasi, jumlah unit, dan tahap pekerjaan tersedia di halaman
			masing-masing.
		</p>
		<div class="mt-8 grid gap-5 md:grid-cols-2">
			{#each ongoing as project (project.slug)}
				<ProjectCard {project} />
			{/each}
		</div>
	</div>
</section>

<section class="mx-auto max-w-6xl px-4 py-14">
	<div class="grid gap-10 md:grid-cols-2">
		<div>
			<h2 class="text-2xl md:text-3xl">Tata kelola</h2>
			<ul class="mt-6 space-y-3 text-sm text-brand-gray-600">
				{#each governance as item (item)}
					<li class="flex gap-2">
						<span class="icon-[mdi--check-decagram-outline] mt-0.5 size-4 shrink-0"></span>
						{item}
					</li>
				{/each}
			</ul>
		</div>

		<div>
			<h2 class="text-2xl md:text-3xl">Risiko yang perlu diketahui</h2>
			<ul class="mt-6 space-y-3 text-sm text-brand-gray-600">
				{#each risks as item (item)}
					<li class="flex gap-2">
						<span class="icon-[mdi--alert-outline] mt-0.5 size-4 shrink-0"></span>
						{item}
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<div class="mt-12 rounded-[1rem] border border-brand-line bg-white p-6">
		<p class="font-bold">Ingin membahas proyek secara langsung?</p>
		<p class="mt-2 text-sm text-brand-gray-600">
			Kami dapat mengirim ringkasan perusahaan, proyek berjalan, dan dokumen pendukung untuk Anda
			tinjau tanpa komitmen.
		</p>
		<div class="mt-4 flex flex-wrap gap-2">
			<a class="btn btn-primary btn-sm" href="/kontak">Hubungi manajemen</a>
			<a class="btn btn-outline btn-sm" href="/proyek">Lihat semua proyek</a>
		</div>
	</div>
</section>
