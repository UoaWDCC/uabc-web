import { act, renderHook } from "@testing-library/react"
import { vi } from "vitest"
import { usePopupState } from "./usePopupState"

vi.mock("nuqs", () => {
  const actual = vi.importActual("nuqs")
  return {
    ...actual,
    useQueryStates: vi.fn((config: Record<string, { _default: unknown }>) => {
      let params = Object.fromEntries(
        Object.entries(config).map(([k, v]: [string, { _default: unknown }]) => [k, v._default]),
      )
      const setParams = vi.fn((newParams: Record<string, unknown>) => {
        params = { ...params, ...newParams }
      })
      return [params, setParams]
    }),
    parseAsString: {
      withDefault: (def: string) => ({ _default: def }),
    },
    parseAsArrayOf: () => ({ withDefault: (def: string[]) => ({ _default: def }) }),
  }
})

describe("usePopupState", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("should initialize with default values (single mode)", () => {
    const { result } = renderHook(() =>
      usePopupState({ popupId: "test", initialValue: "", valueKey: "test-value" }),
    )
    expect(result.current.isOpen).toBe(false)
    expect(result.current.value).toBe("")
  })

  it("should initialize with default values (range mode)", () => {
    const { result } = renderHook(() =>
      usePopupState({
        popupId: "test",
        initialValue: ["a", "b"],
        valueKey: "test-value",
        isRange: true,
      }),
    )
    expect(result.current.value).toEqual(["a", "b"])
  })

  it("should open and close the popup", () => {
    const onOpen = vi.fn()
    const onClose = vi.fn()
    const { result } = renderHook(() =>
      usePopupState({ popupId: "test", initialValue: "", onOpen, onClose }),
    )
    act(() => {
      result.current.open()
    })
    expect(onOpen).toHaveBeenCalled()
    act(() => {
      result.current.close()
    })
    expect(onClose).toHaveBeenCalled()
  })

  it("should toggle the popup", () => {
    const { result } = renderHook(() => usePopupState({ popupId: "test", initialValue: "" }))
    act(() => {
      result.current.open()
    })
    expect(result.current.isOpen).toBe(false)
    act(() => {
      result.current.toggle()
    })
  })

  it("should call close when toggle is called and isOpen is true", async () => {
    const onClose = vi.fn()
    vi.resetModules()
    vi.doMock("nuqs", () => {
      const actual = vi.importActual("nuqs")
      return {
        ...actual,
        useQueryStates: vi.fn(() => [{ test: "open", "test-value": "" }, vi.fn()]),
        parseAsString: {
          withDefault: (def: string) => ({ _default: def }),
        },
        parseAsArrayOf: () => ({ withDefault: (def: string[]) => ({ _default: def }) }),
      }
    })
    const { usePopupState } = await import("./usePopupState")
    const { result } = renderHook(() =>
      usePopupState({ popupId: "test", initialValue: "", onClose }),
    )
    act(() => {
      result.current.toggle()
    })
    expect(onClose).toHaveBeenCalled()
    vi.resetModules()
  })

  it("should set and clear value (single mode)", () => {
    const onValueChange = vi.fn()
    const { result } = renderHook(() =>
      usePopupState({ popupId: "test", initialValue: "", valueKey: "test-value", onValueChange }),
    )
    act(() => {
      result.current.setValue("foo")
    })
    expect(onValueChange).toHaveBeenCalledWith("foo")
    act(() => {
      result.current.clearValue()
    })
    expect(result.current.value).toBe("")
  })

  it("should set and clear value (range mode)", () => {
    const onValueChange = vi.fn()
    const { result } = renderHook(() =>
      usePopupState({
        popupId: "test",
        initialValue: [] as string[],
        valueKey: "test-value",
        isRange: true,
        onValueChange,
      }),
    )
    act(() => {
      result.current.setValue(["a", "b"] as string[])
    })
    expect(onValueChange).toHaveBeenCalledWith(["a", "b"])
    act(() => {
      result.current.clearValue()
    })
    expect(result.current.value).toEqual([])
  })

  it("should not call onValueChange when setting null/empty value (single mode)", () => {
    const onValueChange = vi.fn()
    const { result } = renderHook(() =>
      usePopupState({ popupId: "test", initialValue: "", valueKey: "test-value", onValueChange }),
    )
    act(() => {
      result.current.setValue(null)
    })
    expect(onValueChange).not.toHaveBeenCalled()
    act(() => {
      result.current.setValue("")
    })
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("should not call onValueChange when setting null/empty value (range mode)", () => {
    const onValueChange = vi.fn()
    const { result } = renderHook(() =>
      usePopupState({
        popupId: "test",
        initialValue: [] as string[],
        valueKey: "test-value",
        isRange: true,
        onValueChange,
      }),
    )
    act(() => {
      result.current.setValue(null)
    })
    expect(onValueChange).not.toHaveBeenCalled()
    act(() => {
      result.current.setValue([] as string[])
    })
    expect(onValueChange).toHaveBeenCalledWith([])
  })

  it("should handle navigation functions", () => {
    const { result } = renderHook(() => usePopupState({ popupId: "test", initialValue: "" }))
    act(() => {
      result.current.navigation.openPopup("foo")
    })
    act(() => {
      result.current.navigation.closePopup("foo")
    })
    act(() => {
      result.current.navigation.switchPopup("foo", "bar")
    })
  })

  it("should use correct parser config for string and array", () => {
    const { result } = renderHook(() =>
      usePopupState({ popupId: "test", initialValue: "abc", valueKey: "test-value" }),
    )
    expect(result.current.value).toBe("abc")
    const { result: arrResult } = renderHook(() =>
      usePopupState({
        popupId: "test",
        initialValue: ["x"] as string[],
        valueKey: "test-value",
        isRange: true,
      }),
    )
    expect(arrResult.current.value).toEqual(["x"])
  })

  it("should call onValueChange for range only if value is truthy", () => {
    const onValueChange = vi.fn()
    const { result } = renderHook(() =>
      usePopupState({
        popupId: "test",
        initialValue: [] as string[],
        valueKey: "test-value",
        isRange: true,
        onValueChange,
      }),
    )
    act(() => {
      result.current.setValue([] as string[])
    })
    expect(onValueChange).toHaveBeenCalledWith([])
    act(() => {
      result.current.setValue(["a"] as string[])
    })
    expect(onValueChange).toHaveBeenCalledWith(["a"])
  })

  it("should handle initialValue that is not string or array", () => {
    const { result } = renderHook(() =>
      usePopupState({
        popupId: "test",
        initialValue: 123 as unknown as string,
        valueKey: "test-value",
      }),
    )
    expect(result.current.value).toBe("")
  })

  it("should default to [] if isRange is true and initialValue is not an array", () => {
    const { result } = renderHook(() =>
      usePopupState({
        popupId: "test",
        initialValue: "not-an-array" as unknown as string[],
        valueKey: "test-value",
        isRange: true,
      }),
    )
    expect(result.current.value).toEqual([])
  })
})
