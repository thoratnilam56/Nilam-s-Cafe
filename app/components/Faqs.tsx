type Faq = { question: string; answer: string };

const faqs: Faq[] = [
  {
    question: "What are your opening hours?",
    answer:
      "We're open Monday to Friday from 7:00 AM to 9:00 PM, and on weekends from 8:00 AM to 10:00 PM. The kitchen closes 30 minutes before the cafe shuts.",
  },
  {
    question: "Do you take reservations?",
    answer:
      "Walk-ins are welcome anytime. For groups of six or more, we recommend reserving a table a day ahead so we can prepare the right space for you.",
  },
  {
    question: "Are there vegetarian and vegan options?",
    answer:
      "Yes — most of our pastries, pizzas, and beverages have vegetarian variants, and we offer plant-based milks, dairy-free pastries, and a fully vegan burger on request.",
  },
  {
    question: "Can I order combos for takeaway or delivery?",
    answer:
      "Every combo on the menu is available for takeaway. Delivery is handled through our partner apps in select neighbourhoods — check availability at checkout.",
  },
  {
    question: "Do you host private events or group bookings?",
    answer:
      "We host small gatherings, book clubs, and birthday parties. Drop us a note at events@nilamscafe.com with your date and headcount, and we'll put together a custom menu.",
  },
  {
    question: "Is the cafe laptop and Wi-Fi friendly?",
    answer:
      "Absolutely. We offer free, high-speed Wi-Fi and plenty of power outlets. We gently ask that laptops be packed away during peak lunch and dinner hours.",
  },
];

export default function Faqs() {
  return (
    <section className="w-full bg-[#FFF6EF] px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[#BB4D00]/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-[#BB4D00]">
            Good to Know
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-600 sm:text-lg">
            Everything you&apos;d want to know before stopping by — from opening hours to dietary preferences.
          </p>
        </div>

        <ul className="mt-12 flex flex-col gap-3">
          {faqs.map((faq) => (
            <li key={faq.question}>
              <details className="group rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-black/5 transition-colors open:ring-[#BB4D00]/30 sm:px-6 sm:py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 list-none text-left text-base font-medium text-zinc-900 marker:hidden sm:text-lg">
                  <span>{faq.question}</span>
                  <span
                    aria-hidden
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#BB4D00]/10 text-[#BB4D00] transition-transform duration-300 group-open:rotate-180"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      className="h-4 w-4"
                    >
                      <path
                        d="M5 8l5 5 5-5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-zinc-600 sm:text-base">
                  {faq.answer}
                </p>
              </details>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center text-sm text-zinc-600">
          Still curious? Reach us at{" "}
          <a
            href="mailto:hello@nilamscafe.com"
            className="font-medium text-[#BB4D00] underline-offset-4 hover:underline"
          >
            hello@nilamscafe.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}
