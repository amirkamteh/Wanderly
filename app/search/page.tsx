import type { Metadata } from "next";
import { Suspense } from "react";
import LoadingCard from "@/components/LoadingCard";
import ListingGrid from "@/components/ListingGrid";
import SearchResults from "@/components/SearchResults";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Filter homes, experiences and services by destination, dates, guests, price, rooms, amenities and rating.",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    // `SearchResults` reads the query string, so it needs a Suspense boundary.
    <Suspense fallback={<SearchSkeleton />}>
      <SearchResults />
    </Suspense>
  );
}

function SearchSkeleton() {
  return (
    <div className="mx-auto max-w-[1760px] page-gutter py-6">
      <div className="h-7 w-56 animate-pulse rounded bg-surface" />
      <div className="mt-6 mb-8 h-10 w-full animate-pulse rounded-full bg-surface" />
      <ListingGrid>
        {Array.from({ length: 8 }, (_, i) => (
          <LoadingCard key={i} />
        ))}
      </ListingGrid>
    </div>
  );
}
