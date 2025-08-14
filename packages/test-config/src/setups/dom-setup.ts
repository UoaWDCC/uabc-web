import { noop } from "@yamada-ui/react"
import "@testing-library/jest-dom"
import { TextEncoder as NodeTextEncoder } from "node:util"

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

if (typeof globalThis.TextEncoder !== "function") {
  globalThis.TextEncoder = NodeTextEncoder as unknown as typeof globalThis.TextEncoder
}

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}))

// Only add this back when required
// window.HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation(() => null)
// vi.spyOn(window.HTMLCanvasElement.prototype, "getContext").mockImplementation(() => null)
