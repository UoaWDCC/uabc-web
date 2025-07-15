import type { Metadata } from "next"

export function generateMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_URL}${path.startsWith("/") ? path : `/${path}`}`,
      siteName: "UABC",
      images: [
        {
          url: "/favicon.ico",
          width: 32,
          height: 32,
          alt: "UABC logo",
        },
      ],
      locale: "en-NZ",
      type: "website",
    },
  }
}
