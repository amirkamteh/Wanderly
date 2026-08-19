import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import Rating from "@/components/Rating";
import { formatLongDate, formatPrice } from "@/lib/formatters";
import type { PriceBreakdown } from "@/lib/pricing";
import type { Home } from "@/types/listing";
import { pluralize } from "@/lib/utils";

interface PropertySummaryProps {
  home: Home;
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  price: PriceBreakdown;
  /** Renders the full price breakdown; the collapsed form hides the rows. */
  showBreakdown?: boolean;
}

/** The stay being booked, shown beside the steps and on the review screen. */
export default function PropertySummary({
  home,
  checkIn,
  checkOut,
  guests,
  price,
  showBreakdown = true,
}: PropertySummaryProps) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-pill sm:p-6">
      <div className="flex gap-4">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-surface">
          <Image
            src={home.images[0]}
            alt=""
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[15px] leading-snug font-semibold text-ink">{home.name}</p>
          <p className="mt-0.5 text-sm text-muted">
            {home.propertyType} · {home.area}, {home.city}
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink">
            <Rating value={home.rating} />
            <span className="text-muted">({home.reviewCount} reviews)</span>
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-line pt-5">
        <p className="flex items-start gap-2.5 text-sm">
          <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-600" />
          <span>
            <span className="block font-medium text-ink">Free cancellation</span>
            <span className="block text-muted">
              Cancel within 24 hours of the host approving for a full refund.
            </span>
          </span>
        </p>
      </div>

      <dl className="mt-5 space-y-3 border-t border-line pt-5 text-sm">
        <div className="flex items-start justify-between gap-4">
          <dt className="text-muted">Dates</dt>
          <dd className="text-right font-medium text-ink">
            {checkIn && checkOut ? (
              <>
                {formatLongDate(checkIn)}
                <span className="text-muted"> → </span>
                {formatLongDate(checkOut)}
              </>
            ) : (
              "Not selected"
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted">Guests</dt>
          <dd className="font-medium text-ink">{pluralize(guests, "guest")}</dd>
        </div>
      </dl>

      {showBreakdown && price.nights > 0 && (
        <>
          <p className="mt-5 border-t border-line pt-5 text-[15px] font-semibold text-ink">
            Price details
          </p>
          <dl className="mt-3 space-y-2.5 text-sm">
            <Row
              label={`${formatPrice(price.pricePerNight)} × ${pluralize(price.nights, "night")}`}
              value={formatPrice(price.accommodationTotal)}
            />
            <Row label="Cleaning fee" value={formatPrice(price.cleaningFee)} />
            <Row label="Service fee" value={formatPrice(price.serviceFee)} />
            <Row label="Taxes" value={formatPrice(price.tax)} />
          </dl>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-[15px] font-semibold text-ink">
            <span>Total {price.currency}</span>
            <span>{formatPrice(price.total)}</span>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
