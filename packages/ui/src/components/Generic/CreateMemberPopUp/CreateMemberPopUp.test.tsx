import type { User } from "@repo/shared/payload-types"
import { type CreateMemberPopUpFormValues, MembershipType } from "@repo/shared/types"
import { render, screen, waitFor } from "@repo/ui/test-utils"
import { isValidElement, useState } from "react"
import { Button } from "../../Primitive"
import { CreateMemberPopUp, type CreateMemberPopUpProps } from "./CreateMemberPopUp"
import * as CreateMemberPopUpModule from "./index"

const CreateMemberPopUpExample = (props: CreateMemberPopUpProps) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open pop up</Button>

      <CreateMemberPopUp onClose={() => setOpen(false)} open={open} {...props} />
    </>
  )
}

describe("<CreateMemberPopUp />", () => {
  it("should re-export the CreateMemberPopUp component and check if it exists", () => {
    expect(CreateMemberPopUpModule.CreateMemberPopUp).toBeDefined()
    expect(isValidElement(<CreateMemberPopUpModule.CreateMemberPopUp />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(CreateMemberPopUp.displayName).toBe("CreateMemberPopUp")
  })

  it("should render the dialog", async () => {
    const { user } = render(<CreateMemberPopUpExample />)
    await user.click(screen.getByText("Open pop up"))

    expect(screen.getByText("Create New Member")).toBeInTheDocument()
  })

  it("should call onConfirm when a user clicks the submit button and there were no errors", async () => {
    const handleSubmit = vi.fn((data: CreateMemberPopUpFormValues) => data)

    const { user } = render(
      <CreateMemberPopUpExample
        onConfirm={handleSubmit}
        userToEdit={{
          id: "test-id",
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          role: MembershipType.member,
          phoneNumber: "0123456789",
          updatedAt: "",
          createdAt: "",
        }}
      />,
    )
    await user.click(screen.getByText("Open pop up"))

    await user.click(screen.getByTestId("submit"))
    expect(handleSubmit).toBeCalled()
  })

  it("should close when the user clicks the close button", async () => {
    const { user } = render(<CreateMemberPopUpExample />)
    await user.click(screen.getByText("Open pop up"))

    await user.click(screen.getByTestId("back"))
    await waitFor(() => {
      expect(screen.getByRole("dialog")).not.toBeVisible()
    })
  })

  it("should not submit when a user attempts to do so with errors in the input fields", async () => {
    const handleSubmit = vi.fn((data: CreateMemberPopUpFormValues) => data)

    const { user } = render(
      <CreateMemberPopUpExample
        onConfirm={handleSubmit}
        userToEdit={
          {
            id: "test-id",
            // no first name
            email: "test@example.com",
            role: MembershipType.member,
            phoneNumber: "0123456789",
            updatedAt: "",
            createdAt: "",
          } as User
        }
      />,
    )
    await user.click(screen.getByText("Open pop up"))

    await user.click(screen.getByTestId("submit"))
    expect(handleSubmit).not.toBeCalled()
    expect(screen.getByText("Field is required")).toBeInTheDocument()
  })
})
