import type { RequestHandler } from './$types';
import { apiRequest } from '#lib/api/client.js';
import type { ApiArticle, ApiProject, ApiUnit } from '#lib/api/types.js';

const PER_PAGE = 50;
const MAX_PAGES = 20;

const STATIC_PAGES = [
	{ path: '/', changefreq: 'weekly', priority: '1.0' },
	{ path: '/rumah', changefreq: 'daily', priority: '0.9' },
	{ path: '/proyek', changefreq: 'weekly', priority: '0.8' },
	{ path: '/artikel', changefreq: 'weekly', priority: '0.7' },
	{ path: '/kerja-sama-lahan', changefreq: 'monthly', priority: '0.8' },
	{ path: '/investasi', changefreq: 'monthly', priority: '0.6' },
	{ path: '/tentang', changefreq: 'yearly', priority: '0.5' },
	{ path: '/faq', changefreq: 'monthly', priority: '0.5' },
	{ path: '/kontak', changefreq: 'yearly', priority: '0.5' },
	{ path: '/kebijakan-privasi', changefreq: 'yearly', priority: '0.2' },
	{ path: '/syarat-ketentuan', changefreq: 'yearly', priority: '0.2' }
];

async function collect<T>(path: string, fetcher: typeof fetch): Promise<T[]> {
	const items: T[] = [];
	for (let page = 1; page <= MAX_PAGES; page += 1) {
		const result = await apiRequest<T[]>(path, { fetcher, query: { page, perPage: PER_PAGE } });
		items.push(...result.data);
		if (page >= (result.meta?.totalPages ?? 1)) break;
	}
	return items;
}

function escapeXml(value: string): string {
	return value.replace(/[<>&'"]/g, (char) => {
		if (char === '<') return '&lt;';
		if (char === '>') return '&gt;';
		if (char === '&') return '&amp;';
		if (char === "'") return '&apos;';
		return '&quot;';
	});
}

function toLastmod(value: string | null | undefined): string | null {
	if (!value) return null;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export const GET: RequestHandler = async ({ fetch, url, setHeaders }) => {
	const origin = url.origin.replace(/\/$/, '');
	const [units, projects, articles] = await Promise.all([
		collect<ApiUnit>('/api/v1/public/units', fetch).catch(() => []),
		collect<ApiProject>('/api/v1/public/projects', fetch).catch(() => []),
		collect<ApiArticle>('/api/v1/public/articles', fetch).catch(() => [])
	]);

	const entries: string[] = [];

	const add = (
		path: string,
		options: { lastmod?: string | null; changefreq?: string; priority?: string } = {}
	) => {
		const lines = [`    <loc>${escapeXml(`${origin}${path}`)}</loc>`];
		const modified = toLastmod(options.lastmod);
		if (modified) lines.push(`    <lastmod>${modified}</lastmod>`);
		if (options.changefreq) lines.push(`    <changefreq>${options.changefreq}</changefreq>`);
		if (options.priority) lines.push(`    <priority>${options.priority}</priority>`);
		entries.push(`  <url>\n${lines.join('\n')}\n  </url>`);
	};

	for (const page of STATIC_PAGES) add(page.path, page);
	for (const unit of units) {
		add(`/rumah/${unit.slug}`, {
			lastmod: unit.updatedAt ?? unit.publishedAt,
			changefreq: 'weekly',
			priority: '0.7'
		});
	}
	for (const project of projects) {
		add(`/proyek/${project.slug}`, { changefreq: 'monthly', priority: '0.6' });
	}
	for (const article of articles) {
		add(`/artikel/${article.slug}`, {
			lastmod: article.publishedAt,
			changefreq: 'monthly',
			priority: '0.6'
		});
	}

	const xml = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...entries,
		'</urlset>',
		''
	].join('\n');

	setHeaders({
		'content-type': 'application/xml; charset=utf-8',
		'cache-control': 'public, max-age=3600'
	});
	return new Response(xml);
};
