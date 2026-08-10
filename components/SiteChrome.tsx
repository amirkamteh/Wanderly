"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";
import MobileNavigation from "./MobileNavigation";

/** Auth pages render their own minimal chrome. */
const STANDALONE_ROUTES = ["/login", "/signup"];

/**
 * Decides which shell a route gets. Keeping this in one client component
 * means the rest of the tree can stay on the server.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const standalone = STANDALONE_ROUTES.some((route) => pathname.startsWith(route));

  if (standalone) {
    return <main className="min-h-dvh">{children}</main>;
  }

  return (
    <>
      <Header />
      {/* Bottom padding clears the fixed mobile tab bar. */}
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileNavigation />
    </>
  );
}
