'use client'

import { type FC, memo, useRef } from 'react'
import { noop } from '@yamada-ui/react'
import { AttendeesTable } from './Table'
import { Filter } from './Filter'

interface AttendeesProps {
  gameSessionId: number
}

export const Attendees: FC<AttendeesProps> = memo(({ gameSessionId }) => {
  const filterRef = useRef<(value: string) => void>(noop)
  const resetFilterRef = useRef<() => void>(noop)

  return (
    <>
      <Filter filterRef={filterRef} resetRef={resetFilterRef} />
      <AttendeesTable filterRef={filterRef} gameSessionId={gameSessionId} />
    </>
  )
})

Attendees.displayName = 'Attendees'
