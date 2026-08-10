"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { useWishlist } from "@/lib/wishlist";
import type { ListingKind } from "@/types/listing";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  id: string;
  kind: ListingKind;
  /** Accessible name context, e.g. the listing title. */
  label: string;
  /** `overlay` sits on top of an image; `plain` sits on a white surface. */
  variant?: "overlay" | "plain";
  className?: string;
}

export default function FavoriteButton({
  id,
  kind,
  label,
  variant = "overlay",
  className,
}: FavoriteButtonProps) {
  const { isSaved, toggle, ready } = useWishlist();
  const [justSaved, setJustSaved] = useState(false);
  const saved = ready && isSaved(id);

  function handleClick(event: React.MouseEvent) {
    // Cards wrap the button in a link — never navigate when saving.
    event.preventDefault();
    event.stopPropagation();
    if (!saved) {
      setJustSaved(true);
      window.setTimeout(() => setJustSaved(false), 320);
    }
    toggle(id, kind);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${label} from wishlist` : `Save ${label} to wishlist`}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-transform duration-150 hover:scale-110 active:scale-95",
        variant === "overlay" ? "size-8" : "size-10 hover:bg-surface",
        className,
      )}
    >
      <Heart
        aria-hidden="true"
        className={cn(
          "transition-colors",
          variant === "overlay" ? "size-6" : "size-5",
          justSaved && "animate-[heart-pop_0.3s_cubic-bezier(0.16,1,0.3,1)]",
          saved
            ? "fill-brand-600 text-brand-600"
            : variant === "overlay"
              ? "fill-black/45 text-white [stroke-width:1.7]"
              : "fill-transparent text-ink [stroke-width:1.8]",
        )}
      />
    </button>
  );
}
