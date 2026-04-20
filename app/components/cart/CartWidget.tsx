"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";

export default function CartWidget() {
  const { items, itemCount, subtotal, addItem, decrementItem, removeItem, clearCart } =
    useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const list = Object.values(items);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open cart${itemCount ? ` (${itemCount} items)` : ""}`}
        className="no-print fixed bottom-6 right-6 z-[55] flex h-14 w-14 items-center justify-center rounded-full bg-[#BB4D00] text-white shadow-xl ring-1 ring-black/5 transition-all hover:scale-[1.04] hover:bg-[#9e4000] sm:bottom-8 sm:right-8 sm:h-16 sm:w-16"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 sm:h-7 sm:w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden
        >
          <path
            d="M3 4h2l2.2 10.3a2 2 0 0 0 2 1.7h7.8a2 2 0 0 0 2-1.5L21 7H6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9.5" cy="19.5" r="1.4" fill="currentColor" />
          <circle cx="17" cy="19.5" r="1.4" fill="currentColor" />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-white px-1.5 text-xs font-bold text-[#BB4D00] shadow ring-2 ring-white">
            {itemCount}
          </span>
        )}
      </button>

      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`no-print fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-label="Shopping cart"
        aria-hidden={!open}
        className={`no-print fixed right-0 top-0 z-[70] flex h-full w-full max-w-md transform flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-black/5 px-6 py-4">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
            Your Cart {itemCount > 0 && <span className="text-zinc-500">({itemCount})</span>}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {list.length === 0 ? (
            <p className="mt-10 text-center text-sm text-zinc-500">
              Your cart is empty. Pick something delicious from the menu.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {list.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 rounded-xl border border-black/5 p-3"
                >
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
                    <h3 className="truncate text-sm font-semibold text-zinc-900">{item.name}</h3>
                    <p className="text-xs text-[#BB4D00]">{item.price}</p>
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
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {list.length > 0 && (
          <footer className="border-t border-black/5 px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600">Subtotal</span>
              <span className="text-lg font-semibold text-zinc-900">
                ₹{subtotal.toFixed(0)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#BB4D00] text-sm font-semibold text-white transition-colors hover:bg-[#9e4000]"
            >
              Checkout
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="mt-2 w-full text-center text-xs text-zinc-500 hover:text-zinc-800"
            >
              Clear cart
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}
