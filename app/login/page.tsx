"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../components/auth/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { user, hydrated, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (hydrated && user) router.replace("/dashboard");
  }, [hydrated, user, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await login(email, password);
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
            Sign In
          </span>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome back to Nilam&apos;s.
          </h1>
          <p className="max-w-xl text-sm leading-6 text-white/85 sm:text-base">
            Sign in to save orders, track loyalty points, and breeze through checkout.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-md px-6 py-12 sm:py-16">
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            Sign in to your account
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            Enter the email and password you registered with.
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
              <span className="flex items-baseline justify-between">
                <span className="font-medium text-zinc-700">Password</span>
                <a
                  href="#forgot"
                  className="text-xs font-medium text-[#BB4D00] underline-offset-4 hover:underline"
                >
                  Forgot password?
                </a>
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#BB4D00] focus:outline-none focus:ring-2 focus:ring-[#BB4D00]/20"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-[#BB4D00] text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#9e4000] disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#BB4D00] underline-offset-4 hover:underline"
          >
            Create one
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
