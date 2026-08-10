"use client";

import { Menu, UserRound } from "lucide-react";
import Link from "next/link";
import { useCallback, useId, useState } from "react";
import { useDismiss } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface MenuEntry {
  label: string;
  href: string;
  emphasis?: boolean;
}

const GROUPS: MenuEntry[][] = [
  [
    { label: "Sign up", href: "/signup", emphasis: true },
    { label: "Log in", href: "/login" },
  ],
  [
    { label: "Wishlist", href: "/wishlist" },
    { label: "Trips", href: "/trips" },
  ],
  [
    { label: "Become a host", href: "/host" },
    { label: "Help Centre", href: "/help" },
  ],
];

/** Avatar button that opens the account dropdown. */
export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useDismiss<HTMLDivElement>(open, close);
  const menuId = useId();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? menuId : undefined}
        aria-label="Main menu"
        className={cn(
          "flex items-center gap-2 rounded-full border border-line bg-white py-1.5 pr-1.5 pl-3 transition hover:shadow-pill",
          open && "shadow-pill",
        )}
      >
        <Menu aria-hidden="true" className="size-4 text-ink" />
        <span className="flex size-7 items-center justify-center rounded-full bg-ink text-white">
          <UserRound aria-hidden="true" className="size-4" />
        </span>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-60 animate-pop-in overflow-hidden rounded-2xl border border-line bg-white py-2 shadow-pop"
        >
          {GROUPS.map((group, index) => (
            <div
              key={index}
              className={cn(index > 0 && "border-t border-line pt-2 mt-2")}
            >
              {group.map((entry) => (
                <Link
                  key={entry.href}
                  href={entry.href}
                  role="menuitem"
                  onClick={close}
                  className={cn(
                    "block px-4 py-2.5 text-sm transition hover:bg-surface",
                    entry.emphasis ? "font-semibold text-ink" : "text-ink",
                  )}
                >
                  {entry.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
