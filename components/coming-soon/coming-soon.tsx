"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { AFFILIATION_MARKS } from "@/lib/affiliations";
import heroMain from "../../public/images/hero/sja-new.jpg";

// The core values, rendered as light labels separated by decorative gold dots
// on the evergreen panel (gold-on-evergreen is legal; the words carry meaning,
// the dots are ornament, so this never leans on color alone).
const VALUES = ["Selfless", "Just", "Achiever"] as const;

// The seed Facebook href in site-config is still the bare facebook.com root
// (a PLACEHOLDER). We must not ship a prominent CTA that dumps visitors on
// Facebook's homepage, so the gold pill only renders once a REAL page URL is
// set; until then the follow line degrades to plain, non-clickable copy.
const facebook = siteConfig.socials.find((s) => s.key === "facebook");
function isRealFacebookPage(href: string | undefined): href is string {
  if (!href) return false;
  try {
    const url = new URL(href);
    if (!/facebook\.com$/i.test(url.hostname.replace(/^www\./, ""))) {
      return false;
    }
    // A real page has a path segment (/SJAMalinao); the bare root does not.
    return url.pathname.replace(/\/+$/, "").length > 0;
  } catch {
    return false;
  }
}
const facebookHref = isRealFacebookPage(facebook?.href) ? facebook.href : null;

// Transform-only rise (no opacity in `hidden`): the copy paints at full opacity
// on the first server-rendered frame and Motion only slides it home, so the
// page is legible instantly on a slow connection. Reduced motion snaps it flat
// via the MotionConfig below. Mirrors the hero's entrance language.
const container: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 0.06, staggerChildren: 0.08 } },
};

const rise: Variants = {
  hidden: { y: 20 },
  show: { y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// The evergreen panel and the photo "grow" into place, a scale distinct from
// the copy's rise so the load reads as choreography, not one uniform fade.
// Opacity stays 1 throughout.
const grow: Variants = {
  hidden: { scale: 0.97, y: 12 },
  show: {
    scale: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

// The gold ring is pure decoration (Soft-Geometry, not a trust signal), so it
// is the one element allowed an opacity fade: a "ring draw" lagging a beat
// behind the photo. Snapped visible under reduced motion.
const ring: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

export function ComingSoon() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* overflow-hidden clips the radial glows so they never force a
           horizontal scrollbar at any width. min-h-dvh keeps the splash a
           single, self-contained fold on mobile and desktop alike. */}
        <main className="relative flex min-h-dvh flex-col overflow-hidden bg-background text-foreground">
          {/* Atmospheric Palm + gold glows on the coconut canvas, barely-there,
             never a loud gradient (Soft-Geometry). */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 -left-40 size-[42rem] rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklch, var(--primary) 12%, transparent) 0%, transparent 66%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -bottom-40 size-[34rem] rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklch, var(--secondary) 10%, transparent) 0%, transparent 68%)",
            }}
          />

          {/* ─────────── Identity ─────────── */}
          <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center gap-3 px-6 py-7 sm:px-8">
            <Image
              src="/sja-school-logo.png"
              alt="St. Joseph's Academy of Malinao crest"
              width={48}
              height={48}
              priority
              className="h-11 w-11 shrink-0"
            />
            <span className="grid gap-0 leading-tight">
              <span className="text-base font-semibold tracking-tight sm:text-lg">
                St. Joseph&rsquo;s Academy
              </span>
              <span className="text-xs text-muted-foreground sm:text-sm">
                of Malinao, Inc.
              </span>
            </span>
          </header>

          {/* ─────────── The evergreen panel on coconut ─────────── */}
          <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center px-6 pb-10 sm:px-8">
            <m.section
              variants={grow}
              initial="hidden"
              animate="show"
              aria-labelledby="coming-soon-heading"
              className="relative w-full overflow-hidden rounded-[2rem] bg-grove-deep px-6 py-12 shadow-[0_40px_90px_-40px_rgba(14,61,43,0.55)] sm:rounded-[2.75rem] sm:px-10 sm:py-14 lg:grid lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-14 lg:px-16 lg:py-16"
            >
              {/* A soft interior gold glow lifts the panel from a flat block. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-16 size-[26rem] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, color-mix(in oklch, var(--secondary) 14%, transparent) 0%, transparent 70%)",
                }}
              />

              {/* LEFT: copy */}
              <m.div
                variants={container}
                initial="hidden"
                animate="show"
                className="relative z-10"
              >
                {/* Eyebrow: gold text is legal on evergreen (5.09:1); the thin
                   gold rule is decorative linework. No interpunct separator. */}
                <m.p
                  variants={rise}
                  className="flex items-center gap-3 text-xs font-semibold tracking-[0.22em] text-secondary uppercase"
                >
                  <span
                    aria-hidden="true"
                    className="h-[2px] w-7 shrink-0 bg-secondary/70"
                  />
                  Opening soon
                </m.p>

                {/* Instrument Serif display, weight 400 only. The italic
                   emphasis on evergreen switches to gold (Palm would fail
                   contrast here), per the DESIGN.md ground-keyed law. */}
                <m.h1
                  id="coming-soon-heading"
                  variants={rise}
                  className="mt-6 font-serif text-[clamp(2.25rem,5.4vw,4.25rem)] leading-[1.05] font-normal tracking-[-0.01em] text-balance text-grove-foreground"
                >
                  A new home for our Guardians is{" "}
                  <em className="text-secondary italic">taking root</em>.
                </m.h1>

                <m.p
                  variants={rise}
                  className="mt-6 max-w-[46ch] text-lg leading-[1.65] text-pretty text-grove-foreground/80"
                >
                  We&rsquo;re carefully growing a warmer, fuller window into life
                  at St. Joseph&rsquo;s Academy of Malinao: a Diocesan Catholic
                  school forming Guardians in faith and character since 1947. It
                  opens soon.
                </m.p>

                {/* Motto: serif italic, kept at or above the display floor and
                   set in gold on evergreen (both rules satisfied). */}
                <m.p
                  variants={rise}
                  className="mt-8 font-serif text-2xl leading-tight font-normal text-secondary italic"
                >
                  &ldquo;Be like St. Joseph.&rdquo;
                </m.p>

                {/* Values: light labels, decorative gold dot separators. */}
                <m.ul
                  variants={rise}
                  className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2"
                >
                  {VALUES.map((value, i) => (
                    <li key={value} className="flex items-center gap-4">
                      {i > 0 ? (
                        <span
                          aria-hidden="true"
                          className="size-[5px] shrink-0 rounded-full bg-secondary"
                        />
                      ) : null}
                      <span className="text-[13px] font-semibold tracking-[0.22em] text-grove-foreground uppercase">
                        {value}
                      </span>
                    </li>
                  ))}
                </m.ul>

                {/* Follow path. The one gold pill CTA (legal on evergreen) is
                   shown ONLY when a real Facebook page URL exists; otherwise a
                   plain, honest line, never a live button to a dead link. */}
                <m.div variants={rise} className="mt-9">
                  {facebookHref ? (
                    <a
                      href={facebookHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex h-[52px] items-center gap-2 rounded-full bg-secondary px-7 text-base font-semibold text-secondary-foreground shadow-lg shadow-[rgba(0,0,0,0.25)] transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 hover:bg-[color-mix(in_oklch,var(--secondary),#000_8%)] hover:shadow-xl focus-visible:ring-3 focus-visible:ring-secondary/50 focus-visible:outline-none"
                    >
                      Follow us on Facebook
                      <ArrowUpRight className="size-4 transition-transform duration-300 ease-[var(--ease-grove)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  ) : (
                    <p className="text-base text-grove-foreground/75">
                      Follow our Facebook page for updates. We&rsquo;ll share the
                      link here as launch approaches.
                    </p>
                  )}
                </m.div>
              </m.div>

              {/* RIGHT: Guardian photo in a full circle with a gold orbit ring. */}
              <m.div
                variants={grow}
                initial="hidden"
                animate="show"
                className="relative z-10 mx-auto mt-12 aspect-square w-full max-w-[360px] lg:mt-0 lg:-translate-x-6"
              >
                <div className="absolute inset-0 overflow-hidden rounded-full shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">
                  <Image
                    src={heroMain}
                    alt="Guardians of St. Joseph's Academy of Malinao in their green-and-white uniforms."
                    fill
                    placeholder="blur"
                    priority
                    sizes="(min-width:1024px) 34vw, 80vw"
                    className="object-cover"
                    style={{ objectPosition: "62% 22%" }}
                  />
                </div>
                {/* Gold ring orbits just outside the circle, decorative linework. */}
                <m.div
                  variants={ring}
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-[2.5%] rounded-full border-[1.5px] border-secondary/70"
                />
              </m.div>
            </m.section>
          </div>

          {/* ─────────── Accreditation logo strip ─────────── */}
          {/* The official crests and wordmarks sit on bordered Coconut chips so
             each keeps its true color and dignity on the canvas (the coat of
             arms leads, per the source order in lib/affiliations.ts). */}
          <footer className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-9 sm:px-8">
            <ul
              aria-label="Accreditations and affiliations"
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
            >
              {AFFILIATION_MARKS.map((mark) => (
                <li
                  key={mark.key}
                  className={cn(
                    "flex items-center justify-center rounded-xl border border-border bg-card",
                    mark.emblem ? "px-2.5 py-1" : "px-3 py-1.5"
                  )}
                >
                  <Image
                    src={mark.image}
                    alt={mark.label}
                    width={mark.width}
                    height={mark.height}
                    className={cn(
                      "w-auto object-contain",
                      mark.emblem ? "h-7 sm:h-8" : "h-5 sm:h-6"
                    )}
                  />
                </li>
              ))}
            </ul>
          </footer>
        </main>
      </MotionConfig>
    </LazyMotion>
  );
}
