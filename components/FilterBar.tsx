"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { amenityFilters, placeTypes, sortOptions } from "@/data/categories";
import { activeFilterCount, emptyFilters, type Filters } from "@/lib/search";
import { cn } from "@/lib/utils";
import FilterModal from "./FilterModal";

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  /** Resolves the result count for a draft, server-side. */
  countFor: (filters: Filters, signal: AbortSignal) => Promise<number>;
  /** Hides stay-only chips on the experiences and services tabs. */
  showPlaceTypes?: boolean;
}

/** Quick-filter chips, sort control and the entry point to the full sheet. */
export default function FilterBar({
  filters,
  onChange,
  countFor,
  showPlaceTypes = true,
}: FilterBarProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const activeCount = activeFilterCount(filters);

  function toggleList(key: "placeTypes" | "amenities", id: string) {
    onChange({
      ...filters,
      [key]: filters[key].includes(id)
        ? filters[key].filter((value) => value !== id)
        : [...filters[key], id],
    });
  }

  return (
    <div className="flex items-center gap-3">
      <div className="scrollbar-hide flex flex-1 items-center gap-2 overflow-x-auto">
        {showPlaceTypes &&
          placeTypes.map((option) => (
            <QuickChip
              key={option.id}
              selected={filters.placeTypes.includes(option.id)}
              onClick={() => toggleList("placeTypes", option.id)}
            >
              {option.label}
            </QuickChip>
          ))}

        {amenityFilters.slice(0, 5).map((amenity) => (
          <QuickChip
            key={amenity.id}
            selected={filters.amenities.includes(amenity.id)}
            onClick={() => toggleList("amenities", amenity.id)}
          >
            {amenity.label}
          </QuickChip>
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => onChange({ ...emptyFilters, destination: filters.destination })}
            className="hidden items-center gap-1 rounded-full border border-line px-3 py-2 text-sm text-ink transition hover:border-ink sm:inline-flex"
          >
            <X aria-hidden="true" className="size-3.5" />
            Clear
          </button>
        )}

        <label className="hidden items-center gap-2 rounded-full border border-line px-3 py-2 text-sm sm:inline-flex">
          <span className="text-muted">Sort</span>
          <select
            value={filters.sort}
            onChange={(event) => onChange({ ...filters, sort: event.target.value })}
            className="bg-transparent font-medium text-ink outline-none"
            aria-label="Sort results"
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
            activeCount > 0 ? "border-ink bg-surface text-ink" : "border-line text-ink hover:border-ink",
          )}
        >
          <SlidersHorizontal aria-hidden="true" className="size-4" />
          Filters
          {activeCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Mounted only while open so the draft state is seeded fresh each time. */}
      {modalOpen && (
        <FilterModal
          onClose={() => setModalOpen(false)}
          filters={filters}
          onApply={onChange}
          countFor={countFor}
        />
      )}
    </div>
  );
}

function QuickChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-2 text-sm whitespace-nowrap transition",
        selected
          ? "border-ink bg-ink text-white"
          : "border-line text-ink hover:border-ink",
      )}
    >
      {children}
    </button>
  );
}
