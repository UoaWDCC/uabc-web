import type {
  FieldAffectingData,
  FieldHookArgs,
  PayloadRequest,
  RequestContext,
  SanitizedCollectionConfig,
  SanitizedGlobalConfig,
} from "payload"
import { createTimeField } from "@/data-layer/fields/date-time"

describe("createTimeField", () => {
  it("should set date to 1970-01-01", () => {
    const field = createTimeField("test", "test")
    const testDate = new Date()

    if (!field.hooks?.beforeChange) {
      throw new Error("beforeChange hook in createTimeField is not defined")
    }

    const mockArgs: FieldHookArgs = {
      value: testDate,
      originalDoc: {},
      req: {} as PayloadRequest,
      data: {},
      siblingData: {},
      field: {} as FieldAffectingData,
      collection: {} as SanitizedCollectionConfig,
      context: {} as RequestContext,
      global: {} as SanitizedGlobalConfig,
      operation: "create",
      blockData: {},
      indexPath: [],
      path: [],
      schemaPath: [],
      siblingFields: [],
    }

    const processedField = field.hooks.beforeChange[0](mockArgs)

    expect(processedField.getFullYear()).toBe(1970)
    expect(processedField.getMonth()).toBe(0)
    expect(processedField.getUTCDate()).toBe(1)
    expect(processedField.getUTCHours()).toBe(testDate.getUTCHours())
    expect(processedField.getUTCMinutes()).toBe(testDate.getUTCMinutes())
  })

  it("should handle undefined value and return Invalid Date", () => {
    const field = createTimeField("test", "test")
    const beforeChange = field.hooks?.beforeChange?.[0]
    if (!beforeChange) throw new Error("beforeChange hook not defined")
    const mockArgs: Partial<FieldHookArgs> = { value: undefined }
    const result = beforeChange(mockArgs as FieldHookArgs)
    expect(result instanceof Date).toBe(true)
    expect(Number.isNaN(result.getTime())).toBe(true)
  })

  it("should handle null value and return 1970-01-01T00:00:00.000Z", () => {
    const field = createTimeField("test", "test")
    const beforeChange = field.hooks?.beforeChange?.[0]
    if (!beforeChange) throw new Error("beforeChange hook not defined")
    const mockArgs: Partial<FieldHookArgs> = { value: null }
    const result = beforeChange(mockArgs as FieldHookArgs)
    expect(result instanceof Date).toBe(true)
    expect(result.getFullYear()).toBe(1970)
    expect(result.getMonth()).toBe(0)
    expect(result.getUTCDate()).toBe(1)
    expect(result.getUTCHours()).toBe(0)
    expect(result.getUTCMinutes()).toBe(0)
  })

  it("should handle invalid date string and return Invalid Date", () => {
    const field = createTimeField("test", "test")
    const beforeChange = field.hooks?.beforeChange?.[0]
    if (!beforeChange) throw new Error("beforeChange hook not defined")
    const mockArgs: Partial<FieldHookArgs> = { value: "not-a-date" }
    const result = beforeChange(mockArgs as FieldHookArgs)
    expect(result instanceof Date).toBe(true)
    expect(Number.isNaN(result.getTime())).toBe(true)
  })

  it("should handle valid time string", () => {
    const field = createTimeField("test", "test")
    const beforeChange = field.hooks?.beforeChange?.[0]
    if (!beforeChange) throw new Error("beforeChange hook not defined")
    // Use a time string that is always the same in UTC
    const testTime = "1970-01-01T12:34:00.000Z"
    const mockArgs: Partial<FieldHookArgs> = { value: testTime }
    const processedField = beforeChange(mockArgs as FieldHookArgs)
    expect(processedField.getFullYear()).toBe(1970)
    expect(processedField.getMonth()).toBe(0)
    expect(processedField.getUTCDate()).toBe(1)
    expect(processedField.getUTCHours()).toBe(12)
    expect(processedField.getUTCMinutes()).toBe(34)
  })
})
