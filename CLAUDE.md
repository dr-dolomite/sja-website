# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Design Rules — Read First

This is the marketing/brand website for **St. Joseph's Academy of Malinao, Inc.** — a private, Catholic (Diocesan) school. Register is **brand** (design IS the product).

Two documents are the **binding design bible** for all UI work. Read both before writing or changing any UI:

- **`PRODUCT.md`** — strategic context: users, purpose, brand personality, anti-references, design principles, accessibility targets.
- **`DESIGN.md`** — the visual system ("The Guardian's Grove"): green/gold palette, typography, elevation registers, motion philosophy, and named rules.

Non-negotiables distilled (details and rationale live in the docs):

- Students are **"Guardians"** — use the term deliberately in copy; it is the heart of the brand.
- **The Committed Green Rule**: Guardian Green carries 30–60% of a surface, never a timid accent on gray.
- **The Gold-as-Crown Rule**: gold marks achievement/faith/the single most important highlight — never filler, tiles, or gradients.
- **Earned dimension**: everyday UI is flat and tone-separated (shadow only on interaction); true 3D/choreographed motion is reserved for signature moments (hero, feature reveals, achievements).
- **Enhancement, not gate**: content must be complete, legible, and usable before any 3D/animation runs; every effect needs a `prefers-reduced-motion` fallback.
- **WCAG 2.1 AA**: body text ≥4.5:1; mobile-first, wide age range; contact is always one tap/scroll away.
- Anti-references: never generic corporate/SaaS gloss, dated clip-art school site, or cold institutional portal.
- **No em dashes**: never use em dashes (—) anywhere in site copy or content. Use a period, comma, or colon instead.

The impeccable design skill reads both docs before UI work. `DESIGN.md` is a seed — re-run `/impeccable document` after real components exist to capture actual tokens.

## Orchestration

The main session (run on **Opus**) acts as **head architect**: it owns planning, decomposition, and final review, and delegates implementation to subagents rather than writing everything itself. Custom subagents live in `.claude/agents/`.

- **Default worker — `implementer` (Sonnet)**: well-scoped implementation tasks (components, pages, refactors). Delegate with a precise task spec; independent tasks go out in parallel (multiple Agent calls in one message).
- **Escalate to Opus** only for *very* complex tasks — cross-cutting architecture, subtle debugging, intricate 3D/animation choreography — by passing `model: "opus"` in the Agent call (the `implementer` definition defaults to Sonnet; the override wins).
- **Devil's advocate — `devils-advocate` (Opus, read-only)**: before committing to any significant plan, architecture, or design direction, spawn exactly **one** to attack it. Address or consciously reject its objections before proceeding. One per decision — never a panel.

## UI Workflow

- **Invoke `/impeccable craft` when building new UI parts** (new sections, pages, components, visual features). It reads `PRODUCT.md`/`DESIGN.md` and enforces the design system.
- **shadcn-first component policy**: use shadcn/ui components (`pnpm shadcn add <component>`) whenever one exists. Hand-roll only when shadcn genuinely has no equivalent — and then follow the `components/ui/button.tsx` pattern (cva variants, `data-slot`, Base UI primitives).
- **Animation & 3D stack** (per `DESIGN.md`'s two depth registers — install on first use):
  - **Motion** (`motion` package — the successor to Framer Motion) for choreographed entrances, scroll-driven reveals, and state transitions. Always pair with its `useReducedMotion`/reduced-motion support.
  - **React Three Fiber** (`@react-three/fiber` + `@react-three/drei`) for true-3D *signature moments only* (hero, achievement showcases). Lazy-load via `next/dynamic`; the page must be complete and legible before it hydrates.
  - `tw-animate-css` (already installed) for small micro-transitions where a full Motion component is overkill.

## Commands

Use **pnpm** (pnpm-lock.yaml is present; do not use npm/yarn).

- `pnpm dev` — start the dev server at http://localhost:3000
- `pnpm build` — production build
- `pnpm start` — serve the production build
- `pnpm lint` — run ESLint (flat config in `eslint.config.mjs`)
- `pnpm shadcn add <component>` — add a shadcn/ui component (CLI is a local dependency)

There is no test framework configured yet.

## Architecture

Next.js 16 (App Router) + React 19 + TypeScript. Routes live under `app/`; shared UI under `components/` (`components/ui/` for shadcn-generated components); helpers under `lib/` (`cn()` in `lib/utils.ts`).

- **Component library**: shadcn/ui with the **`base-nova` style** (see `components.json`), which builds on **Base UI primitives (`@base-ui/react`) — not Radix**. Don't paste Radix-based shadcn snippets; generate components via the CLI or follow the pattern in `components/ui/button.tsx` (cva variants + `data-slot` attributes). Icons: `lucide-react`.
- **Styling**: Tailwind CSS v4 — no `tailwind.config.*`; all configuration is CSS-based in `app/globals.css` (`@theme inline` + shadcn oklch design tokens in `:root`/`.dark`). Animation utilities come from `tw-animate-css`. Semantic tokens (`--primary`, `--secondary`, etc.) are the hook point for the Guardian Green / Academy Gold palette from `DESIGN.md`.
- **Fonts**: currently Geist Sans/Mono via `next/font` CSS variables mapped in the `@theme` block. `DESIGN.md` calls for a geometric sans + sparing serif accent — swap happens at the `--font-sans`/`--font-heading` token level in `app/layout.tsx` + `app/globals.css`.
- **Path alias**: `@/*` maps to the repo root (see `tsconfig.json` and `components.json` aliases).

Note: this directory is not currently a git repository.
