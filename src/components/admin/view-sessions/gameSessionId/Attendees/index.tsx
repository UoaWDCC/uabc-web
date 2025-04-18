'use client'

import { noop } from '@yamada-ui/react'
import { type FC, memo, useRef } from 'react'
import { Filter } from './Filter'
import { AttendeesTable } from './Table'

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
