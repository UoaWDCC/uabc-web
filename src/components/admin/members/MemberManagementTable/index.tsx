'use client'

import { memo, useRef } from 'react'
import { noop } from '@yamada-ui/react'
import { MemberManagementTable } from './Table'
import { Filter } from './Filter'

export const Members = memo(() => {
  const filterRef = useRef<(value: string) => void>(noop)
  const resetFilterRef = useRef<() => void>(noop)

  return (
    <>
      <Filter filterRef={filterRef} resetRef={resetFilterRef} />
      <MemberManagementTable filterRef={filterRef} />
    </>
  )
})

Members.displayName = 'Members'
