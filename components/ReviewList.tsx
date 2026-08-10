import { Star } from "lucide-react";
import Image from "next/image";
import type { Review } from "@/types/listing";
import { formatRating } from "@/lib/formatters";

interface ReviewListProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export default function ReviewList({ reviews, rating, reviewCount }: ReviewListProps) {
  return (
    <section aria-labelledby="reviews-heading" className="border-t border-line py-8">
      <h2
        id="reviews-heading"
        className="mb-6 flex flex-wrap items-center gap-2 text-xl font-semibold text-ink"
      >
        <Star aria-hidden="true" className="size-5 fill-current" />
        <span>{formatRating(rating)}</span>
        <span aria-hidden="true" className="text-muted">
          ·
        </span>
        <span>{reviewCount} reviews</span>
      </h2>

      <ul className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
        {reviews.map((review) => (
          <li key={review.id}>
            <div className="flex items-center gap-3">
              <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-surface">
                <Image src={review.avatar} alt="" fill sizes="40px" className="object-cover" />
              </div>
              <div>
                <p className="text-[15px] font-medium text-ink">{review.author}</p>
                <p className="text-sm text-muted">{review.date}</p>
              </div>
            </div>

            <p
              className="mt-2 flex items-center gap-0.5"
              aria-label={`Rated ${review.rating} out of 5`}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  aria-hidden="true"
                  className={
                    i < review.rating ? "size-3 fill-ink text-ink" : "size-3 text-line-strong"
                  }
                />
              ))}
            </p>

            <p className="mt-2 text-[15px] leading-relaxed text-muted">{review.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
