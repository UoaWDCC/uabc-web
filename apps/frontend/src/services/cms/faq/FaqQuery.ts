"use client"
import { useQuery } from "@tanstack/react-query"
import { getFaq } from "./FaqService"

export function useFaq() {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const { data } = await getFaq()
      return data?.data ?? null
    },
  })
}
