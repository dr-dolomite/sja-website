import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Contact } from "@/components/contact/contact";

export const metadata = {
  title: "Contact | St. Joseph's Academy of Malinao, Inc.",
  description:
    "Visit St. Joseph's Academy of Malinao, Aklan, or get in touch with the registrar's office.",
};

export default function ContactPage() {
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
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
