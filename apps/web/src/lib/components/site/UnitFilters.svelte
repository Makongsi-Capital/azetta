<script lang="ts">
	const groups = [
		{ title: 'Proyek', options: ['Azetta Residence', 'Azetta Garden', 'Griya Biringkanaya'] },
		{ title: 'Kota', options: ['Makassar', 'Gowa', 'Maros'] },
		{ title: 'Tipe', options: ['Tipe 36', 'Tipe 45', 'Tipe 60', 'Tipe 70', 'Tipe 90'] },
		{ title: 'Kamar tidur', options: ['2 KT', '3 KT', '4 KT'] },
		{ title: 'Ketersediaan', options: ['Tersedia', 'Indent', 'Terjual'] }
	];
</script>

<div class="space-y-6">
	{#each groups as group (group.title)}
		<fieldset class="fieldset">
			<legend class="fieldset-legend">{group.title}</legend>
			{#each group.options as option (option)}
				<label class="flex cursor-pointer items-center gap-2 text-sm">
					<input type="checkbox" class="checkbox checkbox-sm" />
					{option}
				</label>
			{/each}
		</fieldset>
	{/each}

	<div class="grid grid-cols-2 gap-3">
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Luas tanah min</legend>
			<input class="input input-sm w-full" type="number" placeholder="72" />
		</fieldset>
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Luas bangunan min</legend>
			<input class="input input-sm w-full" type="number" placeholder="60" />
		</fieldset>
	</div>

	<fieldset class="fieldset">
		<legend class="fieldset-legend">Harga maksimum</legend>
		<select class="select select-sm w-full">
			<option>Tanpa batas</option>
			<option>&lt; Rp 700 jt</option>
			<option>Rp 700 jt – Rp 1,5 M</option>
			<option>&gt; Rp 1,5 M</option>
		</select>
	</fieldset>
</div>
