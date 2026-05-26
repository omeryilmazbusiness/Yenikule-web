import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

type PageSeoInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
};

export function buildPageTitle(title?: string): string {
  if (!title) return siteConfig.name;
  return `${title} | ${siteConfig.name}`;
}

export function buildCanonicalUrl(path = ""): string {
  const base = siteConfig.url.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function createPageMetadata(input: PageSeoInput = {}): Metadata {
  const title = buildPageTitle(input.title);
  const description = input.description ?? siteConfig.description;
  const url = buildCanonicalUrl(input.path ?? "");
  const image = input.image ?? `${siteConfig.url}/og-default.jpg`;

  return {
    title,
    description,
    keywords: input.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function createJsonLd<T extends Record<string, unknown>>(data: T) {
  return {
    __html: JSON.stringify({
      "@context": "https://schema.org",
      ...data,
    }),
  };
}

export const organizationJsonLd = createJsonLd({
  "@type": "RealEstateAgent",
  name: siteConfig.name,
  url: siteConfig.url,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.district,
    addressRegion: siteConfig.address.city,
    postalCode: siteConfig.address.postalCode,
    addressCountry: siteConfig.address.country,
  },
});
