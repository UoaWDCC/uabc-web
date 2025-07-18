import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as AdminNotAvailableCardModule from "."
import { AdminNotAvailableCard } from "./AdminNotAvailableCard"

describe("<AdminNotAvailableCard />", () => {
  it("re-exports the component correctly. and checks it exists", () => {
    expect(AdminNotAvailableCardModule.AdminNotAvailableCard).toBeDefined()
    expect(isValidElement(<AdminNotAvailableCard />)).toBeTruthy()
  })

  it("renders the AdminNotAvailableCard component with correct content", () => {
    render(<AdminNotAvailableCard />)

    expect(screen.getByText("Admin View Not Available on Mobile")).toBeInTheDocument()
    expect(
      screen.getByText(
        "Currently Admin view and its features is only available on desktop screen sizes. Please switch to be able to use admin features.",
      ),
    ).toBeInTheDocument()
  })
})
