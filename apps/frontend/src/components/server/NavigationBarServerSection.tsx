import { getQueryClient } from "@repo/ui/components/Provider/getQueryClient"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import NavigationBarSection from "@/components/client/NavigationBarSection"
import { QueryKeys } from "@/services"
import { getNavigationBar } from "@/services/cms/navbar/NavigationBarService"

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

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NavigationBarSection />
    </HydrationBoundary>
  )
}
