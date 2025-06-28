import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        // TODO: PROPERLY IMPLEMENT THIS LATER
        protocol: "http",
        hostname: "localhost",
      },
      {
        // TODO: PROPERLY IMPLEMENT THIS LATER
        protocol: process.env.NEXT_PUBLIC_API_URL?.startsWith("https://") ? "https" : "http",
        hostname: process.env.NEXT_PUBLIC_API_URL?.replace(/^https?:\/\//, ""),
      },
    ],
  },
  async rewrites() {
    return [
      {
        // TODO: PROPERLY IMPLEMENT THIS LATER
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ]
  },
}

export default nextConfig
