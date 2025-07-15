import { Footer } from "@repo/ui/components/Generic"
import { getQueryClient } from "@repo/ui/components/Provider/getQueryClient"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { FooterSection } from "@/components/client/FooterSection"
import { QueryKeys } from "@/services"
import { getFooter } from "@/services/cms/footer/FooterService"
import { ErrorBoundary } from "../ErrorBoundary"

/**
 * Server-side component to fetch and render the footer section using Tanstack Query.
 *
 * @returns A hydrated footer section component.
 */
export const FooterServerSection = async () => {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.FOOTER_QUERY_KEY],
    queryFn: getFooter,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<Footer />}>
        <FooterSection />
      </ErrorBoundary>
    </HydrationBoundary>
  )
}
