import { isPathActive, isPathEqual, normalizePath } from "./path"

describe("path utilities", () => {
  describe("normalizePath", () => {
    it("should remove trailing slashes", () => {
      expect(normalizePath("/about/")).toBe("/about")
      expect(normalizePath("/about///")).toBe("/about")
      expect(normalizePath("/")).toBe("/")
    })

    it("should handle paths without trailing slashes", () => {
      expect(normalizePath("/about")).toBe("/about")
      expect(normalizePath("/")).toBe("/")
    })

    it("should handle empty paths", () => {
      expect(normalizePath("")).toBe("/")
    })
  })

  describe("isPathEqual", () => {
    it("should return true for equivalent paths with different trailing slashes", () => {
      expect(isPathEqual("/about", "/about/")).toBe(true)
      expect(isPathEqual("/about/", "/about")).toBe(true)
      expect(isPathEqual("/about///", "/about")).toBe(true)
      expect(isPathEqual("/", "/")).toBe(true)
      expect(isPathEqual("/", "")).toBe(true)
    })

    it("should return false for different paths", () => {
      expect(isPathEqual("/about", "/contact")).toBe(false)
      expect(isPathEqual("/about", "/about/contact")).toBe(false)
    })
  })

  describe("isPathActive", () => {
    it("should return true for active paths", () => {
      expect(isPathActive("/about", "/about")).toBe(true)
      expect(isPathActive("/about/", "/about")).toBe(true)
      expect(isPathActive("/about", "/about/")).toBe(true)
      expect(isPathActive("/", "/")).toBe(true)
    })

    it("should return false for inactive paths", () => {
      expect(isPathActive("/about", "/contact")).toBe(false)
      expect(isPathActive("/about/", "/contact")).toBe(false)
      expect(isPathActive("/about", "/about/contact")).toBe(false)
    })
  })
})
