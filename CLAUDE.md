# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Design Rules — Read First

This is the marketing/brand website for **St. Joseph's Academy of Malinao, Inc.** — a private, Catholic (Diocesan) school. Register is **brand** (design IS the product).

Two documents are the **binding design bible** for all UI work. Read both before writing or changing any UI:

- **`PRODUCT.md`** — strategic context: users, purpose, brand personality, anti-references, design principles, accessibility targets.
- **`DESIGN.md`** — the visual system ("The Guardian's Grove"): green/gold palette, typography, elevation registers, motion philosophy, and named rules.

Non-negotiables distilled (details and rationale live in the docs):

- Students are **"Guardians"** — use the term deliberately in copy; it is the heart of the brand.
- **The Committed Green Rule (rewritten)**: Guardian Green carries 30–60% of the view by massing into **full Evergreen structural sections** (a full-width band, the footer) plus Palm interactive accents and Evergreen serif display words, on an alternating Coconut/Leaf-Tint canvas. Full-bleed evergreen sections are encouraged, not banned. Failure modes: green as a timid accent on gray, or every section evergreen with no breathing coconut.
- **The Gold-as-Detail Rule (was Gold-as-Crown)**: gold is precious fine linework only, labels, numbers, dots, rings, underlines, and exactly one CTA on an evergreen ground. Never a fill, gradient, tile, or large text block. Gold is **ground-keyed**: it may appear as text or a numeral only on an evergreen ground; on Coconut/Leaf-Tint it is decorative linework only (never text, never a meaning-bearing dot).
- **The Serif-as-Display Rule**: Instrument Serif carries all headings, card titles, and pull-quotes, size ≥ ~24px only; below that floor, headings drop to Hanken Grotesk semibold. Hanken Grotesk is the body/UI workhorse everywhere else. Italic-Palm marks emotional emphasis inside a headline, on a light ground only.
- **The Eyebrow-Kicker Rule**: the tracked-uppercase eyebrow label above a section heading is an embraced signature device (not a "use sparingly" exception). Never use the mid dot as an eyebrow separator, use spacing, a thin rule, or a styled dot element instead.
- **Enhancement, not gate**: content must be complete, legible, and usable before any motion runs; every effect needs a `prefers-reduced-motion` fallback. Everyday UI stays flat and tone-separated, shadow only on hover/interaction.
- **WCAG 2.1 AA, ground-keyed, no headroom**: body text ≥4.5:1; the palette's passing pairs run at only ~4.5–5.2, so verify contrast on every new pairing rather than assuming it. Never rely on color alone to convey meaning. Mobile-first, wide age range; contact is always one tap/scroll away.
- Anti-references: never generic corporate/SaaS gloss, dated clip-art school site, or cold institutional portal.
- **No em dashes**: never use em dashes (—) anywhere in site copy or content. Use a period, comma, or colon instead.
- **No mid dots**: never use the mid dot / interpunct (·) anywhere in site copy or content. Use a comma, bullet list, or separate sentence instead.

The impeccable design skill reads both docs before UI work. `DESIGN.md` is a seed — re-run `/impeccable document` after real components exist to capture actual tokens.

## Orchestration

The main session (run on **Opus**) acts as **head architect**: it owns planning, decomposition, and final review, and delegates implementation to subagents rather than writing everything itself. Custom subagents live in `.claude/agents/`.

- **Default worker — `implementer` (Sonnet)**: well-scoped implementation tasks (components, pages, refactors). Delegate with a precise task spec; independent tasks go out in parallel (multiple Agent calls in one message).
- **Escalate to Opus** only for *very* complex tasks — cross-cutting architecture, subtle debugging, intricate motion choreography — by passing `model: "opus"` in the Agent call (the `implementer` definition defaults to Sonnet; the override wins).
- **Devil's advocate — `devils-advocate` (Opus, read-only)**: before committing to any significant plan, architecture, or design direction, spawn exactly **one** to attack it. Address or consciously reject its objections before proceeding. One per decision — never a panel.

## UI Workflow

- **Invoke `/impeccable craft` when building new UI parts** (new sections, pages, components, visual features). It reads `PRODUCT.md`/`DESIGN.md` and enforces the design system.
- **shadcn-first component policy**: use shadcn/ui components (`pnpm shadcn add <component>`) whenever one exists. Hand-roll only when shadcn genuinely has no equivalent — and then follow the `components/ui/button.tsx` pattern (cva variants, `data-slot`, Base UI primitives).
- **Animation stack** (per `DESIGN.md`'s restrained 2D motion system, install on first use):
  - **Motion** (`motion` package, the successor to Framer Motion) for choreographed entrances, scroll-driven reveals, and state transitions: staggered headline lines, blob-image scale-ins, gold ring draws, hover lifts. Use the single named easing (`--ease-grove`, `cubic-bezier(0.22, 1, 0.36, 1)`) and always pair with `useReducedMotion`/reduced-motion support.
  - `tw-animate-css` (already installed) for small micro-transitions where a full Motion component is overkill.
  - No true-3D register: no React Three Fiber, no WebGL. Depth and interest come from 2D soft-geometry, organic blob masks, thin gold rings/dots, radial glows, pill shapes, and big rounded section tops, per `DESIGN.md`.

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
- **Styling**: Tailwind CSS v4 — no `tailwind.config.*`; all configuration is CSS-based in `app/globals.css` (`@theme inline` + shadcn oklch design tokens in `:root`/`.dark`). Animation utilities come from `tw-animate-css`. Semantic tokens (`--primary` = Palm, `--secondary` = Piña Gold, the `--grove*` tokens = Evergreen structural sections) are the hook point for the Evergreen / Palm / Piña Gold palette from `DESIGN.md`.
- **Fonts**: **Instrument Serif** (display, weight 400 roman+italic, ≥ ~24px floor) drives all headings via `--font-serif`/`--font-heading`, and **Hanken Grotesk** (weights 300–700) is the body/UI workhorse via `--font-sans`. `Geist Mono`/`ui-monospace` remains for spec-sheet-style captions only, not a brand voice. Wired via `next/font` in `app/layout.tsx`, mapped to CSS variables in the `@theme` block of `app/globals.css`.
- **Path alias**: `@/*` maps to the repo root (see `tsconfig.json` and `components.json` aliases).

Note: this directory is not currently a git repository.
