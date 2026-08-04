import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' " : ""}https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

// NOTE: If @vercel/analytics or Speed Insights is added later, connect-src must
// include its beacon origin (e.g. https://*.vercel-insights.com) or the beacon
// will be BLOCKED, not merely reported: this policy is enforcing as of launch.
// It ran as Content-Security-Policy-Report-Only through development; if a new
// third-party embed ever breaks, widen the directive above rather than
// downgrading the header back to report-only.
const nextConfig: NextConfig = {
  images: {
    // The hero/story photography is served at quality 72 (deliberately a touch
    // below the 75 default to keep the large festival and Mass photos light).
    // Next 16 only applies qualities declared here, so both are allowlisted.
    qualities: [72, 75],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
