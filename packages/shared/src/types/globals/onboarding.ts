import type { GetOnboardingResponseSchema, OnboardingGlobalSchema } from "src/schemas"
import type { z } from "zod"

export type OnboardingGlobal = z.infer<typeof OnboardingGlobalSchema>
export type GetOnboardingResponse = z.infer<typeof GetOnboardingResponseSchema>
