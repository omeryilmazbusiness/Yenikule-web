"use client";

import { Building2, Car } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import {
  LISTINGS_SEGMENTS,
  parseListingsSegment,
  type ListingsSegment,
} from "@/lib/listings-segment";
import { cn } from "@/lib/cn";

const SEGMENT_ICONS = {
  konut: Building2,
  arac: Car,
} as const;

type ListingsSegmentSwitchProps = {
  className?: string;
};

export function ListingsSegmentSwitch({ className }: ListingsSegmentSwitchProps) {
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
    <div
      className={cn(
        "listings-segment-switch",
        isPending && "listings-segment-switch-pending",
        className,
      )}
      role="tablist"
      aria-label="İlan kategorisi"
    >
      {LISTINGS_SEGMENTS.map((item) => {
        const Icon = SEGMENT_ICONS[item.value];
        const isActive = active === item.value;

        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={cn(
              "listings-segment-switch-btn",
              isActive && "listings-segment-switch-btn-active",
            )}
            onClick={() => selectSegment(item.value)}
          >
            <Icon className="size-3.5 shrink-0" aria-hidden />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
