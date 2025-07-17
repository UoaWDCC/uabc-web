import { render, screen } from "@repo/ui/test-utils"
import { Option } from "@yamada-ui/react"
import { isValidElement } from "react"
import * as SelectModule from "./index"
import { Select } from "./Select"

describe("<Select />", () => {
  it("should re-export the Select component and check if Select exists", () => {
    expect(SelectModule.Select).toBeDefined()
    expect(isValidElement(<SelectModule.Select label="Test label" />)).toBeTruthy()
  })

  it("renders with left icon", () => {
    render(<Select icon={<>I am icon</>} label="Test label" />)
    expect(screen.getByText("I am icon")).toBeInTheDocument()
  })

  it("renders with label", () => {
    render(<Select label="I am label" />)
    expect(screen.getByText("I am label")).toBeInTheDocument()
  })

  it("calls onChange when an option is selected by a user", async () => {
    const onChange = vi.fn()
    const { user } = render(
      <Select label="Test label" onChange={onChange}>
        <Option value="1">Option 1</Option>
        <Option value="2">Option 2</Option>
        <Option value="3">Option 3</Option>
      </Select>,
    )
    const selectComponent = screen.getByRole("combobox")
    await user.click(selectComponent)
    const optionToSelect = screen.getByText("Option 1")
    await user.click(optionToSelect)
    expect(onChange).toBeCalledWith("1")
  })
})
