"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";
import FilterBar from "@/components/FilterBar";
import {
  filtersFromParams,
  filtersToParams,
  type Filters,
  type SearchTab,
} from "@/lib/search";
import { cn } from "@/lib/utils";

const TABS: Array<{ id: SearchTab; label: string }> = [
  { id: "homes", label: "Homes" },
  { id: "experiences", label: "Experiences" },
  { id: "services", label: "Services" },
];

/**
 * The interactive half of the search page. It only rewrites the URL — the
 * server component re-runs the query and re-renders the results, so filtering
 * happens in Postgres rather than in the browser.
 */
export default function SearchControls({ tab }: { tab: SearchTab }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const filters = useMemo(
    () => filtersFromParams(new URLSearchParams(params.toString())),
    [params],
  );

  const push = useCallback(
    (next: URLSearchParams) => {
      startTransition(() => {
        router.replace(`${pathname}?${next.toString()}`, { scroll: false });
      });
    },
    [pathname, router],
  );

  const applyFilters = useCallback(
    (next: Filters) => {
      const preserved = new URLSearchParams();
      preserved.set("tab", tab);
      for (const key of ["checkIn", "checkOut", "infants", "pets", "service"]) {
        const value = params.get(key);
        if (value) preserved.set(key, value);
      }
      push(filtersToParams(next, preserved));
    },
    [params, push, tab],
  );

  /** Live count for the filter sheet, resolved on the server. */
  const countFor = useCallback(
    async (draft: Filters, signal: AbortSignal) => {
      const query = filtersToParams(draft, new URLSearchParams({ tab }));
      const service = params.get("service");
      if (service) query.set("service", service);

      const response = await fetch(`/api/search/count?${query.toString()}`, { signal });
      if (!response.ok) throw new Error("count request failed");
      const body: { count?: number } = await response.json();
      return body.count ?? 0;
    },
    [params, tab],
  );

  function switchTab(next: SearchTab) {
    const preserved = new URLSearchParams(params.toString());
    preserved.set("tab", next);
    push(preserved);
  }

  return (
    <div className={cn(isPending && "opacity-60 transition-opacity")}>
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

      <FilterBar
        filters={filters}
        onChange={applyFilters}
        countFor={countFor}
        showPlaceTypes={tab === "homes"}
      />
    </div>
  );
}
