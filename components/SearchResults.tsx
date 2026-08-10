"use client";

import { SearchX } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import ExperienceCard from "@/components/ExperienceCard";
import FilterBar from "@/components/FilterBar";
import ListingCard from "@/components/ListingCard";
import ListingGrid from "@/components/ListingGrid";
import ServiceCard from "@/components/ServiceCard";
import { formatDateRange } from "@/lib/formatters";
import {
  filterExperiences,
  filterHomes,
  filterServices,
  filtersFromParams,
  filtersToParams,
  type Filters,
  type SearchTab,
} from "@/lib/search";
import { cn, pluralize } from "@/lib/utils";

const TABS: Array<{ id: SearchTab; label: string }> = [
  { id: "homes", label: "Homes" },
  { id: "experiences", label: "Experiences" },
  { id: "services", label: "Services" },
];

const GRID_SIZES =
  "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, (max-width: 1280px) 31vw, 23vw";

export default function SearchResults() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const tabParam = params.get("tab");
  const tab: SearchTab =
    tabParam === "experiences" || tabParam === "services" ? tabParam : "homes";
  const serviceType = params.get("service") ?? undefined;

  const filters = useMemo(
    () => filtersFromParams(new URLSearchParams(params.toString())),
    [params],
  );

  /** Rewrites the URL so results, filters and back/forward stay in sync. */
  const applyFilters = useCallback(
    (next: Filters) => {
      const preserved = new URLSearchParams();
      preserved.set("tab", tab);
      for (const key of ["checkIn", "checkOut", "infants", "pets", "service"]) {
        const value = params.get(key);
        if (value) preserved.set(key, value);
      }
      router.replace(`${pathname}?${filtersToParams(next, preserved).toString()}`, {
        scroll: false,
      });
    },
    [params, pathname, router, tab],
  );

  const homeResults = useMemo(() => filterHomes(filters), [filters]);
  const experienceResults = useMemo(() => filterExperiences(filters), [filters]);
  const serviceResults = useMemo(
    () => filterServices(filters, serviceType),
    [filters, serviceType],
  );

  const results =
    tab === "homes" ? homeResults : tab === "experiences" ? experienceResults : serviceResults;

  /** Live count for the filter sheet's apply button. */
  const countFor = useCallback(
    (draft: Filters) =>
      tab === "homes"
        ? filterHomes(draft).length
        : tab === "experiences"
          ? filterExperiences(draft).length
          : filterServices(draft, serviceType).length,
    [tab, serviceType],
  );

  const dates = formatDateRange(params.get("checkIn"), params.get("checkOut"));
  const guests = Number(params.get("guests") ?? 0);
  const noun = tab === "homes" ? "stay" : tab === "experiences" ? "experience" : "service";

  const summary = [
    dates || null,
    guests ? pluralize(guests, "guest") : null,
    serviceType ?? null,
  ].filter(Boolean);

  function switchTab(next: SearchTab) {
    const preserved = new URLSearchParams(params.toString());
    preserved.set("tab", next);
    router.replace(`${pathname}?${preserved.toString()}`, { scroll: false });
  }

  return (
    <div className="mx-auto max-w-[1760px] page-gutter py-6">
      <header className="mb-5">
        <h1 className="text-xl font-semibold tracking-[-0.01em] text-ink sm:text-2xl">
          {`${results.length}${results.length >= 100 ? "+" : ""} ${
            results.length === 1 ? noun : `${noun}s`
          }${filters.destination ? ` in ${filters.destination}` : " worldwide"}`}
        </h1>
        {summary.length > 0 && (
          <p className="mt-1 text-[15px] text-muted">{summary.join(" · ")}</p>
        )}
      </header>

      <div
        role="tablist"
        aria-label="Result type"
        className="mb-5 flex gap-2 border-b border-line"
      >
        {TABS.map((item) => {
          const isActive = item.id === tab;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => switchTab(item.id)}
              className={cn(
                "relative px-1 pb-3 text-sm transition-colors",
                isActive ? "font-semibold text-ink" : "text-muted hover:text-ink",
              )}
            >
              {item.label}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-ink transition-opacity",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          );
        })}
      </div>

      <div className="mb-8">
        <FilterBar
          filters={filters}
          onChange={applyFilters}
          countFor={countFor}
          showPlaceTypes={tab === "homes"}
        />
      </div>

      {results.length === 0 ? (
        <EmptyResults onReset={() => applyFilters({ ...filters, destination: "" })} />
      ) : (
        <ListingGrid>
          {tab === "homes" &&
            homeResults.map((home, index) => (
              <ListingCard
                key={home.id}
                home={home}
                priority={index < 4}
                sizes={GRID_SIZES}
              />
            ))}

          {tab === "experiences" &&
            experienceResults.map((experience, index) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                priority={index < 4}
                sizes={GRID_SIZES}
              />
            ))}

          {tab === "services" &&
            serviceResults.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                priority={index < 4}
                sizes={GRID_SIZES}
              />
            ))}
        </ListingGrid>
      )}
    </div>
  );
}

function EmptyResults({ onReset }: { onReset: () => void }) {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <SearchX aria-hidden="true" className="mx-auto size-10 text-line-strong" />
      <h2 className="mt-4 text-lg font-semibold text-ink">No exact matches</h2>
      <p className="mt-2 text-[15px] text-muted">
        Try removing a filter or searching a wider area — there is plenty available
        nearby.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-ink px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface"
        >
          Search everywhere
        </button>
        <Link
          href="/"
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Back to explore
        </Link>
      </div>
    </div>
  );
}
