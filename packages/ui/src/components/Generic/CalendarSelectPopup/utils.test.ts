import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { vi } from "vitest"
import {
  createCompositeProps,
  createPopupConfig,
  fromPopupValue,
  isStringArray,
  NavigationPatterns,
  toPopupValue,
} from "./utils"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)

const NZ_TIMEZONE = "Pacific/Auckland"

describe("CalendarSelectPopup utils", () => {
  describe("createPopupConfig", () => {
    it("should create a config with a baseId", () => {
      expect(createPopupConfig("test")).toEqual({
        popupId: "test",
        openValue: "open",
        dateParamKey: "test-date",
      })
    })

    it("should create a config with a baseId and suffix", () => {
      expect(createPopupConfig("test", "step1")).toEqual({
        popupId: "test-step1",
        openValue: "open",
        dateParamKey: "test-step1-date",
      })
    })
  })

  describe("createCompositeProps", () => {
    it("should merge base config with props", () => {
      const props = { title: "My Calendar" }
      expect(createCompositeProps("base", props)).toEqual({
        popupId: "base",
        openValue: "open",
        dateParamKey: "base-date",
        title: "My Calendar",
      })
    })

    it("should allow overriding popupId", () => {
      const props = { popupId: "custom", title: "My Calendar" }
      expect(createCompositeProps("base", props)).toEqual({
        popupId: "custom",
        openValue: "open",
        dateParamKey: "custom-date",
        title: "My Calendar",
      })
    })

    it("should use baseId when props.popupId is falsy", () => {
      const props = { popupId: "", title: "My Calendar" }
      expect(createCompositeProps("base", props)).toEqual({
        popupId: "base",
        openValue: "open",
        dateParamKey: "base-date",
        title: "My Calendar",
      })
    })

    it("should use default empty props when no props are provided", () => {
      expect(createCompositeProps("base")).toEqual({
        popupId: "base",
        openValue: "open",
        dateParamKey: "base-date",
      })
    })
  })

  describe("isStringArray", () => {
    it("should return true for string arrays", () => {
      expect(isStringArray(["a", "b"])).toBe(true)
    })
    it("should return false for non-string arrays", () => {
      expect(isStringArray([1, 2])).toBe(false)
      expect(isStringArray(["a", 1])).toBe(false)
      expect(isStringArray("a")).toBe(false)
      expect(isStringArray(null)).toBe(false)
    })
  })

  describe("toPopupValue", () => {
    it("should format a single date", () => {
      const date = dayjs.tz("2025-01-05", "YYYY-MM-DD", NZ_TIMEZONE).toDate()
      expect(toPopupValue(date, false)).toBe("2025-01-05")
    })

    it("should format a date range", () => {
      const startDate = dayjs.tz("2025-01-10", "YYYY-MM-DD", NZ_TIMEZONE).toDate()
      const endDate = dayjs.tz("2025-01-20", "YYYY-MM-DD", NZ_TIMEZONE).toDate()
      expect(toPopupValue([startDate, endDate], true)).toEqual(["2025-01-10", "2025-01-20"])
    })

    it("should handle partial date ranges", () => {
      const startDate = dayjs.tz("2025-01-10", "YYYY-MM-DD", NZ_TIMEZONE).toDate()
      expect(toPopupValue([startDate, undefined], true)).toEqual(["2025-01-10", ""])
      expect(toPopupValue([undefined, undefined], true)).toEqual(["", ""])
    })

    it("should return empty string for non-Date values in single mode", () => {
      expect(toPopupValue(null as unknown as Date, false)).toBe("")
      expect(toPopupValue(undefined as unknown as Date, false)).toBe("")
      expect(toPopupValue("not-a-date" as unknown as Date, false)).toBe("")
    })
  })

  describe("fromPopupValue", () => {
    const initialDate = dayjs.tz("2000-01-01", "YYYY-MM-DD", NZ_TIMEZONE).toDate()
    const initialRange: [Date?, Date?] = [initialDate, undefined]

    it("should parse a single date string", () => {
      const dateStr = "2025-01-05"
      const expectedDate = dayjs.tz(dateStr, "YYYY-MM-DD", NZ_TIMEZONE).toDate()
      expect(fromPopupValue(dateStr, false, initialDate)).toEqual(expectedDate)
    })

    it("should parse a date range string array", () => {
      const rangeStr = ["2025-01-10", "2025-01-20"]
      const expectedRange = [
        dayjs.tz(rangeStr[0], "YYYY-MM-DD", NZ_TIMEZONE).toDate(),
        dayjs.tz(rangeStr[1], "YYYY-MM-DD", NZ_TIMEZONE).toDate(),
      ]
      expect(fromPopupValue(rangeStr, true, initialRange)).toEqual(expectedRange)
    })

    it("should handle invalid single date string", () => {
      expect(fromPopupValue("invalid-date", false, initialDate)).toEqual(initialDate)
    })

    it("should handle invalid date range string array", () => {
      const expectedDate = dayjs.tz("2025-01-20", "YYYY-MM-DD", NZ_TIMEZONE).toDate()
      expect(fromPopupValue(["invalid-date", "2025-01-20"], true, initialRange)).toEqual([
        undefined,
        expectedDate,
      ])
    })

    it("should use initial value for undefined param", () => {
      expect(fromPopupValue(undefined, false, initialDate)).toEqual(initialDate)
      expect(fromPopupValue(undefined, true, initialRange)).toEqual(initialRange)
    })

    it("should handle single string param when isStringArray is false", () => {
      const expectedDate = dayjs.tz("2025-01-15", "YYYY-MM-DD", NZ_TIMEZONE).toDate()
      expect(fromPopupValue("2025-01-15", false, initialDate)).toEqual(expectedDate)
    })

    it("should handle string array param and use first element for single date", () => {
      const expectedDate = dayjs.tz("2025-01-15", "YYYY-MM-DD", NZ_TIMEZONE).toDate()
      expect(fromPopupValue(["2025-01-15", "2025-01-20"], false, initialDate)).toEqual(expectedDate)
    })

    it("should handle empty string for single date", () => {
      expect(fromPopupValue("", false, initialDate)).toEqual(initialDate)
    })

    it("should handle non-string and non-array param for single date", () => {
      expect(fromPopupValue(123 as unknown as string, false, initialDate)).toEqual(initialDate)
    })

    it("should handle successful schema parsing", () => {
      const validDate = "2025-01-15"
      const result = fromPopupValue(validDate, false, initialDate)
      const expectedDate = dayjs.tz(validDate, "YYYY-MM-DD", NZ_TIMEZONE).toDate()
      expect(result).toEqual(expectedDate)
    })

    it("should handle param that is neither string nor string array for range mode", () => {
      const result = fromPopupValue(123 as unknown as string, true, initialRange)
      expect(result).toEqual(initialRange)
    })

    it("should handle schema validation failure", () => {
      const invalidDate = "2025-13-45"
      const result = fromPopupValue(invalidDate, false, initialDate)
      expect(result).toEqual(initialDate)
    })

    it("should handle string param converted to array for range mode", () => {
      const singleStringParam = "2025-01-15"
      const result = fromPopupValue(singleStringParam, true, initialRange)
      const expectedDate = dayjs.tz(singleStringParam, "YYYY-MM-DD", NZ_TIMEZONE).toDate()
      expect(result).toEqual([expectedDate, undefined])
    })

    it("should handle range mode with mixed valid and invalid dates", () => {
      const result = fromPopupValue(["2025-01-15", "invalid-date"], true, initialRange)
      const expectedDate = dayjs.tz("2025-01-15", "YYYY-MM-DD", NZ_TIMEZONE).toDate()
      expect(result).toEqual([expectedDate, undefined])
    })

    it("should handle schema validation failure for range mode (line 131)", () => {
      const invalidRangeParam = ["valid-but-fails-schema", "also-invalid"]
      const result = fromPopupValue(invalidRangeParam, true, [undefined, undefined])
      expect(result).toEqual([undefined, undefined])
    })
  })

  describe("NavigationPatterns", () => {
    describe("sequential", () => {
      it("should navigate to next popup", () => {
        const mockNavigation = {
          switchPopup: vi.fn(),
        }

        NavigationPatterns.sequential.next("current", "next", mockNavigation)
        expect(mockNavigation.switchPopup).toHaveBeenCalledWith("current", "next")
      })

      it("should navigate to previous popup", () => {
        const mockNavigation = {
          switchPopup: vi.fn(),
        }

        NavigationPatterns.sequential.previous("current", "previous", mockNavigation)
        expect(mockNavigation.switchPopup).toHaveBeenCalledWith("current", "previous")
      })
    })

    describe("conditional", () => {
      it("should navigate to true target when condition is true", () => {
        const mockNavigation = {
          switchPopup: vi.fn(),
        }

        NavigationPatterns.conditional.navigate(
          "current",
          true,
          "trueTarget",
          "falseTarget",
          mockNavigation,
        )
        expect(mockNavigation.switchPopup).toHaveBeenCalledWith("current", "trueTarget")
      })

      it("should navigate to false target when condition is false", () => {
        const mockNavigation = {
          switchPopup: vi.fn(),
        }

        NavigationPatterns.conditional.navigate(
          "current",
          false,
          "trueTarget",
          "falseTarget",
          mockNavigation,
        )
        expect(mockNavigation.switchPopup).toHaveBeenCalledWith("current", "falseTarget")
      })
    })

    describe("form", () => {
      it("should navigate to next step when form is valid", () => {
        const mockNavigation = {
          switchPopup: vi.fn(),
        }
        const mockIsValid = vi.fn().mockReturnValue(true)

        const result = NavigationPatterns.form.nextStep(
          "current",
          "next",
          mockIsValid,
          mockNavigation,
        )
        expect(result).toBe(true)
        expect(mockNavigation.switchPopup).toHaveBeenCalledWith("current", "next")
      })

      it("should not navigate when form is invalid", () => {
        const mockNavigation = {
          switchPopup: vi.fn(),
        }
        const mockIsValid = vi.fn().mockReturnValue(false)

        const result = NavigationPatterns.form.nextStep(
          "current",
          "next",
          mockIsValid,
          mockNavigation,
        )
        expect(result).toBe(false)
        expect(mockNavigation.switchPopup).not.toHaveBeenCalled()
      })
    })
  })
})
