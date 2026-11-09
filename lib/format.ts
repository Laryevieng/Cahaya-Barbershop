interface PriceFields {
  priceIdr: number;
  priceMaxIdr?: number;
  pricePrefix?: 'Mulai';
  priceSuffix?: '+';
}

export function formatRupiah(value: number): string {
  const digits = Math.round(value).toString();
  return `Rp ${digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

export function formatServicePrice(price: PriceFields): string {
  const amount = price.priceMaxIdr
    ? `${formatRupiah(price.priceIdr)} – ${formatRupiah(price.priceMaxIdr)}`
    : formatRupiah(price.priceIdr);
  const prefix = price.pricePrefix ? `${price.pricePrefix} ` : '';
  const suffix = price.priceSuffix ?? '';

  return `${prefix}${amount}${suffix}`;
}
