import type { ImgHTMLAttributes } from "react"

vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:3000")
vi.stubEnv("NEXT_PUBLIC_URL", "http://localhost:3001")

vi.mock("@repo/ui/components/Primitive/Image", () => ({
  Image: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    // biome-ignore lint/performance/noImgElement: this is for a test
    // biome-ignore lint/a11y/useAltText: this is for a test
    <img data-testid="custom-image" {...props} />
  ),
}))

/**
 * Mock the Next.js Link component for testing.
 * Next.js Link does prefetching, etc. which we don't want in tests.
 */
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))
