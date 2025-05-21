import type { PendingMember } from "@repo/shared"
import { useQuery } from "@tanstack/react-query"

import { QUERY_KEY } from "@/lib/utils/queryKeys"

const fetchPendingMembers = async (): Promise<PendingMember[]> => {
  const response = await fetch("/api/users?member=false", {
    cache: "no-store",
  })
  return response.json()
}

export const usePendingMembers = () => {
  const query = useQuery({
    queryKey: [QUERY_KEY.PENDING_MEMBERS],
    queryFn: fetchPendingMembers,
  })

  return query
}
