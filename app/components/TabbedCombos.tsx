"use client";

import Image from "next/image";
import { useState } from "react";

type Combo = {
  title: string;
  description: string;
  price: string;
  image: string;
  accent: string;
};

type TabKey = "drinks" | "food";

const TABS: { key: TabKey; label: string }[] = [
  { key: "drinks", label: "Drink Combos" },
  { key: "food", label: "Food Combos" },
];

const COMBOS: Record<TabKey, Combo[]> = {
  drinks: [
    {
      title: "Mojito Duo",
      description: "Two signature mojitos with a plate of fresh bruschetta to share.",
      price: "₹499",
      image: "https://images.pexels.com/photos/30591638/pexels-photo-30591638.jpeg",
      accent: "bg-emerald-700 hover:bg-emerald-600",
    },
    {
      title: "Coffee & Pastry",
      description: "A freshly brewed coffee paired with the pastry of the day.",
      price: "₹299",
      image: "https://images.pexels.com/photos/29156078/pexels-photo-29156078.jpeg",
      accent: "bg-amber-700 hover:bg-amber-600",
    },
    {
      title: "Summer Refresher",
      description: "Iced lemonade with a side of golden, crispy seasoned fries.",
      price: "₹349",
      image: "https://images.pexels.com/photos/30412118/pexels-photo-30412118.jpeg",
      accent: "bg-cyan-700 hover:bg-cyan-600",
    },
  ],
  food: [
    {
      title: "Pizza Night",
      description: "A personal wood-fired pizza with garlic bread and a chilled soda.",
      price: "₹599",
      image: "https://images.pexels.com/photos/4109084/pexels-photo-4109084.jpeg",
      accent: "bg-red-700 hover:bg-red-600",
    },
    {
      title: "Burger Feast",
      description: "A juicy signature burger with crispy fries and a creamy milkshake.",
      price: "₹649",
      image: "https://images.pexels.com/photos/19247564/pexels-photo-19247564.jpeg",
      accent: "bg-orange-600 hover:bg-orange-500",
    },
    {
      title: "Sweet & Savoury",
      description: "A pizza slice, a buttery pastry, and your beverage of choice.",
      price: "₹549",
      image: "https://images.pexels.com/photos/10819659/pexels-photo-10819659.jpeg",
      accent: "bg-rose-700 hover:bg-rose-600",
    },
  ],
};

export default function TabbedCombos() {
  const [active, setActive] = useState<TabKey>("drinks");
  const combos = COMBOS[active];

  return (
    <section className="w-full bg-[#FFF6EF] px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-[#BB4D00]/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-[#BB4D00]">
            Pair &amp; Save
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Combos for Every Craving
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-600 sm:text-lg">
            Choose what you&apos;re in the mood for — a refreshing drink pairing or a hearty food combo.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Combo categories"
          className="mt-10 flex justify-center"
        >
          <div className="inline-flex rounded-full border border-[#BB4D00]/25 bg-white p-1 shadow-sm">
            {TABS.map((tab) => {
              const selected = tab.key === active;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  id={`tab-${tab.key}`}
                  aria-selected={selected}
                  aria-controls={`panel-${tab.key}`}
                  onClick={() => setActive(tab.key)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-colors sm:px-6 sm:text-base ${
                    selected
                      ? "bg-[#BB4D00] text-white shadow-sm"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          role="tabpanel"
          id={`panel-${active}`}
          aria-labelledby={`tab-${active}`}
          className="mt-12"
        >
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {combos.map((combo) => (
              <li
                key={combo.title}
                className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-transform hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={combo.image}
                    alt={combo.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#BB4D00] shadow-sm">
                    {combo.price}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-6">
                  <h3 className="text-xl font-semibold tracking-tight text-zinc-900">
                    {combo.title}
                  </h3>
                  <p className="text-sm leading-6 text-zinc-600">
                    {combo.description}
                  </p>
                  <button
                    type="button"
                    className={`mt-auto inline-flex h-11 items-center justify-center self-start rounded-full ${combo.accent} px-6 text-sm font-medium text-white transition-colors`}
                  >
                    Order Now
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
