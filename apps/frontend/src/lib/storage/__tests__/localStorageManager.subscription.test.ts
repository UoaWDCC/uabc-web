import { z } from "zod"
import {
  cleanupTestEnvironment,
  consoleSpy,
  setupTestEnvironment,
} from "@/test-config/localStorage-test-utils"
import { createLocalStorageManager } from "../localStorageManager"

describe("LocalStorageManager Subscription", () => {
  beforeEach(() => {
    setupTestEnvironment()
  })

  afterEach(() => {
    cleanupTestEnvironment()
  })

  describe("subscribe", () => {
    it("should subscribe to changes and return unsubscribe function", () => {
      const manager = createLocalStorageManager("test-key")
      const listener = vi.fn()

      const unsubscribe = manager.subscribe(listener)

      expect(typeof unsubscribe).toBe("function")
    })

    it("should notify listeners when value changes", () => {
      const manager = createLocalStorageManager("test-key")
      const listener = vi.fn()

      manager.subscribe(listener)
      manager.setValue({ name: "John" })

      expect(listener).toHaveBeenCalledWith({ name: "John" })
    })

    it("should notify listeners when value is removed", () => {
      const manager = createLocalStorageManager("test-key")
      const listener = vi.fn()

      manager.subscribe(listener)
      manager.setValue(null)

      expect(listener).toHaveBeenCalledWith(null)
    })

    it("should handle storage events from other tabs", () => {
      const manager = createLocalStorageManager("test-key")
      const listener = vi.fn()

      manager.subscribe(listener)

      const storageEvent = new StorageEvent("storage", {
        key: "test-key",
        newValue: JSON.stringify({ name: "Jane" }),
        oldValue: JSON.stringify({ name: "John" }),
      })

      window.dispatchEvent(storageEvent)

      expect(listener).toHaveBeenCalledWith({ name: "Jane" })
    })

    it("should ignore storage events for different keys", () => {
      const manager = createLocalStorageManager("test-key")
      const listener = vi.fn()

      manager.subscribe(listener)

      const storageEvent = new StorageEvent("storage", {
        key: "different-key",
        newValue: JSON.stringify({ name: "Jane" }),
        oldValue: JSON.stringify({ name: "John" }),
      })

      window.dispatchEvent(storageEvent)

      expect(listener).not.toHaveBeenCalled()
    })

    it("should handle invalid JSON in storage events", () => {
      const manager = createLocalStorageManager("test-key")
      const listener = vi.fn()

      manager.subscribe(listener)

      const storageEvent = new StorageEvent("storage", {
        key: "test-key",
        newValue: "invalid-json",
        oldValue: null,
      })

      window.dispatchEvent(storageEvent)

      expect(listener).toHaveBeenCalledWith(null)
    })

    it("should validate storage event values when schema is provided", () => {
      const schema = z.object({ name: z.string() })
      const manager = createLocalStorageManager("test-key", schema)
      const listener = vi.fn()

      manager.subscribe(listener)

      const storageEvent = new StorageEvent("storage", {
        key: "test-key",
        newValue: JSON.stringify({ name: "Jane" }),
        oldValue: null,
      })

      window.dispatchEvent(storageEvent)

      expect(listener).toHaveBeenCalledWith({ name: "Jane" })
    })

    it("should handle schema validation errors in storage events", () => {
      const schema = z.object({ name: z.string(), age: z.number() })
      const manager = createLocalStorageManager("test-key", schema)
      const listener = vi.fn()

      manager.subscribe(listener)

      const storageEvent = new StorageEvent("storage", {
        key: "test-key",
        newValue: JSON.stringify({ name: "Jane" }), // missing age
        oldValue: null,
      })

      window.dispatchEvent(storageEvent)

      expect(listener).toHaveBeenCalledWith(null)
    })

    it("should handle listener errors gracefully", () => {
      const manager = createLocalStorageManager("test-key")
      const listener = vi.fn().mockImplementation(() => {
        throw new Error("Listener error")
      })

      manager.subscribe(listener)

      expect(() => manager.setValue({ name: "John" })).not.toThrow()
      expect(consoleSpy.error).toHaveBeenCalledWith(
        "LocalStorage listener error:",
        expect.any(Error),
      )
    })

    it("should properly manage storage event listeners", () => {
      const manager = createLocalStorageManager("test-key")
      const listener1 = vi.fn()
      const listener2 = vi.fn()

      const unsubscribe1 = manager.subscribe(listener1)
      const unsubscribe2 = manager.subscribe(listener2)

      // Both listeners should be active
      expect(listener1).toHaveBeenCalledWith({ name: "John" })
      expect(listener2).toHaveBeenCalledWith({ name: "John" })

      unsubscribe1()
      manager.setValue({ name: "Jane" })
      expect(listener1).not.toHaveBeenCalledWith({ name: "Jane" })
      expect(listener2).toHaveBeenCalledWith({ name: "Jane" })

      unsubscribe2()
      manager.setValue({ name: "Bob" })
      expect(listener1).not.toHaveBeenCalledWith({ name: "Bob" })
      expect(listener2).not.toHaveBeenCalledWith({ name: "Bob" })
    })

    it("should handle multiple subscriptions to the same manager", () => {
      const manager = createLocalStorageManager("test-key")
      const listener1 = vi.fn()
      const listener2 = vi.fn()
      const listener3 = vi.fn()

      const unsubscribe1 = manager.subscribe(listener1)
      const unsubscribe2 = manager.subscribe(listener2)
      const unsubscribe3 = manager.subscribe(listener3)

      manager.setValue({ name: "John" })

      expect(listener1).toHaveBeenCalledWith({ name: "John" })
      expect(listener2).toHaveBeenCalledWith({ name: "John" })
      expect(listener3).toHaveBeenCalledWith({ name: "John" })

      unsubscribe2()
      manager.setValue({ name: "Jane" })

      expect(listener1).toHaveBeenCalledWith({ name: "Jane" })
      expect(listener2).not.toHaveBeenCalledWith({ name: "Jane" })
      expect(listener3).toHaveBeenCalledWith({ name: "Jane" })

      unsubscribe1()
      unsubscribe3()
      manager.setValue({ name: "Bob" })

      expect(listener1).not.toHaveBeenCalledWith({ name: "Bob" })
      expect(listener2).not.toHaveBeenCalledWith({ name: "Bob" })
      expect(listener3).not.toHaveBeenCalledWith({ name: "Bob" })
    })

    it("should handle storage events with null values", () => {
      const manager = createLocalStorageManager("test-key")
      const listener = vi.fn()

      manager.subscribe(listener)

      const storageEvent = new StorageEvent("storage", {
        key: "test-key",
        newValue: null,
        oldValue: JSON.stringify({ name: "John" }),
      })

      window.dispatchEvent(storageEvent)

      expect(listener).toHaveBeenCalledWith(null)
    })

    it("should handle storage events with undefined values", () => {
      const manager = createLocalStorageManager("test-key")
      const listener = vi.fn()

      manager.subscribe(listener)

      const storageEvent = new StorageEvent("storage", {
        key: "test-key",
        // biome-ignore lint/suspicious/noExplicitAny: this is for a test
        newValue: undefined as any,
        oldValue: JSON.stringify({ name: "John" }),
      })

      window.dispatchEvent(storageEvent)

      expect(listener).toHaveBeenCalledWith(null)
    })
  })
})
