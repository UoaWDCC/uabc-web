import { getOnboarding } from "@/services/cms/onboarding/OnboardingService"
import { OnboardingClient } from "../client/user/OnboardingClient"

/**
 * Server-side component to fetch and render the onboarding section.
 *
 * @returns An onboarding section component.
 */
export const OnboardingServerSection = async () => {
  const onboardingResponse = await getOnboarding()

  return <OnboardingClient onboardingGlobal={onboardingResponse.data} />
}
