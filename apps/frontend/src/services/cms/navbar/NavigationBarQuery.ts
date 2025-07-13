import { useSuspenseQuery } from "@tanstack/react-query"
import { QueryKeys } from "@/services"
import { getNavigationBar } from "./NavigationBarService"

export const useNavigationBar = () => {
  return useSuspenseQuery({
    queryKey: [QueryKeys.NAVIGATION_BAR_QUERY_KEY],
    queryFn: getNavigationBar,
  })
}
