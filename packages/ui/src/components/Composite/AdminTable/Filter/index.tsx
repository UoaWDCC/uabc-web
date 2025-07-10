"use client"

import { HStack, Spacer } from "@yamada-ui/react"
import { memo } from "react"
import { FilterActions } from "./FilterActions"
import { FilterInput } from "./FilterInput"

export const Filter = memo(() => {
  return (
    <HStack gap="md" w="full">
      <FilterInput />
      <Spacer />
      <FilterActions />
    </HStack>
  )
})

Filter.displayName = "Filter"
