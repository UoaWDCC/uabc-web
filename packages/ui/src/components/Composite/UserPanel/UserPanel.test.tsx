import { memberUserMock } from "@repo/shared/mocks"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import { UserPanel } from "./UserPanel"

describe("UserPanel", () => {
  it("should re-export the Select component and check if Select exists", () => {
    expect(UserPanel).toBeDefined()
    expect(isValidElement(<UserPanel user={memberUserMock} />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(UserPanel.displayName).toBe("UserPanel")
  })

  it("renders user information correctly", () => {
    render(<UserPanel user={memberUserMock} />)

    expect(
      screen.getByText(`${memberUserMock.firstName} ${memberUserMock.lastName}`),
    ).toBeInTheDocument()
    expect(screen.getByText(memberUserMock.role)).toBeInTheDocument()
    expect(screen.getByText(memberUserMock.email)).toBeInTheDocument()
    expect(screen.getByText(memberUserMock.phoneNumber ?? "N/A")).toBeInTheDocument()
    expect(
      screen.getByText(`Sessions left: ${memberUserMock.remainingSessions}`),
    ).toBeInTheDocument()
  })
})
