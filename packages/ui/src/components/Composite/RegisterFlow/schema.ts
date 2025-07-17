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
   *
   * @remarks Current regex tests that it is a string with at least 1 number in it
   */
  phoneNumber: z.string().regex(/\d/, "Not a phone number"),
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
     * @remarks Current regex tests that it is a string of numbers at most 9 digits long.
     */
    studentId: z.string().optional(),
    /**
     * UPI of the new user. Only required if user is from the UoA.
     *
     * @remarks Current regex tests that it is of the form xxx111 or xxxx111
     * @example bond007
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
      } else if (studentId.length > 9 || !/^\d+$/.test(studentId)) {
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
      } else if (!/^[a-z]{3,4}[0-9]{3}$/.test(studentUpi)) {
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
