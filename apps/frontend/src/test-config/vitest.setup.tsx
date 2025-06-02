import type { ImgHTMLAttributes } from "react"

vi.mock("@repo/ui/components/Image", () => ({
  Image: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    // biome-ignore lint/nursery/noImgElement: this is for a test
    // biome-ignore lint/a11y/useAltText: this is for a test
    <img data-testid="custom-image" {...props} />
  ),
}))
