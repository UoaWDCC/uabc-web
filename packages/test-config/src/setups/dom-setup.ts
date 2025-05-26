import { noop } from "@yamada-ui/react"
import { vi } from "vitest"
import "@testing-library/jest-dom"
import { TextEncoder } from "node:util"

const { getComputedStyle } = window

window.getComputedStyle = (elt) => getComputedStyle(elt)
window.Element.prototype.scrollTo = noop
window.scrollTo = noop

if (typeof window.matchMedia !== "function") {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    enumerable: true,
    value: vi.fn().mockImplementation((query) => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches: false,
      media: query,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
      onchange: null,
    })),
    writable: true,
  })
}

global.TextEncoder = TextEncoder

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}))

// Only add this back when required
// window.HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation(() => null)
// vi.spyOn(window.HTMLCanvasElement.prototype, "getContext").mockImplementation(() => null)
