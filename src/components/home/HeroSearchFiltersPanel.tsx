"use client";

import { Building2, Car, Key, Layers, Sparkles, Tag } from "lucide-react";

import {
  DEFAULT_HERO_SEARCH_FILTERS,
  type HeroSearchFilters,
} from "@/features/search/utils/hero-search-filters";
import type { SearchEntityType } from "@/features/search/types/search.types";
import { countActiveHeroSearchFilters } from "@/features/search/utils/hero-search-filters";
import { cn } from "@/lib/cn";

type HeroSearchFiltersPanelProps = {
  filters: HeroSearchFilters;
  onChange: (filters: HeroSearchFilters) => void;
  onReset: () => void;
  onApply?: () => void;
  className?: string;
  variant?: "dropdown" | "sheet";
  hideChrome?: boolean;
};

const TYPE_OPTIONS: {
  value: SearchEntityType;
  label: string;
  hint: string;
  icon: typeof Building2;
}[] = [
  { value: "listing", label: "Konut", hint: "Satılık & kiralık", icon: Building2 },
  { value: "project", label: "Proje", hint: "Yeni projeler", icon: Layers },
  { value: "vehicle", label: "Araç", hint: "Araç ilanları", icon: Car },
];

const LISTING_TYPE_OPTIONS = [
  { value: "all" as const, label: "Tümü", icon: Tag },
  { value: "satilik" as const, label: "Satılık", icon: Tag },
  { value: "kiralik" as const, label: "Kiralık", icon: Key },
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
  onApply,
  className,
  variant = "dropdown",
  hideChrome = false,
}: HeroSearchFiltersPanelProps) {
  const activeCount = countActiveHeroSearchFilters(filters);
  const showListingType = filters.types.includes("listing");
  const isSheet = variant === "sheet";

  return (
    <div
      className={cn(
        "hero-search-filter-panel",
        isSheet && "hero-search-filter-panel-sheet",
        className,
      )}
    >
      {hideChrome ? null : (
        <div className="hero-search-filter-panel-head">
          <div>
            <p className="hero-search-filter-panel-title">Arama kriterleri</p>
            <p className="hero-search-filter-panel-sub">
              {activeCount > 0
                ? `${activeCount} aktif kriter`
                : "Varsayılan: tüm içerikler"}
            </p>
          </div>
          <button type="button" className="hero-search-filter-reset" onClick={onReset}>
            Sıfırla
          </button>
        </div>
      )}

      {hideChrome ? (
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {activeCount > 0
              ? `${activeCount} aktif kriter`
              : "Tüm içeriklerde ara"}
          </p>
          <button type="button" className="hero-search-filter-reset" onClick={onReset}>
            Sıfırla
          </button>
        </div>
      ) : null}

      <div className="hero-search-filter-block">
        <p className="hero-search-filter-label">Ne arıyorsunuz?</p>
        <div
          className="hero-search-filter-type-grid"
          role="group"
          aria-label="İçerik türü"
        >
          {TYPE_OPTIONS.map((option) => {
            const active = filters.types.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "hero-search-filter-type-card",
                  active && "hero-search-filter-type-card-active",
                )}
                onClick={() => onChange(toggleType(filters, option.value))}
              >
                <span className="hero-search-filter-type-icon" aria-hidden>
                  <option.icon className="size-4" />
                </span>
                <span className="hero-search-filter-type-text">
                  <span className="hero-search-filter-type-title">{option.label}</span>
                  <span className="hero-search-filter-type-hint">{option.hint}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {showListingType ? (
        <div className="hero-search-filter-block">
          <p className="hero-search-filter-label">İlan türü</p>
          <div
            className="hero-search-filter-segment"
            role="group"
            aria-label="İlan türü"
          >
            {LISTING_TYPE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "hero-search-filter-segment-btn",
                  filters.listingType === option.value &&
                    "hero-search-filter-segment-btn-active",
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

      <div className="hero-search-filter-block hero-search-filter-block-last">
        <button
          type="button"
          className={cn(
            "hero-search-filter-featured-row",
            filters.featuredOnly && "hero-search-filter-featured-row-active",
          )}
          onClick={() =>
            onChange({ ...filters, featuredOnly: !filters.featuredOnly })
          }
        >
          <span className="hero-search-filter-featured-copy">
            <Sparkles className="size-4 shrink-0" aria-hidden />
            <span>
              <span className="hero-search-filter-featured-title">
                Yalnızca öne çıkanlar
              </span>
              <span className="hero-search-filter-featured-hint">
                Editör seçimi portföy
              </span>
            </span>
          </span>
          <span
            className={cn(
              "hero-search-filter-toggle",
              filters.featuredOnly && "hero-search-filter-toggle-on",
            )}
            aria-hidden
          />
        </button>
      </div>

      {isSheet && onApply && !hideChrome ? (
        <div className="hero-search-filter-sheet-footer">
          <button
            type="button"
            className="hero-search-filter-apply"
            onClick={onApply}
          >
            Kriterleri uygula
          </button>
        </div>
      ) : null}
    </div>
  );
}

export { DEFAULT_HERO_SEARCH_FILTERS };
