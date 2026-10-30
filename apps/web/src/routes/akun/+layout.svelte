<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- mockup: rute tujuan belum dibangun */
	import { account } from '#lib/mock/account.js';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const initials = account.name
		.split(' ')
		.slice(0, 2)
		.map((part) => part.charAt(0))
		.join('');
</script>

<div class="border-b border-brand-line bg-base-100">
	<div class="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-4">
		<span
			class="grid size-9 shrink-0 place-items-center rounded-full border border-brand-line bg-brand-mist text-xs font-bold"
		>
			{initials}
		</span>
		<div class="mr-auto">
			<p class="text-xs text-brand-gray-600">Akun saya</p>
			<p class="text-sm font-bold">{account.name}</p>
		</div>
		<span class="badge badge-outline badge-sm hidden sm:inline-flex">Data demo</span>
		<a class="btn btn-ghost btn-sm" href="/akun">Ringkasan</a>
		<a class="btn btn-outline btn-sm" href="/masuk">Keluar</a>
	</div>
</div>

{@render children()}
