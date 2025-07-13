import { noop } from "@yamada-ui/react"
import { vi } from "vitest"
import "@testing-library/jest-dom/vitest"

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

global.TextEncoder = require("node:util").TextEncoder

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}))

vi.spyOn(window.HTMLCanvasElement.prototype, "getContext").mockImplementation(() => null)

if (!globalThis.location) {
  globalThis.location = {
    ...window.location,
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
    search: "",
    hash: "",
    href: "http://localhost/",
    pathname: "/",
    protocol: "http:",
    host: "localhost",
    hostname: "localhost",
    port: "",
    origin: "http://localhost",
  }
}
