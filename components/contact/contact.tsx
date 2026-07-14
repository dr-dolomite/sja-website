"use client";

import { Clock, Mail, MapPin, Phone } from "lucide-react";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

// Same transform-only rise + stagger contract as every other homepage section
// (core-values.tsx, admissions.tsx): hidden state never touches opacity, so
// the page is legible on the first server-rendered frame and Motion only
// slides the last 24px into place. Enhancement-Not-Gate.
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 24 },
  show: {
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Contact() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* Leaf-Tint ground (--muted), the light "breathing" register between
           the Coconut header and the Evergreen footer, per the Committed
           Green Rule's Coconut / Leaf-Tint / Evergreen alternation. Same top
           hairline + overflow-hidden treatment as core-values.tsx. */}
        <section
          aria-labelledby="contact-heading"
          className="relative overflow-hidden border-t border-border bg-muted text-foreground"
        >
          {/* Single decorative gold ring, restrained since this page is one
             section. Fine linework only, legal on a light ground. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-28 -right-40 size-[28rem] rounded-full border border-secondary/25 sm:size-[34rem]"
          />

          <div className="relative mx-auto w-full max-w-[88rem] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
            <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              {/* Left: heading, intro, details, CTA -------------------- */}
              <m.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                className="flex flex-col"
              >
                <m.p
                  variants={itemVariants}
                  className="text-[13px] font-semibold uppercase tracking-[0.22em] text-primary"
                >
                  Contact
                </m.p>
                <m.h2
                  id="contact-heading"
                  variants={itemVariants}
                  className="mt-5 max-w-[18ch] text-balance font-serif text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.06] tracking-[-0.005em] text-grove-deep"
                >
                  Visit us, or say hello.
                </m.h2>
                <m.p
                  variants={itemVariants}
                  className="mt-5 max-w-[48ch] text-pretty text-lg leading-[1.6] text-muted-foreground"
                >
                  Whether you are a prospective family or a Guardian with a
                  question, our registrar&rsquo;s office is glad to hear from
                  you, or to welcome you to campus in person.
                </m.p>

                <m.div
                  variants={containerVariants}
                  className="mt-10 grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2"
                >
                  {/* Visit */}
                  <m.div variants={itemVariants} className="flex flex-col gap-2">
                    <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-primary">
                      <MapPin aria-hidden="true" className="size-4 text-primary" />
                      Visit
                    </p>
                    <p className="text-[15.5px] leading-relaxed text-foreground">
                      {siteConfig.address.lines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                    <a
                      href={siteConfig.address.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex w-fit items-center text-[14px] font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Get directions
                    </a>
                  </m.div>

                  {/* Office hours */}
                  <m.div variants={itemVariants} className="flex flex-col gap-2">
                    <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-primary">
                      <Clock aria-hidden="true" className="size-4 text-primary" />
                      Office hours
                    </p>
                    <div className="flex flex-col gap-2">
                      {siteConfig.officeHours.map((slot) => (
                        <div key={slot.days} className="flex flex-col gap-0.5">
                          <span className="text-[15.5px] leading-relaxed text-foreground">
                            {slot.days}
                          </span>
                          {slot.periods.map((period) => (
                            <span
                              key={period.label}
                              className="text-[15.5px] leading-relaxed text-muted-foreground"
                            >
                              {period.label}: {period.hours}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </m.div>

                  {/* Call */}
                  <m.div variants={itemVariants} className="flex flex-col gap-2">
                    <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-primary">
                      <Phone aria-hidden="true" className="size-4 text-primary" />
                      Call
                    </p>
                    <a
                      href={siteConfig.phone.href}
                      className="text-[15.5px] leading-relaxed text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {siteConfig.phone.display}
                    </a>
                  </m.div>

                  {/* Email */}
                  <m.div variants={itemVariants} className="flex flex-col gap-2">
                    <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-primary">
                      <Mail aria-hidden="true" className="size-4 text-primary" />
                      Email
                    </p>
                    <a
                      href={siteConfig.email.href}
                      className="text-[15.5px] leading-relaxed [overflow-wrap:anywhere] text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {siteConfig.email.display}
                    </a>
                  </m.div>
                </m.div>

                <m.div variants={itemVariants} className="mt-10">
                  <Button
                    render={<a href={siteConfig.email.href} />}
                    nativeButton={false}
                    className="h-12 rounded-full px-8 text-base font-semibold"
                  >
                    Send an inquiry
                  </Button>
                </m.div>
              </m.div>

              {/* Right: map card ---------------------------------------- */}
              <m.div
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                className="relative overflow-hidden rounded-[28px] border border-border shadow-[0_20px_50px_-24px_rgba(14,61,43,0.28)]"
              >
                <iframe
                  src={siteConfig.address.mapEmbedSrc}
                  title={`Map to ${siteConfig.name}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="h-full min-h-[320px] w-full border-0 sm:min-h-[420px] lg:min-h-[460px]"
                  style={{ border: 0 }}
                />
                {/* Thin gold ring accent, overlapping the bottom-right
                   corner: decorative only, clear of the map controls. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-10 -right-10 size-32 rounded-full border border-secondary/40"
                />
              </m.div>
            </div>
          </div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
