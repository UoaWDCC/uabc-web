"use client"
import type { Faq } from "@repo/shared/payload-types"
import { useQuery } from "@tanstack/react-query"
import { QueryKeys } from "@/services"
import { getFaq } from "./FaqService"

/**
 * Custom hook to fetch {@link Faq} data and cache result using Tanstack Query
 *
 * @returns A query hook that fetches FAQ data
 */
export function useFaq() {
  return useQuery({
    queryKey: [QueryKeys.FAQ_QUERY_KEY],
    queryFn: async () => {
      const { data } = await getFaq()
      return data?.data ?? null
    },
  })
}
