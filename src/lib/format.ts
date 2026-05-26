const TR_LOCALE = "tr-TR";
const TRY_CURRENCY = "TRY";

export function formatPrice(
  amount: number,
  options?: { currency?: string; maximumFractionDigits?: number },
): string {
  return new Intl.NumberFormat(TR_LOCALE, {
    style: "currency",
    currency: options?.currency ?? TRY_CURRENCY,
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
  }).format(amount);
}

export function formatPriceCompact(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    return `${millions.toLocaleString(TR_LOCALE, { maximumFractionDigits: 1 })} Mn ₺`;
  }
  if (amount >= 1_000) {
    const thousands = amount / 1_000;
    return `${thousands.toLocaleString(TR_LOCALE, { maximumFractionDigits: 0 })} B ₺`;
  }
  return formatPrice(amount);
}

export function formatNumber(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat(TR_LOCALE, {
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatArea(squareMeters: number): string {
  return `${formatNumber(squareMeters)} m²`;
}

export function formatDate(
  date: Date | string | number,
  style: "short" | "medium" | "long" = "medium",
): string {
  const d = date instanceof Date ? date : new Date(date);
  const dateStyle = style === "short" ? "short" : style === "long" ? "long" : "medium";
  return new Intl.DateTimeFormat(TR_LOCALE, { dateStyle }).format(d);
}

export function formatDateTime(date: Date | string | number): string {
  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(TR_LOCALE, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export function formatRelativeTime(date: Date | string | number): string {
  const d = date instanceof Date ? date : new Date(date);
  const now = Date.now();
  const diffMs = d.getTime() - now;
  const rtf = new Intl.RelativeTimeFormat(TR_LOCALE, { numeric: "auto" });

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 1000 * 60 * 60 * 24 * 365],
    ["month", 1000 * 60 * 60 * 24 * 30],
    ["day", 1000 * 60 * 60 * 24],
    ["hour", 1000 * 60 * 60],
    ["minute", 1000 * 60],
  ];

  for (const [unit, ms] of units) {
    const value = Math.round(diffMs / ms);
    if (Math.abs(value) >= 1) {
      return rtf.format(value, unit);
    }
  }

  return rtf.format(0, "second");
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
  }
  if (digits.length === 12 && digits.startsWith("90")) {
    return `+90 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`;
  }
  return phone;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
