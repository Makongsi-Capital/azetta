<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve, svelte/no-at-html-tags -- mockup: rute belum dibangun; JSON-LD berasal dari konstanta yang di-escape. */
	import PageHero from '#lib/components/site/PageHero.svelte';
	import { faqs } from '#lib/mock/site.js';
	import { jsonLdScript } from '#lib/seo.js';

	const categories = [...new Set(faqs.map((faq) => faq.category))];

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: { '@type': 'Answer', text: faq.answer }
		}))
	};
</script>

<svelte:head>
	<title>Pertanyaan Umum — Azetta</title>
	<meta
		name="description"
		content="Jawaban singkat soal unit rumah, kerja sama lahan, dan informasi investasi Azetta."
	/>
	{@html jsonLdScript(jsonLd)}
</svelte:head>

<PageHero
	breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'FAQ' }]}
	eyebrow="Pertanyaan umum"
	title="Hal yang paling sering ditanyakan"
	description="Belum menemukan jawabannya? Kirim pertanyaan lewat halaman kontak; kami balas pada jam kerja."
/>

<div class="mx-auto max-w-6xl px-4 py-12">
	<div class="max-w-3xl">
		{#each categories as category (category)}
			<section class="mt-10 first:mt-0">
				<h2 class="eyebrow">{category}</h2>
				<div
					class="mt-4 divide-y divide-brand-line overflow-hidden rounded-[1rem] border border-brand-line bg-white"
				>
					{#each faqs.filter((faq) => faq.category === category) as faq (faq.question)}
						<details class="group p-5">
							<summary class="flex cursor-pointer items-start justify-between gap-4 font-bold">
								{faq.question}
								<span
									class="icon-[mdi--chevron-down] mt-0.5 size-5 shrink-0 transition-transform group-open:rotate-180"
								></span>
							</summary>
							<p class="mt-3 text-sm text-brand-gray-600">{faq.answer}</p>
						</details>
					{/each}
				</div>
			</section>
		{/each}

		<div class="mt-12 rounded-[1rem] border border-brand-line bg-white p-6">
			<p class="font-bold">Masih ada yang ingin ditanyakan?</p>
			<p class="mt-2 text-sm text-brand-gray-600">
				Kirim pertanyaan Anda, sertakan unit atau lahan yang dimaksud agar jawabannya lebih tepat.
			</p>
			<div class="mt-4 flex flex-wrap gap-2">
				<a class="btn btn-primary btn-sm" href="/kontak">Hubungi kami</a>
				<a class="btn btn-ghost btn-sm" href="/kerja-sama-lahan">Kerja sama lahan</a>
			</div>
		</div>
	</div>
</div>
