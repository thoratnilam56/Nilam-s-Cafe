# Nilam's Cafe — Backend

Express + Mongoose API for auth and orders, connected to MongoDB Atlas.

## Setup

1. `cd backend`
2. `npm install`
3. `.env` already contains your Atlas URI (rotate the password in Atlas before deploying — it was shared in chat).
4. `npm run dev` (Node 18+ needed for `--watch`) or `npm start`.

Server runs on <http://localhost:4000>. Health: `GET /`.

## Endpoints

### Auth — `/api/auth`
| Method | Path       | Body / Headers                                  | Returns              |
| ------ | ---------- | ----------------------------------------------- | -------------------- |
| POST   | `/register` | `{ name, email, phone, password }`             | `{ user, token }`    |
| POST   | `/login`    | `{ email, password }`                          | `{ user, token }`    |
| GET    | `/me`       | `Authorization: Bearer <token>`                | `{ user }`           |

Passwords are hashed with bcrypt; sessions are JWTs (7-day expiry, `JWT_SECRET` from env).

### Orders — `/api/orders`
| Method | Path | Auth      | Body                                                                                                                    |
| ------ | ---- | --------- | ----------------------------------------------------------------------------------------------------------------------- |
| POST   | `/`  | optional  | `{ seatNumber, contact: {phone, email}, billing?, items[], addons[], subtotal, addonsTotal, discount, total, couponCode }` |
| GET    | `/`  | required  | Returns the last 50 orders for the signed-in user                                                                       |

Orders accept both guest checkouts (no token) and authenticated ones (token links the order to a user).

## Security notes

- `.env` is gitignored — never commit it.
- The Atlas password shared in chat is considered compromised; rotate it in the Atlas UI and update `.env`.
- Set a long random `JWT_SECRET` before any real deployment.
- `CORS_ORIGIN` defaults to `http://localhost:3000` — update for production.
