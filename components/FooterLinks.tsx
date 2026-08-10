import Link from "next/link";
import type { FooterColumn } from "@/data/footer";

/** One footer column: a heading and its list of links. */
export default function FooterLinks({ column }: { column: FooterColumn }) {
  return (
    <div>
      <h3 className="mb-4 text-[15px] font-medium text-ink">{column.title}</h3>
      <ul className="space-y-3">
        {column.links.map((link) => (
          <li key={`${link.label}-${link.href}`}>
            <Link
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-ink hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
