"use client";

import Image from "next/image";
import { MapPin, Search } from "lucide-react";
import { useMemo } from "react";
import { destinations, flexibleRegions } from "@/data/cities";
import { cn } from "@/lib/utils";

interface DestinationPickerProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSelect: (value: string) => void;
}

/** Suggestion list shown under the "Where" field. */
export default function DestinationPicker({
  query,
  onQueryChange,
  onSelect,
}: DestinationPickerProps) {
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return destinations.slice(0, 6);
    return destinations
      .filter(
        (d) =>
          d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [query]);

  return (
    <div>
      <label className="mb-3 flex items-center gap-2 rounded-xl border border-line px-3 py-2.5 focus-within:border-ink md:hidden">
        <Search aria-hidden="true" className="size-4 shrink-0 text-muted" />
        <span className="sr-only">Search destinations</span>
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search destinations"
          className="w-full bg-transparent text-[15px] outline-none placeholder:text-subtle"
        />
      </label>

      {!query.trim() && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">
            Search by region
          </p>
          <div className="flex flex-wrap gap-2">
            {flexibleRegions.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => onSelect(region === "I'm flexible" ? "" : region)}
                className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink transition hover:border-ink"
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      )}

      <ul className="max-h-72 overflow-y-auto">
        {matches.map((destination) => (
          <li key={`${destination.name}-${destination.country}`}>
            <button
              type="button"
              onClick={() => onSelect(destination.name)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-surface",
              )}
            >
              <span className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-surface">
                <Image
                  src={destination.image}
                  alt=""
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-medium text-ink">
                  {destination.name}
                </span>
                <span className="block truncate text-sm text-muted">
                  {destination.hint}
                </span>
              </span>
            </button>
          </li>
        ))}

        {matches.length === 0 && (
          <li className="flex items-center gap-2 p-3 text-sm text-muted">
            <MapPin aria-hidden="true" className="size-4" />
            No destinations match “{query}”. Try a city or country.
          </li>
        )}
      </ul>
    </div>
  );
}
