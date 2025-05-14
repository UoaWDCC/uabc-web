import { clampInterval, convertTo12HourFormat, formatFullDate, nzstParse } from "@/lib/utils/dates"

describe("convertTo12HourFormat", () => {
  // Test cases for HH:mm:ss format
  it("should convert 24-hour time with seconds to 12-hour format", () => {
    expect(convertTo12HourFormat("13:30:00")).toBe("1:30PM")
    expect(convertTo12HourFormat("00:30:00")).toBe("12:30AM")
    expect(convertTo12HourFormat("12:00:00")).toBe("12:00PM")
    expect(convertTo12HourFormat("23:59:59")).toBe("11:59PM")
  })

  // Test cases for HH:mm format
  it("should convert 24-hour time without seconds to 12-hour format", () => {
    expect(convertTo12HourFormat("13:30")).toBe("1:30PM")
    expect(convertTo12HourFormat("00:30")).toBe("12:30AM")
    expect(convertTo12HourFormat("12:00")).toBe("12:00PM")
    expect(convertTo12HourFormat("23:59")).toBe("11:59PM")
  })

  // Test cases for HHMM format
  it("should convert military time format to 12-hour format", () => {
    expect(convertTo12HourFormat("1330")).toBe("1:30PM")
    expect(convertTo12HourFormat("0030")).toBe("12:30AM")
    expect(convertTo12HourFormat("1200")).toBe("12:00PM")
    expect(convertTo12HourFormat("2359")).toBe("11:59PM")
  })

  // Test error handling
  it("should return original string for invalid time formats", () => {
    expect(() => convertTo12HourFormat("25:00:00")).toThrow(
      "Invalid hours: 25. Hours must be between 0 and 23.",
    )
    expect(() => convertTo12HourFormat("13:60:00")).toThrow(
      "Invalid minutes: 60. Minutes must be between 0 and 59.",
    )
    expect(() => convertTo12HourFormat("invalid")).toThrow("Invalid time format: invalid")
    expect(() => convertTo12HourFormat("")).toThrow("Invalid time format: ")
  })

  // Edge cases
  it("should handle edge cases correctly", () => {
    expect(convertTo12HourFormat("00:00:00")).toBe("12:00AM")
    expect(convertTo12HourFormat("12:00:00")).toBe("12:00PM")
    expect(convertTo12HourFormat("00:00")).toBe("12:00AM")
    expect(convertTo12HourFormat("12:00")).toBe("12:00PM")
    expect(convertTo12HourFormat("0000")).toBe("12:00AM")
    expect(convertTo12HourFormat("1200")).toBe("12:00PM")
  })

  it("should handle unexpected error cases", () => {
    const errorInput = { errorString: "this will fail" }
    expect(() => convertTo12HourFormat(errorInput as unknown as string)).toThrow(
      "militaryTime.match is not a function",
    )
  })

  it("should throw error for empty input", () => {
    expect(() => convertTo12HourFormat("")).toThrow(
      "Invalid time format: . Expected format: HH:mm or HHmm or HH:mm:ss",
    )
  })

  it("should throw error for invalid time format", () => {
    expect(() => convertTo12HourFormat("25:00")).toThrow(
      "Invalid hours: 25. Hours must be between 0 and 23.",
    )
    expect(() => convertTo12HourFormat("12:60")).toThrow(
      "Invalid minutes: 60. Minutes must be between 0 and 59.",
    )
    expect(() => convertTo12HourFormat("12:30:60")).toThrow(
      "Invalid seconds: 60. Seconds must be between 0 and 59.",
    )
    expect(() => convertTo12HourFormat("abc")).toThrow("Invalid time format: abc")
  })
})

describe("clampInterval", () => {
  it("should return the intersection of two intervals", () => {
    const interval1 = { start: new Date("2024-01-01"), end: new Date("2024-01-10") }
    const interval2 = { start: new Date("2024-01-05"), end: new Date("2024-01-15") }
    const result = clampInterval(interval1, interval2)

    expect(result.start).toEqual(new Date("2024-01-05"))
    expect(result.end).toEqual(new Date("2024-01-10"))
  })

  it("should handle intervals where one is completely contained within another", () => {
    const interval1 = { start: new Date("2024-01-01"), end: new Date("2024-01-15") }
    const interval2 = { start: new Date("2024-01-05"), end: new Date("2024-01-10") }
    const result = clampInterval(interval1, interval2)

    expect(result.start).toEqual(new Date("2024-01-05"))
    expect(result.end).toEqual(new Date("2024-01-10"))
  })
})

describe("formatFullDate", () => {
  it("should format a date string to full date format", () => {
    const date = new Date("2024-07-09")
    expect(formatFullDate(date)).toBe("Tuesday 9th July 2024")
  })

  it("should handle different date input formats", () => {
    expect(formatFullDate("2024-07-09")).toBe("Tuesday 9th July 2024")
    expect(formatFullDate("2024-12-25")).toBe("Wednesday 25th December 2024")
  })

  it("should return the original input for invalid dates", () => {
    expect(() => formatFullDate("not a date")).toThrow("Invalid time value")
  })

  it("should handle edge cases", () => {
    const today = new Date("2024-05-14")
    const formattedToday = formatFullDate(today)
    expect(formattedToday).toBe("Tuesday 14th May 2024")
  })

  it("should handle error cases in date formatting", () => {
    const errorDate = { toString: () => "error object" }
    expect(() => formatFullDate(errorDate as unknown as string)).toThrow("Invalid time value")
  })
})

describe("nzstParse", () => {
  it("should parse a date string in New Zealand Standard Time", () => {
    const result = nzstParse("2024-07-09", "yyyy-MM-dd", new Date(2024, 0, 1))
    const resultDate = new Date(result)

    expect(resultDate.getFullYear()).toBe(2024)
    expect(resultDate.getMonth()).toBe(6) // 0-indexed month
    expect(resultDate.getDate()).toBe(9)
  })

  it("should handle different parse options", () => {
    const result = nzstParse("09/07/2024", "dd/MM/yyyy", new Date(2024, 0, 1))
    const resultDate = new Date(result)

    expect(resultDate.getFullYear()).toBe(2024)
    expect(resultDate.getMonth()).toBe(6) // 0-indexed month
    expect(resultDate.getDate()).toBe(9)
  })

  it("should handle invalid date strings", () => {
    expect(() => nzstParse("invalid", "yyyy-MM-dd", new Date())).toThrow()
  })
})
