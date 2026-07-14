"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";

import { Button } from "@/components/ui/button";

// Same transform-only rise + stagger contract as hero.tsx, core-values.tsx,
// vision-mission.tsx, life-of-guardians.tsx, and offerings.tsx, so every
// entrance across the homepage reads as one system. Hidden state never touches
// opacity: content paints at full opacity on the first (server-rendered) frame
// and only slides the last 24px into place. Enhancement-Not-Gate: the section
// is legible before Motion ever runs.
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

// The enrollment path, three steps and one visit. Gold serif numerals on the
// evergreen ground (01/02/03 at #DDAF3C = 5.97:1, legal per DESIGN.md Section 2),
// the exact "serif step numerals for a numbered sequence" component the design
// system reserves for an admissions process (Section 8).
const STEPS = [
  {
    number: "01",
    name: "Inquire",
    description:
      "Message us, call, or visit the registrar's office to reserve your child's slot.",
  },
  {
    number: "02",
    name: "Submit requirements",
    description:
      "Bring the documents listed here, originals and photocopies together.",
  },
  {
    number: "03",
    name: "Enroll",
    description:
      "Settle the fees, receive the class schedule, and welcome to the Guardian family.",
  },
] as const;

// PLACEHOLDER (school sign-off pending): these are the real admission
// requirements supplied by the school, split into what every applicant brings
// and the conditional documents transferees and ESC grantees add. Each
// conditional item carries its OWN condition rather than a single blanket tier
// label, since the three conditions differ (transferee ESC grantee /
// Grade 11 transferee ESC grantee / Grade 11 transferee). Confirm exact wording
// and completeness with the registrar before launch; the full, authoritative
// matrix belongs on the /admissions interior page (DESIGN.md Section 7).
const CORE_REQUIREMENTS = [
  "Form 138 (Original Report Card)",
  "Birth Certificate (PSA photocopy)",
  "Certificate of Good Moral Character",
] as const;

const CONDITIONAL_REQUIREMENTS = [
  { name: "ESC Certification", note: "for transferee ESC grantees" },
  { name: "QVR Certificate", note: "for Grade 11 transferees, ESC grantees" },
  { name: "Certificate of Completion", note: "for Grade 11 transferees" },
] as const;

export function Admissions() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* Full-bleed Evergreen structural band, the "committed green mass"
           DESIGN.md names alongside the footer (Sections 1 and 8). The 56px
           rounded top lifts it off the Leaf-Tint tail of Offerings above so it
           reads as a lifted panel settling onto the page (Section 4), and it
           flows down into the evergreen footer, which carries a hairline top
           border so the two green zones stay legible as two sections rather
           than one undifferentiated slab. */}
        <section
          id="admissions"
          aria-labelledby="admissions-heading"
          className="relative overflow-hidden rounded-t-[40px] bg-grove-deep text-grove-foreground sm:rounded-t-[56px]"
        >
          {/* Soft-geometry glows, decorative only (Section 4). A Palm radial in
             the top-right open corner and a fainter gold radial in the
             bottom-left, both barely-there and atmospheric, never a loud
             gradient. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 -top-44 size-[36rem] rounded-full"
            style={{
              backgroundImage:
                "radial-gradient(circle, color-mix(in oklch, var(--grove-light), transparent 62%) 0%, transparent 68%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-48 -left-44 size-[34rem] rounded-full"
            style={{
              backgroundImage:
                "radial-gradient(circle, color-mix(in oklch, var(--secondary), transparent 86%) 0%, transparent 70%)",
            }}
          />
          {/* Thin gold ring in the upper-left, clear of the copy. Fine gold
             linework on evergreen is legal and decorative only. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-28 top-24 size-[22rem] rounded-full border border-secondary/20"
          />

          <div className="relative mx-auto w-full max-w-[82rem] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
            {/* 1. Lead ---------------------------------------------------- */}
            <m.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              className="flex max-w-[42rem] flex-col gap-5"
            >
              <m.p
                variants={itemVariants}
                className="text-[13px] font-semibold uppercase tracking-[0.22em] text-secondary"
              >
                Admissions
              </m.p>
              <m.h2
                id="admissions-heading"
                variants={itemVariants}
                className="text-balance font-serif text-[clamp(2.25rem,4.8vw,3.5rem)] leading-[1.06] tracking-[-0.005em] text-grove-foreground"
              >
                Begin your child&rsquo;s journey with us.
              </m.h2>
              <m.p
                variants={itemVariants}
                className="max-w-[54ch] text-pretty text-lg leading-relaxed text-grove-foreground/80"
              >
                Enrolling is simple: three steps, one visit. Come meet the
                Guardians, walk the campus, and our registrar will walk you
                through everything else, from ESC vouchers to your child&rsquo;s
                first day.
              </m.p>
            </m.div>

            {/* 2. Process + Requirements two-column ----------------------- */}
            <div className="mt-14 grid grid-cols-1 gap-12 sm:mt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              {/* Left: the three-step enrollment path ------------------- */}
              <m.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                className="flex flex-col"
              >
                <ol className="flex flex-col">
                  {STEPS.map(({ number, name, description }) => (
                    <m.li
                      key={number}
                      variants={itemVariants}
                      className="flex gap-5 border-t border-grove-foreground/16 py-6 last:border-b sm:gap-6"
                    >
                      <span
                        aria-hidden="true"
                        className="w-12 shrink-0 font-serif text-3xl leading-none text-secondary sm:text-4xl"
                      >
                        {number}
                      </span>
                      <div className="flex flex-col gap-1.5">
                        <p className="text-lg font-semibold text-grove-foreground">
                          {name}
                        </p>
                        <p className="max-w-[46ch] text-pretty text-[15px] leading-relaxed text-grove-foreground/75">
                          {description}
                        </p>
                      </div>
                    </m.li>
                  ))}
                </ol>

                {/* CTA row. The single gold pill CTA this view is allowed on an
                   evergreen ground (evergreen text on gold = 5.97:1), paired
                   with a quieter light text link. Both follow the site's
                   committed route convention (header and footer link the same
                   paths); /admissions is where the full, conditional
                   requirements matrix will live per DESIGN.md Section 7. */}
                <m.div
                  variants={itemVariants}
                  className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7"
                >
                  <Button
                    render={<Link href="/contact" />}
                    nativeButton={false}
                    className="h-12 rounded-full border-transparent bg-secondary bg-clip-border px-8 text-base font-semibold text-secondary-foreground shadow-[0_12px_28px_-8px_rgba(0,0,0,0.5)] transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 hover:bg-secondary/90 hover:shadow-[0_18px_34px_-8px_rgba(0,0,0,0.55)]"
                  >
                    Inquire Now
                  </Button>
                  <Link
                    href="/admissions"
                    className="text-[15px] font-semibold text-grove-foreground underline decoration-secondary/70 decoration-[1.5px] underline-offset-[6px] transition-colors hover:decoration-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grove-foreground/70 focus-visible:ring-offset-2 focus-visible:ring-offset-grove-deep"
                  >
                    See full admission details
                  </Link>
                </m.div>
              </m.div>

              {/* Right: the "What to bring" requirements card ----------- */}
              <m.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                className="flex flex-col rounded-[28px] border border-grove-foreground/15 bg-grove-foreground/[0.06] p-7 sm:p-9"
              >
                <m.p
                  variants={itemVariants}
                  className="text-[12.5px] font-semibold uppercase tracking-[0.2em] text-secondary"
                >
                  Requirements
                </m.p>
                <m.h3
                  variants={itemVariants}
                  className="mt-2 font-serif text-[26px] leading-tight text-grove-foreground"
                >
                  What to bring
                </m.h3>

                {/* Tier 1: every applicant */}
                <m.p
                  variants={itemVariants}
                  className="mt-7 text-[11.5px] font-bold uppercase tracking-[0.16em] text-grove-foreground/70"
                >
                  Every applicant
                </m.p>
                <ul className="mt-3.5 flex flex-col gap-3">
                  {CORE_REQUIREMENTS.map((item) => (
                    <m.li
                      key={item}
                      variants={itemVariants}
                      className="flex items-start gap-3"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 size-2 shrink-0 rounded-full bg-secondary"
                      />
                      <span className="text-[15.5px] leading-snug text-grove-foreground/90">
                        {item}
                      </span>
                    </m.li>
                  ))}
                </ul>

                {/* Tier 2: transferees and ESC grantees, each with its own
                   condition rather than one blanket label */}
                <m.p
                  variants={itemVariants}
                  className="mt-6 border-t border-grove-foreground/12 pt-6 text-[11.5px] font-bold uppercase tracking-[0.16em] text-grove-foreground/70"
                >
                  Transferees &amp; ESC grantees add
                </m.p>
                <ul className="mt-3.5 flex flex-col gap-3">
                  {CONDITIONAL_REQUIREMENTS.map(({ name, note }) => (
                    <m.li
                      key={name}
                      variants={itemVariants}
                      className="flex items-start gap-3"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 size-2 shrink-0 rounded-full border border-secondary/80"
                      />
                      <span className="flex flex-col gap-0.5">
                        <span className="text-[15.5px] leading-snug text-grove-foreground/90">
                          {name}
                        </span>
                        <span className="text-[13px] leading-snug text-grove-foreground/70">
                          {note}
                        </span>
                      </span>
                    </m.li>
                  ))}
                </ul>

                <m.p
                  variants={itemVariants}
                  className="mt-7 flex items-start gap-2.5 border-t border-grove-foreground/12 pt-5 text-[13.5px] leading-relaxed text-grove-foreground/75"
                >
                  <Check
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-secondary"
                  />
                  Requirements may vary by grade level and for transferees. The
                  registrar can confirm your exact list in one visit or call.
                </m.p>
              </m.div>
            </div>
          </div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
