"use client"

import { NotAuthorised, RegisterFlowSkeleton } from "@repo/ui/components/Generic"
import { OnboardingSection } from "@/components/client/user/OnboardingSection"
import { RoleGuard } from "@/context/RoleWrappers"

export const OnboardingClient = () => {
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
      {(auth) => <OnboardingSection auth={auth} />}
    </RoleGuard>
  )
}
