import { Elysia } from 'elysia';
import { hashIp, requireStaff } from '../../../lib/guard';
import { getSettings, presignSettingAsset, updateSettings } from './settings.service';

export const settingRoutes = new Elysia({ prefix: '/admin/settings' })
	.get('/', async ({ request }) => {
		await requireStaff(request.headers);
		return getSettings();
	})
	.patch('/', async ({ request, body }) => {
		const actor = await requireStaff(request.headers);
		return updateSettings(
			actor,
			(body ?? {}) as Record<string, unknown>,
			hashIp(request.headers.get('x-forwarded-for'))
		);
	})
	.post('/assets/presign', async ({ request }) => {
		await requireStaff(request.headers);
		return presignSettingAsset();
	});
