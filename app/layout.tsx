import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import { BRAND } from "@/data/footer";
import { SearchStateProvider } from "@/lib/searchState";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://wanderly.example";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.name} · ${BRAND.tagline}`,
    template: `%s · ${BRAND.name}`,
  },
  description:
    "Book homes, experiences and services in Dubai, Abu Dhabi, Tbilisi, Istanbul and beyond. Compare stays, save favourites and plan the whole trip in one place.",
  applicationName: BRAND.name,
  keywords: [
    "travel marketplace",
    "holiday rentals",
    "experiences",
    "local services",
    "Dubai",
    "Abu Dhabi",
  ],
  openGraph: {
    type: "website",
    siteName: BRAND.name,
    title: `${BRAND.name} · ${BRAND.tagline}`,
    description:
      "Homes, experiences and services worth the trip. Search destinations, pick dates and book in a few taps.",
    url: SITE_URL,
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} · ${BRAND.tagline}`,
    description: "Homes, experiences and services worth the trip.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-ink">
        <a
          href="#main-content"
          className="sr-only rounded-lg bg-ink px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[200]"
        >
          Skip to content
        </a>
        <SearchStateProvider>
          <SiteChrome>
            <div id="main-content">{children}</div>
          </SiteChrome>
        </SearchStateProvider>
      </body>
    </html>
  );
}
