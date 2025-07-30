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

export const consoleSpy = {
  log: vi.spyOn(console, "log").mockImplementation(() => {}),
  warn: vi.spyOn(console, "warn").mockImplementation(() => {}),
  error: vi.spyOn(console, "error").mockImplementation(() => {}),
}

export const setupTestEnvironment = () => {
  vi.clearAllMocks()
  localStorageMock.clear()
}

export const cleanupTestEnvironment = () => {
  consoleSpy.log.mockClear()
  consoleSpy.warn.mockClear()
  consoleSpy.error.mockClear()
}
