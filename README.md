# upNext

Realtime nightlife and DJ request platform — production MVP foundation.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript** (strict)
- **Tailwind CSS v4** + **shadcn/ui**
- **Supabase** (Auth, Postgres, Realtime)
- **TanStack Query** · **Zod** · **react-hook-form**
- **Vercel** deployment

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Environment

```bash
cp .env.example .env.local
```

Fill in your Supabase project values from [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API.

### 3. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command                | Description             |
| ---------------------- | ----------------------- |
| `npm run dev`          | Dev server (Turbopack)  |
| `npm run build`        | Production build        |
| `npm run start`        | Start production server |
| `npm run lint`         | ESLint                  |
| `npm run lint:fix`     | ESLint with auto-fix    |
| `npm run format`       | Prettier write          |
| `npm run format:check` | Prettier check          |
| `npm run typecheck`    | TypeScript check        |

## Project structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for conventions and data-flow rules.

## Deployment (Vercel)

1. Push to GitHub and import the repo in Vercel.
2. Set environment variables from `.env.example` in the Vercel project settings.
3. Deploy — Next.js is detected automatically.

## Git hooks

Husky runs on pre-commit:

- Prettier formatting (with Tailwind class sorting)
- ESLint on staged TypeScript/JavaScript files

## Optional integrations

Placeholders in `src/lib/integrations/` for Sentry and PostHog. See comments in those files when enabling.
