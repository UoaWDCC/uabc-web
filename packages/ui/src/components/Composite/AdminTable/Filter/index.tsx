"use client"

import { HStack, VStack, Wrap } from "@yamada-ui/react"
import { memo } from "react"
import { FilterActions } from "./FilterActions"
import { FilterColumnVisibility } from "./FilterColumnVisibility"
import { FilterInput } from "./FilterInput"
import { FilterRoleSelect } from "./FilterRoleSelect"
import { FilterUniversitySelect } from "./FilterUniversitySelect"

export const Filter = memo(() => {
  return (
    <VStack gap="md" w="full">
      <HStack gap="md" w="full">
        <FilterColumnVisibility />
        <FilterActions />
      </HStack>
      <Wrap align="center" gap="md" w="full">
        <FilterInput />
        <FilterRoleSelect />
        <FilterUniversitySelect />
      </Wrap>
    </VStack>
  )
})

Filter.displayName = "Filter"
