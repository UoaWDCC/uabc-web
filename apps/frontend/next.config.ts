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
    // Need this to allow static site generation to work with SSG hosting
    trailingSlash: true,
    // Performance optimizations
    experimental: {
      optimizePackageImports: ["@yamada-ui/react", "@yamada-ui/lucide"],
    },
    // Turbopack configuration (now stable)
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
    // Optimize bundle
    webpack: (config, { dev }) => {
      if (dev) {
        // Faster development builds
        config.watchOptions = {
          poll: 1000,
          aggregateTimeout: 300,
        }
        config.cache = {
          type: "filesystem",
          buildDependencies: {
            config: [__filename],
            tsconfig: ["./tsconfig.json"],
            packageJson: ["./package.json"],
          },
        }
      }
      return config
    },
  }

  return nextConfig
})()

export default config
