import { HEADING_SIZE_MAP, HeadingTag, NodeType, TextFormat } from "./constants"

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

  describe("HEADING_SIZE_MAP", () => {
    it("has correct size mapping for all heading levels", () => {
      expect(HEADING_SIZE_MAP.h1).toBe("4xl")
      expect(HEADING_SIZE_MAP.h2).toBe("3xl")
      expect(HEADING_SIZE_MAP.h3).toBe("2xl")
      expect(HEADING_SIZE_MAP.h4).toBe("xl")
      expect(HEADING_SIZE_MAP.h5).toBe("lg")
      expect(HEADING_SIZE_MAP.h6).toBe("md")
    })

    it("covers all heading tags", () => {
      const headingTags = ["h1", "h2", "h3", "h4", "h5", "h6"] as const
      for (const tag of headingTags) {
        expect(HEADING_SIZE_MAP[tag]).toBeDefined()
        expect(typeof HEADING_SIZE_MAP[tag]).toBe("string")
      }
    })

    it("has decreasing sizes from h1 to h6", () => {
      const sizes = ["4xl", "3xl", "2xl", "xl", "lg", "md"]
      const actualSizes = [
        HEADING_SIZE_MAP.h1,
        HEADING_SIZE_MAP.h2,
        HEADING_SIZE_MAP.h3,
        HEADING_SIZE_MAP.h4,
        HEADING_SIZE_MAP.h5,
        HEADING_SIZE_MAP.h6,
      ]
      expect(actualSizes).toEqual(sizes)
    })
  })

  describe("HeadingTag", () => {
    it("has correct values for heading tags", () => {
      expect(HeadingTag.H1).toBe("h1")
      expect(HeadingTag.H2).toBe("h2")
      expect(HeadingTag.H3).toBe("h3")
      expect(HeadingTag.H4).toBe("h4")
      expect(HeadingTag.H5).toBe("h5")
      expect(HeadingTag.H6).toBe("h6")
    })

    it("contains all expected heading tags", () => {
      const headingTags = Object.values(HeadingTag)
      expect(headingTags).toContain("h1")
      expect(headingTags).toContain("h2")
      expect(headingTags).toContain("h3")
      expect(headingTags).toContain("h4")
      expect(headingTags).toContain("h5")
      expect(headingTags).toContain("h6")
      expect(headingTags).toHaveLength(6)
    })

    it("matches HEADING_SIZE_MAP keys", () => {
      const headingTagValues = Object.values(HeadingTag)
      const headingSizeMapKeys = Object.keys(HEADING_SIZE_MAP)

      expect(headingTagValues.sort()).toEqual(headingSizeMapKeys.sort())
    })
  })

  describe("Enum consistency", () => {
    it("TextFormat values are powers of 2 for bitwise operations", () => {
      expect(TextFormat.BOLD).toBe(1) // 2^0
      expect(TextFormat.ITALIC).toBe(2) // 2^1
      expect(TextFormat.STRIKETHROUGH).toBe(4) // 2^2
      expect(TextFormat.UNDERLINE).toBe(8) // 2^3
      expect(TextFormat.CODE).toBe(16) // 2^4
    })

    it("NodeType values are unique", () => {
      const nodeTypeValues = Object.values(NodeType)
      const uniqueValues = new Set(nodeTypeValues)
      expect(nodeTypeValues.length).toBe(uniqueValues.size)
    })

    it("HeadingTag values are unique", () => {
      const headingTagValues = Object.values(HeadingTag)
      const uniqueValues = new Set(headingTagValues)
      expect(headingTagValues.length).toBe(uniqueValues.size)
    })
  })
})
