import type { CreateGameSchedulePopUpFormValues } from "@repo/shared"
import { gameSessionScheduleMock } from "@repo/shared/mocks"
import { render, screen } from "@repo/ui/test-utils"
import { noop } from "@yamada-ui/react"
import { isValidElement, useState } from "react"
import { Button } from "../../Primitive"
import {
  CreateGameSchedulePopUp,
  type CreateGameSchedulePopUpProps,
} from "./CreateGameSchedulePopUp"
import * as CreateGameSchedulePopUpModule from "./index"

const CreateGameSchedulePopUpExample = (props: CreateGameSchedulePopUpProps) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open pop up</Button>
      <CreateGameSchedulePopUp onClose={() => setOpen(false)} open={open} {...props} />
    </>
  )
}

describe("<CreateGameSchedulePopUp />", () => {
  it("should re-export the CreateGameSchedulePopUp component and check if it exists", () => {
    expect(CreateGameSchedulePopUpModule.CreateGameSchedulePopUp).toBeDefined()
    expect(isValidElement(<CreateGameSchedulePopUpModule.CreateGameSchedulePopUp />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(CreateGameSchedulePopUp.displayName).toBe("CreateGameSchedulePopUp")
  })

  it("should render the dialog with default title", async () => {
    const { user } = render(<CreateGameSchedulePopUpExample />)
    await user.click(screen.getByText("Open pop up"))

    expect(screen.getByText("Create Game Schedule")).toBeInTheDocument()
  })

  it("should render the dialog with a custom title", async () => {
    const { user } = render(<CreateGameSchedulePopUpExample title="Edit Game Schedule" />)
    await user.click(screen.getByText("Open pop up"))

    expect(screen.getByText("Edit Game Schedule")).toBeInTheDocument()
  })

  it("should call onConfirm when submitted with valid data", async () => {
    const handleConfirm = vi.fn((data: CreateGameSchedulePopUpFormValues) => data)

    const { user } = render(
      <CreateGameSchedulePopUpExample
        onConfirm={handleConfirm}
        scheduleToEdit={gameSessionScheduleMock}
      />,
    )
    await user.click(screen.getByText("Open pop up"))

    await user.click(screen.getByTestId("submit"))
    expect(handleConfirm).toBeCalled()
  })

  it("should call onClose when the back button is clicked", async () => {
    const handleClose = vi.fn(noop)

    const { user } = render(<CreateGameSchedulePopUpExample onClose={handleClose} />)
    await user.click(screen.getByText("Open pop up"))

    await user.click(screen.getByTestId("back"))

    expect(handleClose).toBeCalled()
  })

  it("should not submit when required fields are empty", async () => {
    const handleConfirm = vi.fn((data: CreateGameSchedulePopUpFormValues) => data)

    const { user } = render(<CreateGameSchedulePopUpExample onConfirm={handleConfirm} />)
    await user.click(screen.getByText("Open pop up"))

    await user.click(screen.getByTestId("submit"))

    expect(handleConfirm).not.toBeCalled()
    expect(screen.getByText("Name is required")).toBeInTheDocument()
  })

  it("should pre-fill fields when scheduleToEdit is provided", async () => {
    const { user } = render(
      <CreateGameSchedulePopUpExample scheduleToEdit={gameSessionScheduleMock} />,
    )
    await user.click(screen.getByText("Open pop up"))

    expect(screen.getByTestId("name")).toHaveValue(gameSessionScheduleMock.name)
    expect(screen.getByTestId("location")).toHaveValue(gameSessionScheduleMock.location)
    expect(screen.getByTestId("capacity")).toHaveValue(gameSessionScheduleMock.capacity)
    expect(screen.getByTestId("casual-capacity")).toHaveValue(
      gameSessionScheduleMock.casualCapacity,
    )
    expect(screen.getByTestId("start-time")).toHaveValue("10:00")
    expect(screen.getByTestId("end-time")).toHaveValue("12:00")
  })

  it("should reset form when closed and reopened", async () => {
    const { user } = render(<CreateGameSchedulePopUpExample />)
    await user.click(screen.getByText("Open pop up"))

    await user.type(screen.getByTestId("name"), "Test Name")
    expect(screen.getByTestId("name")).toHaveValue("Test Name")

    await user.click(screen.getByTestId("back"))
    await user.click(screen.getByText("Open pop up"))

    expect(screen.getByTestId("name")).toHaveValue("")
  })
})
