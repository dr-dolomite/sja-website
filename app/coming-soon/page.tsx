import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon/coming-soon";

// This page stands in for the whole domain while the gate is active, so it must
// never be indexed as the school's canonical result. The gate also sets an
// X-Robots-Tag header (middleware.ts); this is the belt to that suspenders.
export const metadata: Metadata = {
  title: "Coming Soon | St. Joseph's Academy of Malinao",
  description:
    "A new online home for St. Joseph's Academy of Malinao, Inc. is taking root. Opening soon.",
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  return <ComingSoon />;
}
