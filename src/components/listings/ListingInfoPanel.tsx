import { Building2, Calendar, Layers, Ruler } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatArea, formatDate } from "@/lib/format";
import type { Listing } from "@/features/listings/types/listing.types";

type ListingInfoPanelProps = {
  listing: Listing;
};

export function ListingInfoPanel({ listing }: ListingInfoPanelProps) {
  const specs = [
    { icon: Ruler, label: "Alan", value: formatArea(listing.area) },
    listing.rooms
      ? { icon: Building2, label: "Oda", value: listing.rooms }
      : null,
    listing.floor !== undefined && listing.totalFloors !== undefined
      ? {
          icon: Layers,
          label: "Kat",
          value: `${listing.floor}. kat / ${listing.totalFloors} kat`,
        }
      : null,
    listing.buildingAge !== undefined
      ? { icon: Calendar, label: "Bina Yaşı", value: `${listing.buildingAge} yıl` }
      : null,
  ].filter(Boolean) as { icon: typeof Ruler; label: string; value: string }[];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">İlan Detayları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="leading-relaxed text-muted-foreground whitespace-pre-line">
            {listing.description}
          </p>

          {specs.length > 0 && (
            <dl className="grid gap-4 sm:grid-cols-2">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4"
                >
                  <spec.icon className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {spec.label}
                    </dt>
                    <dd className="mt-0.5 font-semibold text-foreground">{spec.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          )}
        </CardContent>
      </Card>

      {listing.features.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Özellikler</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-wrap gap-2">
              {listing.features.map((feature) => (
                <li
                  key={feature}
                  className="rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-sm text-secondary-foreground"
                >
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground">
        Yayın tarihi: {formatDate(listing.createdAt)}
        {listing.updatedAt !== listing.createdAt &&
          ` · Güncelleme: ${formatDate(listing.updatedAt)}`}
      </p>
    </div>
  );
}
