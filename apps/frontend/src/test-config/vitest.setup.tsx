import type { ImgHTMLAttributes } from "react"

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    use: (promise: Promise<unknown>) => {
      let result: unknown
      let error: unknown
      let done = false
      promise.then(
        (data) => {
          result = data
          done = true
        },
        (err) => {
          error = err
          done = true
        },
      )
      if (!done) {
        throw promise
      }
      if (error) {
        throw error
      }
      return result
    },
  }
})

vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:3000")

vi.mock("@repo/ui/components/Primitive/Image", () => ({
  Image: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    // biome-ignore lint/performance/noImgElement: this is for a test
    // biome-ignore lint/a11y/useAltText: this is for a test
    <img data-testid="custom-image" {...props} />
  ),
}))
