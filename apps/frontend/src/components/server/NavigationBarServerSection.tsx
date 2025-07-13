import { getQueryClient } from "@repo/ui/components/Provider/getQueryClient"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import NavigationBarSection from "@/components/client/NavigationBarSection"
import { QueryKeys } from "@/services"
import { getNavigationBar } from "@/services/cms/navbar/NavigationBarService"

export const NavigationBarServerSection = () => {
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    queryKey: [QueryKeys.NAVIGATION_BAR_QUERY_KEY],
    queryFn: getNavigationBar,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NavigationBarSection />
    </HydrationBoundary>
  )
}
