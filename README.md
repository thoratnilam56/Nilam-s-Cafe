# Nilam's Cafe

A full-stack storefront for a modern cafe: browse the menu, build a cart, check out to a specific seat, unlock table amenities like Wi-Fi, and track orders through a personal dashboard.

Built with **Next.js 16** on the frontend and an **Express + MongoDB Atlas** API on the backend.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Quick Start](#quick-start)
5. [Project Structure](#project-structure)
6. [Environment Variables](#environment-variables)
7. [API Reference](#api-reference)
8. [User Flows](#user-flows)
9. [Scripts](#scripts)
10. [Deployment Notes](#deployment-notes)
11. [Security](#security)
12. [Roadmap](#roadmap)

---

## Features

**Storefront**
- Hero slider with vertical slide-up transitions and a 2-second autoplay.
- Combo grids, a tabbed Drinks/Food section, accordion FAQ, CTA banner, and a deep-brown footer with legal columns.
- 40-item menu page with category jump-pills, feature photos, and dietary tags (V / VG / GF / S).

**Cart & Checkout**
- Client-side cart context with thumbnails, quantity controls, and `localStorage` persistence.
- Floating cart FAB visible on every page.
- Checkout asks for seat number instead of delivery address.
- Optional amenities (Wi-Fi, phone charger, board-game rental, quiet-zone seat) that reveal access details — passwords, pickup notes — on the printed receipt.
- Auto-applied `CAFE100` coupon (₹100 off) once the bill crosses ₹999.
- Print-friendly receipt with a dedicated `@media print` stylesheet.

**Accounts**
- `/register` and `/login` pages backed by bcrypt-hashed passwords and JWT sessions.
- Header profile circle adapts to signed-in state (shows the user's initial) and routes to the dashboard.
- Dashboard pulls live order history from MongoDB and derives loyalty points, monthly order count, and lifetime savings.

---

## Tech Stack

| Layer       | Technology                                            |
| ----------- | ----------------------------------------------------- |
| Frontend    | Next.js 16 (App Router), React 19, TypeScript         |
| Styling     | Tailwind CSS v4                                       |
| Images      | `next/image` with Pexels remote patterns              |
| Backend     | Node.js, Express 4, Mongoose 8                        |
| Database    | MongoDB Atlas                                         |
| Auth        | bcryptjs (hashing) + jsonwebtoken (sessions)          |
| Dev tooling | TypeScript, ESLint, Node `--watch`                    |

---

## Architecture

```
┌────────────────────────┐     HTTPS / JSON      ┌─────────────────────────┐
│  Next.js 16 (port 3000)│ ────────────────────▶ │  Express API (port 4000)│
│  ─ App Router pages    │                       │  ─ /api/auth/*          │
│  ─ AuthProvider (JWT)  │ ◀──────────────────── │  ─ /api/orders          │
│  ─ CartProvider        │                       │  ─ Mongoose models      │
└────────────────────────┘                       └────────────┬────────────┘
                                                              │
                                                              ▼
                                                  ┌───────────────────────┐
                                                  │  MongoDB Atlas        │
                                                  │  ─ users collection   │
                                                  │  ─ orders collection  │
                                                  └───────────────────────┘
```

- The frontend is a Next.js App Router project. Pages that need interactivity are client components; static content is rendered on the server.
- The backend is a separate Node process. The frontend talks to it via `apiFetch()` ([app/lib/api.ts](app/lib/api.ts)), attaching a bearer token when one is present.
- Sessions are stateless JWTs stored in `localStorage`; the backend never holds a session store.

---

## Quick Start

### Prerequisites
- Node.js 18+ (the backend uses `node --watch`)
- A MongoDB Atlas cluster (or any MongoDB instance reachable by connection string)

### 1. Install dependencies

```bash
# frontend (from repo root)
npm install

# backend
cd backend
npm install
cd ..
```

### 2. Configure environment

Create two env files from the provided templates:

```bash
# frontend
cp .env.local.example .env.local      # if you add a template, otherwise create manually
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > .env.local

# backend
cp backend/.env.example backend/.env
# then edit backend/.env and set MONGODB_URI + a long random JWT_SECRET
```

See the full [Environment Variables](#environment-variables) table below.

### 3. Run both processes

```bash
# Terminal 1 – backend
cd backend && npm run dev

# Terminal 2 – frontend
npm run dev
```

The storefront is now at <http://localhost:3000> and the API at <http://localhost:4000>.

---

## Project Structure

```
nilamscafe/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home: hero slider, combos, FAQ, CTA
│   ├── menu/page.tsx             # 40-item menu with category sections
│   ├── checkout/page.tsx         # Seat + amenities + receipt flow
│   ├── dashboard/page.tsx        # Auth-gated orders + stats
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── layout.tsx                # Root layout wrapping Auth + Cart providers
│   ├── globals.css               # Tailwind entry + print styles
│   ├── lib/api.ts                # Typed fetch helper
│   └── components/
│       ├── Header.tsx, Footer.tsx, HeroSlider.tsx, BestCombos.tsx,
│       ├── TabbedCombos.tsx, CtaBanner.tsx, Faqs.tsx
│       ├── auth/                 # AuthProvider, ProfileLink
│       └── cart/                 # CartProvider, CartWidget, AddToCartButton
│
├── backend/                      # Express API
│   ├── server.js                 # App bootstrap + route mounting
│   ├── config/db.js              # Mongoose connection
│   ├── middleware/auth.js        # JWT helpers (required & optional)
│   ├── models/
│   │   ├── User.js               # name, email, phone, passwordHash
│   │   └── Order.js              # items, addons (with reveal), totals
│   ├── routes/
│   │   ├── auth.js               # /register, /login, /me
│   │   └── orders.js             # create + list user orders
│   └── .env.example              # Template – copy to .env
│
├── public/                       # Static images (pastry, drinks, pizza, burger)
├── next.config.ts                # Pexels image domain allowlist
└── package.json
```

---

## Environment Variables

### Frontend — `.env.local`
| Variable              | Example                        | Notes                                           |
| --------------------- | ------------------------------ | ----------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000`        | Origin of the Express API. No trailing slash.   |

### Backend — `backend/.env`
| Variable         | Example                                                           | Notes                                                      |
| ---------------- | ----------------------------------------------------------------- | ---------------------------------------------------------- |
| `PORT`           | `4000`                                                            | HTTP port the API listens on.                              |
| `MONGODB_URI`    | `mongodb+srv://user:pass@cluster.mongodb.net/nilamscafe`          | Atlas connection string. Required.                         |
| `JWT_SECRET`     | `a-long-random-string`                                            | Signs all JWTs. Use `openssl rand -hex 32` in production.  |
| `JWT_EXPIRES_IN` | `7d`                                                              | Token lifetime (vercel/ms syntax).                         |
| `CORS_ORIGIN`    | `http://localhost:3000`                                           | Comma-separate to allow multiple origins.                  |

Both `.env` and `.env.local` are listed in [.gitignore](.gitignore) — `.env.example` files are tracked.

---

## API Reference

All routes are prefixed with `/api`. JSON bodies only. Authenticated endpoints expect `Authorization: Bearer <token>`.

### Auth
| Method | Path              | Auth     | Body                                        | Response                  |
| ------ | ----------------- | -------- | ------------------------------------------- | ------------------------- |
| POST   | `/auth/register`  | public   | `{ name, email, phone, password }`          | `{ user, token }`         |
| POST   | `/auth/login`     | public   | `{ email, password }`                       | `{ user, token }`         |
| GET    | `/auth/me`        | required | —                                           | `{ user }`                |

### Orders
| Method | Path       | Auth     | Body                                                                                                                    | Response              |
| ------ | ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------- |
| POST   | `/orders`  | optional | `{ seatNumber, contact, billing?, items[], addons[], subtotal, addonsTotal, discount, total, couponCode }`              | `{ order }`           |
| GET    | `/orders`  | required | —                                                                                                                        | `{ orders[] }` (last 50) |

Orders created without a token are treated as guest orders and saved without a `userId`. Passing a valid token links the order to the user so it appears on their dashboard.

---

## User Flows

**Guest**
1. Land on `/`, browse combos, navigate to `/menu`.
2. Add items via the brand-orange "Add to Cart" buttons. The floating FAB shows the live item count.
3. Open the cart drawer → click **Checkout** → `/checkout`.
4. Enter seat number, pick amenities, provide phone + email, place the order.
5. Receipt page shows the full bill including any amenity reveal blocks (e.g., Wi-Fi password). Print via the "Print Receipt" button.

**Returning user**
1. Sign in at `/login`. The header profile circle switches to the user's first initial.
2. Checkout pre-fills phone + email from the signed-in account.
3. Placed orders show up on `/dashboard` with live stats (loyalty points, orders this month, total saved).

---

## Scripts

### Frontend — `package.json`
| Script        | What it runs             |
| ------------- | ------------------------ |
| `npm run dev` | `next dev` on port 3000  |
| `npm run build` | Production build       |
| `npm start`   | Serves the build         |
| `npm run lint`| ESLint                   |

### Backend — `backend/package.json`
| Script        | What it runs                     |
| ------------- | -------------------------------- |
| `npm run dev` | `node --watch server.js`         |
| `npm start`   | `node server.js`                 |

---

## Deployment Notes

### Vercel (single-project, multi-service)

[vercel.json](vercel.json) uses `experimentalServices` to co-deploy the Next.js frontend and the Express backend from the same repo:

| Service  | Route prefix   | Source   |
| -------- | -------------- | -------- |
| frontend | `/`            | repo root (`next`) |
| backend  | `/_/backend`   | `backend/` directory |

At runtime the API is reachable at `https://<your-app>.vercel.app/_/backend/api/...`, so set the frontend env var accordingly:

- **Frontend env** — `NEXT_PUBLIC_API_URL=/_/backend`
- **Backend env** — `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGIN` (set to `https://<your-app>.vercel.app`)

Configure these in **Project Settings → Environment Variables** in Vercel; don't commit them.

### Other hosts
- **Backend**: runs anywhere Node 18+ is supported (Render, Railway, Fly, a VPS, etc.). Make sure `CORS_ORIGIN` matches the frontend's public URL and `JWT_SECRET` is a long random string, not the placeholder.
- **Frontend**: deploy to any Node-capable host and point `NEXT_PUBLIC_API_URL` to the live API origin.
- **Atlas**: whitelist your deploy target's egress IPs or enable access from anywhere (not recommended for prod) before connections will succeed.
- **Images**: `next.config.ts` only allows `images.pexels.com/photos/**` — extend `remotePatterns` before adding other external image hosts.

---

## Security

- Atlas credentials live in `backend/.env`, which is gitignored. Never commit real secrets.
- Passwords are hashed with bcrypt (cost 10). The database never sees plaintext.
- JWTs are signed with `JWT_SECRET`. Rotate the secret and invalidate outstanding tokens by redeploying.
- CORS defaults to `http://localhost:3000` — narrow this to your production origin before going live.
- The frontend `AuthProvider` stores `{ user, token }` in `localStorage`. This is appropriate for this demo but susceptible to XSS; consider moving to HttpOnly cookies if you grow this into a production app.

---

## Roadmap

Ideas that would round the project out:
- Real-time order status (WebSocket or SSE) between the counter and the user's dashboard.
- Staff view for preparing / serving orders and updating statuses.
- Payment integration (Razorpay / Stripe) instead of "Place Order" closing immediately.
- Reservation flow for booking a table in advance.
- Image-per-item in the menu instead of sharing category photos.

---

## Credits

Food photography courtesy of [Pexels](https://www.pexels.com) contributors. Fonts by [Vercel](https://vercel.com/font) (Geist Sans & Geist Mono).
