<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- mockup: rute tujuan belum dibangun */
	import { formatPrice } from '#lib/format.js';
	import { account, ownedUnits, submissions } from '#lib/mock/account.js';

	const averageProgress = Math.round(
		ownedUnits.reduce((total, unit) => total + unit.progress, 0) / ownedUnits.length
	);

	const nextPayment = ownedUnits
		.flatMap((unit) => unit.payments)
		.find((payment) => payment.status === 'JATUH TEMPO');

	const activeSubmissions = submissions.filter((item) => item.status !== 'SELESAI').length;
	const availableDocuments = ownedUnits.reduce(
		(total, unit) => total + unit.documents.filter((doc) => doc.available).length,
		0
	);

	const submissionTone = (status: string) =>
		status === 'SELESAI' ? 'badge-success' : status === 'KAJIAN' ? 'badge-warning' : 'badge-info';

	const submissionLabel = (status: string) =>
		status === 'SELESAI' ? 'Selesai' : status === 'KAJIAN' ? 'Dalam kajian' : 'Sudah dihubungi';
</script>

<svelte:head>
	<title>Akun Saya — Azetta</title>
	<meta name="robots" content="noindex" />
	<meta
		name="description"
		content="Pantau progres unit, jadwal termin, dan status pengajuan Anda di Azetta."
	/>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10">
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-3xl md:text-4xl">Proyek Anda</h1>
			<p class="mt-3 max-w-2xl text-sm text-brand-gray-600">
				Halo {account.name.split(' ')[0]}. Berikut ringkasan progres, termin, dan pengajuan yang
				tercatat atas nama Anda.
			</p>
		</div>
		<p class="text-xs text-brand-gray-600">Anggota sejak {account.memberSince}</p>
	</div>

	<dl
		class="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[1rem] border border-brand-line bg-brand-line sm:grid-cols-4"
	>
		<div class="bg-white p-4">
			<dt class="text-xs text-brand-gray-600">Progres rata-rata</dt>
			<dd class="mt-1 text-lg font-bold tabular-nums">{averageProgress}%</dd>
		</div>
		<div class="bg-white p-4">
			<dt class="text-xs text-brand-gray-600">Termin berikutnya</dt>
			<dd class="mt-1 text-lg font-bold tabular-nums">
				{nextPayment ? formatPrice(nextPayment.amount) : '—'}
			</dd>
			<p class="text-xs text-brand-gray-600">{nextPayment ? nextPayment.dueDate : 'Tidak ada'}</p>
		</div>
		<div class="bg-white p-4">
			<dt class="text-xs text-brand-gray-600">Pengajuan aktif</dt>
			<dd class="mt-1 text-lg font-bold tabular-nums">{activeSubmissions}</dd>
		</div>
		<div class="bg-white p-4">
			<dt class="text-xs text-brand-gray-600">Dokumen tersedia</dt>
			<dd class="mt-1 text-lg font-bold tabular-nums">{availableDocuments}</dd>
		</div>
	</dl>

	<section class="mt-12">
		<h2 class="text-2xl">Unit yang Anda pantau</h2>
		<div class="mt-6 grid gap-5 md:grid-cols-2">
			{#each ownedUnits as unit (unit.id)}
				<article class="card border border-brand-line bg-white">
					<figure class="aspect-[16/9] overflow-hidden rounded-t-[1rem] bg-brand-mist">
						<img
							src={unit.cover}
							alt="Unit {unit.unitTitle}"
							width="900"
							height="506"
							loading="lazy"
							class="h-full w-full object-cover"
						/>
					</figure>
					<div class="card-body gap-3 p-5">
						<div class="flex flex-wrap items-center gap-2">
							<span
								class="badge badge-sm border-0 {unit.progress === 100
									? 'badge-success'
									: 'badge-info'}"
							>
								{unit.progress === 100 ? 'Serah terima selesai' : 'Sedang dibangun'}
							</span>
							<span class="text-xs text-brand-gray-600">{unit.projectTitle}</span>
						</div>

						<h3 class="text-base font-bold">{unit.unitTitle}</h3>
						<p class="inline-flex items-center gap-1 text-sm text-brand-gray-600">
							<span class="icon-[mdi--map-marker-outline] size-4 shrink-0"></span>
							{unit.location}
						</p>

						<div>
							<div class="flex items-center justify-between text-xs text-brand-gray-600">
								<span>Progres</span>
								<span class="font-bold text-base-content tabular-nums">{unit.progress}%</span>
							</div>
							<div
								class="mt-1 h-2 rounded-full bg-brand-line"
								role="progressbar"
								aria-label="Progres {unit.unitTitle}"
								aria-valuenow={unit.progress}
								aria-valuemin="0"
								aria-valuemax="100"
							>
								<div class="h-2 rounded-full bg-brand-ink" style="width: {unit.progress}%"></div>
							</div>
						</div>

						<p class="text-sm text-brand-gray-600">
							Tahap: <span class="font-bold text-base-content">{unit.stage}</span>
						</p>

						<div
							class="mt-2 flex flex-wrap items-end justify-between gap-3 border-t border-brand-line pt-3"
						>
							<p class="text-xs text-brand-gray-600">
								Target serah terima<br />
								<span class="text-sm font-bold text-base-content">{unit.handoverTarget}</span>
							</p>
							<a class="btn btn-outline btn-sm" href="/akun/proyek/{unit.id}">Pantau proyek</a>
						</div>
					</div>
				</article>
			{/each}
		</div>
	</section>

	<section id="pengajuan" class="mt-12">
		<h2 class="text-2xl">Pengajuan Anda</h2>
		<p class="mt-2 text-sm text-brand-gray-600">
			Status pengajuan unit dan lahan yang pernah Anda kirim.
		</p>

		<ul
			class="mt-6 divide-y divide-brand-line overflow-hidden rounded-[1rem] border border-brand-line bg-white"
		>
			{#each submissions as item (item.id)}
				<li class="flex flex-wrap items-center gap-3 p-4">
					<span class="badge badge-outline badge-sm">{item.kind}</span>
					<div class="mr-auto min-w-0">
						<p class="text-sm font-bold">{item.title}</p>
						<p class="text-xs text-brand-gray-600">{item.id} · dikirim {item.submittedAt}</p>
						<p class="mt-1 text-xs text-brand-gray-600">{item.note}</p>
					</div>
					<span class="badge badge-sm border-0 {submissionTone(item.status)}">
						{submissionLabel(item.status)}
					</span>
				</li>
			{/each}
		</ul>
	</section>

	<div class="mt-12 rounded-[1rem] border border-brand-line bg-white p-6">
		<p class="font-bold">Ada unit atau lahan lain yang ingin Anda tinjau?</p>
		<p class="mt-2 text-sm text-brand-gray-600">
			Kami bisa mengirim daftar unit terbaru atau menjadwalkan survei lokasi.
		</p>
		<div class="mt-4 flex flex-wrap gap-2">
			<a class="btn btn-primary btn-sm" href="/kontak">Hubungi kami</a>
			<a class="btn btn-ghost btn-sm" href="/rumah">Lihat katalog</a>
		</div>
	</div>
</div>
