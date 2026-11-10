<script lang="ts">
	import { enhance } from '$app/forms';
	import Turnstile from './Turnstile.svelte';
	import type { LeadType } from '#lib/api/types.js';

	interface LeadFormResult {
		success?: boolean;
		reference?: string;
		message?: string;
		values?: Record<string, string>;
	}

	interface Props {
		type: LeadType;
		unitId?: number;
		submitLabel?: string;
		messagePlaceholder?: string;
		withCity?: boolean;
		withLand?: boolean;
		form?: LeadFormResult | null;
	}

	let {
		type,
		unitId,
		submitLabel = 'Kirim',
		messagePlaceholder = 'Ceritakan kebutuhan Anda',
		withCity = false,
		withLand = false,
		form = null
	}: Props = $props();

	let submitting = $state(false);

	const values = $derived(form?.values ?? {});
</script>

{#if form?.success}
	<div role="status" class="alert alert-success">
		<span class="icon-[mdi--check-circle-outline] size-5 shrink-0"></span>
		<span>
			Pengajuan Anda tercatat{form.reference ? ` dengan nomor ${form.reference}` : ''}. Tim kami
			menghubungi Anda dalam 1 hari kerja.
		</span>
	</div>
{:else}
	<form
		method="POST"
		class="grid gap-4 sm:grid-cols-2"
		use:enhance={() => {
			submitting = true;
			return async ({ update }) => {
				await update();
				submitting = false;
				// Token Turnstile sekali pakai; reset supaya percobaan ulang tetap bisa dikirim.
				window.turnstile?.reset();
			};
		}}
	>
		<input type="hidden" name="type" value={type} />
		{#if unitId !== undefined}
			<input type="hidden" name="unitId" value={unitId} />
		{/if}
		<div class="hidden" aria-hidden="true">
			<label
				>Jangan diisi<input type="text" name="honeypot" tabindex="-1" autocomplete="off" /></label
			>
		</div>

		{#if form?.message}
			<p role="alert" class="alert alert-error sm:col-span-2">{form.message}</p>
		{/if}

		<fieldset class="fieldset">
			<legend class="fieldset-legend">Nama</legend>
			<input
				class="input w-full"
				name="name"
				required
				maxlength="120"
				placeholder="Nama sesuai KTP"
				value={values.name ?? ''}
			/>
		</fieldset>
		<fieldset class="fieldset">
			<legend class="fieldset-legend">WhatsApp</legend>
			<input
				class="input w-full"
				name="phone"
				type="tel"
				required
				maxlength="20"
				placeholder="08xx xxxx xxxx"
				value={values.phone ?? ''}
			/>
		</fieldset>

		{#if withCity}
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Kota</legend>
				<input
					class="input w-full"
					name="city"
					maxlength="80"
					placeholder="Makassar"
					value={values.city ?? ''}
				/>
			</fieldset>
		{/if}

		<fieldset class="fieldset {withCity ? '' : 'sm:col-span-2'}">
			<legend class="fieldset-legend">Email{withCity ? ' (opsional)' : ''}</legend>
			<input
				class="input w-full"
				name="email"
				type="email"
				maxlength="160"
				placeholder="nama@email.com"
				value={values.email ?? ''}
			/>
		</fieldset>

		{#if withLand}
			<fieldset class="fieldset sm:col-span-2">
				<legend class="fieldset-legend">Alamat lahan</legend>
				<input
					class="input w-full"
					name="landAddress"
					maxlength="200"
					placeholder="Jalan, RT/RW, kelurahan"
					value={values.landAddress ?? ''}
				/>
			</fieldset>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Provinsi</legend>
				<input
					class="input w-full"
					name="landProvince"
					maxlength="80"
					placeholder="Sulawesi Selatan"
					value={values.landProvince ?? ''}
				/>
			</fieldset>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Kecamatan</legend>
				<input
					class="input w-full"
					name="landDistrict"
					maxlength="80"
					placeholder="Tamalanrea"
					value={values.landDistrict ?? ''}
				/>
			</fieldset>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Luas (m²)</legend>
				<input
					class="input w-full"
					name="landArea"
					type="number"
					min="0"
					placeholder="800"
					value={values.landArea ?? ''}
				/>
			</fieldset>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Status kepemilikan</legend>
				<select class="select w-full" name="landOwnership">
					<option value="SHM" selected={values.landOwnership === 'SHM'}>SHM</option>
					<option value="SHGB" selected={values.landOwnership === 'SHGB'}>SHGB</option>
					<option value="AJB" selected={values.landOwnership === 'AJB'}>AJB</option>
					<option value="GIRIK" selected={values.landOwnership === 'GIRIK'}>Girik</option>
					<option value="LETTER_C" selected={values.landOwnership === 'LETTER_C'}>Letter C</option>
					<option value="OTHER" selected={values.landOwnership === 'OTHER'}>Lainnya</option>
				</select>
			</fieldset>
			<fieldset class="fieldset sm:col-span-2">
				<legend class="fieldset-legend">Maksud Anda</legend>
				<select class="select w-full" name="landScheme">
					<option value="JUAL" selected={values.landScheme === 'JUAL'}>Dijual</option>
					<option value="BAGI_HASIL" selected={values.landScheme === 'BAGI_HASIL'}>
						Bangun bersama (bagi hasil)
					</option>
					<option value="SEWA" selected={values.landScheme === 'SEWA'}>Disewa</option>
					<option value="BELUM_TAHU" selected={values.landScheme === 'BELUM_TAHU'}>
						Masih menimbang
					</option>
				</select>
			</fieldset>
		{/if}

		{#if withLand}
			<fieldset class="fieldset sm:col-span-2">
				<legend class="fieldset-legend">Foto lahan (opsional)</legend>
				<input
					class="file-input w-full"
					type="file"
					name="files"
					accept="image/jpeg,image/png,image/webp"
					multiple
				/>
				<p class="mt-1 text-xs text-brand-gray-600">
					Maksimal 5 foto, 5 MB per foto (JPEG/PNG/WebP). Berkas diunggah ke penyimpanan objek
					Azetta.
				</p>
			</fieldset>
		{/if}

		<fieldset class="fieldset sm:col-span-2">
			<legend class="fieldset-legend">Pesan</legend>
			<textarea class="textarea w-full" name="message" rows="3" placeholder={messagePlaceholder}
				>{values.message ?? ''}</textarea
			>
		</fieldset>

		<label class="flex items-start gap-2 text-sm sm:col-span-2">
			<input type="checkbox" class="checkbox checkbox-sm" name="consent" required />
			<span class="text-brand-gray-600">
				Saya setuju data ini diproses untuk keperluan tindak lanjut pengajuan.
			</span>
		</label>

		<Turnstile />

		<div class="sm:col-span-2">
			<button class="btn btn-primary w-full sm:w-auto" type="submit" disabled={submitting}>
				{submitting ? 'Mengirim…' : submitLabel}
			</button>
		</div>
	</form>
{/if}
