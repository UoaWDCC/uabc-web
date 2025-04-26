import { createTimeField } from "@/common/fields/date-time"
import type {
  FieldAffectingData,
  FieldHookArgs,
  PayloadRequest,
  SanitizedCollectionConfig,
  SanitizedGlobalConfig,
} from "payload"
import type { RequestContext } from "payload"

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
    expect(processedField.getDate()).toBe(1)
    expect(processedField.getHours()).toBe(testDate.getHours())
    expect(processedField.getMinutes()).toBe(testDate.getMinutes())
  })
})
