"use client";

import { useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { ProjectFilters } from "@/features/projects/types/project.types";
import {
  parseProjectFiltersFromSearchParams,
  projectFiltersToSearchParams,
} from "@/features/projects/utils/project-search-params";

export function useProjectFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const applied = parseProjectFiltersFromSearchParams(searchParams);

  const applyFilters = useCallback(
    (next: ProjectFilters, options?: { resetPage?: boolean }) => {
      const merged = { ...next };
      if (options?.resetPage !== false) {
        delete merged.page;
      }
      const params = projectFiltersToSearchParams(merged);
      const query = params.toString();
      startTransition(() => {
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    },
    [pathname, router],
  );

  const patchFilters = useCallback(
    (patch: Partial<ProjectFilters>) => {
      const next = { ...applied, ...patch };
      for (const key of Object.keys(patch) as (keyof ProjectFilters)[]) {
        const value = patch[key];
        if (value === undefined || value === "") {
          delete next[key];
        }
      }
      applyFilters(next);
    },
    [applied, applyFilters],
  );

  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }, [pathname, router]);

  return {
    applied,
    applyFilters,
    patchFilters,
    clearFilters,
    isPending,
  };
}
