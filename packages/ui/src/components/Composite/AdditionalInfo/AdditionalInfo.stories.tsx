import { casualUserMock } from "@repo/shared/mocks"
import { AdditionalInfo, defaultFields } from "./AdditionalInfo"

export const defaultValues = {
  gender: casualUserMock.gender,
  playLevel: casualUserMock.playLevel,
  dietaryRequirements: casualUserMock.dietaryRequirements,
} as const

export default {
  component: AdditionalInfo,
  title: "Composite Components / AdditionalInfo",
}

export const Default = () => (
  <AdditionalInfo defaultValues={defaultValues} fields={defaultFields} title="Additional Info" />
)
