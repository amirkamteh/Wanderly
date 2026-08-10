"use client";

import { ArrowLeft, Check, Share } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ListingKind } from "@/types/listing";
import FavoriteButton from "./FavoriteButton";

interface DetailTopBarProps {
  id: string;
  kind: ListingKind;
  title: string;
}

/** Back, share and save controls shown above a detail page gallery. */
export default function DetailTopBar({ id, kind, title }: DetailTopBarProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    // Use the native sheet where it exists, otherwise fall back to the clipboard.
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // The traveller dismissed the sheet — fall through to copying.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (insecure context): nothing useful to do.
    }
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={() => router.back()}
        className="-ml-2 inline-flex items-center gap-2 rounded-full px-2 py-2 text-sm font-medium text-ink transition hover:bg-surface"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back
      </button>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={share}
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-ink transition hover:bg-surface"
        >
          {copied ? (
            <Check aria-hidden="true" className="size-4" />
          ) : (
            <Share aria-hidden="true" className="size-4" />
          )}
          <span className="hidden sm:inline">{copied ? "Link copied" : "Share"}</span>
        </button>

        <span className="inline-flex items-center gap-1.5 rounded-full pr-3 pl-1 text-sm font-medium text-ink">
          <FavoriteButton id={id} kind={kind} label={title} variant="plain" />
          <span className="hidden sm:inline">Save</span>
        </span>
      </div>
    </div>
  );
}
