"use client"

import {
  type Gender,
  PlayLevel,
  type RegisterFlowState,
  RegisterFlowStateSchema,
  type University,
} from "@repo/shared"
import { RegisterFlow } from "@repo/ui/components/Generic"
import { useLocalStorage } from "@repo/ui/hooks"
import { Container } from "@yamada-ui/react"
import { useEffect } from "react"
import type { AuthContextValueWithUser } from "@/context/RoleWrappers"
import { useUpdateSelfMutation } from "@/services/auth/useUpdateSelfMutation"

export const OnboardingSection = ({ auth }: { auth: AuthContextValueWithUser }) => {
  const { user } = auth
  const LOCAL_STORAGE_KEY = "register-flow"
  const { setValue } = useLocalStorage<RegisterFlowState>(
    LOCAL_STORAGE_KEY,
    RegisterFlowStateSchema,
  )
  const updateSelfMutation = useUpdateSelfMutation()

  useEffect(() => {
    const initialState: RegisterFlowState = {
      step: 0,
      basicInfo1:
        user?.firstName || user?.lastName
          ? {
              firstName: user.firstName || "",
              lastName: user.lastName || "",
            }
          : null,
      basicInfo2: user?.phoneNumber
        ? {
            phoneNumber: user?.phoneNumber || "",
          }
        : null,
      universityInfo: user?.university
        ? {
            university: user.university as University,
            studentId: user?.studentId || "",
            studentUpi: user?.studentUpi || "",
          }
        : null,
      additionalInfo: user?.gender
        ? {
            gender: user?.gender as Gender,
            playLevel: (user?.playLevel as PlayLevel) || PlayLevel.beginner,
            dietaryRequirements: user?.dietaryRequirements || "",
          }
        : null,
      casualInfo: {
        agree: false,
      },
    }
    setValue(initialState)
  }, [setValue, user])

  const handleComplete = async (state: RegisterFlowState) => {
    const userData = {
      ...state.basicInfo1,
      ...state.basicInfo2,
      ...state.universityInfo,
      ...state.additionalInfo,
    }
    await updateSelfMutation.mutateAsync(userData)
  }

  return (
    <Container centerContent layerStyle="container">
      <RegisterFlow handleComplete={handleComplete} />
    </Container>
  )
}
