import { GameSessionStatus } from "@repo/shared"
import { getStatusColor } from "./game-session"

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
})
