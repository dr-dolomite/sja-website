import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/hero/hero";
import { VisionMission } from "@/components/home/vision-mission";
import { CoreValues } from "@/components/home/core-values";
import { LifeOfGuardians } from "@/components/home/life-of-guardians";
import { Offerings } from "@/components/home/offerings";
import { News } from "@/components/home/news";
import { Admissions } from "@/components/home/admissions";

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-100 focus-visible:rounded-md focus-visible:bg-background focus-visible:px-4 focus-visible:py-2 focus-visible:text-foreground focus-visible:shadow-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col">
        <Hero />
        <CoreValues />
        <VisionMission />
        <LifeOfGuardians />
        <Offerings />
        <News />
        <Admissions />
      </main>
      <SiteFooter />
    </>
  );
}
