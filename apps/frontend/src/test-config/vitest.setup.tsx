import "@testing-library/jest-dom"

vi.mock("@repo/ui/components/Image", () => ({
  // biome-ignore lint/nursery/noImgElement: this is for a test
  // biome-ignore lint/a11y/useAltText: this is for a test
  // biome-ignore lint/suspicious/noExplicitAny: this is for a test
  Image: (props: any) => <img {...props} data-testid="custom-image" />,
}))
