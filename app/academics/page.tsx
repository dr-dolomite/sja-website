import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AcademicsIntro } from "@/components/academics/academics-intro";
import { AcademicsJhs } from "@/components/academics/academics-jhs";

export const metadata: Metadata = {
  title: "Academics | St. Joseph's Academy of Malinao",
  description:
    "St. Joseph's Academy's K to 12 program: Junior High on the MATATAG curriculum and the Strengthened Senior High School with STEM, ASSH, and BE clusters, enriched by Josephian formation.",
};

export default function AcademicsPage() {
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
        <AcademicsIntro />
        <AcademicsJhs />
      </main>
      <SiteFooter />
    </>
  );
}
