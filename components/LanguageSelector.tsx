"use client";

import { Globe } from "lucide-react";
import { useCallback, useState } from "react";
import { LOCALE } from "@/data/footer";
import { useDismiss } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  "English (AE)",
  "English (UK)",
  "العربية",
  "Français",
  "Türkçe",
  "ქართული",
];

const CURRENCIES = ["AED", "USD", "EUR", "GBP", "GEL", "THB"];

/** Language and currency picker. Selection is presentational for now. */
export default function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<string>(LOCALE.language);
  const [currency, setCurrency] = useState<string>(LOCALE.currency);
  const close = useCallback(() => setOpen(false), []);
  const ref = useDismiss<HTMLDivElement>(open, close);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Choose language and currency"
        className={cn(
          "flex items-center gap-2 rounded-full transition hover:bg-surface",
          compact ? "px-3 py-2 text-sm text-ink" : "size-10 justify-center",
        )}
      >
        <Globe aria-hidden="true" className="size-4 text-ink" />
        {compact && (
          <span>
            {language} · {currency}
          </span>
        )}
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-50 w-72 animate-pop-in rounded-2xl border border-line bg-white p-4 shadow-pop",
            compact ? "bottom-[calc(100%+10px)] left-0" : "right-0 top-[calc(100%+10px)]",
          )}
        >
          <fieldset className="mb-4">
            <legend className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">
              Language
            </legend>
            <div className="grid grid-cols-2 gap-1">
              {LANGUAGES.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setLanguage(option)}
                  aria-pressed={language === option}
                  className={cn(
                    "rounded-lg px-2.5 py-2 text-left text-sm transition hover:bg-surface",
                    language === option && "font-semibold text-brand-700",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">
              Currency
            </legend>
            <div className="grid grid-cols-3 gap-1">
              {CURRENCIES.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCurrency(option)}
                  aria-pressed={currency === option}
                  className={cn(
                    "rounded-lg px-2.5 py-2 text-sm transition hover:bg-surface",
                    currency === option && "font-semibold text-brand-700",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      )}
    </div>
  );
}
