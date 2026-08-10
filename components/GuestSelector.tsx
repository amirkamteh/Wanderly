"use client";

import { Minus, Plus } from "lucide-react";
import type { GuestCounts } from "@/types/user";
import { cn } from "@/lib/utils";

interface GuestSelectorProps {
  value: GuestCounts;
  onChange: (value: GuestCounts) => void;
  /** Upper bound for adults + children. */
  maxGuests?: number;
}

const ROWS: Array<{
  key: keyof GuestCounts;
  label: string;
  hint: string;
  min: number;
  max: number;
}> = [
  { key: "adults", label: "Adults", hint: "Ages 13 or above", min: 0, max: 16 },
  { key: "children", label: "Children", hint: "Ages 2 – 12", min: 0, max: 15 },
  { key: "infants", label: "Infants", hint: "Under 2", min: 0, max: 5 },
  { key: "pets", label: "Pets", hint: "Assistance animals always welcome", min: 0, max: 5 },
];

export default function GuestSelector({ value, onChange, maxGuests = 16 }: GuestSelectorProps) {
  function step(key: keyof GuestCounts, delta: number) {
    const next = { ...value, [key]: value[key] + delta };
    // Adding an adult is implied when the first child or infant is added.
    if ((key === "children" || key === "infants") && delta > 0 && next.adults === 0) {
      next.adults = 1;
    }
    onChange(next);
  }

  const people = value.adults + value.children;

  return (
    <div className="divide-y divide-line">
      {ROWS.map((row) => {
        const count = value[row.key];
        const countsTowardTotal = row.key === "adults" || row.key === "children";
        const atMax = count >= row.max || (countsTowardTotal && people >= maxGuests);
        // Removing the last adult would strand children and infants.
        const atMin =
          count <= row.min ||
          (row.key === "adults" && count === 1 && value.children + value.infants > 0);

        return (
          <div key={row.key} className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-[15px] font-medium text-ink">{row.label}</p>
              <p className="text-sm text-muted">{row.hint}</p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <StepButton
                label={`Decrease ${row.label.toLowerCase()}`}
                icon="minus"
                disabled={atMin}
                onClick={() => step(row.key, -1)}
              />
              <span
                aria-live="polite"
                className="w-6 text-center text-[15px] tabular-nums text-ink"
              >
                {count}
              </span>
              <StepButton
                label={`Increase ${row.label.toLowerCase()}`}
                icon="plus"
                disabled={atMax}
                onClick={() => step(row.key, 1)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StepButton({
  label,
  icon,
  disabled,
  onClick,
}: {
  label: string;
  icon: "plus" | "minus";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = icon === "plus" ? Plus : Minus;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "flex size-8 items-center justify-center rounded-full border transition",
        disabled
          ? "cursor-default border-line text-line-strong"
          : "border-line-strong text-ink hover:border-ink active:scale-95",
      )}
    >
      <Icon aria-hidden="true" className="size-4" />
    </button>
  );
}
