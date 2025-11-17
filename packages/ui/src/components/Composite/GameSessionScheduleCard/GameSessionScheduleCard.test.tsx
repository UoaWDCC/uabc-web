import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import { GameSessionScheduleCard } from "./GameSessionScheduleCard"

describe("<GameSessionScheduleCard />", () => {
  it("should be defined and have displayName", () => {
    expect(GameSessionScheduleCard).toBeDefined()
    expect(GameSessionScheduleCard.displayName).toBe("GameSessionScheduleCard")
  })

  it("renders labels and values", () => {
    expect(
      isValidElement(
        <GameSessionScheduleCard
          gameSessionSchedule={{
            id: "test-id",
            name: "Test",
            location: "",
            semester: "",
            day: "monday" as any,
            startTime: "7:00pm",
            endTime: "9:00pm",
            capacity: 0,
            casualCapacity: 0,
            updatedAt: "",
            createdAt: "",
          }}
        />,
      ),
    ).toBe(true)

    render(
      <GameSessionScheduleCard
        gameSessionSchedule={{
          id: "test-id",
          name: "Test",
          location: "",
          semester: "",
          day: "monday" as any,
          startTime: "7:00pm",
          endTime: "9:00pm",
          capacity: 0,
          casualCapacity: 0,
          updatedAt: "",
          createdAt: "",
        }}
      />,
    )

    expect(screen.getByText("Session Name")).toBeInTheDocument()
    expect(screen.getByText("Time")).toBeInTheDocument()
    expect(screen.getByText("Session Type")).toBeInTheDocument()

    expect(screen.getByText("Test")).toBeInTheDocument()
    expect(screen.getByText("7:00pm - 9:00pm")).toBeInTheDocument()
    expect(screen.getByText("Ongoing")).toBeInTheDocument()
  })
})
