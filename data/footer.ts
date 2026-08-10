export const BRAND = {
  name: "Wanderly",
  legalName: "Wanderly, Inc.",
  tagline: "Homes, experiences and services worth the trip.",
  year: 2026,
} as const;

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

/**
 * Footer information architecture. Every entry resolves to a real route or to
 * `/help`, so nothing in the footer is a dead link.
 */
export const footerColumns: FooterColumn[] = [
  {
    title: "Support",
    links: [
      { label: "Help Centre", href: "/help" },
      { label: "Get help with a safety issue", href: "/help#safety" },
      { label: "Wanderly Cover", href: "/help#cover" },
      { label: "Anti-discrimination", href: "/help#anti-discrimination" },
      { label: "Disability support", href: "/help#accessibility" },
      { label: "Cancellation options", href: "/help#cancellations" },
      { label: "Report a neighbourhood concern", href: "/help#neighbourhood" },
    ],
  },
  {
    title: "Hosting",
    links: [
      { label: "List your home", href: "/host" },
      { label: "List your experience", href: "/host#experiences" },
      { label: "List your service", href: "/host#services" },
      { label: "Wanderly Cover for Hosts", href: "/host#cover" },
      { label: "Hosting resources", href: "/host#resources" },
      { label: "Community forum", href: "/host#community" },
      { label: "Hosting responsibly", href: "/host#responsibly" },
      { label: "Join a free hosting class", href: "/host#classes" },
      { label: "Find a co-host", href: "/host#co-hosts" },
      { label: "Refer a host", href: "/host#refer" },
    ],
  },
  {
    title: "Wanderly",
    links: [
      { label: "2026 Summer Release", href: "/help#release" },
      { label: "Newsroom", href: "/help#newsroom" },
      { label: "Careers", href: "/help#careers" },
      { label: "Investors", href: "/help#investors" },
      { label: "Emergency stays", href: "/help#emergency" },
    ],
  },
];

export const legalLinks: FooterLink[] = [
  { label: "Privacy", href: "/help#privacy" },
  { label: "Terms", href: "/help#terms" },
  { label: "Sitemap", href: "/help#sitemap" },
];

export const LOCALE = { language: "English (AE)", currency: "AED" } as const;
