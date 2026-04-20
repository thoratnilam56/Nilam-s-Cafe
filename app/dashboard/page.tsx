"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../components/auth/AuthProvider";
import { apiFetch } from "../lib/api";

type OrderItem = {
  id: string;
  name: string;
  price: string;
  image?: string;
  quantity: number;
};

type OrderAddon = {
  id: string;
  name: string;
  price: number;
};

type Order = {
  _id: string;
  orderId: string;
  seatNumber: string;
  items: OrderItem[];
  addons: OrderAddon[];
  subtotal: number;
  addonsTotal: number;
  discount: number;
  total: number;
  couponCode: string | null;
  status: "placed" | "preparing" | "served" | "cancelled";
  createdAt: string;
};

const statusStyles: Record<Order["status"], string> = {
  placed: "bg-amber-50 text-amber-800 ring-amber-100",
  preparing: "bg-sky-50 text-sky-700 ring-sky-100",
  served: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  cancelled: "bg-zinc-100 text-zinc-600 ring-zinc-200",
};

const statusLabels: Record<Order["status"], string> = {
  placed: "Placed",
  preparing: "Preparing",
  served: "Served",
  cancelled: "Cancelled",
};

const quickLinks = [
  { label: "Edit Profile", href: "#profile", description: "Update your name, email, and phone." },
  { label: "Saved Addresses", href: "#addresses", description: "Manage delivery locations." },
  { label: "Payment Methods", href: "#payments", description: "Cards and wallets on file." },
  { label: "Notification Preferences", href: "#notifications", description: "Offers, receipts, updates." },
  { label: "Support & Help", href: "#support", description: "Chat with our team anytime." },
  { label: "Sign Out", href: "#signout", description: "End your current session." },
];

function formatINR(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function summariseItems(items: OrderItem[]): string {
  return items
    .map((i) => `${i.name} × ${i.quantity}`)
    .join(", ")
    .slice(0, 120);
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, hydrated, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, user, router]);

  useEffect(() => {
    if (!hydrated || !user || !token) return;
    let cancelled = false;
    setLoading(true);
    apiFetch<{ orders: Order[] }>("/api/orders", { token })
      .then((data) => {
        if (!cancelled) setOrders(data.orders ?? []);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Could not load orders");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [hydrated, user, token]);

  const firstName = user?.name?.split(" ")[0] ?? "there";

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const ordersThisMonth = orders.filter(
    (o) => new Date(o.createdAt) >= startOfMonth,
  ).length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.total ?? 0), 0);
  const totalSaved = orders.reduce((sum, o) => sum + (o.discount ?? 0), 0);
  const loyaltyPoints = Math.floor(totalSpent / 10);

  const stats = [
    {
      label: "Loyalty Points",
      value: loading ? "…" : loyaltyPoints.toLocaleString("en-IN"),
      hint:
        loading || loyaltyPoints === 0
          ? "Earn 1 point for every ₹10 spent."
          : `Lifetime spend ${formatINR(totalSpent)}`,
    },
    {
      label: "Orders this month",
      value: loading ? "…" : String(ordersThisMonth),
      hint:
        loading
          ? ""
          : orders.length === 0
            ? "No orders yet — let's start with a combo."
            : `${orders.length} total order${orders.length === 1 ? "" : "s"}`,
    },
    {
      label: "Saved so far",
      value: loading ? "…" : formatINR(totalSaved),
      hint: loading ? "" : "Across coupons and combo offers.",
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <main className="flex flex-1 flex-col bg-white font-sans">
      <section className="w-full bg-[#BB4D00] px-6 pb-12 pt-28 sm:px-10 sm:pb-16 sm:pt-32">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-white">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <span className="inline-block w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white backdrop-blur-sm">
              Dashboard
            </span>
            {user && (
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="inline-flex h-9 items-center rounded-full border border-white/40 bg-white/10 px-4 text-xs font-medium text-white transition-colors hover:bg-white/20"
              >
                Sign Out
              </button>
            )}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome back, {firstName}.
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
            Here&apos;s a quick look at your recent orders, rewards, and account preferences{user ? ` — signed in as ${user.email}` : ""}.
          </p>
        </div>
      </section>

      <section className="w-full bg-[#FFF6EF] px-6 py-12 sm:px-10 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                {s.label}
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                {s.value}
              </p>
              {s.hint && <p className="mt-1 text-xs text-zinc-500">{s.hint}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="w-full bg-white px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="inline-block rounded-full bg-[#BB4D00]/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-[#BB4D00]">
                Recent Orders
              </span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                Your last few visits
              </h2>
            </div>
            <Link
              href="/menu"
              className="text-sm font-medium text-[#BB4D00] underline-offset-4 hover:underline"
            >
              Order again
            </Link>
          </div>

          {error ? (
            <p
              role="alert"
              className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-800 ring-1 ring-red-100"
            >
              {error}
            </p>
          ) : loading ? (
            <p className="mt-6 text-sm text-zinc-500">Loading your orders…</p>
          ) : recentOrders.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-black/10 bg-[#FFF6EF] p-6 text-center">
              <p className="text-sm text-zinc-700">No orders yet.</p>
              <Link
                href="/menu"
                className="mt-3 inline-flex h-10 items-center justify-center rounded-full bg-[#BB4D00] px-5 text-xs font-semibold text-white hover:bg-[#9e4000]"
              >
                Browse the menu
              </Link>
            </div>
          ) : (
            <ul className="mt-6 flex flex-col divide-y divide-black/5 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
              {recentOrders.map((order) => (
                <li
                  key={order._id}
                  className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900">
                      {order.orderId}{" "}
                      <span className="text-xs font-normal text-zinc-500">
                        · {formatDate(order.createdAt)} · Seat {order.seatNumber}
                      </span>
                    </p>
                    <p className="truncate text-sm text-zinc-600">
                      {summariseItems(order.items)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${
                        statusStyles[order.status]
                      }`}
                    >
                      {statusLabels[order.status]}
                    </span>
                    <span className="text-sm font-semibold text-zinc-900">
                      {formatINR(order.total)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="w-full bg-[#FFF6EF] px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <span className="inline-block rounded-full bg-[#BB4D00]/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-[#BB4D00]">
            Account
          </span>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Manage your account
          </h2>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group flex h-full flex-col justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div>
                    <h3 className="text-base font-semibold tracking-tight text-zinc-900">
                      {link.label}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600">{link.description}</p>
                  </div>
                  <span
                    aria-hidden
                    className="mt-4 inline-flex items-center text-xs font-semibold text-[#BB4D00] transition-transform group-hover:translate-x-1"
                  >
                    Open →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
