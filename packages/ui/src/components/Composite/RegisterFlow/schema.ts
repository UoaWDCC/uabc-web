import { Gender, PlayLevel, University } from "@repo/shared"
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

export const UniversityInfoFormSchema = z
  .object({
    /**
     * University of the new user
     *
     * @see {@link University}
     */
    university: z.nativeEnum(University, {
      errorMap: () => ({
        message: "Please select a University",
      }),
    }),
    /**
     * Student ID of the new user. Only required if user is from the UoA.
     * @example 610855188
     *
     * @remarks The UoA defines a student ID as a string of numbers of length 7 or 9.
     */
    studentId: z.string().optional(),
    /**
     * UPI of the new user. Only required if user is from the UoA.
     * @example szha069
     */
    studentUpi: z.string().optional(),
  })
  .superRefine(({ university, studentId, studentUpi }, ctx) => {
    if (university === University.uoa) {
      if (!studentId) {
        ctx.addIssue({
          code: "custom",
          path: ["studentId"],
          message: "Field is required",
        })
      } else if ((studentId.length !== 9 && studentId.length !== 7) || !/^\d+$/.test(studentId)) {
        ctx.addIssue({
          code: "custom",
          path: ["studentId"],
          message: "Invalid student ID",
        })
      }

      if (!studentUpi) {
        ctx.addIssue({
          code: "custom",
          path: ["studentUpi"],
          message: "Field is required",
        })
      } else if (!/^[a-z]{4}[0-9]{3}$/.test(studentUpi)) {
        ctx.addIssue({
          code: "custom",
          path: ["studentUpi"],
          message: "Invalid UPI",
        })
      }
    }
  })

export const AdditionalInfoFormSchema = z.object({
  /**
   * Gender of the new user
   */
  gender: z.nativeEnum(Gender, {
    errorMap: () => ({
      message: "Please select a gender",
    }),
  }),
  /**
   * Skill level of the new user
   */
  skillLevel: z.nativeEnum(PlayLevel, {
    errorMap: () => ({
      message: "Please select a skill level",
    }),
  }),
  /**
   * Dietary requirements of the new user
   */
  dietaryRequirements: z.string(),
})

export type BasicInfoForm1Values = z.infer<typeof BasicInfoForm1Schema>
export type BasicInfoForm2Values = z.infer<typeof BasicInfoForm2Schema>
export type UniversityInfoFormValues = z.infer<typeof UniversityInfoFormSchema>
export type AdditionalInfoFormValues = z.infer<typeof AdditionalInfoFormSchema>
