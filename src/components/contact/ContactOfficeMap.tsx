import { ArrowUpRight, MapPin } from "lucide-react";

import {
  getGoogleMapsEmbedUrl,
  getGoogleMapsSearchUrl,
  getSiteMapLabel,
  getSiteMapQuery,
} from "@/lib/maps";

export function ContactOfficeMap() {
  const query = getSiteMapQuery();
  const label = getSiteMapLabel();
  const embedUrl = getGoogleMapsEmbedUrl(query);
  const mapsUrl = getGoogleMapsSearchUrl(query);

  return (
    <section className="contact-page-map" aria-label="Ofis konumu">
      <div className="mb-4 flex items-start gap-3">
        <span className="listing-detail-map-head-icon" aria-hidden>
          <MapPin className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="contact-page-aside-title">Ofis Konumu</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{label}</p>
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="listing-detail-map-open"
        >
          Yol Tarifi
          <ArrowUpRight className="size-3.5" aria-hidden />
        </a>
      </div>

      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="listing-detail-map-viewport group"
        aria-label={`${label} konumunu Google Maps'te aç`}
      >
        <iframe
          title="Yeni Kule İnşaat ofis konumu"
          src={embedUrl}
          className="listing-detail-map-iframe"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <span className="listing-detail-map-overlay" aria-hidden>
          <span className="listing-detail-map-overlay-pill">
            Haritada aç
            <ArrowUpRight className="size-3.5" />
          </span>
        </span>
      </a>
    </section>
  );
}
