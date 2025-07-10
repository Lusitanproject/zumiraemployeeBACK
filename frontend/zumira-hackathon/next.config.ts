import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  experimental: {
    // Feito para não dar erro nos imports dinamicos em frontend/zumira-hackathon/src/components/custom/pdf.tsx
    esmExternals: "loose",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
        port: "",
        pathname: "/id/183/**",
      },
    ],
  },
};

export default nextConfig;
