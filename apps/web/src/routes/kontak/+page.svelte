<script lang="ts">
	import LeadForm from '#lib/components/site/LeadForm.svelte';
	import PageHero from '#lib/components/site/PageHero.svelte';

	const details = [
		{
			icon: 'icon-[mdi--map-marker-outline]',
			label: 'Kantor',
			value: 'Jl. Perintis Kemerdekaan, Tamalanrea, Makassar, Sulawesi Selatan'
		},
		{
			icon: 'icon-[mdi--clock-outline]',
			label: 'Jam operasional',
			value: 'Senin–Sabtu, 09.00–17.00 WITA'
		},
		{
			icon: 'icon-[mdi--email-outline]',
			label: 'Email',
			value: 'azettaidofficial@gmail.com'
		},
		{
			icon: 'icon-[mdi--phone-outline]',
			label: 'Telepon',
			value: 'Hubungi melalui formulir untuk mendapatkan nomor tim yang bertugas'
		}
	];
</script>

<svelte:head>
	<title>Kontak — Bicara dengan Tim Azetta</title>
	<meta
		name="description"
		content="Hubungi tim Azetta untuk pertanyaan unit, kerja sama lahan, atau informasi proyek. Balasan pada jam kerja maksimal 2 jam."
	/>
</svelte:head>

<PageHero
	breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Kontak' }]}
	eyebrow="Kontak"
	title="Bicara dengan tim kami"
	description="Ceritakan unit yang Anda incar atau lahan yang ingin dikerjasamakan. Kami balas dengan informasi yang relevan, bukan daftar harga panjang."
/>

<div class="mx-auto max-w-6xl px-4 py-12">
	<div class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
		<div>
			<h2 class="text-xl">Informasi kontak</h2>
			<ul class="mt-6 space-y-5">
				{#each details as detail (detail.label)}
					<li class="flex gap-3">
						<span class="{detail.icon} mt-0.5 size-5 shrink-0"></span>
						<div>
							<p class="text-xs font-bold tracking-wide text-brand-gray-600 uppercase">
								{detail.label}
							</p>
							<p class="mt-1 text-sm">{detail.value}</p>
						</div>
					</li>
				{/each}
			</ul>

			<div
				class="mt-8 grid aspect-[4/3] place-items-center rounded-[1rem] border border-brand-line bg-brand-mist text-center text-sm text-brand-gray-600"
			>
				<span>
					Peta lokasi kantor<br />
					<span class="text-xs">(placeholder — disambungkan ke penyedia peta saat rilis)</span>
				</span>
			</div>
		</div>

		<div class="rounded-[1rem] border border-brand-line bg-white p-6">
			<h2 class="text-xl">Kirim pesan</h2>
			<p class="mt-2 text-sm text-brand-gray-600">
				Balasan pada jam kerja maksimal 2 jam. Data hanya dipakai untuk menindaklanjuti pesan Anda.
			</p>
			<div class="mt-6">
				<LeadForm
					submitLabel="Kirim pesan"
					messagePlaceholder="Saya ingin menanyakan unit Tipe 45 di Tamalanrea"
				/>
			</div>
		</div>
	</div>
</div>
