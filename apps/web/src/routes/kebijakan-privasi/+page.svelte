<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- mockup: sebagian rute tujuan belum dibangun */
	import PageHero from '#lib/components/site/PageHero.svelte';

	const sections = [
		{
			heading: 'Data yang kami kumpulkan',
			paragraphs: [
				'Nama, nomor WhatsApp, alamat email, dan kota yang Anda isi pada formulir pengajuan unit atau lahan.',
				'Data teknis kunjungan seperti halaman yang dibuka dan jenis perangkat, untuk memahami bagian situs yang perlu diperbaiki.'
			]
		},
		{
			heading: 'Tujuan penggunaan',
			paragraphs: [
				'Menindaklanjuti pertanyaan dan pengajuan Anda, termasuk menghubungi melalui WhatsApp atau email yang Anda berikan.',
				'Menyusun laporan internal mengenai jumlah dan jenis pengajuan. Laporan tersebut tidak memuat data pribadi yang dapat diidentifikasi.'
			]
		},
		{
			heading: 'Penyimpanan dan pembagian data',
			paragraphs: [
				'Data disimpan pada penyedia layanan yang kami gunakan untuk menjalankan situs dan basis data. Kami tidak menjual data pribadi kepada pihak lain.',
				'Data hanya dibagikan kepada pihak yang terlibat dalam pengajuan Anda, misalnya tim proyek atau penasihat hukum, sejauh diperlukan.'
			]
		},
		{
			heading: 'Masa simpan',
			paragraphs: [
				'Data pengajuan disimpan selama diperlukan untuk menindaklanjuti pengajuan dan memenuhi kewajiban administrasi. Setelah itu, data dihapus atau dianonimkan.'
			]
		},
		{
			heading: 'Hak Anda',
			paragraphs: [
				'Anda dapat meminta salinan, pembaruan, atau penghapusan data pribadi yang kami simpan. Permintaan diarahkan ke alamat email di bawah dan akan kami tanggapi pada jam kerja.'
			]
		},
		{
			heading: 'Kontak',
			paragraphs: [
				'Pertanyaan mengenai kebijakan ini dapat dikirim ke azettaidofficial@gmail.com atau melalui halaman kontak.'
			]
		}
	];
</script>

<svelte:head>
	<title>Kebijakan Privasi — Azetta</title>
	<meta
		name="description"
		content="Cara Azetta mengumpulkan, menggunakan, dan menyimpan data pribadi yang Anda kirim melalui situs ini."
	/>
</svelte:head>

<PageHero
	breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Kebijakan Privasi' }]}
	eyebrow="Legal"
	title="Kebijakan Privasi"
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
		Lihat juga <a class="link link-hover font-bold" href="/syarat-ketentuan"
			>Syarat &amp; Ketentuan</a
		>.
	</p>
</article>
