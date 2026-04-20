"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";

type Props = {
  id: string;
  name: string;
  price: string;
  image: string;
};

export default function AddToCartButton({ id, name, price, image }: Props) {
  const { items, addItem } = useCart();
  const quantity = items[id]?.quantity ?? 0;
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(false), 1000);
    return () => clearTimeout(t);
  }, [flash]);

  const label = flash
    ? "Added ✓"
    : quantity > 0
      ? `In cart (${quantity}) · Add more`
      : "Add to Cart";

  return (
    <button
      type="button"
      onClick={() => {
        addItem({ id, name, price, image });
        setFlash(true);
      }}
      className="mt-2 inline-flex h-9 w-fit items-center justify-center gap-1.5 rounded-full bg-[#BB4D00] px-4 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#9e4000]"
    >
      {label}
    </button>
  );
}
