import type {
  AdditionalInfoFormValues,
  BasicInfoForm1Values,
  BasicInfoForm2Values,
  CasualInfoFormValues,
  UniversityInfoFormValues,
} from "@repo/shared/types"
import { VStack } from "@yamada-ui/react"
import { memo } from "react"

export type State = {
  step: number
  basicInfo1: BasicInfoForm1Values | null
  basicInfo2: BasicInfoForm2Values | null
  universityInfo: UniversityInfoFormValues | null
  additionalInfo: AdditionalInfoFormValues | null
  casualInfoForm: CasualInfoFormValues | null
}

const _initialState = {
  step: 0,
  basicInfo1: null,
  basicInfo2: null,
  universityInfo: null,
  additionalInfo: null,
  casualInfoForm: null,
} satisfies State

export const RegisterFlow = memo(() => {
  return <VStack>peanuts</VStack>
})
