<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- rute daftar lead sudah dibangun */
	import { untrack } from 'svelte';
	import PageHeader from '#lib/components/admin/PageHeader.svelte';
	import Panel from '#lib/components/admin/Panel.svelte';
	import StatusBadge from '#lib/components/admin/StatusBadge.svelte';
	import {
		formatDate,
		formatDateInput,
		formatDateTime,
		formatFileSize,
		formatRupiah,
		initials
	} from '#lib/format.js';
	import {
		activityTypeIcon,
		activityTypeLabel,
		budgetRangeLabel,
		expectedSchemeLabel,
		investmentInstrumentLabel,
		leadPriorityLabel,
		leadPriorityTone,
		leadSourceLabel,
		leadStatusLabel,
		leadStatusTone,
		leadTypeLabel,
		ownershipStatusLabel,
		riskProfileLabel,
		startTimelineLabel
	} from '#lib/labels.js';
	import { attachmentKindLabel } from '#lib/labels.js';
	import {
		currentUser,
		MOCK_NOW,
		staffUsers,
		type ActivityType,
		type LeadActivity,
		type LeadPriority,
		type LeadStatus
	} from '#lib/mock/admin.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lead = untrack(() => data.lead);

	let status = $state<string>(lead.status);
	let priority = $state<string>(lead.priority);
	let assignee = $state<string>(lead.assignedToId ?? '');
	let estimatedValue = $state<number>(lead.estimatedValue ?? 0);
	let followUp = $state(lead.nextFollowUpAt ? formatDateInput(lead.nextFollowUpAt) : '');
	let lostReason = $state(lead.lostReason ?? '');
	let customerNote = $state(lead.customerNote ?? '');

	let activities = $state<LeadActivity[]>([...lead.activities]);
	let activityType = $state<string>('NOTE');
	let activityBody = $state('');

	let notice = $state('');
	let errorMessage = $state('');
	let persistedStatus = $state<string>(lead.status);

	const orderedActivities = $derived([...activities].reverse());

	const phoneDigits = $derived(lead.phone.replace(/\D/g, '').replace(/^0/, '62'));
	const whatsappHref = $derived(
		`https://wa.me/${phoneDigits}?text=${encodeURIComponent(
			`Halo ${lead.name.split(' ')[0]}, saya dari Azetta menindaklanjuti pengajuan Anda (${lead.reference}).`
		)}`
	);

	const assigneeName = $derived(staffUsers.find((user) => user.id === assignee)?.name ?? null);

	const statusTone = $derived(leadStatusTone[status as LeadStatus] ?? 'badge-ghost');
	const statusLabel = $derived(leadStatusLabel[status as LeadStatus] ?? status);
	const priorityTone = $derived(leadPriorityTone[priority as LeadPriority] ?? 'badge-outline');
	const priorityLabel = $derived(leadPriorityLabel[priority as LeadPriority] ?? priority);

	function saveHandling() {
		notice = '';
		errorMessage = '';

		if (status === 'LOST' && !lostReason.trim()) {
			errorMessage = 'Alasan kalah wajib diisi sebelum menyimpan status LOST.';
			return;
		}

		if (status !== persistedStatus) {
			activities = [
				...activities,
				{
					id: Date.now(),
					type: 'STATUS_CHANGE',
					body: `Status ${leadStatusLabel[persistedStatus as LeadStatus] ?? persistedStatus} → ${statusLabel}.`,
					actorName: currentUser.name,
					createdAt: MOCK_NOW.toISOString()
				}
			];
			persistedStatus = status;
		}

		notice = 'Perubahan penanganan disimpan (demo).';
	}

	function addActivity(event: SubmitEvent) {
		event.preventDefault();
		const body = activityBody.trim();
		if (!body) return;

		activities = [
			...activities,
			{
				id: Date.now(),
				type: activityType as ActivityType,
				body,
				actorName: currentUser.name,
				createdAt: MOCK_NOW.toISOString()
			}
		];

		activityBody = '';
		notice = 'Aktivitas baru dicatat (demo).';
	}

	async function copyReference() {
		try {
			await navigator.clipboard.writeText(lead.reference);
			notice = 'Referensi lead disalin.';
		} catch {
			notice = `Referensi: ${lead.reference}`;
		}
	}
</script>

<svelte:head>
	<title>{lead.name} — Lead Azetta</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="mb-4">
	<a
		class="inline-flex items-center gap-1 text-xs font-bold text-brand-gray-600 hover:text-base-content"
		href="/leads"
	>
		<span class="icon-[mdi--chevron-left] size-4"></span>
		Kembali ke daftar lead
	</a>
</div>

<PageHeader eyebrow={leadTypeLabel[lead.type]} title={lead.name} description={lead.reference}>
	{#snippet actions()}
		<StatusBadge label={statusLabel} tone={statusTone} />
		<button class="btn btn-sm" type="button" onclick={copyReference}>
			<span class="icon-[mdi--content-copy] size-4"></span>
			Salin referensi
		</button>
		<a class="btn btn-primary btn-sm" href={whatsappHref} target="_blank" rel="noreferrer">
			<span class="icon-[mdi--whatsapp] size-4"></span>
			WhatsApp
		</a>
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

{#if errorMessage}
	<div class="alert alert-error mt-6 border-0">
		<span class="icon-[mdi--alert-circle-outline] size-5"></span>
		<span class="text-sm">{errorMessage}</span>
	</div>
{/if}

<div class="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
	<div class="grid gap-6">
		<Panel title="Kontak & permintaan">
			{#snippet actions()}
				<StatusBadge label={priorityLabel} tone={priorityTone} />
			{/snippet}

			<dl class="grid gap-x-6 gap-y-4 sm:grid-cols-2">
				<div>
					<dt class="text-xs text-brand-gray-600">Nomor telepon</dt>
					<dd class="mt-0.5 text-sm font-bold">{lead.phone}</dd>
				</div>
				<div>
					<dt class="text-xs text-brand-gray-600">Email</dt>
					<dd class="mt-0.5 text-sm font-bold">{lead.email ?? '—'}</dd>
				</div>
				<div>
					<dt class="text-xs text-brand-gray-600">Kota</dt>
					<dd class="mt-0.5 text-sm">{lead.city ?? '—'}</dd>
				</div>
				<div>
					<dt class="text-xs text-brand-gray-600">Sumber</dt>
					<dd class="mt-0.5 text-sm">{leadSourceLabel[lead.source]}</dd>
				</div>
				<div>
					<dt class="text-xs text-brand-gray-600">Masuk</dt>
					<dd class="mt-0.5 text-sm">{formatDateTime(lead.createdAt)}</dd>
				</div>
				<div>
					<dt class="text-xs text-brand-gray-600">Estimasi nilai</dt>
					<dd class="mt-0.5 text-sm font-bold tabular-nums">
						{estimatedValue ? formatRupiah(estimatedValue) : '—'}
					</dd>
				</div>
				{#if lead.designTitle}
					<div class="sm:col-span-2">
						<dt class="text-xs text-brand-gray-600">Unit yang diminati</dt>
						<dd class="mt-0.5 text-sm">
							{#if lead.designId}
								<a
									class="font-bold underline decoration-brand-line underline-offset-4"
									href="/unit/{lead.designId}"
								>
									{lead.designTitle}
								</a>
							{:else}
								{lead.designTitle}
							{/if}
						</dd>
					</div>
				{/if}
				{#if lead.message}
					<div class="sm:col-span-2">
						<dt class="text-xs text-brand-gray-600">Pesan dari pengunjung</dt>
						<dd class="mt-2 border-l-2 border-brand-line pl-3 text-sm whitespace-pre-line">
							{lead.message}
						</dd>
					</div>
				{/if}
			</dl>
		</Panel>

		{#if lead.landSubmission}
			{@const land = lead.landSubmission}
			<Panel title="Data lahan" description="Diisi pemilik lahan melalui formulir penawaran.">
				<dl class="grid gap-x-6 gap-y-4 sm:grid-cols-2">
					<div class="sm:col-span-2">
						<dt class="text-xs text-brand-gray-600">Alamat</dt>
						<dd class="mt-0.5 text-sm font-bold">{land.address}</dd>
					</div>
					<div>
						<dt class="text-xs text-brand-gray-600">Kecamatan / kota</dt>
						<dd class="mt-0.5 text-sm">
							{land.district ?? '—'}, {land.city}
						</dd>
					</div>
					<div>
						<dt class="text-xs text-brand-gray-600">Provinsi</dt>
						<dd class="mt-0.5 text-sm">{land.province}</dd>
					</div>
					<div>
						<dt class="text-xs text-brand-gray-600">Luas lahan</dt>
						<dd class="mt-0.5 text-sm tabular-nums">{land.areaM2} m²</dd>
					</div>
					<div>
						<dt class="text-xs text-brand-gray-600">Lebar depan</dt>
						<dd class="mt-0.5 text-sm tabular-nums">
							{land.frontageM ? `${land.frontageM} m` : '—'}
						</dd>
					</div>
					<div>
						<dt class="text-xs text-brand-gray-600">Status kepemilikan</dt>
						<dd class="mt-0.5 text-sm">{ownershipStatusLabel[land.ownershipStatus]}</dd>
					</div>
					<div>
						<dt class="text-xs text-brand-gray-600">Skema diharapkan</dt>
						<dd class="mt-0.5 text-sm">{expectedSchemeLabel[land.expectedScheme]}</dd>
					</div>
					<div>
						<dt class="text-xs text-brand-gray-600">Rencana mulai</dt>
						<dd class="mt-0.5 text-sm">
							{land.startTimeline ? startTimelineLabel[land.startTimeline] : '—'}
						</dd>
					</div>
					{#if land.notes}
						<div class="sm:col-span-2">
							<dt class="text-xs text-brand-gray-600">Catatan</dt>
							<dd class="mt-1 text-sm">{land.notes}</dd>
						</div>
					{/if}
				</dl>
			</Panel>
		{/if}

		{#if lead.investmentInterest}
			{@const investment = lead.investmentInterest}
			<Panel title="Minat investasi">
				<dl class="grid gap-x-6 gap-y-4 sm:grid-cols-2">
					<div>
						<dt class="text-xs text-brand-gray-600">Rentang anggaran</dt>
						<dd class="mt-0.5 text-sm font-bold">{budgetRangeLabel[investment.budgetRange]}</dd>
					</div>
					<div>
						<dt class="text-xs text-brand-gray-600">Horizon</dt>
						<dd class="mt-0.5 text-sm">
							{investment.horizonMonths ? `${investment.horizonMonths} bulan` : '—'}
						</dd>
					</div>
					<div>
						<dt class="text-xs text-brand-gray-600">Lokasi diminati</dt>
						<dd class="mt-0.5 text-sm">
							{investment.preferredLocations.join(', ') || '—'}
						</dd>
					</div>
					<div>
						<dt class="text-xs text-brand-gray-600">Profil risiko</dt>
						<dd class="mt-0.5 text-sm">{riskProfileLabel[investment.riskProfile]}</dd>
					</div>
					<div>
						<dt class="text-xs text-brand-gray-600">Instrumen</dt>
						<dd class="mt-0.5 text-sm">
							{investment.instrument
								? investmentInstrumentLabel[investment.instrument]
								: 'Belum ditentukan'}
						</dd>
					</div>
					{#if investment.notes}
						<div class="sm:col-span-2">
							<dt class="text-xs text-brand-gray-600">Catatan</dt>
							<dd class="mt-1 text-sm">{investment.notes}</dd>
						</div>
					{/if}
				</dl>
			</Panel>
		{/if}

		<Panel title="Lampiran" description="Foto lahan dan dokumen yang diunggah pemohon.">
			{#if lead.attachments.length === 0}
				<p class="text-sm text-brand-gray-600">Tidak ada lampiran.</p>
			{:else}
				<ul class="grid grid-cols-2 gap-3 sm:grid-cols-3">
					{#each lead.attachments as attachment (attachment.id)}
						<li class="overflow-hidden border border-brand-line">
							{#if attachment.mimeType.startsWith('image/')}
								<a href={attachment.url} target="_blank" rel="noreferrer" class="block">
									<img
										src={attachment.url}
										alt={attachment.fileName}
										class="aspect-[4/3] w-full object-cover"
										loading="lazy"
									/>
								</a>
							{:else}
								<a
									href={attachment.url}
									target="_blank"
									rel="noreferrer"
									aria-label="Buka {attachment.fileName}"
									class="flex aspect-[4/3] items-center justify-center bg-base-200"
								>
									<span class="icon-[mdi--file-pdf-box] size-10 text-brand-gray-500"></span>
								</a>
							{/if}
							<div class="p-2">
								<p class="truncate text-xs font-bold" title={attachment.fileName}>
									{attachment.fileName}
								</p>
								<p class="text-[11px] text-brand-gray-600">
									{attachmentKindLabel[attachment.kind]} · {formatFileSize(attachment.sizeBytes)}
								</p>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</Panel>

		<Panel
			title="Aktivitas"
			description="Catatan internal dan riwayat perubahan status lead."
			padded={false}
		>
			<div class="p-5">
				<form class="grid gap-3 rounded-lg bg-base-200/60 p-4" onsubmit={addActivity}>
					<div class="flex flex-wrap gap-2">
						<select
							class="select select-sm w-44 border-brand-line bg-white"
							aria-label="Jenis aktivitas"
							bind:value={activityType}
						>
							{#each Object.entries(activityTypeLabel).filter(([value]) => value !== 'SYSTEM' && value !== 'STATUS_CHANGE') as [value, label] (value)}
								<option {value}>{label}</option>
							{/each}
						</select>
						<span class="self-center text-xs text-brand-gray-600">oleh {currentUser.name}</span>
					</div>
					<textarea
						class="textarea w-full bg-white"
						rows="2"
						required
						placeholder="Tulis hasil telepon, WhatsApp, atau catatan internal…"
						bind:value={activityBody}></textarea>
					<div class="flex justify-end">
						<button class="btn btn-primary btn-sm" type="submit">Catat aktivitas</button>
					</div>
				</form>

				<ol class="mt-6 grid gap-4">
					{#each orderedActivities as activity (activity.id)}
						<li class="grid grid-cols-[2rem_1fr] gap-3">
							<span
								class="grid size-8 place-items-center rounded-full border border-brand-line bg-white"
							>
								<span class="{activityTypeIcon[activity.type]} size-4"></span>
							</span>
							<div class="min-w-0 border-b border-brand-line pb-4">
								<div class="flex flex-wrap items-baseline justify-between gap-2">
									<p class="text-sm font-bold">{activityTypeLabel[activity.type]}</p>
									<p class="text-[11px] text-brand-gray-600">
										{formatDateTime(activity.createdAt)}
									</p>
								</div>
								{#if activity.body}
									<p class="mt-1 text-sm text-brand-gray-600">{activity.body}</p>
								{/if}
								<p class="mt-1 text-[11px] text-brand-gray-500">{activity.actorName}</p>
							</div>
						</li>
					{/each}
				</ol>
			</div>
		</Panel>
	</div>

	<div class="grid content-start gap-6">
		<Panel title="Penanganan" description="Perubahan di halaman ini tercatat di audit log.">
			<div class="grid gap-4">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Status</legend>
					<select class="select w-full" bind:value={status}>
						{#each Object.entries(leadStatusLabel) as [value, label] (value)}
							<option {value}>{label}</option>
						{/each}
					</select>
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Prioritas</legend>
					<select class="select w-full" bind:value={priority}>
						{#each Object.entries(leadPriorityLabel) as [value, label] (value)}
							<option {value}>{label}</option>
						{/each}
					</select>
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">PIC</legend>
					<select class="select w-full" bind:value={assignee}>
						<option value="">Belum ditugaskan</option>
						{#each staffUsers as user (user.id)}
							<option value={user.id}>{user.name}</option>
						{/each}
					</select>
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Estimasi nilai (Rp)</legend>
					<input
						class="input w-full"
						type="number"
						min="0"
						step="1000000"
						bind:value={estimatedValue}
					/>
					<p class="mt-1 text-xs text-brand-gray-600">{formatRupiah(estimatedValue)}</p>
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Follow-up berikutnya</legend>
					<input class="input w-full" type="date" bind:value={followUp} />
				</fieldset>

				{#if status === 'LOST'}
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Alasan kalah *</legend>
						<textarea
							class="textarea w-full"
							rows="2"
							required
							placeholder="Wajib diisi saat status LOST"
							bind:value={lostReason}></textarea>
					</fieldset>
				{/if}

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Catatan pemohon</legend>
					<textarea
						class="textarea w-full"
						rows="4"
						placeholder="Ringkasan kebutuhan, anggaran, atau kendala"
						bind:value={customerNote}></textarea>
					<p class="mt-1 text-[11px] text-brand-gray-600">
						Terakhir diperbarui {formatDate(lead.updatedAt)}.
					</p>
				</fieldset>

				<button class="btn btn-primary w-full" type="button" onclick={saveHandling}>
					Simpan perubahan
				</button>
			</div>
		</Panel>

		<Panel title="Ringkasan">
			<dl class="grid gap-3 text-sm">
				<div class="flex items-center justify-between gap-3">
					<dt class="text-brand-gray-600">Tipe</dt>
					<dd class="font-bold">{leadTypeLabel[lead.type]}</dd>
				</div>
				<div class="flex items-center justify-between gap-3">
					<dt class="text-brand-gray-600">Kontak pertama</dt>
					<dd class="text-right">
						{lead.firstContactedAt ? formatDateTime(lead.firstContactedAt) : 'Belum'}
					</dd>
				</div>
				<div class="flex items-center justify-between gap-3">
					<dt class="text-brand-gray-600">Kontak terakhir</dt>
					<dd class="text-right">
						{lead.lastContactedAt ? formatDateTime(lead.lastContactedAt) : 'Belum'}
					</dd>
				</div>
				<div class="flex items-center justify-between gap-3">
					<dt class="text-brand-gray-600">Jumlah aktivitas</dt>
					<dd class="font-bold tabular-nums">{activities.length}</dd>
				</div>
				<div class="flex items-center justify-between gap-3">
					<dt class="text-brand-gray-600">Lampiran</dt>
					<dd class="font-bold tabular-nums">{lead.attachments.length}</dd>
				</div>
			</dl>

			{#if lead.lostReason}
				<div class="mt-4 border-t border-brand-line pt-4">
					<p class="eyebrow">Alasan kalah</p>
					<p class="mt-1 text-xs text-brand-gray-600">{lead.lostReason}</p>
				</div>
			{/if}
		</Panel>

		<Panel title="PIC saat ini">
			{#if assigneeName}
				<div class="flex items-center gap-3">
					<span class="grid size-10 place-items-center rounded-full bg-base-200 text-xs font-bold">
						{initials(assigneeName)}
					</span>
					<div>
						<p class="text-sm font-bold">{assigneeName}</p>
						<p class="text-xs text-brand-gray-600">Lead ditugaskan</p>
					</div>
				</div>
			{:else}
				<p class="text-sm text-brand-gray-600">
					Belum ada PIC. Pilih penanggung jawab di panel penanganan.
				</p>
			{/if}
		</Panel>
	</div>
</div>
