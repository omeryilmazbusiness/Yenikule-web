"use client";

import { useEffect, useState } from "react";
import { Search, Sparkles } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PROJECT_FILTER_CITIES,
  PROJECT_FILTER_DISTRICTS_BY_CITY,
} from "@/features/projects/data/project-filter-locations";
import type { ProjectFilters } from "@/features/projects/types/project.types";
import { PROJECT_STATUSES, SORT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/cn";

type ProjectFilterFieldsProps = {
  filters: ProjectFilters;
  onPatch: (patch: Partial<ProjectFilters>) => void;
  draftMode?: boolean;
  idPrefix?: string;
  hideSearch?: boolean;
};

export function ProjectFilterFields({
  filters,
  onPatch,
  draftMode = false,
  idPrefix = "",
  hideSearch = false,
}: ProjectFilterFieldsProps) {
  const pid = (name: string) => (idPrefix ? `${idPrefix}-${name}` : name);
  const [search, setSearch] = useState(filters.search ?? "");

  useEffect(() => {
    setSearch(filters.search ?? "");
  }, [filters.search]);

  useEffect(() => {
    if (draftMode) return;
    const timer = window.setTimeout(() => {
      const trimmed = search.trim();
      if (trimmed !== (filters.search ?? "")) {
        onPatch({ search: trimmed || undefined });
      }
    }, 320);
    return () => window.clearTimeout(timer);
  }, [search, draftMode, filters.search, onPatch]);

  const districts =
    filters.city && PROJECT_FILTER_DISTRICTS_BY_CITY[filters.city]
      ? PROJECT_FILTER_DISTRICTS_BY_CITY[filters.city]
      : [];

  return (
    <div className="listing-filter-fields">
      {hideSearch ? null : (
        <div className="listing-filter-block">
          <Label htmlFor={pid("search")} className="listing-filter-label">
            Arama
          </Label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id={pid("search")}
              placeholder="Proje, lokasyon..."
              className="listing-filter-input pl-9"
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);
                if (draftMode) {
                  onPatch({ search: value.trim() || undefined });
                }
              }}
            />
          </div>
        </div>
      )}

      <div className="listing-filter-block">
        <span className="listing-filter-label">Proje durumu</span>
        <div className="listing-filter-pills" role="group" aria-label="Proje durumu">
          <button
            type="button"
            className={cn(
              "listing-filter-pill",
              !filters.status && "listing-filter-pill-active",
            )}
            onClick={() => onPatch({ status: undefined })}
          >
            Tümü
          </button>
          {PROJECT_STATUSES.map((item) => (
            <button
              key={item.value}
              type="button"
              className={cn(
                "listing-filter-pill",
                filters.status === item.value && "listing-filter-pill-active",
              )}
              onClick={() => onPatch({ status: item.value })}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="listing-filter-block">
        <Label className="listing-filter-label">Konum</Label>
        <div className="grid gap-2">
          <Select
            value={filters.city ?? "all"}
            onValueChange={(value) =>
              onPatch({
                city: value === "all" ? undefined : value,
                district: undefined,
              })
            }
          >
            <SelectTrigger className="listing-filter-select">
              <SelectValue placeholder="Şehir" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm şehirler</SelectItem>
              {PROJECT_FILTER_CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.district ?? "all"}
            onValueChange={(value) =>
              onPatch({
                district: value === "all" ? undefined : value,
              })
            }
            disabled={!filters.city}
          >
            <SelectTrigger className="listing-filter-select">
              <SelectValue placeholder="İlçe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm ilçeler</SelectItem>
              {districts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="listing-filter-block">
        <button
          type="button"
          className={cn(
            "listing-filter-featured-toggle",
            filters.isFeatured && "listing-filter-featured-toggle-active",
          )}
          onClick={() =>
            onPatch({ isFeatured: filters.isFeatured ? undefined : true })
          }
        >
          <Sparkles className="size-4" aria-hidden />
          Yalnızca öne çıkanlar
        </button>
      </div>

      <div className="listing-filter-block">
        <Label className="listing-filter-label">Sıralama</Label>
        <Select
          value={filters.sort ?? "newest"}
          onValueChange={(value) =>
            onPatch({ sort: value as ProjectFilters["sort"] })
          }
        >
          <SelectTrigger className="listing-filter-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.projects.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
