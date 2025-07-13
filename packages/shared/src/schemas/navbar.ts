import type { Navbar } from "@repo/shared/payload-types"
import { z } from "zod"
import { LinkSchema, MediaSchema } from "."

export const NavItemSchema = z.object({
  id: z.string().optional().nullable(),
  link: LinkSchema,
})

export const NavbarSchema = z.object({
  id: z.string(),
  logo: z.union([z.string(), MediaSchema]),
  navItems: z.array(NavItemSchema).max(5),
  rightSideSingleButton: LinkSchema,
  updatedAt: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
}) satisfies z.ZodType<Navbar>

export const GetNavbarResponseSchema = z.object({
  data: NavbarSchema,
})
