"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";

import { cn } from "@/lib/utils";
import { AFFILIATION_MARKS } from "@/lib/affiliations";
import { FOOTER_NAV, siteConfig } from "@/lib/site-config";

// Same transform-only reveal system as hero.tsx / guardian-story.tsx: the
// hidden state only shifts the element (no opacity), so the whole footer is
// server-rendered legible on first frame and Motion only slides it home. The
// footer is the page's landing pad of trust, so it must never gate blank.
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { delayChildren: 0.04, staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20 },
  show: {
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

// Brand-neutral Facebook glyph. lucide dropped its social brand icons, so this
// is inlined rather than imported — one deliberate mark, sized to match the
// lucide icons around it.
function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22c4.78-.76 8.43-4.92 8.43-9.94Z" />
    </svg>
  );
}

const SOCIAL_GLYPHS: Record<
  string,
  ({ className }: { className?: string }) => React.ReactElement
> = {
  facebook: FacebookGlyph,
};

export function SiteFooter() {
  const year = 2026;

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* Committed Green as a full Evergreen structural section: the footer is
           one of the design's encouraged full-bleed green grounds. grove-deep
           (Evergreen, ~0.33 L) carries light copy well past AA, and grounds the
           long Coconut-canvas scroll above it. */}
        <footer className="bg-grove-deep text-grove-foreground">
          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            className="mx-auto w-full max-w-[88rem] px-4 py-16 sm:px-6 sm:py-20 lg:px-4"
          >
            {/* Top: brand + three columns of destinations and contact. */}
            <div className="flex flex-col gap-12 lg:grid lg:grid-cols-12 lg:gap-8">
              {/* Brand block */}
              <m.div
                variants={itemVariants}
                className="flex flex-col gap-5 lg:col-span-4"
              >
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grove-foreground/70"
                >
                  <Image
                    src="/sja-school-logo.png"
                    alt=""
                    width={48}
                    height={48}
                    className="h-12 w-12 shrink-0"
                  />
                  <span className="flex flex-col leading-tight">
                    <span className="text-base font-semibold tracking-tight">
                      {siteConfig.shortName}
                    </span>
                    <span className="text-sm text-grove-foreground/70">
                      of Malinao, Inc.
                    </span>
                  </span>
                </Link>
                <p className="max-w-[42ch] text-pretty text-sm leading-relaxed text-grove-foreground/80">
                  {siteConfig.tagline}
                </p>
                {/* Socials */}
                <div className="flex items-center gap-2 pt-1">
                  {siteConfig.socials.map((social) => {
                    const Glyph = SOCIAL_GLYPHS[social.key];
                    return (
                      <a
                        key={social.key}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${siteConfig.shortName} on ${social.label}`}
                        className="flex size-10 items-center justify-center rounded-full bg-grove-foreground/10 text-grove-foreground transition-colors hover:bg-grove-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grove-foreground/70"
                      >
                        {Glyph ? <Glyph className="size-5" /> : social.label}
                      </a>
                    );
                  })}
                </div>
              </m.div>

              {/* Explore nav */}
              <m.nav
                variants={itemVariants}
                aria-label="Footer"
                className="flex flex-col gap-4 lg:col-span-2"
              >
                <h2 className="text-sm font-semibold tracking-wide text-grove-foreground">
                  Explore
                </h2>
                <ul className="flex flex-col gap-3">
                  {FOOTER_NAV.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-grove-foreground/80 transition-colors hover:text-grove-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grove-foreground/70"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </m.nav>

              {/* Visit / contact */}
              <m.div
                variants={itemVariants}
                className="flex flex-col gap-4 lg:col-span-3"
              >
                <h2 className="text-sm font-semibold tracking-wide text-grove-foreground">
                  Visit us
                </h2>
                <address className="flex flex-col gap-3 text-sm not-italic text-grove-foreground/80">
                  <span className="flex items-start gap-3">
                    <MapPin
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-grove-foreground/60"
                    />
                    <span className="flex flex-col gap-0.5">
                      {siteConfig.address.lines.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                      <a
                        href={siteConfig.address.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex w-fit items-center gap-1 font-medium text-grove-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grove-foreground/70"
                      >
                        Get directions
                        <ArrowUpRight className="size-3.5" />
                      </a>
                    </span>
                  </span>
                  <a
                    href={siteConfig.phone.href}
                    className="flex items-center gap-3 text-grove-foreground/80 transition-colors hover:text-grove-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grove-foreground/70"
                  >
                    <Phone
                      aria-hidden="true"
                      className="size-4 shrink-0 text-grove-foreground/60"
                    />
                    {siteConfig.phone.display}
                  </a>
                  <a
                    href={siteConfig.email.href}
                    className="flex items-center gap-3 [overflow-wrap:anywhere] text-grove-foreground/80 transition-colors hover:text-grove-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grove-foreground/70"
                  >
                    <Mail
                      aria-hidden="true"
                      className="size-4 shrink-0 text-grove-foreground/60"
                    />
                    {siteConfig.email.display}
                  </a>
                </address>
              </m.div>

              {/* Office hours */}
              <m.div
                variants={itemVariants}
                className="flex flex-col gap-4 lg:col-span-3"
              >
                <h2 className="text-sm font-semibold tracking-wide text-grove-foreground">
                  Office hours
                </h2>
                <ul className="flex flex-col gap-3 text-sm text-grove-foreground/80">
                  {siteConfig.officeHours.map((slot) => (
                    <li key={slot.days} className="flex items-start gap-3">
                      <Clock
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-grove-foreground/60"
                      />
                      <span className="flex flex-col gap-0.5">
                        <span className="text-grove-foreground">{slot.days}</span>
                        <span>{slot.hours}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </m.div>
            </div>

            {/* Accreditations — the same white chips as the hero trust-bar, so
               the official crests keep their real color and dignity on the green
               ground instead of becoming flat silhouettes. Static here (no
               drift); the footer is a resting place, not a moving band. */}
            <m.div
              variants={itemVariants}
              className="mt-14 flex flex-col gap-4 border-t border-grove-foreground/15 pt-10"
            >
              <h2 className="text-sm font-semibold tracking-wide text-grove-foreground/90">
                Accredited &amp; affiliated
              </h2>
              <ul className="flex flex-wrap items-center gap-3">
                {AFFILIATION_MARKS.map((mark) => (
                  <li key={mark.key}>
                    <div
                      className={cn(
                        "flex items-center justify-center rounded-xl border border-border bg-card",
                        mark.emblem ? "px-3 py-1.5" : "px-4 py-2.5"
                      )}
                    >
                      <Image
                        src={mark.image}
                        alt={mark.label}
                        width={mark.width}
                        height={mark.height}
                        className={cn(
                          "w-auto shrink-0 object-contain",
                          mark.emblem ? "h-8 sm:h-9" : "h-6 sm:h-7"
                        )}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </m.div>

            {/* Bottom bar */}
            <m.div
              variants={itemVariants}
              className="mt-12 flex flex-col gap-2 border-t border-grove-foreground/15 pt-8 text-sm text-grove-foreground/70 sm:flex-row sm:items-center sm:justify-between"
            >
              <p>
                &copy; {year} {siteConfig.name} All rights reserved.
              </p>
              <p>Founded {siteConfig.foundedYear}, Diocese of Kalibo</p>
            </m.div>
          </m.div>
        </footer>
      </MotionConfig>
    </LazyMotion>
  );
}
