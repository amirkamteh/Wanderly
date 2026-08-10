"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { inspirationTabs } from "@/data/inspiration";
import { cn } from "@/lib/utils";

/** 17 entries plus the "Show more" button fills three rows of six exactly. */
const COLLAPSED_COUNT = 17;

/** "Inspiration for future getaways": tabbed grid of destination links. */
export default function InspirationSection() {
  const [activeTab, setActiveTab] = useState(inspirationTabs[0].id);
  const [expanded, setExpanded] = useState(false);

  const tab = inspirationTabs.find((t) => t.id === activeTab) ?? inspirationTabs[0];
  const entries = expanded ? tab.entries : tab.entries.slice(0, COLLAPSED_COUNT);
  const canExpand = tab.entries.length > COLLAPSED_COUNT;

  return (
    <section className="mx-auto max-w-[1760px] page-gutter py-12" aria-labelledby="inspiration-heading">
      <h2
        id="inspiration-heading"
        className="text-[19px] font-semibold tracking-[-0.01em] text-ink sm:text-[22px]"
      >
        Inspiration for future getaways
      </h2>

      <div
        role="tablist"
        aria-label="Inspiration categories"
        className="scrollbar-hide -mx-6 mt-5 flex gap-6 overflow-x-auto border-b border-line px-6 sm:mx-0 sm:px-0"
      >
        {inspirationTabs.map((item) => {
          const isActive = item.id === tab.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${item.id}`}
              onClick={() => {
                setActiveTab(item.id);
                setExpanded(false);
              }}
              className={cn(
                "relative shrink-0 pb-3 text-sm whitespace-nowrap transition-colors",
                isActive ? "font-medium text-ink" : "text-muted hover:text-ink",
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

      <div
        role="tabpanel"
        id={`panel-${tab.id}`}
        aria-labelledby={`tab-${tab.id}`}
        className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
      >
        {entries.map((entry) => (
          <Link
            key={`${entry.place}-${entry.kind}`}
            href={`/search?tab=homes&where=${encodeURIComponent(entry.place)}`}
            className="group"
          >
            <span className="block text-sm font-medium text-ink group-hover:underline">
              {entry.place}
            </span>
            <span className="block text-sm text-muted">{entry.kind}</span>
          </Link>
        ))}

        {canExpand && (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            className="flex items-start gap-1 text-left text-sm font-medium text-ink"
          >
            {expanded ? "Show less" : "Show more"}
            <ChevronDown
              aria-hidden="true"
              className={cn("mt-0.5 size-4 transition-transform", expanded && "rotate-180")}
            />
          </button>
        )}
      </div>
    </section>
  );
}
