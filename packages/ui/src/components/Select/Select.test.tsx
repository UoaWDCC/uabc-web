import { render, screen } from "@/test-utils"
import { isValidElement } from "react"
import { Select } from "./Select"
import * as SelectModule from "./index"

describe("<Select />", () => {
  it("should re-export the Select component and check if Select exists", () => {
    expect(SelectModule.Select).toBeDefined()
    expect(isValidElement(<SelectModule.Select icon={undefined} label="" />)).toBeTruthy()
  })

  it("renders with left icon", () => {
    render(<Select icon={<>I am icon</>} label="Select" />)

    expect(screen.getByText("I am icon")).toBeInTheDocument()
  })

  it("renders with label", () => {
    render(<Select icon={undefined} label="I am label" />)

    expect(screen.getByText("I am label")).toBeInTheDocument()
  })
})
