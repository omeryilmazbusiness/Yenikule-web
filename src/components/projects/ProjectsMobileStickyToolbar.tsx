"use client";

import { useEffect, useState } from "react";
import { Filter, Loader2, RotateCcw, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { ProjectFilterFields } from "@/components/projects/ProjectFilterFields";
import { useProjectFilters } from "@/components/projects/use-project-filters";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { ProjectFilters } from "@/features/projects/types/project.types";
import { parseProjectFiltersFromSearchParams } from "@/features/projects/utils/project-search-params";
import { cn } from "@/lib/cn";

function countProjectFilters(filters: ProjectFilters): number {
  return [
    filters.status,
    filters.city,
    filters.district,
    filters.isFeatured,
    filters.sort && filters.sort !== "newest" ? filters.sort : undefined,
  ].filter(Boolean).length;
}

export function ProjectsMobileStickyToolbar() {
  const searchParams = useSearchParams();
  const { applied, patchFilters, applyFilters, clearFilters, isPending } =
    useProjectFilters();
  const [search, setSearch] = useState(applied.search ?? "");
  const [filterOpen, setFilterOpen] = useState(false);
  const [draft, setDraft] = useState<ProjectFilters>(applied);

  const filterCount = countProjectFilters(applied);

  useEffect(() => {
    setSearch(applied.search ?? "");
  }, [applied.search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trimmed = search.trim();
      if (trimmed !== (applied.search ?? "")) {
        patchFilters({ search: trimmed || undefined });
      }
    }, 320);
    return () => window.clearTimeout(timer);
  }, [search, applied.search, patchFilters]);

  const patchDraft = (patch: Partial<ProjectFilters>) => {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      for (const key of Object.keys(patch) as (keyof ProjectFilters)[]) {
        if (patch[key] === undefined || patch[key] === "") {
          delete next[key];
        }
      }
      return next;
    });
  };

  return (
    <>
      <div className="listings-mobile-toolbar">
        <div className="listings-mobile-search">
          {isPending ? (
            <Loader2
              className="listings-mobile-search-icon animate-spin text-bronze"
              aria-hidden
            />
          ) : (
            <Search className="listings-mobile-search-icon" aria-hidden />
          )}
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Proje, ilçe ara..."
            className="listings-mobile-search-input"
            aria-label="Proje ara"
            enterKeyHint="search"
          />
        </div>

        <button
          type="button"
          className={cn(
            "listings-mobile-filter-btn",
            filterCount > 0 && "listings-mobile-filter-btn-active",
          )}
          onClick={() => {
            setDraft(parseProjectFiltersFromSearchParams(searchParams));
            setFilterOpen(true);
          }}
          aria-label="Proje filtrelerini aç"
        >
          <Filter className="size-[1.15rem]" aria-hidden />
          {filterCount > 0 ? (
            <span className="listings-mobile-filter-badge">{filterCount}</span>
          ) : null}
        </button>
      </div>

      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent
          side="bottom"
          className="flex max-h-[90vh] flex-col rounded-t-[1.35rem] p-0"
        >
          <SheetHeader className="border-b border-border/60 px-5 py-4 text-left">
            <SheetTitle className="font-heading text-lg">Proje filtreleri</SheetTitle>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <ProjectFilterFields
              filters={draft}
              onPatch={patchDraft}
              draftMode
              hideSearch
              idPrefix="mobile-toolbar"
            />
          </div>

          <SheetFooter className="gap-2 border-t border-border/60 p-4 sm:flex-col">
            <Button
              className="min-h-11 w-full"
              disabled={isPending}
              onClick={() => {
                applyFilters(draft);
                setFilterOpen(false);
              }}
            >
              Sonuçları göster
            </Button>
            <Button
              type="button"
              variant="outline"
              className="min-h-11 w-full"
              onClick={() => {
                clearFilters();
                setDraft({});
                setFilterOpen(false);
              }}
            >
              <RotateCcw className="size-4" aria-hidden />
              Temizle
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
