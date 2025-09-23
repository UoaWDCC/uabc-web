import { render, screen } from "@repo/ui/test-utils"
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
})
