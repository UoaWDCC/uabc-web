import type { SessionItem } from "./SelectACourt"
import { getNextSelection, processSessions } from "./Utils"

describe("processSessions", () => {
  const sessions: SessionItem[] = [
    {
      label: "Session 1",
      memberAttendees: "2",
      casualAttendees: "1",
      value: "s1",
      addon: "",
      description: "",
    },
    {
      label: "Session 2",
      memberAttendees: "3",
      casualAttendees: "2",
      value: "s2",
      addon: "",
      description: "",
      disabled: true,
    },
  ]

  it("should set memberAttendees and casualAttendees for members", () => {
    const result = processSessions(sessions, ["s1"], true, false)
    expect(result[0].memberAttendees).toBe("2")
    expect(result[0].casualAttendees).toBe("1")
  })

  it("should unset memberAttendees and casualAttendees for casuals", () => {
    const result = processSessions(sessions, ["s1"], false, false)
    expect(result[0].memberAttendees).toBeUndefined()
    expect(result[0].casualAttendees).toBeUndefined()
  })

  it("should disable sessions if capReached and not selected", () => {
    const result = processSessions(sessions, [], true, true)
    expect(result[0].disabled).toBe(true)
    expect(result[1].disabled).toBe(true)
  })
})

describe("getNextSelection", () => {
  it("should return next array for members within cap", () => {
    expect(getNextSelection(["s1", "s2"], ["s1"], true, 2)).toEqual(["s1", "s2"])
  })

  it("should return selected if next exceeds cap for members", () => {
    expect(getNextSelection(["s1", "s2", "s3"], ["s1", "s2"], true, 2)).toEqual(["s1", "s2"])
  })

  it("should return undefined if next is empty for members", () => {
    expect(getNextSelection([], ["s1"], true, 2)).toBeUndefined()
  })

  it("should toggle selection for casuals", () => {
    expect(getNextSelection(["s1"], ["s1"], false, 1)).toBeUndefined()
    expect(getNextSelection(["s2"], ["s1"], false, 1)).toBe("s2")
  })
})
