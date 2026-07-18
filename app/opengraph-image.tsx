import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

// Site-wide fallback link-preview card: crest on Evergreen with the motto in
// Piña Gold (gold text on evergreen passes contrast per DESIGN.md §2). Routes
// with their own OG image (news articles) override this automatically.
export const alt = "St. Joseph's Academy of Malinao, Inc.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const crest = await readFile(
    path.join(process.cwd(), "public", "sja-school-logo.png")
  );
  const crestSrc = `data:image/png;base64,${crest.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          backgroundColor: "#0E3D2B",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={crestSrc} alt="" width={190} height={190} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              color: "#E9F1EA",
              fontSize: 56,
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            St. Joseph&#39;s Academy of Malinao
          </div>
          <div
            style={{
              color: "#DDAF3C",
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            Be like St. Joseph
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
