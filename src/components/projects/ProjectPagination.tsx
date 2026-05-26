"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { PAGINATION } from "@/lib/constants";
import { cn } from "@/lib/cn";

const RESULTS_ANCHOR = "projects-results";

type ProjectPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  className?: string;
};

function buildPageHref(searchParams: URLSearchParams, page: number): string {
  const params = new URLSearchParams(searchParams.toString());
  if (page <= 1) params.delete("page");
  else params.set("page", String(page));
  const query = params.toString();
  const base = query ? `?${query}` : "";
  return `${base}#${RESULTS_ANCHOR}`;
}

function getPageNumbers(current: number, total: number): number[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
}

export function ProjectPagination({
  page,
  totalPages,
  total,
  className,
}: ProjectPaginationProps) {
  const searchParams = useSearchParams();

  if (total === 0) return null;

  const prevHref = buildPageHref(searchParams, page - 1);
  const nextHref = buildPageHref(searchParams, page + 1);
  const pageNumbers = getPageNumbers(page, totalPages);
  const pageSize = PAGINATION.defaultPageSize;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <nav
      className={cn("listing-pagination", className)}
      aria-label="Sayfa navigasyonu"
    >
      <p className="listing-pagination-range">
        <span className="font-medium text-foreground">
          {from}–{to}
        </span>{" "}
        / {total} proje · sayfa başına {pageSize}
      </p>

      {totalPages > 1 ? (
        <div className="listing-pagination-controls">
          <Link
            href={prevHref}
            className={cn(
              "listing-pagination-btn",
              page <= 1 && "pointer-events-none opacity-40",
            )}
            aria-disabled={page <= 1}
            scroll
          >
            <ChevronLeft className="size-5 stroke-[1.5]" aria-hidden />
            <span className="sr-only sm:not-sr-only sm:inline">Önceki</span>
          </Link>

          <ul className="listing-pagination-pages">
            {pageNumbers.map((pageNum, index) => {
              const prevNum = pageNumbers[index - 1];
              const showEllipsis = prevNum !== undefined && pageNum - prevNum > 1;

              return (
                <li key={pageNum} className="flex items-center gap-1">
                  {showEllipsis ? (
                    <span className="listing-pagination-ellipsis" aria-hidden>
                      …
                    </span>
                  ) : null}
                  <Link
                    href={buildPageHref(searchParams, pageNum)}
                    className={cn(
                      "listing-pagination-page",
                      pageNum === page && "listing-pagination-page-active",
                    )}
                    aria-current={pageNum === page ? "page" : undefined}
                    scroll
                  >
                    {pageNum}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href={nextHref}
            className={cn(
              "listing-pagination-btn",
              page >= totalPages && "pointer-events-none opacity-40",
            )}
            aria-disabled={page >= totalPages}
            scroll
          >
            <span className="sr-only sm:not-sr-only sm:inline">Sonraki</span>
            <ChevronRight className="size-5 stroke-[1.5]" aria-hidden />
          </Link>
        </div>
      ) : null}
    </nav>
  );
}
