import { RegisterFlowStateSchema } from "@repo/shared/schemas"
import type {
  AdditionalInfoFormValues,
  BasicInfoForm1Values,
  BasicInfoForm2Values,
  CasualInfoFormValues,
  RegisterFlowState,
  UniversityInfoFormValues,
} from "@repo/shared/types"
import { useLocalStorage } from "@repo/ui/hooks"
import { VStack } from "@yamada-ui/react"
import { memo, useReducer } from "react"
import { AdditionalInfoForm } from "./AdditionalInfoForm"
import { BasicInfoForm1 } from "./BasicInfoForm1"
import { BasicInfoForm2 } from "./BasicInfoForm2"
import { CasualInfoForm } from "./CasualInfoForm"
import { RegisterSuccessPanel } from "./RegisterSuccessPanel"
import { UniversityInfoForm } from "./UniversityInfoForm"

const initialState = {
  step: 0,
  basicInfo1: null,
  basicInfo2: null,
  universityInfo: null,
  additionalInfo: null,
  casualInfo: null,
} satisfies RegisterFlowState

type RegisterFlowActionPayloads = {
  SET_BASIC_INFO_1: BasicInfoForm1Values
  SET_BASIC_INFO_2: BasicInfoForm2Values
  SET_UNIVERSITY_INFO: UniversityInfoFormValues
  SET_ADDITIONAL_INFO: AdditionalInfoFormValues
  SET_CASUAL_INFO: CasualInfoFormValues
}

type RegisterFlowAction =
  | { type: "NEXT" }
  | {
      [K in keyof RegisterFlowActionPayloads]: {
        type: K
        payload: RegisterFlowActionPayloads[K]
      }
    }[keyof RegisterFlowActionPayloads]

const reducer = (state: RegisterFlowState, action: RegisterFlowAction): RegisterFlowState => {
  switch (action.type) {
    case "NEXT":
      return {
        ...state,
        step: state.step + 1,
      }
    case "SET_BASIC_INFO_1":
      return {
        ...state,
        basicInfo1: action.payload,
      }
    case "SET_BASIC_INFO_2":
      return {
        ...state,
        basicInfo2: action.payload,
      }
    case "SET_UNIVERSITY_INFO":
      return {
        ...state,
        universityInfo: action.payload,
      }
    case "SET_ADDITIONAL_INFO":
      return {
        ...state,
        additionalInfo: action.payload,
      }
    case "SET_CASUAL_INFO":
      return {
        ...state,
        casualInfo: action.payload,
      }
    default:
      return state
  }
}

const LOCAL_STORAGE_KEY = "register-flow"

export const RegisterFlow = memo(() => {
  const { value: persistedState, setValue: setPersistedState } = useLocalStorage<RegisterFlowState>(
    LOCAL_STORAGE_KEY,
    RegisterFlowStateSchema,
  )

  const [state, dispatch] = useReducer(reducer, persistedState ?? initialState)

  const handleStepSubmit = <K extends keyof RegisterFlowActionPayloads>(type: K) => {
    return (payload: RegisterFlowActionPayloads[K]) => {
      const action = { type, payload } as RegisterFlowAction
      dispatch(action)

      const nextState = reducer(state, action)
      setPersistedState(nextState)
      dispatch({ type: "NEXT" })
    }
  }
  const steps = [
    <BasicInfoForm1
      defaultValues={state.basicInfo1 ?? undefined}
      key="basic-info-form-1"
      onSubmit={handleStepSubmit("SET_BASIC_INFO_1")}
    />,
    <BasicInfoForm2
      defaultValues={state.basicInfo2 ?? undefined}
      key="basic-info-form-2"
      onSubmit={handleStepSubmit("SET_BASIC_INFO_2")}
    />,
    <UniversityInfoForm
      defaultValues={state.universityInfo ?? undefined}
      key="university-info-form-1"
      onSubmit={handleStepSubmit("SET_UNIVERSITY_INFO")}
    />,
    <AdditionalInfoForm
      defaultValues={state.additionalInfo ?? undefined}
      key="basic-info-form-1"
      onSubmit={handleStepSubmit("SET_ADDITIONAL_INFO")}
    />,
    <CasualInfoForm
      defaultValues={state.casualInfo ?? undefined}
      key="basic-info-form-1"
      onSubmit={handleStepSubmit("SET_CASUAL_INFO")}
    />,
  ]
  return <VStack>{steps[state.step] ?? <RegisterSuccessPanel />}</VStack>
})
