import {
  cleanupTestEnvironment,
  localStorageMock,
  setupTestEnvironment,
} from "@repo/ui/test-config/localStorage-test-utils"
import { renderHook } from "@testing-library/react"
import { createLocalStorageManager, useLocalStorage } from "../localStorageManager"

describe("LocalStorageManager Events & Availability", () => {
  beforeEach(() => {
    setupTestEnvironment()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    cleanupTestEnvironment()
  })

  it("dispatches storage event on setValue when supported", () => {
    const manager = createLocalStorageManager<{ name: string }>("test-key")
    const dispatchSpy = vi.spyOn(window, "dispatchEvent")

    manager.setValue({ name: "John" })

    expect(localStorageMock.setItem).toHaveBeenCalled()
    expect(dispatchSpy).toHaveBeenCalled()
  })

  it("dispatches storage event on removeValue when supported", () => {
    const manager = createLocalStorageManager("test-key")
    const dispatchSpy = vi.spyOn(window, "dispatchEvent")

    manager.removeValue()

    expect(localStorageMock.removeItem).toHaveBeenCalledWith("test-key")
    expect(dispatchSpy).toHaveBeenCalled()
  })

  it("isAvailable returns false when localStorage is missing", () => {
    const original = window.localStorage
    Object.defineProperty(window, "localStorage", { value: undefined, configurable: true })
    const { result } = renderHook(() => useLocalStorage("test-key"))
    expect(result.current.isAvailable).toBe(false)
    Object.defineProperty(window, "localStorage", { value: original, configurable: true })
  })

  it("isAvailable returns false when localStorage throws", () => {
    const setItemSpy = vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
      throw new Error("quota")
    })

    const { result } = renderHook(() => useLocalStorage("test-key"))

    expect(result.current.isAvailable).toBe(false)

    setItemSpy.mockRestore()
  })
})
