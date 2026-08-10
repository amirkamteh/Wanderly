"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDateRange, formatGuests } from "@/lib/formatters";
import { useFocusTrap, useScrollLock } from "@/lib/hooks";
import { useSearchState } from "@/lib/searchState";
import { cn } from "@/lib/utils";
import DatePicker from "./DatePicker";
import DestinationPicker from "./DestinationPicker";
import GuestSelector from "./GuestSelector";
import { ServiceTypePicker, type SearchVariant } from "./SearchBar";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  variant: SearchVariant;
}

type Step = "where" | "when" | "who";

/** Full-screen search sheet used on mobile and tablet. */
export default function SearchModal({ open, onClose, variant }: SearchModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("where");
  const {
    destination,
    dates,
    guests,
    serviceType,
    setDestination,
    setDates,
    setGuests,
    setServiceType,
    reset,
    toQueryString,
  } = useSearchState();

  useScrollLock(open);
  const panelRef = useFocusTrap<HTMLDivElement>(open);

  if (!open) return null;

  const whoLabel = variant === "services" ? "Type of service" : "Who";
  const summaries: Record<Step, string> = {
    where: destination || "Anywhere",
    when: formatDateRange(dates.start, dates.end) || "Any week",
    who: (variant === "services" ? serviceType : formatGuests(guests)) || "Add guests",
  };

  function submit() {
    onClose();
    router.push(`/search?${toQueryString(variant)}`);
  }

  return (
    <div className="fixed inset-0 z-[100] md:hidden" role="dialog" aria-modal="true" aria-label="Search">
      <div className="absolute inset-0 bg-black/25" onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        className="absolute inset-0 flex animate-sheet-up flex-col bg-surface"
      >
        <header className="flex items-center justify-between border-b border-line bg-white px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex size-9 items-center justify-center rounded-full border border-line bg-white"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
          <p className="text-sm font-semibold text-ink">Search</p>
          <span className="size-9" aria-hidden="true" />
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {(["where", "when", "who"] as const).map((current) => {
            const isActive = step === current;
            const label =
              current === "where" ? "Where" : current === "when" ? "When" : whoLabel;

            return (
              <section
                key={current}
                className={cn(
                  "overflow-hidden rounded-2xl bg-white shadow-sm transition",
                  isActive ? "p-5" : "px-5 py-4",
                )}
              >
                {isActive ? (
                  <>
                    <h2 className="mb-4 text-xl font-semibold text-ink">
                      {current === "where"
                        ? "Where to?"
                        : current === "when"
                          ? "When is your trip?"
                          : variant === "services"
                            ? "What do you need?"
                            : "Who is coming?"}
                    </h2>

                    {current === "where" && (
                      <DestinationPicker
                        query={destination}
                        onQueryChange={setDestination}
                        onSelect={(value) => {
                          setDestination(value);
                          setStep("when");
                        }}
                      />
                    )}
                    {current === "when" && (
                      <DatePicker value={dates} onChange={setDates} months={1} />
                    )}
                    {current === "who" &&
                      (variant === "services" ? (
                        <ServiceTypePicker value={serviceType} onChange={setServiceType} />
                      ) : (
                        <GuestSelector value={guests} onChange={setGuests} />
                      ))}
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStep(current)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <span className="text-sm font-medium text-muted">{label}</span>
                    <span className="truncate text-sm font-medium text-ink">
                      {summaries[current]}
                    </span>
                  </button>
                )}
              </section>
            );
          })}
        </div>

        <footer className="flex items-center justify-between border-t border-line bg-white px-4 py-3">
          <button
            type="button"
            onClick={reset}
            className="text-sm font-semibold text-ink underline underline-offset-2"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={submit}
            className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Search
          </button>
        </footer>
      </div>
    </div>
  );
}
