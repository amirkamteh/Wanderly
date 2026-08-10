"use client";

import { Compass, ConciergeBell, House, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Additional routes that should keep this item active. */
  matches?: string[];
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "All", icon: Compass },
  { href: "/homes", label: "Homes", icon: House },
  { href: "/experiences", label: "Experiences", icon: Sparkles },
  { href: "/services", label: "Services", icon: ConciergeBell },
];

/** Resolves which top-level section a path belongs to. */
export function activeSection(pathname: string): string {
  if (pathname.startsWith("/homes")) return "/homes";
  if (pathname.startsWith("/experiences")) return "/experiences";
  if (pathname.startsWith("/services")) return "/services";
  return "/";
}

/** Centred primary navigation with the active underline from the reference. */
export default function Navigation({ className }: { className?: string }) {
  const pathname = usePathname();
  const active = activeSection(pathname);

  return (
    <nav aria-label="Primary" className={className}>
      <ul className="flex items-center gap-1 lg:gap-2">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.href;
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative flex items-center gap-2 rounded-lg px-3 py-2 text-[15px] transition-colors",
                  isActive ? "font-medium text-ink" : "text-muted hover:text-ink",
                )}
              >
                <Icon
                  aria-hidden="true"
                  className={cn(
                    "size-5 shrink-0 transition-transform group-hover:scale-110",
                    isActive ? "text-brand-600" : "text-subtle group-hover:text-brand-600",
                  )}
                />
                <span>{item.label}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-2 -bottom-[13px] h-[2px] rounded-full bg-ink transition-opacity",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
