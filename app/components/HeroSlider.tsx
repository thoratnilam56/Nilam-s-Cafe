"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Slide = {
  title: string;
  tagline: string;
  cta: string;
  image: string;
  accent: string;
};

const slides: Slide[] = [
  {
    title: "Freshly Baked Pastries",
    tagline: "Buttery croissants, flaky danishes, and warm cinnamon rolls — baked every morning.",
    cta: "Explore Pastries",
    image: "/pastry.jpg",
    accent: "bg-amber-700 hover:bg-amber-600",
  },
  {
    title: "Handcrafted Beverages",
    tagline: "Single-origin espresso, smooth lattes, and chilled iced brews to brighten your day.",
    cta: "See the Drinks",
    image: "/drinks.jpg",
    accent: "bg-emerald-700 hover:bg-emerald-600",
  },
  {
    title: "Wood-Fired Pizzas",
    tagline: "Thin-crust classics topped with fresh basil, mozzarella, and vine-ripened tomatoes.",
    cta: "Order a Pizza",
    image: "/pizza.jpg",
    accent: "bg-red-700 hover:bg-red-600",
  },
  {
    title: "Value Combos",
    tagline: "Pair your favourites — burger, fries, and a drink — at a price that saves you more.",
    cta: "Grab a Combo",
    image: "/burger.jpg",
    accent: "bg-orange-600 hover:bg-orange-500",
  },
];

const AUTOPLAY_MS = 2000;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured categories"
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[600px] w-full sm:h-[720px]">
        {slides.map((slide, i) => {
          const offset = i - index;
          const translate =
            offset === 0
              ? "translate-y-0"
              : offset < 0
                ? "-translate-y-full"
                : "translate-y-full";
          return (
          <div
            key={slide.title}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${translate} ${
              i === index ? "" : "pointer-events-none"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div aria-hidden className="absolute inset-0 bg-black/50" />

            <div className="relative mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center px-6 text-center sm:px-10">
              <h1 className="text-4xl font-semibold tracking-tight text-white drop-shadow-sm sm:text-5xl">
                {slide.title}
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-100">
                {slide.tagline}
              </p>
              <button
                type="button"
                className={`mt-8 inline-flex h-12 items-center justify-center rounded-full ${slide.accent} px-6 text-sm font-medium text-white transition-colors`}
              >
                {slide.cta}
              </button>
            </div>
          </div>
          );
        })}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#BB4D00] via-[#BB4D00]/70 to-transparent"
        />
      </div>
    </section>
  );
}
