<script lang="ts">
	import Modal from '#lib/components/admin/Modal.svelte';
	import PageHeader from '#lib/components/admin/PageHeader.svelte';
	import Panel from '#lib/components/admin/Panel.svelte';
	import StatCard from '#lib/components/admin/StatCard.svelte';
	import { formatDateTime, initials } from '#lib/format.js';
	import { roleLabel } from '#lib/labels.js';
	import { currentUser, MOCK_NOW, staffUsers, type Role, type StaffUser } from '#lib/mock/admin.js';

	let items = $state<StaffUser[]>([...staffUsers]);
	let notice = $state('');

	let dialogOpen = $state(false);
	let form = $state({ name: '', email: '', role: 'admin' as string });

	const counts = $derived({
		total: items.length,
		admins: items.filter((user) => user.role === 'admin').length,
		superAdmins: items.filter((user) => user.role === 'super_admin').length,
		disabled: items.filter((user) => user.banned).length
	});

	function changeRole(user: StaffUser, role: string) {
		if (user.id === currentUser.id && role !== 'super_admin') {
			notice = 'Anda tidak dapat menurunkan peran akun sendiri.';
			return;
		}

		items = items.map((current) =>
			current.id === user.id ? { ...current, role: role as Role } : current
		);
		notice = `Peran ${user.name} diubah menjadi ${roleLabel[role as Role]} (demo).`;
	}

	function toggleDisabled(user: StaffUser) {
		if (user.id === currentUser.id) {
			notice = 'Anda tidak dapat menonaktifkan akun sendiri.';
			return;
		}

		items = items.map((current) =>
			current.id === user.id ? { ...current, banned: !current.banned } : current
		);
		notice = `Akun ${user.name} ${user.banned ? 'diaktifkan' : 'dinonaktifkan'} (demo).`;
	}

	function createUser(event: SubmitEvent) {
		event.preventDefault();

		const nextId = `u-${Math.max(0, ...items.map((user) => Number(user.id.replace('u-', '')))) + 1}`;
		items = [
			...items,
			{
				id: nextId,
				name: form.name,
				email: form.email,
				role: form.role as Role,
				banned: false,
				lastLoginAt: null,
				createdAt: MOCK_NOW.toISOString()
			}
		];

		notice = `Pengguna internal ${form.name} dibuat (demo).`;
		dialogOpen = false;
		form = { name: '', email: '', role: 'admin' };
	}
</script>

<svelte:head>
	<title>Pengguna — Azetta Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PageHeader
	eyebrow="Akses"
	title="Pengguna internal"
	description="Akun admin dan super admin. Hanya super admin yang dapat membuat akun, mengubah peran, atau menonaktifkan akses."
>
	{#snippet actions()}
		{#if currentUser.role === 'super_admin'}
			<button class="btn btn-primary btn-sm" type="button" onclick={() => (dialogOpen = true)}>
				<span class="icon-[mdi--account-plus-outline] size-4"></span>
				Buat pengguna
			</button>
		{/if}
	{/snippet}
</PageHeader>

{#if currentUser.role !== 'super_admin'}
	<div class="mt-6">
		<Panel title="Akses terbatas">
			<p class="text-sm text-brand-gray-600">
				Halaman ini hanya dapat dibuka oleh super admin. Hubungi super admin bila Anda memerlukan
				perubahan peran atau akses.
			</p>
		</Panel>
	</div>
{:else}
	{#if notice}
		<div class="alert alert-info mt-6 border border-brand-line">
			<span class="icon-[mdi--information-outline] size-5"></span>
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

	<section
		class="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-brand-line bg-brand-line lg:grid-cols-4"
	>
		<StatCard label="Total akun" value={counts.total} icon="icon-[mdi--account-group-outline]" />
		<StatCard
			label="Super admin"
			value={counts.superAdmins}
			icon="icon-[mdi--shield-crown-outline]"
		/>
		<StatCard label="Admin" value={counts.admins} icon="icon-[mdi--shield-account-outline]" />
		<StatCard
			label="Nonaktif"
			value={counts.disabled}
			icon="icon-[mdi--account-off-outline]"
			tone="danger"
		/>
	</section>

	<div class="mt-6 border border-brand-line bg-white">
		<div class="overflow-x-auto">
			<table class="table table-sm">
				<thead>
					<tr class="border-brand-line text-xs">
						<th>Pengguna</th>
						<th>Peran</th>
						<th class="hidden md:table-cell">Login terakhir</th>
						<th class="hidden lg:table-cell">Dibuat</th>
						<th>Status</th>
						<th class="text-right">Aksi</th>
					</tr>
				</thead>
				<tbody>
					{#each items as user (user.id)}
						<tr class="border-brand-line hover:bg-base-200/50">
							<td>
								<div class="flex items-center gap-3">
									<span
										class="grid size-9 shrink-0 place-items-center rounded-full border border-brand-line bg-base-200 text-[11px] font-bold"
									>
										{initials(user.name)}
									</span>
									<div class="min-w-0">
										<p class="truncate text-sm font-bold">
											{user.name}
											{#if user.id === currentUser.id}
												<span class="badge badge-outline badge-xs ml-1">Anda</span>
											{/if}
										</p>
										<p class="truncate text-[11px] text-brand-gray-600">{user.email}</p>
									</div>
								</div>
							</td>
							<td>
								<select
									class="select select-sm w-36 border-brand-line"
									aria-label="Peran {user.name}"
									value={user.role}
									onchange={(event) => changeRole(user, event.currentTarget.value)}
								>
									<option value="admin">Admin</option>
									<option value="super_admin">Super admin</option>
								</select>
							</td>
							<td class="hidden text-xs whitespace-nowrap text-brand-gray-600 md:table-cell">
								{user.lastLoginAt ? formatDateTime(user.lastLoginAt) : 'Belum pernah'}
							</td>
							<td class="hidden text-xs whitespace-nowrap text-brand-gray-600 lg:table-cell">
								{formatDateTime(user.createdAt)}
							</td>
							<td>
								<span
									class="badge badge-sm border-0 {user.banned ? 'badge-error' : 'badge-success'}"
								>
									{user.banned ? 'Nonaktif' : 'Aktif'}
								</span>
							</td>
							<td class="text-right">
								<button
									class="btn btn-ghost btn-xs {user.banned ? '' : 'text-error'}"
									type="button"
									disabled={user.id === currentUser.id}
									title={user.id === currentUser.id
										? 'Tidak dapat menonaktifkan akun sendiri'
										: undefined}
									onclick={() => toggleDisabled(user)}
								>
									{user.banned ? 'Aktifkan' : 'Nonaktifkan'}
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<p class="mt-3 text-xs text-brand-gray-600">
		Perubahan peran dan status dicatat di audit log. Registrasi publik tidak dapat membuat akun
		internal.
	</p>
{/if}

<Modal
	open={dialogOpen}
	title="Buat pengguna internal"
	description="Akun internal hanya dapat dibuat oleh super admin."
	onclose={() => (dialogOpen = false)}
>
	<form id="staff-form" class="grid gap-4" onsubmit={createUser}>
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Nama *</legend>
			<input class="input w-full" required bind:value={form.name} />
		</fieldset>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">Email *</legend>
			<input
				class="input w-full"
				type="email"
				required
				placeholder="nama@azetta.id"
				bind:value={form.email}
			/>
		</fieldset>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">Peran *</legend>
			<select class="select w-full" bind:value={form.role}>
				<option value="admin">Admin</option>
				<option value="super_admin">Super admin</option>
			</select>
		</fieldset>

		<p class="text-xs text-brand-gray-600">
			Undangan kata sandi dikirim ke email tersebut melalui alur Better Auth.
		</p>
	</form>

	{#snippet footer()}
		<button class="btn btn-ghost btn-sm" type="button" onclick={() => (dialogOpen = false)}>
			Batal
		</button>
		<button class="btn btn-primary btn-sm" type="submit" form="staff-form">Buat akun</button>
	{/snippet}
</Modal>
