import z from "zod"

export const UIQuickBookFormSchema = z.object({
  locationAndTimeId: z.string().min(1, "Field is required"),
  skillLevel: z.string().min(1, "Field is required"),
})

export type UIQuickBookFormValues = z.infer<typeof UIQuickBookFormSchema>
