"use client";

import { X } from "lucide-react";

import { useProjectFilters } from "@/components/projects/use-project-filters";
import { PROJECT_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/cn";

export function ProjectActiveFilters({ className }: { className?: string }) {
  const { applied, patchFilters } = useProjectFilters();

  const chips: { key: keyof typeof applied; label: string }[] = [];

  if (applied.search) chips.push({ key: "search", label: `“${applied.search}”` });
  if (applied.status) {
    const label =
      PROJECT_STATUSES.find((s) => s.value === applied.status)?.label ??
      applied.status;
    chips.push({ key: "status", label });
  }
  if (applied.city) chips.push({ key: "city", label: applied.city });
  if (applied.district) chips.push({ key: "district", label: applied.district });
  if (applied.isFeatured) chips.push({ key: "isFeatured", label: "Öne çıkan" });

  if (chips.length === 0) return null;

  return (
    <ul className={cn("listing-active-filters", className)}>
      {chips.map((chip) => (
        <li key={chip.key}>
          <button
            type="button"
            className="listing-active-filter-chip"
            onClick={() => patchFilters({ [chip.key]: undefined })}
          >
            {chip.label}
            <X className="size-3" aria-hidden />
          </button>
        </li>
      ))}
    </ul>
  );
}
