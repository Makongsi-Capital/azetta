<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- mockup: rute FAQ belum dibangun */
	import LeadForm from '#lib/components/site/LeadForm.svelte';
	import PageHero from '#lib/components/site/PageHero.svelte';

	const schemes = [
		{
			title: 'Lahan dijual',
			body: 'Azetta membeli lahan Anda dengan harga yang disepakati. Kepemilikan berpindah, dan seluruh risiko pengembangan menjadi tanggungan kami.',
			points: [
				'Pembayaran bertahap sesuai kesepakatan',
				'Biaya perizinan dan pengurugan ditanggung Azetta',
				'Proses lebih singkat, hasil lebih pasti'
			]
		},
		{
			title: 'Bangun bersama',
			body: 'Lahan tetap milik Anda. Azetta menyiapkan modal pembangunan, izin, dan pemasaran; hasil penjualan unit dibagi setelah biaya dikembalikan.',
			points: [
				'Kepemilikan lahan tidak berpindah',
				'Pembagian hasil dan biaya ditulis rinci',
				'Laporan progres berkala dan akses pemeriksaan'
			]
		}
	];

	const steps = [
		{
			title: 'Ajukan lahan',
			description:
				'Kirim lokasi, luas, dan status kepemilikan. Kajian awal gratis dan tidak mengikat.'
		},
		{
			title: 'Survei dan kajian',
			description: 'Tim meninjau akses, kontur, dan potensi unit, lalu menyusun rekomendasi skema.'
		},
		{
			title: 'Kesepakatan',
			description: 'Skema, biaya, dan jangka waktu ditulis sebelum pekerjaan apa pun dimulai.'
		}
	];
</script>

<svelte:head>
	<title>Jual atau Kerja Sama Lahan dengan Developer — Azetta</title>
	<meta
		name="description"
		content="Punya lahan? Azetta membeli lahan atau membangun bersama Anda, lalu unitnya dijual. Lihat skema, syarat, dan alurnya."
	/>
</svelte:head>

<PageHero
	breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Kerja Sama Lahan' }]}
	eyebrow="Layanan"
	title="Punya lahan? Jual, atau bangun bersama Azetta."
	description="Dua skema, satu prinsip: biaya dan pembagian hasil ditulis sebelum pekerjaan dimulai. Kajian awal gratis dan tidak mengikat."
/>

<section class="mx-auto max-w-6xl px-4 py-14">
	<h2 class="text-2xl md:text-3xl">Dua skema yang tersedia</h2>
	<div class="mt-8 grid gap-5 md:grid-cols-2">
		{#each schemes as scheme (scheme.title)}
			<article class="card border border-brand-line bg-white">
				<div class="card-body gap-3">
					<h3 class="card-title text-lg">{scheme.title}</h3>
					<p class="text-sm text-brand-gray-600">{scheme.body}</p>
					<ul class="mt-2 space-y-2 text-sm">
						{#each scheme.points as point (point)}
							<li class="flex gap-2">
								<span class="icon-[mdi--check-decagram-outline] mt-0.5 size-4 shrink-0"></span>
								{point}
							</li>
						{/each}
					</ul>
				</div>
			</article>
		{/each}
	</div>
</section>

<section class="border-y border-brand-line bg-brand-mist">
	<div class="mx-auto max-w-6xl px-4 py-14">
		<h2 class="text-2xl md:text-3xl">Alur pengajuan</h2>
		<ol class="steps mt-8 w-full">
			{#each steps as step (step.title)}
				<li class="step step-primary">{step.title}</li>
			{/each}
		</ol>
		<div class="mt-8 grid gap-6 md:grid-cols-3">
			{#each steps as step, index (step.title)}
				<div class="border-t border-brand-line pt-4">
					<p class="text-xs font-bold text-brand-gray-600 tabular-nums">0{index + 1}</p>
					<p class="mt-1 text-sm">{step.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="mx-auto max-w-6xl px-4 py-14">
	<div class="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
		<div>
			<h2 class="text-2xl md:text-3xl">Yang perlu disiapkan</h2>
			<ul class="mt-6 space-y-3 text-sm text-brand-gray-600">
				<li class="flex gap-2">
					<span class="icon-[mdi--file-document-outline] mt-0.5 size-4 shrink-0"></span>
					Salinan sertifikat atau bukti kepemilikan lain.
				</li>
				<li class="flex gap-2">
					<span class="icon-[mdi--map-marker-outline] mt-0.5 size-4 shrink-0"></span>
					Lokasi dan batas lahan, termasuk lebar jalan masuk.
				</li>
				<li class="flex gap-2">
					<span class="icon-[mdi--ruler-square] mt-0.5 size-4 shrink-0"></span>
					Luas tanah menurut dokumen dan hasil ukur lapangan.
				</li>
				<li class="flex gap-2">
					<span class="icon-[mdi--clock-outline] mt-0.5 size-4 shrink-0"></span>
					Maksud Anda: dijual, dibangun bersama, atau masih menimbang.
				</li>
			</ul>
			<p class="mt-6 text-sm text-brand-gray-600">
				Punya pertanyaan sebelum mengisi? Baca <a class="link link-hover font-bold" href="/faq"
					>pertanyaan umum</a
				>.
			</p>
		</div>

		<div class="rounded-[1rem] border border-brand-line bg-white p-6">
			<h2 class="text-xl">Ajukan lahan Anda</h2>
			<p class="mt-2 text-sm text-brand-gray-600">
				Diisi kurang dari dua menit. Tim kami menghubungi dalam 1×24 jam kerja.
			</p>
			<div class="mt-6">
				<LeadForm
					submitLabel="Kirim pengajuan"
					messagePlaceholder="Lokasi, luas, status kepemilikan, dan maksud Anda"
					withCity
				/>
			</div>
		</div>
	</div>
</section>
