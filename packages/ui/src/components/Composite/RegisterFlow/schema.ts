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

export const BasicInfoForm2Schema = z.object({
  /**
   * Phone number of the new user.
   */
  phoneNumber: z.string().regex(/[0-9]/), // TODO: improve this enforcement
})

export type BasicInfoForm1Values = z.infer<typeof BasicInfoForm1Schema>
export type BasicInfoForm2Values = z.infer<typeof BasicInfoForm2Schema>
