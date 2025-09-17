import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev"
import type { NextConfig } from "next"
import type { RemotePattern } from "next/dist/shared/lib/image-config"

const env = process.env.NEXT_CONFIG_ENV || "development"

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
    output: "export",
    images: {
      remotePatterns,
    },
    trailingSlash: true,
    experimental: {
      // Better tree shaking
      optimizePackageImports: ["@yamada-ui/react", "@yamada-ui/lucide", "@tanstack/react-query"],
      // Reduce memory usage during build
      webpackBuildWorker: true,
      // Optimize bundle analysis
      bundlePagesRouterDependencies: true,
      // Reduce large string serialization
      serverComponentsExternalPackages: ["@yamada-ui/react", "@tanstack/react-query"],
    },
    turbopack: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
    // Compiler optimizations
    compiler: {
      removeConsole: process.env.NODE_ENV === "production",
    },
  }

  return nextConfig
})()

export default config
