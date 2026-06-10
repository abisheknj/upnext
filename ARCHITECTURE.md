# upNext — Architecture

Production MVP foundation for a realtime nightlife / DJ request platform.

## Principles

1. **Service-layer first** — UI components never call Supabase directly. All data access goes through `src/services/<domain>/`.
2. **Feature boundaries** — UI and feature-specific logic live in `src/features/<feature>/`. Cross-cutting utilities live in `src/lib/`.
3. **Backend-first** — Server Components and route handlers own data fetching; client components handle interactivity only.
4. **Strict env validation** — Missing or invalid environment variables fail at startup (see `src/lib/env.ts`).
5. **AI-friendly modularity** — Small files, clear folder names, one responsibility per module.

## Directory layout

```
src/
  app/              # Next.js App Router (routes, layouts, metadata)
  components/       # Shared UI (ui/ = shadcn primitives)
  features/         # Feature modules (auth, sessions, requests, …)
  services/         # Data & external API layer (Supabase, Spotify, …)
  lib/              # Env, Supabase clients, validators, integrations
  hooks/            # Shared React hooks
supabase/
  migrations/       # SQL migrations
  seed/             # Seed data
```

## Data flow

```
UI (features/*) → services/* → Supabase / external APIs
                ↘ TanStack Query (client cache, no raw Supabase in components)
```

## Supabase clients

| Module                       | Use case                                           |
| ---------------------------- | -------------------------------------------------- |
| `lib/supabase/client.ts`     | Browser / Client Components                        |
| `lib/supabase/server.ts`     | Server Components, Route Handlers (cookie session) |
| `lib/supabase/admin.ts`      | Trusted server-only ops (service role)             |
| `lib/supabase/middleware.ts` | Session refresh in `src/middleware.ts`             |

## What not to do

- No business logic in `components/` or route files beyond composition
- No `createClient()` from Supabase inside feature UI code
- No premature abstractions — add shared code when a second consumer exists

## Next steps (not in foundation)

- Database schema & RLS policies in `supabase/migrations/`
- Auth flows in `features/auth/` + `services/`
- Realtime subscriptions via Supabase channels in services
- API routes only when Server Actions / RSC are insufficient
