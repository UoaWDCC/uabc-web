import { act, renderHook } from "@testing-library/react"
import { z } from "zod"
import { localStorageMock, setupTestEnvironment } from "@/test-config/localStorage-test-utils"
import {
  useLocalStorage,
  useLocalStorageWithDefault,
  useLocalStorageWithSchema,
} from "../localStorageManager"

describe("LocalStorageManager Hooks", () => {
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
      const schema = z.object({ name: z.string(), age: z.number() })
      const validData = { name: "John", age: 30 }
      localStorageMock.setItem("test-key", JSON.stringify(validData))

      const { result } = renderHook(() => useLocalStorage("test-key", schema))

      expect(result.current.value).toEqual(validData)
      expect(result.current.isValid).toBe(true)
    })

    it("should mark as valid when schema validation fails but value is null", () => {
      const schema = z.object({ name: z.string(), age: z.number() })
      const invalidData = { name: "John" } // missing age
      localStorageMock.setItem("test-key", JSON.stringify(invalidData))

      const { result } = renderHook(() => useLocalStorage("test-key", schema))

      expect(result.current.value).toBeNull()
      expect(result.current.isValid).toBe(true) // null values are considered valid
    })

    it("should update validity when value changes", () => {
      const schema = z.object({ name: z.string(), age: z.number() })
      const { result } = renderHook(() => useLocalStorage("test-key", schema))

      // Set valid value
      act(() => {
        result.current.setValue({ name: "John", age: 30 })
      })

      expect(result.current.isValid).toBe(true)

      // Set invalid value - this should throw an error
      expect(() => {
        act(() => {
          // biome-ignore lint/suspicious/noExplicitAny: this is for a test
          result.current.setValue({ name: "John" } as any)
        })
      }).toThrow()
    })

    it("should handle storage events from other tabs", () => {
      const { result } = renderHook(() => useLocalStorage("test-key"))

      // Simulate storage event from another tab
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
      const schema = z.object({ name: z.string(), age: z.number() })
      const { result } = renderHook(() => useLocalStorage("test-key", schema))

      expect(() => {
        act(() => {
          // biome-ignore lint/suspicious/noExplicitAny: this is for a test
          result.current.setValue({ name: "John" } as any)
        })
      }).toThrow()
    })

    it("should handle JSON parsing errors in storage events", () => {
      const { result } = renderHook(() => useLocalStorage("test-key"))

      // Simulate storage event with invalid JSON
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
      const defaultValue = { name: "Default", age: 25 }
      const { result } = renderHook(() => useLocalStorageWithDefault("test-key", defaultValue))

      expect(result.current.value).toEqual(defaultValue)
      expect(result.current.isValid).toBe(true)
    })

    it("should return stored value when it exists", () => {
      const storedData = { name: "John", age: 30 }
      const defaultValue = { name: "Default", age: 25 }
      localStorageMock.setItem("test-key", JSON.stringify(storedData))

      const { result } = renderHook(() => useLocalStorageWithDefault("test-key", defaultValue))

      expect(result.current.value).toEqual(storedData)
    })

    it("should update value when setValue is called", () => {
      const defaultValue = { name: "Default", age: 25 }
      const { result } = renderHook(() => useLocalStorageWithDefault("test-key", defaultValue))

      act(() => {
        result.current.setValue({ name: "John", age: 30 })
      })

      expect(result.current.value).toEqual({ name: "John", age: 30 })
    })

    it("should return default value after removeValue is called", () => {
      const defaultValue = { name: "Default", age: 25 }
      const storedData = { name: "John", age: 30 }
      localStorageMock.setItem("test-key", JSON.stringify(storedData))

      const { result } = renderHook(() => useLocalStorageWithDefault("test-key", defaultValue))

      act(() => {
        result.current.removeValue()
      })

      expect(result.current.value).toEqual(defaultValue)
    })

    it("should validate with schema when provided", () => {
      const schema = z.object({ name: z.string(), age: z.number() })
      const defaultValue = { name: "Default", age: 25 }
      const invalidData = { name: "John" } // missing age
      localStorageMock.setItem("test-key", JSON.stringify(invalidData))

      const { result } = renderHook(() =>
        useLocalStorageWithDefault("test-key", defaultValue, schema),
      )

      expect(result.current.value).toEqual(defaultValue)
      expect(result.current.isValid).toBe(true) // null values are considered valid
    })

    it("should handle storage events with default fallback", () => {
      const defaultValue = { name: "Default", age: 25 }
      const { result } = renderHook(() => useLocalStorageWithDefault("test-key", defaultValue))

      // Simulate storage event that removes the value
      const storageEvent = new StorageEvent("storage", {
        key: "test-key",
        newValue: null,
        oldValue: JSON.stringify({ name: "John", age: 30 }),
      })

      act(() => {
        window.dispatchEvent(storageEvent)
      })

      expect(result.current.value).toEqual(defaultValue)
    })

    it("should maintain default value when stored value is invalid", () => {
      const schema = z.object({ name: z.string(), age: z.number() })
      const defaultValue = { name: "Default", age: 25 }
      const invalidData = { name: "John" } // missing age
      localStorageMock.setItem("test-key", JSON.stringify(invalidData))

      const { result } = renderHook(() =>
        useLocalStorageWithDefault("test-key", defaultValue, schema),
      )

      expect(result.current.value).toEqual(defaultValue)
      expect(result.current.isValid).toBe(true) // null values are considered valid
    })
  })

  describe("useLocalStorageWithSchema", () => {
    it("should require schema parameter", () => {
      const schema = z.object({ name: z.string(), age: z.number() })
      const { result } = renderHook(() => useLocalStorageWithSchema("test-key", schema))

      expect(result.current.value).toBeNull()
      expect(result.current.isValid).toBe(true)
    })

    it("should validate stored value with schema", () => {
      const schema = z.object({ name: z.string(), age: z.number() })
      const validData = { name: "John", age: 30 }
      localStorageMock.setItem("test-key", JSON.stringify(validData))

      const { result } = renderHook(() => useLocalStorageWithSchema("test-key", schema))

      expect(result.current.value).toEqual(validData)
      expect(result.current.isValid).toBe(true)
    })

    it("should mark as valid when stored value fails validation but value is null", () => {
      const schema = z.object({ name: z.string(), age: z.number() })
      const invalidData = { name: "John" } // missing age
      localStorageMock.setItem("test-key", JSON.stringify(invalidData))

      const { result } = renderHook(() => useLocalStorageWithSchema("test-key", schema))

      expect(result.current.value).toBeNull()
      expect(result.current.isValid).toBe(true) // null values are considered valid
    })

    it("should validate new values when setValue is called", () => {
      const schema = z.object({ name: z.string(), age: z.number() })
      const { result } = renderHook(() => useLocalStorageWithSchema("test-key", schema))

      act(() => {
        result.current.setValue({ name: "John", age: 30 })
      })

      expect(result.current.value).toEqual({ name: "John", age: 30 })
      expect(result.current.isValid).toBe(true)
    })

    it("should throw error when invalid value is set", () => {
      const schema = z.object({ name: z.string(), age: z.number() })
      const { result } = renderHook(() => useLocalStorageWithSchema("test-key", schema))

      expect(() => {
        act(() => {
          // biome-ignore lint/suspicious/noExplicitAny: this is for a test
          result.current.setValue({ name: "John" } as any)
        })
      }).toThrow()
    })

    it("should handle schema validation in storage events", () => {
      const schema = z.object({ name: z.string(), age: z.number() })
      const { result } = renderHook(() => useLocalStorageWithSchema("test-key", schema))

      // Simulate storage event with valid data
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
      const schema = z.object({ name: z.string(), age: z.number() })
      const { result } = renderHook(() => useLocalStorageWithSchema("test-key", schema))

      // Simulate storage event with invalid data
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
      const schema = z.object({ name: z.string(), age: z.number() })
      const { result } = renderHook(() => useLocalStorageWithSchema("test-key", schema))

      // Simulate storage event with null value
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
