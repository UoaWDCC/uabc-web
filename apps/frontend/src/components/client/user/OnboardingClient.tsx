"use client"

import type { OnboardingGlobal } from "@repo/shared"
import { NotAuthorised, RegisterFlowSkeleton } from "@repo/ui/components/Generic"
import { OnboardingSection } from "@/components/client/user/OnboardingSection"
import { RoleGuard } from "@/context/RoleWrappers"

export const OnboardingClient = ({ onboardingGlobal }: { onboardingGlobal: OnboardingGlobal }) => {
  return (
    <RoleGuard
      fallback={
        <NotAuthorised
          as="section"
          description="Please login or register to complete the onboarding process"
          href="/auth/login"
          returnLabel="Login"
          title="You are not logged in"
        />
      }
      loading={<RegisterFlowSkeleton />}
    >
      {(auth) => <OnboardingSection auth={auth} onboardingGlobal={onboardingGlobal} />}
    </RoleGuard>
  )
}
