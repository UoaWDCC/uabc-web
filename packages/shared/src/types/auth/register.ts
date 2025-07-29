import type z from "zod"
import type {
  AdditionalInfoFormSchema,
  BasicInfoForm1Schema,
  BasicInfoForm2Schema,
  CasualInfoFormSchema,
  RegisterFormDataSchema,
  UniversityInfoFormSchema,
} from "../../schemas"

export type RegisterFormData = z.infer<typeof RegisterFormDataSchema>
export type BasicInfoForm1Values = z.infer<typeof BasicInfoForm1Schema>
export type BasicInfoForm2Values = z.infer<typeof BasicInfoForm2Schema>
export type UniversityInfoFormValues = z.infer<typeof UniversityInfoFormSchema>
export type AdditionalInfoFormValues = z.infer<typeof AdditionalInfoFormSchema>
export type CasualInfoFormValues = z.infer<typeof CasualInfoFormSchema>

export interface RegisterFlowState {
  step: number
  basicInfo1: BasicInfoForm1Values | null
  basicInfo2: BasicInfoForm2Values | null
  universityInfo: UniversityInfoFormValues | null
  additionalInfo: AdditionalInfoFormValues | null
  casualInfo: CasualInfoFormValues | null
}
