import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as SessionCountIconModule from "."
import { SessionCountIcon } from "./SessionCountIcon"

describe("<SessionCountIcon />", () => {
  it("should re-export the SessionCountIcon component and check if it exists", () => {
    expect(SessionCountIconModule.SessionCountIcon).toBeDefined()
    expect(isValidElement(<SessionCountIconModule.SessionCountIcon></SessionCountIconModule.SessionCountIcon>)).toBeTruthy()
  })

  it("should render the SessionCountIcon with the correct count", () => {
    render(<SessionCountIcon>5</SessionCountIcon>)
    expect(screen.getByText("5")).toBeInTheDocument()
  })

  it("should render the SessionCountIcon with the tickets icon", () => {
    render(<SessionCountIcon>10</SessionCountIcon>)
    expect(screen.getByTestId("session-count-tickets-icon")).toBeInTheDocument()
  })
})
