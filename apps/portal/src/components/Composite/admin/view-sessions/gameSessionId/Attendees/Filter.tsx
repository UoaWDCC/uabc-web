"use client"

import { HStack, noop } from "@yamada-ui/react"
import type { RefObject } from "react"
import { memo, useRef } from "react"
import { FilterInput } from "./FilterInput"
import { FilterResetButton } from "./FilterResetButton"

type FilterProps = {
  filterRef: RefObject<(value: string) => void>
  resetRef: RefObject<() => void>
}

export const Filter = memo(({ filterRef, resetRef }: FilterProps) => {
  const prevHasValueRef = useRef<boolean>(false)
  const showResetRef = useRef<() => void>(noop)

  return (
    <HStack gap="sm">
      <FilterInput
        filterRef={filterRef}
        prevHasValueRef={prevHasValueRef}
        resetRef={resetRef}
        showResetRef={showResetRef}
      />
      <FilterResetButton resetRef={resetRef} showResetRef={showResetRef} />
    </HStack>
  )
})

Filter.displayName = "Filter"
