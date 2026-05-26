import { ArrowUpRight, MapPin } from "lucide-react";

import type { Project } from "@/features/projects/types/project.types";
import {
  getGoogleMapsEmbedUrl,
  getGoogleMapsSearchUrl,
  getProjectMapLabel,
  getProjectMapQuery,
} from "@/lib/maps";
import { cn } from "@/lib/cn";

type ProjectDetailMapProps = {
  project: Project;
  className?: string;
};

export function ProjectDetailMap({ project, className }: ProjectDetailMapProps) {
  const query = getProjectMapQuery(project);
  const label = getProjectMapLabel(project);
  const embedUrl = getGoogleMapsEmbedUrl(query);
  const mapsUrl = getGoogleMapsSearchUrl(query);

  return (
    <section className={cn("listing-detail-map", className)} aria-label="Konum haritası">
      <div className="listing-detail-map-head">
        <span className="listing-detail-map-head-icon" aria-hidden>
          <MapPin className="size-4" />
        </span>
        <div className="listing-detail-map-head-text">
          <h2 className="listing-detail-section-title">Konum</h2>
          <p className="listing-detail-map-address">{label}</p>
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="listing-detail-map-open"
        >
          Google Maps
          <ArrowUpRight className="size-3.5" aria-hidden />
        </a>
      </div>

      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="listing-detail-map-viewport group"
        aria-label={`${label} konumunu Google Maps’te aç`}
      >
        <iframe
          title={`${project.title} konum haritası`}
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
