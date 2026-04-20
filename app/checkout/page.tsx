"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../components/auth/AuthProvider";
import type { CartItem } from "../components/cart/CartProvider";
import { useCart } from "../components/cart/CartProvider";
import { apiFetch } from "../lib/api";

type Reveal = { label: string; value: string };

type Addon = {
  id: string;
  name: string;
  description: string;
  price: number;
  reveal?: Reveal[];
};

type Receipt = {
  orderId: string;
  timestamp: string;
  seatNumber: string;
  phone: string;
  email: string;
  billing: { name: string; address: string } | null;
  items: CartItem[];
  addons: Addon[];
  subtotal: number;
  addonsTotal: number;
  discount: number;
  total: number;
  couponCode: string | null;
};

const AMENITIES: Addon[] = [
  {
    id: "wifi",
    name: "Wi-Fi Access",
    description: "2 hours of high-speed guest internet for your table.",
    price: 49,
    reveal: [
      { label: "Network", value: "NilamsCafe-Guest" },
      { label: "Password", value: "Latte@2026" },
      { label: "Valid for", value: "2 hours from order time" },
    ],
  },
  {
    id: "charger",
    name: "Phone Charging Kit",
    description: "USB-C and Lightning cables delivered to your seat.",
    price: 29,
    reveal: [
      { label: "Pickup", value: "Our staff will bring the charger to your seat within 5 minutes." },
    ],
  },
  {
    id: "boardgame",
    name: "Board Game Rental",
    description: "Pick any game from our library — play as long as you sit.",
    price: 99,
    reveal: [
      { label: "Pickup", value: "Head to the board-game shelf near the entrance and show this receipt." },
    ],
  },
  {
    id: "quiet-zone",
    name: "Quiet Zone Seat",
    description: "Upgrade to our laptop-friendly quiet zone for the afternoon.",
    price: 79,
    reveal: [
      { label: "Seat", value: "A steward will escort you to the quiet mezzanine." },
    ],
  },
];

const EXTRAS: Addon[] = [
  {
    id: "extra-sauce",
    name: "Extra Sauce",
    description: "Ketchup, mayo, chilli, or BBQ — add one to your plate.",
    price: 29,
  },
  {
    id: "whipped-cream",
    name: "Whipped Cream Top",
    description: "A light, sweet swirl to finish your drink.",
    price: 29,
  },
  {
    id: "ice-cream",
    name: "Ice Cream Scoop",
    description: "Vanilla, chocolate, or strawberry — your pick.",
    price: 59,
  },
  {
    id: "fresh-fruit",
    name: "Fresh Fruit Bowl",
    description: "Seasonal cut fruit, chilled and ready to share.",
    price: 99,
  },
];

const ALL_ADDONS: Addon[] = [...AMENITIES, ...EXTRAS];

const COUPON_THRESHOLD = 999;
const COUPON = { code: "CAFE100", amount: 100, label: "₹100 off" };

function parsePrice(price: string): number {
  const n = parseFloat(price.replace(/[^0-9.]/g, ""));
  return Number.isNaN(n) ? 0 : n;
}

function formatINR(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

type OrderResponse = {
  orderId: string;
  seatNumber: string;
  contact: { phone: string; email: string };
  billing?: { name?: string; address?: string };
  items: CartItem[];
  addons: Addon[];
  subtotal: number;
  addonsTotal: number;
  discount: number;
  total: number;
  couponCode: string | null;
  createdAt: string;
};

export default function CheckoutPage() {
  const { items, addItem, decrementItem, removeItem, clearCart, subtotal } = useCart();
  const { user, token } = useAuth();
  const list = Object.values(items);

  const [seatNumber, setSeatNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setPhone((p) => p || user.phone);
      setEmail((e) => e || user.email);
    }
  }, [user]);
  const [includeBilling, setIncludeBilling] = useState(false);
  const [billingName, setBillingName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedList = ALL_ADDONS.filter((a) => selectedAddons[a.id]);
  const addonsTotal = selectedList.reduce((sum, a) => sum + a.price, 0);
  const preDiscount = subtotal + addonsTotal;
  const qualifiesForCoupon = preDiscount >= COUPON_THRESHOLD;
  const discount = qualifiesForCoupon ? COUPON.amount : 0;
  const total = Math.max(0, preDiscount - discount);

  const toggleAddon = (id: string) =>
    setSelectedAddons((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (list.length === 0) return;

    const payload = {
      seatNumber,
      contact: { phone, email },
      billing: includeBilling && (billingName || billingAddress)
        ? { name: billingName, address: billingAddress }
        : undefined,
      items: list.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        image: i.image,
        quantity: i.quantity,
      })),
      addons: selectedList.map((a) => ({
        id: a.id,
        name: a.name,
        price: a.price,
        reveal: a.reveal ?? [],
      })),
      subtotal,
      addonsTotal,
      discount,
      total,
      couponCode: qualifiesForCoupon ? COUPON.code : null,
    };

    setSubmitting(true);
    setSubmitError(null);
    try {
      const { order } = await apiFetch<{ order: OrderResponse }>(
        "/api/orders",
        { method: "POST", body: payload, token },
      );

      const r: Receipt = {
        orderId: order.orderId,
        timestamp: new Date(order.createdAt).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        seatNumber: order.seatNumber,
        phone: order.contact.phone,
        email: order.contact.email,
        billing:
          order.billing && (order.billing.name || order.billing.address)
            ? {
                name: order.billing.name ?? "",
                address: order.billing.address ?? "",
              }
            : null,
        items: list,
        addons: selectedList,
        subtotal: order.subtotal,
        addonsTotal: order.addonsTotal,
        discount: order.discount,
        total: order.total,
        couponCode: order.couponCode,
      };
      setReceipt(r);
      clearCart();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Could not place order. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (receipt) return <ReceiptView receipt={receipt} onNewOrder={() => setReceipt(null)} />;

  if (list.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-32 text-center font-sans">
        <span className="inline-block rounded-full bg-[#BB4D00]/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-[#BB4D00]">
          Empty Cart
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Your cart is empty
        </h1>
        <p className="mt-3 max-w-md text-zinc-600">
          Browse the menu and add a few favourites to see your bill here.
        </p>
        <Link
          href="/menu"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#BB4D00] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#9e4000]"
        >
          Browse the menu
        </Link>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col bg-white font-sans">
      <section className="bg-[#BB4D00] px-6 pb-10 pt-28 sm:px-10 sm:pb-12 sm:pt-32">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-white">
          <span className="inline-block w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wider backdrop-blur-sm">
            Checkout
          </span>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Almost there — let&apos;s settle up.
          </h1>
          <p className="max-w-xl text-sm leading-6 text-white/85 sm:text-base">
            Review your order, pick any add-ons, and we&apos;ll bring it straight to your seat.
          </p>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10 sm:py-14"
      >
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="flex flex-col gap-10">
            <section>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
                Your Order
              </h2>
              <ul className="mt-4 flex flex-col divide-y divide-black/5 overflow-hidden rounded-2xl border border-black/5 bg-white">
                {list.map((item) => (
                  <li key={item.id} className="flex items-start gap-4 p-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="truncate text-sm font-semibold text-zinc-900">
                          {item.name}
                        </h3>
                        <span className="text-sm font-semibold text-[#BB4D00]">
                          {item.price}
                        </span>
                      </div>
                      <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-black/10 px-1 py-0.5">
                        <button
                          type="button"
                          onClick={() => decrementItem(item.id)}
                          aria-label="Decrease quantity"
                          className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-700 hover:bg-black/5"
                        >
                          −
                        </button>
                        <span className="min-w-[20px] text-center text-xs font-semibold text-zinc-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            addItem({
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              image: item.image,
                            })
                          }
                          aria-label="Increase quantity"
                          className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-700 hover:bg-black/5"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="text-zinc-400 transition-colors hover:text-red-600"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
                Seat Number
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                We&apos;ll bring your order directly to this seat — no delivery address needed.
              </p>
              <input
                type="text"
                required
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value)}
                placeholder="e.g. Table 7, A-12, Window-03"
                className="mt-3 h-11 w-full max-w-xs rounded-xl border border-black/10 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#BB4D00] focus:outline-none focus:ring-2 focus:ring-[#BB4D00]/20"
              />
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
                Cafe Amenities
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                Unlock extras during your visit — access details are revealed on your receipt.
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {AMENITIES.map((a) => (
                  <AddonCard
                    key={a.id}
                    addon={a}
                    selected={!!selectedAddons[a.id]}
                    onToggle={() => toggleAddon(a.id)}
                  />
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
                Add Extras
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                Small additions to make your order even better.
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {EXTRAS.map((a) => (
                  <AddonCard
                    key={a.id}
                    addon={a}
                    selected={!!selectedAddons[a.id]}
                    onToggle={() => toggleAddon(a.id)}
                  />
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
                Contact Details
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                {user
                  ? `Pre-filled from your account (${user.email}). Edit if needed.`
                  : "Required for guest orders — we'll email your receipt here."}
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-zinc-700">
                    Phone <span className="text-red-600">*</span>
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#BB4D00] focus:outline-none focus:ring-2 focus:ring-[#BB4D00]/20"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-zinc-700">
                    Email <span className="text-red-600">*</span>
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#BB4D00] focus:outline-none focus:ring-2 focus:ring-[#BB4D00]/20"
                  />
                </label>
              </div>
            </section>

            <section>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={includeBilling}
                  onChange={(e) => setIncludeBilling(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-black/20 text-[#BB4D00] focus:ring-[#BB4D00]"
                />
                <span>
                  <span className="block text-sm font-medium text-zinc-900">
                    Include a billing address
                  </span>
                  <span className="block text-xs text-zinc-500">
                    Optional — for invoicing or expense reimbursement.
                  </span>
                </span>
              </label>
              {includeBilling && (
                <div className="mt-4 grid gap-3">
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium text-zinc-700">Name / Company</span>
                    <input
                      type="text"
                      value={billingName}
                      onChange={(e) => setBillingName(e.target.value)}
                      className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#BB4D00] focus:outline-none focus:ring-2 focus:ring-[#BB4D00]/20"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium text-zinc-700">Address</span>
                    <textarea
                      rows={3}
                      value={billingAddress}
                      onChange={(e) => setBillingAddress(e.target.value)}
                      className="rounded-xl border border-black/10 bg-white p-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#BB4D00] focus:outline-none focus:ring-2 focus:ring-[#BB4D00]/20"
                    />
                  </label>
                </div>
              )}
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-black/5 bg-[#FFF6EF] p-6 shadow-sm">
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
                Bill Summary
              </h2>
              <dl className="mt-4 flex flex-col gap-2 text-sm text-zinc-700">
                <div className="flex justify-between">
                  <dt>
                    Items ({list.reduce((s, i) => s + i.quantity, 0)})
                  </dt>
                  <dd>{formatINR(subtotal)}</dd>
                </div>
                {addonsTotal > 0 && (
                  <div className="flex justify-between">
                    <dt>Add-ons</dt>
                    <dd>{formatINR(addonsTotal)}</dd>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <dt>Coupon {COUPON.code}</dt>
                    <dd>−{formatINR(discount)}</dd>
                  </div>
                )}
              </dl>
              <div className="mt-4 flex items-baseline justify-between border-t border-black/10 pt-4">
                <span className="text-sm font-medium text-zinc-600">Total</span>
                <span className="text-2xl font-semibold text-zinc-900">
                  {formatINR(total)}
                </span>
              </div>

              {!qualifiesForCoupon && (
                <p className="mt-4 rounded-xl border border-dashed border-[#BB4D00]/40 bg-white p-3 text-xs text-zinc-700">
                  Add {formatINR(COUPON_THRESHOLD - preDiscount)} more to unlock{" "}
                  <span className="font-semibold text-[#BB4D00]">{COUPON.code}</span> —{" "}
                  {COUPON.label} on your order.
                </p>
              )}
              {qualifiesForCoupon && (
                <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 ring-1 ring-emerald-100">
                  Coupon <span className="font-semibold">{COUPON.code}</span> applied — you
                  saved {formatINR(discount)}.
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#BB4D00] text-sm font-semibold text-white transition-colors hover:bg-[#9e4000] disabled:opacity-60"
              >
                {submitting ? "Placing order…" : `Place Order · ${formatINR(total)}`}
              </button>
              {submitError && (
                <p
                  role="alert"
                  className="mt-3 rounded-xl bg-red-50 p-3 text-xs text-red-800 ring-1 ring-red-100"
                >
                  {submitError}
                </p>
              )}
              <p className="mt-3 text-center text-[11px] text-zinc-500">
                By placing this order you agree to our terms. Enjoy your meal!
              </p>
            </div>
          </aside>
        </div>
      </form>
    </main>
  );
}

function AddonCard({
  addon,
  selected,
  onToggle,
}: {
  addon: Addon;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <label
        className={`flex h-full cursor-pointer flex-col gap-1.5 rounded-xl border p-4 transition-colors ${
          selected
            ? "border-[#BB4D00] bg-[#BB4D00]/5 ring-1 ring-[#BB4D00]/30"
            : "border-black/10 bg-white hover:border-black/20"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected}
              onChange={onToggle}
              className="h-4 w-4 rounded border-black/20 text-[#BB4D00] focus:ring-[#BB4D00]"
            />
            <span className="text-sm font-semibold text-zinc-900">{addon.name}</span>
          </div>
          <span className="text-sm font-semibold text-[#BB4D00]">
            {formatINR(addon.price)}
          </span>
        </div>
        <p className="pl-6 text-xs leading-5 text-zinc-600">{addon.description}</p>
        {addon.reveal && (
          <p className="pl-6 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
            Access details revealed on receipt
          </p>
        )}
      </label>
    </li>
  );
}

function ReceiptView({
  receipt,
  onNewOrder,
}: {
  receipt: Receipt;
  onNewOrder: () => void;
}) {
  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <main className="flex flex-1 flex-col bg-white font-sans">
      <section className="no-print bg-[#BB4D00] px-6 pb-10 pt-28 sm:px-10 sm:pb-12 sm:pt-32">
        <div className="mx-auto flex max-w-4xl flex-col gap-2 text-white">
          <span className="inline-block w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wider backdrop-blur-sm">
            Order Placed
          </span>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Thanks — we&apos;re on it.
          </h1>
          <p className="text-sm leading-6 text-white/85">
            Your receipt is below. We&apos;ll bring everything to seat{" "}
            <span className="font-semibold">{receipt.seatNumber}</span> shortly.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-6 py-10 sm:px-10 sm:py-14">
        <article className="print-receipt rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <header className="flex flex-wrap items-start justify-between gap-4 border-b border-dashed border-black/15 pb-5">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
                Nilam&apos;s Cafe · Receipt
              </h2>
              <p className="text-sm text-zinc-600">
                {receipt.orderId} · {receipt.timestamp}
              </p>
            </div>
            <div className="text-right text-sm text-zinc-700">
              <p>
                <span className="font-medium">Seat</span> {receipt.seatNumber}
              </p>
              <p>{receipt.phone}</p>
              <p>{receipt.email}</p>
            </div>
          </header>

          {receipt.billing && (receipt.billing.name || receipt.billing.address) && (
            <section className="mt-5 border-b border-dashed border-black/15 pb-5">
              <h3 className="text-sm font-semibold text-zinc-900">Billing</h3>
              {receipt.billing.name && (
                <p className="text-sm text-zinc-600">{receipt.billing.name}</p>
              )}
              {receipt.billing.address && (
                <p className="whitespace-pre-line text-sm text-zinc-600">
                  {receipt.billing.address}
                </p>
              )}
            </section>
          )}

          <section className="mt-5">
            <h3 className="text-sm font-semibold text-zinc-900">Items</h3>
            <ul className="mt-2 flex flex-col divide-y divide-black/5">
              {receipt.items.map((i) => (
                <li
                  key={i.id}
                  className="flex items-center justify-between gap-4 py-2 text-sm"
                >
                  <span className="text-zinc-800">
                    {i.name}{" "}
                    <span className="text-zinc-500">× {i.quantity}</span>
                  </span>
                  <span className="text-zinc-900">
                    {formatINR(parsePrice(i.price) * i.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {receipt.addons.length > 0 && (
            <section className="mt-5">
              <h3 className="text-sm font-semibold text-zinc-900">Add-ons</h3>
              <ul className="mt-2 flex flex-col divide-y divide-black/5">
                {receipt.addons.map((a) => (
                  <li key={a.id} className="py-3 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-zinc-800">{a.name}</span>
                      <span className="text-zinc-900">{formatINR(a.price)}</span>
                    </div>
                    {a.reveal && (
                      <dl className="mt-2 rounded-lg bg-emerald-50 p-3 ring-1 ring-emerald-100">
                        {a.reveal.map((r) => (
                          <div
                            key={r.label}
                            className="flex flex-wrap gap-x-2 text-xs leading-6"
                          >
                            <dt className="font-semibold uppercase tracking-wider text-emerald-700">
                              {r.label}:
                            </dt>
                            <dd className="text-emerald-900">{r.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-5 border-t border-dashed border-black/15 pt-5">
            <dl className="flex flex-col gap-2 text-sm text-zinc-700">
              <div className="flex justify-between">
                <dt>Items subtotal</dt>
                <dd>{formatINR(receipt.subtotal)}</dd>
              </div>
              {receipt.addonsTotal > 0 && (
                <div className="flex justify-between">
                  <dt>Add-ons</dt>
                  <dd>{formatINR(receipt.addonsTotal)}</dd>
                </div>
              )}
              {receipt.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <dt>Coupon {receipt.couponCode}</dt>
                  <dd>−{formatINR(receipt.discount)}</dd>
                </div>
              )}
            </dl>
            <div className="mt-3 flex items-baseline justify-between border-t border-black/10 pt-3">
              <span className="text-sm font-medium text-zinc-600">Total paid</span>
              <span className="text-2xl font-semibold text-zinc-900">
                {formatINR(receipt.total)}
              </span>
            </div>
          </section>

          <footer className="mt-6 border-t border-dashed border-black/15 pt-4 text-center text-xs text-zinc-500">
            Thank you for visiting Nilam&apos;s Cafe — we hope to see you again soon!
          </footer>
        </article>

        <div className="no-print mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#BB4D00] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#9e4000]"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path
                d="M6 9V4h12v5M6 18h12M6 14h12v6H6zM6 10h12a2 2 0 0 1 2 2v4h-4M6 10a2 2 0 0 0-2 2v4h4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Print Receipt
          </button>
          <Link
            href="/menu"
            onClick={onNewOrder}
            className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white px-6 text-sm font-semibold text-zinc-800 transition-colors hover:border-[#BB4D00] hover:text-[#BB4D00]"
          >
            Start a new order
          </Link>
        </div>
      </section>
    </main>
  );
}
