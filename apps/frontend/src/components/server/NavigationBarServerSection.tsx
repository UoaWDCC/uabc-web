import { NavigationBar } from "@repo/ui/components/Generic"
import { getQueryClient } from "@repo/ui/components/Provider/getQueryClient"
import { NAVIGATION_BAR_NO_USER_TEST_CONSTANTS } from "@repo/ui/test-config/mocks/NavigationBar.mock"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import NavigationBarSection from "@/components/client/NavigationBarSection"
import { QueryKeys } from "@/services"
import { getNavigationBar } from "@/services/cms/navbar/NavigationBarService"
import { ErrorBoundary } from "../ErrorBoundary"

/**
 * Component to server-side fetch and render the navigation bar section using Tanstack Query.
 *
 * @returns Server-side component to fetch and render the navigation bar section using Tanstack Query.
 */
export const NavigationBarServerSection = async () => {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.NAVIGATION_BAR_QUERY_KEY],
    queryFn: getNavigationBar,
  })

  const fallbackNavbar = <NavigationBar {...NAVIGATION_BAR_NO_USER_TEST_CONSTANTS} />

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={fallbackNavbar}>
        <NavigationBarSection />
      </ErrorBoundary>
    </HydrationBoundary>
  )
}
