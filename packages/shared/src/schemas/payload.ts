import { z } from "zod"
import { MediaSchema } from "./media"
import { LinkType, ListType, NodeType } from "./richtext"

export const DocumentWithSlugSchema = z.object({
  id: z.string(),
  slug: z.string(),
})

export const LinkDocumentSchema = z.object({
  value: DocumentWithSlugSchema,
})

export const LinkFieldsSchema = z
  .object({
    linkType: z.nativeEnum(LinkType).default(LinkType.CUSTOM),
    url: z.string().optional().nullable().default(null),
    doc: z.union([z.string(), LinkDocumentSchema, DocumentWithSlugSchema]).optional().nullable(),
    newTab: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.linkType === LinkType.INTERNAL) {
      if (!data.doc) {
        ctx.addIssue({
          code: "custom",
          path: ["doc"],
          message: "doc is required when linkType is internal",
        })
      }
    } else if (data.linkType === LinkType.CUSTOM) {
      if (!data.url) {
        ctx.addIssue({
          code: "custom",
          path: ["url"],
          message: "url is required when linkType is custom",
        })
      }
    }
  })

const baseNodeSchema = z.object({
  version: z.number(),
})

type SerializedLexicalNode = z.infer<typeof baseNodeSchema> & {
  type: string
  children?: SerializedLexicalNode[]
}

const recursiveChildrenSchema: z.ZodType<SerializedLexicalNode[]> = z.lazy(() =>
  z.array(lexicalNodeSchema),
)

export const SerializedTextNodeSchema = baseNodeSchema.extend({
  type: z.literal(NodeType.TEXT),
  text: z.string(),
  format: z.number().optional(),
})

export const SerializedHeadingNodeSchema = baseNodeSchema.extend({
  type: z.literal(NodeType.HEADING),
  tag: z.string(),
  children: recursiveChildrenSchema,
})

export const SerializedLinkNodeSchema = baseNodeSchema.extend({
  type: z.literal(NodeType.LINK),
  fields: LinkFieldsSchema,
  children: recursiveChildrenSchema,
})

export const SerializedUploadNodeSchema = baseNodeSchema.extend({
  type: z.literal(NodeType.UPLOAD),
  relationTo: z.string(),
  value: z.union([MediaSchema, z.string(), z.null()]),
})

export const SerializedParagraphNodeSchema = baseNodeSchema.extend({
  type: z.literal(NodeType.PARAGRAPH),
  children: recursiveChildrenSchema.optional(),
})

export const SerializedQuoteNodeSchema = baseNodeSchema.extend({
  type: z.literal(NodeType.QUOTE),
  children: recursiveChildrenSchema.optional(),
})

export const SerializedListNodeSchema = baseNodeSchema.extend({
  type: z.literal(NodeType.LIST),
  tag: z.nativeEnum(ListType),
  children: recursiveChildrenSchema.optional(),
})

export const SerializedListItemNodeSchema = baseNodeSchema.extend({
  type: z.literal(NodeType.LIST_ITEM),
  children: recursiveChildrenSchema.optional(),
})

export const SerializedLineBreakNodeSchema = baseNodeSchema.extend({
  type: z.literal(NodeType.LINE_BREAK),
})

export const SerializedHorizontalRuleNodeSchema = baseNodeSchema.extend({
  type: z.literal(NodeType.HORIZONTAL_RULE),
})

export const SerializedCodeNodeSchema = baseNodeSchema.extend({
  type: z.literal(NodeType.CODE),
  language: z.string().optional(),
  children: recursiveChildrenSchema.optional(),
})

export const SerializedNodeWithChildrenSchema = baseNodeSchema.extend({
  children: recursiveChildrenSchema,
  type: z.string(),
})

export const SerializedRelationshipNode = baseNodeSchema.extend({
  type: z.literal(NodeType.RELATIONSHIP),
  relationTo: z.string(),
  value: z.any().optional(),
})

export const lexicalNodeSchema: z.ZodType<SerializedLexicalNode> = z.union([
  SerializedTextNodeSchema,
  SerializedHeadingNodeSchema,
  SerializedLinkNodeSchema,
  SerializedUploadNodeSchema,
  SerializedParagraphNodeSchema,
  SerializedQuoteNodeSchema,
  SerializedListNodeSchema,
  SerializedListItemNodeSchema,
  SerializedLineBreakNodeSchema,
  SerializedHorizontalRuleNodeSchema,
  SerializedCodeNodeSchema,
  SerializedRelationshipNode,
  SerializedNodeWithChildrenSchema,
])

export const SerializedEditorStateSchema = z.object({
  root: z.object({
    children: z.array(lexicalNodeSchema),
    direction: z.enum(["ltr", "rtl"]).nullable(),
    format: z.enum(["left", "start", "center", "right", "end", "justify", ""]),
    indent: z.number(),
    type: z.string(),
    version: z.number(),
  }),
})
