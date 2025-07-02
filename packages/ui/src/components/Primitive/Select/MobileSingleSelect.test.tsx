import { render, screen } from "@repo/ui/test-utils"
import userEvent from "@testing-library/user-event"
import { Option } from "@yamada-ui/react"
import { isValidElement } from "react"
import * as MobileSingleSelectModule from "./index"
import { MobileSingleSelect } from "./MobileSingleSelect"

describe("<MobileSingleSelect />", () => {
  it("should re-export the Select component and check if Select exists", () => {
    expect(MobileSingleSelectModule.MobileSingleSelect).toBeDefined()
    expect(isValidElement(<MobileSingleSelectModule.MobileSingleSelect />)).toBeTruthy()
  })

  it("renders with left icon", () => {
    render(<MobileSingleSelect icon={<>I am icon</>} />)

    expect(screen.getByText("I am icon")).toBeInTheDocument()
  })

  it("renders with label", () => {
    render(<MobileSingleSelect label="I am label" />)

    expect(screen.getByText("I am label")).toBeInTheDocument()
  })

  it("call onChange when an option is selected by a user", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <MobileSingleSelect onChange={onChange}>
        <Option value="1">Option 1</Option>
        <Option value="2">Option 2</Option>
        <Option value="3">Option 3</Option>
      </MobileSingleSelect>,
    )

    const mobileSingleSelect = screen.getByRole("combobox")
    expect(mobileSingleSelect).toBeInTheDocument()

    await user.click(mobileSingleSelect)
    const optionToSelect = screen.getByText("Option 1")
    await user.click(optionToSelect)
    expect(onChange).toBeCalledWith("1")
  })
})
