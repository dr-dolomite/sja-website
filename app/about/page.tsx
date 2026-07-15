import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AboutIntro } from "@/components/about/about-intro";
import { AboutVisionMission } from "@/components/about/about-vision-mission";
import { AboutStory } from "@/components/about/about-story";
import { AboutSeal } from "@/components/about/about-seal";
import { AboutGovernance } from "@/components/about/about-governance";
import { AboutPhilosophyGoals } from "@/components/about/about-philosophy-goals";
import { AboutCta } from "@/components/about/about-cta";

export const metadata: Metadata = {
  title: "About | St. Joseph's Academy of Malinao",
  description:
    "The story, seal, philosophy, and diocesan identity of St. Joseph's Academy of Malinao, a Catholic school forming Guardians since 1948.",
};

export default function AboutPage() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:rounded-md focus-visible:bg-background focus-visible:px-4 focus-visible:py-2 focus-visible:text-foreground focus-visible:shadow-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col">
        <AboutIntro />
        <AboutVisionMission />
        <AboutStory />
        <AboutSeal />
        <AboutGovernance />
        <AboutPhilosophyGoals />
        <AboutCta />
      </main>
      <SiteFooter />
    </>
  );
}
