import "@testing-library/jest-dom"

export const useBooleanMock = vi.fn()
export const useBreakpointMock = vi.fn(() => "base")

vi.mock("@yamada-ui/react", async (importOriginal) => {
  const mod = await importOriginal()
  return {
    ...(typeof mod === "object" && mod !== null ? mod : {}),
    useBoolean: (init?: boolean) => useBooleanMock(init),
    useBreakpoint: () => useBreakpointMock(),
  }
})

vi.mock("@repo/ui/components/Image", () => ({
  Image: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // biome-ignore lint/nursery/noImgElement: this is for a test
    // biome-ignore lint/a11y/useAltText: this is for a test
    <img data-testid="custom-image" {...props} />
  ),
}))
