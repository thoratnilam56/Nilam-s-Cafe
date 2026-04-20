import Image from "next/image";

export default function CtaBanner() {
  return (
    <section className="w-full bg-[#FFF6EF] px-6 py-12 sm:px-10 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/10">
          <Image
            src="/pastry.jpg"
            alt="A warm, inviting spread of cafe favourites"
            fill
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30"
          />

          <div className="relative flex flex-col items-start gap-3 px-6 py-8 text-left sm:px-10 sm:py-10">
            <span className="inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-sm">
              Ready to Order
            </span>
            <h2 className="max-w-2xl text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Your next favourite combo is a click away.
            </h2>
            <p className="max-w-xl text-xs leading-6 text-white/85 sm:text-sm">
              Pre-order for pickup, book a table for later, or just drop in — we&apos;re brewing, baking, and firing up the oven every day.
            </p>

            <a
              href="#order"
              className="mt-1 inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-xs font-semibold text-[#BB4D00] shadow-sm transition-transform hover:scale-[1.02] sm:text-sm"
            >
              Order Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
