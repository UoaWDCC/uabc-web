import { z } from "zod"
import type { Navbar } from "../../payload-types"
import { LinkArraySchema, LinkSchema } from "../link"
import { MediaSchema } from "../media"

export const NavItemSchema = z.object({
  id: z.string().optional().nullable(),
  link: LinkSchema,
})

export const NavbarSchema = z.object({
  id: z.string(),
  logo: z.union([z.string(), MediaSchema]),
  navItems: LinkArraySchema,
  rightSideSingleButton: LinkSchema,
  updatedAt: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
}) satisfies z.ZodType<Navbar>

export const GetNavbarResponseSchema = z.object({
  data: NavbarSchema,
})
