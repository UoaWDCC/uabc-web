import "@testing-library/jest-dom"

export const useBooleanMock = vi.fn()
export const useBreakpointMock = vi.fn(() => "base")

vi.mock("@yamada-ui/react", async (importOriginal) => {
  const mod = await importOriginal()
  return {
    ...(typeof mod === "object" && mod !== null ? mod : {}),
    // biome-ignore lint/suspicious/noExplicitAny: this is for a test
    useBoolean: (...args: any) => useBooleanMock(...args),
    useBreakpoint: () => useBreakpointMock(),
  }
})

vi.mock("@repo/ui/components/Image", () => ({
  // biome-ignore lint/nursery/noImgElement: this is for a test
  // biome-ignore lint/a11y/useAltText: this is for a test
  // biome-ignore lint/suspicious/noExplicitAny: this is for a test
  Image: (props: any) => <img data-testid="custom-image" {...props} />,
}))
