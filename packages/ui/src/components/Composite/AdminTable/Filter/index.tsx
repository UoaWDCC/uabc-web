"use client"

import { HStack, Spacer, VStack } from "@yamada-ui/react"
import { memo } from "react"
import { FilterActions } from "./FilterActions"
import { FilterColumnVisibility } from "./FilterColumnVisibility"
import { FilterInput } from "./FilterInput"
import { FilterRoleSelect } from "./FilterRoleSelect"
import { FilterUniversitySelect } from "./FilterUniversitySelect"

export const Filter = memo(() => {
  return (
    <VStack gap="md" w="full">
      {/* Main filter row */}
      <HStack gap="md" w="full">
        <FilterInput />
        <FilterRoleSelect />
        <FilterUniversitySelect />
        <Spacer />
        <FilterColumnVisibility />
        <FilterActions />
      </HStack>
    </VStack>
  )
})

Filter.displayName = "Filter"
