"use client";

import { Briefcase, Heart, Search, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";
import type { CurrentUser } from "@/lib/authState";
import { cn } from "@/lib/utils";

interface Tab {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Shows the saved-items count. */
  badge?: boolean;
}

function tabsFor(user: CurrentUser | null): Tab[] {
  return [
    { href: "/", label: "Explore", icon: Search },
    { href: "/wishlist", label: "Wishlist", icon: Heart, badge: true },
    { href: "/trips", label: "Trips", icon: Briefcase },
    user
      ? { href: "/trips", label: user.firstName || "Account", icon: UserRound }
      : { href: "/login", label: "Log in", icon: UserRound },
  ];
}

/** Fixed bottom tab bar shown on small screens. */
export default function MobileNavigation({ user }: { user: CurrentUser | null }) {
  const pathname = usePathname();
  const { items, ready } = useWishlist();
  const tabs = tabsFor(user);

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="flex">
        {tabs.map((tab, index) => {
          const isActive =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          const count = ready ? items.length : 0;

          return (
            <li key={`${tab.href}-${index}`} className="flex-1">
              <Link
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-medium transition-colors",
                  isActive ? "text-brand-600" : "text-muted",
                )}
              >
                <span className="relative">
                  <Icon
                    aria-hidden="true"
                    className={cn("size-5", isActive && tab.badge && "fill-brand-600")}
                  />
                  {tab.badge && count > 0 && (
                    <span className="absolute -top-1 -right-2 min-w-4 rounded-full bg-brand-600 px-1 text-[9px] leading-4 font-semibold text-white">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </span>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
