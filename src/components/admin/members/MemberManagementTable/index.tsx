'use client'

import { noop } from '@yamada-ui/react'
import { memo, useRef } from 'react'
import { Filter } from './Filter'
import { PagingTable } from './PagingTable'

export const Members = memo(() => {
  const filterRef = useRef<(value: string) => void>(noop)

  return (
    <>
      <Filter filterRef={filterRef} />
      <PagingTable filterRef={filterRef} />
    </>
  )
})

Members.displayName = 'Members'
