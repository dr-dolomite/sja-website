# Architecture & Infrastructure

The stack behind the St. Joseph's Academy of Malinao website, as built so far.
One domain (`sjamalinao.edu.ph`) fans out to four independent services, all
wired through a single DNS control plane (Cloudflare).

## The one-paragraph version

The domain `sjamalinao.edu.ph` is **registered through PHNET** but has its
**DNS delegated to Cloudflare** (Cloudflare is the authoritative nameserver).
Cloudflare then directs traffic to four places: the **website** is hosted on
**Vercel**, the school's **mailboxes** (`info@`, `registrar@`) live in **Google
Workspace** (Education edition), the contact form sends **transactional email**
through **Resend** on a dedicated `send.` subdomain, and bot protection on that
form is handled by **Cloudflare Turnstile**. Nothing talks to the registrar
(PHNET) day to day; all record changes happen in Cloudflare.

## Service map

```
                          Registrar: PHNET
                    (owns sjamalinao.edu.ph, delegates
                     nameservers -> Cloudflare)
                                 │
                                 ▼
                    ┌────────────────────────────┐
                    │   Cloudflare (DNS control)   │
                    │   authoritative nameserver   │
                    └────────────────────────────┘
             ┌───────────────┬───────────────┬───────────────┐
             │               │               │               │
   CNAME @ / www        MX + TXT         send.sjamalinao   challenges.
   (DNS-only)           (SPF/DKIM/       .edu.ph           cloudflare.com
             │           DMARC)          MX + TXT               │
             ▼               ▼               ▼                  ▼
        ┌─────────┐   ┌──────────────┐  ┌──────────┐    ┌──────────────┐
        │ Vercel  │   │ Google        │  │ Resend    │    │ Turnstile     │
        │ (host)  │   │ Workspace     │  │ (form mail │    │ (bot verify)  │
        │         │   │ (mailboxes)   │  │  only)    │    │               │
        └─────────┘   └──────────────┘  └──────────┘    └──────────────┘
        Next.js 16    info@, registrar@  contact@send.…   siteverify on
        React 19 app  human inboxes      -> staff inbox    /api/contact
```

## Roles, one by one

### Domain & registrar — PHNET
- `sjamalinao.edu.ph` is registered through **PHNET** (the `.edu.ph` registry
  operator in the Philippines).
- PHNET's only ongoing role is holding the registration and the **nameserver
  (NS) delegation**. The NS records point at Cloudflare. Because of that, the
  registrar UI is *not* where records are edited: Cloudflare is.

### DNS — Cloudflare
- **Authoritative nameserver** for the domain. Every record the domain relies
  on must exist here, not just the web ones. Delegating DNS to Cloudflare means
  any record that used to live at the previous DNS host (mail MX, verification
  TXT) has to be recreated in Cloudflare or it vanishes.
- Also provides **Turnstile** (see below). Note Cloudflare is used purely as a
  DNS provider for the web records: the site is **not** proxied through
  Cloudflare's CDN.

### Web hosting — Vercel
- Hosts the Next.js app. Production domain is served here.
- Wiring (see `docs/coming-soon.md` for the full runbook):
  - Apex (`@`) and `www` are both **CNAME** records to the per-project Vercel
    target. Cloudflare flattens the apex CNAME to an A record on the wire, so it
    coexists with the Google Workspace MX records; `www` is a plain CNAME.
  - Both records are **DNS only (grey cloud)** in Cloudflare, and must stay that
    way. Proxying (orange cloud) breaks Vercel's TLS renewal — silently, weeks
    later, at cert expiry. See `docs/coming-soon.md` for the full hardening
    checklist (Full-strict SSL, change notifications, the DNS-only check).
  - Apex 308-redirects to `www` (canonical), set via Vercel's "Redirect apex
    domains to www."
- Vercel is also where the runtime **environment variables** live (see below),
  including the `COMING_SOON` launch switch.

### Mailboxes — Google Workspace (Education)
- The school's real, human-read inboxes are Google Workspace (Education
  edition) accounts:
  - `info@sjamalinao.edu.ph` — general inquiries
  - `registrar@sjamalinao.edu.ph` — admissions
- These are the addresses shown to families in `lib/site-config.ts` and are
  where the contact form's notifications land.
- DNS impact: Cloudflare must carry Google Workspace's **MX** records plus the
  **SPF / DKIM / DMARC** TXT records for the root domain so Workspace mail sends
  and receives normally.

### Transactional email — Resend
- The `/contact` form does **not** send from Workspace. `app/api/contact/route.ts`
  sends through **Resend** so form submissions are delivered reliably as
  transactional mail.
- Sender identity lives on a dedicated subdomain: **`send.sjamalinao.edu.ph`**,
  verified in Resend. The From is `contact@send.sjamalinao.edu.ph`.
  - **Why a subdomain:** it isolates automated form-mail sending reputation from
    the school's human Workspace mail, and eases Google's self-domain spam
    heuristic (mail "from" the school arriving at the school's own inbox).
  - Families never see this address — the staff notification goes to `info@` or
    `registrar@`, and `replyTo` is set to the visitor's own email so a reply
    reaches the family directly.
- Delivery routing in the route handler:
  - Inquiry type **Admissions** → `registrar@sjamalinao.edu.ph`
  - Everything else → `info@sjamalinao.edu.ph`
  - Optional BCC archive (`CONTACT_ARCHIVE_EMAIL`) so no inquiry is lost.
- DNS impact: Cloudflare carries Resend's verification records (SPF/DKIM, and a
  return-path MX) **scoped to the `send.` subdomain** — separate from the
  Workspace records on the root domain, so the two mail systems don't collide.

### Bot protection — Cloudflare Turnstile
- The contact form is guarded by **Turnstile**. The client renders the widget
  (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`); the route verifies the token server-side
  against `challenges.cloudflare.com/turnstile/v0/siteverify` using
  `TURNSTILE_SECRET_KEY` before it will call Resend.
- A honeypot field (`botcheck`) provides a second, silent layer.

## Application layer (Vercel-hosted)

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript, deployed on
  Vercel. pnpm is the package manager.
- **Contact pipeline:** `components/contact/contact-form.tsx` (client) →
  `POST /api/contact` (`app/api/contact/route.ts`, Node runtime) → Turnstile
  verify → Resend send → Workspace inbox.
- **Coming-Soon gate:** `proxy.ts` (Next 16 proxy/middleware convention)
  fail-closed gates the whole site behind `/coming-soon` until `COMING_SOON` is
  explicitly set to `false` in Vercel. Full runbook in `docs/coming-soon.md`.
- **Single source of truth for contact facts:** `lib/site-config.ts` (address,
  phone, office hours, the two email inboxes). The footer and `/contact` both
  read from it.

## Environment variables (set in Vercel, never committed)

Read `.env.example` for the authoritative descriptions. Summary:

| Variable | Service | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Resend | Server-side send auth for the contact form. |
| `CONTACT_FROM_EMAIL` | Resend | Verified From on `send.sjamalinao.edu.ph`. |
| `CONTACT_ARCHIVE_EMAIL` | Resend | Optional BCC archive inbox. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile | Public client widget key. |
| `TURNSTILE_SECRET_KEY` | Turnstile | Server-side token verification. |
| `COMING_SOON` | Vercel | Launch switch; `false` lifts the gate. |
| `COMING_SOON_BYPASS` | Vercel | Secret token for team preview of the WIP site. |

## Why the split matters (design intent)

- **One domain, four independent failure domains.** The website going down
  doesn't affect mail; a Resend outage doesn't affect Workspace inboxes;
  rotating a Turnstile key touches nothing else.
- **Reputation isolation.** Automated form mail (Resend, `send.` subdomain) and
  human mail (Workspace, root domain) never share a sending reputation.
- **Cloudflare as the single DNS choke point.** Because PHNET delegates to
  Cloudflare, every change — a new record, a mail migration, a host swap — is
  made in one place, with one caveat that recurs everywhere in this doc: the
  web records stay **DNS-only**, and no record class may be forgotten when the
  domain relies on it.

## Where to go next

- `docs/coming-soon.md` — the launch gate + full custom-domain (Vercel +
  Cloudflare) DNS runbook.
- `.env.example` — every environment variable, described in place.
- `lib/site-config.ts` — the school's confirmed public contact facts.
- `app/api/contact/route.ts` — the Turnstile → Resend request path.
