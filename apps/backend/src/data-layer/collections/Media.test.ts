import type { AccessArgs } from "payload"
import { Media } from "./Media"

describe("Media Collection", () => {
  it("should be defined", () => {
    expect(Media).toBeDefined()
  })

  it("should allow read access", () => {
    expect(Media.access?.read?.({} as AccessArgs)).toBe(true)
  })
})
