<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve, svelte/no-at-html-tags -- mockup: rute tujuan belum semua dibangun; JSON-LD berasal dari konstanta internal yang di-escape. */
	import ArticleCard from '#lib/components/site/ArticleCard.svelte';
	import PropertyCard from '#lib/components/site/PropertyCard.svelte';
	import ProjectCard from '#lib/components/site/ProjectCard.svelte';
	import SectionHeading from '#lib/components/site/SectionHeading.svelte';
	import { articles, featuredUnits, projects, testimonials } from '#lib/mock/site.js';
	import { jsonLdScript } from '#lib/seo.js';

	const heroPhoto =
		'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70';

	const stats = [
		{ value: '12', label: 'Unit tersedia dan indent' },
		{ value: '4', label: 'Proyek berjalan dan selesai' },
		{ value: '≤ 2 jam', label: 'Respons pada jam kerja' }
	];

	const steps = [
		{
			title: 'Pilih unit',
			description: 'Bandingkan tipe, luas, dan status ketersediaan dari render dan denah resmi.'
		},
		{
			title: 'Konsultasi & survei',
			description: 'Tim kami menjawab spesifikasi, legalitas, dan jadwal tinjauan lokasi.'
		},
		{
			title: 'KPR atau kesepakatan',
			description:
				'Skema pembayaran dan syarat ditulis sebelum tanda tangan, tanpa biaya tersembunyi.'
		},
		{
			title: 'Serah terima',
			description: 'Progres dilaporkan berkala sampai kunci diserahkan dan unit siap dihuni.'
		}
	];

	const jsonLd = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				'@id': 'https://azetta.id/#organization',
				name: 'Azetta',
				url: 'https://azetta.id',
				email: 'azettaidofficial@gmail.com',
				areaServed: 'ID'
			},
			{
				'@type': 'WebSite',
				'@id': 'https://azetta.id/#website',
				name: 'Azetta',
				url: 'https://azetta.id',
				publisher: { '@id': 'https://azetta.id/#organization' },
				potentialAction: {
					'@type': 'SearchAction',
					target: 'https://azetta.id/rumah?q={search_term_string}',
					'query-input': 'required name=search_term_string'
				}
			}
		]
	};

	const initials = (name: string) =>
		name
			.split(' ')
			.slice(0, 2)
			.map((part) => part.charAt(0))
			.join('');
</script>

<svelte:head>
	<title>Azetta — Rumah Tapak, Kerja Sama Lahan & Proyek Properti</title>
	<meta
		name="description"
		content="Azetta membangun dan menjual rumah tapak di Makassar, menerima kerja sama lahan, serta membuka informasi proyek dan investasi secara terbuka."
	/>
	{@html jsonLdScript(jsonLd)}
</svelte:head>

<section class="on-dark">
	<div
		class="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
	>
		<div>
			<p class="eyebrow">Rumah tapak &amp; kerja sama lahan</p>
			<h1 class="title-rule mt-4 max-w-xl text-4xl md:text-5xl">
				Rumah siap dihuni, dibangun oleh Azetta.
			</h1>
			<p class="mt-6 max-w-lg text-brand-gray-300 md:text-lg">
				Lahan Anda kami kelola, unitnya kami bangun dan pasarkan. Spesifikasi, legalitas, dan
				progres dilaporkan terbuka sejak kajian awal.
			</p>

			<div
				class="mt-8 flex flex-col gap-2 rounded-[1rem] border border-brand-line bg-white p-2 text-base-content sm:flex-row sm:items-center"
			>
				<div class="grid flex-1 gap-1 sm:grid-cols-3 sm:divide-x sm:divide-brand-line">
					<label class="relative flex flex-col gap-0.5 px-3 py-2">
						<span class="text-[0.7rem] font-bold tracking-wide text-brand-gray-600 uppercase">
							Lokasi
						</span>
						<select
							class="w-full appearance-none bg-transparent pr-6 text-sm font-bold focus:outline-none"
						>
							<option>Semua kota</option>
							<option>Makassar</option>
							<option>Gowa</option>
							<option>Maros</option>
						</select>
						<span
							class="icon-[mdi--chevron-down] pointer-events-none absolute right-3 bottom-2.5 size-4"
						></span>
					</label>
					<label class="relative flex flex-col gap-0.5 px-3 py-2">
						<span class="text-[0.7rem] font-bold tracking-wide text-brand-gray-600 uppercase">
							Tipe
						</span>
						<select
							class="w-full appearance-none bg-transparent pr-6 text-sm font-bold focus:outline-none"
						>
							<option>Semua tipe</option>
							<option>Tipe 36</option>
							<option>Tipe 45</option>
							<option>Tipe 60</option>
							<option>Tipe 70</option>
						</select>
						<span
							class="icon-[mdi--chevron-down] pointer-events-none absolute right-3 bottom-2.5 size-4"
						></span>
					</label>
					<label class="relative flex flex-col gap-0.5 px-3 py-2">
						<span class="text-[0.7rem] font-bold tracking-wide text-brand-gray-600 uppercase">
							Rentang harga
						</span>
						<select
							class="w-full appearance-none bg-transparent pr-6 text-sm font-bold focus:outline-none"
						>
							<option>Semua harga</option>
							<option>&lt; Rp 700 jt</option>
							<option>Rp 700 jt – Rp 1,5 M</option>
							<option>&gt; Rp 1,5 M</option>
						</select>
						<span
							class="icon-[mdi--chevron-down] pointer-events-none absolute right-3 bottom-2.5 size-4"
						></span>
					</label>
				</div>
				<a
					class="inline-flex w-full items-center justify-center gap-2 rounded-[0.5rem] bg-brand-ink px-4 py-2.5 text-sm font-bold text-brand-paper transition-colors hover:bg-brand-ink-2 sm:w-12 sm:px-0"
					href="/rumah"
					aria-label="Cari unit"
				>
					<span class="icon-[mdi--magnify] size-5"></span>
					<span class="sm:hidden">Cari unit</span>
				</a>
			</div>

			<p class="mt-4 text-sm text-brand-gray-500">
				Kajian awal gratis · Tanpa ikatan sampai akad · ±10 menit
			</p>
		</div>

		<div class="relative">
			<img
				src={heroPhoto}
				alt="Tampak depan rumah tapak Azetta"
				width="1200"
				height="900"
				fetchpriority="high"
				class="aspect-[4/3] w-full rounded-[1rem] object-cover"
			/>
			<div
				class="absolute bottom-4 left-4 rounded-[1rem] border border-brand-line bg-white px-4 py-3 text-base-content"
			>
				<p class="text-xs text-brand-gray-600">Unit tersedia</p>
				<p class="text-lg font-bold tabular-nums">12 unit</p>
			</div>
		</div>
	</div>
</section>

<section class="border-b border-brand-line bg-base-100">
	<div class="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3">
		{#each stats as stat (stat.label)}
			<div class="border-l-2 border-brand-ink pl-4">
				<p class="text-3xl font-bold tabular-nums">{stat.value}</p>
				<p class="mt-1 text-sm text-brand-gray-600">{stat.label}</p>
			</div>
		{/each}
	</div>
</section>

<section class="mx-auto max-w-6xl px-4 py-16">
	<SectionHeading
		eyebrow="Mulai dari sini"
		title="Pilih jalur Anda"
		description="Satu halaman, satu keputusan. Setiap jalur punya alur dan syarat yang dijelaskan lebih dulu."
	/>

	<div class="mt-8 grid gap-4 md:grid-cols-3">
		<a
			class="card border border-brand-line bg-white transition-colors hover:border-brand-gray-300"
			href="/rumah"
		>
			<div class="card-body gap-3">
				<span
					class="grid size-11 place-items-center rounded-[0.5rem] border border-brand-line bg-brand-mist"
				>
					<span class="icon-[mdi--home-city-outline] size-6"></span>
				</span>
				<h3 class="card-title text-base">Beli rumah</h3>
				<p class="text-sm text-brand-gray-600">
					Unit rumah tapak siap huni dan indent dari proyek Azetta, lengkap dengan luas, tipe, dan
					status ketersediaan.
				</p>
				<span class="mt-2 inline-flex items-center gap-1 text-sm font-bold">
					Lihat katalog
					<span class="icon-[mdi--arrow-right] size-4"></span>
				</span>
			</div>
		</a>

		<a
			class="card border border-brand-line bg-white transition-colors hover:border-brand-gray-300"
			href="/kerja-sama-lahan"
		>
			<div class="card-body gap-3">
				<span
					class="grid size-11 place-items-center rounded-[0.5rem] border border-brand-line bg-brand-mist"
				>
					<span class="icon-[mdi--handshake-outline] size-6"></span>
				</span>
				<h3 class="card-title text-base">Kerja sama lahan</h3>
				<p class="text-sm text-brand-gray-600">
					Lahan dijual atau dibangun bersama: kami sediakan modal, izin, dan pemasaran, lalu
					hasilnya dibagi sesuai kesepakatan tertulis.
				</p>
				<span class="mt-2 inline-flex items-center gap-1 text-sm font-bold">
					Tawarkan lahan
					<span class="icon-[mdi--arrow-right] size-4"></span>
				</span>
			</div>
		</a>

		<a
			class="card border border-brand-line bg-white transition-colors hover:border-brand-gray-300"
			href="/investasi"
		>
			<div class="card-body gap-3">
				<span
					class="grid size-11 place-items-center rounded-[0.5rem] border border-brand-line bg-brand-mist"
				>
					<span class="icon-[mdi--chart-line] size-6"></span>
				</span>
				<h3 class="card-title text-base">Informasi investasi</h3>
				<p class="text-sm text-brand-gray-600">
					Profil perusahaan, proyek berjalan, tata kelola, dan risiko yang perlu diketahui sebelum
					menghubungi manajemen.
				</p>
				<span class="mt-2 inline-flex items-center gap-1 text-sm font-bold">
					Baca ringkasan
					<span class="icon-[mdi--arrow-right] size-4"></span>
				</span>
			</div>
		</a>
	</div>
</section>

<section class="border-y border-brand-line bg-brand-mist">
	<div class="mx-auto max-w-6xl px-4 py-16">
		<SectionHeading
			eyebrow="Unit unggulan"
			title="Rumah yang bisa Anda tinjau sekarang"
			href="/rumah"
			linkLabel="Lihat semua unit"
		/>
		<div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each featuredUnits as unit (unit.slug)}
				<PropertyCard {unit} />
			{/each}
		</div>
	</div>
</section>

<section class="mx-auto max-w-6xl px-4 py-16">
	<SectionHeading
		eyebrow="Portofolio"
		title="Proyek yang sedang dan sudah berjalan"
		href="/proyek"
		linkLabel="Lihat semua proyek"
	/>
	<div class="mt-8 grid gap-5 md:grid-cols-3">
		{#each projects.slice(0, 3) as project (project.slug)}
			<ProjectCard {project} />
		{/each}
	</div>
</section>

<section class="border-y border-brand-line bg-brand-mist">
	<div class="mx-auto max-w-6xl px-4 py-16">
		<SectionHeading
			eyebrow="Cara kerja"
			title="Empat langkah, tanpa kejutan"
			description="Jumlah langkah, waktu pengisian, dan apa yang terjadi setelah Anda menghubungi kami dinyatakan sejak awal."
		/>

		<ol class="steps mt-8 w-full">
			{#each steps as step (step.title)}
				<li class="step step-primary">{step.title}</li>
			{/each}
		</ol>

		<div class="mt-8 grid gap-6 md:grid-cols-4">
			{#each steps as step, index (step.title)}
				<div class="border-t border-brand-line pt-4">
					<p class="text-xs font-bold text-brand-gray-600 tabular-nums">0{index + 1}</p>
					<p class="mt-1 text-sm">{step.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="on-dark">
	<div class="mx-auto max-w-6xl px-4 py-16">
		<SectionHeading
			tone="dark"
			eyebrow="Testimoni"
			title="Kata mereka yang sudah melewati prosesnya"
		/>
		<div class="mt-8 grid gap-5 md:grid-cols-3">
			{#each testimonials as item (item.name)}
				<blockquote class="card border border-brand-ink-3 bg-brand-ink-2">
					<div class="card-body gap-4">
						<p class="text-base text-brand-gray-300">“{item.quote}”</p>
						<footer class="mt-auto flex items-center gap-3">
							<span
								class="grid size-10 shrink-0 place-items-center rounded-full border border-brand-gray-500 text-sm font-bold"
							>
								{initials(item.name)}
							</span>
							<span>
								<span class="block text-sm font-bold">{item.name}</span>
								<span class="block text-xs text-brand-gray-500">{item.role}</span>
							</span>
						</footer>
					</div>
				</blockquote>
			{/each}
		</div>
	</div>
</section>

<section class="mx-auto max-w-6xl px-4 py-16">
	<SectionHeading
		eyebrow="Artikel"
		title="Panduan sebelum Anda memutuskan"
		href="/artikel"
		linkLabel="Lihat semua artikel"
	/>
	<div class="mt-8 grid gap-5 md:grid-cols-3">
		{#each articles as article (article.slug)}
			<ArticleCard {article} />
		{/each}
	</div>
</section>

<section class="on-dark">
	<div class="mx-auto max-w-6xl px-4 py-20">
		<p class="eyebrow">Ajakan</p>
		<h2 class="title-rule mt-3 max-w-2xl text-3xl md:text-4xl">
			Siap memiliki rumah? Bicara dengan tim kami.
		</h2>
		<p class="mt-6 max-w-xl text-brand-gray-300">
			Ceritakan kebutuhan dan anggaran Anda. Kami balas dengan unit atau skema lahan yang paling
			dekat, bukan dengan daftar harga panjang.
		</p>
		<div class="mt-8 flex flex-wrap gap-3">
			<a class="btn btn-primary" href="/kontak">Hubungi kami</a>
			<a class="btn btn-ghost" href="/rumah">Lihat katalog</a>
		</div>
	</div>
</section>
