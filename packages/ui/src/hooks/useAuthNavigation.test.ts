import { act, renderHook } from "@testing-library/react"
import { useRouter, useSearchParams } from "next/navigation"
import { describe, expect, it, vi } from "vitest"
import { useAuthNavigation } from "./useAuthNavigation"

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}))

const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
}

type MockedUseRouter = ReturnType<typeof vi.fn>
type MockedUseSearchParams = ReturnType<typeof vi.fn>

describe("useAuthNavigation", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useRouter as MockedUseRouter).mockReturnValue(mockRouter)
    ;(useSearchParams as MockedUseSearchParams).mockReturnValue(new URLSearchParams())
  })

  it("should return returnUrl as null when no search params", () => {
    const { result } = renderHook(() => useAuthNavigation())
    expect(result.current.returnUrl).toBeNull()
  })

  it("should extract returnUrl from search params", () => {
    const searchParams = new URLSearchParams("returnUrl=%2Fbook")
    ;(useSearchParams as MockedUseSearchParams).mockReturnValue(searchParams)

    const { result } = renderHook(() => useAuthNavigation())
    expect(result.current.returnUrl).toBe("/book")
  })

  it("should build login URL with return URL", () => {
    const { result } = renderHook(() => useAuthNavigation())
    const loginUrl = result.current.buildLoginUrl("/book")
    expect(loginUrl).toBe("/auth/login?returnUrl=%2Fbook")
  })

  it("should navigate to return URL when provided", () => {
    const searchParams = new URLSearchParams("returnUrl=%2Fbook")
    ;(useSearchParams as MockedUseSearchParams).mockReturnValue(searchParams)

    const { result } = renderHook(() => useAuthNavigation())

    act(() => {
      result.current.navigateToReturnUrl()
    })

    expect(mockRouter.push).toHaveBeenCalledWith("/book")
  })

  it("should navigate to default URL when no return URL", () => {
    const { result } = renderHook(() => useAuthNavigation({ defaultRedirectUrl: "/dashboard" }))

    act(() => {
      result.current.navigateToReturnUrl()
    })

    expect(mockRouter.push).toHaveBeenCalledWith("/dashboard")
  })

  it("should navigate to custom default URL when provided", () => {
    const { result } = renderHook(() => useAuthNavigation())

    act(() => {
      result.current.navigateToReturnUrl("/custom")
    })

    expect(mockRouter.push).toHaveBeenCalledWith("/custom")
  })

  it("should call onBeforeNavigate callback", () => {
    const onBeforeNavigate = vi.fn()
    const { result } = renderHook(() => useAuthNavigation({ onBeforeNavigate }))

    act(() => {
      result.current.navigateToReturnUrl("/test")
    })

    expect(onBeforeNavigate).toHaveBeenCalledWith("/test")
  })

  it("should prevent multiple navigations", () => {
    const { result } = renderHook(() => useAuthNavigation())

    act(() => {
      result.current.navigateToReturnUrl("/first")
      result.current.navigateToReturnUrl("/second")
    })

    expect(mockRouter.push).toHaveBeenCalledTimes(1)
    expect(mockRouter.push).toHaveBeenCalledWith("/first")
  })

  it("should clear return URL from current URL", () => {
    const mockReplaceState = vi.fn()
    Object.defineProperty(window, "history", {
      value: { replaceState: mockReplaceState },
      writable: true,
    })

    const { result } = renderHook(() => useAuthNavigation())

    act(() => {
      result.current.clearReturnUrl()
    })

    expect(mockReplaceState).toHaveBeenCalled()
  })
})
