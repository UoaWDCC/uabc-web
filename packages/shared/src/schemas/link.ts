import type { Link } from "@repo/shared/payload-types"
import { z } from "zod"

export const LinkSchema = z.object({
  label: z.string(),
  url: z.string(),
}) satisfies z.ZodType<Link>
