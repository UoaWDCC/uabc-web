import { fireEvent, render, screen } from "@/test-utils"
import type { StaticImageData } from "next/image"
import { isValidElement } from "react"
import { Image, shouldShowFallbackImage } from "./Image"
import * as ImageModule from "./index"

// Mock NextImage to a simple img for test environment
vi.mock("next/image", () => ({
  // biome-ignore lint/suspicious/noExplicitAny: this is for a test
  default: (props: Record<string, any> = {}) => {
    let { alt = "", src, ...rest } = props || {}
    if (src && typeof src === "object" && "src" in src) {
      src = src.src
    }
    // biome-ignore lint/nursery/noImgElement: this is for a test
    return <img {...rest} alt={alt} data-testid="next-image" src={src} />
  },
}))

// Mock useBoolean and useImage to control loading, error, and status state
vi.mock("@yamada-ui/react", async (importOriginal) => {
  const mod = await importOriginal()
  return {
    ...(typeof mod === "object" && mod !== null ? mod : {}),
    // biome-ignore lint/suspicious/noExplicitAny: this is for a test
    useBoolean: (...args: any) => useBooleanMock(...args),
    // biome-ignore lint/suspicious/noExplicitAny: this is for a test
    useImage: (...args: any) => useImageMock(...args),
  }
})

const useBooleanMock = vi.fn()
const useImageMock = vi.fn()

const fallbackUrl = "https://placehold.co/128x128?text=Fallback"
const srcUrl = "https://placehold.co/300x200/png"
const altText = "Test image"

describe("<Image />", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should re-export the Image component and check if Image exists", () => {
    expect(ImageModule.Image).toBeDefined()
    expect(isValidElement(<ImageModule.Image alt={altText} src={srcUrl} />)).toBeTruthy()
  })

  it("renders the image with given src and alt", () => {
    useBooleanMock.mockReturnValueOnce([false, { off: vi.fn() }]) // loading
    useBooleanMock.mockReturnValueOnce([false, { on: vi.fn(), off: vi.fn() }]) // error
    useImageMock.mockReturnValueOnce("loaded")

    render(<Image alt={altText} data-testid="next-image" height={100} src={srcUrl} width={100} />)
    const img = screen.getByTestId("next-image")
    expect(img).toHaveAttribute("src", srcUrl)
    expect(img).toHaveAttribute("alt", altText)
    expect(img).toHaveAttribute("width", "100")
    expect(img).toHaveAttribute("height", "100")
  })

  it("renders fallback image when status is not loaded and fallbackStrategy is beforeLoadOrError", () => {
    useBooleanMock.mockReturnValueOnce([true, { off: vi.fn() }]) // loading true
    useBooleanMock.mockReturnValueOnce([false, { on: vi.fn(), off: vi.fn() }]) // error
    useImageMock.mockReturnValueOnce("loading")

    render(
      <Image
        alt={altText}
        fallback={fallbackUrl}
        fallbackStrategy="beforeLoadOrError"
        height={100}
        src={srcUrl}
        width={100}
      />,
    )
    const img = screen.getByTestId("next-image")
    expect(img).toHaveAttribute("src", fallbackUrl)
  })

  it("renders fallback image when status is failed and fallbackStrategy is onError", () => {
    useBooleanMock.mockReturnValueOnce([false, { off: vi.fn() }]) // loading false
    useBooleanMock.mockReturnValueOnce([true, { on: vi.fn(), off: vi.fn() }]) // error true
    useImageMock.mockReturnValueOnce("failed")

    render(
      <Image
        alt={altText}
        fallback={fallbackUrl}
        fallbackStrategy="onError"
        height={100}
        src={srcUrl}
        width={100}
      />,
    )
    const img = screen.getByTestId("next-image")
    expect(img).toHaveAttribute("src", fallbackUrl)
  })

  it("calls onError and onLoad handlers appropriately", () => {
    const offLoading = vi.fn()
    const onError = vi.fn()
    const offError = vi.fn()
    useBooleanMock.mockReturnValueOnce([false, { off: offLoading }]) // loading
    useBooleanMock.mockReturnValueOnce([false, { on: onError, off: offError }]) // error
    useImageMock.mockReturnValueOnce("loaded")

    render(<Image alt={altText} data-testid="next-image" height={100} src={srcUrl} width={100} />)
    const img = screen.getByTestId("next-image")
    fireEvent.error(img)
    expect(offLoading).toHaveBeenCalled()
    expect(onError).toHaveBeenCalled()
    fireEvent.load(img)
    expect(offLoading).toHaveBeenCalledTimes(2)
    expect(offError).toHaveBeenCalled()
  })

  it("shouldShowFallbackImage utility works as expected", () => {
    expect(shouldShowFallbackImage("loading", "beforeLoadOrError")).toBe(true)
    expect(shouldShowFallbackImage("failed", "onError")).toBe(true)
    expect(shouldShowFallbackImage("loaded", "beforeLoadOrError")).toBe(false)
    expect(shouldShowFallbackImage("loaded", "onError")).toBe(false)
    expect(shouldShowFallbackImage("pending", "beforeLoadOrError")).toBe(true)
    expect(shouldShowFallbackImage("pending", "onError")).toBe(false)
  })

  it("renders src if no fallback is provided, even if status is failed", () => {
    useBooleanMock.mockReturnValueOnce([false, { off: vi.fn() }]) // loading
    useBooleanMock.mockReturnValueOnce([true, { on: vi.fn(), off: vi.fn() }]) // error true
    useImageMock.mockReturnValueOnce("failed")

    render(<Image alt={altText} fallbackStrategy="onError" height={100} src={srcUrl} width={100} />)
    const img = screen.getByTestId("next-image")
    expect(img).toHaveAttribute("src", srcUrl)
  })

  it("renders the image when src is a StaticImageData object", () => {
    useBooleanMock.mockReturnValueOnce([false, { off: vi.fn() }]) // loading
    useBooleanMock.mockReturnValueOnce([false, { on: vi.fn(), off: vi.fn() }]) // error
    useImageMock.mockReturnValueOnce("loaded")

    const staticImageMock = { src: srcUrl, height: 100, width: 100 } as StaticImageData
    render(<Image alt={altText} height={100} src={staticImageMock} width={100} />)
    const img = screen.getByTestId("next-image")
    expect(img).toHaveAttribute("src", srcUrl)
    expect(img).toHaveAttribute("alt", altText)
    expect(img).toHaveAttribute("width", "100")
    expect(img).toHaveAttribute("height", "100")
  })
})
