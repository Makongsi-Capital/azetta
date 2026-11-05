const ALLOWED_TAGS = new Set([
	'h2',
	'h3',
	'h4',
	'p',
	'ul',
	'ol',
	'li',
	'strong',
	'em',
	'a',
	'blockquote',
	'code',
	'pre',
	'img',
	'table',
	'thead',
	'tbody',
	'tr',
	'th',
	'td',
	'hr',
	'br'
]);

const ALLOWED_ATTRIBUTES = new Set(['href', 'src', 'alt', 'title', 'rel', 'target']);

const DANGEROUS_BLOCK = /<(script|style|iframe|object|embed|form|svg|math)[\s\S]*?<\/\1>/gi;
const VOID_DANGEROUS = /<(script|style|iframe|object|embed|form|svg|math)\b[^>]*\/?>/gi;

/**
 * Sanitasi HTML editor (docs §5.3): hanya tag/atribut allowlist yang disimpan.
 * Server tetap menjadi batas keamanan, bukan hanya editor di klien.
 */
export function sanitizeHtml(input: string): string {
	const withoutBlocks = input.replace(DANGEROUS_BLOCK, '').replace(VOID_DANGEROUS, '');

	return withoutBlocks.replace(
		/<\/?([a-zA-Z0-9-]+)((?:\s+[^>]*)?)\/?>/g,
		(match, rawTag, rawAttrs) => {
			const tag = String(rawTag).toLowerCase();
			if (!ALLOWED_TAGS.has(tag)) return '';

			const isClosing = match.startsWith('</');
			if (isClosing) return `</${tag}>`;

			const attrs = String(rawAttrs ?? '')
				.replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
				.replace(/\sstyle\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
				.replace(
					/\s+([a-zA-Z-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g,
					(_all, name, dq, sq, bare) => {
						const attribute = String(name).toLowerCase();
						if (!ALLOWED_ATTRIBUTES.has(attribute)) return '';
						const value = String(dq ?? sq ?? bare ?? '');
						if (/^\s*(javascript|data|vbscript):/i.test(value)) return '';
						return ` ${attribute}="${value.replaceAll('"', '&quot;')}"`;
					}
				);

			const selfClosing = tag === 'img' || tag === 'br' || tag === 'hr';
			return `<${tag}${attrs}${selfClosing ? ' /' : ''}>`;
		}
	);
}
