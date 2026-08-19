"use client";

import { Menu, UserRound } from "lucide-react";
import Link from "next/link";
import { useCallback, useId, useState } from "react";
import { signOut } from "@/app/actions/auth";
import { initialsFor, type CurrentUser } from "@/lib/authState";
import { useDismiss } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface MenuEntry {
  label: string;
  href: string;
  emphasis?: boolean;
}

const SIGNED_OUT: MenuEntry[][] = [
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

const SIGNED_IN: MenuEntry[][] = [
  [
    { label: "Trips", href: "/trips", emphasis: true },
    { label: "Wishlist", href: "/wishlist" },
  ],
  [
    { label: "Booking requests", href: "/host/bookings" },
    { label: "Become a host", href: "/host" },
    { label: "Help Centre", href: "/help" },
  ],
];

/** Avatar button that opens the account dropdown. */
export default function UserMenu({ user }: { user: CurrentUser | null }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useDismiss<HTMLDivElement>(open, close);
  const menuId = useId();

  const groups = user ? SIGNED_IN : SIGNED_OUT;
  const label = user
    ? `Account menu for ${user.firstName || user.email}`
    : "Main menu";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? menuId : undefined}
        aria-label={label}
        className={cn(
          "flex items-center gap-2 rounded-full border border-line bg-white py-1.5 pr-1.5 pl-3 transition hover:shadow-pill",
          open && "shadow-pill",
        )}
      >
        <Menu aria-hidden="true" className="size-4 text-ink" />
        <span
          className={cn(
            "flex size-7 items-center justify-center rounded-full text-white",
            user ? "bg-brand-600 text-xs font-semibold" : "bg-ink",
          )}
        >
          {user ? initialsFor(user) : <UserRound aria-hidden="true" className="size-4" />}
        </span>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-60 animate-pop-in overflow-hidden rounded-2xl border border-line bg-white py-2 shadow-pop"
        >
          {user && (
            <div className="border-b border-line px-4 pt-1 pb-3">
              <p className="truncate text-sm font-semibold text-ink">
                {[user.firstName, user.lastName].filter(Boolean).join(" ") || "Signed in"}
              </p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
          )}

          {groups.map((group, index) => (
            <div key={index} className={cn(index > 0 && "mt-2 border-t border-line pt-2")}>
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

          {user && (
            <form action={signOut} className="mt-2 border-t border-line pt-2">
              <button
                type="submit"
                role="menuitem"
                className="block w-full px-4 py-2.5 text-left text-sm text-ink transition hover:bg-surface"
              >
                Log out
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
