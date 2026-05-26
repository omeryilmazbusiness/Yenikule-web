"use client";

import { Loader2 } from "lucide-react";

import { ListingActiveFilters } from "@/components/listings/ListingActiveFilters";
import { useListingFilters } from "@/components/listings/use-listing-filters";

type ListingsResultsHeaderProps = {
  total: number;
  page: number;
  totalPages: number;
};

export function ListingsResultsHeader({
  total,
  page,
  totalPages,
}: ListingsResultsHeaderProps) {
  const { isPending } = useListingFilters();
  return (
    <div className="listings-results-header">
      <div className="flex min-w-0 items-center gap-2">
        {isPending ? (
          <Loader2
            className="size-4 shrink-0 animate-spin text-bronze"
            aria-hidden
          />
        ) : null}
        <p className="listings-results-count">
          <span className="font-semibold text-foreground">{total}</span> ilan
          {totalPages > 1 ? (
            <span className="text-muted-foreground">
              {" "}
              · Sayfa {page}/{totalPages}
            </span>
          ) : null}
        </p>
      </div>
      <ListingActiveFilters className="hidden sm:flex" />
    </div>
  );
}
