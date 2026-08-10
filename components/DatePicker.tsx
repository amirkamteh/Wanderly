"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import type { DateRange } from "@/types/user";
import { addDays, cn, isoDate, startOfDay } from "@/lib/utils";

interface DatePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  /** Number of months side by side. One on mobile, two on desktop. */
  months?: number;
}

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function monthLabel(date: Date) {
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

/** Days in the month, padded so the grid starts on a Monday. */
function buildMonth(year: number, month: number): Array<Date | null> {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // getDay() is Sunday-first; shift so Monday is column 0.
  const lead = (first.getDay() + 6) % 7;
  return [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
}

export default function DatePicker({ value, onChange, months = 2 }: DatePickerProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [hovered, setHovered] = useState<string | null>(null);

  const visibleMonths = Array.from({ length: months }, (_, i) => {
    const date = new Date(cursor);
    date.setMonth(date.getMonth() + i);
    return date;
  });

  function handleSelect(day: Date) {
    const iso = isoDate(day);
    // First click, or restarting after a complete range, sets check-in.
    if (!value.start || (value.start && value.end)) {
      onChange({ start: iso, end: null });
      return;
    }
    // A second click before check-in becomes the new check-in.
    if (iso <= value.start) {
      onChange({ start: iso, end: null });
      return;
    }
    onChange({ start: value.start, end: iso });
  }

  /** The end of the range being previewed while hovering. */
  const previewEnd = value.start && !value.end ? hovered : value.end;

  function dayState(day: Date) {
    const iso = isoDate(day);
    const isPast = day < today;
    const isStart = iso === value.start;
    const isEnd = iso === previewEnd;
    const inRange =
      Boolean(value.start && previewEnd && iso > value.start && iso < previewEnd);
    return { iso, isPast, isStart, isEnd, inRange };
  }

  return (
    <div className="select-none">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          disabled={cursor <= new Date(today.getFullYear(), today.getMonth(), 1)}
          aria-label="Previous month"
          className="flex size-8 items-center justify-center rounded-full text-ink transition hover:bg-surface disabled:text-line-strong disabled:hover:bg-transparent"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          aria-label="Next month"
          className="flex size-8 items-center justify-center rounded-full text-ink transition hover:bg-surface"
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
      </div>

      <div className={cn("grid gap-8", months > 1 ? "sm:grid-cols-2" : "grid-cols-1")}>
        {visibleMonths.map((month) => (
          <div key={month.toISOString()} className={months > 1 ? "max-sm:hidden first:max-sm:block" : ""}>
            <p className="mb-3 text-center text-sm font-semibold text-ink">
              {monthLabel(month)}
            </p>
            <div className="grid grid-cols-7 gap-y-1" role="grid">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  role="columnheader"
                  className="pb-1 text-center text-[11px] font-medium text-muted"
                >
                  {day}
                </div>
              ))}

              {buildMonth(month.getFullYear(), month.getMonth()).map((day, index) => {
                if (!day) return <div key={`pad-${index}`} aria-hidden="true" />;
                const { iso, isPast, isStart, isEnd, inRange } = dayState(day);
                const isEdge = isStart || isEnd;

                return (
                  <div
                    key={iso}
                    className={cn(
                      "flex justify-center",
                      inRange && "bg-brand-50",
                      isStart && previewEnd && "rounded-l-full bg-brand-50",
                      isEnd && value.start && "rounded-r-full bg-brand-50",
                    )}
                  >
                    <button
                      type="button"
                      role="gridcell"
                      disabled={isPast}
                      onClick={() => handleSelect(day)}
                      onMouseEnter={() => setHovered(iso)}
                      onMouseLeave={() => setHovered(null)}
                      aria-label={day.toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                      aria-selected={isEdge}
                      className={cn(
                        "flex size-9 items-center justify-center rounded-full text-[13px] transition",
                        isPast && "cursor-default text-line-strong line-through",
                        !isPast && !isEdge && "text-ink hover:bg-line",
                        isEdge && "bg-ink font-semibold text-white",
                      )}
                    >
                      {day.getDate()}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        {[
          { label: "This weekend", offset: nextWeekendOffset(today) },
          { label: "Next week", offset: 7 },
          { label: "Next month", offset: 30 },
        ].map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() =>
              onChange({
                start: isoDate(addDays(today, preset.offset)),
                end: isoDate(addDays(today, preset.offset + 2)),
              })
            }
            className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink transition hover:border-ink"
          >
            {preset.label}
          </button>
        ))}
        {(value.start || value.end) && (
          <button
            type="button"
            onClick={() => onChange({ start: null, end: null })}
            className="ml-auto text-xs font-semibold text-ink underline underline-offset-2"
          >
            Clear dates
          </button>
        )}
      </div>
    </div>
  );
}

/** Days until the coming Friday (0 if today is Friday). */
function nextWeekendOffset(today: Date): number {
  const friday = 5;
  const current = today.getDay() === 0 ? 7 : today.getDay();
  const diff = friday - current;
  return diff >= 0 ? diff : diff + 7;
}
