"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  PRICE_MAX,
  PRICE_MIN,
  amenityFilters,
  placeTypes,
  propertyTypes,
} from "@/data/categories";
import { formatPrice } from "@/lib/formatters";
import { useFocusTrap, useScrollLock } from "@/lib/hooks";
import { amenityIcons } from "@/lib/amenities";
import { emptyFilters, type Filters } from "@/lib/search";
import { cn } from "@/lib/utils";

interface FilterModalProps {
  onClose: () => void;
  filters: Filters;
  onApply: (filters: Filters) => void;
  /** Result count for the apply button, recalculated as the draft changes. */
  countFor: (filters: Filters, signal: AbortSignal) => Promise<number>;
}

/**
 * Full filter sheet. Edits a local draft so nothing is applied until the
 * traveller confirms — closing discards.
 *
 * The parent mounts this only while it is open, so the draft is seeded from
 * `filters` on mount and no synchronising effect is needed.
 */
export default function FilterModal({
  onClose,
  filters,
  onApply,
  countFor,
}: FilterModalProps) {
  const [draft, setDraft] = useState<Filters>(filters);

  useScrollLock(true);
  const panelRef = useFocusTrap<HTMLDivElement>(true);

  const update = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const toggleIn = (key: "placeTypes" | "propertyTypes" | "amenities", id: string) =>
    setDraft((current) => ({
      ...current,
      [key]: current[key].includes(id)
        ? current[key].filter((value) => value !== id)
        : [...current[key], id],
    }));

  const count = useDraftCount(draft, countFor);

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Filters">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        className="absolute inset-x-0 bottom-0 flex max-h-[92vh] animate-sheet-up flex-col rounded-t-2xl bg-white sm:inset-0 sm:m-auto sm:h-fit sm:max-w-[600px] sm:animate-pop-in sm:rounded-2xl"
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="flex size-8 items-center justify-center rounded-full transition hover:bg-surface"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
          <h2 className="text-base font-semibold text-ink">Filters</h2>
          <span className="size-8" aria-hidden="true" />
        </header>

        <div className="flex-1 space-y-8 overflow-y-auto px-5 py-6">
          <Group title="Type of place">
            <div className="flex flex-wrap gap-2">
              {placeTypes.map((option) => (
                <Chip
                  key={option.id}
                  selected={draft.placeTypes.includes(option.id)}
                  onClick={() => toggleIn("placeTypes", option.id)}
                >
                  {option.label}
                </Chip>
              ))}
            </div>
          </Group>

          <Group title="Price range" hint="Nightly rate before fees and taxes">
            <div className="flex items-center gap-4">
              <RangeField
                label="Minimum"
                value={draft.minPrice}
                min={PRICE_MIN}
                max={draft.maxPrice}
                onChange={(value) => update("minPrice", value)}
              />
              <span aria-hidden="true" className="mt-6 h-px w-4 bg-line-strong" />
              <RangeField
                label="Maximum"
                value={draft.maxPrice}
                min={draft.minPrice}
                max={PRICE_MAX}
                onChange={(value) => update("maxPrice", value)}
              />
            </div>
            <input
              type="range"
              aria-label="Maximum price"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={50}
              value={draft.maxPrice}
              onChange={(event) => update("maxPrice", Number(event.target.value))}
              className="mt-4 w-full accent-[var(--color-brand-600)]"
            />
            <p className="mt-1 text-xs text-muted">
              {formatPrice(draft.minPrice)} – {formatPrice(draft.maxPrice)}
              {draft.maxPrice >= PRICE_MAX && "+"}
            </p>
          </Group>

          <Group title="Rooms and beds">
            <div className="space-y-4">
              {(
                [
                  ["bedrooms", "Bedrooms"],
                  ["beds", "Beds"],
                  ["bathrooms", "Bathrooms"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <p className="mb-2 text-sm font-medium text-ink">{label}</p>
                  <div className="flex flex-wrap gap-2">
                    {[0, 1, 2, 3, 4, 5].map((value) => (
                      <Chip
                        key={value}
                        selected={draft[key] === value}
                        onClick={() => update(key, value)}
                      >
                        {value === 0 ? "Any" : value === 5 ? "5+" : value}
                      </Chip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Group>

          <Group title="Amenities">
            <div className="flex flex-wrap gap-2">
              {amenityFilters.map((amenity) => {
                const Icon = amenityIcons[amenity.icon];
                return (
                  <Chip
                    key={amenity.id}
                    selected={draft.amenities.includes(amenity.id)}
                    onClick={() => toggleIn("amenities", amenity.id)}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                    {amenity.label}
                  </Chip>
                );
              })}
            </div>
          </Group>

          <Group title="Guest rating">
            <div className="flex flex-wrap gap-2">
              {[0, 4.5, 4.8, 4.9].map((value) => (
                <Chip
                  key={value}
                  selected={draft.minRating === value}
                  onClick={() => update("minRating", value)}
                >
                  {value === 0 ? "Any rating" : `${value}+`}
                </Chip>
              ))}
            </div>
          </Group>

          <Group title="Property type">
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map((option) => (
                <Chip
                  key={option.id}
                  selected={draft.propertyTypes.includes(option.id)}
                  onClick={() => toggleIn("propertyTypes", option.id)}
                >
                  {option.label}
                </Chip>
              ))}
            </div>
          </Group>
        </div>

        <footer className="flex items-center justify-between border-t border-line px-5 py-4">
          <button
            type="button"
            onClick={() => setDraft({ ...emptyFilters, destination: draft.destination })}
            className="text-sm font-semibold text-ink underline underline-offset-2"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {count === null ? "Show results" : `Show ${count} ${count === 1 ? "place" : "places"}`}
          </button>
        </footer>
      </div>
    </div>
  );
}

/**
 * Debounced result count for the current draft. Returns `null` until the
 * first response lands, so the button never shows a stale or invented number.
 * Each keystroke aborts the previous request.
 */
function useDraftCount(
  draft: Filters,
  countFor: (filters: Filters, signal: AbortSignal) => Promise<number>,
) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      countFor(draft, controller.signal)
        .then(setCount)
        .catch((error: unknown) => {
          // An aborted request is the expected path while typing.
          if (!(error instanceof DOMException && error.name === "AbortError")) {
            setCount(null);
          }
        });
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [draft, countFor]);

  return count;
}

function Group({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {hint && <p className="mt-0.5 mb-3 text-sm text-muted">{hint}</p>}
      <div className={hint ? "" : "mt-3"}>{children}</div>
    </section>
  );
}

function Chip({
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
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
        selected
          ? "border-ink bg-ink text-white"
          : "border-line text-ink hover:border-ink",
      )}
    >
      {children}
    </button>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex-1">
      <span className="mb-1 block text-xs text-muted">{label}</span>
      <span className="flex items-center gap-1 rounded-xl border border-line px-3 py-2 focus-within:border-ink">
        <span className="text-sm text-muted">AED</span>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (Number.isFinite(next)) onChange(Math.min(Math.max(next, min), max));
          }}
          className="w-full bg-transparent text-sm outline-none"
        />
      </span>
    </label>
  );
}
