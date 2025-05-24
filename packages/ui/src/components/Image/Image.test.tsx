import { IMAGE_FALLBACK_SRC, IMAGE_TEST_CONSTANTS } from "@/test-config/mocks/constants"
import { useBooleanMock, useImageMock } from "@/test-config/mocks/hooks.mock"
import { fireEvent, render, screen } from "@/test-utils"
import { isValidElement } from "react"
import { Image, shouldShowFallbackImage } from "."
import * as ImageModule from "./index"

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

describe("<Image />", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should re-export the Image component and check if Image exists", () => {
    expect(ImageModule.Image).toBeDefined()
    expect(isValidElement(<ImageModule.Image {...IMAGE_TEST_CONSTANTS} />)).toBeTruthy()
  })

  it("renders the image with given src and alt", () => {
    useBooleanMock.mockReturnValueOnce([false, { off: vi.fn() }]) // loading
    useBooleanMock.mockReturnValueOnce([false, { on: vi.fn(), off: vi.fn() }]) // error
    useImageMock.mockReturnValueOnce("loaded")

    render(<Image {...IMAGE_TEST_CONSTANTS} />)
    const img = screen.getByTestId("next-image")
    expect(img).toHaveAttribute("src", IMAGE_TEST_CONSTANTS.src)
    expect(img).toHaveAttribute("alt", IMAGE_TEST_CONSTANTS.alt)
    expect(img).toHaveAttribute("width", IMAGE_TEST_CONSTANTS.width.toString())
    expect(img).toHaveAttribute("height", IMAGE_TEST_CONSTANTS.height.toString())
  })

  it("renders fallback image when status is not loaded and fallbackStrategy is beforeLoadOrError", () => {
    useBooleanMock.mockReturnValueOnce([true, { off: vi.fn() }]) // loading true
    useBooleanMock.mockReturnValueOnce([false, { on: vi.fn(), off: vi.fn() }]) // error
    useImageMock.mockReturnValueOnce("loading")

    render(
      <Image
        {...IMAGE_TEST_CONSTANTS}
        fallback={IMAGE_FALLBACK_SRC}
        fallbackStrategy="beforeLoadOrError"
      />,
    )
    const img = screen.getByTestId("next-image")
    expect(img).toHaveAttribute("src", IMAGE_FALLBACK_SRC)
  })

  it("renders fallback image when status is failed and fallbackStrategy is onError", () => {
    useBooleanMock.mockReturnValueOnce([false, { off: vi.fn() }]) // loading false
    useBooleanMock.mockReturnValueOnce([true, { on: vi.fn(), off: vi.fn() }]) // error true
    useImageMock.mockReturnValueOnce("failed")

    render(
      <Image {...IMAGE_TEST_CONSTANTS} fallback={IMAGE_FALLBACK_SRC} fallbackStrategy="onError" />,
    )
    const img = screen.getByTestId("next-image")
    expect(img).toHaveAttribute("src", IMAGE_FALLBACK_SRC)
  })

  it("calls onError and onLoad handlers appropriately", () => {
    const offLoading = vi.fn()
    const onError = vi.fn()
    const offError = vi.fn()
    useBooleanMock.mockReturnValueOnce([false, { off: offLoading }]) // loading
    useBooleanMock.mockReturnValueOnce([false, { on: onError, off: offError }]) // error
    useImageMock.mockReturnValueOnce("loaded")

    render(<Image {...IMAGE_TEST_CONSTANTS} />)
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

    render(<Image {...IMAGE_TEST_CONSTANTS} fallbackStrategy="onError" />)
    const img = screen.getByTestId("next-image")
    expect(img).toHaveAttribute("src", IMAGE_TEST_CONSTANTS.src)
  })

  it("renders the image when src is a StaticImageData object", () => {
    useBooleanMock.mockReturnValueOnce([false, { off: vi.fn() }]) // loading
    useBooleanMock.mockReturnValueOnce([false, { on: vi.fn(), off: vi.fn() }]) // error
    useImageMock.mockReturnValueOnce("loaded")

    render(<Image {...IMAGE_TEST_CONSTANTS} src={IMAGE_TEST_CONSTANTS} />)
    const img = screen.getByTestId("next-image")
    expect(img).toHaveAttribute("src", IMAGE_TEST_CONSTANTS.src)
    expect(img).toHaveAttribute("alt", IMAGE_TEST_CONSTANTS.alt)
    expect(img).toHaveAttribute("width", IMAGE_TEST_CONSTANTS.width.toString())
    expect(img).toHaveAttribute("height", IMAGE_TEST_CONSTANTS.height.toString())
  })
})
