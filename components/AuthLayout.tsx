import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CITY_PHOTOS, img } from "@/data/images";
import { BRAND } from "@/data/footer";
import Logo from "./Logo";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

/** Split layout for the auth pages: form on the left, imagery on the right. */
export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-ink transition hover:bg-surface"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to explore
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-10">
          <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.01em] text-ink">
            {title}
          </h1>
          <p className="mt-2 mb-8 text-[15px] text-muted">{subtitle}</p>
          {children}
        </div>

        <p className="text-xs text-muted">
          © {BRAND.year} {BRAND.legalName}
        </p>
      </div>

      <div className="relative hidden lg:block">
        <Image
          src={img(CITY_PHOTOS.desertSunset, 1400, 1800)}
          alt=""
          fill
          sizes="50vw"
          priority
          className="object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-black/25" />
        <blockquote className="absolute right-10 bottom-12 left-10 text-white">
          <p className="text-2xl leading-snug font-semibold">{BRAND.tagline}</p>
          <footer className="mt-2 text-sm text-white/80">
            Over 200 stays, experiences and services across 12 cities.
          </footer>
        </blockquote>
      </div>
    </div>
  );
}
