"use client"
import type { Faq } from "@repo/shared/payload-types"
import { useQuery } from "@tanstack/react-query"
import { getFaq } from "./FaqService"

/**
 * Key for the FAQ query
 */
export const FAQ_QUERY_KEY = ["faqs"]

/**
 * Custom hook to fetch {@link Faq} data and cache result using Tanstack Query
 *
 * @returns A query hook that fetches FAQ data
 */
export function useFaq() {
  return useQuery({
    queryKey: FAQ_QUERY_KEY,
    queryFn: async () => {
      const { data } = await getFaq()
      return data?.data ?? null
    },
  })
}
