import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // IMPORTANT: Comment out "output: export" during development
  // Uncomment only when building for production deployment
  // output: "export",
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
