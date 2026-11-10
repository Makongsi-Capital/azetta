import type { RequestHandler } from './$types';

const DISALLOW = [
	'/akun',
	'/masuk',
	'/daftar',
	'/lupa-sandi',
	'/reset-sandi',
	'/verifikasi-email',
	'/theme'
];

export const GET: RequestHandler = ({ url, setHeaders }) => {
	const lines = [
		'User-agent: *',
		'Allow: /',
		...DISALLOW.map((path) => `Disallow: ${path}`),
		'',
		`Sitemap: ${url.origin.replace(/\/$/, '')}/sitemap.xml`,
		''
	];

	setHeaders({
		'content-type': 'text/plain; charset=utf-8',
		'cache-control': 'public, max-age=3600'
	});
	return new Response(lines.join('\n'));
};
