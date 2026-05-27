"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Car,
  Layers,
  Search,
  SquarePen,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  DEFAULT_HERO_SEARCH_FILTERS,
  HeroSearchFiltersPanel,
} from "@/components/home/HeroSearchFiltersPanel";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type {
  GroupedSearchResults,
  SearchHit,
  SearchIndexItem,
} from "@/features/search/types/search.types";
import {
  applyHeroSearchFilters,
  countActiveHeroSearchFilters,
  type HeroSearchFilters,
} from "@/features/search/utils/hero-search-filters";
import {
  countSearchMatches,
  querySearchIndex,
} from "@/features/search/utils/query-search-index";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

type HeroGlobalSearchProps = {
  index: SearchIndexItem[];
  trendingSearches: string[];
};

function trackHeroSearch(term: string) {
  const trimmed = term.trim();
  if (trimmed.length < 2) return;

  void fetch("/api/search/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: trimmed }),
    keepalive: true,
  }).catch(() => undefined);
}

const TYPE_META = {
  listing: {
    label: "Konut İlanları",
    icon: Building2,
    moreHref: (q: string) =>
      `${routes.listings.index}?search=${encodeURIComponent(q)}`,
  },
  project: {
    label: "Projeler",
    icon: Layers,
    moreHref: (q: string) =>
      `${routes.projects.index}?search=${encodeURIComponent(q)}`,
  },
  vehicle: {
    label: "Araç İlanları",
    icon: Car,
    moreHref: (q: string) =>
      `${routes.listings.index}?segment=arac&search=${encodeURIComponent(q)}`,
  },
} as const;

function flattenResults(results: GroupedSearchResults): SearchHit[] {
  return [...results.listings, ...results.projects, ...results.vehicles];
}

export function HeroGlobalSearch({
  index,
  trendingSearches,
}: HeroGlobalSearchProps) {
  const router = useRouter();
  const inputId = useId();
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<HeroSearchFilters>(
    DEFAULT_HERO_SEARCH_FILTERS,
  );
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const filteredIndex = useMemo(
    () => applyHeroSearchFilters(index, filters),
    [index, filters],
  );

  const results = useMemo(
    () => querySearchIndex(filteredIndex, query, { limitPerType: 5 }),
    [filteredIndex, query],
  );

  const flatHits = useMemo(() => flattenResults(results), [results]);
  const totalMatches = useMemo(
    () => (query.trim() ? countSearchMatches(index, query, filters) : 0),
    [index, query, filters],
  );

  const activeFilterCount = countActiveHeroSearchFilters(filters);
  const showResults = isResultsOpen && query.trim().length > 0;
  const hasQuery = query.trim().length > 0;

  const closeResults = useCallback(() => {
    setIsResultsOpen(false);
    setActiveIndex(-1);
  }, []);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target)) {
        closeResults();
        if (!window.matchMedia("(max-width: 1023px)").matches) {
          setIsFilterOpen(false);
        }
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [closeResults]);

  useEffect(() => {
    queueMicrotask(() => setActiveIndex(flatHits.length > 0 ? 0 : -1));
  }, [query, flatHits.length, filters]);

  function navigateToHit(hit: SearchHit, searchTerm?: string) {
    const term = searchTerm ?? query.trim();
    if (term) trackHeroSearch(term);

    closeResults();
    setIsFilterOpen(false);
    setIsMobileFilterOpen(false);
    setQuery("");
    router.push(hit.item.href);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    if (activeIndex >= 0 && flatHits[activeIndex]) {
      navigateToHit(flatHits[activeIndex], trimmed);
      return;
    }

    if (flatHits[0]) {
      navigateToHit(flatHits[0], trimmed);
      return;
    }

    trackHeroSearch(trimmed);
    router.push(`${routes.listings.index}?search=${encodeURIComponent(trimmed)}`);
    closeResults();
    setQuery("");
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!showResults) {
      if (event.key === "ArrowDown" && hasQuery) {
        setIsResultsOpen(true);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % Math.max(flatHits.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) =>
        prev <= 0 ? flatHits.length - 1 : prev - 1,
      );
    } else if (event.key === "Escape") {
      closeResults();
      setIsFilterOpen(false);
      inputRef.current?.blur();
    }
  }

  function openFilters() {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      setIsMobileFilterOpen(true);
    } else {
      setIsFilterOpen((open) => !open);
    }
  }

  function resetFilters() {
    setFilters(DEFAULT_HERO_SEARCH_FILTERS);
  }

  const sections: {
    key: keyof typeof TYPE_META;
    hits: SearchHit[];
  }[] = [
    { key: "listing", hits: results.listings },
    { key: "project", hits: results.projects },
    { key: "vehicle", hits: results.vehicles },
  ];

  let runningIndex = -1;

  return (
    <div ref={rootRef} className="hero-search">
      <div className="hero-panel hero-search-panel rounded-3xl p-6 md:p-9">
        <p className="hero-search-eyebrow">Akıllı Arama</p>
        <h2 className="hero-title hero-search-panel-title">Ne aramıştınız?</h2>

        <form onSubmit={handleSubmit} className="hero-search-form" role="search">
          <label htmlFor={inputId} className="sr-only">
            Site genelinde ara
          </label>

          <div className="hero-search-bar">
            <Search className="hero-search-bar-icon" aria-hidden />
            <input
              ref={inputRef}
              id={inputId}
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsResultsOpen(true);
              }}
              onFocus={() => setIsResultsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Şehir, ilan veya marka..."
              className={cn(
                "hero-search-bar-input",
                hasQuery && "hero-search-bar-input-with-clear",
              )}
              role="combobox"
              aria-expanded={showResults}
              aria-controls={listboxId}
              aria-autocomplete="list"
              autoComplete="off"
              enterKeyHint="search"
            />

            {hasQuery ? (
              <button
                type="button"
                className="hero-search-bar-clear"
                onClick={() => {
                  setQuery("");
                  closeResults();
                  inputRef.current?.focus();
                }}
                aria-label="Aramayı temizle"
              >
                <X className="size-4" aria-hidden />
              </button>
            ) : null}

            <button
              type="button"
              className={cn(
                "hero-search-bar-filter",
                (isFilterOpen || activeFilterCount > 0) &&
                  "hero-search-bar-filter-active",
              )}
              onClick={openFilters}
              aria-label="Arama kriterlerini düzenle"
              aria-expanded={isFilterOpen || isMobileFilterOpen}
            >
              <SquarePen className="size-[1.15rem]" aria-hidden />
              {activeFilterCount > 0 ? (
                <span className="hero-search-bar-filter-badge" aria-hidden>
                  {activeFilterCount}
                </span>
              ) : null}
            </button>
          </div>

          {isFilterOpen ? (
            <div className="hero-search-filter-dropdown hidden lg:block">
              <HeroSearchFiltersPanel
                filters={filters}
                onChange={setFilters}
                onReset={resetFilters}
              />
            </div>
          ) : null}
        </form>

        {trendingSearches.length > 0 ? (
          <div
            className="hero-search-quick"
            role="group"
            aria-label="Son günlerde popüler aramalar"
          >
            {trendingSearches.map((term) => (
              <button
                key={term}
                type="button"
                className="hero-search-quick-chip"
                onClick={() => {
                  trackHeroSearch(term);
                  setQuery(term);
                  setIsResultsOpen(true);
                  inputRef.current?.focus();
                }}
              >
                {term}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {showResults ? (
        <div
          id={listboxId}
          role="listbox"
          className="hero-search-dropdown"
          aria-label="Arama sonuçları"
        >
          {results.total === 0 ? (
            <div className="hero-search-empty">
              <p className="font-medium text-foreground">Sonuç bulunamadı</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Filtreleri genişletmeyi veya farklı bir kelime denemeyi deneyin.
              </p>
            </div>
          ) : (
            <>
              {sections.map(({ key, hits }) => {
                if (hits.length === 0) return null;
                const meta = TYPE_META[key];
                const Icon = meta.icon;

                return (
                  <div key={key} className="hero-search-group">
                    <p className="hero-search-group-label">
                      <Icon className="size-3.5" aria-hidden />
                      {meta.label}
                    </p>
                    <ul>
                      {hits.map((hit) => {
                        runningIndex += 1;
                        const itemIndex = runningIndex;
                        const isActive = itemIndex === activeIndex;

                        return (
                          <li key={hit.item.id}>
                            <button
                              type="button"
                              role="option"
                              aria-selected={isActive}
                              className={cn(
                                "hero-search-result",
                                isActive && "hero-search-result-active",
                              )}
                              onMouseEnter={() => setActiveIndex(itemIndex)}
                              onClick={() => navigateToHit(hit)}
                            >
                              <span className="hero-search-result-badge">
                                {hit.item.badge}
                              </span>
                              <span className="min-w-0 flex-1 text-left">
                                <span className="hero-search-result-title">
                                  {hit.item.title}
                                </span>
                                <span className="hero-search-result-subtitle">
                                  {hit.item.subtitle}
                                </span>
                              </span>
                              <ArrowRight
                                className="size-4 shrink-0 text-white/40"
                                aria-hidden
                              />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    {totalMatches > hits.length ? (
                      <Link
                        href={meta.moreHref(query.trim())}
                        className="hero-search-more"
                        onClick={closeResults}
                      >
                        Tümünü gör
                        <ArrowRight className="size-3.5" aria-hidden />
                      </Link>
                    ) : null}
                  </div>
                );
              })}
            </>
          )}
        </div>
      ) : null}

      <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
        <SheetContent
          side="bottom"
          className="mobile-app-sheet hero-search-filter-sheet flex flex-col gap-0 p-0 lg:hidden"
        >
          <div className="hero-search-filter-sheet-handle" aria-hidden />
          <SheetHeader className="mobile-app-sheet-header shrink-0 border-b border-border/60 px-5 py-3.5 text-left">
            <SheetTitle className="font-heading text-base">Arama kriterleri</SheetTitle>
          </SheetHeader>
          <div className="mobile-app-sheet-body min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
            <HeroSearchFiltersPanel
              filters={filters}
              onChange={setFilters}
              onReset={resetFilters}
              variant="sheet"
              hideChrome
              className="border-0 bg-transparent p-0 shadow-none"
            />
          </div>
          <div className="mobile-app-sheet-footer border-t border-border/60 p-4">
            <button
              type="button"
              className="hero-search-filter-apply"
              onClick={() => setIsMobileFilterOpen(false)}
            >
              Kriterleri uygula
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
