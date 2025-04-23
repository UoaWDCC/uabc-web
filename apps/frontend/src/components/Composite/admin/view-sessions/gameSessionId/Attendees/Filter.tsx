"use client"

import { HStack, noop } from "@yamada-ui/react"
import { memo, useRef } from "react"
import type { RefObject } from "react"
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
        resetRef={resetRef}
        filterRef={filterRef}
        prevHasValueRef={prevHasValueRef}
        showResetRef={showResetRef}
      />
      <FilterResetButton showResetRef={showResetRef} resetRef={resetRef} />
    </HStack>
  )
})

Filter.displayName = "Filter"
