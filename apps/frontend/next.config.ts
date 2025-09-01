import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare"
import type { NextConfig } from "next"
import type { RemotePattern } from "next/dist/shared/lib/image-config"

const env = process.env.NEXT_CONFIG_ENV || "development"

const config = (async () => {
  if (env === "development") {
    initOpenNextCloudflareForDev()
  }

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
    // Remove output: "export" as OpenNext handles the build output
    // Remove trailingSlash as it's not needed for OpenNext
  }

  return nextConfig
})()

export default config
