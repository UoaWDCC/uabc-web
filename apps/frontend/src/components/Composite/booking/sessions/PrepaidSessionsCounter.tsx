import { CountIndicator } from "../../CountIndicator"

interface PrepaidSessionsCounterProps {
  prepaidSessions: number
}

export function PrepaidSessionsCounter({ prepaidSessions }: PrepaidSessionsCounterProps) {
  return (
    <div className="flex items-center">
      <div className="px-5 font-medium text-xs">
        Prepaid Sessions <br />
        Remaining
      </div>
      <CountIndicator>{prepaidSessions}</CountIndicator>
    </div>
  )
}
