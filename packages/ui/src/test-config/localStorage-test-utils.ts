export const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
})

// Mock StorageEvent for test environment
if (typeof window.StorageEvent === "undefined") {
  interface StorageEventInit {
    key?: string | null
    newValue?: string | null
    oldValue?: string | null
    storageArea?: Storage | null
    url?: string
  }

  Object.defineProperty(window, "StorageEvent", {
    value: class StorageEvent extends Event {
      key: string | null
      newValue: string | null
      oldValue: string | null
      storageArea: Storage | null
      url: string

      constructor(type: string, eventInitDict?: StorageEventInit) {
        super(type, eventInitDict as EventInit)
        this.key = eventInitDict?.key ?? null
        this.newValue = eventInitDict?.newValue ?? null
        this.oldValue = eventInitDict?.oldValue ?? null
        this.storageArea = eventInitDict?.storageArea ?? null
        this.url = eventInitDict?.url ?? ""
      }
    },
    writable: true,
    configurable: true,
  })
}

export const consoleSpy = {
  log: vi.spyOn(console, "log").mockImplementation(() => {}),
  warn: vi.spyOn(console, "warn").mockImplementation(() => {}),
  error: vi.spyOn(console, "error").mockImplementation(() => {}),
  debug: vi.spyOn(console, "debug").mockImplementation(() => {}),
}

export const setupTestEnvironment = () => {
  vi.clearAllMocks()
  localStorageMock.clear()
}

export const cleanupTestEnvironment = () => {
  consoleSpy.log.mockClear()
  consoleSpy.warn.mockClear()
  consoleSpy.error.mockClear()
  consoleSpy.debug.mockClear()
}
