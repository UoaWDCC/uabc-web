import z from "zod"
import type { Onboarding } from "../../payload-types"
import { SerializedEditorStateSchema } from "../payload"

export const OnboardingGlobalSchema = z.object({
  casualMemberInformation: SerializedEditorStateSchema,
  updatedAt: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
}) satisfies z.ZodType<Omit<Onboarding, "id">>

export const GetOnboardingResponseSchema = z.object({
  data: OnboardingGlobalSchema,
})
