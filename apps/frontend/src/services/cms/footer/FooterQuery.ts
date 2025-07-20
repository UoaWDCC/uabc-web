import type { Footer } from "@repo/shared/payload-types"
import { useSuspenseQuery } from "@tanstack/react-query"
import { QueryKeys } from "@/services"
import { getFooter } from "./FooterService"

/**
 * Custom hook to fetch the {@link Footer} data using Tanstack Query.
 *
 * @returns The footer data from the global API endpoint.
 */
export const useFooter = () => {
  return useSuspenseQuery({
    queryKey: [QueryKeys.FOOTER_QUERY_KEY],
    queryFn: async () => {
      const data = await getFooter()
      return data?.data ?? null
    },
  })
}
