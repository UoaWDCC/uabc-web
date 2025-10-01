import { describe, expect, it } from "vitest"

import { buildCsv, escapeCsvValue } from "./index"

describe("escapeCsvValue", () => {
  it("wraps values containing commas in quotes", () => {
    expect(escapeCsvValue("hello,world")).toBe('"hello,world"')
  })

  it("doubles embedded quotes", () => {
    expect(escapeCsvValue('He said "hi"')).toBe('"He said ""hi"""')
  })

  it("wraps values with newlines in quotes", () => {
    expect(escapeCsvValue("first\nsecond")).toBe('"first\nsecond"')
  })

  it("returns empty string for nullish values", () => {
    expect(escapeCsvValue(undefined)).toBe("")
    expect(escapeCsvValue(null)).toBe("")
  })
})

describe("buildCsv", () => {
  it("builds CSV content with escaped cells", () => {
    const rows = [
      ["Name", "Value"],
      ["Foo", "Bar"],
      ["Needs,Escape", 'He said "hi"'],
      ["Multiline", "Line 1\nLine 2"],
      ["Missing", null],
    ]

    expect(buildCsv(rows)).toBe(
      [
        "Name,Value",
        "Foo,Bar",
        '"Needs,Escape","He said ""hi"""',
        'Multiline,"Line 1\nLine 2"',
        "Missing,",
      ].join("\n"),
    )
  })
})
