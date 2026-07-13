import { NextResponse, type NextRequest } from "next/server";

// ─────────────────────────────────────────────────────────────────────────
//  Coming-Soon gate  (Next 16 "proxy" convention, formerly "middleware")
//
//  While the full site is under construction, this serves a single branded
//  splash (`/coming-soon`) to the public and lets the team preview the real
//  work-in-progress behind a secret bypass.
//
//  FAIL-CLOSED BY DESIGN. In production the gate is ON unless it is EXPLICITLY
//  turned off with `COMING_SOON=false`. A missing or misspelled variable keeps
//  the site gated (safe); it never accidentally exposes the unfinished site
//  with its placeholder contact info. Launch is the one deliberate action of
//  setting `COMING_SOON=false` in the Vercel environment.
//
//  Local `next dev` runs with NODE_ENV="development", so the gate is inert and
//  you always work against the full site. Set `COMING_SOON=true` locally (with
//  a production build) to rehearse the real gated behavior.
//
//  Team bypass: visit any URL with `?preview=<COMING_SOON_BYPASS>` to set an
//  httpOnly cookie and browse the WIP site normally; `?preview=off` clears it.
//  The bypass is refused unless COMING_SOON_BYPASS is a non-empty value, so a
//  blank token can never become a skeleton key.
// ─────────────────────────────────────────────────────────────────────────

const SPLASH_PATH = "/coming-soon";
const BYPASS_COOKIE = "sja-preview";
const NOINDEX = "noindex, nofollow";
// 30 days: long enough that the team is not re-authorizing every session.
const BYPASS_MAX_AGE = 60 * 60 * 24 * 30;

function isGated(): boolean {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.COMING_SOON !== "false"
  );
}

export function proxy(req: NextRequest) {
  if (!isGated()) return NextResponse.next();

  const token = process.env.COMING_SOON_BYPASS;
  const url = req.nextUrl;
  const preview = url.searchParams.get("preview");

  // ── Bypass toggle via query param ──────────────────────────────────────
  // Strip the token from the URL after acting on it (redirect to the clean
  // path) so it does not linger in the address bar or get shared by accident.
  if (token && preview !== null) {
    const clean = url.clone();
    clean.searchParams.delete("preview");
    const res = NextResponse.redirect(clean);
    if (preview === token) {
      res.cookies.set(BYPASS_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: BYPASS_MAX_AGE,
      });
    } else if (preview === "off") {
      res.cookies.delete(BYPASS_COOKIE);
    }
    return res;
  }

  // ── Valid bypass cookie: let the team through to the real WIP site ──────
  if (token && req.cookies.get(BYPASS_COOKIE)?.value === token) {
    return NextResponse.next();
  }

  // ── Already on the splash: serve it, but keep crawlers off it ───────────
  if (url.pathname === SPLASH_PATH) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", NOINDEX);
    return res;
  }

  // ── Gate everything else: rewrite (200, URL preserved) to the splash ────
  const rewriteUrl = url.clone();
  rewriteUrl.pathname = SPLASH_PATH;
  rewriteUrl.search = "";
  const res = NextResponse.rewrite(rewriteUrl);
  res.headers.set("X-Robots-Tag", NOINDEX);
  return res;
}

export const config = {
  // Run on everything EXCEPT Next internals, the API, and static/metadata
  // assets. Excluding files with an extension (and the metadata routes by name)
  // keeps images, the crest, robots.txt, and any future OG image reachable so
  // neither the splash nor its own social preview is ever swallowed by the gate.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|opengraph-image|.*\\.[\\w]+$).*)",
  ],
};
