import { z } from "zod"
import type { CheckInRules, Disclaimer, SessionRules, TermsOfService } from "../../payload-types"
import { SerializedEditorStateSchema } from "../payload"

const CheckInRulesSchema = z.object({
  title: z.string(),
  rules: SerializedEditorStateSchema,
}) satisfies z.ZodType<CheckInRules>

const SessionRulesSchema = z.object({
  title: z.string(),
  rules: SerializedEditorStateSchema,
}) satisfies z.ZodType<SessionRules>

const DisclaimerSchema = z.object({
  title: z.string(),
  disclaimer: SerializedEditorStateSchema,
}) satisfies z.ZodType<Disclaimer>

export const TosSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  checkInRules: CheckInRulesSchema,
  sessionRules: SessionRulesSchema,
  disclaimer: DisclaimerSchema,
  updatedAt: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
}) satisfies z.ZodType<Omit<TermsOfService, "id">>

export const GetTosResponseSchema = z.object({
  data: TosSchema,
})
