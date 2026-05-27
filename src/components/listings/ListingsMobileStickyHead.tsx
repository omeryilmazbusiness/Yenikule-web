"use client";

import { ListingsMobileStickyToolbar } from "@/components/listings/ListingsMobileStickyToolbar";
import { ListingsSegmentSwitch } from "@/components/listings/ListingsSegmentSwitch";
import type { ListingsSegment } from "@/lib/listings-segment";

type ListingsMobileStickyHeadProps = {
  segment: ListingsSegment;
};

export function ListingsMobileStickyHead({ segment }: ListingsMobileStickyHeadProps) {
  return (
    <div className="listings-mobile-sticky-head lg:hidden">
      <ListingsSegmentSwitch />
      <ListingsMobileStickyToolbar segment={segment} />
    </div>
  );
}
