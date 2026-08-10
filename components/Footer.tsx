import { AtSign, MessageCircle, Send } from "lucide-react";
import Link from "next/link";
import { BRAND, footerColumns, legalLinks } from "@/data/footer";
import LanguageSelector from "./LanguageSelector";
import FooterLinks from "./FooterLinks";

const SOCIALS = [
  { icon: AtSign, label: `${BRAND.name} social profile` },
  { icon: Send, label: `${BRAND.name} community channel` },
  { icon: MessageCircle, label: `${BRAND.name} community forum` },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface/60">
      <div className="mx-auto max-w-[1760px] page-gutter">
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
          {footerColumns.map((column) => (
            <FooterLinks key={column.title} column={column} />
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-6 md:flex-row md:items-center md:justify-between">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
            <span>
              © {BRAND.year} {BRAND.legalName}
            </span>
            {legalLinks.map((link) => (
              <span key={link.href} className="flex items-center gap-2">
                <span aria-hidden="true">·</span>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-ink hover:underline"
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </p>

          <div className="flex items-center gap-1">
            <LanguageSelector compact />
            <div className="flex items-center gap-1">
              {SOCIALS.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full text-ink transition hover:bg-line"
                >
                  <Icon aria-hidden="true" className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
