import z from "zod"

export const BasicInfoForm1Schema = z.object({
  /**
   * First name of the new user.
   */
  firstName: z.string().min(1, "Field is required"),
  /**
   * Last name of the new user.
   */
  lastName: z.string().min(1, "Field is required"),
})

export type BasicInfoForm1Values = z.infer<typeof BasicInfoForm1Schema>
