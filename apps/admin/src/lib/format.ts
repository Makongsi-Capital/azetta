const numberFormatter = new Intl.NumberFormat('id-ID');
const decimalFormatter = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 });

// Zona waktu dipatok agar format tanggal sama antara render server dan klien.
const dateFormatter = new Intl.DateTimeFormat('id-ID', {
	day: '2-digit',
	month: 'short',
	year: 'numeric',
	timeZone: 'Asia/Jakarta'
});

const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
	day: '2-digit',
	month: 'short',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
	hour12: false,
	timeZone: 'Asia/Jakarta'
});

export function formatNumber(value: number): string {
	return numberFormatter.format(value);
}

/** Harga penuh: Rp 1.850.000.000. */
export function formatRupiah(value: number): string {
	return `Rp ${numberFormatter.format(value)}`;
}

/** Harga ringkas untuk tabel: Rp 850 jt, Rp 1,85 M. */
export function formatRupiahShort(value: number): string {
	if (value >= 1_000_000_000_000)
		return `Rp ${decimalFormatter.format(value / 1_000_000_000_000)} T`;
	if (value >= 1_000_000_000) return `Rp ${decimalFormatter.format(value / 1_000_000_000)} M`;
	if (value >= 1_000_000) return `Rp ${decimalFormatter.format(value / 1_000_000)} jt`;
	return formatRupiah(value);
}

export function formatDate(value: string | Date): string {
	return dateFormatter.format(new Date(value));
}

export function formatDateTime(value: string | Date): string {
	return dateTimeFormatter.format(new Date(value)).replace('.', ':');
}

export function formatDateInput(value: string | Date): string {
	return new Intl.DateTimeFormat('en-CA', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		timeZone: 'Asia/Jakarta'
	}).format(new Date(value));
}

export function formatRelative(value: string | Date, now: Date = new Date()): string {
	const diffMinutes = Math.floor((now.getTime() - new Date(value).getTime()) / 60_000);
	if (diffMinutes < 0) return 'Terjadwal';
	if (diffMinutes < 1) return 'Baru saja';
	if (diffMinutes < 60) return `${diffMinutes} menit lalu`;

	const hours = Math.floor(diffMinutes / 60);
	if (hours < 24) return `${hours} jam lalu`;

	const days = Math.floor(hours / 24);
	if (days < 30) return `${days} hari lalu`;

	return formatDate(value);
}

export function formatFileSize(bytes: number): string {
	if (bytes >= 1_048_576) return `${decimalFormatter.format(bytes / 1_048_576)} MB`;
	if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
	return `${bytes} B`;
}

export function initials(name: string): string {
	return name
		.split(' ')
		.slice(0, 2)
		.map((part) => part.charAt(0))
		.join('')
		.toUpperCase();
}

export function slugify(value: string): string {
	return value
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function downloadCsv(filename: string, rows: (string | number | null)[][]): void {
	const content = rows
		.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
		.join('\r\n');

	const url = URL.createObjectURL(
		new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8' })
	);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	link.style.display = 'none';
	document.body.appendChild(link);
	link.click();
	link.remove();
	// Beri waktu browser memulai unduhan sebelum URL blob dilepas.
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}
