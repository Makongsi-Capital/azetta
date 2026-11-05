// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { ApiUser } from '#lib/api/client.js';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: ApiUser | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
