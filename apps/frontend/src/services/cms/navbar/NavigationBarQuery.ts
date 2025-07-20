import type { Navbar } from "@repo/shared/payload-types"
import { useSuspenseQuery } from "@tanstack/react-query"
import { QueryKeys } from "@/services"
import { getNavigationBar } from "./NavigationBarService"

/**
 * Custom hook to fetch {@link Navbar} data and cache result using Tanstack Query
 *
 * @returns A query hook that fetches Navigation Bar data
 */
export const useNavigationBar = () => {
  return useSuspenseQuery({
    queryKey: [QueryKeys.NAVIGATION_BAR_QUERY_KEY],
    queryFn: async () => {
      const data = await getNavigationBar()
      return data?.data ?? null
    },
  })
}
