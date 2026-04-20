import Link from "next/link";
import ProfileLink from "./auth/ProfileLink";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 w-full bg-transparent">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-6 sm:px-8">
        <Link
          href="/"
          aria-label="Nilam's Cafe home"
          className="flex items-center gap-2.5 text-white drop-shadow-sm"
        >
          <svg
            viewBox="0 0 40 40"
            aria-hidden
            className="h-9 w-9 sm:h-10 sm:w-10"
          >
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
              fill="#b45309"
            />
            <rect x="7" y="11" width="22" height="2.6" rx="1.2" fill="#d97706" />
            <path
              d="M28 15.5h1.8a4.2 4.2 0 0 1 0 8.4H28"
              stroke="#b45309"
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
          <span className="text-xl font-bold tracking-tight sm:text-2xl">NC</span>
        </Link>

        <nav aria-label="Primary" className="ml-auto">
          <ul className="flex items-center gap-1 text-base font-medium text-white drop-shadow-sm sm:gap-2 sm:text-lg">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="px-3 py-2 underline-offset-8 hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <ProfileLink />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
