'use client'

import { assignRef, Input, Button, HStack, useBoolean } from '@yamada-ui/react'
import { memo, useState, useRef } from 'react'
import type { RefObject } from 'react'
import { XIcon } from '@yamada-ui/lucide'

type FilterProps = {
  filterRef: RefObject<(value: string) => void>
  resetRef: RefObject<() => void>
}

export const Filter = memo(({ filterRef, resetRef }: FilterProps) => {
  const [value, setValue] = useState<string>('')
  const [isShow, { off, on }] = useBoolean()
  const prevHasValueRef = useRef<boolean>(false)

  assignRef(resetRef, () => {
    setValue('')

    setTimeout(() => {
      filterRef.current('')
    })
  })

  return (
    <HStack gap="sm">
      <Input
        placeholder="Filter members..."
        value={value}
        onChange={(ev) => {
          setValue(ev.target.value)
          const hasValue = !!ev.target.value
          prevHasValueRef.current = hasValue
          if (hasValue) {
            on()
          } else {
            off()
          }

          setTimeout(() => {
            filterRef.current(ev.target.value)
          })
        }}
        w="300px"
      />
      {isShow && (
        <Button
          variant="ghost"
          rightIcon={<XIcon />}
          onClick={() => {
            resetRef.current()
            off()
          }}
        >
          Reset
        </Button>
      )}
    </HStack>
  )
})

Filter.displayName = 'Filter'
