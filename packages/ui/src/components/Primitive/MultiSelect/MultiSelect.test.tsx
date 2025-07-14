import { render, screen } from "@repo/ui/test-utils"
import { Option } from "@yamada-ui/react"
import { isValidElement } from "react"
import * as MultiSelectModule from "./index"
import { MultiSelect } from "./MultiSelect"

describe("<MultiSelect />", () => {
  it("should re-export the MultiSelect component and check if MultiSelect exists", () => {
    expect(MultiSelectModule.MultiSelect).toBeDefined()
    expect(isValidElement(<MultiSelectModule.MultiSelect label="Test label" />)).toBeTruthy()
  })

  it("renders with left icon", () => {
    render(<MultiSelect icon={<>I am icon</>} label="Test label" />)
    expect(screen.getByText("I am icon")).toBeInTheDocument()
  })

  it("renders with label", () => {
    render(<MultiSelect label="I am label" />)
    expect(screen.getByText("I am label")).toBeInTheDocument()
  })

  it("calls onChange when an option is selected by a user", async () => {
    const onChange = vi.fn()
    const { user } = render(
      <MultiSelect label="Test label" onChange={onChange}>
        <Option value="1">Option 1</Option>
        <Option value="2">Option 2</Option>
        <Option value="3">Option 3</Option>
      </MultiSelect>,
    )
    const multiSelectComponent = screen.getByRole("combobox")
    await user.click(multiSelectComponent)
    await user.click(screen.getByText("Option 1"))
    await user.click(screen.getByText("Option 2"))
    expect(onChange).toBeCalledWith(["1", "2"])
  })
})
