import { describe, expect, it } from "vitest"

import { buildCsv, buildCsvFromRecords, escapeCsvValue } from "./index"

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

describe("buildCsvFromRecords", () => {
  it("builds CSV from array of objects with all fields", () => {
    const records = [
      { id: "1", name: "John Doe", email: "john@example.com", role: "admin" },
      { id: "2", name: "Jane Smith", email: "jane@example.com", role: "user", level: "advanced" },
    ]

    const result = buildCsvFromRecords(records)
    const lines = result.split("\n")

    // Should include all unique keys from all objects
    expect(lines[0]).toBe("id,name,email,role,level")
    expect(lines[1]).toBe("1,John Doe,john@example.com,admin,")
    expect(lines[2]).toBe("2,Jane Smith,jane@example.com,user,advanced")
  })

  it("handles empty array", () => {
    expect(buildCsvFromRecords([])).toBe("")
  })

  it("handles records with special characters", () => {
    const records = [{ name: "Test, User", comment: 'Said "hello"' }]

    const result = buildCsvFromRecords(records)
    expect(result).toBe('name,comment\n"Test, User","Said ""hello"""')
  })

  it("handles null and undefined values", () => {
    const records = [{ name: "John", age: null, city: undefined }]

    const result = buildCsvFromRecords(records)
    expect(result).toBe("name,age,city\nJohn,,")
  })
})
