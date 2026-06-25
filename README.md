# Back-Street

A full-stack e-commerce storefront built with the **Next.js App Router**, **Clerk** authentication, **Neon Postgres** + **Prisma**, and **Stripe** checkout.

Live: https://back-street.vercel.app

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15 (App Router, Server Components + Server Actions) |
| Auth | Clerk OAuth (`@clerk/nextjs`) synced to Postgres via webhook |
| Database | Neon Postgres |
| ORM | Prisma 6 (migrations + seed) |
| Payments | Stripe Checkout (via Server Actions) |
| Styling | Tailwind CSS v4, shadcn/ui, `next-themes` |
| Hosting | Vercel + Neon |

## Architecture

- **Server Components** fetch product data directly from Prisma (`/`, `/arrivals`, `/top-selling`, `/product/[source]/[id]`).
- **Server Actions** (`src/app/actions/checkout.ts`) handle promo validation, Stripe checkout session creation, and order persistence.
- **Client Components** own interactive UI (cart, product selection, theme toggle, nav).
- A **Clerk webhook** (`src/app/api/webhooks/clerk/route.ts`) syncs users into the `User` table.

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template and fill in your keys:

```bash
cp .env.example .env.local
```

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend key |
| `CLERK_SECRET_KEY` | Clerk server key |
| `CLERK_WEBHOOK_SECRET` | Verifies Clerk webhook requests |
| `STRIPE_SECRET_KEY` | Stripe Checkout |
| `NEXT_PUBLIC_APP_URL` | Base URL for Stripe success/cancel redirects |

3. Apply migrations and seed the database:

```bash
npm run db:migrate
npm run db:seed
```

4. Start the dev server:

```bash
npm run dev
```

App runs at http://localhost:3000.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build (`prisma generate && next build`) |
| `npm run vercel-build` | Deploy build: `migrate deploy` + `db seed` + `next build` |
| `npm run start` | Run the production server |
| `npm run lint` | ESLint (Next.js config) |
| `npm run db:migrate` | Create/apply a dev migration |
| `npm run db:seed` | Seed products and promo codes |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:push` | Push schema without a migration |

DB scripts load `.env.local` via `dotenv-cli`.

## Deployment (Vercel + Neon)

1. Set all environment variables above in the Vercel project (Production + Preview).
2. Vercel runs `npm run vercel-build`, which applies migrations, seeds, and builds.
3. In the Clerk Dashboard:
   - Add your Vercel domain under **Domains**.
   - Add a webhook → `https://YOUR_DOMAIN/api/webhooks/clerk` for `user.created`, `user.updated`, `user.deleted`.

## Project structure

```
prisma/            schema, migrations, seed
src/
  app/
    (shop)/        storefront routes (home, arrivals, top-selling, product, cart, checkout)
    actions/       Server Actions (checkout, promo, order)
    api/webhooks/  Clerk webhook route handler
  components/      UI (server + client components)
  lib/             prisma client, data helpers, promo, order totals, clerk sync
  middleware.ts    Clerk middleware
```
