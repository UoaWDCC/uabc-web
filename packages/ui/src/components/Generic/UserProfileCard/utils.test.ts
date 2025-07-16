import type { SelectItem } from "@yamada-ui/react"
import { getDisplayValue } from "./utils"

describe("getDisplayValue", () => {
  const items: SelectItem[] = [
    { value: "a", label: "A" },
    { value: "b", label: "B" },
    {
      label: "Group",
      items: [
        { value: "c", label: "C" },
        { value: "d", label: "D" },
      ],
    },
  ]

  it("returns label for single value", () => {
    expect(getDisplayValue(items, "a")).toBe("A")
    expect(getDisplayValue(items, "c")).toBe("C")
  })

  it("returns labels for multiple values", () => {
    expect(getDisplayValue(items, ["a", "b"]).toString()).toBe("A, B")
    expect(getDisplayValue(items, ["c", "d"]).toString()).toBe("C, D")
  })

  it("returns empty string for unknown value", () => {
    expect(getDisplayValue(items, "z")).toBe("")
  })

  it("skips unknown values in array and only returns known labels", () => {
    expect(getDisplayValue(items, ["a", "z", "b"]).toString()).toBe("A, B")
    expect(getDisplayValue(items, ["z", "c", "y"]).toString()).toBe("C")
    expect(getDisplayValue(items, ["z", "y"]).toString()).toBe("")
  })
})
