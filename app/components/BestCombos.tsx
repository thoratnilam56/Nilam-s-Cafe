import Image from "next/image";

type Combo = {
  title: string;
  description: string;
  includes: string[];
  price: string;
  image: string;
  accent: string;
  badge: string;
};

const combos: Combo[] = [
  {
    title: "Morning Starter",
    description: "Warm, flaky pastry paired with a handcrafted beverage to brighten your mornings.",
    includes: ["Pastry of the day", "Espresso or latte"],
    price: "₹299",
    image: "/pastry.jpg",
    accent: "bg-amber-700 hover:bg-amber-600",
    badge: "bg-amber-100 text-amber-800",
  },
  {
    title: "Pizza & Sip",
    description: "A wood-fired personal pizza and a refreshing drink — made for your lunch break.",
    includes: ["Personal pizza", "Beverage of choice"],
    price: "₹449",
    image: "/pizza.jpg",
    accent: "bg-red-700 hover:bg-red-600",
    badge: "bg-red-100 text-red-800",
  },
  {
    title: "Burger Stack",
    description: "A juicy signature burger with golden fries and your favourite chilled drink.",
    includes: ["Signature burger", "Crispy fries", "Beverage"],
    price: "₹549",
    image: "/burger.jpg",
    accent: "bg-orange-600 hover:bg-orange-500",
    badge: "bg-orange-100 text-orange-800",
  },
  {
    title: "The Grand Feast",
    description: "Our full spread — perfect for sharing across friends, family, or a quiet indulgence.",
    includes: ["Pastry", "Pizza slice", "Burger + fries", "2 beverages"],
    price: "₹899",
    image: "/drinks.jpg",
    accent: "bg-emerald-700 hover:bg-emerald-600",
    badge: "bg-emerald-100 text-emerald-800",
  },
];

export default function BestCombos() {
  return (
    <section className="relative w-full overflow-hidden bg-[#BB4D00] px-6 py-20 sm:px-10 sm:py-28">
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-medium uppercase tracking-wider text-[#BB4D00]">
            Best of Nilam&apos;s
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Our Favourite Combos
          </h2>
          <p className="mt-4 text-base leading-7 text-white/80 sm:text-lg">
            Handpicked pairings of beverages, burgers, fries, pizzas, and pastries — priced to save you more when you enjoy them together.
          </p>
        </div>

        <ul className="mt-14 grid gap-6 md:grid-cols-2">
          {combos.flatMap((combo, i) => {
            const card = (
            <li
              key={combo.title}
              className="flex overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative w-40 flex-shrink-0 overflow-hidden sm:w-56">
                <Image
                  src={combo.image}
                  alt={combo.title}
                  fill
                  sizes="(min-width: 768px) 28vw, 40vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <span
                  className={`absolute left-3 top-3 rounded-full ${combo.badge} px-2.5 py-1 text-xs font-medium`}
                >
                  {combo.price}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-5">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
                    {combo.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-zinc-600">
                    {combo.description}
                  </p>
                </div>

                <p className="text-xs text-zinc-500">
                  {combo.includes.join(" · ")}
                </p>

                <button
                  type="button"
                  className={`mt-auto inline-flex h-10 items-center justify-center rounded-full ${combo.accent} px-5 text-sm font-medium text-white transition-colors self-start`}
                >
                  Add to Order
                </button>
              </div>
            </li>
            );
            if (i === 2) {
              const divider = (
                <li
                  key="or-divider"
                  aria-hidden
                  className="col-span-full flex items-center gap-4 py-2"
                >
                  <span className="h-px flex-1 bg-white/30" />
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xs font-bold uppercase tracking-[0.2em] text-[#BB4D00] shadow-sm ring-1 ring-white/60">
                    or
                  </span>
                  <span className="h-px flex-1 bg-white/30" />
                </li>
              );
              return [divider, card];
            }
            return [card];
          })}
        </ul>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-gradient-to-t from-[#BB4D00] via-[#BB4D00]/70 to-transparent"
      />
    </section>
  );
}
