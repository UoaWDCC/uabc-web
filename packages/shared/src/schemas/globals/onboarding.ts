import type { Onboarding } from "src/payload-types"
import z from "zod"
import { SerializedEditorStateSchema } from "../payload"

export const OnboardingGlobalSchema = z.object({
  casualMemberInformation: SerializedEditorStateSchema,
  updatedAt: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
}) satisfies z.ZodType<Omit<Onboarding, "id">>
