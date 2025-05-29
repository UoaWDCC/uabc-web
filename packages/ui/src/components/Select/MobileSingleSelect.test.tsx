import { render, screen } from "@/test-utils"
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
})
