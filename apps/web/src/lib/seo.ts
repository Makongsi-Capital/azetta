/**
 * Membungkus data terstruktur menjadi tag <script> siap pakai untuk `{@html}`.
 * Karakter `<` di dalam JSON di-escape agar isi data tidak bisa menutup tag lebih awal.
 */
export function jsonLdScript(data: unknown): string {
	const json = JSON.stringify(data).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</script>`;
}
