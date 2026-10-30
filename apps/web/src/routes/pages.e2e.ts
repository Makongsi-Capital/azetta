import { expect, test } from '@playwright/test';

test('daftar artikel menampilkan semua tulisan', async ({ page }) => {
	await page.goto('/artikel');

	await expect(page.locator('h1')).toHaveText('Panduan sebelum Anda memutuskan');
	await expect(page.locator('a[href^="/artikel/"]')).toHaveCount(3);
});

test('detail artikel merender isi dan artikel lain', async ({ page }) => {
	await page.goto('/artikel/kerja-sama-lahan-dengan-developer');

	await expect(page.locator('h1')).toContainText('Kerja Sama Lahan dengan Developer');
	await expect(
		page.getByRole('heading', { name: 'Tiga bentuk kerja sama yang umum' })
	).toBeVisible();
});

test('halaman kerja sama lahan menampilkan form pengajuan', async ({ page }) => {
	await page.goto('/kerja-sama-lahan');

	await expect(page.locator('h1')).toContainText('Punya lahan?');
	await expect(page.getByRole('button', { name: 'Kirim pengajuan' })).toBeVisible();
});

test('halaman masuk ditandai noindex', async ({ page }) => {
	await page.goto('/masuk');

	await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
});

test('akun menampilkan unit yang dipantau', async ({ page }) => {
	await page.goto('/akun');

	await expect(page.locator('h1')).toHaveText('Proyek Anda');
	await expect(page.locator('a[href="/akun/proyek/azetta-residence-a1"]')).toBeVisible();
});

test('halaman pantauan menampilkan linimasa dan termin', async ({ page }) => {
	await page.goto('/akun/proyek/azetta-residence-a1');

	await expect(page.locator('h1')).toHaveText('Azetta Residence A1');
	await expect(page.getByText('Dinding & atap', { exact: true })).toBeVisible();
	await expect(page.getByText('Termin 3 — 40%')).toBeVisible();
});

test('masuk mengarahkan ke halaman akun', async ({ page }) => {
	await page.goto('/masuk');

	await page.getByPlaceholder('nama@email.com').fill('demo@azetta.id');
	await page.getByPlaceholder('••••••••').fill('rahasia123');
	await page.getByRole('button', { name: 'Masuk' }).click();

	await expect(page).toHaveURL('/akun');
	await expect(page.locator('h1')).toHaveText('Proyek Anda');
});
