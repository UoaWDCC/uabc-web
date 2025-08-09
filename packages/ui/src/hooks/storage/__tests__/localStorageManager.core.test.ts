import {
  consoleSpy,
  localStorageMock,
  setupTestEnvironment,
} from "@repo/ui/test-config/localStorage-test-utils"
import { z } from "zod"
import { createLocalStorageManager } from "../localStorageManager"

describe("LocalStorageManager Core", () => {
  beforeEach(() => {
    setupTestEnvironment()
  })

  describe("createLocalStorageManager", () => {
    it("should create a manager instance without schema", () => {
      const manager = createLocalStorageManager("test-key")
      expect(manager).toBeDefined()
      expect(typeof manager.getValue).toBe("function")
      expect(typeof manager.setValue).toBe("function")
      expect(typeof manager.removeValue).toBe("function")
      expect(typeof manager.subscribe).toBe("function")
    })

    it("should create a manager instance with schema", () => {
      const schema = z.object({ name: z.string(), age: z.number() })
      const manager = createLocalStorageManager("test-key", schema)
      expect(manager).toBeDefined()
    })
  })

  describe("getValue", () => {
    it("should return null when key does not exist", () => {
      const manager = createLocalStorageManager("non-existent-key")
      const value = manager.getValue()
      expect(value).toBeNull()
    })

    it("should return parsed value when key exists", () => {
      const testData = { name: "John", age: 30 }
      localStorageMock.setItem("test-key", JSON.stringify(testData))

      const manager = createLocalStorageManager("test-key")
      const value = manager.getValue()

      expect(value).toEqual(testData)
    })

    it("should return null when localStorage is not available (SSR)", () => {
      const originalWindow = global.window
      // @ts-expect-error - mocking window for SSR test
      delete global.window

      const manager = createLocalStorageManager("test-key")
      const value = manager.getValue()

      expect(value).toBeNull()

      global.window = originalWindow
    })

    it("should return null when JSON parsing fails", () => {
      localStorageMock.setItem("test-key", "invalid-json")

      const manager = createLocalStorageManager("test-key")
      const value = manager.getValue()

      expect(value).toBeNull()
    })

    it("should validate and return value when schema is provided", () => {
      const schema = z.object({ name: z.string(), age: z.number() })
      const validData = { name: "John", age: 30 }
      localStorageMock.setItem("test-key", JSON.stringify(validData))

      const manager = createLocalStorageManager("test-key", schema)
      const value = manager.getValue()

      expect(value).toEqual(validData)
    })

    it("should return null when schema validation fails", () => {
      const schema = z.object({ name: z.string(), age: z.number() })
      const invalidData = { name: "John" } // missing age
      localStorageMock.setItem("test-key", JSON.stringify(invalidData))

      const manager = createLocalStorageManager("test-key", schema)
      const value = manager.getValue()

      expect(value).toBeNull()
    })
  })

  describe("setValue", () => {
    it("should set value in localStorage", () => {
      const manager = createLocalStorageManager("test-key")
      const testData = { name: "John", age: 30 }

      manager.setValue(testData)

      expect(localStorageMock.setItem).toHaveBeenCalledWith("test-key", JSON.stringify(testData))
    })

    it("should remove item when value is null", () => {
      const manager = createLocalStorageManager("test-key")

      manager.setValue(null)

      expect(localStorageMock.removeItem).toHaveBeenCalledWith("test-key")
    })

    it("should validate value when schema is provided", () => {
      const schema = z.object({ name: z.string(), age: z.number() })
      const manager = createLocalStorageManager("test-key", schema)
      const validData = { name: "John", age: 30 }

      manager.setValue(validData)

      expect(localStorageMock.setItem).toHaveBeenCalledWith("test-key", JSON.stringify(validData))
    })

    it("should throw error when schema validation fails", () => {
      const schema = z.object({ name: z.string(), age: z.number() })
      const manager = createLocalStorageManager("test-key", schema)

      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      const invalidData = { name: "John" } as any // missing age

      expect(() => manager.setValue(invalidData)).toThrow()
    })

    it("should warn and return early in SSR environment", () => {
      const originalWindow = global.window
      // @ts-expect-error - mocking window for SSR test
      delete global.window

      const manager = createLocalStorageManager("test-key")
      const testData = { name: "John" }

      manager.setValue(testData)

      expect(consoleSpy.warn).toHaveBeenCalledWith("setValue called in SSR environment")

      global.window = originalWindow
    })

    it("should handle JSON serialization errors", () => {
      const manager = createLocalStorageManager("test-key")
      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      const circularObject: any = {}
      circularObject.self = circularObject

      expect(() => manager.setValue(circularObject)).toThrow()
      expect(consoleSpy.error).toHaveBeenCalled()
    })
  })

  describe("removeValue", () => {
    it("should remove value from localStorage", () => {
      const manager = createLocalStorageManager("test-key")

      manager.removeValue()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith("test-key")
    })

    it("should not throw in SSR environment", () => {
      const originalWindow = global.window
      // @ts-expect-error - mocking window for SSR test
      delete global.window

      const manager = createLocalStorageManager("test-key")

      expect(() => manager.removeValue()).not.toThrow()

      global.window = originalWindow
    })
  })
})
