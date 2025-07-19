import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  if (process.env.NODE_ENV === "production") {
    return {
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: `${process.env.NEXT_PUBLIC_URL}/sitemap.xml`,
    }
  }
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  }
}
