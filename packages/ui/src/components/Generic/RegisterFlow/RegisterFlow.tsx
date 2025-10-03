"use client"

import type {
  AdditionalInfoFormValues,
  BasicInfoForm1Values,
  BasicInfoForm2Values,
  CasualInfoFormValues,
  OnboardingGlobal,
  RegisterFlowState,
  UniversityInfoFormValues,
} from "@repo/shared/types"
import { useRegisterFlowStorage } from "@repo/ui/hooks/storage/registerFlowStorage"
import { ArrowLeftIcon } from "@yamada-ui/lucide"
import { Center, Grid, GridItem, VStack } from "@yamada-ui/react"
import { memo, useReducer } from "react"
import { Heading, IconButton, LoadingStateBar } from "../../Primitive"
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
  | { type: "PREV" }
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
    case "PREV":
      return {
        ...state,
        step: state.step - 1,
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

/**
 * Props for the RegisterFlow component.
 */
interface RegisterFlowProps {
  /**
   * Callback function to handle the completion of the registration flow.
   */
  handleComplete?: (state: RegisterFlowState) => Promise<void>
  /**
   *
   */
  onboardingGlobal: OnboardingGlobal
}

/**
 * RegisterFlow component that manages the multi-step onboarding process.
 *
 * @param handleComplete Callback function to handle the completion of the registration flow.
 * @returns The RegisterFlow component with all steps and forms.
 */
export const RegisterFlow = memo(({ handleComplete, onboardingGlobal }: RegisterFlowProps) => {
  const { value: persistedState, setValue: setPersistedState } = useRegisterFlowStorage()

  const [state, dispatch] = useReducer(reducer, persistedState ?? initialState)

  const handleStepSubmit = <K extends keyof RegisterFlowActionPayloads>(type: K) => {
    return (payload: RegisterFlowActionPayloads[K]) => {
      const action = { type, payload } as RegisterFlowAction
      dispatch(action)

      const nextState = reducer(state, action)
      setPersistedState(nextState)
      if (state.step === steps.length - 1) {
        handleComplete?.(nextState)
      }
      dispatch({ type: "NEXT" })
    }
  }

  const handleGoBack = () => {
    dispatch({ type: "PREV" })
    const nextState = reducer(state, { type: "PREV" })
    setPersistedState(nextState)
  }

  const steps = [
    {
      title: "Basic Info",
      element: (
        <BasicInfoForm1
          defaultValues={state.basicInfo1 ?? undefined}
          key="basic-info-form-1"
          onSubmit={handleStepSubmit("SET_BASIC_INFO_1")}
        />
      ),
    },
    {
      title: "Basic Info",
      element: (
        <BasicInfoForm2
          defaultValues={state.basicInfo2 ?? undefined}
          key="basic-info-form-2"
          onSubmit={handleStepSubmit("SET_BASIC_INFO_2")}
        />
      ),
    },
    {
      title: "University Info",
      element: (
        <UniversityInfoForm
          defaultValues={state.universityInfo ?? undefined}
          key="university-info-form-1"
          onSubmit={handleStepSubmit("SET_UNIVERSITY_INFO")}
        />
      ),
    },
    {
      title: "Additional Info",
      element: (
        <AdditionalInfoForm
          defaultValues={state.additionalInfo ?? undefined}
          key="additional-info-form-1"
          onSubmit={handleStepSubmit("SET_ADDITIONAL_INFO")}
        />
      ),
    },
    {
      title: "Casual Member Info",
      element: (
        <CasualInfoForm
          defaultValues={state.casualInfo ?? undefined}
          key="casual-info-form-1"
          onboardingGlobal={onboardingGlobal}
          onSubmit={handleStepSubmit("SET_CASUAL_INFO")}
        />
      ),
    },
  ]

  const enableGoBack = state.step > 0 && state.step < steps.length

  return (
    <VStack
      bg="gray.900"
      layerStyle="gradientBorder"
      maxW="lg"
      minH="2xl"
      p="lg"
      rounded="3xl"
      w="full"
    >
      <Grid templateColumns="1fr auto 1fr">
        <GridItem>
          <IconButton
            aria-label="Go back"
            color={["black", "white"]}
            data-testid="go-back"
            disabled={!enableGoBack}
            icon={<ArrowLeftIcon fontSize="xl" />}
            onClick={handleGoBack}
            size="sm"
            variant="ghost"
          />
        </GridItem>

        <GridItem as={Center}>
          <Heading.h2>{steps[state.step]?.title}</Heading.h2>
        </GridItem>
      </Grid>
      <LoadingStateBar value={(state.step / steps.length) * 100} />
      {steps[state.step]?.element ?? <RegisterSuccessPanel />}
    </VStack>
  )
})

RegisterFlow.displayName = "RegisterFlow"
