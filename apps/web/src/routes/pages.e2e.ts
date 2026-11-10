import { expect, test } from '@playwright/test';

test('daftar artikel menampilkan tulisan terbit', async ({ page }) => {
	await page.goto('/artikel');

	await expect(page.locator('h1')).toHaveText('Panduan sebelum Anda memutuskan');
	await expect(page.locator('a[href="/artikel/panduan-memilih-rumah-pertama"]')).toBeVisible();
});

test('detail artikel merender isi dari API', async ({ page }) => {
	await page.goto('/artikel/panduan-memilih-rumah-pertama');

	await expect(page.locator('h1')).toContainText('Panduan memilih rumah pertama');
	await expect(page.getByRole('heading', { name: 'Mulai dari kebutuhan' })).toBeVisible();
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

test('masuk mengarahkan ke halaman akun', async ({ page }) => {
	await page.goto('/masuk');

	await page.getByPlaceholder('nama@email.com').fill('budi@example.com');
	await page.getByPlaceholder('••••••••').fill('Customer12345!');
	await page.getByRole('button', { name: 'Masuk' }).click();

	await expect(page).toHaveURL('/akun');
	await expect(page.locator('h1')).toHaveText('Akun Anda');
});

test('akun menampilkan pengajuan pengguna', async ({ page }) => {
	await page.goto('/masuk');
	await page.getByPlaceholder('nama@email.com').fill('budi@example.com');
	await page.getByPlaceholder('••••••••').fill('Customer12345!');
	await page.getByRole('button', { name: 'Masuk' }).click();

	await expect(page).toHaveURL('/akun');
	await expect(page.getByText('AZT-BU-2611-SEED0')).toBeVisible();
	await expect(page.locator('a[href^="/akun/pengajuan/"]').first()).toBeVisible();
});
