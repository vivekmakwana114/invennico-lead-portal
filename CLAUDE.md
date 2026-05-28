# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # Start dev server (uses Webpack explicitly)
npm run build     # Production build
npm run lint      # ESLint (Next.js config, no extra flags needed)
```

There are no automated tests in this project.

## Environment

Create a `.env.local` file with:
```
ANTHROPIC_API_KEY=<your key>
```

Required for the two AI routes (`/api/analyze` and `/api/whatsapp`). Without it the routes return 500 immediately with a descriptive error.

## Architecture

**Next.js 16 App Router** with React 19 and the React Compiler (`reactCompiler: true` in `next.config.ts`).

### Route groups

- `(auth)` — unauthenticated pages: `/login`, `/forgot-password`. Layout is minimal (no sidebar).
- `(dashboard)` — authenticated pages behind a `Sidebar` + `Header` shell layout (`src/app/(dashboard)/layout.tsx`). The layout is a `"use client"` component managing sidebar open/close state.

### Authentication

Auth is **mock-only** — credentials are hardcoded in `src/lib/constants.ts` (`admin@invennico.com` / `Admin@Password123`). There is no real session: the login page does a `setTimeout` then calls `router.push('/dashboard')`. No middleware guards routes.

### Lead flow

1. **List** — `/leads` renders `GridComponent` with `LEADS_COLUMNS` and `ALL_LEADS` (all static data in `src/components/leads/`).
2. **Create** — `/leads/create` collects form fields then writes them to `sessionStorage` under `pending_lead_data`, then navigates to `/leads/analyzing`.
3. **Analyzing** — `/leads/analyzing` reads `pending_lead_data` from `sessionStorage`, calls `POST /api/analyze`, merges the Claude response into a `LeadDetail`-shaped object, stores it under `lead_<pocId>` in `sessionStorage`, then navigates to `/leads/<pocId>`.
4. **Detail** — `/leads/[id]` first checks `sessionStorage` for `lead_<id>` (AI-generated leads), then falls back to `getLeadDetail(id)` (static mock data in `LeadsDetailData.ts`).

AI-generated leads get IDs like `LD-POC-<random>`. Static mock leads use IDs `LD-1233` – `LD-1247`.

### API routes

Both routes in `src/app/api/` call Claude (`claude-haiku-4-5-20251001`) via `@anthropic-ai/sdk`:

- `POST /api/analyze` — takes `{ title, details, attachments, notes, source }`, returns a structured JSON analysis (qualification score, tech stack, estimation, suggested questions).
- `POST /api/whatsapp` — takes `{ lead_summary, tech_stack, timeline, budget, original_lead }`, returns `{ message: string }` for the WhatsApp reply modal.

### UI patterns

- `GridComponent<T>` — generic typed table in `src/components/ui/`. Column definitions live next to their data (e.g. `LeadsColumns.tsx`). The `_actions` key convention signals a non-data action column.
- `Button` — variants: `primary`, `secondary`, `blue`, `qualified`, `destructive`.
- `StatusBadge` — maps `LeadStatus` union to colored badges.
- Toast notifications via `sonner` (`<Toaster />` is in the root layout).
- `cn()` helper (`clsx` + `tailwind-merge`) is defined inline in `GridComponent.tsx` rather than in `src/lib/utils.ts` — the utils file only exports `getInitials`.

### Styling

Tailwind v4 with a single `globals.css`. Custom design tokens are declared as CSS variables on `:root` and mapped into Tailwind via `@theme inline`. Key semantic tokens:

| Token | Value |
|---|---|
| `primary` | `#FF5C3D` (brand orange-red) |
| `ternary` | `#6B7280` (muted text) |
| `off-white` | `#F3F4F6` (page background) |
| `border` | `#E5E7EB` |
| `success-*` / `error-*` | semantic green / red |

Use these token names in Tailwind classes (e.g. `text-ternary`, `bg-off-white`, `border-border`) rather than raw Tailwind color scales.
