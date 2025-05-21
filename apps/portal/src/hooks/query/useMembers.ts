import { QUERY_KEY } from "@/lib/utils/queryKeys"
import type { MemberResponse } from "@repo/shared"
import { useQuery } from "@tanstack/react-query"

const fetchMembers = async (): Promise<MemberResponse[]> => {
  const response = await fetch("/api/users?member=true&verified=true", {
    cache: "no-store",
  })
  return response.json()
}

export const useMembers = () => {
  const query = useQuery({
    queryKey: [QUERY_KEY.MEMBERS],
    queryFn: fetchMembers,
  })

  return query
}
