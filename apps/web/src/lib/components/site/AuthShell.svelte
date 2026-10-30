<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- mockup: sebagian rute tujuan belum dibangun */
	import Logo from '#lib/components/Logo.svelte';

	interface Props {
		title: string;
		description: string;
		children: import('svelte').Snippet;
	}

	let { title, description, children }: Props = $props();

	const benefits = [
		'Progres dan foto lapangan diperbarui tiap bulan',
		'Jadwal termin dan dokumen perjanjian di satu tempat',
		'Kontak PIC proyek Anda, bukan nomor umum'
	];
</script>

<div class="grid lg:min-h-[calc(100vh-5rem)] lg:grid-cols-2">
	<div class="on-dark hidden flex-col justify-between p-10 lg:flex">
		<a class="text-brand-paper" href="/" aria-label="AZETTA — beranda">
			<Logo size={30} />
		</a>

		<div class="py-14">
			<p class="eyebrow">Akun Azetta</p>
			<h2 class="title-rule mt-3 max-w-md text-3xl">
				Pantau progres proyek Anda dari satu tempat.
			</h2>
			<ul class="mt-8 space-y-3 text-sm text-brand-gray-300">
				{#each benefits as benefit (benefit)}
					<li class="flex gap-2">
						<span class="icon-[mdi--check-decagram-outline] mt-0.5 size-4 shrink-0"></span>
						{benefit}
					</li>
				{/each}
			</ul>
		</div>

		<p class="text-xs text-brand-gray-500">Data demo — tampilan pratinjau.</p>
	</div>

	<div class="flex items-center justify-center px-4 py-12">
		<div class="w-full max-w-sm">
			<a class="inline-block text-base-content lg:hidden" href="/" aria-label="AZETTA — beranda">
				<Logo size={30} />
			</a>
			<h1 class="mt-6 text-2xl lg:mt-0">{title}</h1>
			<p class="mt-2 text-sm text-brand-gray-600">{description}</p>
			{@render children()}
		</div>
	</div>
</div>
