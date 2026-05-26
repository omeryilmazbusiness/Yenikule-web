/** Central image paths and URL normalization for next/image + mock uploads */

export const IMAGE_PLACEHOLDERS = {
  listing: "/images/placeholders/listing.svg",
  project: "/images/placeholders/project.svg",
  vehicle: "/images/placeholders/vehicle.svg",
  hero: "/images/hero-poster.svg",
  general: "/images/placeholders/listing.svg",
} as const;

export type ImagePlaceholderKey = keyof typeof IMAGE_PLACEHOLDERS;

const INVALID_HOST_PATTERNS = [
  /^https?:\/\/mock-cdn\.yenikule\.local/i,
  /^https?:\/\/mock-cdn\./i,
];

const ALLOWED_REMOTE_HOSTS = [
  "public.blob.vercel-storage.com",
  "supabase.co",
  "res.cloudinary.com",
];

function isAllowedRemoteUrl(src: string): boolean {
  try {
    const { hostname, protocol } = new URL(src);
    if (protocol !== "https:" && protocol !== "http:") return false;
    return ALLOWED_REMOTE_HOSTS.some(
      (allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`),
    );
  } catch {
    return false;
  }
}

/** Replace broken mock CDN / empty values with a local placeholder */
export function sanitizeImageUrl(
  src: string | undefined | null,
  fallback: string = IMAGE_PLACEHOLDERS.listing,
): string {
  if (!src || !src.trim()) return fallback;

  const trimmed = src.trim();

  if (INVALID_HOST_PATTERNS.some((pattern) => pattern.test(trimmed))) {
    return fallback;
  }

  if (trimmed.startsWith("/")) return trimmed;

  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  if (trimmed.startsWith("/api/uploads/mock")) {
    return trimmed;
  }

  if (isAllowedRemoteUrl(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return fallback;
  }

  return trimmed.startsWith("/") ? trimmed : fallback;
}

export function sanitizeImages(
  images: string[] | undefined,
  fallback: string = IMAGE_PLACEHOLDERS.listing,
): string[] {
  if (!images?.length) return [fallback];
  const normalized = images.map((url) => sanitizeImageUrl(url, fallback));
  return normalized.length > 0 ? normalized : [fallback];
}

export function isBlobOrDataUrl(src: string): boolean {
  return src.startsWith("blob:") || src.startsWith("data:");
}

export function isNextImageOptimizable(src: string): boolean {
  if (isBlobOrDataUrl(src)) return false;
  if (src.startsWith("/")) return true;
  return isAllowedRemoteUrl(src);
}

export function pickPrimaryImage(
  images: string[] | undefined,
  fallback: string = IMAGE_PLACEHOLDERS.listing,
): string {
  return sanitizeImages(images, fallback)[0] ?? fallback;
}
