import { isValidElement } from "react"
import { render, screen } from "@repo/ui/test-utils"
import { GameSessionCard } from "./GameSessionCard"

describe("<GameSessionCard />", () => {
  it("should be defined and have displayName", () => {
    expect(GameSessionCard).toBeDefined()
    expect(GameSessionCard.displayName).toBe("GameSessionCard")
  })

  it("renders labels and values", () => {
    expect(
      isValidElement(
        <GameSessionCard session={{ name: "Test", startTime: "7:00pm", endTime: "9:00pm", type: "Ongoing" }} />,
      ),
    ).toBeTruthy()

    render(<GameSessionCard session={{ name: "Test", startTime: "7:00pm", endTime: "9:00pm", type: "Ongoing" }} />)

    expect(screen.getByText("Session Name")).toBeInTheDocument()
    expect(screen.getByText("Time")).toBeInTheDocument()
    expect(screen.getByText("Session Type")).toBeInTheDocument()

    expect(screen.getByText("Test")).toBeInTheDocument()
    expect(screen.getByText("7:00pm - 9:00pm")).toBeInTheDocument()
    expect(screen.getByText("Ongoing")).toBeInTheDocument()
  })
})

