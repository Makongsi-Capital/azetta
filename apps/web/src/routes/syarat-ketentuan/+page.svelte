<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- mockup: sebagian rute tujuan belum dibangun */
	import PageHero from '#lib/components/site/PageHero.svelte';

	const sections = [
		{
			heading: 'Ruang lingkup',
			paragraphs: [
				'Syarat ini berlaku untuk penggunaan situs Azetta dan pengajuan yang dikirim melalui formulir di dalamnya. Kesepakatan jual beli unit atau kerja sama lahan diatur dalam dokumen tersendiri yang ditandatangani para pihak.'
			]
		},
		{
			heading: 'Informasi di situs',
			paragraphs: [
				'Harga unit, luas, dan status ketersediaan bersifat indikatif dan dapat berubah. Gambar merupakan render atau foto contoh; hasil akhir mengikuti spesifikasi yang disepakati.',
				'Informasi investasi disediakan sebagai keterbukaan informasi dan bukan penawaran efek.'
			]
		},
		{
			heading: 'Akun pengguna',
			paragraphs: [
				'Akun diperlukan hanya untuk melihat riwayat pengajuan. Anda bertanggung jawab menjaga kerahasiaan kata sandi dan memberitahukan kami bila terjadi akses yang tidak Anda kenali.'
			]
		},
		{
			heading: 'Pengajuan unit dan lahan',
			paragraphs: [
				'Mengirim formulir tidak menciptakan kewajiban membeli atau menjual. Pengajuan menjadi mengikat hanya setelah ada kesepakatan tertulis yang ditandatangani kedua pihak.'
			]
		},
		{
			heading: 'Hak kekayaan intelektual',
			paragraphs: [
				'Logo, teks, render, dan tata letak situs merupakan milik Azetta atau pemberi lisensinya. Penggunaan komersial tanpa izin tertulis tidak diperkenankan.'
			]
		},
		{
			heading: 'Batasan tanggung jawab',
			paragraphs: [
				'Kami berupaya menjaga informasi tetap akurat, namun tidak menjamin situs bebas dari kesalahan teknis. Keputusan pembelian sebaiknya diambil setelah memeriksa dokumen dan lokasi secara langsung.'
			]
		},
		{
			heading: 'Perubahan ketentuan',
			paragraphs: [
				'Ketentuan dapat diperbarui sewaktu-waktu. Versi terbaru selalu ditampilkan di halaman ini beserta tanggal pembaruan.'
			]
		}
	];
</script>

<svelte:head>
	<title>Syarat &amp; Ketentuan — Azetta</title>
	<meta
		name="description"
		content="Ketentuan penggunaan situs Azetta, informasi harga indikatif, akun pengguna, dan batasan tanggung jawab."
	/>
</svelte:head>

<PageHero
	breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Syarat & Ketentuan' }]}
	eyebrow="Legal"
	title="Syarat &amp; Ketentuan"
	description="Terakhir diperbarui 30 Oktober 2026. Draf untuk peninjauan sebelum peluncuran."
/>

<article class="mx-auto max-w-6xl px-4 py-12">
	<div class="max-w-3xl">
		{#each sections as section (section.heading)}
			<section class="mt-10 first:mt-0">
				<h2 class="text-xl">{section.heading}</h2>
				{#each section.paragraphs as paragraph (paragraph)}
					<p class="mt-3 text-brand-gray-600">{paragraph}</p>
				{/each}
			</section>
		{/each}
	</div>

	<p class="mt-12 max-w-3xl border-t border-brand-line pt-6 text-sm text-brand-gray-600">
		Lihat juga <a class="link link-hover font-bold" href="/kebijakan-privasi">Kebijakan Privasi</a>.
	</p>
</article>
