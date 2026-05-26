"use client";

import { useState } from "react";
import { Filter, Loader2, RotateCcw } from "lucide-react";
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
  SheetTrigger,
} from "@/components/ui/sheet";
import type { ProjectFilters as ProjectFiltersType } from "@/features/projects/types/project.types";
import { parseProjectFiltersFromSearchParams } from "@/features/projects/utils/project-search-params";

export function ProjectMobileFilters() {
  const searchParams = useSearchParams();
  const { applied, applyFilters, clearFilters, isPending } = useProjectFilters();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ProjectFiltersType>(applied);

  const activeCount = [
    applied.search,
    applied.status,
    applied.city,
    applied.district,
    applied.isFeatured,
  ].filter(Boolean).length;

  const patchDraft = (patch: Partial<ProjectFiltersType>) => {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      for (const key of Object.keys(patch) as (keyof ProjectFiltersType)[]) {
        if (patch[key] === undefined || patch[key] === "") {
          delete next[key];
        }
      }
      return next;
    });
  };

  return (
    <div className="lg:hidden">
      <Sheet
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) {
            setDraft(parseProjectFiltersFromSearchParams(searchParams));
          }
        }}
      >
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="listing-filter-mobile-trigger w-full gap-2"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Filter className="size-4" aria-hidden />
            )}
            Filtrele ve sırala
            {activeCount > 0 ? (
              <span className="listing-filter-mobile-badge">{activeCount}</span>
            ) : null}
          </Button>
        </SheetTrigger>

        <SheetContent
          side="bottom"
          className="flex max-h-[90vh] flex-col rounded-t-[1.35rem] p-0"
        >
          <SheetHeader className="border-b border-border/60 px-5 py-4 text-left">
            <SheetTitle className="font-heading text-lg">Filtreler</SheetTitle>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <ProjectFilterFields
              filters={draft}
              onPatch={patchDraft}
              draftMode
              idPrefix="mobile"
            />
          </div>

          <SheetFooter className="gap-2 border-t border-border/60 p-4 sm:flex-col">
            <Button
              className="w-full min-h-11"
              disabled={isPending}
              onClick={() => {
                applyFilters(draft);
                setOpen(false);
              }}
            >
              Sonuçları göster
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full min-h-11"
              onClick={() => {
                clearFilters();
                setDraft({});
                setOpen(false);
              }}
            >
              <RotateCcw className="size-4" aria-hidden />
              Temizle
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
