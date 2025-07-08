import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev"
import type { NextConfig } from "next"

const config = (async () => {
  if (process.env.NODE_ENV === "development") {
    await setupDevPlatform()
  }

  const remotePatterns = []
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
    output: "standalone",
    images: {
      remotePatterns,
    },
    rewrites: async () => {
      return [
        {
          source: "/payload/api/media/:path*",
          destination: `${process.env.NEXT_PUBLIC_API_URL}/payload/api/media/:path*`,
        },
      ]
    },
  }

  return nextConfig
})()

export default config
