import { Elysia } from 'elysia';
import { getEnv } from './env';

const env = getEnv();

const app = new Elysia()
	.get('/health', () => ({ status: 'ok', env: env.NODE_ENV }))
	.listen(env.PORT);

console.info(`API Azetta berjalan di http://localhost:${app.server?.port}`);
