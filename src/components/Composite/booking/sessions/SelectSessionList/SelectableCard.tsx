import React from 'react'

import type { CartGameSession } from '@/types/game-session'
import { SelectSessionCard } from './SelectSessionCard'

interface SelectableCardProps {
  session: CartGameSession
  checked: boolean
  handleSessionClick: (id: number) => void
}

export const SelectableCard = ({ session, checked, handleSessionClick }: SelectableCardProps) => (
  <div
    data-testid="session-card"
    key={session.id}
    className={session.isFull ? 'pointer-events-none' : 'cursor-pointer hover:opacity-90'}
    onClick={() => !session.isFull && handleSessionClick(session.id)}
    role="checkbox"
    aria-checked={checked}
  >
    <SelectSessionCard
      day={session.weekday}
      startTime={session.startTime}
      endTime={session.endTime}
      location={session.locationName}
      status={session.isFull ? 'disabled' : checked ? 'selected' : 'default'}
    />
  </div>
)
