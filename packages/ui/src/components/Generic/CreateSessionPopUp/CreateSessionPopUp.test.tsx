import { render, screen, waitFor } from "@repo/ui/test-utils"
import { isValidElement, useState } from "react"
import { Button } from "../../Primitive"
import { CreateSessionPopUp, type CreateSessionPopUpProps } from "./CreateSessionPopUp"
import * as CreateSessionPopUpModule from "./index"

const CreateSessionPopUpExample = (props: CreateSessionPopUpProps) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open pop up</Button>

      <CreateSessionPopUp onClose={() => setOpen(false)} open={open} {...props} />
    </>
  )
}

describe("<CreateSessionPopUp />", () => {
  it("should re-export the CreateSessionPopUp component and check if it exists", () => {
    expect(CreateSessionPopUpModule.CreateSessionPopUp).toBeDefined()
    expect(isValidElement(<CreateSessionPopUpModule.CreateSessionPopUp />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(CreateSessionPopUp.displayName).toBe("CreateSessionPopUp")
  })

  it("should render the dialog", async () => {
    const { user } = render(<CreateSessionPopUpExample />)
    await user.click(screen.getByText("Open pop up"))

    expect(screen.getByText("Create New Session")).toBeInTheDocument()
  })

  /**
   * TODO: remove .skip() once CreateSessionPopUp has been sufficiently improved
   */
  it.skip("should call onConfirm when a user clicks the submit button and there were no errors", async () => {
    const handleSubmit = vi.fn((data: CreateSessionPopUpModule.FormData) => data)

    const { user } = render(
      <CreateSessionPopUpExample
        casualCapacity={10}
        description="Tues HIWA Rec Centre"
        endTime={new Date()}
        inputPlaceholder="Enter Number"
        memberCapacity={10}
        onConfirm={handleSubmit}
        startTime={new Date()}
        title="Create New Session"
      />,
    )
    await user.click(screen.getByText("Open pop up"))
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument()
    })

    await user.click(screen.getByTestId("submit"))
    expect(handleSubmit).toBeCalled()
  })

  it("should close when the user clicks the close button", async () => {
    const { user } = render(<CreateSessionPopUpExample />)
    await user.click(screen.getByText("Open pop up"))

    await waitFor(() => {
      user.click(screen.getByTestId("back"))
      expect(screen.getByRole("dialog")).not.toBeVisible()
    })
  })
})
