"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LanguageSelector from "./LanguageSelector";
import Logo from "./Logo";
import Navigation, { activeSection } from "./Navigation";
import SearchBar, { type SearchVariant } from "./SearchBar";
import SearchModal from "./SearchModal";
import UserMenu from "./UserMenu";

/** Maps the current route to the search bar's field labels. */
function variantFor(pathname: string): SearchVariant {
  const section = activeSection(pathname);
  if (section === "/experiences") return "experiences";
  if (section === "/services") return "services";
  return "homes";
}

/**
 * Only the browse pages carry the search bar. Detail pages, results and the
 * account pages keep a compact header so the sticky bar stays out of the way.
 */
const SEARCH_ROUTES = ["/", "/homes", "/experiences", "/services"];

export default function Header() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const variant = variantFor(pathname);
  const showSearch = SEARCH_ROUTES.includes(pathname);

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="border-b border-line">
        <div className="mx-auto flex h-[72px] max-w-[1760px] items-center justify-between gap-4 page-gutter md:h-20">
          <Logo />

          <Navigation className="hidden md:block" />

          <div className="flex items-center gap-1 md:gap-2">
            <Link
              href="/host"
              className="hidden rounded-full px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-surface lg:block"
            >
              Become a host
            </Link>
            <div className="hidden md:block">
              <LanguageSelector />
            </div>
            <UserMenu />
          </div>
        </div>
      </div>

      {showSearch && (
        <div className="border-b border-line bg-white pt-3 pb-4 md:bg-surface/40 md:pt-5 md:pb-7">
          <div className="mx-auto max-w-[1760px] page-gutter">
            <SearchBar variant={variant} onMobileOpen={() => setSearchOpen(true)} />
          </div>
        </div>
      )}

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        variant={variant}
      />
    </header>
  );
}
