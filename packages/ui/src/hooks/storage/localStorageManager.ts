import React from "react"
import type { z } from "zod"

type Listener<T> = (value: T | null) => void
type Unsubscribe = () => void

interface LocalStorageEvent {
  key: string | null
  newValue: string | null
  oldValue: string | null
}

/**
 * Generic localStorage manager with Zod schema validation and change listening
 */
class LocalStorageManager<T> {
  private readonly key: string
  private readonly schema?: z.ZodSchema<T>
  private readonly listeners = new Set<Listener<T>>()
  private readonly storageChangeHandler: (event: LocalStorageEvent) => void
  private isListeningToStorage = false

  constructor(key: string, schema?: z.ZodSchema<T>) {
    this.key = key
    this.schema = schema
    this.storageChangeHandler = this.handleStorageChange.bind(this)
  }

  /**
   * Gets the current value from localStorage with optional schema validation
   */
  getValue(): T | null {
    if (typeof window === "undefined") {
      return null
    }

    try {
      const item = localStorage.getItem(this.key)
      if (item === null) {
        return null
      }

      const parsed = JSON.parse(item)
      return this.schema ? this.schema.parse(parsed) : parsed
    } catch {
      return null
    }
  }

  /**
   * Sets a value in localStorage with optional schema validation
   */
  setValue(value: T | null): void {
    if (typeof window === "undefined") {
      console.warn("setValue called in SSR environment")
      return
    }

    try {
      const oldValueStr = localStorage.getItem(this.key)
      let serialized: string | null = null
      if (value === null) {
        localStorage.removeItem(this.key)
      } else {
        const validated = this.schema ? this.schema.parse(value) : value
        serialized = JSON.stringify(validated)
        localStorage.setItem(this.key, serialized)
      }

      // Always notify listeners immediately for same-tab changes
      this.notifyListeners(value)

      // Manually dispatch a storage event so other manager instances in the same tab receive updates
      try {
        const newValueStr = value === null ? null : serialized
        if (typeof window !== "undefined" && typeof StorageEvent === "function") {
          const storageEvent = new StorageEvent("storage", {
            key: this.key,
            oldValue: oldValueStr,
            newValue: newValueStr,
          })
          window.dispatchEvent(storageEvent)
        }
      } catch (error) {
        console.debug("LocalStorage manual dispatch skipped:", error)
      }
    } catch (error) {
      console.error(`Error setting localStorage key ${this.key}:`, error)
    }
  }

  /**
   * Removes the value from localStorage
   */
  removeValue(): void {
    if (typeof window === "undefined") {
      return
    }

    const oldValueStr = localStorage.getItem(this.key)
    localStorage.removeItem(this.key)
    // Always notify listeners immediately for same-tab changes
    this.notifyListeners(null)

    // Manually dispatch a storage event so other manager instances in the same tab receive updates
    try {
      if (typeof window !== "undefined" && typeof StorageEvent === "function") {
        const storageEvent = new StorageEvent("storage", {
          key: this.key,
          oldValue: oldValueStr,
          newValue: null,
        })
        window.dispatchEvent(storageEvent)
      }
    } catch (error) {
      console.debug("LocalStorage manual dispatch skipped:", error)
    }
  }

  /**
   * Subscribes to localStorage changes for this key
   */
  subscribe(listener: Listener<T>): Unsubscribe {
    this.listeners.add(listener)

    // Only add storage event listener once per manager instance
    if (typeof window !== "undefined" && !this.isListeningToStorage) {
      window.addEventListener("storage", this.storageChangeHandler)
      this.isListeningToStorage = true
    }

    // Call listener with current value immediately upon subscription
    try {
      const currentValue = this.getValue()
      listener(currentValue)
    } catch (error) {
      console.error("LocalStorage listener error:", error)
    }

    return () => {
      this.listeners.delete(listener)

      // Only remove storage event listener when no more listeners exist
      if (typeof window !== "undefined" && this.listeners.size === 0 && this.isListeningToStorage) {
        window.removeEventListener("storage", this.storageChangeHandler)
        this.isListeningToStorage = false
      }
    }
  }

  /**
   * Handles storage change events and notifies listeners
   */
  private handleStorageChange(event: LocalStorageEvent): void {
    if (event.key !== this.key) {
      return
    }

    try {
      const newValue = event.newValue === null ? null : JSON.parse(event.newValue)
      const validated = this.schema && newValue !== null ? this.schema.parse(newValue) : newValue
      this.notifyListeners(validated)
    } catch {
      this.notifyListeners(null)
    }
  }

  /**
   * Notifies all listeners of value changes
   */
  private notifyListeners(value?: T | null): void {
    const currentValue = value ?? this.getValue()
    this.listeners.forEach((listener) => {
      try {
        listener(currentValue)
      } catch (error) {
        console.error("LocalStorage listener error:", error)
      }
    })
  }

  static isAvailable(): boolean {
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        return false
      }
      const testKey = "__ls_test__"
      window.localStorage.setItem(testKey, "1")
      window.localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }
}

/**
 * Creates a localStorage manager instance with optional Zod schema validation
 */
export function createLocalStorageManager<T>(
  key: string,
  schema?: z.ZodSchema<T>,
): LocalStorageManager<T> {
  return new LocalStorageManager(key, schema)
}

/**
 * React hook for localStorage with optional schema validation
 */
export function useLocalStorage<T>(
  key: string,
  schema?: z.ZodSchema<T>,
): {
  value: T | null
  setValue: (value: T | null) => void
  removeValue: () => void
  isValid: boolean
  isAvailable: boolean
} {
  const manager = React.useMemo(() => createLocalStorageManager(key, schema), [key, schema])
  const [value, setValue] = React.useState<T | null>(() => manager.getValue())
  const [isValid, setIsValid] = React.useState(() => {
    if (!schema) return true
    try {
      const currentValue = manager.getValue()
      if (currentValue === null) return true
      schema.parse(currentValue)
      return true
    } catch {
      return false
    }
  })

  React.useEffect(() => {
    const unsubscribe = manager.subscribe((newValue) => {
      setValue(newValue)
      if (schema) {
        try {
          if (newValue === null) {
            setIsValid(true)
          } else {
            schema.parse(newValue)
            setIsValid(true)
          }
        } catch {
          setIsValid(false)
        }
      }
    })

    return unsubscribe
  }, [manager, schema])

  const setStoredValue = React.useCallback(
    (newValue: T | null) => {
      manager.setValue(newValue)
    },
    [manager],
  )

  const removeStoredValue = React.useCallback(() => {
    manager.removeValue()
  }, [manager])

  return {
    value,
    setValue: setStoredValue,
    removeValue: removeStoredValue,
    isValid,
    isAvailable: LocalStorageManager.isAvailable(),
  }
}

/**
 * React hook for localStorage with default value and optional schema validation
 */
export function useLocalStorageWithDefault<T>(
  key: string,
  defaultValue: T,
  schema?: z.ZodSchema<T>,
): {
  value: T
  setValue: (value: T) => void
  removeValue: () => void
  isValid: boolean
  isAvailable: boolean
} {
  const { value, setValue, removeValue, isValid, isAvailable } = useLocalStorage(key, schema)
  return {
    value: value ?? defaultValue,
    setValue: (newValue: T) => setValue(newValue),
    removeValue,
    isValid,
    isAvailable,
  }
}

/**
 * React hook for localStorage with schema validation only
 */
export function useLocalStorageWithSchema<T>(
  key: string,
  schema: z.ZodSchema<T>,
): {
  value: T | null
  setValue: (value: T | null) => void
  removeValue: () => void
  isValid: boolean
  isAvailable: boolean
} {
  return useLocalStorage(key, schema)
}
