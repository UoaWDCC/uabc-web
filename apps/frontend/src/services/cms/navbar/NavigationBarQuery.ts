import { useQuery } from "@tanstack/react-query"
import { QueryKeys } from "@/services"
import { getNavigationBar } from "./NavigationBarService"

export const useNavigationBar = () => {
  return useQuery({
    queryKey: [QueryKeys.NAVIGATION_BAR_QUERY_KEY],
    queryFn: async () => {
      const { data } = await getNavigationBar()
      return data?.data ?? null
    },
  })
}
