"use client"

import { HStack } from "@yamada-ui/react"
import { memo } from "react"
import { FilterActions } from "./FilterActions"
import { FilterInput } from "./FilterInput"
import { FilterResetButton } from "./FilterResetButton"

export const Filter = memo(() => {
  return (
    <HStack gap="md" justify="space-between" w="full">
      <HStack gap="sm">
        <FilterInput />
        <FilterResetButton />
      </HStack>
      <FilterActions />
    </HStack>
  )
})

Filter.displayName = "Filter"
