const decimal = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 });

/** Harga indikatif ditulis ringkas: Rp 850 jt, Rp 1,2 M. */
export function formatPrice(value: number): string {
	if (value >= 1_000_000_000) return `Rp ${decimal.format(value / 1_000_000_000)} M`;
	if (value >= 1_000_000) return `Rp ${decimal.format(value / 1_000_000)} jt`;
	return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
}
