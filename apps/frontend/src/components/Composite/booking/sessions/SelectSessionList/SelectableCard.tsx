import React from "react"

import type { CartGameSession } from "@/types/game-session"
import { SelectSessionCard } from "./SelectSessionCard"

interface SelectableCardProps {
  session: CartGameSession
  checked: boolean
  handleSessionClick: (id: number) => void
}

export const SelectableCard = ({ session, checked, handleSessionClick }: SelectableCardProps) => (
  <label
    className={session.isFull ? "pointer-events-none" : "cursor-pointer hover:opacity-90"}
    data-testid="session-card"
  >
    <input
      checked={checked}
      className="hidden"
      disabled={session.isFull}
      onChange={() => handleSessionClick(session.id)}
      type="checkbox"
    />
    <SelectSessionCard
      day={session.weekday}
      endTime={session.endTime}
      location={session.locationName}
      startTime={session.startTime}
      status={session.isFull ? "disabled" : checked ? "selected" : "default"}
    />
  </label>
)
