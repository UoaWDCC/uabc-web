import { render, screen } from "@repo/ui/test-utils"
import { Button } from "@yamada-ui/react"
import { isValidElement, useState } from "react"
import * as ConfirmationPopUpModule from "."
import { ConfirmationPopUp, type ConfirmationPopUpProps } from "./ConfirmationPopUp"

const ConfirmationPopUpExample = (props: ConfirmationPopUpProps) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Confirmation PopUp</Button>

      <ConfirmationPopUp onClose={() => setOpen(false)} open={open} {...props} />
    </>
  )
}

const requiredProps = {
  title: "Test Title",
}

const customProps = {
  ...requiredProps,
  subtitle: "Test Subtitle",
  closeButton: false,
  confirmButton: {
    children: "Confirm!!",
  },
  cancelButton: {
    children: "Cancel!!",
  },
}

const customPropsWithOnClick = {
  ...requiredProps,
  confirmButton: {
    onClick: () => console.log("Primary button clicked!"),
  },
  cancelButton: {
    onClick: () => console.log("Secondary button clicked!"),
  },
}

describe("<ConfirmationPopUp />", () => {
  it("should re-export ConfirmationPopUp component and check it exists", () => {
    expect(ConfirmationPopUpModule.ConfirmationPopUp).toBeDefined()
    expect(isValidElement(<ConfirmationPopUpModule.ConfirmationPopUp title="" />)).toBeTruthy()
  })

  it("should render title, subtitle, and buttons", async () => {
    const { user } = render(<ConfirmationPopUpExample {...requiredProps} />)
    await user.click(screen.getByText("Open Confirmation PopUp"))

    expect(screen.getByText("Test Title")).toBeInTheDocument()
    expect(screen.getByText("Confirm")).toBeInTheDocument()

    expect(screen.getByLabelText("Close dialog")).toBeInTheDocument()
  })

  it("should not render close button when closeButton is false", async () => {
    const { user } = render(<ConfirmationPopUpExample {...requiredProps} closeButton={false} />)
    await user.click(screen.getByText("Open Confirmation PopUp"))

    expect(screen.queryByLabelText("Close dialog")).not.toBeInTheDocument()
  })

  it("should render correctly with custom props", async () => {
    const { user } = render(<ConfirmationPopUpExample {...customProps} />)
    await user.click(screen.getByText("Open Confirmation PopUp"))

    expect(screen.getByText("Test Title")).toBeInTheDocument()
    expect(screen.getByText("Test Subtitle")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Confirm!!" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Cancel!!" })).toBeInTheDocument()

    expect(screen.queryByLabelText("Close dialog")).not.toBeInTheDocument()
  })

  it("should handle different button click events", async () => {
    const spy = vi.spyOn(console, "log")

    const { user } = render(<ConfirmationPopUpExample {...customPropsWithOnClick} />)
    await user.click(screen.getByText("Open Confirmation PopUp"))

    const confirmButton = screen.getByRole("button", { name: "Confirm" })
    const cancelButton = screen.getByRole("button", { name: "Cancel" })

    await user.click(confirmButton)
    expect(spy).toHaveBeenCalledWith("Primary button clicked!")

    spy.mockClear()

    await user.click(cancelButton)
    expect(spy).toHaveBeenCalledWith("Secondary button clicked!")

    spy.mockRestore()
  })
})
