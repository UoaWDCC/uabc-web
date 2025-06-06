import { render, screen } from "@/test-utils"
import { Option } from "@yamada-ui/react"
import { isValidElement } from "react"
import { MobileSingleSelect } from "./MobileSingleSelect"
import * as MobileSingleSelectModule from "./index"

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

  it("eats a peanut really yummily", () => {
    render(
      <MobileSingleSelect>
        <Option value="1">Option 1</Option>
        <Option value="2">Option 2</Option>
        <Option value="3">Option 3</Option>
      </MobileSingleSelect>,
    )

    const thing = screen.getByDisplayValue("MobileSingleSelect")
    expect(thing).toBeInTheDocument()
  })
})
