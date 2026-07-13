import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The hero/story photography is served at quality 72 (deliberately a touch
    // below the 75 default to keep the large festival and Mass photos light).
    // Next 16 only applies qualities declared here, so both are allowlisted.
    qualities: [72, 75],
  },
};

export default nextConfig;
