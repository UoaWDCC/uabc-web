import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as NotFoundCardModule from "."
import { NotFoundCard } from "./NotFoundCard"

describe("<NotFoundCard />", () => {
  it("should re-export the NotFoundCard component, and check if it exists", () => {
    expect(NotFoundCardModule.NotFoundCard).toBeDefined()
    expect(isValidElement(<NotFoundCardModule.NotFoundCard />)).toBeTruthy()
  })

  it("should render the NotFoundCard component", () => {
    render(<NotFoundCard />)
    expect(screen.getByText("Page Not Found")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Error 404" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Return Home" })).toBeInTheDocument()
  })
})
