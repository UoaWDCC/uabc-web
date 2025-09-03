import type { NextConfig } from "next"
import type { RemotePattern } from "next/dist/shared/lib/image-config"

const remotePatterns: RemotePattern[] = [
  // TODO: remove once actual images implemented
  {
    protocol: "https",
    hostname: "images.unsplash.com",
  },
]

if (process.env.NEXT_PUBLIC_API_URL) {
  const { protocol, hostname, port, pathname } = new URL(process.env.NEXT_PUBLIC_API_URL)
  remotePatterns.push({
    protocol: protocol.replace(":", "") as "http" | "https",
    hostname,
    port,
    pathname: `${pathname.replace(/\/$/, "")}/payload/api/media/**`,
  })
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
  experimental: {
    optimizePackageImports: [
      "@yamada-ui/lucide",
      "@yamada-ui/react",
      "@tanstack/react-query",
      "react-hook-form",
      "zod",
    ],
  },
}

export default nextConfig

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare"

initOpenNextCloudflareForDev()
