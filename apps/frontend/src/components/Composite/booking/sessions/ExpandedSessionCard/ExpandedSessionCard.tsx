import type { CartGameSession } from "@/types/game-session"
import { LevelSelector } from "./LevelSelector"

interface ExpandedSessionCardProps {
  gameSession: CartGameSession
}

export const ExpandedSessionCard = ({ gameSession }: ExpandedSessionCardProps) => (
  <div className="rounded text-sm">
    <div className="rounded-t-md bg-primary px-6 py-4 drop-shadow-lg">
      <p className="font-medium text-lg text-primary-foreground">{gameSession.weekday}</p>
      <p className="font-medium text-primary-foreground/70">{gameSession.locationName}</p>
    </div>
    <div className="bg-secondary p-6">
      <p className="font-semibold text-tertiary">Address</p>
      <p className="text-tertiary/70">{gameSession.locationAddress}</p>
      <br />
      <p className="font-semibold text-tertiary">Time</p>
      <p className="text-tertiary/70 uppercase">
        {gameSession.startTime} - {gameSession.endTime}
      </p>
    </div>
    <LevelSelector id={gameSession.id} selectedLevel={gameSession.playLevel} />
  </div>
)
