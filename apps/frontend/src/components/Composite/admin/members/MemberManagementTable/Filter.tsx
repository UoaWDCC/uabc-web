"use client"

import { HStack, noop } from "@yamada-ui/react"
import { memo, useRef } from "react"
import type { RefObject } from "react"
import { FilterInput } from "./FilterInput"
import { FilterResetButton } from "./FilterResetButton"

type FilterProps = {
  filterRef: RefObject<(value: string) => void>
}

export const Filter = memo(({ filterRef }: FilterProps) => {
  const hasFilterRef = useRef<(hasValue: boolean) => void>(noop)
  const resetFilterRef = useRef<() => void>(noop)

  return (
    <HStack gap="sm">
      <FilterInput passHasRef={hasFilterRef} passValueRef={filterRef} resetRef={resetFilterRef} />
      <FilterResetButton hasFilterRef={hasFilterRef} resetFilterRef={resetFilterRef} />
    </HStack>
  )
})

Filter.displayName = "Filter"
