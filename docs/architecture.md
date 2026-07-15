# Architecture & Infrastructure

The stack behind the St. Joseph's Academy of Malinao website, as built so far.
One domain (`sjamalinao.edu.ph`) fans out to four independent services, all
wired through a single DNS control plane (Cloudflare).

## The one-paragraph version

The domain `sjamalinao.edu.ph` is **registered through PHNET** but has its
**DNS delegated to Cloudflare** (Cloudflare is the authoritative nameserver).
Cloudflare then directs traffic to three places: the **website** is hosted on
**Vercel**, the school's **mailboxes** (`info@`, `registrar@`) live in **Google
Workspace** (Education edition), and bot protection on the contact form is
handled by **Cloudflare Turnstile**. The contact form sends its notification
through that same **Google Workspace** over authenticated SMTP (no separate
sending service). Nothing talks to the registrar (PHNET) day to day; all record
changes happen in Cloudflare.

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
             ┌───────────────────┬───────────────────┐
             │                   │                   │
   CNAME @ / www            MX + TXT            challenges.
   (DNS-only)               (SPF/DKIM/DMARC)    cloudflare.com
             │                   │                   │
             ▼                   ▼                   ▼
        ┌─────────┐     ┌──────────────────┐   ┌──────────────┐
        │ Vercel  │     │ Google Workspace  │   │ Turnstile     │
        │ (host)  │     │ mailboxes + SMTP  │   │ (bot verify)  │
        │         │     │ send for the form │   │               │
        └─────────┘     └──────────────────┘   └──────────────┘
        Next.js 16      info@, registrar@       siteverify on
        React 19 app    + web@ sends via SMTP   /api/contact
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

### Transactional email — Google Workspace SMTP
- The `/contact` form sends its notification through the school's **own Google
  Workspace** over authenticated SMTP (`app/api/contact/route.ts` uses
  Nodemailer against `smtp.gmail.com`). No separate sending service: the mail
  goes school → school, so it is DKIM/SPF-aligned on the root domain and
  delivered internally.
- **Sender mailbox:** a dedicated, low-privilege Workspace account (e.g.
  `web@sjamalinao.edu.ph`) authenticated with a **Google App Password**. Google
  rewrites the From header to this authenticated mailbox, so the code sets the
  From address to `SMTP_USER` and only the display name is configurable
  (`CONTACT_FROM_NAME`). Families never see it: `replyTo` is the visitor's own
  email, so a reply reaches the family directly.
- Delivery routing in the route handler:
  - Inquiry type **Admissions** → `registrar@sjamalinao.edu.ph`
  - Everything else → `info@sjamalinao.edu.ph`
  - Optional BCC archive (`CONTACT_ARCHIVE_EMAIL`) so no inquiry is lost.
- **Trade-off (deliberate):** this folds form-mail into the human-mail tenant
  rather than isolating it on a separate service, and the App Password is a
  broader credential than a send-scoped API key. Both are accepted consciously
  in exchange for removing the third-party dependency and its send quota; the
  dedicated low-privilege mailbox bounds the blast radius. Sending volume is a
  handful of messages a day, well within Workspace limits (~2,000/day).
- DNS impact: none beyond the Workspace **MX + SPF/DKIM/DMARC** records the root
  domain already carries. (Any leftover Resend `send.` subdomain records are now
  unused and can be removed.)

### Bot protection — Cloudflare Turnstile
- The contact form is guarded by **Turnstile**. The client renders the widget
  (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`); the route verifies the token server-side
  against `challenges.cloudflare.com/turnstile/v0/siteverify` using
  `TURNSTILE_SECRET_KEY` before it will send the email.
- A honeypot field (`botcheck`) provides a second, silent layer.

## Application layer (Vercel-hosted)

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript, deployed on
  Vercel. pnpm is the package manager.
- **Contact pipeline:** `components/contact/contact-form.tsx` (client) →
  `POST /api/contact` (`app/api/contact/route.ts`, Node runtime) → Turnstile
  verify → Workspace SMTP send → Workspace inbox.
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
| `SMTP_HOST` | Workspace | SMTP host (default `smtp.gmail.com`). |
| `SMTP_PORT` | Workspace | SMTP port (default `465`, implicit TLS). |
| `SMTP_USER` | Workspace | Dedicated sender mailbox, e.g. `web@sjamalinao.edu.ph`. |
| `SMTP_PASS` | Workspace | Google App Password for that mailbox. |
| `CONTACT_FROM_NAME` | Workspace | Display name on the From (address is `SMTP_USER`). |
| `CONTACT_ARCHIVE_EMAIL` | Workspace | Optional BCC archive inbox. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile | Public client widget key. |
| `TURNSTILE_SECRET_KEY` | Turnstile | Server-side token verification. |
| `COMING_SOON` | Vercel | Launch switch; `false` lifts the gate. |
| `COMING_SOON_BYPASS` | Vercel | Secret token for team preview of the WIP site. |

## Why the split matters (design intent)

- **One domain, mostly independent failure domains.** The website going down
  doesn't affect mail; rotating a Turnstile key touches nothing else. The form's
  notification now rides on Workspace itself, so it shares fate with the school
  mailboxes (a conscious trade for dropping the third-party sender).
- **Deliverability via alignment, not isolation.** Form mail is sent, DKIM/SPF
  signed, and received all within the school's own Workspace tenant, so it lands
  internally without an external sender's reputation to warm. The earlier
  `send.` subdomain isolation was retired with Resend; see the Transactional
  email section for the trade-off.
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
- `app/api/contact/route.ts` — the Turnstile → Workspace SMTP request path.
