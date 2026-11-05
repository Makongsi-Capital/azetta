<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- sebagian href dibangun dari data API */
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	const initials = $derived(
		data.user.name
			.split(' ')
			.slice(0, 2)
			.map((part) => part.charAt(0))
			.join('')
	);
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
			<p class="text-sm font-bold">{data.user.name}</p>
		</div>
		{#if data.user.emailVerified}
			<span class="badge badge-success badge-sm hidden border-0 sm:inline-flex">Terverifikasi</span>
		{:else}
			<span class="badge badge-warning badge-sm hidden border-0 sm:inline-flex">
				Email belum terverifikasi
			</span>
		{/if}
		<a class="btn btn-ghost btn-sm" href="/akun">Ringkasan</a>
		<form method="POST" action="/keluar">
			<button class="btn btn-outline btn-sm" type="submit">Keluar</button>
		</form>
	</div>
</div>

{@render children()}
