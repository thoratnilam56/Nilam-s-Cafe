import Link from "next/link";

const navColumns = [
  {
    heading: "Menu",
    links: [
      { label: "Pastries", href: "/menu#pastries" },
      { label: "Beverages", href: "/menu#beverages" },
      { label: "Pizzas", href: "/menu#pizzas" },
      { label: "Combos", href: "/menu#combos" },
    ],
  },
  {
    heading: "Visit",
    links: [
      { label: "Locations", href: "/locations" },
      { label: "Hours", href: "/hours" },
      { label: "Reservations", href: "/reserve" },
      { label: "Private Events", href: "/events" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Accessibility", href: "/accessibility" },
      { label: "Refund Policy", href: "/refunds" },
      { label: "Sitemap", href: "/sitemap" },
    ],
  },
];

const socials = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    path: "M12 2.4c2.6 0 2.9 0 3.9.05 1 .05 1.5.2 1.9.35.5.2.8.4 1.2.8.4.4.6.7.8 1.2.15.4.3.9.35 1.9.05 1 .05 1.3.05 3.9s0 2.9-.05 3.9c-.05 1-.2 1.5-.35 1.9-.2.5-.4.8-.8 1.2-.4.4-.7.6-1.2.8-.4.15-.9.3-1.9.35-1 .05-1.3.05-3.9.05s-2.9 0-3.9-.05c-1-.05-1.5-.2-1.9-.35-.5-.2-.8-.4-1.2-.8-.4-.4-.6-.7-.8-1.2-.15-.4-.3-.9-.35-1.9-.05-1-.05-1.3-.05-3.9s0-2.9.05-3.9c.05-1 .2-1.5.35-1.9.2-.5.4-.8.8-1.2.4-.4.7-.6 1.2-.8.4-.15.9-.3 1.9-.35 1-.05 1.3-.05 3.9-.05zM12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zm6.1-8.1a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0z",
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    path: "M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H17V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.6V13h2.7v8h3.2z",
  },
  {
    label: "X",
    href: "https://x.com",
    path: "M17.6 3h3.3l-7.2 8.2L22 21h-6.7l-5.3-6.9L3.9 21H.6l7.7-8.8L.5 3h6.9l4.8 6.3L17.6 3zm-1.1 16h1.8L7.5 4.9H5.5L16.5 19z",
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#2D1608] text-white/85">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-10 sm:px-10 sm:pt-28 sm:pb-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              aria-label="Nilam's Cafe home"
              className="flex items-center gap-2.5 text-white"
            >
              <svg viewBox="0 0 40 40" aria-hidden className="h-9 w-9">
                <path
                  d="M13 4c-1 1.6 1 3.2 0 4.8M20 3c-1 1.6 1 3.2 0 4.8M27 4c-1 1.6 1 3.2 0 4.8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.85"
                />
                <ellipse cx="20" cy="35" rx="14" ry="1.8" fill="currentColor" opacity="0.75" />
                <path
                  d="M8 13h20v9.5a8.5 8.5 0 0 1-8.5 8.5h-3A8.5 8.5 0 0 1 8 22.5V13z"
                  fill="#BB4D00"
                />
                <rect x="7" y="11" width="22" height="2.6" rx="1.2" fill="#d97706" />
                <path
                  d="M28 15.5h1.8a4.2 4.2 0 0 1 0 8.4H28"
                  stroke="#BB4D00"
                  strokeWidth="2.4"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M15 19.5c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0"
                  stroke="#fbbf24"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.9"
                />
              </svg>
              <span className="text-xl font-bold tracking-tight">Nilam&apos;s Cafe</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
              Freshly brewed coffee, warm pastries, wood-fired pizzas, and a cozy corner to slow down in.
            </p>

            <ul className="mt-6 flex items-center gap-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-[#BB4D00] hover:bg-[#BB4D00] hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                      <path d={s.path} fill="currentColor" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {navColumns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
                {col.heading}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5 text-sm text-white/75">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-white/10 pt-8">
          <p className="text-[11px] leading-5 text-white/50">
            Menu items, pricing, and availability may change without notice. Photography is for illustration only. Our kitchen handles dairy, gluten, nuts, eggs, and soy — please let our staff know about any allergies or dietary needs before ordering. Combo offers valid at participating locations while stocks last.
          </p>

          <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-white/60 sm:flex-row">
            <p>© {new Date().getFullYear()} Nilam&apos;s Cafe. All rights reserved.</p>
            <a href="mailto:hello@nilamscafe.com" className="hover:text-white">
              hello@nilamscafe.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
