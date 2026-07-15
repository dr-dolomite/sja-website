"use client";

import Image from "next/image";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";

// Same transform-only rise + stagger contract as vision-mission.tsx and
// core-values.tsx, so every entrance across the site reads as one system.
// Hidden state never touches opacity: content paints at full opacity on the
// first (server-rendered) frame and only slides the last 24px into place.
// Enhancement-Not-Gate: meaning is legible before Motion ever runs, and
// reduced-motion / headless renders show complete content.
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

export function AboutGovernance() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* Leaf-Tint ground (--muted): the soft green breather between the
           Evergreen Seal band above and the next section, continuing the
           Coconut/Leaf-Tint/Evergreen alternation the Committed Green Rule
           asks for. Governance reads as editorial prose here, deliberately
           NOT a stepped node/org-chart graphic, so the page's identity
           section never courts the "cold institutional portal"
           anti-reference. */}
        <section
          aria-labelledby="about-governance-eyebrow"
          className="relative overflow-hidden bg-muted text-foreground"
        >
          {/* Soft-geometry anchor: a single thin gold ring, decorative only,
             clipped by overflow-hidden so it never widens the viewport. Gold
             is ground-keyed here: linework, never text, on this light
             ground. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -right-24 size-[24rem] rounded-full border border-secondary/25 sm:size-[28rem]"
          />

          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            className="relative mx-auto w-full max-w-[88rem] px-4 py-20 sm:px-6 sm:py-28 lg:px-4"
          >
            {/* Eyebrow-kicker. Gold is ground-keyed: on Leaf-Tint the kicker
               is Palm ink, not gold text. */}
            <m.p
              id="about-governance-eyebrow"
              variants={itemVariants}
              className="text-[13px] font-semibold uppercase tracking-[0.22em] text-primary"
            >
              Identity &amp; Governance
            </m.p>

            <div className="mt-10 grid grid-cols-1 items-center gap-x-16 gap-y-12 sm:mt-14 lg:grid-cols-12">
              {/* Prose column: headline + the two carrying sentences. Kept to
                 a readable measure, not a diagram. */}
              <div className="flex flex-col gap-6 lg:col-span-7">
                <h2 className="max-w-[20ch] text-balance font-serif text-[clamp(2.25rem,4.8vw,3.5rem)] leading-[1.08] tracking-[-0.005em] text-grove-deep">
                  A diocesan school under the Diocese of Kalibo.
                </h2>

                <p className="max-w-[62ch] text-pretty text-lg leading-[1.7] text-foreground">
                  St. Joseph&rsquo;s Academy is a diocesan institution under
                  the Diocese of Kalibo, governed in accordance with the
                  Governance of Basic Education Act and the DepEd
                  School-Based Management Framework.
                </p>

                <p className="max-w-[62ch] text-pretty text-lg leading-[1.7] text-muted-foreground">
                  Authority flows from the Diocesan Bishop through the
                  School Director to the Principal, who exercises academic
                  and operational leadership over faculty, staff, and
                  learners.
                </p>
              </div>

              {/* The Diocese of Kalibo coat of arms, given a proper, dignified
                 position opposite the headline that names it, rather than a
                 small footnote beneath a portrait. Meaning-bearing text stays
                 ink, not gold, on this light ground; the gold ring is
                 decorative linework only. */}
              <m.div
                variants={itemVariants}
                className="lg:col-span-5 lg:justify-self-center"
              >
                <div className="flex flex-col items-center gap-5 text-center">
                  <div className="relative rounded-2xl border border-border bg-background p-8 shadow-sm">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-3 rounded-xl border border-secondary/30"
                    />
                    <Image
                      src="/images/diocese-of-kalibo-coat-of-arms.webp"
                      alt="Coat of arms of the Diocese of Kalibo"
                      width={176}
                      height={176}
                      className="relative h-32 w-32 object-contain sm:h-40 sm:w-40"
                    />
                  </div>
                  <div>
                    <p className="font-serif text-2xl leading-tight text-grove-deep">
                      Diocese of Kalibo
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      The school&rsquo;s governing diocese
                    </p>
                  </div>
                </div>
              </m.div>
            </div>

            {/* Leadership chain: the two people named in the authority flow,
               the Diocesan Bishop and the School Director, shown as real faces
               in that order. Community over corporate: the governance section
               is carried by people, not an org chart. */}
            <div className="mt-16 sm:mt-24">
              <m.p
                variants={itemVariants}
                className="text-center text-[13px] font-semibold uppercase tracking-[0.22em] text-primary"
              >
                Leadership
              </m.p>

              <m.div
                variants={itemVariants}
                className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-10 sm:grid-cols-2"
              >
                <figure className="flex flex-col">
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-border shadow-sm">
                    <Image
                      src="/bishop-cyril.webp"
                      alt="Most Reverend Cyril Jojo Buhayan Villareal, Bishop of the Diocese of Kalibo"
                      fill
                      sizes="(max-width: 640px) 90vw, 22rem"
                      className="object-cover object-center"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-3 rounded-xl border border-secondary/30"
                    />
                  </div>
                  <figcaption className="mt-4 text-center">
                    <p className="text-sm font-medium text-foreground">
                      Most Rev. Cyril &ldquo;Jojo&rdquo; Buhayan Villareal
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      Bishop of Kalibo
                    </p>
                  </figcaption>
                </figure>

                <figure className="flex flex-col">
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-border shadow-sm">
                    <Image
                      src="/school-director.jpg"
                      alt="Rev. Fr. Mark Randy G. Beluso, School Director of St. Joseph's Academy of Malinao"
                      fill
                      sizes="(max-width: 640px) 90vw, 22rem"
                      className="object-cover object-top"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-3 rounded-xl border border-secondary/30"
                    />
                  </div>
                  <figcaption className="mt-4 text-center">
                    <p className="text-sm font-medium text-foreground">
                      Rev. Fr. Mark Randy G. Beluso, S.Th.L., MA, MALS
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      School Director
                    </p>
                  </figcaption>
                </figure>
              </m.div>
            </div>
          </m.div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
