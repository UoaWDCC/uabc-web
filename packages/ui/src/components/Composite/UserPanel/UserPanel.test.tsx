import { render, screen } from "@repo/ui/test-utils"
import { UserPanel } from "./UserPanel"

const defaultProps = {
  name: "Stitch Pelekai",
  status: "Member" as const,
  email: "spel626@aucklanduni.ac.nz",
  phone: "021 234 5678",
  sessionsLeft: 7,
}

describe("UserPanel", () => {
  it("renders user information correctly", () => {
    render(<UserPanel {...defaultProps} />)

    expect(screen.getByText("Stitch Pelekai")).toBeInTheDocument()
    expect(screen.getByText("Member")).toBeInTheDocument()
    expect(screen.getByText("spel626@aucklanduni.ac.nz")).toBeInTheDocument()
    expect(screen.getByText("021 234 5678")).toBeInTheDocument()
    expect(screen.getByText("Sessions left: 7")).toBeInTheDocument()
  })
})
