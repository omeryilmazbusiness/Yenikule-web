"use client";

import { Building2, Car, Key, Layers, Sparkles, Tag } from "lucide-react";

import {
  DEFAULT_HERO_SEARCH_FILTERS,
  type HeroSearchFilters,
} from "@/features/search/utils/hero-search-filters";
import type { SearchEntityType } from "@/features/search/types/search.types";
import { cn } from "@/lib/cn";

type HeroSearchFiltersPanelProps = {
  filters: HeroSearchFilters;
  onChange: (filters: HeroSearchFilters) => void;
  onReset: () => void;
  className?: string;
};

const TYPE_OPTIONS: {
  value: SearchEntityType;
  label: string;
  icon: typeof Building2;
}[] = [
  { value: "listing", label: "Konut", icon: Building2 },
  { value: "project", label: "Proje", icon: Layers },
  { value: "vehicle", label: "Araç", icon: Car },
];

function toggleType(
  filters: HeroSearchFilters,
  type: SearchEntityType,
): HeroSearchFilters {
  const has = filters.types.includes(type);
  const next = has
    ? filters.types.filter((item) => item !== type)
    : [...filters.types, type];

  return {
    ...filters,
    types: next.length === 0 ? [type] : next,
  };
}

export function HeroSearchFiltersPanel({
  filters,
  onChange,
  onReset,
  className,
}: HeroSearchFiltersPanelProps) {
  const showListingType = filters.types.includes("listing");

  return (
    <div className={cn("hero-search-filter-panel", className)}>
      <div className="hero-search-filter-panel-head">
        <p className="hero-search-filter-panel-title">Arama Filtreleri</p>
        <button type="button" className="hero-search-filter-reset" onClick={onReset}>
          Sıfırla
        </button>
      </div>

      <div className="hero-search-filter-block">
        <p className="hero-search-filter-label">İçerik türü</p>
        <div className="hero-search-filter-pills" role="group" aria-label="İçerik türü">
          {TYPE_OPTIONS.map((option) => {
            const active = filters.types.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "hero-search-filter-pill",
                  active && "hero-search-filter-pill-active",
                )}
                onClick={() => onChange(toggleType(filters, option.value))}
              >
                <option.icon className="size-3.5" aria-hidden />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {showListingType ? (
        <div className="hero-search-filter-block">
          <p className="hero-search-filter-label">İlan türü</p>
          <div className="hero-search-filter-pills" role="group" aria-label="İlan türü">
            {(
              [
                { value: "all" as const, label: "Tümü", icon: Tag },
                { value: "satilik" as const, label: "Satılık", icon: Tag },
                { value: "kiralik" as const, label: "Kiralık", icon: Key },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "hero-search-filter-pill",
                  filters.listingType === option.value &&
                    "hero-search-filter-pill-active",
                )}
                onClick={() => onChange({ ...filters, listingType: option.value })}
              >
                <option.icon className="size-3.5" aria-hidden />
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="hero-search-filter-block">
        <button
          type="button"
          className={cn(
            "hero-search-filter-featured",
            filters.featuredOnly && "hero-search-filter-featured-active",
          )}
          onClick={() =>
            onChange({ ...filters, featuredOnly: !filters.featuredOnly })
          }
        >
          <Sparkles className="size-4" aria-hidden />
          Yalnızca öne çıkanlar
        </button>
      </div>
    </div>
  );
}

export { DEFAULT_HERO_SEARCH_FILTERS };
