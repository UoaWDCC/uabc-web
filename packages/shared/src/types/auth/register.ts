import type z from "zod"
import type {
  AdditionalInfoFormSchema,
  BasicInfoForm1Schema,
  BasicInfoForm2Schema,
  RegisterFormDataSchema,
  UniversityInfoFormSchema,
} from "../../schemas"

export type RegisterFormData = z.infer<typeof RegisterFormDataSchema>
export type BasicInfoForm1Values = z.infer<typeof BasicInfoForm1Schema>
export type BasicInfoForm2Values = z.infer<typeof BasicInfoForm2Schema>
export type UniversityInfoFormValues = z.infer<typeof UniversityInfoFormSchema>
export type AdditionalInfoFormValues = z.infer<typeof AdditionalInfoFormSchema>
