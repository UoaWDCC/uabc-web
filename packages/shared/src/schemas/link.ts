import type { Link, LinkGroup } from "@repo/shared/payload-types"
import { z } from "zod"

export const LinkSchema = z.object({
  label: z.string(),
  url: z.string(),
}) satisfies z.ZodType<Link>

export const LinkArraySchema = z.array(LinkSchema).max(5) satisfies z.ZodType<Link[]>

export const LinkGroupSchema = z.object({
  id: z.string().optional().nullable(),
  title: z.string(),
  links: LinkArraySchema,
}) satisfies z.ZodType<LinkGroup>
