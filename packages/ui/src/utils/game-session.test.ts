import { GameSessionStatus } from "@repo/shared"
import { formatTime, getStatusColor } from "./game-session"

describe("game-session utilities", () => {
  describe("getStatusColor", () => {
    it("returns correct color for ongoing status", () => {
      expect(getStatusColor(GameSessionStatus.ONGOING)).toBe("green")
    })

    it("returns correct color for upcoming status", () => {
      expect(getStatusColor(GameSessionStatus.UPCOMING)).toBe("blue")
    })

    it("returns correct color for past status", () => {
      expect(getStatusColor(GameSessionStatus.PAST)).toBe("gray")
    })

    it("returns gray for unknown status", () => {
      expect(getStatusColor("unknown" as GameSessionStatus)).toBe("gray")
    })
  })

  describe("formatTime", () => {
    it("formats morning time correctly", () => {
      expect(formatTime("2025-01-21T09:30:00Z")).toBe("9:30 AM")
    })

    it("formats afternoon time correctly", () => {
      expect(formatTime("2025-01-21T14:30:00Z")).toBe("2:30 PM")
    })

    it("formats evening time correctly", () => {
      expect(formatTime("2025-01-21T19:30:00Z")).toBe("7:30 PM")
    })

    it("formats midnight correctly", () => {
      expect(formatTime("2025-01-21T00:00:00Z")).toBe("12:00 AM")
    })

    it("formats noon correctly", () => {
      expect(formatTime("2025-01-21T12:00:00Z")).toBe("12:00 PM")
    })

    it("handles different timezone formats", () => {
      expect(formatTime("2025-01-21T19:30:00+00:00")).toBe("7:30 PM")
      expect(formatTime("2025-01-21T19:30:00.000Z")).toBe("7:30 PM")
    })
  })
})
