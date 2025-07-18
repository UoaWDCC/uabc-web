import type z from "zod"
import type {
  AdditionalInfoFormSchema,
  BasicInfoForm1Schema,
  BasicInfoForm2Schema,
  RegisterPanelDetailsSchema,
  UniversityInfoFormSchema,
} from "../../schemas"

export type RegisterPanelDetails = z.infer<typeof RegisterPanelDetailsSchema>
export type BasicInfoForm1Values = z.infer<typeof BasicInfoForm1Schema>
export type BasicInfoForm2Values = z.infer<typeof BasicInfoForm2Schema>
export type UniversityInfoFormValues = z.infer<typeof UniversityInfoFormSchema>
export type AdditionalInfoFormValues = z.infer<typeof AdditionalInfoFormSchema>
