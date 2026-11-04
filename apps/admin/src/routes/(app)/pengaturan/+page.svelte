<script lang="ts">
	import PageHeader from '#lib/components/admin/PageHeader.svelte';
	import Panel from '#lib/components/admin/Panel.svelte';
	import { formatDateTime } from '#lib/format.js';
	import { currentUser, MOCK_NOW } from '#lib/mock/admin.js';

	let siteName = $state('Azetta');
	let tagline = $state('Rumah tapak, kerja sama lahan, dan proyek properti.');
	let siteDescription = $state(
		'Azetta membangun rumah tapak di Yogyakarta dan membuka kerja sama lahan bagi pemilik yang ingin mengembangkan properti.'
	);
	let whatsapp = $state('6281234567890');
	let email = $state('halo@azetta.id');
	let phone = $state('0274 555 123');
	let address = $state('Jl. Kaliurang KM 9, Sleman, DI Yogyakarta');
	let operationalHours = $state('Senin–Sabtu, 09.00–17.00 WIB');

	let privacyUrl = $state('/kebijakan-privasi');
	let termsUrl = $state('/syarat-ketentuan');
	let legalDocumentName = $state('legal-azetta-2026.pdf');

	let ga4MeasurementId = $state('G-XXXXXXX');
	let metaPixelId = $state('');

	let logoUrl = $state('/brand/logo-azetta.svg');
	let faviconUrl = $state('/brand/favicon.svg');

	let notice = $state('');

	function save(event: SubmitEvent) {
		event.preventDefault();
		notice = `Pengaturan disimpan (demo) oleh ${currentUser.name}. Perubahan nyata akan tercatat di audit log.`;
	}

	function mockUpload(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		notice = `Berkas ${file.name} siap diunggah (demo). Presign R2 belum tersambung.`;
	}
</script>

<svelte:head>
	<title>Pengaturan — Azetta Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PageHeader
	eyebrow="Sistem"
	title="Pengaturan situs"
	description="Identitas, kontak, legal, dan analitik yang dipakai situs publik. Perubahan berlaku setelah disimpan."
>
	{#snippet actions()}
		<span class="badge badge-outline badge-sm">
			Diperbarui {formatDateTime(MOCK_NOW)}
		</span>
	{/snippet}
</PageHeader>

{#if notice}
	<div class="alert alert-info mt-6 border border-brand-line">
		<span class="icon-[mdi--check-circle-outline] size-5"></span>
		<span class="text-sm">{notice}</span>
		<button
			class="btn btn-ghost btn-xs"
			type="button"
			onclick={() => (notice = '')}
			aria-label="Tutup notifikasi"
		>
			<span class="icon-[mdi--close] size-4"></span>
		</button>
	</div>
{/if}

<form onsubmit={save}>
	<div class="mt-6 grid gap-6 xl:grid-cols-2">
		<Panel title="Identitas situs" description="Dipakai pada judul, meta description, dan footer.">
			<div class="grid gap-4">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Nama situs *</legend>
					<input class="input w-full" required bind:value={siteName} />
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Tagline</legend>
					<input class="input w-full" bind:value={tagline} />
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Deskripsi singkat</legend>
					<textarea class="textarea w-full" rows="4" maxlength="320" bind:value={siteDescription}
					></textarea>
					<p class="mt-1 text-xs text-brand-gray-600">
						{siteDescription.length}/320 karakter
					</p>
				</fieldset>
			</div>
		</Panel>

		<Panel title="Kontak" description="Ditampilkan di footer dan tombol WhatsApp.">
			<div class="grid gap-4">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Nomor WhatsApp *</legend>
					<input class="input w-full" required inputmode="tel" bind:value={whatsapp} />
					<p class="mt-1 text-xs text-brand-gray-600">
						Format internasional tanpa tanda plus, contoh 6281234567890.
					</p>
				</fieldset>

				<div class="grid gap-4 sm:grid-cols-2">
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Email *</legend>
						<input class="input w-full" type="email" required bind:value={email} />
					</fieldset>
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Telepon kantor</legend>
						<input class="input w-full" bind:value={phone} />
					</fieldset>
				</div>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Alamat</legend>
					<textarea class="textarea w-full" rows="2" bind:value={address}></textarea>
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Jam operasional</legend>
					<input class="input w-full" bind:value={operationalHours} />
				</fieldset>
			</div>
		</Panel>

		<Panel title="Legal" description="Tautan dokumen yang tampil di footer.">
			<div class="grid gap-4">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Kebijakan privasi</legend>
					<input class="input w-full" bind:value={privacyUrl} />
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Syarat & ketentuan</legend>
					<input class="input w-full" bind:value={termsUrl} />
				</fieldset>

				<div class="border border-brand-line p-3">
					<p class="text-xs font-bold text-brand-gray-600">Dokumen legal (PDF)</p>
					<p class="mt-1 text-sm">{legalDocumentName}</p>
					<input
						class="file-input file-input-sm mt-2 w-full"
						type="file"
						accept="application/pdf"
						onchange={mockUpload}
					/>
					<p class="mt-1 text-xs text-brand-gray-600">
						Maksimal 10 MB. Presign unggahan belum tersambung pada demo.
					</p>
				</div>
			</div>
		</Panel>

		<Panel title="Analitik" description="ID pelacakan opsional; kosongkan bila tidak dipakai.">
			<div class="grid gap-4">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">GA4 Measurement ID</legend>
					<input
						class="input w-full font-mono text-sm"
						placeholder="G-XXXXXXX"
						bind:value={ga4MeasurementId}
					/>
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Meta Pixel ID</legend>
					<input
						class="input w-full font-mono text-sm"
						placeholder="1234567890"
						bind:value={metaPixelId}
					/>
				</fieldset>

				<div class="alert alert-warning border-0 text-xs">
					<span class="icon-[mdi--shield-lock-outline] size-4"></span>
					<span>
						Analitik pihak ketiga hanya aktif bila pelacakan disetujui; event funnel tetap dikirim
						ke API internal.
					</span>
				</div>
			</div>
		</Panel>

		<Panel title="Aset merek" description="Logo dan favicon dipakai di web serta panel admin.">
			<div class="grid gap-4 sm:grid-cols-2">
				<div class="border border-brand-line p-3">
					<p class="text-xs font-bold text-brand-gray-600">Logo</p>
					<div class="mt-2 flex h-16 items-center justify-center bg-base-200">
						<img src={logoUrl} alt="Pratinjau logo" class="max-h-10" />
					</div>
					<input class="input input-sm mt-2 w-full font-mono text-xs" bind:value={logoUrl} />
					<input
						class="file-input file-input-sm mt-2 w-full"
						type="file"
						accept="image/*"
						onchange={mockUpload}
					/>
				</div>

				<div class="border border-brand-line p-3">
					<p class="text-xs font-bold text-brand-gray-600">Favicon</p>
					<div class="mt-2 flex h-16 items-center justify-center bg-base-200">
						<img src={faviconUrl} alt="Pratinjau favicon" class="size-8" />
					</div>
					<input class="input input-sm mt-2 w-full font-mono text-xs" bind:value={faviconUrl} />
					<input
						class="file-input file-input-sm mt-2 w-full"
						type="file"
						accept="image/*"
						onchange={mockUpload}
					/>
				</div>
			</div>
		</Panel>

		<Panel title="Catatan sistem">
			<dl class="grid gap-3 text-sm">
				<div class="flex items-center justify-between gap-3">
					<dt class="text-brand-gray-600">Penyimpanan</dt>
					<dd>Cloudflare R2</dd>
				</div>
				<div class="flex items-center justify-between gap-3">
					<dt class="text-brand-gray-600">Kunci setting</dt>
					<dd class="font-mono text-xs">site, contact, legal, analytics</dd>
				</div>
				<div class="flex items-center justify-between gap-3">
					<dt class="text-brand-gray-600">Terakhir diubah oleh</dt>
					<dd>{currentUser.name}</dd>
				</div>
			</dl>

			<p class="mt-4 border-t border-brand-line pt-4 text-xs text-brand-gray-600">
				Perubahan pengaturan dan unggahan aset dicatat di audit log dengan snapshot sebelum dan
				sesudah.
			</p>
		</Panel>
	</div>

	<div
		class="sticky bottom-0 z-20 mt-6 flex flex-wrap items-center justify-between gap-3 border border-brand-line bg-base-100/95 p-3 backdrop-blur"
	>
		<p class="text-xs text-brand-gray-600">
			Demo: nilai disimpan di memori halaman dan belum dikirim ke API.
		</p>
		<div class="flex flex-wrap gap-2">
			<a class="btn btn-ghost btn-sm" href="https://azetta.id" target="_blank" rel="noreferrer">
				Buka situs
			</a>
			<button class="btn btn-primary btn-sm" type="submit">Simpan pengaturan</button>
		</div>
	</div>
</form>
