# Coming Soon gate

While the full site is under construction, `proxy.ts` gates every route behind
a branded splash at `/coming-soon` (`components/coming-soon/coming-soon.tsx`).
The public sees only the splash; the team can preview the real work-in-progress
site through a bypass.

## How the gate works

- **Fail-closed by design.** In production the gate is ON unless explicitly
  turned off. A missing or misspelled env var keeps the gate active, it never
  accidentally exposes the unfinished site (with its placeholder contact info)
  to the public.
- **Local dev is never gated.** `next dev` runs with `NODE_ENV=development`, so
  `pnpm dev` always shows the real site. To rehearse the gated behavior locally,
  run a production build with `COMING_SOON=true`.
- **Crawlers are kept out.** The splash page sets `robots: { index: false,
  follow: false }` and the gate adds an `X-Robots-Tag: noindex` header on every
  gated response. `app/robots.ts` also serves a disallow-all robots.txt while
  gated.
- **Team bypass.** Visiting any URL with `?preview=<token>` sets an httpOnly
  cookie and lets that browser through to the real WIP site for 30 days.
  `?preview=off` clears it. The bypass only works if a token is configured; an
  empty/unset token disables it entirely.

## Environment variables (set in Vercel, not committed)

See `.env.example` for the full description of each variable. In short:

- `COMING_SOON` — set to `false` (exact string) to lift the gate at launch.
  Unset or any other value keeps the gate on.
- `COMING_SOON_BYPASS` — a long random secret string used for the `?preview=`
  bypass. Rotate it if it's ever shared outside the team.

## Launching the real site

1. In Vercel, go to Project Settings, Environment Variables.
2. Set `COMING_SOON` to `false` for Production.
3. Redeploy. The gate lifts immediately and the real site is served at the
   custom domain.
4. Before this step, make sure the placeholder contact details in
   `lib/site-config.ts` (phone, email, address, office hours) have been
   replaced with the school's real information, see the `PLACEHOLDER` /
   `TODO` comments in that file.

## Custom domain (Vercel + Cloudflare DNS)

The production domain (`sjamalinao.edu.ph`) uses Cloudflare as its DNS
nameserver (delegated from the registrar, PHNET), with Vercel as the host.

- Vercel's Domains page issues a CNAME target for both the apex (`@`) and
  `www` records once the domain is added there. Copy those exact values from
  Vercel; they're generated per-project and change if the domain is removed
  and re-added.
- Both records are added in Cloudflare as **CNAME**, proxy status **DNS
  only** (grey cloud), TTL Auto.
  - Proxying (orange cloud) must stay off: Vercel needs a direct connection to
    verify the domain and issue its own TLS certificate. A Cloudflare proxy in
    front of that breaks certificate issuance.
- The apex domain 308-redirects to `www`, which is the canonical URL (set via
  Vercel's "Redirect apex domains to www" option). This avoids splitting SEO
  authority between the two once the real site is live.
- DNS changes can take minutes up to about an hour to propagate. A first
  attempt at certificate generation can transiently fail right after adding a
  record; Vercel retries automatically, click **Refresh** on the domain row to
  prompt an earlier retry.
- If the school's email (`@sjamalinao.edu.ph`) is hosted elsewhere, confirm its
  MX records exist in Cloudflare too. Delegating DNS to Cloudflare only works
  if every previously-relied-upon record (not just the web ones) is recreated
  there.
