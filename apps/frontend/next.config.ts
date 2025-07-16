import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev"
import type { NextConfig } from "next"
import type { RemotePattern } from "next/dist/shared/lib/image-config"

const env = process.env.NEXT_CONFIG_ENV || "development"
const generateStatic = env === "staging" || env === "production"

const config = (async () => {
  if (env === "development") {
    await setupDevPlatform()
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
    output: generateStatic ? "export" : "standalone",
    images: {
      remotePatterns,
    },
    // Need this to allow static site generation to work with SSG hosting
    trailingSlash: generateStatic,
  }

  return nextConfig
})()

export default config
