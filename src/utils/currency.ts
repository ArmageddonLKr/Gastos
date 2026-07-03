export const CURRENCIES = [
  { code: "BRL", label: "Real (R$)", locale: "pt-BR" },
  { code: "USD", label: "Dólar (US$)", locale: "en-US" },
  { code: "EUR", label: "Euro (€)", locale: "de-DE" },
  { code: "GBP", label: "Libra (£)", locale: "en-GB" },
  { code: "ARS", label: "Peso argentino ($)", locale: "es-AR" },
  { code: "JPY", label: "Iene (¥)", locale: "ja-JP" },
];

export function formatCurrency(value: number, currencyCode: string): string {
  const meta = CURRENCIES.find((c) => c.code === currencyCode) ?? CURRENCIES[0];
  try {
    return new Intl.NumberFormat(meta.locale, {
      style: "currency",
      currency: meta.code,
      maximumFractionDigits: meta.code === "JPY" ? 0 : 2,
    }).format(value);
  } catch {
    return value.toFixed(2);
  }
}
