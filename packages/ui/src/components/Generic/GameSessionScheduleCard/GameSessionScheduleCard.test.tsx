import { gameSessionScheduleMock } from "@repo/shared/mocks"
import { capitalize, formatTime } from "@repo/shared/utils"
import { render, screen } from "@repo/ui/test-utils"
import { GameSessionScheduleCard } from "./GameSessionScheduleCard"

describe("<GameSessionScheduleCard />", () => {
  it("renders session name", () => {
    render(<GameSessionScheduleCard gameSessionSchedule={gameSessionScheduleMock} />)
    expect(screen.getByText(gameSessionScheduleMock.name)).toBeInTheDocument()
  })

  it("renders formatted time with capitalized day", () => {
    render(<GameSessionScheduleCard gameSessionSchedule={gameSessionScheduleMock} />)
    const expectedTime = `${capitalize(gameSessionScheduleMock.day)} ${formatTime(gameSessionScheduleMock.startTime)} - ${formatTime(gameSessionScheduleMock.endTime)}`
    expect(screen.getByText(expectedTime)).toBeInTheDocument()
  })

  it("renders location", () => {
    render(<GameSessionScheduleCard gameSessionSchedule={gameSessionScheduleMock} />)
    expect(screen.getByText(gameSessionScheduleMock.location)).toBeInTheDocument()
  })

  it("renders capacity and casual capacity", () => {
    render(<GameSessionScheduleCard gameSessionSchedule={gameSessionScheduleMock} />)
    expect(
      screen.getByText(
        `${gameSessionScheduleMock.capacity} / ${gameSessionScheduleMock.casualCapacity}`,
      ),
    ).toBeInTheDocument()
  })

  it("renders all field labels", () => {
    render(<GameSessionScheduleCard gameSessionSchedule={gameSessionScheduleMock} />)
    expect(screen.getByText("Session Name")).toBeInTheDocument()
    expect(screen.getByText("Time")).toBeInTheDocument()
    expect(screen.getByText("Location")).toBeInTheDocument()
    expect(screen.getByText("Capacities")).toBeInTheDocument()
  })
})
