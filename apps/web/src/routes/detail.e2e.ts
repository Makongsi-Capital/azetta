import { expect, test } from '@playwright/test';

test('detail unit menampilkan judul, harga, dan unit terkait', async ({ page }) => {
	await page.goto('/rumah/azetta-residence-a1');

	await expect(page.locator('h1')).toHaveText('Azetta Residence A1');
	await expect(page.getByText('Rp 850 jt').first()).toBeVisible();
	await expect(page.locator('a[href="/rumah/azetta-residence-b2"]').first()).toBeVisible();
});

test('detail proyek menampilkan unit di proyek tersebut', async ({ page }) => {
	await page.goto('/proyek/azetta-residence');

	await expect(page.locator('h1')).toHaveText('Azetta Residence');
	await expect(page.locator('a[href="/rumah/azetta-residence-a1"]').first()).toBeVisible();
});

test('slug tidak dikenal mengembalikan 404', async ({ page }) => {
	const response = await page.goto('/rumah/tidak-ada');

	expect(response?.status()).toBe(404);
});
