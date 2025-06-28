import { NodeType, TextFormat } from "./constants"

describe("Constants", () => {
  describe("TextFormat", () => {
    it("has correct values for text formatting", () => {
      expect(TextFormat.BOLD).toBe(1)
      expect(TextFormat.ITALIC).toBe(2)
      expect(TextFormat.STRIKETHROUGH).toBe(4)
      expect(TextFormat.UNDERLINE).toBe(8)
      expect(TextFormat.CODE).toBe(16)
    })

    it("allows bitwise operations", () => {
      const boldItalic = TextFormat.BOLD | TextFormat.ITALIC
      expect(boldItalic).toBe(3)

      const allFormats =
        TextFormat.BOLD | TextFormat.ITALIC | TextFormat.STRIKETHROUGH | TextFormat.UNDERLINE
      expect(allFormats).toBe(15)
    })

    it("can check individual formats", () => {
      const format = TextFormat.BOLD | TextFormat.ITALIC

      expect(format & TextFormat.BOLD).toBeTruthy()
      expect(format & TextFormat.ITALIC).toBeTruthy()
      expect(format & TextFormat.STRIKETHROUGH).toBeFalsy()
      expect(format & TextFormat.UNDERLINE).toBeFalsy()
      expect(format & TextFormat.CODE).toBeFalsy()
    })
  })

  describe("NodeType", () => {
    it("has correct string values", () => {
      expect(NodeType.TEXT).toBe("text")
      expect(NodeType.HEADING).toBe("heading")
      expect(NodeType.PARAGRAPH).toBe("paragraph")
      expect(NodeType.LINK).toBe("link")
      expect(NodeType.UPLOAD).toBe("upload")
      expect(NodeType.QUOTE).toBe("quote")
      expect(NodeType.LIST).toBe("list")
      expect(NodeType.LIST_ITEM).toBe("listitem")
      expect(NodeType.LINE_BREAK).toBe("linebreak")
      expect(NodeType.HORIZONTAL_RULE).toBe("horizontalrule")
      expect(NodeType.CODE).toBe("code")
    })

    it("contains all expected node types", () => {
      const nodeTypes = Object.values(NodeType)
      expect(nodeTypes).toContain("text")
      expect(nodeTypes).toContain("heading")
      expect(nodeTypes).toContain("paragraph")
      expect(nodeTypes).toContain("link")
      expect(nodeTypes).toContain("upload")
      expect(nodeTypes).toContain("quote")
      expect(nodeTypes).toContain("list")
      expect(nodeTypes).toContain("listitem")
      expect(nodeTypes).toContain("linebreak")
      expect(nodeTypes).toContain("horizontalrule")
      expect(nodeTypes).toContain("code")
    })
  })

  describe("Enum consistency", () => {
    it("TextFormat values are powers of 2 for bitwise operations", () => {
      expect(TextFormat.BOLD).toBe(1)
      expect(TextFormat.ITALIC).toBe(2)
      expect(TextFormat.STRIKETHROUGH).toBe(4)
      expect(TextFormat.UNDERLINE).toBe(8)
      expect(TextFormat.CODE).toBe(16)
    })

    it("NodeType values are unique", () => {
      const nodeTypeValues = Object.values(NodeType)
      const uniqueValues = new Set(nodeTypeValues)
      expect(nodeTypeValues.length).toBe(uniqueValues.size)
    })
  })
})
