"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { serviceTypeOptions } from "@/data/categories";
import { formatDateRange, formatGuests } from "@/lib/formatters";
import { useDismiss } from "@/lib/hooks";
import { useSearchState } from "@/lib/searchState";
import { cn } from "@/lib/utils";
import DatePicker from "./DatePicker";
import DestinationPicker from "./DestinationPicker";
import GuestSelector from "./GuestSelector";

export type SearchVariant = "homes" | "experiences" | "services";

/** Field labels and placeholders differ per vertical, as in the reference. */
const COPY: Record<SearchVariant, { where: string; who: string; whoPlaceholder: string }> = {
  homes: { where: "Search destinations", who: "Who", whoPlaceholder: "Add guests" },
  experiences: {
    where: "Search by city or landmark",
    who: "Who",
    whoPlaceholder: "Add guests",
  },
  services: {
    where: "Search destinations",
    who: "Type of service",
    whoPlaceholder: "Add service",
  },
};

type OpenField = "where" | "when" | "who" | null;

interface SearchBarProps {
  variant: SearchVariant;
  /** Opens the mobile search sheet. */
  onMobileOpen: () => void;
}

export default function SearchBar({ variant, onMobileOpen }: SearchBarProps) {
  const router = useRouter();
  const copy = COPY[variant];
  const {
    destination,
    dates,
    guests,
    serviceType,
    setDestination,
    setDates,
    setGuests,
    setServiceType,
    toQueryString,
  } = useSearchState();

  const [open, setOpen] = useState<OpenField>(null);
  const close = useCallback(() => setOpen(null), []);
  const containerRef = useDismiss<HTMLDivElement>(open !== null, close);

  function submit() {
    close();
    router.push(`/search?${toQueryString(variant)}`);
  }

  const dateSummary = formatDateRange(dates.start, dates.end);
  const guestSummary =
    variant === "services" ? serviceType : formatGuests(guests);

  return (
    <>
      {/* Mobile: a compact pill that opens the full-screen sheet. */}
      <button
        type="button"
        onClick={onMobileOpen}
        aria-label="Open search"
        className="flex w-full items-center gap-3 rounded-full border border-line bg-white px-4 py-3 text-left shadow-pill transition hover:shadow-pop md:hidden"
      >
        <Search aria-hidden="true" className="size-4 shrink-0 text-ink" />
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-ink">
            {destination || "Where to?"}
          </span>
          <span className="block truncate text-xs text-muted">
            {[dateSummary || "Any week", guestSummary || copy.whoPlaceholder]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </span>
      </button>

      {/* Desktop: the full three-segment pill. */}
      <div
        ref={containerRef}
        className="relative mx-auto hidden w-full max-w-[850px] md:block"
      >
        <div
          className={cn(
            "flex items-center rounded-full border border-line bg-white transition-shadow",
            open ? "shadow-pop" : "shadow-pill hover:shadow-pop",
          )}
        >
          <Segment
            label="Where"
            value={destination}
            placeholder={copy.where}
            active={open === "where"}
            onClick={() => setOpen(open === "where" ? null : "where")}
            className="flex-[1.2] rounded-l-full pl-6"
          />
          <Divider hidden={open === "where" || open === "when"} />
          <Segment
            label="When"
            value={dateSummary}
            placeholder="Add dates"
            active={open === "when"}
            onClick={() => setOpen(open === "when" ? null : "when")}
            className="flex-1"
          />
          <Divider hidden={open === "when" || open === "who"} />
          <Segment
            label={copy.who}
            value={guestSummary}
            placeholder={copy.whoPlaceholder}
            active={open === "who"}
            onClick={() => setOpen(open === "who" ? null : "who")}
            className="flex-1 rounded-r-full"
          />

          <div className="p-2">
            <button
              type="button"
              onClick={submit}
              aria-label="Search"
              className="flex size-12 items-center justify-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700 active:scale-95"
            >
              <Search aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>

        {open && (
          <div
            role="dialog"
            aria-label={
              open === "where" ? "Choose a destination" : open === "when" ? "Choose dates" : copy.who
            }
            className={cn(
              "absolute top-[calc(100%+12px)] z-50 animate-pop-in rounded-3xl border border-line bg-white p-6 shadow-pop",
              open === "where" && "left-0 w-[420px]",
              open === "when" && "left-1/2 w-[720px] -translate-x-1/2",
              open === "who" && "right-0 w-[420px]",
            )}
          >
            {open === "where" && (
              <DestinationPicker
                query={destination}
                onQueryChange={setDestination}
                onSelect={(value) => {
                  setDestination(value);
                  setOpen("when");
                }}
              />
            )}

            {open === "when" && <DatePicker value={dates} onChange={setDates} />}

            {open === "who" &&
              (variant === "services" ? (
                <ServiceTypePicker value={serviceType} onChange={setServiceType} />
              ) : (
                <GuestSelector value={guests} onChange={setGuests} />
              ))}
          </div>
        )}
      </div>
    </>
  );
}

function Segment({
  label,
  value,
  placeholder,
  active,
  onClick,
  className,
}: {
  label: string;
  value: string;
  placeholder: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={active}
      className={cn(
        "min-w-0 px-6 py-3.5 text-left transition-colors",
        active ? "rounded-full bg-surface" : "hover:rounded-full hover:bg-surface/70",
        className,
      )}
    >
      <span className="block text-xs font-semibold text-ink">{label}</span>
      <span
        className={cn(
          "block truncate text-sm",
          value ? "text-ink" : "text-subtle",
        )}
      >
        {value || placeholder}
      </span>
    </button>
  );
}

function Divider({ hidden }: { hidden: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn("h-8 w-px shrink-0 bg-line transition-opacity", hidden && "opacity-0")}
    />
  );
}

export function ServiceTypePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-ink">
        What do you need?
      </legend>
      <div className="flex flex-wrap gap-2">
        {serviceTypeOptions.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(selected ? "" : option)}
              aria-pressed={selected}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                selected
                  ? "border-ink bg-ink text-white"
                  : "border-line text-ink hover:border-ink",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
