import Image from "next/image";
import AddToCartButton from "../components/cart/AddToCartButton";
import CtaBanner from "../components/CtaBanner";

type Item = {
  name: string;
  description: string;
  price: string;
  tags?: string[];
};

type Category = {
  slug: string;
  eyebrow: string;
  heading: string;
  intro: string;
  image: string;
  imageAlt: string;
  items: Item[];
};

const categories: Category[] = [
  {
    slug: "pastries",
    eyebrow: "Pastries & Bakes",
    heading: "Baked fresh, every morning",
    intro:
      "Flaky, buttery, and just out of the oven — the perfect partner for your first sip of the day.",
    image: "https://images.pexels.com/photos/29156078/pexels-photo-29156078.jpeg",
    imageAlt: "Croissant served with coffee",
    items: [
      {
        name: "Butter Croissant",
        description: "Traditional French-style croissant with a golden, flaky crust.",
        price: "₹149",
        tags: ["V"],
      },
      {
        name: "Pain au Chocolat",
        description: "Laminated pastry enveloping two batons of dark chocolate.",
        price: "₹179",
        tags: ["V"],
      },
      {
        name: "Cinnamon Roll",
        description: "Warm, swirled pastry finished with a sweet cream-cheese glaze.",
        price: "₹189",
        tags: ["V"],
      },
      {
        name: "Almond Danish",
        description: "Light puff pastry filled with vanilla-almond cream and toasted flakes.",
        price: "₹179",
        tags: ["V"],
      },
      {
        name: "Blueberry Muffin",
        description: "Bakery-style muffin loaded with plump, juicy blueberries.",
        price: "₹149",
        tags: ["V"],
      },
      {
        name: "Banana Walnut Loaf",
        description: "Moist, spiced banana bread with a generous scatter of walnuts.",
        price: "₹169",
        tags: ["V"],
      },
      {
        name: "Lemon Pistachio Tart",
        description: "Buttery shortcrust, tangy lemon curd, and a pistachio crumble top.",
        price: "₹219",
        tags: ["V"],
      },
      {
        name: "Chocolate Chip Cookie",
        description: "Chewy in the middle, crisp at the edges — just the way it should be.",
        price: "₹99",
        tags: ["V"],
      },
    ],
  },
  {
    slug: "beverages",
    eyebrow: "Beverages",
    heading: "Coffee, cold brews & coolers",
    intro:
      "From single-origin espresso to handcrafted mojitos — something refreshing for every hour of the day.",
    image: "https://images.pexels.com/photos/30591638/pexels-photo-30591638.jpeg",
    imageAlt: "Freshly prepared mojito with lime and mint",
    items: [
      {
        name: "Espresso",
        description: "A concentrated single shot of our house blend.",
        price: "₹149",
        tags: ["V", "VG"],
      },
      {
        name: "Cappuccino",
        description: "Equal parts espresso, steamed milk, and velvety foam.",
        price: "₹219",
        tags: ["V"],
      },
      {
        name: "Flat White",
        description: "Double espresso with silky microfoam milk.",
        price: "₹229",
        tags: ["V"],
      },
      {
        name: "Caramel Latte",
        description: "Espresso, steamed milk, and a drizzle of house caramel.",
        price: "₹249",
        tags: ["V"],
      },
      {
        name: "Cold Brew",
        description: "Slow-steeped for 18 hours — smooth, low-acid, extra bold.",
        price: "₹239",
        tags: ["V", "VG"],
      },
      {
        name: "Iced Matcha Latte",
        description: "Ceremonial-grade matcha whisked with chilled oat milk.",
        price: "₹269",
        tags: ["V", "VG"],
      },
      {
        name: "Classic Mojito",
        description: "Fresh mint, lime, and sparkling soda (non-alcoholic).",
        price: "₹289",
        tags: ["V", "VG"],
      },
      {
        name: "Strawberry Lemonade",
        description: "Muddled strawberries and fresh lemons over crushed ice.",
        price: "₹229",
        tags: ["V", "VG"],
      },
    ],
  },
  {
    slug: "pizzas",
    eyebrow: "Wood-Fired Pizzas",
    heading: "Crispy edges, molten centres",
    intro:
      "Hand-stretched dough baked at 400°C for the perfect 90-second char — served the minute it comes out.",
    image: "https://images.pexels.com/photos/4109084/pexels-photo-4109084.jpeg",
    imageAlt: "Slice of pizza with soda",
    items: [
      {
        name: "Margherita",
        description: "San Marzano tomato, fresh mozzarella, basil, olive oil.",
        price: "₹449",
        tags: ["V"],
      },
      {
        name: "Pepperoni",
        description: "Classic pepperoni slices over bubbling mozzarella.",
        price: "₹549",
      },
      {
        name: "Four Cheese",
        description: "Mozzarella, parmesan, gorgonzola, and ricotta.",
        price: "₹599",
        tags: ["V"],
      },
      {
        name: "Veggie Supreme",
        description: "Peppers, mushrooms, red onion, olives, and oregano.",
        price: "₹569",
        tags: ["V"],
      },
      {
        name: "Pesto Chicken",
        description: "Grilled chicken, basil pesto, and sweet cherry tomatoes.",
        price: "₹629",
      },
      {
        name: "Spicy Salami",
        description: "Spicy salami, pickled jalapeños, and chilli oil.",
        price: "₹589",
        tags: ["S"],
      },
      {
        name: "Truffle Mushroom",
        description: "Wild mushrooms, taleggio, and a finish of truffle oil.",
        price: "₹689",
        tags: ["V"],
      },
      {
        name: "BBQ Pulled Pork",
        description: "House-smoked pork, red onion, and BBQ sauce swirl.",
        price: "₹629",
      },
    ],
  },
  {
    slug: "burgers",
    eyebrow: "Burgers & Sandwiches",
    heading: "Stacked, toasted, and served hot",
    intro:
      "Brioche buns, house sauces, and generous pairings — every burger comes with a handful of crispy fries.",
    image: "https://images.pexels.com/photos/19247564/pexels-photo-19247564.jpeg",
    imageAlt: "Burger with fries and a drink",
    items: [
      {
        name: "Classic Beef Burger",
        description: "Smashed beef patty, cheddar, lettuce, tomato, house sauce.",
        price: "₹449",
      },
      {
        name: "Cheeseburger Deluxe",
        description: "Double patty, caramelised onions, pickles, double cheese.",
        price: "₹499",
      },
      {
        name: "Crispy Chicken",
        description: "Buttermilk-fried chicken, pickles, and lemon aioli.",
        price: "₹449",
      },
      {
        name: "BBQ Pulled Pork",
        description: "Slow-cooked pork, crunchy slaw, smoky BBQ sauce.",
        price: "₹469",
      },
      {
        name: "Veggie Halloumi",
        description: "Grilled halloumi, roasted peppers, hummus, rocket.",
        price: "₹399",
        tags: ["V"],
      },
      {
        name: "Spicy Paneer",
        description: "Tandoor-marinated paneer, mint-coriander chutney.",
        price: "₹419",
        tags: ["V", "S"],
      },
      {
        name: "Club Sandwich",
        description: "Chicken, bacon, lettuce, tomato on toasted sourdough.",
        price: "₹389",
      },
      {
        name: "Mushroom Melt",
        description: "Garlic mushrooms, swiss cheese, caramelised onion toastie.",
        price: "₹379",
        tags: ["V"],
      },
    ],
  },
  {
    slug: "sides",
    eyebrow: "Sides & Sweets",
    heading: "Little things, big joy",
    intro:
      "The finishing touches — a plate to share, a scoop to end on, or just a treat for the walk home.",
    image: "https://images.pexels.com/photos/10819659/pexels-photo-10819659.jpeg",
    imageAlt: "Platter of pastries and cookies",
    items: [
      {
        name: "Crispy Fries",
        description: "Hand-cut, double-fried, finished with sea salt.",
        price: "₹179",
        tags: ["V", "VG"],
      },
      {
        name: "Truffle Parmesan Fries",
        description: "Fries tossed with truffle oil and shaved parmesan.",
        price: "₹299",
        tags: ["V"],
      },
      {
        name: "Onion Rings",
        description: "Beer-battered, golden, and extra crunchy.",
        price: "₹189",
        tags: ["V"],
      },
      {
        name: "Sweet Potato Fries",
        description: "Served with a smoky chipotle mayo.",
        price: "₹219",
        tags: ["V"],
      },
      {
        name: "Mozzarella Sticks",
        description: "Six golden sticks with marinara dip.",
        price: "₹289",
        tags: ["V"],
      },
      {
        name: "Brownie à la Mode",
        description: "Warm fudge brownie topped with vanilla bean ice cream.",
        price: "₹249",
        tags: ["V"],
      },
      {
        name: "NY Cheesecake",
        description: "Classic baked cheesecake on a buttery graham base.",
        price: "₹279",
        tags: ["V"],
      },
      {
        name: "Affogato",
        description: "A shot of espresso poured over vanilla gelato.",
        price: "₹229",
        tags: ["V"],
      },
    ],
  },
];

const categoryNav = categories.map((c) => ({ slug: c.slug, label: c.eyebrow }));

const tagLabels: Record<string, { label: string; hint: string }> = {
  V: { label: "V", hint: "Vegetarian" },
  VG: { label: "VG", hint: "Vegan" },
  GF: { label: "GF", hint: "Gluten-free" },
  S: { label: "S", hint: "Spicy" },
};

function CategorySection({
  category,
  reversed,
}: {
  category: Category;
  reversed: boolean;
}) {
  return (
    <section
      id={category.slug}
      className={`scroll-mt-24 w-full px-6 py-20 sm:px-10 sm:py-28 ${
        reversed ? "bg-[#FFF6EF]" : "bg-white"
      }`}
    >
      <div
        className={`mx-auto grid max-w-6xl gap-10 lg:gap-14 lg:grid-cols-[1fr_1.2fr] ${
          reversed ? "lg:[&>div:first-child]:order-2" : ""
        }`}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-sm ring-1 ring-black/5 sm:aspect-[4/3] lg:aspect-auto lg:min-h-[420px]">
          <Image
            src={category.image}
            alt={category.imageAlt}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <span className="inline-block w-fit rounded-full bg-[#BB4D00]/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-[#BB4D00]">
            {category.eyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            {category.heading}
          </h2>
          <p className="mt-3 max-w-xl text-base leading-7 text-zinc-600">
            {category.intro}
          </p>

          <ul className="mt-8 flex flex-col divide-y divide-black/5">
            {category.items.map((item) => (
              <li key={item.name} className="flex flex-col gap-1.5 py-4">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-base font-semibold text-zinc-900 sm:text-lg">
                    {item.name}
                  </h3>
                  <span
                    aria-hidden
                    className="flex-1 border-b border-dotted border-zinc-300"
                  />
                  <span className="text-base font-semibold text-[#BB4D00] sm:text-lg">
                    {item.price}
                  </span>
                </div>
                <p className="text-sm leading-6 text-zinc-600">
                  {item.description}
                </p>
                {item.tags && item.tags.length > 0 && (
                  <ul className="mt-1 flex flex-wrap items-center gap-1.5">
                    {item.tags.map((tag) => {
                      const info = tagLabels[tag] ?? { label: tag, hint: tag };
                      return (
                        <li key={tag}>
                          <span
                            title={info.hint}
                            className="inline-flex h-5 items-center rounded-full bg-emerald-50 px-2 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-100"
                          >
                            {info.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <AddToCartButton
                  id={`${category.slug}-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  name={item.name}
                  price={item.price}
                  image={category.image}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function MenuPage() {
  return (
    <main className="flex flex-1 flex-col bg-white font-sans">
      <section className="relative w-full overflow-hidden bg-[#BB4D00]">
        <div className="relative min-h-[340px] w-full sm:min-h-[380px]">
          <div className="relative mx-auto flex min-h-[340px] max-w-4xl flex-col items-center justify-center px-6 pb-8 pt-28 text-center sm:min-h-[380px] sm:px-10 sm:pb-10 sm:pt-32">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white backdrop-blur-sm">
              Our Menu
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white drop-shadow-sm sm:text-5xl md:text-6xl">
              Everything we&apos;re serving today.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
              From stone-hearth pastries to slow-steeped cold brews and wood-fired pizzas — a short walk through the full Nilam&apos;s kitchen.
            </p>

            <nav aria-label="Menu categories" className="mt-8">
              <ul className="flex flex-wrap items-center justify-center gap-2">
                {categoryNav.map((c) => (
                  <li key={c.slug}>
                    <a
                      href={`#${c.slug}`}
                      className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-[#BB4D00]"
                    >
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

      </section>

      {categories.map((category, i) => (
        <CategorySection
          key={category.slug}
          category={category}
          reversed={i % 2 === 1}
        />
      ))}

      <CtaBanner />
    </main>
  );
}
