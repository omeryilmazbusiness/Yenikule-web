import { Suspense } from "react";

import { ListingActiveFilters } from "@/components/listings/ListingActiveFilters";
import { ListingFilters } from "@/components/listings/ListingFilters";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { ListingsMobileStickyToolbar } from "@/components/listings/ListingsMobileStickyToolbar";
import { ListingPagination } from "@/components/listings/ListingPagination";
import { ListingsResultsHeader } from "@/components/listings/ListingsResultsHeader";
import { ListingsSegmentTabs } from "@/components/listings/ListingsSegmentTabs";
import { PageShell } from "@/components/layout/PageShell";
import { VehicleActiveFilters } from "@/components/vehicles/VehicleActiveFilters";
import { VehicleFilters } from "@/components/vehicles/VehicleFilters";
import { VehicleGrid } from "@/components/vehicles/VehicleGrid";
import { VehiclesResultsHeader } from "@/components/vehicles/VehiclesResultsHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { listingService } from "@/features/listings/services/listing.service";
import {
  normalizeListingsPageFilters,
  parseListingFiltersFromPageSearchParams,
} from "@/features/listings/utils/listing-search-params";
import { vehicleService } from "@/features/vehicles/services/vehicle.service";
import {
  normalizeVehiclePageFilters,
  parseVehicleFiltersFromPageSearchParams,
} from "@/features/vehicles/utils/vehicle-search-params";
import { parseListingsSegmentFromPageSearchParams } from "@/lib/listings-segment";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = createPageMetadata({
  title: "İlanlar",
  description: "Satılık ve kiralık konut, iş yeri, arsa, villa ve araç ilanları.",
  path: routes.listings.index,
});

type ListingsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function KonutListingsContent({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const filters = normalizeListingsPageFilters(
    parseListingFiltersFromPageSearchParams(searchParams),
  );
  const { items, total, page, totalPages } = await listingService.getAll(filters);

  return (
    <div className="listings-page-layout">
      <ListingFilters />

      <div id="listings-results" className="listings-page-main">
        <ListingsResultsHeader total={total} page={page} totalPages={totalPages} />
        <ListingActiveFilters className="hidden sm:flex" />
        <ListingGrid listings={items} />
        <ListingPagination
          page={page}
          totalPages={totalPages}
          total={total}
          itemLabel="ilan"
        />
      </div>
    </div>
  );
}

async function VehicleListingsContent({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const filters = normalizeVehiclePageFilters(
    parseVehicleFiltersFromPageSearchParams(searchParams),
  );
  const { items, total, page, totalPages } = await vehicleService.getAll(filters);

  return (
    <div className="listings-page-layout">
      <VehicleFilters />

      <div id="listings-results" className="listings-page-main">
        <VehiclesResultsHeader total={total} page={page} totalPages={totalPages} />
        <VehicleActiveFilters className="hidden sm:flex" />
        <VehicleGrid vehicles={items} />
        <ListingPagination
          page={page}
          totalPages={totalPages}
          total={total}
          itemLabel="araç"
        />
      </div>
    </div>
  );
}

async function ListingsContent({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const segment = parseListingsSegmentFromPageSearchParams(searchParams);

  return (
    <>
      <div className="listings-segment-bar hidden lg:flex lg:mb-6">
        <ListingsSegmentTabs />
      </div>

      <div className="listings-mobile-sticky-head lg:hidden">
        <ListingsSegmentTabs />
        <ListingsMobileStickyToolbar segment={segment} />
      </div>

      {segment === "arac" ? (
        <VehicleListingsContent searchParams={searchParams} />
      ) : (
        <KonutListingsContent searchParams={searchParams} />
      )}
    </>
  );
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <PageShell
      eyebrow="Portföy"
      title="İlanlar"
      description="Satılık ve kiralık gayrimenkul ile araç ilanlarımızı filtreleyerek inceleyin."
      className="listings-page-shell"
    >
      <Suspense
        fallback={
          <div className="space-y-8">
            <Skeleton className="h-12 w-full max-w-md rounded-2xl" />
            <div className="listings-page-layout">
              <Skeleton className="hidden h-[32rem] w-full max-w-[19rem] shrink-0 rounded-[1.25rem] lg:block" />
              <div className="listings-page-main space-y-4">
                <Skeleton className="h-10 w-48 rounded-lg" />
                <Skeleton className="h-12 w-full rounded-xl lg:hidden" />
                <div className="listings-list overflow-hidden rounded-2xl border border-border/60 bg-white lg:hidden">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="m-3 h-[5.5rem] rounded-xl" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        }
      >
        <ListingsContent searchParams={resolvedSearchParams} />
      </Suspense>
    </PageShell>
  );
}
