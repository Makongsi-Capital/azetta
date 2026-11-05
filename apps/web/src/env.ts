import { defineEnvVars } from '@sveltejs/kit/env';

/** Env publik web; nilainya dibaca saat aplikasi berjalan, bukan di-inline saat build. */
export const variables = defineEnvVars({
	PUBLIC_API_BASE_URL: {
		public: true,
		description: 'Basis URL API Azetta, mis. http://localhost:3000',
		schema: (value: string | undefined) => value?.trim() || 'http://localhost:3000'
	}
});
