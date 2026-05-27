"use client";

import { Building2, Car } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { AnimatedSegmentControl } from "@/components/listings/AnimatedSegmentControl";
import {
  LISTINGS_SEGMENTS,
  parseListingsSegment,
  type ListingsSegment,
} from "@/lib/listings-segment";
import { cn } from "@/lib/cn";

const SEGMENT_OPTIONS = LISTINGS_SEGMENTS.map((item) => ({
  ...item,
  icon: item.value === "konut" ? Building2 : Car,
}));

export function ListingsSegmentTabs({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const active = parseListingsSegment(searchParams);

  function selectSegment(segment: ListingsSegment) {
    if (segment === active) return;

    startTransition(() => {
      const href =
        segment === "arac" ? `${pathname}?segment=arac` : pathname;
      router.push(href, { scroll: false });
    });
  }

  return (
    <AnimatedSegmentControl
      options={SEGMENT_OPTIONS}
      value={active}
      onChange={selectSegment}
      isPending={isPending}
      layoutId="listings-desktop-segment"
      variant="bar"
      className={cn("listings-segment-tabs-shell", className)}
      ariaLabel="İlan kategorisi"
    />
  );
}
