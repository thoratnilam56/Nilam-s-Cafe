"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function ProfileLink() {
  const { user, hydrated } = useAuth();

  if (hydrated && user) {
    const initial = user.name.trim().charAt(0).toUpperCase() || "U";
    return (
      <Link
        href="/dashboard"
        aria-label={`${user.name}'s dashboard`}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-[#BB4D00] shadow-sm transition-transform hover:scale-105 sm:h-10 sm:w-10 sm:text-base"
      >
        {initial}
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      aria-label="Sign in to your account"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/10 text-white transition-colors hover:border-white hover:bg-white/20 sm:h-10 sm:w-10"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden
      >
        <circle cx="12" cy="8.5" r="3.5" />
        <path d="M4.5 20a7.5 7.5 0 0 1 15 0" strokeLinecap="round" />
      </svg>
    </Link>
  );
}
