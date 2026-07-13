import type { MetadataRoute } from "next";

// While the coming-soon gate is active (see middleware.ts), the whole domain
// answers 200 with the splash body, so crawlers must be kept off it entirely.
// The moment the gate lifts at launch (`COMING_SOON=false`), this flips back to
// allow-all automatically, no separate step to remember.
export default function robots(): MetadataRoute.Robots {
  const gated =
    process.env.NODE_ENV === "production" &&
    process.env.COMING_SOON !== "false";

  if (gated) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return { rules: { userAgent: "*", allow: "/" } };
}
