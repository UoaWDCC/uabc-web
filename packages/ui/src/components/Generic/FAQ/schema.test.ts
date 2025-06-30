import { createSimpleTextEditorState } from "@repo/ui/test-config/mocks/RichText.mock"
import { FAQItemSchema, FAQPropsSchema } from "./schema"

describe("FAQ Schema", () => {
  describe("FAQItemSchema", () => {
    it("validates a valid FAQ item with rich text answer", () => {
      const richTextAnswer = createSimpleTextEditorState("Rich text answer")
      const validItem = {
        question: "Test question",
        answer: richTextAnswer,
        disabled: false,
      }

      const result = FAQItemSchema.parse(validItem)
      expect(result).toEqual(validItem)
    })

    it("throws error for empty question", () => {
      const richTextAnswer = createSimpleTextEditorState("Test answer")
      const invalidItem = {
        question: "",
        answer: richTextAnswer,
      }

      expect(() => FAQItemSchema.parse(invalidItem)).toThrow("Question cannot be empty")
    })

    it("throws error for invalid answer format", () => {
      const invalidItem = {
        question: "Test question",
        answer: "plain string is not allowed",
      }

      expect(() => FAQItemSchema.parse(invalidItem)).toThrow()
    })
  })

  describe("FAQPropsSchema", () => {
    it("validates valid FAQ props", () => {
      const richTextAnswer = createSimpleTextEditorState("Test answer")
      const validProps = {
        title: "Test FAQ",
        items: [
          {
            question: "Test question",
            answer: richTextAnswer,
          },
        ],
        allowMultiple: true,
        allowToggle: false,
      }

      const result = FAQPropsSchema.parse(validProps)
      expect(result).toEqual(validProps)
    })

    it("validates with empty items array", () => {
      const validProps = {
        items: [],
      }

      const result = FAQPropsSchema.parse(validProps)
      expect(result).toEqual(validProps)
    })
  })
})
