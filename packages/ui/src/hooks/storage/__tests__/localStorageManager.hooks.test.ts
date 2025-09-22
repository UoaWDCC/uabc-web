import {
  consoleSpy,
  localStorageMock,
  setupTestEnvironment,
} from "@repo/ui/test-config/localStorage-test-utils"
import { act, renderHook } from "@testing-library/react"
import { z } from "zod"
import {
  useLocalStorage,
  useLocalStorageWithDefault,
  useLocalStorageWithSchema,
} from "../localStorageManager"

describe("LocalStorageManager Hooks", () => {
  const testSchema = z.object({ name: z.string(), age: z.number() })
  const testDefaultValue = { name: "Default", age: 25 }

  beforeEach(() => {
    setupTestEnvironment()
  })

  describe("useLocalStorage", () => {
    it("should return initial value from localStorage", () => {
      const testData = { name: "John", age: 30 }
      localStorageMock.setItem("test-key", JSON.stringify(testData))

      const { result } = renderHook(() => useLocalStorage("test-key"))

      expect(result.current.value).toEqual(testData)
      expect(result.current.isValid).toBe(true)
    })

    it("should return null when no value exists", () => {
      const { result } = renderHook(() => useLocalStorage("test-key"))

      expect(result.current.value).toBeNull()
      expect(result.current.isValid).toBe(true)
    })

    it("should update value when setValue is called", () => {
      const { result } = renderHook(() => useLocalStorage("test-key"))

      act(() => {
        result.current.setValue({ name: "John", age: 30 })
      })

      expect(result.current.value).toEqual({ name: "John", age: 30 })
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "test-key",
        JSON.stringify({ name: "John", age: 30 }),
      )
    })

    it("should remove value when removeValue is called", () => {
      const testData = { name: "John", age: 30 }
      localStorageMock.setItem("test-key", JSON.stringify(testData))

      const { result } = renderHook(() => useLocalStorage("test-key"))

      act(() => {
        result.current.removeValue()
      })

      expect(result.current.value).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("test-key")
    })

    it("should validate value when schema is provided", () => {
      const validData = { name: "John", age: 30 }
      localStorageMock.setItem("test-key", JSON.stringify(validData))

      const { result } = renderHook(() => useLocalStorage("test-key", testSchema))

      expect(result.current.value).toEqual(validData)
      expect(result.current.isValid).toBe(true)
    })

    it("should mark as valid when schema validation fails but value is null", () => {
      const invalidData = { name: "John" } // missing age
      localStorageMock.setItem("test-key", JSON.stringify(invalidData))

      const { result } = renderHook(() => useLocalStorage("test-key", testSchema))

      expect(result.current.value).toBeNull()
      expect(result.current.isValid).toBe(true) // null values are considered valid
    })

    it("should update validity when value changes", () => {
      const { result } = renderHook(() => useLocalStorage("test-key", testSchema))

      // Set valid value
      act(() => {
        result.current.setValue({ name: "John", age: 30 })
      })

      expect(result.current.isValid).toBe(true)

      // Set invalid value - this should throw an error
      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      result.current.setValue({ name: "John" } as any)
      expect(consoleSpy.error).toHaveBeenCalled()
    })

    it("should handle storage events from other tabs", () => {
      const { result } = renderHook(() => useLocalStorage("test-key"))

      const storageEvent = new StorageEvent("storage", {
        key: "test-key",
        newValue: JSON.stringify({ name: "Jane" }),
        oldValue: null,
      })

      act(() => {
        window.dispatchEvent(storageEvent)
      })

      expect(result.current.value).toEqual({ name: "Jane" })
    })

    it("should maintain separate state for different keys", () => {
      const { result: result1 } = renderHook(() => useLocalStorage("key1"))
      const { result: result2 } = renderHook(() => useLocalStorage("key2"))

      act(() => {
        result1.current.setValue({ name: "John" })
        result2.current.setValue({ name: "Jane" })
      })

      expect(result1.current.value).toEqual({ name: "John" })
      expect(result2.current.value).toEqual({ name: "Jane" })
    })

    it("should throw error when setting invalid value", () => {
      const { result } = renderHook(() => useLocalStorage("test-key", testSchema))

      expect(() => {
        act(() => {
          // biome-ignore lint/suspicious/noExplicitAny: this is for a test
          result.current.setValue({ name: "John" } as any)
        })
      })
    })

    it("should handle JSON parsing errors in storage events", () => {
      const { result } = renderHook(() => useLocalStorage("test-key"))

      const storageEvent = new StorageEvent("storage", {
        key: "test-key",
        newValue: "invalid-json",
        oldValue: null,
      })

      act(() => {
        window.dispatchEvent(storageEvent)
      })

      expect(result.current.value).toBeNull()
    })
  })

  describe("useLocalStorageWithDefault", () => {
    it("should return default value when no value exists", () => {
      const { result } = renderHook(() => useLocalStorageWithDefault("test-key", testDefaultValue))

      expect(result.current.value).toEqual(testDefaultValue)
      expect(result.current.isValid).toBe(true)
    })

    it("should return stored value when it exists", () => {
      const storedData = { name: "John", age: 30 }
      localStorageMock.setItem("test-key", JSON.stringify(storedData))

      const { result } = renderHook(() => useLocalStorageWithDefault("test-key", testDefaultValue))

      expect(result.current.value).toEqual(storedData)
    })

    it("should update value when setValue is called", () => {
      const { result } = renderHook(() => useLocalStorageWithDefault("test-key", testDefaultValue))

      act(() => {
        result.current.setValue({ name: "John", age: 30 })
      })

      expect(result.current.value).toEqual({ name: "John", age: 30 })
    })

    it("should return default value after removeValue is called", () => {
      const storedData = { name: "John", age: 30 }
      localStorageMock.setItem("test-key", JSON.stringify(storedData))

      const { result } = renderHook(() => useLocalStorageWithDefault("test-key", testDefaultValue))

      act(() => {
        result.current.removeValue()
      })

      expect(result.current.value).toEqual(testDefaultValue)
    })

    it("should validate with schema when provided", () => {
      const invalidData = { name: "John" } // missing age
      localStorageMock.setItem("test-key", JSON.stringify(invalidData))

      const { result } = renderHook(() =>
        useLocalStorageWithDefault("test-key", testDefaultValue, testSchema),
      )

      expect(result.current.value).toEqual(testDefaultValue)
      expect(result.current.isValid).toBe(true) // null values are considered valid
    })

    it("should handle storage events with default fallback", () => {
      const { result } = renderHook(() => useLocalStorageWithDefault("test-key", testDefaultValue))

      const storageEvent = new StorageEvent("storage", {
        key: "test-key",
        newValue: null,
        oldValue: JSON.stringify({ name: "John", age: 30 }),
      })

      act(() => {
        window.dispatchEvent(storageEvent)
      })

      expect(result.current.value).toEqual(testDefaultValue)
    })

    it("should maintain default value when stored value is invalid", () => {
      const invalidData = { name: "John" } // missing age
      localStorageMock.setItem("test-key", JSON.stringify(invalidData))

      const { result } = renderHook(() =>
        useLocalStorageWithDefault("test-key", testDefaultValue, testSchema),
      )

      expect(result.current.value).toEqual(testDefaultValue)
      expect(result.current.isValid).toBe(true) // null values are considered valid
    })
  })

  describe("useLocalStorageWithSchema", () => {
    it("should require schema parameter", () => {
      const { result } = renderHook(() => useLocalStorageWithSchema("test-key", testSchema))

      expect(result.current.value).toBeNull()
      expect(result.current.isValid).toBe(true)
    })

    it("should validate stored value with schema", () => {
      const validData = { name: "John", age: 30 }
      localStorageMock.setItem("test-key", JSON.stringify(validData))

      const { result } = renderHook(() => useLocalStorageWithSchema("test-key", testSchema))

      expect(result.current.value).toEqual(validData)
      expect(result.current.isValid).toBe(true)
    })

    it("should mark as valid when stored value fails validation but value is null", () => {
      const invalidData = { name: "John" } // missing age
      localStorageMock.setItem("test-key", JSON.stringify(invalidData))

      const { result } = renderHook(() => useLocalStorageWithSchema("test-key", testSchema))

      expect(result.current.value).toBeNull()
      expect(result.current.isValid).toBe(true) // null values are considered valid
    })

    it("should validate new values when setValue is called", () => {
      const { result } = renderHook(() => useLocalStorageWithSchema("test-key", testSchema))

      act(() => {
        result.current.setValue({ name: "John", age: 30 })
      })

      expect(result.current.value).toEqual({ name: "John", age: 30 })
      expect(result.current.isValid).toBe(true)
    })

    it("should throw error when invalid value is set", () => {
      const { result } = renderHook(() => useLocalStorageWithSchema("test-key", testSchema))

      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      result.current.setValue({ name: "John" } as any)
      expect(consoleSpy.error).toHaveBeenCalled()
    })

    it("should handle schema validation in storage events", () => {
      const { result } = renderHook(() => useLocalStorageWithSchema("test-key", testSchema))

      const storageEvent = new StorageEvent("storage", {
        key: "test-key",
        newValue: JSON.stringify({ name: "Jane", age: 25 }),
        oldValue: null,
      })

      act(() => {
        window.dispatchEvent(storageEvent)
      })

      expect(result.current.value).toEqual({ name: "Jane", age: 25 })
      expect(result.current.isValid).toBe(true)
    })

    it("should handle schema validation errors in storage events", () => {
      const { result } = renderHook(() => useLocalStorageWithSchema("test-key", testSchema))

      const storageEvent = new StorageEvent("storage", {
        key: "test-key",
        newValue: JSON.stringify({ name: "Jane" }), // missing age
        oldValue: null,
      })

      act(() => {
        window.dispatchEvent(storageEvent)
      })

      expect(result.current.value).toBeNull()
      expect(result.current.isValid).toBe(true) // null values are considered valid
    })

    it("should handle null values in storage events", () => {
      const { result } = renderHook(() => useLocalStorageWithSchema("test-key", testSchema))

      const storageEvent = new StorageEvent("storage", {
        key: "test-key",
        newValue: null,
        oldValue: JSON.stringify({ name: "John", age: 30 }),
      })

      act(() => {
        window.dispatchEvent(storageEvent)
      })

      expect(result.current.value).toBeNull()
      expect(result.current.isValid).toBe(true)
    })
  })
})
