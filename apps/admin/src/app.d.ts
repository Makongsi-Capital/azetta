// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { ApiUser } from '#lib/server/api.js';

declare global {
	namespace App {
		interface Locals {
			user: ApiUser | null;
		}
	}
}

export {};
