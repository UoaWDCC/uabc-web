import type { ImgHTMLAttributes } from "react"

vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:3000")

vi.mock("@repo/ui/components/Primitive/Image", () => ({
  Image: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    // biome-ignore lint/performance/noImgElement: this is for a test
    // biome-ignore lint/a11y/useAltText: this is for a test
    <img data-testid="custom-image" {...props} />
  ),
}))
