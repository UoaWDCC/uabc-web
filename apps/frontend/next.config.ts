import type { NextConfig } from "next"
import type { RemotePattern } from "next/dist/shared/lib/image-config"

const config = (async () => {
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
  }

  return nextConfig
})()

export default config

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare"

initOpenNextCloudflareForDev()
