import { render, screen } from "@/test-utils"
import { isValidElement } from "react"
import { Select } from "./Select"
import * as SelectModule from "./index"

describe("<Select />", () => {
  it("should re-export the Select component and check if Select exists", () => {
    expect(SelectModule.Select).toBeDefined()
    expect(isValidElement(<SelectModule.Select />)).toBeTruthy()
  })

  it("renders with left icon", () => {
    render(<Select icon={<>I am icon</>} />)

    expect(screen.getByText("I am icon")).toBeInTheDocument()
  })

  it("renders with label", () => {
    render(<Select label="I am label" />)

    expect(screen.getByText("I am label")).toBeInTheDocument()
  })

  it("should be disabled", () => {
    const { rerender } = render(<Select disabled label="Invalid Select" />)
    expect(screen.getByText("Invalid Select")).toBeDisabled()

    rerender(<Select disabled label="Invalid Select" />)

    expect(screen.getByText("Invalid Select")).toHaveAttribute("disabled")
  })
})
