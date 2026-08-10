"use client";

import Image from "next/image";
import Link from "next/link";
import { serviceCategories } from "@/data/services";
import { cn } from "@/lib/utils";

interface CategoryNavigationProps {
  /** City shown in the heading, e.g. "Services in Dubai". */
  city: string;
  /** Highlights the current category when browsing one. */
  activeSlug?: string;
}

/** Category tiles at the top of the Services page. */
export default function CategoryNavigation({ city, activeSlug }: CategoryNavigationProps) {
  return (
    <section className="mx-auto max-w-[1760px] page-gutter" aria-labelledby="service-categories">
      <h2
        id="service-categories"
        className="text-[19px] font-semibold tracking-[-0.01em] text-ink sm:text-[22px]"
      >
        Services in {city}
      </h2>

      <ul className="scrollbar-hide -mx-6 mt-4 flex gap-3 overflow-x-auto px-6 sm:mx-0 sm:px-0">
        {serviceCategories.map((category) => {
          const isActive = category.slug === activeSlug;
          return (
            <li key={category.slug} className="w-[40vw] shrink-0 sm:w-[22vw] lg:w-[calc((100%-5*0.75rem)/6)]">
              <Link
                href={`/services?category=${category.slug}`}
                aria-current={isActive ? "page" : undefined}
                className="group block"
              >
                <span
                  className={cn(
                    "relative block aspect-[6/5] w-full overflow-hidden rounded-xl bg-surface transition",
                    isActive && "ring-2 ring-ink",
                  )}
                >
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 40vw, (max-width: 1024px) 22vw, 17vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </span>
                <span
                  className={cn(
                    "mt-2 block text-[15px] text-ink",
                    isActive ? "font-semibold" : "font-medium",
                  )}
                >
                  {category.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
