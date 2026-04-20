"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../components/auth/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { user, hydrated, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (hydrated && user) router.replace("/dashboard");
  }, [hydrated, user, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!agree) {
      setError("Please accept the terms to continue.");
      return;
    }
    setSubmitting(true);
    const result = await register({
      name,
      email,
      phone,
      password,
      confirmPassword,
    });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <main className="flex flex-1 flex-col bg-white font-sans">
      <section className="bg-[#BB4D00] px-6 pb-10 pt-28 sm:px-10 sm:pb-12 sm:pt-32">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-white">
          <span className="inline-block w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wider backdrop-blur-sm">
            Create Account
          </span>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Join the Nilam&apos;s family.
          </h1>
          <p className="max-w-xl text-sm leading-6 text-white/85 sm:text-base">
            Create a free account to earn loyalty points, save your favourite combos, and skip the form at checkout.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-md px-6 py-12 sm:py-16">
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            Create your account
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            It takes less than a minute — no credit card required.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-800 ring-1 ring-red-100"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-zinc-700">Full Name</span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Pratik More"
                autoComplete="name"
                className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#BB4D00] focus:outline-none focus:ring-2 focus:ring-[#BB4D00]/20"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-zinc-700">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#BB4D00] focus:outline-none focus:ring-2 focus:ring-[#BB4D00]/20"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-zinc-700">Phone</span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                autoComplete="tel"
                className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#BB4D00] focus:outline-none focus:ring-2 focus:ring-[#BB4D00]/20"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-zinc-700">Password</span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#BB4D00] focus:outline-none focus:ring-2 focus:ring-[#BB4D00]/20"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-zinc-700">Confirm</span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Retype password"
                  autoComplete="new-password"
                  className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#BB4D00] focus:outline-none focus:ring-2 focus:ring-[#BB4D00]/20"
                />
              </label>
            </div>

            <label className="mt-1 flex items-start gap-2 text-xs text-zinc-600">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-black/20 text-[#BB4D00] focus:ring-[#BB4D00]"
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="font-medium text-[#BB4D00] underline-offset-4 hover:underline">
                  terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-medium text-[#BB4D00] underline-offset-4 hover:underline">
                  privacy policy
                </Link>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-[#BB4D00] text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#9e4000] disabled:opacity-60"
            >
              {submitting ? "Creating account…" : "Create Account"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#BB4D00] underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
