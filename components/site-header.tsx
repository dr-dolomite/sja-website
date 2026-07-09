"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/academics", label: "Academics" },
  { href: "/guardian-life", label: "Guardian Life" },
  { href: "/news", label: "News" },
];

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background text-foreground">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
        >
          <Image
            src="/sja-school-logo.png"
            alt="St. Joseph's Academy of Malinao crest"
            width={48}
            height={48}
            priority
            className="h-11 w-11 shrink-0 sm:h-12 sm:w-12"
          />
          <span className="flex flex-col leading-tight">
            <span className="font-sans text-base font-semibold tracking-tight sm:text-lg">
              St. Joseph&rsquo;s Academy
            </span>
            <span className="text-xs text-muted-foreground sm:text-sm">
              of Malinao, Inc. &middot; Est. 1947
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            render={<Link href="/contact" />}
            nativeButton={false}
            className="hidden h-11 bg-primary px-5 text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring lg:inline-flex"
          >
            Contact
          </Button>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring lg:hidden"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav-panel"
          className="border-t border-border bg-background px-4 pb-6 pt-2 sm:px-6 lg:hidden"
        >
          <nav className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-md px-2 text-base font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
              >
                {link.label}
              </Link>
            ))}
            <Button
              render={<Link href="/contact" onClick={() => setOpen(false)} />}
              nativeButton={false}
              className="mt-3 h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring"
            >
              Contact
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
