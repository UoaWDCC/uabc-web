import type { z } from "zod"
import type { GetOnboardingResponseSchema, OnboardingGlobalSchema } from "../../schemas/globals"

export type OnboardingGlobal = z.infer<typeof OnboardingGlobalSchema>
export type GetOnboardingResponse = z.infer<typeof GetOnboardingResponseSchema>
