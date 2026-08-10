import { MapPin } from "lucide-react";

interface LocationSectionProps {
  area: string;
  city: string;
  country: string;
  coordinates: { lat: number; lng: number };
  blurb?: string;
}

/**
 * Location block. The map is a lightweight static illustration rather than a
 * third-party embed, which keeps the build dependency-free and offline-safe.
 */
export default function LocationSection({
  area,
  city,
  country,
  coordinates,
  blurb,
}: LocationSectionProps) {
  return (
    <section aria-labelledby="location-heading" className="border-t border-line py-8">
      <h2 id="location-heading" className="mb-1.5 text-xl font-semibold text-ink">
        Where you&rsquo;ll be
      </h2>
      <p className="mb-5 text-[15px] text-muted">
        {area}, {city}, {country}
      </p>

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-line bg-brand-50 sm:aspect-[21/9]">
        {/* Decorative street grid so the block reads as a map at a glance. */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 size-full text-brand-200"
          preserveAspectRatio="none"
          viewBox="0 0 100 50"
        >
          <defs>
            <pattern id="streets" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M10 0 L0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100" height="50" fill="url(#streets)" />
          <path d="M0 32 Q30 26 55 34 T100 28" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M62 0 L58 50" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink shadow-pop">
            <MapPin aria-hidden="true" className="size-4 text-brand-600" />
            {area}
          </span>
        </div>

        <p className="absolute right-3 bottom-3 rounded-md bg-white/90 px-2 py-1 text-[11px] text-muted">
          {coordinates.lat.toFixed(3)}, {coordinates.lng.toFixed(3)}
        </p>
      </div>

      <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-muted">
        {blurb ??
          `The exact address is shared after booking. ${area} is well connected to the rest of ${city}, with cafés, shops and transport within a short walk.`}
      </p>
    </section>
  );
}
