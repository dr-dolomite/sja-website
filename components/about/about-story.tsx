"use client";

import Image from "next/image";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";

// Same stagger + transform-only rise contract as components/home/vision-mission.tsx
// and components/home/core-values.tsx, so every entrance across the site reads as
// one system. Hidden state never touches opacity: content paints at full opacity on
// the first (server-rendered) frame and only slides the last 24px into place.
// Enhancement-Not-Gate — the section's meaning is legible before Motion ever runs,
// and reduced-motion / headless renders show complete content.
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

export function AboutStory() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* Coconut ground: alternates against the Leaf-Tint compact vision/mission
           restate above it, keeping the Coconut / Leaf-Tint / Evergreen rhythm the
           Committed Green Rule asks for. This section is light and text-dense on
           purpose: it is the reading-heavy narrative beat before the evergreen
           Seal band arrives. */}
        <section
          aria-labelledby="about-story-eyebrow"
          className="relative overflow-hidden bg-background text-foreground"
        >
          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            className="relative mx-auto w-full max-w-[88rem] px-4 py-20 sm:px-6 sm:py-28 lg:px-4"
          >
            {/* Eyebrow-kicker. Gold text is ground-keyed to evergreen only, so on
               this Coconut ground the kicker is Palm (5.06:1 on Coconut, AA). */}
            <m.p
              id="about-story-eyebrow"
              variants={itemVariants}
              className="text-[13px] font-semibold uppercase tracking-[0.22em] text-primary"
            >
              Our Story
            </m.p>

            <m.h2
              variants={itemVariants}
              className="mt-5 max-w-[18ch] text-balance font-serif text-[clamp(2.25rem,4.8vw,3.5rem)] leading-[1.08] tracking-[-0.005em] text-grove-deep"
            >
              Founded in faith, in 1947.
            </m.h2>

            <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-14 sm:mt-16 lg:grid-cols-12">
              {/* Narrative: capped at a readable measure. */}
              <m.div
                variants={itemVariants}
                className="flex flex-col gap-6 lg:col-span-7"
              >
                <p className="max-w-[66ch] text-pretty text-lg leading-[1.75] text-foreground/90">
                  In 1947, Msgr. Jose Y. Insauriga, then parish priest of
                  Malinao, gathered prominent townspeople in the old convent
                  and proposed a Catholic school. A corporation was formed,
                  the old convent was remodeled into five classrooms with a
                  library and offices, and classes opened in June 1948 under
                  Principal Mrs. Concepcion Soler-Yatar. The Bureau of
                  Private Schools issued the school&rsquo;s permit that
                  December.
                </p>
                <p className="max-w-[66ch] text-pretty text-lg leading-[1.75] text-foreground/90">
                  The first commencement followed in school year 1949 to
                  1950. In 1953, through the efforts of Mr. Epimaco Ilejay,
                  Msgr. Salvador Mabasa, Msgr. Insauriga, and Assemblyman
                  Toting Reyes, the school earned Government Recognition
                  from the Bureau of Private Schools.
                </p>
                <p className="max-w-[66ch] text-pretty text-lg leading-[1.75] text-foreground/90">
                  During the administration of Rev. Fr. Jose V. Soriano, St.
                  Joseph&rsquo;s Academy grew from a stockholder corporation
                  into a diocesan institution, the status it holds today,
                  and the present school building was raised.
                </p>
              </m.div>

              {/* Archival photo rail. The source photos are low and uneven
                 resolution, so every one is rendered SMALL and framed (never
                 large or full-bleed), with a matching period treatment (a warm
                 mat, a thin ink-toned border, and a light duotone filter) so the
                 uneven quality reads as intentional heritage rather than a
                 low-fidelity gallery. */}
              <m.div
                variants={itemVariants}
                className="flex flex-col gap-8 lg:col-span-5"
              >
                <figure className="mx-auto w-48 sm:w-56">
                  <div className="rounded-sm border border-foreground/15 bg-card p-2">
                    <div className="relative aspect-[526/701] overflow-hidden rounded-[2px]">
                      <Image
                        src="/history/founder.jpg"
                        alt="Monsignor Jose Y. Insauriga, founder of St. Joseph's Academy"
                        fill
                        sizes="224px"
                        className="object-cover object-top grayscale-[35%] sepia-[18%] contrast-[1.05]"
                      />
                    </div>
                  </div>
                  <figcaption className="mt-3 text-center text-sm leading-snug text-muted-foreground">
                    Msgr. Jose Y. Insauriga, founder
                  </figcaption>
                </figure>

                <div className="grid grid-cols-2 gap-6 sm:gap-8">
                  <figure className="w-full">
                    <div className="rounded-sm border border-foreground/15 bg-card p-2">
                      <div className="relative aspect-[3/2] overflow-hidden rounded-[2px]">
                        <Image
                          src="/history/1948-1949-junior-class.jpg"
                          alt="The junior class of St. Joseph's Academy, school year 1948 to 1949"
                          fill
                          sizes="(max-width: 640px) 42vw, 240px"
                          className="object-cover grayscale-[35%] sepia-[18%] contrast-[1.05]"
                        />
                      </div>
                    </div>
                    <figcaption className="mt-3 text-center text-sm leading-snug text-muted-foreground">
                      Junior class, S.Y. 1948 to 1949
                    </figcaption>
                  </figure>

                  <figure className="w-full">
                    <div className="rounded-sm border border-foreground/15 bg-card p-2">
                      <div className="relative aspect-[3/2] overflow-hidden rounded-[2px]">
                        <Image
                          src="/history/1968-foundation-day.jpg"
                          alt="Foundation Day at St. Joseph's Academy, 1968"
                          fill
                          sizes="(max-width: 640px) 42vw, 240px"
                          className="object-cover grayscale-[35%] sepia-[18%] contrast-[1.05]"
                        />
                      </div>
                    </div>
                    {/* This photo postdates every timeline milestone below, so its
                       caption anchors the year explicitly rather than implying it
                       belongs to the founding era. */}
                    <figcaption className="mt-3 text-center text-sm leading-snug text-muted-foreground">
                      Foundation Day, 1968
                    </figcaption>
                  </figure>
                </div>
              </m.div>
            </div>
          </m.div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
